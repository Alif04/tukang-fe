import {
  classifyIntent,
  detectRequestedFormat,
  isRevisionPrompt,
  parseAiReply,
  stripDokumenBlocksForHistory,
} from './aiReplyParser'
import {
  clearAllAiAssistantStorage,
  DEFAULT_AI_SETTINGS,
  getActiveUserStorageId,
  getSessionsStorageKey,
  getSettingsStorageKey,
  loadAiSettings,
  loadChatSessions,
  MAX_SAVED_SESSIONS,
  MAX_STORED_DOC_MARKDOWN_CHARS,
  purgeOtherUsersAiStorage,
  sanitizeLegacyAiLocalStorage,
  saveAiSettings,
  saveChatSessions,
  ChatSession,
} from './aiAssistantService'

class MemoryStorage implements Storage {
  private map = new Map<string, string>()
  public quotaLimitEntries: number | null = null

  get length(): number {
    return this.map.size
  }

  clear(): void {
    this.map.clear()
  }

  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null
  }

  key(index: number): string | null {
    return Array.from(this.map.keys())[index] ?? null
  }

  removeItem(key: string): void {
    this.map.delete(key)
  }

  setItem(key: string, value: string): void {
    if (this.quotaLimitEntries !== null && value.length > this.quotaLimitEntries) {
      const err: any = new Error('QuotaExceededError')
      err.name = 'QuotaExceededError'
      err.code = 22
      throw err
    }
    this.map.set(key, String(value))
  }
}

function setupMockWindowStorage(): MemoryStorage {
  const storage = new MemoryStorage()
  const proxy = new Proxy(storage, {
    ownKeys(target) {
      const keys: string[] = []
      for (let i = 0; i < target.length; i++) {
        const k = target.key(i)
        if (k) keys.push(k)
      }
      return keys
    },
    getOwnPropertyDescriptor(target, prop) {
      if (typeof prop === 'string' && target.getItem(prop) !== null) {
        return { enumerable: true, configurable: true, value: target.getItem(prop) }
      }
      return undefined
    },
  })
  ;(global as any).window = { localStorage: proxy }
  ;(global as any).localStorage = proxy
  return storage
}

describe('classifyIntent', () => {
  it('mengklasifikasikan smalltalk, query, dan report dengan akurat', () => {
    expect(classifyIntent('tes')).toBe('smalltalk')
    expect(classifyIntent('halo')).toBe('smalltalk')
    expect(classifyIntent('makasih bro')).toBe('smalltalk')
    expect(classifyIntent('rekap SP juni sampai oktober pdf')).toBe('report')
    expect(classifyIntent('buatkan laporan order bulan ini')).toBe('report')
    expect(classifyIntent('export data vendor ke excel')).toBe('report')
    expect(classifyIntent('kenapa SP vendor X naik?')).toBe('query')
    expect(classifyIntent('berapa jumlah vendor aktif saat ini?')).toBe('query')
    expect(isRevisionPrompt('tolong revisi bagian kesimpulan dokumen tadi')).toBe(true)
  })
})

describe('detectRequestedFormat', () => {
  it('mendeteksi format pdf, word, excel, atau null jika tidak disebut', () => {
    expect(detectRequestedFormat('Tolong buatkan laporan SP vendor dalam bentuk PDF')).toBe('pdf')
    expect(detectRequestedFormat('Saya ingin cetak laporan order bulan ini')).toBe('pdf')
    expect(detectRequestedFormat('Buatkan surat peringatan format word')).toBe('word')
    expect(detectRequestedFormat('Export ke docx sekarang')).toBe('word')
    expect(detectRequestedFormat('Tolong rekap data komplain ke excel')).toBe('excel')
    expect(detectRequestedFormat('Unduh sebagai spreadsheet xlsx')).toBe('excel')
    expect(detectRequestedFormat('Berapa jumlah SP aktif kuartal ini?')).toBeNull()
  })
})

