import * as XLSX from 'xlsx'
import {createAnalyticsWorkbook, isExcelRequest, isExportableAnswer} from './analyticsExcel'

describe('Excel export for AI reports', () => {
  it('recognizes a request to download a report in Excel', () => {
    expect(isExcelRequest('Bisakah buatkan dalam bentuk excel?')).toBe(true)
    expect(isExcelRequest('unduh XLSX')).toBe(true)
    expect(isExcelRequest('Analisa transaksi bulan ini')).toBe(false)
    expect(isExportableAnswer('Saya belum mendapatkan data untuk menjawab. Silakan ajukan pertanyaan.')).toBe(false)
  })
  it('exports numeric duration and valid count without the narrative', () => {
    const answer = '**Periode: 1–13 November 2026 (bulan ini, sampai tanggal saat ini)**\n\nHasil ringkasan durasi pekerjaan:\n- **Rata-rata durasi:** ±6,32 jam per pekerjaan\n- **Jumlah data valid:** 55 work order (yang memiliki waktu mulai & selesai tercatat dengan benar)\n\n**Keterbatasan/catatan:**\n- Periode ini hanya mencakup 13 hari.'
    const book = createAnalyticsWorkbook('Pertanyaan tidak diekspor', answer)
    const rows = XLSX.utils.sheet_to_json<any[]>(book.Sheets.Data, {header: 1, defval: ''})
    expect(rows).toEqual([['Metrik', 'Nilai', 'Satuan'], ['Periode', '1–13 November 2026', ''], ['Rata-rata durasi', 6.32, 'jam'], ['Jumlah data valid', 55, 'work order']])
  })
  it('exports markdown tables as cells and rejects a report with no structured data', () => {
    const book = createAnalyticsWorkbook('', '| Metrik | April | Mei |\n|---|---|---|\n| Order | 226 | 229 |\n| Nilai | Rp28.045.000 | Rp36.163.000 |\n\nKeterangan tidak perlu diekspor.')
    expect(XLSX.utils.sheet_to_json<any[]>(book.Sheets.Data, {header: 1})).toEqual([['Metrik', 'April', 'Mei'], ['Order', 226, 229], ['Nilai', 28045000, 36163000]])
    expect(() => createAnalyticsWorkbook('', 'Tidak tersedia data.')).toThrow()
  })
})
