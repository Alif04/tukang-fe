export type DocFormat = 'pdf' | 'word' | 'excel'
export type PromptIntent = 'smalltalk' | 'query' | 'report'

export interface ParsedAiDoc {
  format: DocFormat
  title: string
  markdown: string
  truncated?: boolean
}

export interface ParsedAiReply {
  chatText: string
  docs: ParsedAiDoc[]
}

const GREETING_OR_TEST_REGEX =
  /^(\s*(halo+|hai+|hi+|hello+|pagi|siang|sore|malam|selamat\s+(pagi|siang|sore|malam)|tes|test|testing|ping|cek|ok|oke|siap|makasih|terima\s*kasih|thanks|thank\s*you|p)\s*[!?.]*)$/i

const DOMAIN_KEYWORD_REGEX =
  /\b(sp|sp1|sp2|sp3|vendor|order|wo|work\s*order|survey|quotation|bast|tukang|komplain|complaint|pengaduan|refund|garansi|warranty|reschedule|insentif|komisi|sales|store|toko|cabang|omset|tagihan|paid|unpaid|penalty|penalti|csi|promosi|poin|pelanggaran|suspend|reaktivasi|alokasi|kuartal)\b/i

const REPORT_KEYWORD_REGEX =
  /\b(pdf|cetak|print|word|docx|excel|xlsx|spreadsheet|laporan|rekap|rekapitulasi|dokumen|surat|berita\s*acara|memo|unduh|export|buatkan\s+(laporan|dokumen|surat|rekap|tabel|file))\b/i

const REVISION_KEYWORD_REGEX =
  /\b(revisi|ubah|ganti|perbaiki|koreksi|update|tambahkan|hilangkan|hapus|sesuaikan)\b/i

export function isRevisionPrompt(userPrompt: string): boolean {
  if (!userPrompt) return false
  return REVISION_KEYWORD_REGEX.test(userPrompt)
}

export function classifyIntent(userPrompt: string): PromptIntent {
  const trimmed = (userPrompt || '').trim()
  if (!trimmed) return 'smalltalk'

  if (GREETING_OR_TEST_REGEX.test(trimmed)) {
    return 'smalltalk'
  }

  const hasFormat = detectRequestedFormat(trimmed) !== null
  const hasReportKeyword = REPORT_KEYWORD_REGEX.test(trimmed)
  const hasDomainKeyword = DOMAIN_KEYWORD_REGEX.test(trimmed)

  if (trimmed.length <= 20 && !hasDomainKeyword && !hasFormat && !hasReportKeyword) {
    return 'smalltalk'
  }

  if (hasFormat || hasReportKeyword) {
    return 'report'
  }

  return 'query'
}

export function detectRequestedFormat(userPrompt: string): DocFormat | null {
  if (!userPrompt) return null
  const q = userPrompt.toLowerCase()

  if (/\b(pdf|cetak|print)\b/i.test(q)) {
    return 'pdf'
  }
  if (/\b(word|docx)\b/i.test(q)) {
    return 'word'
  }
  if (/\b(excel|xlsx|spreadsheet)\b/i.test(q)) {
    return 'excel'
  }

  return null
}

function normalizeFormat(raw: string, fallback: DocFormat = 'pdf'): DocFormat {
  const v = (raw || '').toLowerCase().trim()
  if (v === 'pdf' || v === 'cetak' || v === 'print') return 'pdf'
  if (v === 'word' || v === 'docx' || v === 'doc') return 'word'
  if (v === 'excel' || v === 'xlsx' || v === 'spreadsheet' || v === 'xls') return 'excel'
  return fallback
}

export function stripDokumenBlocksForHistory(text: string): string {
  if (!text) return ''
  return text
    .replace(
      /<dokumen\b([^>]*)>[\s\S]*?(?:<\/dokumen>|$)/gi,
      (_full, attrs: string) => {
        const fmt = attrs?.match(/format\s*=\s*["']?([^"'\s>]+)["']?/i)?.[1] || 'dokumen'
        const title = attrs?.match(/judul\s*=\s*["']([^"']+)["']/i)?.[1] || 'Laporan'
        return `[Dokumen "${title}" (${fmt.toUpperCase()}) telah dibuat]`
      }
    )
    .trim()
}

export const MAX_DOC_MARKDOWN_CHARS = 12000

export function parseAiReply(
  text: string,
  requestedFormat: DocFormat | null = null
): ParsedAiReply {
  if (!text) {
    return { chatText: '', docs: [] }
  }

  const docs: ParsedAiDoc[] = []
  const tagRegex = /<dokumen\b([^>]*)>([\s\S]*?)(?:<\/dokumen>|$)/gi
  let match: RegExpExecArray | null

  while ((match = tagRegex.exec(text)) !== null) {
    const attrs = match[1] || ''
    const body = (match[2] || '').trim()
    if (!body) continue

    const rawFormat = attrs.match(/format\s*=\s*["']?([^"'\s>]+)["']?/i)?.[1] || ''
    const rawTitle = attrs.match(/judul\s*=\s*["']([^"']+)["']/i)?.[1] || ''

    const headingMatch = body.match(/^#\s+(.+)$/m)
    const fallbackTitle = headingMatch
      ? headingMatch[1].replace(/\*\*/g, '').trim()
      : 'Laporan Operasional Mitra10 Tukang'

    const modelFormat = normalizeFormat(rawFormat, requestedFormat || 'pdf')
    const effectiveFormat: DocFormat = requestedFormat || modelFormat
    const isTruncated = body.length > MAX_DOC_MARKDOWN_CHARS

    docs.push({
      format: effectiveFormat,
      title: (rawTitle || fallbackTitle).trim(),
      markdown: isTruncated ? body.slice(0, MAX_DOC_MARKDOWN_CHARS) : body,
      ...(isTruncated ? { truncated: true } : {}),
    })
  }

  const chatText = text
    .replace(/<dokumen\b[^>]*>[\s\S]*?(?:<\/dokumen>|$)/gi, '')
    .trim()

  return { chatText, docs }
}