describe('parseAiReply', () => {
  it('1. tanpa tag: mengembalikan seluruh teks sebagai chatText dan docs kosong', () => {
    const raw = 'Tercatat 5 SP aktif pada kuartal berjalan. Tidak ada vendor yang terkena SP3.'
    const res = parseAiReply(raw)
    expect(res.chatText).toBe(raw)
    expect(res.docs).toEqual([])
  })

  it('2. satu tag: memisahkan chatText dan satu dokumen dengan benar', () => {
    const raw = [
      'Berikut ringkasan evaluasi SP vendor bulan ini. File siap diunduh dari tombol di bawah.',
      '<dokumen format="pdf" judul="Laporan Evaluasi SP Vendor">',
      '# Laporan Evaluasi SP Vendor',
      '',
      '## Ringkasan',
      '- **3 Vendor** terkena SP1.',
      '</dokumen>',
    ].join('\n')

    const res = parseAiReply(raw)
    expect(res.chatText).toBe(
      'Berikut ringkasan evaluasi SP vendor bulan ini. File siap diunduh dari tombol di bawah.'
    )
    expect(res.docs).toHaveLength(1)
    expect(res.docs[0]).toEqual({
      format: 'pdf',
      title: 'Laporan Evaluasi SP Vendor',
      markdown: '# Laporan Evaluasi SP Vendor\n\n## Ringkasan\n- **3 Vendor** terkena SP1.',
    })
  })

  it('3. dua tag: mengekstrak dua dokumen sekaligus tanpa menyisakan isi dokumen di chatText', () => {
    const raw = [
      'Dokumen surat peringatan dan tabel rekapitulasi telah siap diunduh.',
      '<dokumen format="word" judul="Surat Peringatan Vendor">',
      '# Surat Peringatan Vendor',
      'Isi surat peringatan resmi.',
      '</dokumen>',
      '<dokumen format="excel" judul="Rekap Poin Vendor">',
      '## Rekap Poin',
      '| Vendor | Poin |',
      '| :--- | :--- |',
      '| PT Mitra Karya | 15 |',
      '</dokumen>',
    ].join('\n')

    const res = parseAiReply(raw)
    expect(res.chatText).toBe('Dokumen surat peringatan dan tabel rekapitulasi telah siap diunduh.')
    expect(res.docs).toHaveLength(2)
    expect(res.docs[0].format).toBe('word')
    expect(res.docs[0].title).toBe('Surat Peringatan Vendor')
    expect(res.docs[1].format).toBe('excel')
    expect(res.docs[1].title).toBe('Rekap Poin Vendor')
  })

  it('4. tag terpotong (belum ditutup sampai akhir string): tetap mengekstrak dokumen dengan aman', () => {
    const raw = [
      'Ringkasan komplain bulan berjalan telah disiapkan.',
      '<dokumen format="pdf" judul="Laporan Komplain Konsumen">',
      '# Laporan Komplain Konsumen',
      '## Rincian',
      '| Toko | Jumlah |',
      '| :--- | :--- |',
      '| Mitra10 Bintaro | 4 |',
    ].join('\n')

    const res = parseAiReply(raw)
    expect(res.chatText).toBe('Ringkasan komplain bulan berjalan telah disiapkan.')
    expect(res.docs).toHaveLength(1)
    expect(res.docs[0].format).toBe('pdf')
    expect(res.docs[0].title).toBe('Laporan Komplain Konsumen')
    expect(res.docs[0].markdown).toContain('| Mitra10 Bintaro | 4 |')
  })

  it('5. jika model mengeluarkan format berbeda dari yang terdeteksi, format yang terdeteksi menang', () => {
    const userPrompt = 'Buatkan laporan SP vendor dalam bentuk PDF'
    const detected = detectRequestedFormat(userPrompt)
    const raw = [
      'Laporan telah siap.',
      '<dokumen format="excel" judul="Laporan SP Vendor">',
      '# Laporan SP Vendor',
      '</dokumen>',
    ].join('\n')

    const res = parseAiReply(raw, detected)
    expect(res.docs[0].format).toBe('pdf')
  })

  it('stripDokumenBlocksForHistory mengganti blok dokumen dengan placeholder ringkas', () => {
    const raw = 'Ringkasan chat.\n<dokumen format="pdf" judul="Audit SP">Isi panjang</dokumen>'
    expect(stripDokumenBlocksForHistory(raw)).toBe(
      'Ringkasan chat.\n[Dokumen "Audit SP" (PDF) telah dibuat]'
    )
  })
})

