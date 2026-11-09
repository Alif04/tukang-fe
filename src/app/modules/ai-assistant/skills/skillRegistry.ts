import { AiSkillDefinition, AiSkillId, SkillReportCatalogEntry, TemporalContext } from './types'
import {
  DEFAULT_BACKEND_POLICY_CONSTANTS,
  DEFAULT_VIOLATION_TYPES_15,
  buildDynamicDomainTraining,
  getTemporalContext,
} from './domainKnowledge'
import {
  classifyIntent,
  detectRequestedFormat,
  DocFormat,
  PromptIntent,
} from '../aiReplyParser'

export { classifyIntent, detectRequestedFormat }
export type { DocFormat, PromptIntent }

export const LIGHT_PROMPT = `Kamu adalah AI Report Assistant Mitra10 Tukang untuk Admin HO dan Super User.
Gunakan Bahasa Indonesia baku yang sopan dan ringkas (hanya huruf Latin).
Pengguna baru saja menyapa atau mengetes koneksi.
Jawab maksimal 2 kalimat singkat dan tawarkan 3 contoh permintaan berikut:
1. "Rekap order Juni sampai Oktober PDF" (Dokumen PDF Order & Omzet)
2. "SP vendor Q2 2026" (Evaluasi SP Vendor Kuartalan)
3. "Laporan komisi sales bulan ini Excel" (Spreadsheet Komisi Sales)
MODE DEFAULT: CHAT (JANGAN membuat blok <dokumen>).`

