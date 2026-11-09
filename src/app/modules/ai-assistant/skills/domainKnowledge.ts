import { TemporalContext } from './types'

const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

export function formatTanggalIndonesia(date: Date = new Date()): string {
  return `${date.getDate()} ${MONTH_NAMES_ID[date.getMonth()]} ${date.getFullYear()}`
}

export function getTemporalContext(userPrompt = ''): TemporalContext {
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)

  const yesterdayDate = new Date(now)
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterdayStr = yesterdayDate.toISOString().slice(0, 10)

  const thisYear = now.getFullYear()
  const thisMonthIdx = now.getMonth()
  const thisMonthStr = `${thisYear}-${String(thisMonthIdx + 1).padStart(2, '0')}`
  const thisMonthName = `${MONTH_NAMES_ID[thisMonthIdx]} ${thisYear}`

  const lastMonthDate = new Date(thisYear, thisMonthIdx - 1, 1)
  const lastMonthYear = lastMonthDate.getFullYear()
  const lastMonthIdx = lastMonthDate.getMonth()
  const lastMonthStr = `${lastMonthYear}-${String(lastMonthIdx + 1).padStart(2, '0')}`
  const lastMonthName = `${MONTH_NAMES_ID[lastMonthIdx]} ${lastMonthYear}`

  const currentQuarterNum = Math.floor(thisMonthIdx / 3) + 1
  const currentQuarter = `Q${currentQuarterNum} ${thisYear}`
  const lastQuarterNum = currentQuarterNum === 1 ? 4 : currentQuarterNum - 1
  const lastQuarterYear = currentQuarterNum === 1 ? thisYear - 1 : thisYear
  const lastQuarter = `Q${lastQuarterNum} ${lastQuarterYear}`

  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const mondayDate = new Date(now)
  mondayDate.setDate(mondayDate.getDate() + mondayOffset)
  const thisWeekRange = `${mondayDate.toISOString().slice(0, 10)} s/d ${todayStr}`

  const promptLower = userPrompt.toLowerCase()
  let detectedTimeframe: TemporalContext['detectedTimeframe'] = 'all_time'

  if (promptLower.includes('hari ini') || promptLower.includes('today')) {
    detectedTimeframe = 'today'
  } else if (promptLower.includes('kemarin') || promptLower.includes('yesterday')) {
    detectedTimeframe = 'yesterday'
  } else if (
    promptLower.includes('minggu ini') ||
    promptLower.includes('this week') ||
    promptLower.includes('7 hari')
  ) {
    detectedTimeframe = 'this_week'
  } else if (
    promptLower.includes('bulan lalu') ||
    promptLower.includes('last month') ||
    promptLower.includes(lastMonthName.toLowerCase())
  ) {
    detectedTimeframe = 'last_month'
  } else if (
    promptLower.includes('bulan ini') ||
    promptLower.includes('this month') ||
    promptLower.includes(thisMonthName.toLowerCase())
  ) {
    detectedTimeframe = 'this_month'
  } else if (
    promptLower.includes('kuartal lalu') ||
    promptLower.includes('last quarter') ||
    promptLower.includes(lastQuarter.toLowerCase())
  ) {
    detectedTimeframe = 'last_quarter'
  } else if (
    promptLower.includes('kuartal ini') ||
    promptLower.includes('this quarter') ||
    promptLower.includes(currentQuarter.toLowerCase())
  ) {
    detectedTimeframe = 'this_quarter'
  } else if (promptLower.includes('tahun lalu') || promptLower.includes('last year')) {
    detectedTimeframe = 'last_year'
  } else if (promptLower.includes('tahun ini') || promptLower.includes('this year')) {
    detectedTimeframe = 'this_year'
  }

  return {
    todayStr,
    yesterdayStr,
    thisWeekRange,
    thisMonthStr,
    thisMonthName,
    lastMonthStr,
    lastMonthName,
    thisYear,
    lastYear: thisYear - 1,
    currentQuarter,
    lastQuarter,
    detectedTimeframe,
  }
}