describe('Bagian 1: Privasi & Keamanan Storage Frontend', () => {
  it('1.1 & 1.2 membersihkan kunci legacy tanpa user_id serta menghapus semua field apiKey dari settings', () => {
    const storage = setupMockWindowStorage()
    storage.setItem('user_id', '42')
    storage.setItem(
      'mitra10_ai_assistant_settings_v1',
      JSON.stringify({ deployApiKey: 'secret-old', engineMode: 'deepseek-deploy' })
    )
    storage.setItem(
      'mitra10_ai_assistant_sessions_v1',
      JSON.stringify([{ id: 'legacy-1', title: 'Sesi Lama', messages: [] }])
    )
    storage.setItem(
      getSettingsStorageKey('42')!,
      JSON.stringify({
        engineMode: '9router-gemini',
        activeSkillId: 'vendor_sp_and_performance',
        deployApiKey: 'leaked-deploy-key',
        nineRouterApiKey: 'leaked-9router-key',
        anthropicApiKey: 'leaked-claude-key',
        openRouterApiKey: 'leaked-or-key',
      })
    )

    sanitizeLegacyAiLocalStorage()
    expect(storage.getItem('mitra10_ai_assistant_settings_v1')).toBeNull()
    expect(storage.getItem('mitra10_ai_assistant_sessions_v1')).toBeNull()

    const loaded = loadAiSettings('42') as Record<string, any>
    expect(loaded.deployApiKey).toBeUndefined()
    expect(loaded.nineRouterApiKey).toBeUndefined()
    expect(loaded.anthropicApiKey).toBeUndefined()
    expect(loaded.openRouterApiKey).toBeUndefined()
    expect(loaded.activeSkillId).toBe('vendor_sp_and_performance')
  })

  it('1.2, 1.3 & 1b.5 menghapus kunci user lain saat login/startup dan membersihkan semua kunci saat logout/401', () => {
    const storage = setupMockWindowStorage()
    const sessUser10: ChatSession[] = [
      { id: 's-10', title: 'Laporan User 10', createdAt: '', updatedAt: '', messages: [] },
    ]
    const sessUser20: ChatSession[] = [
      { id: 's-20', title: 'Laporan User 20', createdAt: '', updatedAt: '', messages: [] },
    ]

    storage.setItem('user_id', '10')
    saveChatSessions(sessUser10, '10')
    expect(loadChatSessions('10')).toHaveLength(1)
    expect(loadChatSessions('10')[0].id).toBe('s-10')

    // Saat User 20 login di browser yang sama, kunci User 10 langsung terhapus otomatis
    storage.setItem('user_id', '20')
    purgeOtherUsersAiStorage('20')
    expect(storage.getItem('mitra10_ai_assistant_sessions_v1_10')).toBeNull()
    expect(storage.getItem('mitra10_ai_assistant_settings_v1_10')).toBeNull()

    saveChatSessions(sessUser20, '20')
    expect(loadChatSessions('20')).toHaveLength(1)
    expect(loadChatSessions('20')[0].id).toBe('s-20')

    clearAllAiAssistantStorage()
    expect(storage.getItem(getSessionsStorageKey('20')!)).toBeNull()
  })

  it('1b.4 tanpa userId: getActiveUserStorageId mengembalikan null dan TIDAK menyimpan ke localStorage', () => {
    const storage = setupMockWindowStorage()
    expect(getActiveUserStorageId()).toBeNull()
    expect(getSettingsStorageKey()).toBeNull()
    expect(getSessionsStorageKey()).toBeNull()

    saveAiSettings({ ...DEFAULT_AI_SETTINGS, temperature: 0.7 })
    saveChatSessions([
      { id: 'mem-only', title: 'Sesi Memori', createdAt: '', updatedAt: '', messages: [] },
    ])

    expect(storage.length).toBe(0)
    expect(loadChatSessions()).toEqual([])
  })

  it('1.4 & 1b.6 membatasi maksimal 30 sesi, memberi flag truncated: true untuk dokumen > 12.000 karakter, dan menangani QuotaExceededError', () => {
    const storage = setupMockWindowStorage()
    storage.setItem('user_id', '77')
    const longMd = 'A'.repeat(MAX_STORED_DOC_MARKDOWN_CHARS + 5000)

    const parsedLong = parseAiReply(
      `Ringkasan.\n<dokumen format="pdf" judul="Laporan Besar">${longMd}</dokumen>`
    )
    expect(parsedLong.docs[0].truncated).toBe(true)
    expect(parsedLong.docs[0].markdown.length).toBe(MAX_STORED_DOC_MARKDOWN_CHARS)

    const manySessions: ChatSession[] = Array.from({ length: 35 }, (_, i) => ({
      id: `sess-${i + 1}`,
      title: `Sesi ${i + 1}`,
      createdAt: '',
      updatedAt: '',
      messages: [
        {
          id: `m-${i + 1}`,
          role: 'assistant',
          content: 'Ringkasan',
          timestamp: '10:00',
          docs: [{ format: 'pdf', title: 'Doc', markdown: longMd }],
        },
      ],
    }))

    saveChatSessions(manySessions, '77')
    const saved = loadChatSessions('77')
    expect(saved).toHaveLength(MAX_SAVED_SESSIONS)
    expect(saved[0].id).toBe('sess-1')
    expect(saved[0].messages[0].docs?.[0].markdown.length).toBe(MAX_STORED_DOC_MARKDOWN_CHARS)
    expect(saved[0].messages[0].docs?.[0].truncated).toBe(true)

    // Simulasikan batas kuota ketat sehingga hanya muat 2 sesi
    storage.quotaLimitEntries = 800
    const threeSessions: ChatSession[] = [
      { id: 'newest', title: 'Baru', createdAt: '', updatedAt: '', messages: [{ id: '1', role: 'user', content: 'X'.repeat(200), timestamp: '' }] },
      { id: 'middle', title: 'Tengah', createdAt: '', updatedAt: '', messages: [{ id: '2', role: 'user', content: 'Y'.repeat(200), timestamp: '' }] },
      { id: 'oldest', title: 'Lama', createdAt: '', updatedAt: '', messages: [{ id: '3', role: 'user', content: 'Z'.repeat(500), timestamp: '' }] },
    ]
    saveChatSessions(threeSessions, '77')
    const afterQuota = loadChatSessions('77')
    expect(afterQuota.length).toBeLessThan(3)
    expect(afterQuota[0].id).toBe('newest')
    expect(afterQuota.find((s) => s.id === 'oldest')).toBeUndefined()
  })
})