function formatSkillReportsGuidance(reports: SkillReportCatalogEntry[]): string {
  const ready = reports.filter((r) => r.status === 'ready')
  const unavailable = reports.filter((r) => r.status === 'unavailable')

  const readyLines =
    ready.length > 0
      ? ready.map((r) => `- [SIAP DIPAKAI] ${r.title} (${r.key}) -> sumber: ${r.sumber}`).join('\n')
      : '- (Tidak ada laporan siap pakai pada skill ini di Fase 1)'

  const unavailableLines =
    unavailable.length > 0
      ? unavailable
          .map(
            (r) =>
              `- [BELUM TERSEDIA - FASE 2] ${r.title} (${r.key}): ${
                r.unavailableReason || 'Menunggu perbaikan endpoint pada Fase 2.'
              }`
          )
          .join('\n')
      : ''

  return [
    'KATALOG LAPORAN PADA SKILL INI:',
    readyLines,
    unavailableLines
      ? `\nLAPORAN YANG BELUM TERSEDIA (WAJIB DIJAWAB "BELUM TERSEDIA", DILARANG MENGARANG ANGKA):\n${unavailableLines}`
      : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export const AI_SKILLS: Record<AiSkillId, AiSkillDefinition> = {
  auto: {
    id: 'auto',
    title: 'Auto-Detect (Orkestrator 6 Skill)',
    shortLabel: 'Auto-Detect',
    badge: 'Multi-Domain',
    description:
      'Mendeteksi maksud pertanyaan secara otomatis dan memilih salah satu dari 6 skill laporan yang relevan.',
    focusKeywords: [],
    reports: [],
    samplePrompts: [
      {
        title: 'Rekap Order Juni s/d Oktober (PDF)',
        desc: 'Tarik rekapitulasi order dan omzet lintas bulan dalam dokumen PDF.',
        prompt: 'Buatkan rekap order Juni sampai Oktober pdf.',
      },
      {
        title: 'Evaluasi SP Vendor Q2 2026',
        desc: 'Audit daftar SP aktif, matriks kuartalan Q1-Q4, dan log poin pelanggaran vendor.',
        prompt: 'Tampilkan evaluasi SP vendor Q2 2026 beserta rincian poin pelanggarannya.',
      },
      {
        title: 'Laporan Komisi Sales & Daerah Terlaris',
        desc: 'Analisis komisi sales dan distribusi transaksi per wilayah.',
        prompt: 'Bagaimana ringkasan laporan komisi sales dan daerah terlaris bulan ini?',
      },
    ],
    buildSkillPrompt: ({ temporal }) =>
      `SKILL MODE: AUTO-DETECT / ORKESTRATOR\nPeriode referensi default: ${temporal.thisMonthName}. Gunakan hanya katalog laporan yang berstatus SIAP DIPAKAI dari backend.`,
  },

  order_and_revenue_analytics: {
    id: 'order_and_revenue_analytics',
    title: 'Analitik Order, Omzet & Daerah Terlaris',
    shortLabel: 'Order & Omzet',
    badge: 'Order & Revenue',
    description:
      'Mencakup Rekap Order (reports/orders), Daftar Order (orders), Daerah Terlaris, dan Toko Jasa Instalasi.',
    focusKeywords: [
      'rekap order',
      'laporan order',
      'order',
      'pesanan',
      'omzet',
      'daerah terlaris',
      'area terlaris',
      'toko jasa instalasi',
      'jasa instalasi',
    ],
    reports: [
      {
        key: 'reports_orders',
        title: 'Rekap Laporan Order (reports/orders)',
        status: 'ready',
        sumber: 'ReportsService.reportOrder',
      },
      {
        key: 'orders',
        title: 'Daftar Transaksi Order Operasional (orders)',
        status: 'ready',
        sumber: 'OrderService.findAll',
      },
      {
        key: 'daerah_terlaris',
        title: 'Laporan Daerah / Area Terlaris (reports/daerah-terlaris)',
        status: 'ready',
        sumber: 'ReportsService.daerahTerlarisReport',
      },
      {
        key: 'toko_jasa_instalasi',
        title: 'Laporan Toko & Jasa Instalasi (reports/toko-jasa-instalasi)',
        status: 'ready',
        sumber: 'ReportsService.tokoJasaInstalasiReport',
      },
    ],
    samplePrompts: [
      {
        title: 'Rekap Order Juni sampai Oktober PDF',
        desc: 'Unduh laporan rekapitulasi order dan nilai transaksi periode Juni - Oktober.',
        prompt: 'rekap order Juni sampai Oktober pdf',
      },
      {
        title: 'Daerah & Area Terlaris Tahun Ini',
        desc: 'Peringkat wilayah dengan pengajuan instalasi dan nilai transaksi tertinggi.',
        prompt: 'Tampilkan laporan daerah terlaris dan toko jasa instalasi tertinggi tahun ini.',
      },
      {
        title: 'Distribusi Status Order Bulan Berjalan',
        desc: 'Cek jumlah order baru, menunggu survey, berjalan, dan selesai.',
        prompt: 'Bagaimana distribusi status order pelanggan pada bulan ini?',
      },
    ],
    buildSkillPrompt: function ({ temporal }) {
      return `SKILL MODE: ANALITIK ORDER, OMZET & TOKO (Periode default: ${temporal.thisMonthName})\n${formatSkillReportsGuidance(
        this.reports
      )}`
    },
  },

  quotation_and_billing_report: {
    id: 'quotation_and_billing_report',
    title: 'Laporan Quotation, Invoice & Tagihan',
    shortLabel: 'Quotation & Invoice',
    badge: 'Billing & SLA',
    description:
      'Mencakup laporan Invoice Paid/Unpaid, Pending Payment, Rekap Quotation, dan Daily Follow-Up Quotation.',
    focusKeywords: [
      'invoice',
      'invoice paid',
      'invoice unpaid',
      'pending payment',
      'tagihan',
      'quotation',
      'penawaran',
      'rab',
      'lunas',
      'belum lunas',
    ],
    reports: [
      {
        key: 'invoices_paid_unpaid',
        title: 'Laporan Invoice Paid, Unpaid & Pending Payment',
        status: 'unavailable',
        sumber: 'ReportsService.reportOrderDetails (Menunggu Fase 2)',
        unavailableReason:
          'Laporan Invoice (Paid / Unpaid / Pending Payment) sedang dalam standarisasi filter & agregasi server pada Fase 2 sehingga belum tersedia saat ini.',
      },
      {
        key: 'quotation_report',
        title: 'Laporan Rekap Quotation & Daily Follow-Up',
        status: 'unavailable',
        sumber: 'QuotationService.findAll (Menunggu Fase 2)',
        unavailableReason:
          'Laporan Rekap Quotation & Daily Follow-Up dijadwalkan pada perbaikan Fase 2 sehingga belum tersedia saat ini.',
      },
    ],
    samplePrompts: [
      {
        title: 'Cek Status Laporan Invoice Paid',
        desc: 'Verifikasi ketersediaan laporan invoice paid/unpaid di katalog Fase 1.',
        prompt: 'invoice paid',
      },
      {
        title: 'Aturan SLA Quotation H+2 & H+3',
        desc: 'Penjelasan aturan batas kirim quotation pasca survey dan poin pelanggarannya.',
        prompt: 'Jelaskan aturan SLA pengiriman quotation pasca survey selesai beserta poin penaltinya.',
      },
    ],
    buildSkillPrompt: function () {
      return `SKILL MODE: QUOTATION, INVOICE & TAGIHAN\n${formatSkillReportsGuidance(this.reports)}`
    },
  },

  work_order_and_schedule: {
    id: 'work_order_and_schedule',
    title: 'Laporan Work Order, Reschedule & Remedial',
    shortLabel: 'Work Order & Jadwal',
    badge: 'SPK & Lapangan',
    description:
      'Mencakup Daftar Work Order (work-orders), Pengajuan Reschedule, dan Pengerjaan Ulang / Remedial.',
    focusKeywords: [
      'work order',
      'wo',
      'spk',
      'reschedule',
      'jadwal ulang',
      'remedial',
      'perbaikan ulang',
      'produktivitas tukang',
      'laporan tukang',
    ],
    reports: [
      {
        key: 'work_orders',
        title: 'Daftar Work Order / SPK (work-orders)',
        status: 'ready',
        sumber: 'WorkOrdersService.findAll',
      },
      {
        key: 'reschedule',
        title: 'Daftar Pengajuan Reschedule (reschedule)',
        status: 'ready',
        sumber: 'RescheduleService.findAll',
      },
      {
        key: 'remedials',
        title: 'Daftar Pengerjaan Ulang / Remedial (remedials)',
        status: 'ready',
        sumber: 'RemedialsService.findAll',
      },
      {
        key: 'tukang_productivity',
        title: 'Laporan Produktivitas Tukang (reports/tukang)',
        status: 'unavailable',
        sumber: 'ReportsService.reportTukang (Menunggu Fase 2)',
        unavailableReason:
          'Laporan Produktivitas Tukang (reports/tukang) sedang dalam penyesuaian filter pada Fase 2 sehingga belum tersedia saat ini.',
      },
    ],
    samplePrompts: [
      {
        title: 'Monitoring Work Order & Reschedule',
        desc: 'Rekapitulasi SPK berjalan dan pengajuan jadwal ulang bulan ini.',
        prompt: 'Tampilkan ringkasan Work Order dan daftar pengajuan Reschedule bulan ini.',
      },
      {
        title: 'Daftar Pengerjaan Ulang (Remedial)',
        desc: 'Evaluasi tiket remedial yang sedang ditangani vendor.',
        prompt: 'Buatkan laporan daftar pengerjaan ulang (remedial) yang tercatat di sistem.',
      },
    ],
    buildSkillPrompt: function () {
      return `SKILL MODE: WORK ORDER, RESCHEDULE & REMEDIAL\n${formatSkillReportsGuidance(this.reports)}`
    },
  },

  vendor_sp_and_performance: {
    id: 'vendor_sp_and_performance',
    title: 'Evaluasi SP Vendor, Pelanggaran & Performa',
    shortLabel: 'SP & Performa Vendor',
    badge: 'Disiplin Vendor',
    description:
      'Mencakup Daftar SP Vendor, Ringkasan SP Kuartalan, Matriks Q1-Q4, Log 15 Jenis Pelanggaran, dan Profil Vendor.',
    focusKeywords: [
      'sp',
      'surat peringatan',
      'sp1',
      'sp2',
      'sp3',
      'pelanggaran',
      'violation',
      'poin',
      'suspend',
      'vendor',
      'matriks sp',
    ],
    reports: [
      {
        key: 'vendor_sp_list',
        title: 'Daftar Surat Peringatan Vendor (vendor-sp)',
        status: 'ready',
        sumber: 'VendorSpService.findAll',
      },
      {
        key: 'vendor_sp_summary',
        title: 'Ringkasan Eksekutif SP Vendor per Kuartal (vendor-sp/summary)',
        status: 'ready',
        sumber: 'VendorSpService.findAll',
      },
      {
        key: 'vendor_sp_matrix',
        title: 'Matriks Status SP & Poin Kuartalan Q1-Q4 Vendor (vendor-sp/matrix)',
        status: 'ready',
        sumber: 'VendorService.findAll',
      },
      {
        key: 'vendor_violations',
        title: 'Log Pelanggaran & Poin Pinalti Vendor (vendor-violation/logs)',
        status: 'ready',
        sumber: 'VendorViolationService.findAllViolationLogs',
      },
      {
        key: 'vendor',
        title: 'Daftar Master & Performa Vendor (vendor)',
        status: 'ready',
        sumber: 'VendorService.findAll',
      },
    ],
    samplePrompts: [
      {
        title: 'Evaluasi SP Vendor Q2 2026',
        desc: 'Tampilkan daftar SP1/SP2/SP3, matriks poin, dan log pelanggaran pada Q2 2026.',
        prompt: 'SP vendor Q2 2026',
      },
      {
        title: 'Laporan PDF Evaluasi SP & Pelanggaran Vendor',
        desc: 'Cetak dokumen resmi evaluasi disiplin vendor kuartal berjalan.',
        prompt: 'Buatkan laporan evaluasi SP vendor dan log pelanggaran kuartal ini dalam format PDF.',
      },
      {
        title: 'Daftar 15 Jenis Pelanggaran & Ambang SP',
        desc: 'Rincian aturan SP1 (1-25), SP2 (26-50), SP3 (>50) beserta poin per jenis pelanggaran.',
        prompt: 'Jelaskan tabel 15 jenis pelanggaran vendor beserta ambang batas poin SP1, SP2, dan SP3.',
      },
    ],
    buildSkillPrompt: function () {
      return [
        `SKILL MODE: EVALUASI SP VENDOR, PELANGGARAN & PERFORMA`,
        formatSkillReportsGuidance(this.reports),
        buildDynamicDomainTraining(DEFAULT_BACKEND_POLICY_CONSTANTS, DEFAULT_VIOLATION_TYPES_15),
      ].join('\n\n')
    },
  },

  complaint_refund_and_warranty: {
    id: 'complaint_refund_and_warranty',
    title: 'Laporan Komplain, Refund, Garansi & CSI',
    shortLabel: 'Komplain & Refund',
    badge: 'Kualitas Layanan',
    description:
      'Mencakup Laporan Komplain Pelanggan, Refund, Penalti Vendor, Klaim Garansi, dan Survei Kepuasan (CSI).',
    focusKeywords: [
      'komplain',
      'complaint',
      'keluhan',
      'refund',
      'pengembalian dana',
      'penalti',
      'garansi',
      'warranty',
      'csi',
      'kepuasan pelanggan',
    ],
    reports: [
      {
        key: 'complaints_report',
        title: 'Laporan Komplain Pelanggan (reports/complaints)',
        status: 'unavailable',
        sumber: 'ReportsService.reportComplaint (Menunggu Fase 2)',
        unavailableReason:
          'Laporan Komplain Pelanggan sedang dalam perbaikan filter tanggal & agregasi server pada Fase 2 sehingga belum tersedia saat ini.',
      },
      {
        key: 'refund_penalty_voucher',
        title: 'Laporan Refund, Penalti Vendor & Klaim Garansi',
        status: 'unavailable',
        sumber: 'RefundService.findAll (Menunggu Fase 2)',
        unavailableReason:
          'Laporan Refund, Penalti Vendor & Klaim Garansi dijadwalkan pada Fase 2 sehingga belum tersedia saat ini.',
      },
      {
        key: 'csi_report',
        title: 'Laporan Customer Satisfaction Index (CSI)',
        status: 'unavailable',
        sumber: 'ReportsService.csiReport (Menunggu Fase 2)',
        unavailableReason:
          'Laporan Customer Satisfaction Index (CSI) belum memiliki endpoint agregasi server dan dijadwalkan pada Fase 2.',
      },
    ],
    samplePrompts: [
      {
        title: 'Cek Status Laporan Komplain & Refund',
        desc: 'Informasi status ketersediaan modul laporan komplain dan refund.',
        prompt: 'Bagaimana status laporan komplain dan refund pelanggan bulan ini?',
      },
    ],
    buildSkillPrompt: function () {
      return `SKILL MODE: KOMPLAIN, REFUND, GARANSI & CSI\n${formatSkillReportsGuidance(this.reports)}`
    },
  },

  commission_and_incentive_report: {
    id: 'commission_and_incentive_report',
    title: 'Laporan Komisi Sales, Komisi Toko & Insentif',
    shortLabel: 'Komisi & Insentif',
    badge: 'Insentif & Komisi',
    description:
      'Mencakup Laporan Komisi Sales (reports/sales-comission) serta informasi Komisi Toko & Rekonsiliasi Komisi.',
    focusKeywords: [
      'komisi',
      'comission',
      'commission',
      'insentif',
      'sales comission',
      'komisi sales',
      'komisi toko',
      'store comission',
      'rekon komisi',
    ],
    reports: [
      {
        key: 'sales_comission',
        title: 'Laporan Komisi Sales (reports/sales-comission)',
        status: 'ready',
        sumber: 'ReportsService.salesComissionReport',
      },
      {
        key: 'store_comission_report',
        title: 'Laporan Komisi Toko & Rekon Komisi (reports/store-comission)',
        status: 'unavailable',
        sumber: 'ReportsService.storeComissionReport (Menunggu Fase 2)',
        unavailableReason:
          'Laporan Komisi Toko & Rekon Komisi sedang dalam perbaikan parameter filter pada Fase 2 sehingga belum tersedia saat ini. Gunakan Laporan Komisi Sales (sales-comission) yang sudah siap.',
      },
    ],
    samplePrompts: [
      {
        title: 'Rekap Komisi Sales Bulan Ini (Excel)',
        desc: 'Unduh tabel perhitungan komisi sales toko dalam format spreadsheet Excel.',
        prompt: 'Buatkan laporan komisi sales bulan ini dalam format Excel.',
      },
      {
        title: 'Ringkasan Insentif Sales',
        desc: 'Lihat total nominal insentif sales yang tercatat pada periode berjalan.',
        prompt: 'Tampilkan ringkasan komisi sales untuk bulan berjalan.',
      },
    ],
    buildSkillPrompt: function () {
      return `SKILL MODE: KOMISI SALES, KOMISI TOKO & INSENTIF\n${formatSkillReportsGuidance(this.reports)}`
    },
  },
}

export function detectSkillFromPrompt(userPrompt: string): AiSkillId {
  const q = String(userPrompt || '').toLowerCase()

  const skillOrder: Array<Exclude<AiSkillId, 'auto'>> = [
    'vendor_sp_and_performance',
    'quotation_and_billing_report',
    'complaint_refund_and_warranty',
    'commission_and_incentive_report',
    'work_order_and_schedule',
    'order_and_revenue_analytics',
  ]

  let bestSkill: AiSkillId = 'order_and_revenue_analytics'
  let bestScore = 0

  for (const id of skillOrder) {
    const def = AI_SKILLS[id]
    let score = 0
    for (const kw of def.focusKeywords) {
      if (q.includes(kw)) {
        score += kw.includes(' ') ? 3 : 1
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestSkill = id
    }
  }

  return bestScore > 0 ? bestSkill : 'auto'
}

export function buildMasterSystemPrompt(params: {
  activeSkillId: AiSkillId
  userPrompt: string
  snapshot?: any
}): {
  systemPrompt: string
  effectiveSkill: AiSkillDefinition
  temporal: TemporalContext
  requestedFormat: DocFormat | null
  intent: PromptIntent
} {
  const { activeSkillId, userPrompt } = params
  const temporal = getTemporalContext(userPrompt)
  const requestedFormat = detectRequestedFormat(userPrompt)
  const intent = classifyIntent(userPrompt)

  const resolvedId =
    activeSkillId && activeSkillId !== 'auto' && AI_SKILLS[activeSkillId]
      ? activeSkillId
      : detectSkillFromPrompt(userPrompt)
  const effectiveSkill = AI_SKILLS[resolvedId] || AI_SKILLS.order_and_revenue_analytics

  if (intent === 'smalltalk') {
    return {
      systemPrompt: LIGHT_PROMPT,
      effectiveSkill,
      temporal,
      requestedFormat: null,
      intent,
    }
  }

  const skillSpecificGuidance = effectiveSkill.buildSkillPrompt({
    temporal,
    userPrompt,
  })

  const systemPrompt = [
    '# ATURAN KELUARAN AI REPORT ASSISTANT MITRA10 TUKANG',
    '- Bahasa Indonesia baku, huruf Latin saja, format tanggal "7 November 2026", mata uang "Rp 1.250.000".',
    '- Hanya gunakan data yang disuplai oleh backend relay (/reports/ai-chat). Dilarang mengarang angka.',
    '- Jika laporan berstatus BELUM TERSEDIA, nyatakan secara eksplisit bahwa laporan tersebut belum tersedia hingga Fase 2.',
    skillSpecificGuidance,
    requestedFormat ? `Format diminta pengguna: ${requestedFormat}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  return { systemPrompt, effectiveSkill, temporal, requestedFormat, intent }
}