export interface ViolationTypePolicyItem {
  code: string
  name: string
  point: number
  category: string
}

export interface SpAndSlaPolicyConstants {
  statusNote: string
  evaluationPeriod: string
  spLevels: {
    SP1: { minPoint: number; maxPoint: number; allocationReductionPercent: number; sanction: string }
    SP2: { minPoint: number; maxPoint: number; allocationReductionPercent: number; sanction: string }
    SP3: { minPoint: number; maxPoint: number | null; allocationReductionPercent: number; sanction: string }
  }
  warningThresholdPercentage: number
  warningThresholds: {
    towardsSp2: number
    towardsSp3: number
  }
  quotationSla: {
    lateH2Days: number
    lateH3Days: number
    validityDays: number
    draftStopsTimer: boolean
  }
  warrantyDays: number
}

export const DEFAULT_BACKEND_POLICY_CONSTANTS: SpAndSlaPolicyConstants = {
  statusNote: 'MENUNGGU KONFIRMASI BISNIS',
  evaluationPeriod: 'Kuartalan (Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Okt-Des)',
  spLevels: {
    SP1: {
      minPoint: 1,
      maxPoint: 25,
      allocationReductionPercent: 50,
      sanction: 'Surat Peringatan 1 & pemotongan alokasi order 50%',
    },
    SP2: {
      minPoint: 26,
      maxPoint: 50,
      allocationReductionPercent: 75,
      sanction: 'Surat Peringatan 2 & pemotongan alokasi order 75%',
    },
    SP3: {
      minPoint: 51,
      maxPoint: null,
      allocationReductionPercent: 100,
      sanction: 'Surat Peringatan 3 & suspend/nonaktif sementara (alokasi dipotong 100%)',
    },
  },
  warningThresholdPercentage: 70,
  warningThresholds: {
    towardsSp2: 19,
    towardsSp3: 36,
  },
  quotationSla: {
    lateH2Days: 2,
    lateH3Days: 3,
    validityDays: 8,
    draftStopsTimer: false,
  },
  warrantyDays: 7,
}

export const DEFAULT_VIOLATION_TYPES_15: ViolationTypePolicyItem[] = [
  { code: 'ORDER_NOT_RESPONDED', name: 'Tidak Merespon Order', point: 3, category: 'ORDER' },
  { code: 'ORDER_REJECTED', name: 'Menolak Order', point: 5, category: 'ORDER' },
  { code: 'SURVEY_LATE', name: 'Terlambat Survey', point: 3, category: 'SURVEY' },
  { code: 'QUOTATION_LATE_H2', name: 'Terlambat Kirim Quotation H+2', point: 2, category: 'QUOTATION' },
  { code: 'QUOTATION_LATE_H3', name: 'Terlambat Kirim Quotation H+3', point: 5, category: 'QUOTATION' },
  { code: 'RESCHEDULE_BY_VENDOR', name: 'Reschedule oleh Vendor', point: 2, category: 'WORK_ORDER' },
  { code: 'WORK_LATE', name: 'Terlambat Pengerjaan (Work Order)', point: 5, category: 'WORK_ORDER' },
  { code: 'BAST_NO_EVIDENCE', name: 'BAST Tanpa Foto Bukti (Evidence)', point: 3, category: 'BAST' },
  { code: 'COMPLAINT_VALID', name: 'Komplain Terbukti Valid', point: 5, category: 'COMPLAINT' },
  { code: 'REMEDIAL_REPEAT', name: 'Remedial Berulang', point: 5, category: 'COMPLAINT' },
  { code: 'WARRANTY_REJECTED', name: 'Menolak Klaim Garansi Valid', point: 10, category: 'WARRANTY' },
  { code: 'SOP_VIOLATION', name: 'Pelanggaran SOP Lapangan / K3', point: 5, category: 'SOP' },
  { code: 'OFF_PLATFORM_TRANSACTION', name: 'Transaksi di Luar Platform (Bypass)', point: 25, category: 'FRAUD' },
  { code: 'FAKE_DOCUMENT', name: 'Pemalsuan Dokumen / Bukti Pekerjaan', point: 25, category: 'FRAUD' },
  { code: 'CUSTOMER_ABUSE', name: 'Perilaku Buruk terhadap Pelanggan', point: 15, category: 'ETIKA' },
]

