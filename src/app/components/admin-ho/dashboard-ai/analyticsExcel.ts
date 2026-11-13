import * as XLSX from 'xlsx'

export function isExcelRequest(text: string): boolean {
  return /\b(excel|xlsx)\b/i.test(text) && (/\b(buat(?:kan)?|bikin(?:kan)?|unduh|download|ekspor|export|simpan|ubah|jadikan|bentuk|format|file)\b/i.test(text) || /^\s*(excel|xlsx)\s*[?.!]*\s*$/i.test(text))
}

export function isExportableAnswer(text: string): boolean {
  return !!text.trim() && !text.startsWith('Saya belum mendapatkan data untuk menjawab.')
}

type Cell = string | number
const clean = (text: string) => text.replace(/\*\*/g, '').replace(/`/g, '').trim()

// Interpret Indonesian numeric formatting while preserving the displayed magnitude.
function parseNumber(text: string): number | null {
  const normalized = text.replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(normalized)) return null
  const value = Number(normalized)
  return Number.isFinite(value) ? value : null
}

function tableCell(text: string): Cell {
  const value = clean(text)
  const match = value.match(/^[~±≈]?\s*(?:Rp\s*)?([+-]?[\d.,]+)\s*(%)?$/i)
  if (!match) return value
  const number = parseNumber(match[1])
  return number === null ? value : match[2] ? number / 100 : number
}

export function createAnalyticsWorkbook(_question: string, answer: string): XLSX.WorkBook {
  const lines = answer.replace(/\r\n/g, '\n').split('\n')
  const tableLines = lines.filter(line => /^\s*\|.*\|\s*$/.test(line))
  let rows: Cell[][]
  const percentages: Array<[number, number]> = []
  if (tableLines.length >= 2) {
    rows = []
    tableLines.forEach(line => {
      const cells = line.trim().slice(1, -1).split('|').map(clean)
      if (cells.every(cell => /^:?-{3,}:?$/.test(cell))) return
      const rowIndex = rows.length
      rows.push(cells.map((value, columnIndex) => {
        const result = tableCell(value)
        if (typeof result === 'number' && /%\s*$/.test(value)) percentages.push([rowIndex, columnIndex])
        return result
      }))
    })
  } else {
    rows = [['Metrik', 'Nilai', 'Satuan']]
    const period = lines.map(clean).map(line => line.match(/^Periode\s*:\s*(.+?)(?:\s*\([^)]*\))?\s*$/i)).find(Boolean)
    if (period) rows.push(['Periode', period[1], ''])
    lines.forEach(line => {
      const item = clean(line).match(/^[-*•]\s*(.+?)\s*:\s*[~±≈]?\s*(Rp\s*)?([+-]?[\d.,]+)\s*(.*)$/i)
      if (!item) return
      const value = parseNumber(item[3])
      if (value === null) return
      const unit = item[2] ? 'Rp' : (item[4].match(/^(jam|hari|menit|detik|work\s*order|order|%)/i)?.[1] || '')
      rows.push([item[1].trim(), value, unit])
    })
  }
  const dataRows = tableLines.length >= 2 ? rows.length > 1 : rows.some(row => typeof row[1] === 'number')
  if (!dataRows) throw new Error('Tidak ada data terstruktur yang dapat diekspor dari laporan ini.')
  const sheet = XLSX.utils.aoa_to_sheet(rows)
  percentages.forEach(([row, col]) => { const cell = sheet[XLSX.utils.encode_cell({r: row, c: col})]; if (cell) cell.z = '0.00%' })
  sheet['!cols'] = Array.from({length: Math.max(3, ...rows.map(row => row.length))}, (_, i) => ({wch: i === 0 ? 36 : 24}))
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Data')
  return workbook
}

export function downloadAnalyticsWorkbook(question: string, answer: string): void {
  XLSX.writeFile(createAnalyticsWorkbook(question, answer), 'data-analisa-ai.xlsx')
}
