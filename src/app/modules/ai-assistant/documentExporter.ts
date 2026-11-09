import * as XLSX from 'xlsx'
import { cleanLatexAndMathFormatting } from './aiAssistantService'

export function parseMarkdownTables(md: string): string[][][] {
  const tables: string[][][] = []
  const lines = md.split('\n')
  let currentTable: string[][] = []
  let inTable = false

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (line.startsWith('|') && line.endsWith('|')) {
      inTable = true
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim().replace(/\*\*/g, '').replace(/`/g, ''))
      // Skip separator row like | :--- | :---: |
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) {
        continue
      }
      currentTable.push(cells)
    } else {
      if (inTable && currentTable.length > 0) {
        tables.push(currentTable)
        currentTable = []
      }
      inTable = false
    }
  }

  if (inTable && currentTable.length > 0) {
    tables.push(currentTable)
  }

  return tables
}

export function exportMarkdownToExcel(markdown: string, baseTitle = 'Laporan_Mitra10'): boolean {
  const tables = parseMarkdownTables(markdown)
  if (tables.length === 0) return false

  const wb = XLSX.utils.book_new()
  const currentDateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  tables.forEach((rawTable, idx) => {
    if (rawTable.length === 0) return

    const header = rawTable[0] || []
    const body = rawTable.slice(1).map((row) =>
      row.map((cell) => {
        const trimmed = cell.trim()
        // Convert pure numbers so Excel recognizes numeric types
        if (/^-?\d+(\.\d+)?$/.test(trimmed) && trimmed.length <= 15) {
          const num = Number(trimmed)
          if (!isNaN(num)) return num
        }
        // Convert currency like Rp 1.500.000 or Rp 1500000
        const rpMatch = trimmed.match(/^Rp\s?([0-9.,]+)$/i)
        if (rpMatch) {
          const cleanVal = rpMatch[1].replace(/\./g, '').replace(/,/g, '.')
          const num = Number(cleanVal)
          if (!isNaN(num)) return num
        }
        return trimmed
      })
    )

    // Build professional executive sheet with title banner
    const sheetData: any[][] = [
      ['PT CATUR MITRA SEJATI SENTOSA (MITRA10) - DEPARTEMEN TUKANG'],
      [`${baseTitle || 'Laporan Operasional Mitra10 Tukang'} · Tanggal: ${currentDateStr}`],
      [], // blank line
      header,
      ...body,
    ]

    const ws = XLSX.utils.aoa_to_sheet(sheetData)

    // Calculate auto-fit column widths
    const colWidths: { wch: number }[] = header.map((h, colIdx) => {
      let maxLen = String(h || '').length
      body.forEach((row) => {
        const val = row[colIdx]
        const len = val !== undefined && val !== null ? String(val).length : 0
        if (len > maxLen) maxLen = len
      })
      return { wch: Math.min(Math.max(maxLen + 4, 14), 55) }
    })

    ws['!cols'] = colWidths

    const sheetName = tables.length === 1 ? 'Laporan' : `Tabel ${idx + 1}`
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
  })

  const sanitized = baseTitle.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 40)
  const filename = `${sanitized || 'Laporan_Mitra10'}_${Date.now()}.xlsx`
  XLSX.writeFile(wb, filename)
  return true
}

export function exportMarkdownToWordDoc(markdown: string, docTitle = 'Dokumen Resmi Mitra10 Tukang'): void {
  const cleaned = cleanLatexAndMathFormatting(markdown)
  const lines = cleaned.split('\n')
  let htmlBody = ''
  let inTable = false
  let tableRows: string[] = []

  const flushTable = () => {
    if (tableRows.length === 0) return
    let tHtml = '<table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:10pt; font-family:Arial, Calibri, sans-serif;">'
    tableRows.forEach((row, rIdx) => {
      const cells = row.slice(1, -1).split('|').map((c) => c.trim())
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) return
      const tag = rIdx === 0 ? 'th' : 'td'
      const bg =
        rIdx === 0
          ? 'background-color:#1e3a8a; color:#ffffff; font-weight:bold;'
          : rIdx % 2 === 0
          ? 'background-color:#f8fafc;'
          : 'background-color:#ffffff;'
      tHtml += '<tr>'
      cells.forEach((cell) => {
        const formatted = cell.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        tHtml += `<${tag} style="border:1px solid #cbd5e1; padding:8px 12px; text-align:left; ${bg}">${formatted}</${tag}>`
      })
      tHtml += '</tr>'
    })
    tHtml += '</table>'
    htmlBody += tHtml
    tableRows = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (line.startsWith('|') && line.endsWith('|')) {
      inTable = true
      tableRows.push(line)
      continue
    } else if (inTable) {
      flushTable()
      inTable = false
    }

    if (!line) {
      htmlBody += '<p style="margin:4px 0;">&nbsp;</p>'
    } else if (line.startsWith('### ')) {
      htmlBody += `<h3 style="color:#1e3a8a; font-size:12pt; font-family:Arial, sans-serif; margin:16px 0 6px 0; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">${line.slice(4).replace(/\*\*/g, '')}</h3>`
    } else if (line.startsWith('## ')) {
      htmlBody += `<h2 style="color:#1e3a8a; font-size:14pt; font-family:Arial, sans-serif; margin:20px 0 8px 0; text-transform:uppercase;">${line.slice(3).replace(/\*\*/g, '')}</h2>`
    } else if (line.startsWith('# ')) {
      htmlBody += `<h1 style="color:#0f172a; font-size:16pt; font-family:Arial, sans-serif; margin:22px 0 10px 0; text-align:center;">${line.slice(2).replace(/\*\*/g, '')}</h1>`
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      htmlBody += `<li style="margin:4px 0 4px 22px; font-size:11pt; line-height:1.6; color:#1e293b;">${text}</li>`
    } else if (line.startsWith('> ')) {
      const text = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      htmlBody += `<div style="background-color:#eff6ff; border-left:4px solid #1e3a8a; padding:10px 14px; margin:12px 0; font-size:10.5pt; color:#1e3a8a;">${text}</div>`
    } else {
      const text = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      htmlBody += `<p style="margin:6px 0; font-size:11pt; line-height:1.6; color:#1e293b;">${text}</p>`
    }
  }

  if (inTable) {
    flushTable()
  }

  const currentDateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const isLegalNotice =
    docTitle.toLowerCase().includes('surat') ||
    docTitle.toLowerCase().includes('sp') ||
    docTitle.toLowerCase().includes('berita acara') ||
    markdown.toLowerCase().includes('surat peringatan')

  const signatureSection = isLegalNotice
    ? `
      <div style="margin-top: 40px; page-break-inside: avoid;">
        <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
          <tr>
            <td style="width: 50%; text-align: center; vertical-align: top;">
              <p style="margin: 0 0 55px 0; font-size: 10pt; font-weight: bold;">Dibuat / Diajukan Oleh,</p>
              <p style="margin: 0; font-weight: bold; text-decoration: underline;">Admin Operasional HO</p>
              <p style="margin: 2px 0 0 0; font-size: 9pt; color: #64748b;">Mitra10 Tukang Management</p>
            </td>
            <td style="width: 50%; text-align: center; vertical-align: top;">
              <p style="margin: 0 0 55px 0; font-size: 10pt; font-weight: bold;">Disetujui / Mengetahui,</p>
              <p style="margin: 0; font-weight: bold; text-decoration: underline;">Super User / Head of Dept</p>
              <p style="margin: 2px 0 0 0; font-size: 9pt; color: #64748b;">Mitra10 Tukang Management</p>
            </td>
          </tr>
        </table>
      </div>
    `
    : `
      <div style="margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 9pt; color: #64748b; text-align: right;">
        Dokumen ini dibuat otomatis oleh Sistem Mitra10 AI Assistant · Head Office Operasional
      </div>
    `

  const fullWordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${docTitle}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 2cm 2cm 2cm 2cm;
          mso-page-orientation: portrait;
        }
        body {
          font-family: 'Segoe UI', Calibri, Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.6;
          color: #1e293b;
        }
      </style>
    </head>
    <body>
      <div style="border-bottom: 3px double #1e3a8a; padding-bottom: 12px; margin-bottom: 22px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: middle;">
              <h2 style="margin: 0; color: #1e3a8a; font-size: 15pt; font-family: Arial, sans-serif; letter-spacing: 0.5px;">
                PT CATUR MITRA SEJATI SENTOSA (MITRA10)
              </h2>
              <div style="font-size: 9.5pt; color: #475569; margin-top: 3px;">
                Departemen Jasa Instalasi & Layanan Tukang · Head Office Operasional
              </div>
              <div style="font-size: 8.5pt; color: #64748b;">
                Sistem Terpadu Manajemen Order, Vendor & Penjaminan Kualitas Pelanggan
              </div>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <span style="display: inline-block; padding: 4px 10px; background: #eff6ff; border: 1px solid #bfdbfe; font-size: 9pt; font-weight: bold; color: #1e3a8a; border-radius: 4px;">
                DOKUMEN RESMI
              </span>
              <div style="font-size: 8.5pt; color: #64748b; margin-top: 4px;">
                Tanggal: ${currentDateStr}
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div class="content-section">
        ${htmlBody}
      </div>

      ${signatureSection}
    </body>
    </html>
  `

  const blob = new Blob(['\ufeff', fullWordHtml], {
    type: 'application/msword;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const sanitized = docTitle.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 45)
  const link = document.createElement('a')
  link.href = url
  link.download = `${sanitized || 'Dokumen_Mitra10'}_${Date.now()}.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function printOrSavePdf(markdown: string, docTitle = 'Laporan Mitra10 Tukang'): void {
  const cleaned = cleanLatexAndMathFormatting(markdown)
  const printWindow = window.open('', '_blank', 'width=900,height=750')
  if (!printWindow) {
    alert('Browser memblokir pop-up pencetakan. Harap izinkan pop-up untuk mencetak dokumen.')
    return
  }

  const currentDateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Basic HTML formatter for print
  const lines = cleaned.split('\n')
  let bodyHtml = ''
  let inTable = false
  let tableRows: string[] = []

  const flushTable = () => {
    if (tableRows.length === 0) return
    let tHtml = '<table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:10pt;">'
    tableRows.forEach((row, rIdx) => {
      const cells = row.slice(1, -1).split('|').map((c) => c.trim())
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) return
      const tag = rIdx === 0 ? 'th' : 'td'
      const bg = rIdx === 0 ? 'background-color:#1e3a8a; color:#ffffff; font-weight:bold;' : rIdx % 2 === 0 ? 'background-color:#f8fafc;' : 'background-color:#ffffff;'
      tHtml += '<tr>'
      cells.forEach((cell) => {
        const formatted = cell.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        tHtml += `<${tag} style="border:1px solid #cbd5e1; padding:8px 10px; text-align:left; ${bg}">${formatted}</${tag}>`
      })
      tHtml += '</tr>'
    })
    tHtml += '</table>'
    bodyHtml += tHtml
    tableRows = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (line.startsWith('|') && line.endsWith('|')) {
      inTable = true
      tableRows.push(line)
      continue
    } else if (inTable) {
      flushTable()
      inTable = false
    }

    if (!line) {
      bodyHtml += '<br/>'
    } else if (line.startsWith('### ')) {
      bodyHtml += `<h3 style="color:#1e3a8a; font-size:13pt; margin:14px 0 6px 0; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">${line.slice(4).replace(/\*\*/g, '')}</h3>`
    } else if (line.startsWith('## ')) {
      bodyHtml += `<h2 style="color:#1e3a8a; font-size:15pt; margin:18px 0 8px 0;">${line.slice(3).replace(/\*\*/g, '')}</h2>`
    } else if (line.startsWith('# ')) {
      bodyHtml += `<h1 style="color:#0f172a; font-size:17pt; margin:20px 0 10px 0; text-align:center;">${line.slice(2).replace(/\*\*/g, '')}</h1>`
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      bodyHtml += `<li style="margin:4px 0 4px 18px; font-size:10.5pt; line-height:1.5;">${text}</li>`
    } else {
      const text = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      bodyHtml += `<p style="margin:6px 0; font-size:10.5pt; line-height:1.5;">${text}</p>`
    }
  }

  if (inTable) flushTable()

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${docTitle}</title>
      <style>
        @page { size: A4 portrait; margin: 2cm; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 10.5pt; color: #111827; padding: 24px; line-height: 1.5; }
        .kop { border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
        .kop-title { font-size: 14pt; font-weight: bold; color: #1e3a8a; margin: 0; }
        .kop-sub { font-size: 9.5pt; color: #4b5563; margin-top: 2px; }
        .signatures { margin-top: 50px; display: flex; justify-content: space-between; page-break-inside: avoid; }
        .sig-box { text-align: center; width: 40%; }
        .sig-line { margin-top: 60px; font-weight: bold; text-decoration: underline; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="kop">
        <div>
          <div class="kop-title">PT CATUR MITRA SEJATI SENTOSA (MITRA10)</div>
          <div class="kop-sub">Departemen Jasa Instalasi & Layanan Tukang · Head Office</div>
        </div>
        <div style="text-align: right; font-size: 9pt; color: #6b7280;">
          Tanggal: ${currentDateStr}
        </div>
      </div>

      <div>${bodyHtml}</div>

      <div class="signatures">
        <div class="sig-box">
          <div>Dibuat Oleh,</div>
          <div class="sig-line">Admin Operasional HO</div>
          <div style="font-size: 8.5pt; color: #6b7280;">Mitra10 Tukang</div>
        </div>
        <div class="sig-box">
          <div>Disetujui Oleh,</div>
          <div class="sig-line">Super User / Management</div>
          <div style="font-size: 8.5pt; color: #6b7280;">Mitra10 Tukang</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `)
  printWindow.document.close()
}