export function buildDynamicDomainTraining(
  rules: SpAndSlaPolicyConstants = DEFAULT_BACKEND_POLICY_CONSTANTS,
  violationTypes: ViolationTypePolicyItem[] = DEFAULT_VIOLATION_TYPES_15
): string {
  const { spLevels, warningThresholdPercentage, warningThresholds, quotationSla, warrantyDays, statusNote } = rules
  const violationListText = violationTypes
    .map((v, i) => `   ${i + 1}. ${v.code} (${v.name}): +${v.point} poin [${v.category}]`)
    .join('\n')

  return `
KORPUS PENGETAHUAN UTAMA SISTEM MITRA10 TUKANG (SUMBER KEBENARAN KONSTANTA BACKEND [${statusNote}]):

1. PENGENALAN SISTEM & HAK AKSES:
- Fitur AI Report Assistant hanya diperuntukkan bagi Admin HO dan Super User (divalidasi di backend).
- Pengambilan dan penyaringan data laporan dilakukan langsung oleh backend (relay /reports/ai-chat).

2. ALUR KERJA END-TO-END PEKERJAAN:
Order Baru di Toko → Penugasan Vendor (vendor_store) → Survey Lokasi (SURVEYDONE) → Input & Submit Quotation → Pembayaran Invoice → Terbit Work Order (WO) → Penugasan Tukang → Pelaksanaan & Upload BAST (WORKEND/DONE) → Masa Garansi (${warrantyDays} hari) & CSI.

3. ATURAN SLA QUOTATION [${statusNote}]:
- Pasca SURVEYDONE, keterlambatan pengiriman Quotation pada H+${quotationSla.lateH2Days} (QUOTATION_LATE_H2) dan H+${quotationSla.lateH3Days} (QUOTATION_LATE_H3) otomatis dikenai poin pelanggaran.
- Masa berlaku penawaran (Quotation validity): ${quotationSla.validityDays} hari.
- Status "Draft" atau "Revisi" ${quotationSla.draftStopsTimer ? 'menghentikan' : 'TIDAK MENGHENTIKAN'} hitungan waktu SLA sistem.

4. ATURAN EVALUASI SURAT PERINGATAN (SP) VENDOR [${statusNote}]:
- Evaluasi dilakukan per kuartal (${rules.evaluationPeriod}):
  * SP1 (${spLevels.SP1.minPoint} s/d ${spLevels.SP1.maxPoint} Poin): ${spLevels.SP1.sanction}.
  * SP2 (${spLevels.SP2.minPoint} s/d ${spLevels.SP2.maxPoint} Poin): ${spLevels.SP2.sanction}.
  * SP3 (>= ${spLevels.SP3.minPoint} Poin): ${spLevels.SP3.sanction}.
- Ambang Peringatan Dini (${warningThresholdPercentage}%): menuju SP2 pada ${warningThresholds.towardsSp2} poin, menuju SP3 pada ${warningThresholds.towardsSp3} poin.

5. DAFTAR ${violationTypes.length} JENIS PELANGGARAN VENDOR (vendor_violation_type):
${violationListText}

6. STANDAR PENULISAN:
- Gunakan karakter panah Unicode standar (→) untuk alur pekerjaan. DILARANG menggunakan notasi LaTeX math atau HTML <br>.
`.trim()
}

export const MITRA10_CORE_DOMAIN_TRAINING = buildDynamicDomainTraining()
