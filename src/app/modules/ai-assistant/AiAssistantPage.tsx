import React, { useState, useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { HeaderWrapper } from '../../../_metronic/layout/components/header/HeaderWrapper'
import {
  AiEngineMode,
  AiSettings,
  ChatMessage,
  ChatSession,
  loadAiSettings,
  loadAiReportCatalog,
  applyBackendReportCatalog,
  loadChatSessions,
  saveAiSettings,
  saveChatSessions,
  purgeOtherUsersAiStorage,
  sendAiReportMessage,
  AI_SKILLS,
  AiSkillId,
  AiReportCatalogPayload,
  cleanLatexAndMathFormatting,
  detectRequestedFormat,
  parseAiReply,
  ParsedAiDoc,
} from './aiAssistantService'
import {
  DocumentCanvasPreview,
  ActiveArtifact,
} from './DocumentCanvasPreview'
import {
  exportMarkdownToExcel,
  exportMarkdownToWordDoc,
  printOrSavePdf,
} from './documentExporter'
import './AiAssistantPage.css'

const aiBreadCrumbs: Array<PageLink> = [
  {
    title: 'Report',
    path: '/reports/view-report',
    isSeparator: false,
    isActive: false,
  },
]

const QUICK_PROMPTS = [
  {
    title: 'Rekapitulasi SP & Pelanggaran Vendor',
    desc: 'Tampilkan daftar vendor yang terkena SP1, SP2, dan SP3 aktif beserta total poin kuartal ini.',
    prompt:
      'Tolong buatkan laporan lengkap daftar vendor yang memiliki Surat Peringatan (SP1, SP2, SP3) aktif beserta total poin pelanggaran dan rekomendasi evaluasinya.',
  },
  {
    title: 'Ringkasan Order & Work Order',
    desc: 'Evaluasi total order, distribusi status pekerjaan, dan daftar transaksi terbaru.',
    prompt:
      'Buatkan ringkasan laporan Order dan Work Order saat ini, lengkap dengan tabel distribusi status order dan daftar transaksi terbaru.',
  },
  {
    title: 'Evaluasi Performa Vendor',
    desc: 'Analisis vendor aktif, jumlah pekerjaan yang ditangani, dan PIC masing-masing vendor.',
    prompt:
      'Tampilkan laporan performa vendor yang terdaftar di Mitra10 Tukang beserta status aktif dan jumlah pekerjaannya dalam bentuk tabel.',
  },
  {
    title: 'Laporan Pengaduan & Komplain',
    desc: 'Rangkum daftar komplain pelanggan berdasarkan cabang store, vendor, dan status penyelesaian.',
    prompt:
      'Tolong tampilkan rekapitulasi pengaduan atau komplain pelanggan beserta detail store, vendor terkait, dan status penanganannya.',
  },
  {
    title: 'Cabang Store & Instalasi Terlaris',
    desc: 'Lihat peringkat cabang toko dengan jumlah order instalasi tertinggi.',
    prompt:
      'Buatkan laporan cabang store Mitra10 dengan performa order jasa instalasi tertinggi beserta daftar cabang aktif.',
  },
  {
    title: 'Laporan Insentif Sales & Store',
    desc: 'Cek ringkasan data komisi sales dan insentif store manager yang tercatat di sistem.',
    prompt:
      'Bagaimana ringkasan laporan komisi insentif sales dan insentif store manager pada aplikasi saat ini?',
  },
]

function extractCsvFromMarkdown(md: string): string | null {
  const lines = md
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|') && l.endsWith('|'))

  if (lines.length < 2) return null

  const csvRows: string[] = []
  lines.forEach((line) => {
    const cells = line
      .slice(1, -1)
      .split('|')
      .map((c) => c.trim())
    // Skip markdown table alignment separator lines like | :--- | :---: |
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) return
    const escaped = cells.map((c) => `"${c.replace(/\*\*/g, '').replace(/"/g, '""')}"`)
    csvRows.push(escaped.join(','))
  })

  return csvRows.length > 1 ? csvRows.join('\n') : null
}

function renderInlineFormatting(text: string): React.ReactNode[] {
  const cleanedText = cleanLatexAndMathFormatting(text)
  const parts = cleanedText.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>
  })
}

