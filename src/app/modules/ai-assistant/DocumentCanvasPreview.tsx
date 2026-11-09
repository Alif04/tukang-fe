import React, { useState, useMemo } from 'react'
import {
  exportMarkdownToExcel,
  exportMarkdownToWordDoc,
  printOrSavePdf,
  parseMarkdownTables,
} from './documentExporter'
import { cleanLatexAndMathFormatting, DocFormat } from './aiAssistantService'
import { formatTanggalIndonesia } from './skills/domainKnowledge'

export interface ActiveArtifact {
  id: string
  title: string
  format: DocFormat
  type: 'document' | 'spreadsheet' | 'mixed'
  rawMarkdown: string
  createdAt?: string
  truncated?: boolean
}

interface DocumentCanvasPreviewProps {
  artifact: ActiveArtifact | null
  onClose: () => void
}

function renderCanvasInline(text: string): React.ReactNode[] {
  const cleaned = cleanLatexAndMathFormatting(text)
  const parts = cleaned.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>
    }
    return <span key={idx}>{part}</span>
  })
}

function renderCanvasMarkdown(md: string, docTitle = ''): React.ReactNode[] {
  const cleaned = cleanLatexAndMathFormatting(md)
  const lines = cleaned.split('\n')
  const nodes: React.ReactNode[] = []
  let tableRows: string[] = []
  let inTable = false
  let skippedMainTitle = false

  const flushTable = (keyPrefix: string) => {
    if (tableRows.length === 0) return
    const rows = tableRows.map((r) =>
      r
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim())
    )
    const headerRow = rows[0] || []
    const bodyRows = rows.slice(1).filter((row) => !row.every((c) => /^:?-{2,}:?$/.test(c)))

    nodes.push(
      <div key={`${keyPrefix}-table`} className='owui-canvas-table-wrap'>
        <table className='owui-canvas-table'>
          <thead>
            <tr>
              {headerRow.map((cell, cIdx) => (
                <th key={cIdx}>{renderCanvasInline(cell)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx}>{renderCanvasInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
    tableRows = []
  }

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim()
    if (line.startsWith('|') && line.endsWith('|')) {
      inTable = true
      tableRows.push(line)
      return
    } else if (inTable) {
      flushTable(`tbl-${idx}`)
      inTable = false
    }

    if (!line) {
      nodes.push(<div key={`sp-${idx}`} style={{ height: 8 }} />)
    } else if (line.startsWith('### ')) {
      nodes.push(
        <h4 key={`h3-${idx}`} className='owui-canvas-h3'>
          {renderCanvasInline(line.slice(4))}
        </h4>
      )
    } else if (line.startsWith('## ')) {
      nodes.push(
        <h3 key={`h2-${idx}`} className='owui-canvas-h2'>
          {renderCanvasInline(line.slice(3))}
        </h3>
      )
    } else if (line.startsWith('# ')) {
      const h1Text = line.slice(2).replace(/\*\*/g, '').trim()
      if (!skippedMainTitle && docTitle && h1Text.toLowerCase() === docTitle.trim().toLowerCase()) {
        skippedMainTitle = true
        return
      }
      nodes.push(
        <h2 key={`h1-${idx}`} className='owui-canvas-h1'>
          {renderCanvasInline(line.slice(2))}
        </h2>
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      nodes.push(
        <li key={`li-${idx}`} className='owui-canvas-li'>
          {renderCanvasInline(line.slice(2))}
        </li>
      )
    } else if (/^\d+\.\s/.test(line)) {
      const dotIndex = line.indexOf('. ')
      const num = line.slice(0, dotIndex)
      const content = line.slice(dotIndex + 2)
      nodes.push(
        <div key={`ol-${idx}`} className='owui-canvas-ol-item'>
          <span className='owui-canvas-num'>{num}.</span>
          <span>{renderCanvasInline(content)}</span>
        </div>
      )
    } else {
      nodes.push(
        <p key={`p-${idx}`} className='owui-canvas-p'>
          {renderCanvasInline(line)}
        </p>
      )
    }
  })

  if (inTable) {
    flushTable('tbl-end')
  }

  return nodes
}

const EXCEL_COL_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'
]

export const DocumentCanvasPreview: React.FC<DocumentCanvasPreviewProps> = ({
  artifact,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'document' | 'spreadsheet'>('document')
  const [activeSheetIdx, setActiveSheetIdx] = useState(0)
  const [tableSearch, setTableSearch] = useState('')
  const [copied, setCopied] = useState(false)

  const parsedTables = useMemo(() => {
    if (!artifact?.rawMarkdown) return []
    return parseMarkdownTables(artifact.rawMarkdown)
  }, [artifact?.rawMarkdown])

  const hasSpreadsheet = parsedTables.length > 0
  const preferredFormat: DocFormat =
    artifact?.format || (artifact?.type === 'spreadsheet' ? 'excel' : 'pdf')

  React.useEffect(() => {
    if (preferredFormat === 'excel' && hasSpreadsheet) {
      setActiveTab('spreadsheet')
    } else {
      setActiveTab('document')
    }
    setActiveSheetIdx(0)
    setTableSearch('')
  }, [artifact?.id, preferredFormat, hasSpreadsheet])

  if (!artifact) return null

  const currentDateStr = formatTanggalIndonesia(new Date())

  const currentTable = parsedTables[activeSheetIdx] || []
  const tableHeader = currentTable[0] || []
  const tableBody = currentTable.slice(1)

  const filteredBody = tableSearch.trim()
    ? tableBody.filter((row) =>
        row.some((cell) => cell.toLowerCase().includes(tableSearch.toLowerCase()))
      )
    : tableBody

  const handleCopyContent = () => {
    navigator.clipboard?.writeText(artifact.rawMarkdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <aside className='owui-canvas-panel' aria-label='Pratinjau Dokumen'>
      <header className='owui-canvas-header'>
        <div className='owui-canvas-header-left'>
          <button
            type='button'
            className='owui-canvas-mobile-back'
            onClick={onClose}
            title='Kembali ke percakapan'
          >
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <line x1='19' y1='12' x2='5' y2='12' />
              <polyline points='12 19 5 12 12 5' />
            </svg>
            <span>Kembali</span>
          </button>

          <div className={`owui-canvas-doc-icon ${activeTab === 'spreadsheet' ? 'spreadsheet' : 'doc'}`}>
            {activeTab === 'spreadsheet' ? (
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <rect x='3' y='3' width='18' height='18' rx='2' />
                <line x1='3' y1='9' x2='21' y2='9' />
                <line x1='3' y1='15' x2='21' y2='15' />
                <line x1='9' y1='3' x2='9' y2='21' />
                <line x1='15' y1='3' x2='15' y2='21' />
              </svg>
            ) : (
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                <polyline points='14 2 14 8 20 8' />
                <line x1='16' y1='13' x2='8' y2='13' />
                <line x1='16' y1='17' x2='8' y2='17' />
              </svg>
            )}
          </div>

          <div className='owui-canvas-header-titles'>
            <div className='owui-canvas-header-title'>{artifact.title}</div>
            <div className='owui-canvas-header-sub'>
              {activeTab === 'spreadsheet'
                ? `Spreadsheet Excel · ${tableHeader.length} Kolom, ${tableBody.length} Baris`
                : preferredFormat === 'pdf'
                ? 'Dokumen Resmi PDF · Siap Cetak / Simpan PDF'
                : 'Dokumen Resmi Word (.doc) · Format Standar HO'}
            </div>
          </div>
        </div>

        <div className='owui-canvas-header-center'>
          <div className='owui-canvas-tab-group'>
            <button
              type='button'
              className={`owui-canvas-tab ${activeTab === 'document' ? 'active' : ''}`}
              onClick={() => setActiveTab('document')}
            >
              Dokumen
            </button>
            <button
              type='button'
              disabled={!hasSpreadsheet}
              className={`owui-canvas-tab ${activeTab === 'spreadsheet' ? 'active' : ''}`}
              onClick={() => setActiveTab('spreadsheet')}
              title={hasSpreadsheet ? 'Buka tampilan spreadsheet data grid' : 'Tidak ada tabel data'}
            >
              Spreadsheet {hasSpreadsheet ? `(${parsedTables.length})` : ''}
            </button>
          </div>
        </div>

        <div className='owui-canvas-header-actions'>
          {preferredFormat === 'excel' && hasSpreadsheet ? (
            <button
              type='button'
              className='owui-canvas-btn primary download excel'
              disabled={Boolean(artifact.truncated)}
              title={
                artifact.truncated
                  ? 'Ekspor dinonaktifkan karena dokumen terpotong (>12.000 karakter)'
                  : 'Unduh Spreadsheet Excel (.xlsx)'
              }
              onClick={() => !artifact.truncated && exportMarkdownToExcel(artifact.rawMarkdown, artifact.title)}
            >
              <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                <polyline points='7 10 12 15 17 10' />
                <line x1='12' y1='15' x2='12' y2='3' />
              </svg>
              <span className='owui-canvas-btn-text'>Unduh Excel</span>
            </button>
          ) : preferredFormat === 'word' ? (
            <button
              type='button'
              className='owui-canvas-btn primary download word'
              disabled={Boolean(artifact.truncated)}
              title={
                artifact.truncated
                  ? 'Ekspor dinonaktifkan karena dokumen terpotong (>12.000 karakter)'
                  : 'Unduh Dokumen Word (.doc)'
              }
              onClick={() => !artifact.truncated && exportMarkdownToWordDoc(artifact.rawMarkdown, artifact.title)}
            >
              <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                <polyline points='7 10 12 15 17 10' />
                <line x1='12' y1='15' x2='12' y2='3' />
              </svg>
              <span className='owui-canvas-btn-text'>Unduh Word</span>
            </button>
          ) : (
            <button
              type='button'
              className='owui-canvas-btn primary download pdf'
              disabled={Boolean(artifact.truncated)}
              title={
                artifact.truncated
                  ? 'Ekspor dinonaktifkan karena dokumen terpotong (>12.000 karakter)'
                  : 'Unduh / Cetak Dokumen PDF'
              }
              onClick={() => !artifact.truncated && printOrSavePdf(artifact.rawMarkdown, artifact.title)}
            >
              <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <polyline points='6 9 6 2 18 2 18 9' />
                <path d='M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' />
                <rect x='6' y='14' width='12' height='8' />
              </svg>
              <span className='owui-canvas-btn-text'>Unduh PDF</span>
            </button>
          )}

          {preferredFormat !== 'word' && (
            <button
              type='button'
              className='owui-canvas-btn word'
              disabled={Boolean(artifact.truncated)}
              title={
                artifact.truncated
                  ? 'Ekspor dinonaktifkan karena dokumen terpotong (>12.000 karakter)'
                  : 'Unduh Dokumen Word (.doc)'
              }
              onClick={() => !artifact.truncated && exportMarkdownToWordDoc(artifact.rawMarkdown, artifact.title)}
            >
              <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                <polyline points='7 10 12 15 17 10' />
                <line x1='12' y1='15' x2='12' y2='3' />
              </svg>
              <span className='owui-canvas-btn-text'>Word</span>
            </button>
          )}

          {preferredFormat !== 'pdf' && (
            <button
              type='button'
              className='owui-canvas-btn pdf'
              disabled={Boolean(artifact.truncated)}
              title={
                artifact.truncated
                  ? 'Ekspor dinonaktifkan karena dokumen terpotong (>12.000 karakter)'
                  : 'Cetak / Simpan PDF'
              }
              onClick={() => !artifact.truncated && printOrSavePdf(artifact.rawMarkdown, artifact.title)}
            >
              <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <polyline points='6 9 6 2 18 2 18 9' />
                <path d='M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' />
                <rect x='6' y='14' width='12' height='8' />
              </svg>
              <span className='owui-canvas-btn-text'>PDF</span>
            </button>
          )}

          {hasSpreadsheet && preferredFormat !== 'excel' && (
            <button
              type='button'
              className='owui-canvas-btn excel'
              disabled={Boolean(artifact.truncated)}
              title={
                artifact.truncated
                  ? 'Ekspor dinonaktifkan karena dokumen terpotong (>12.000 karakter)'
                  : 'Unduh Spreadsheet Excel (.xlsx)'
              }
              onClick={() => !artifact.truncated && exportMarkdownToExcel(artifact.rawMarkdown, artifact.title)}
            >
              <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                <polyline points='7 10 12 15 17 10' />
                <line x1='12' y1='15' x2='12' y2='3' />
              </svg>
              <span className='owui-canvas-btn-text'>Excel</span>
            </button>
          )}

          <button
            type='button'
            className='owui-canvas-btn'
            title='Salin isi teks'
            onClick={handleCopyContent}
          >
            <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <rect x='9' y='9' width='13' height='13' rx='2' ry='2' />
              <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
            </svg>
            <span className='owui-canvas-btn-text'>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>

          <button
            type='button'
            className='owui-canvas-close'
            title='Tutup Pratinjau'
            onClick={onClose}
          >
            <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>
        </div>
      </header>

      <div className='owui-canvas-body'>
        {artifact.truncated && (
          <div
            style={{
              margin: '12px 16px 0',
              padding: '10px 14px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              color: '#991b1b',
              fontSize: 12.5,
              fontWeight: 500,
            }}
          >
            Peringatan: Dokumen ini terpotong karena melebihi batas penyimpanan 12.000 karakter. Fitur ekspor/unduh dinonaktifkan untuk mencegah dokumen tidak lengkap.
          </div>
        )}
        {activeTab === 'document' ? (
          <div className='owui-canvas-doc-view'>
            <div className='owui-canvas-doc-card'>
              <div className='owui-canvas-doc-hero'>
                <div className='owui-canvas-doc-brand'>
                  <span className='owui-canvas-brand-pill'>PT Catur Mitra Sejati Sentosa (Mitra10)</span>
                  <span className='owui-canvas-date-badge'>{currentDateStr}</span>
                </div>
                <h1 className='owui-canvas-doc-maintitle'>{artifact.title}</h1>
                <div className='owui-canvas-doc-tagline'>
                  Departemen Jasa Instalasi & Layanan Tukang · Head Office Operasional
                </div>
              </div>

              <div className='owui-canvas-content'>
                {renderCanvasMarkdown(artifact.rawMarkdown, artifact.title)}
              </div>

              <div
                style={{
                  marginTop: 28,
                  paddingTop: 18,
                  borderTop: '1px solid #e2e8f0',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 12,
                  textAlign: 'center',
                  fontSize: 12,
                  color: '#334155',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 42 }}>Dibuat Oleh,</div>
                  <div style={{ fontWeight: 700, textDecoration: 'underline', color: '#0f172a' }}>
                    Admin Operasional HO
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Mitra10 Tukang</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 42 }}>Disetujui Oleh,</div>
                  <div style={{ fontWeight: 700, textDecoration: 'underline', color: '#0f172a' }}>
                    Super User / Head of Dept
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Mitra10 Tukang</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 42 }}>Diterima Oleh,</div>
                  <div style={{ fontWeight: 700, textDecoration: 'underline', color: '#0f172a' }}>
                    Pihak Terkait / Vendor
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Mitra Resmi Mitra10</div>
                </div>
              </div>

              <div className='owui-canvas-doc-footer-cta'>
                <div className='owui-canvas-cta-text'>
                  {artifact.truncated
                    ? 'Dokumen terpotong (>12.000 karakter) — ekspor dinonaktifkan:'
                    : 'Dokumen laporan siap diunduh dalam format resmi:'}
                </div>
                <div className='owui-canvas-cta-buttons'>
                  <button
                    type='button'
                    className='owui-canvas-cta-btn pdf'
                    disabled={Boolean(artifact.truncated)}
                    onClick={() => !artifact.truncated && printOrSavePdf(artifact.rawMarkdown, artifact.title)}
                  >
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                      <polyline points='6 9 6 2 18 2 18 9' />
                      <path d='M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' />
                      <rect x='6' y='14' width='12' height='8' />
                    </svg>
                    <span>Unduh / Cetak PDF (.pdf)</span>
                  </button>
                  <button
                    type='button'
                    className='owui-canvas-cta-btn word'
                    disabled={Boolean(artifact.truncated)}
                    onClick={() => !artifact.truncated && exportMarkdownToWordDoc(artifact.rawMarkdown, artifact.title)}
                  >
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                      <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                      <polyline points='7 10 12 15 17 10' />
                      <line x1='12' y1='15' x2='12' y2='3' />
                    </svg>
                    <span>Unduh Dokumen Word (.doc)</span>
                  </button>
                  {hasSpreadsheet && (
                    <button
                      type='button'
                      className='owui-canvas-cta-btn excel'
                      disabled={Boolean(artifact.truncated)}
                      onClick={() => !artifact.truncated && exportMarkdownToExcel(artifact.rawMarkdown, artifact.title)}
                    >
                      <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                        <polyline points='7 10 12 15 17 10' />
                        <line x1='12' y1='15' x2='12' y2='3' />
                      </svg>
                      <span>Unduh Spreadsheet Excel (.xlsx)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='owui-canvas-excel-wrapper'>
            <div className='owui-canvas-excel-toolbar'>
              <div className='owui-canvas-sheet-tabs'>
                {parsedTables.map((_, sIdx) => (
                  <button
                    key={sIdx}
                    type='button'
                    className={`owui-canvas-sheet-tab ${sIdx === activeSheetIdx ? 'active' : ''}`}
                    onClick={() => setActiveSheetIdx(sIdx)}
                  >
                    Sheet {sIdx + 1}
                  </button>
                ))}
              </div>

              <div className='owui-canvas-excel-tools-right'>
                <div className='owui-canvas-search-box'>
                  <input
                    type='text'
                    className='owui-canvas-search-input'
                    placeholder='Cari baris data...'
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                  />
                  <span className='owui-canvas-row-count'>
                    {filteredBody.length} / {tableBody.length} baris
                  </span>
                </div>

                <button
                  type='button'
                  className='owui-canvas-inline-excel-btn'
                  disabled={Boolean(artifact.truncated)}
                  onClick={() => !artifact.truncated && exportMarkdownToExcel(artifact.rawMarkdown, artifact.title)}
                  title={
                    artifact.truncated
                      ? 'Ekspor dinonaktifkan karena dokumen terpotong (>12.000 karakter)'
                      : 'Download file .xlsx'
                  }
                >
                  <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                    <polyline points='7 10 12 15 17 10' />
                    <line x1='12' y1='15' x2='12' y2='3' />
                  </svg>
                  <span>Unduh .xlsx</span>
                </button>
              </div>
            </div>

            <div className='owui-canvas-grid-scroll'>
              <table className='owui-canvas-excel-table'>
                <thead>
                  <tr className='owui-canvas-col-letters-row'>
                    <th className='owui-canvas-row-num-th'>#</th>
                    {tableHeader.map((_, cIdx) => (
                      <th key={cIdx} className='owui-canvas-col-letter'>
                        {EXCEL_COL_LETTERS[cIdx] || String.fromCharCode(65 + cIdx)}
                      </th>
                    ))}
                  </tr>
                  <tr className='owui-canvas-data-header-row'>
                    <th className='owui-canvas-row-num-th'>1</th>
                    {tableHeader.map((header, cIdx) => (
                      <th key={cIdx} className='owui-canvas-data-th'>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBody.map((row, rIdx) => (
                    <tr key={rIdx} className='owui-canvas-grid-row'>
                      <td className='owui-canvas-row-num-td'>{rIdx + 2}</td>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className='owui-canvas-grid-cell'>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {filteredBody.length === 0 && (
                    <tr>
                      <td
                        colSpan={tableHeader.length + 1}
                        style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}
                      >
                        Tidak ada data yang cocok dengan pencarian "{tableSearch}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