function renderMarkdownBlocks(content: string): React.ReactNode {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let idx = 0

  while (idx < lines.length) {
    const line = lines[idx].trim()

    if (!line) {
      idx++
      continue
    }

    if (line === '---') {
      elements.push(<hr key={`hr-${idx}`} style={{ margin: '12px 0', borderColor: '#e5e7eb' }} />)
      idx++
      continue
    }

    if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines: string[] = []
      while (idx < lines.length && lines[idx].trim().startsWith('|') && lines[idx].trim().endsWith('|')) {
        tableLines.push(lines[idx].trim())
        idx++
      }

      const parsedRows = tableLines
        .map((tl) =>
          tl
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim())
        )
        .filter((cells) => !cells.every((c) => /^:?-{2,}:?$/.test(c)))

      if (parsedRows.length > 0) {
        const header = parsedRows[0]
        const body = parsedRows.slice(1)
        elements.push(
          <div className='owui-table-wrap' key={`tbl-${idx}`}>
            <table className='owui-md-table'>
              <thead>
                <tr>
                  {header.map((h, hIdx) => (
                    <th key={hIdx}>{renderInlineFormatting(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((r, rIdx) => (
                  <tr key={rIdx}>
                    {r.map((cell, cIdx) => (
                      <td key={cIdx}>{renderInlineFormatting(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      continue
    }

    if (line.startsWith('#### ')) {
      elements.push(<h4 key={`h4-${idx}`}>{renderInlineFormatting(line.slice(5))}</h4>)
      idx++
      continue
    }

    if (line.startsWith('### ')) {
      elements.push(<h3 key={`h3-${idx}`}>{renderInlineFormatting(line.slice(4))}</h3>)
      idx++
      continue
    }

    if (line.startsWith('## ')) {
      elements.push(<h3 key={`h2-${idx}`}>{renderInlineFormatting(line.slice(3))}</h3>)
      idx++
      continue
    }

    if (line.startsWith('# ')) {
      elements.push(<h2 key={`h1-${idx}`}>{renderInlineFormatting(line.slice(2))}</h2>)
      idx++
      continue
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = []
      while (
        idx < lines.length &&
        (lines[idx].trim().startsWith('- ') || lines[idx].trim().startsWith('* '))
      ) {
        listItems.push(lines[idx].trim().slice(2))
        idx++
      }
      elements.push(
        <ul key={`ul-${idx}`} style={{ paddingLeft: 18, margin: '6px 0 10px' }}>
          {listItems.map((li, liIdx) => (
            <li key={liIdx} style={{ marginBottom: 4 }}>
              {renderInlineFormatting(li)}
            </li>
          ))}
        </ul>
      )
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const orderedItems: string[] = []
      while (idx < lines.length && /^\d+\.\s+/.test(lines[idx].trim())) {
        orderedItems.push(lines[idx].trim().replace(/^\d+\.\s+/, ''))
        idx++
      }
      elements.push(
        <ol key={`ol-${idx}`} style={{ paddingLeft: 20, margin: '6px 0 10px' }}>
          {orderedItems.map((li, liIdx) => (
            <li key={liIdx} style={{ marginBottom: 4 }}>
              {renderInlineFormatting(li)}
            </li>
          ))}
        </ol>
      )
      continue
    }

    elements.push(<p key={`p-${idx}`}>{renderInlineFormatting(line)}</p>)
    idx++
  }

  return <div className='owui-md-content'>{elements}</div>
}

function docToActiveArtifact(
  doc: ParsedAiDoc,
  id: string,
  createdAt?: string
): ActiveArtifact {
  return {
    id,
    title: doc.title,
    format: doc.format,
    type: doc.format === 'excel' ? 'spreadsheet' : 'document',
    rawMarkdown: doc.markdown,
    createdAt,
    truncated: doc.truncated,
  }
}

const AiAssistantPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole') || ''
  const isAuthorized = userRole === 'Admin HO' || userRole === 'Super User'

  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [sessions, setSessions] = useState<ChatSession[]>(() => loadChatSessions())
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    const initial = loadChatSessions()
    return initial[0]?.id || null
  })
  const [inputPrompt, setInputPrompt] = useState('')
  const [sending, setSending] = useState(false)
  const [settings, setSettings] = useState<AiSettings>(() => loadAiSettings())
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [draftSettings, setDraftSettings] = useState<AiSettings>(() => loadAiSettings())
  const [backendCatalog, setBackendCatalog] = useState<AiReportCatalogPayload | null>(null)
  const [activeArtifact, setActiveArtifact] = useState<ActiveArtifact | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null
  const runtimeSkills = applyBackendReportCatalog(AI_SKILLS, backendCatalog)
  const effectiveSkill = runtimeSkills[settings.activeSkillId || 'auto'] || runtimeSkills['auto']

  useEffect(() => {
    purgeOtherUsersAiStorage()
    loadAiReportCatalog().then(setBackendCatalog)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeSession?.messages.length, sending])

  if (!isAuthorized) {
    return <Navigate to='/home' replace />
  }

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `chat-${Date.now()}`,
      title: 'Percakapan Laporan Baru',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    }
    const updated = [newSession, ...sessions]
    setSessions(updated)
    saveChatSessions(updated)
    setActiveSessionId(newSession.id)
    setActiveArtifact(null)
    setPreviewOpen(false)
    setInputPrompt('')
    if (settings.activeSkillId !== 'auto') {
      const resetSettings: AiSettings = { ...settings, activeSkillId: 'auto' }
      setSettings(resetSettings)
      setDraftSettings(resetSettings)
      saveAiSettings(resetSettings)
    }
  }

  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = sessions.filter((s) => s.id !== sessionId)
    setSessions(updated)
    saveChatSessions(updated)
    if (activeSessionId === sessionId) {
      setActiveSessionId(updated[0]?.id || null)
    }
  }

  const handleEngineChange = (mode: AiEngineMode) => {
    const next = { ...settings, engineMode: mode }
    setSettings(next)
    setDraftSettings(next)
    saveAiSettings(next)
  }

  const handleSendPrompt = async (customPrompt?: string) => {
    const text = (customPrompt ?? inputPrompt).trim()
    if (!text || sending) return

    let targetSession = activeSession
    let currentSessions = [...sessions]

    if (!targetSession) {
      targetSession = {
        id: `chat-${Date.now()}`,
        title: text.slice(0, 42),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      }
      currentSessions = [targetSession, ...currentSessions]
      setActiveSessionId(targetSession.id)
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }

    const updatedTitle =
      targetSession.messages.length === 0 ? text.slice(0, 44) : targetSession.title

    const sessionWithUser: ChatSession = {
      ...targetSession,
      title: updatedTitle,
      updatedAt: new Date().toISOString(),
      messages: [...targetSession.messages, userMsg],
    }

    const sessionsAfterUser = currentSessions.map((s) =>
      s.id === sessionWithUser.id ? sessionWithUser : s
    )
    setSessions(sessionsAfterUser)
    saveChatSessions(sessionsAfterUser)
    if (!customPrompt) setInputPrompt('')
    setSending(true)

    try {
      const reply = await sendAiReportMessage({
        sessionId: targetSession.id,
        history: targetSession.messages,
        userPrompt: text,
        settings,
      })

      const nowTime = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })

      const requestedFormat = detectRequestedFormat(text)
      const parsedReply = parseAiReply(reply.text, requestedFormat)

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: parsedReply.chatText,
        docs: parsedReply.docs,
        reasoningContent: reply.reasoningContent,
        usage: reply.usage,
        timestamp: nowTime,
        modelLabel: reply.modelLabel,
        dataUsed: reply.dataUsed,
      }

      const finalSession: ChatSession = {
        ...sessionWithUser,
        updatedAt: new Date().toISOString(),
        messages: [...sessionWithUser.messages, aiMsg],
      }

      const finalSessions = sessionsAfterUser.map((s) =>
        s.id === finalSession.id ? finalSession : s
      )
      setSessions(finalSessions)
      saveChatSessions(finalSessions)

      if (parsedReply.docs.length > 0) {
        const firstDoc = parsedReply.docs[0]
        setActiveArtifact({
          id: `art-${Date.now()}`,
          title: firstDoc.title,
          format: firstDoc.format,
          type: firstDoc.format === 'excel' ? 'spreadsheet' : 'document',
          rawMarkdown: firstDoc.markdown,
          createdAt: nowTime,
          truncated: firstDoc.truncated,
        })
        setPreviewOpen(true)
      }
    } catch (err: any) {
      const isTimeout =
        err?.code === 'ECONNABORTED' ||
        /timeout/i.test(err?.message || '') ||
        /exceeded/i.test(err?.message || '')
      const errorDetail = isTimeout
        ? 'Waktu proses komputasi melebihi batas (AI sedang memproses data/laporan dalam jumlah besar). Silakan coba ajukan pertanyaan kembali atau persempit periode/kriteria data.'
        : err?.message || 'Terjadi kesalahan koneksi'

      const errMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: `Gagal memproses permintaan ke API: ${errorDetail}. Anda juga dapat beralih ke mode **Claude 3.5 Sonnet (Free / Cloud)** atau **Mitra10 Live Report Engine** pada pilihan model di bagian atas.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        modelLabel: 'System Notice',
      }
      const errSession: ChatSession = {
        ...sessionWithUser,
        messages: [...sessionWithUser.messages, errMsg],
      }
      const nextSessions = sessionsAfterUser.map((s) =>
        s.id === errSession.id ? errSession : s
      )
      setSessions(nextSessions)
      saveChatSessions(nextSessions)
    } finally {
      setSending(false)
    }
  }

  const handleDownloadCsv = (markdownContent: string) => {
    const csv = extractCsvFromMarkdown(markdownContent)
    if (!csv) return
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Laporan_AI_Mitra10_${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCopyText = (content: string) => {
    navigator.clipboard?.writeText(content)
  }

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <HeaderWrapper className='bg-header-ho' />
      <PageTitle breadcrumbs={aiBreadCrumbs}>AI REPORT ASSISTANT</PageTitle>

      <div className={`owui-wrapper ${previewOpen && activeArtifact ? 'preview-active' : ''}`}>
        <aside className={`owui-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <div className='owui-sidebar-top'>
            <button type='button' className='owui-new-chat-btn' onClick={createNewSession}>
              <span>+ Percakapan Laporan Baru</span>
              <span style={{ fontSize: 11, opacity: 0.65 }}>Mitra10</span>
            </button>
            <input
              type='text'
              className='owui-search-input'
              placeholder='Cari riwayat laporan...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className='owui-session-list'>
            <div className='owui-session-label'>Riwayat Laporan ({filteredSessions.length})</div>
            {filteredSessions.length === 0 ? (
              <div style={{ padding: '14px 10px', fontSize: 12, color: '#71717a' }}>
                Belum ada riwayat percakapan.
              </div>
            ) : (
              filteredSessions.map((sess) => (
                <div
                  key={sess.id}
                  className={`owui-session-item ${sess.id === activeSessionId ? 'active' : ''}`}
                  onClick={() => setActiveSessionId(sess.id)}
                >
                  <span className='owui-session-title'>{sess.title}</span>
                  <button
                    type='button'
                    className='owui-session-del'
                    title='Hapus percakapan'
                    onClick={(e) => deleteSession(sess.id, e)}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <div className='owui-sidebar-footer'>
            <div className='owui-context-card'>
              <div className='owui-context-card-head'>
                <span>
                  <span className='owui-dot' />
                  Katalog Laporan Backend
                </span>
                <span>{userRole}</span>
              </div>
              <div>
                Relay: <strong>POST /reports/ai-chat</strong>
                <div style={{ marginTop: 3, fontSize: 10.5, opacity: 0.75 }}>
                  6 Skill Aktif · Filter Periode WIB
                </div>
              </div>
            </div>

            <button
              type='button'
              className='owui-settings-btn'
              onClick={() => {
                setDraftSettings(settings)
                setSettingsModalOpen(true)
              }}
            >
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <circle cx='12' cy='12' r='3' />
                <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' />
              </svg>
              <span>Pengaturan Model AI</span>
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className='owui-sidebar-backdrop'
            onClick={() => setSidebarOpen(false)}
            title='Tutup menu'
          />
        )}

        <section className={`owui-main ${previewOpen && activeArtifact ? 'has-canvas' : ''}`}>
          <header className='owui-topbar'>
            <div className='owui-topbar-left'>
              <button
                type='button'
                className='owui-icon-btn'
                title='Tampilkan/Sembunyikan Sidebar'
                onClick={() => setSidebarOpen((prev) => !prev)}
              >
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <line x1='3' y1='12' x2='21' y2='12' />
                  <line x1='3' y1='6' x2='21' y2='6' />
                  <line x1='3' y1='18' x2='21' y2='18' />
                </svg>
              </button>

              <div className='owui-auto-skill-pill' title='Skill otomatis mendeteksi kebutuhan laporan dari pertanyaan Anda'>
                <span className='owui-auto-skill-dot' />
                <span className='owui-auto-skill-text'>Auto Skill</span>
              </div>

              <div className='owui-model-group'>
                <select
                  className='owui-model-select engine-select'
                  value={settings.engineMode}
                  onChange={(e) => handleEngineChange(e.target.value as AiEngineMode)}
                  title='Pilih Engine AI'
                >
                  <option value='9router-gemini'>9Router (Gemini)</option>
                  <option value='deepseek-deploy'>DeepSeek-V4.1-Flash</option>
                  <option value='local-analyst'>Mitra10 Report Engine</option>
                  <option value='claude-free' disabled>
                    Claude 3.5 Sonnet (Belum dikonfigurasi)
                  </option>
                  <option value='claude-api' disabled>
                    Claude API / OpenRouter (Belum dikonfigurasi)
                  </option>
                </select>

                {settings.engineMode === '9router-gemini' && (
                  <select
                    className='owui-model-select submodel-select'
                    value={settings.nineRouterModel || 'ag/gemini-3-flash'}
                    onChange={(e) => {
                      const next = { ...settings, nineRouterModel: e.target.value }
                      setSettings(next)
                      setDraftSettings(next)
                      saveAiSettings(next)
                    }}
                    title='Pilih Model Gemini di 9Router'
                  >
                    <option value='ag/gemini-3-flash'>ag/gemini-3-flash (Cepat)</option>
                    <option value='ag/gemini-3.1-pro-high'>ag/gemini-3.1-pro (Penalaran)</option>
                    <option value='ag/gemini-3.1-pro-low'>ag/gemini-3.1-pro-low</option>
                    <option value='ai-combo'>ai-combo (Fallback)</option>
                    <option value='gc/gemini-2.5-pro'>gc/gemini-2.5-pro</option>
                    <option value='gc/gemini-2.5-flash'>gc/gemini-2.5-flash</option>
                    <option value='gemini/gemini-2.5-pro'>gemini/gemini-2.5-pro</option>
                    <option value='gemini/gemini-2.5-flash'>gemini/gemini-2.5-flash</option>
                  </select>
                )}
              </div>
            </div>

            <div className='owui-topbar-right'>
              {activeArtifact && (
                <button
                  type='button'
                  className={`owui-action-btn canvas-toggle ${previewOpen ? 'active' : ''}`}
                  onClick={() => setPreviewOpen((prev) => !prev)}
                  title={previewOpen ? 'Tutup Pratinjau Dokumen' : 'Buka Pratinjau Dokumen'}
                >
                  {previewOpen ? (
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2'>
                      <line x1='18' y1='6' x2='6' y2='18' />
                      <line x1='6' y1='6' x2='18' y2='18' />
                    </svg>
                  ) : (
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                      <rect x='2' y='3' width='20' height='18' rx='2' />
                      <line x1='15' y1='3' x2='15' y2='21' />
                    </svg>
                  )}
                  <span className='owui-btn-text full'>{previewOpen ? 'Tutup Preview' : 'Preview'}</span>
                  <span className='owui-btn-text short'>{previewOpen ? 'Tutup' : 'Preview'}</span>
                </button>
              )}
              <button
                type='button'
                className='owui-action-btn primary'
                onClick={createNewSession}
                title='Mulai percakapan laporan baru'
              >
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <line x1='12' y1='5' x2='12' y2='19' />
                  <line x1='5' y1='12' x2='19' y2='12' />
                </svg>
                <span className='owui-btn-text full'>Chat Baru</span>
                <span className='owui-btn-text short'>Baru</span>
              </button>
            </div>
          </header>

          <div className='owui-chat-scroll'>
            {!activeSession || activeSession.messages.length === 0 ? (
              <div className='owui-welcome'>
                <div className='owui-welcome-badge'>
                  <span>Mitra10 AI Assistant · Auto-Detect Skill</span>
                </div>
                <h2>Halo, {userRole}. Asisten AI siap menganalisis seluruh laporan operasional Mitra10 Tukang.</h2>
                <p>
                  Sistem otomatis mendeteksi kebutuhan laporan melalui 6 skill terstruktur di backend: Order & Omzet, Quotation & Invoice, Work Order & Jadwal, Evaluasi SP Vendor, Komplain & Refund, serta Komisi & Insentif.
                </p>

                <div className='owui-prompt-grid'>
                  {effectiveSkill.samplePrompts.map((item, idx) => (
                    <div
                      key={idx}
                      className='owui-prompt-card'
                      onClick={() => handleSendPrompt(item.prompt)}
                    >
                      <div className='owui-prompt-title'>{item.title}</div>
                      <div className='owui-prompt-desc'>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              activeSession.messages.map((msg) => {
                const resolvedChannel =
                  msg.role === 'assistant'
                    ? msg.docs !== undefined
                      ? { chatText: msg.content, docs: msg.docs }
                      : parseAiReply(msg.content)
                    : { chatText: msg.content, docs: [] }

                return (
                  <div key={msg.id} className={`owui-msg-row ${msg.role}`}>
                    {msg.role === 'assistant' && <div className='owui-avatar ai'>AI</div>}

                    <div className='owui-msg-bubble'>
                      {msg.role === 'assistant' && msg.reasoningContent && (
                        <details className='owui-reasoning-box'>
                          <summary>Proses Penalaran</summary>
                          <div className='owui-reasoning-body'>{msg.reasoningContent}</div>
                        </details>
                      )}

                      {msg.role === 'assistant' ? (
                        <>
                          {renderMarkdownBlocks(resolvedChannel.chatText)}
                          {resolvedChannel.docs.map((doc, docIdx) => {
                            const isExcel = doc.format === 'excel'
                            const isPdf = doc.format === 'pdf'
                            const artId = `art-${msg.id}-${docIdx}`
                            const subtitle = isExcel
                              ? 'Spreadsheet Excel (.xlsx) · Klik untuk melihat pratinjau'
                              : isPdf
                              ? 'Dokumen PDF Resmi (.pdf) · Klik untuk melihat pratinjau'
                              : 'Dokumen Word Resmi (.doc) · Klik untuk melihat pratinjau'

                            return (
                              <div key={artId} className='owui-artifact-card'>
                                <div
                                  className='owui-artifact-card-left'
                                  onClick={() => {
                                    setActiveArtifact(docToActiveArtifact(doc, artId, msg.timestamp))
                                    setPreviewOpen(true)
                                  }}
                                  title='Buka pratinjau dokumen di panel samping'
                                >
                                  <div className={`owui-artifact-icon-box ${isExcel ? 'xlsx' : 'doc'}`}>
                                    {isExcel ? (
                                      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                        <rect x='3' y='3' width='18' height='18' rx='2' />
                                        <line x1='3' y1='9' x2='21' y2='9' />
                                        <line x1='3' y1='15' x2='21' y2='15' />
                                        <line x1='9' y1='3' x2='9' y2='21' />
                                        <line x1='15' y1='3' x2='15' y2='21' />
                                      </svg>
                                    ) : (
                                      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                        <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                                        <polyline points='14 2 14 8 20 8' />
                                        <line x1='16' y1='13' x2='8' y2='13' />
                                        <line x1='16' y1='17' x2='8' y2='17' />
                                      </svg>
                                    )}
                                  </div>
                                  <div className='owui-artifact-meta'>
                                    <div className='owui-artifact-title'>{doc.title}</div>
                                    <div className='owui-artifact-subtitle'>{subtitle}</div>
                                    {doc.truncated && (
                                      <div style={{ color: '#b91c1c', fontSize: 11.5, fontWeight: 600, marginTop: 3 }}>
                                        Peringatan: Dokumen terpotong (&gt;12.000 karakter) — ekspor dinonaktifkan.
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className='owui-artifact-card-actions'>
                                  <button
                                    type='button'
                                    className='owui-artifact-action-btn view'
                                    onClick={() => {
                                      setActiveArtifact(docToActiveArtifact(doc, artId, msg.timestamp))
                                      setPreviewOpen(true)
                                    }}
                                    title='Buka pratinjau di panel samping'
                                  >
                                    <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                      <rect x='2' y='3' width='20' height='18' rx='2' />
                                      <line x1='15' y1='3' x2='15' y2='21' />
                                    </svg>
                                    <span>Pratinjau</span>
                                  </button>

                                  {isExcel ? (
                                    <button
                                      type='button'
                                      className='owui-artifact-action-btn download excel'
                                      disabled={Boolean(doc.truncated)}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        if (!doc.truncated) exportMarkdownToExcel(doc.markdown, doc.title)
                                      }}
                                      title={
                                        doc.truncated
                                          ? 'Ekspor dinonaktifkan karena dokumen terpotong (>12.000 karakter)'
                                          : 'Unduh spreadsheet Excel (.xlsx)'
                                      }
                                    >
                                      <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                        <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                                        <polyline points='7 10 12 15 17 10' />
                                        <line x1='12' y1='15' x2='12' y2='3' />
                                      </svg>
                                      <span>Unduh Excel</span>
                                    </button>
                                  ) : isPdf ? (
                                    <button
                                      type='button'
                                      className='owui-artifact-action-btn download pdf'
                                      disabled={Boolean(doc.truncated)}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        if (!doc.truncated) printOrSavePdf(doc.markdown, doc.title)
                                      }}
                                      title={
                                        doc.truncated
                                          ? 'Ekspor dinonaktifkan karena dokumen terpotong (>12.000 karakter)'
                                          : 'Unduh / Cetak dokumen PDF (.pdf)'
                                      }
                                    >
                                      <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                        <polyline points='6 9 6 2 18 2 18 9' />
                                        <path d='M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' />
                                        <rect x='6' y='14' width='12' height='8' />
                                      </svg>
                                      <span>Unduh PDF</span>
                                    </button>
                                  ) : (
                                    <button
                                      type='button'
                                      className='owui-artifact-action-btn download word'
                                      disabled={Boolean(doc.truncated)}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        if (!doc.truncated) exportMarkdownToWordDoc(doc.markdown, doc.title)
                                      }}
                                      title={
                                        doc.truncated
                                          ? 'Ekspor dinonaktifkan karena dokumen terpotong (>12.000 karakter)'
                                          : 'Unduh dokumen Word (.doc)'
                                      }
                                    >
                                      <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                        <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                                        <polyline points='7 10 12 15 17 10' />
                                        <line x1='12' y1='15' x2='12' y2='3' />
                                      </svg>
                                      <span>Unduh Word</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </>
                      ) : (
                        <div>{msg.content}</div>
                      )}

                      {msg.role === 'assistant' && (msg.modelLabel || msg.dataUsed?.length) && (
                        <div className='owui-msg-meta' aria-label='Sumber dan konteks jawaban'>
                          {msg.modelLabel && <span className='owui-model-tag'>{msg.modelLabel}</span>}
                          {msg.dataUsed?.map((item, itemIdx) => (
                            <span className='owui-data-pill' key={`${msg.id}-data-${itemIdx}`}>
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {msg.role === 'user' && <div className='owui-avatar user'>HO</div>}
                  </div>
                )
              })
            )}

            {sending && (
              <div className='owui-msg-row assistant'>
                <div className='owui-avatar ai'>AI</div>
                <div className='owui-msg-bubble'>
                  <div style={{ color: '#6b7280', fontSize: 13, fontStyle: 'italic' }}>
                    Sedang menganalisis laporan Mitra10 Tukang...
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className='owui-composer-wrap'>
            <div className='owui-composer-box'>
              <textarea
                rows={2}
                className='owui-composer-input'
                placeholder='Tanyakan laporan Order, Work Order, SP Vendor, Komplain, atau Komisi Store (Tekan Enter untuk kirim)...'
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendPrompt()
                  }
                }}
              />
              <button
                type='button'
                className='owui-send-btn'
                disabled={!inputPrompt.trim() || sending}
                onClick={() => handleSendPrompt()}
              >
                {sending ? 'Memproses...' : 'Kirim'}
              </button>
            </div>
            <div className='owui-composer-hint'>
              <span>Asisten Laporan Mitra10 Tukang (Auto-Detect Skill Aktif)</span>
              <span>Khusus Admin HO & Super User</span>
            </div>
          </div>
        </section>

        {previewOpen && activeArtifact && (
          <DocumentCanvasPreview
            artifact={activeArtifact}
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </div>

      {settingsModalOpen && (
        <div className='owui-modal-backdrop' onClick={() => setSettingsModalOpen(false)}>
          <div className='owui-modal-dialog' onClick={(e) => e.stopPropagation()}>
            <h3>Pengaturan AI Assistant</h3>
            <p style={{ fontSize: 12.5, color: '#6b7280', marginBottom: 16 }}>
              Konfigurasi model kecerdasan buatan untuk analisis data operasional dan katalog laporan Mitra10 Tukang.
            </p>

            <div className='owui-field'>
              <label>Mode Engine AI</label>
              <select
                value={draftSettings.engineMode}
                onChange={(e) =>
                  setDraftSettings({ ...draftSettings, engineMode: e.target.value as AiEngineMode })
                }
              >
                <option value='9router-gemini'>Gemini AI Engine (Lokal Cepat)</option>
                <option value='deepseek-deploy'>
                  deepseek-ai/deepseek-v4.1-flash-1017 (Deploy API)
                </option>
                <option value='local-analyst'>Mitra10 Live Report Engine (Gratis &amp; Instan)</option>
                <option value='claude-free' disabled>
                  Claude 3.5 Sonnet (Belum dikonfigurasi di server)
                </option>
                <option value='claude-api' disabled>
                  Claude API / OpenRouter (Belum dikonfigurasi di server)
                </option>
              </select>
            </div>

            <div className='owui-field'>
              <label>Skill Default Laporan</label>
              <select
                value={draftSettings.activeSkillId || 'auto'}
                onChange={(e) =>
                  setDraftSettings({ ...draftSettings, activeSkillId: e.target.value as AiSkillId })
                }
              >
                <option value='auto'>Auto-Detect (Orkestrator 6 Skill)</option>
                <option value='order_and_revenue_analytics'>
                  1. Analitik Order, Omzet &amp; Daerah Terlaris
                </option>
                <option value='quotation_and_billing_report'>
                  2. Quotation, Invoice &amp; Tagihan
                </option>
                <option value='work_order_and_schedule'>
                  3. Work Order, Reschedule &amp; Remedial
                </option>
                <option value='vendor_sp_and_performance'>
                  4. Evaluasi SP Vendor, Pelanggaran &amp; Performa
                </option>
                <option value='complaint_refund_and_warranty'>
                  5. Komplain, Refund, Garansi &amp; CSI
                </option>
                <option value='commission_and_incentive_report'>
                  6. Komisi Sales, Komisi Toko &amp; Insentif
                </option>
              </select>
            </div>

            <div className='owui-field'>
              <label>Model Gemini (Daftar Model Diizinkan Server)</label>
              <select
                value={draftSettings.nineRouterModel || 'ag/gemini-3-flash'}
                onChange={(e) =>
                  setDraftSettings({ ...draftSettings, nineRouterModel: e.target.value })
                }
              >
                <option value='ag/gemini-3-flash'>ag/gemini-3-flash (Cepat)</option>
                <option value='ag/gemini-3.1-pro-high'>ag/gemini-3.1-pro-high (Penalaran)</option>
                <option value='ag/gemini-3.1-pro-low'>ag/gemini-3.1-pro-low</option>
                <option value='ai-combo'>ai-combo (Fallback)</option>
                <option value='gc/gemini-2.5-pro'>gc/gemini-2.5-pro</option>
                <option value='gc/gemini-2.5-flash'>gc/gemini-2.5-flash</option>
                <option value='gemini/gemini-2.5-pro'>gemini/gemini-2.5-pro</option>
                <option value='gemini/gemini-2.5-flash'>gemini/gemini-2.5-flash</option>
              </select>
            </div>

            <div className='owui-field'>
              <label>Reasoning Effort (DeepSeek-V4.1-Flash)</label>
              <select
                value={draftSettings.reasoningEffort}
                onChange={(e) =>
                  setDraftSettings({
                    ...draftSettings,
                    reasoningEffort: e.target.value as 'none' | 'low' | 'high' | 'max',
                  })
                }
              >
                <option value='none'>none (Tercepat / Tanpa Thinking)</option>
                <option value='low'>low (Cepat &amp; Akurat untuk Laporan)</option>
                <option value='high'>high (Analisis Mendalam - Default)</option>
                <option value='max'>max (Reasoning Maksimal)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className='owui-field'>
                <label>Temperature (0.0 – 1.0)</label>
                <input
                  type='number'
                  step='0.1'
                  min='0'
                  max='1'
                  value={draftSettings.temperature ?? 0.3}
                  onChange={(e) => {
                    const raw = Number(e.target.value)
                    const clamped = Number.isFinite(raw) ? Math.min(1, Math.max(0, raw)) : 0.3
                    setDraftSettings({
                      ...draftSettings,
                      temperature: clamped,
                    })
                  }}
                />
              </div>

              <div className='owui-field'>
                <label>Cache Preference (Default: 8)</label>
                <input
                  type='number'
                  min='1'
                  value={draftSettings.cachePreference ?? 8}
                  onChange={(e) =>
                    setDraftSettings({
                      ...draftSettings,
                      cachePreference: Math.max(1, Number(e.target.value) || 8),
                    })
                  }
                />
              </div>
            </div>

            <div className='owui-field'>
              <label>Model Anthropic Claude</label>
              <select
                value={draftSettings.anthropicModel}
                onChange={(e) =>
                  setDraftSettings({ ...draftSettings, anthropicModel: e.target.value })
                }
              >
                <option value='claude-3-5-sonnet-latest'>claude-3-5-sonnet-latest</option>
                <option value='claude-3-7-sonnet-latest'>claude-3-7-sonnet-latest</option>
                <option value='claude-3-haiku-20240307'>claude-3-haiku-20240307</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
              <button
                type='button'
                className='owui-action-btn'
                onClick={() => setSettingsModalOpen(false)}
              >
                Batal
              </button>
              <button
                type='button'
                className='owui-action-btn primary'
                onClick={() => {
                  setSettings(draftSettings)
                  saveAiSettings(draftSettings)
                  setSettingsModalOpen(false)
                }}
              >
                Simpan Pengaturan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AiAssistantPage
