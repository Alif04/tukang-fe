export type AiSkillId =
  | 'auto'
  | 'order_and_revenue_analytics'
  | 'quotation_and_billing_report'
  | 'work_order_and_schedule'
  | 'vendor_sp_and_performance'
  | 'complaint_refund_and_warranty'
  | 'commission_and_incentive_report'

export interface TemporalContext {
  todayStr: string
  yesterdayStr: string
  thisWeekRange: string
  thisMonthStr: string
  thisMonthName: string
  lastMonthStr: string
  lastMonthName: string
  thisYear: number
  lastYear: number
  currentQuarter: string
  lastQuarter: string
  detectedTimeframe?:
    | 'today'
    | 'yesterday'
    | 'this_week'
    | 'this_month'
    | 'last_month'
    | 'this_quarter'
    | 'last_quarter'
    | 'this_year'
    | 'last_year'
    | 'all_time'
}

export interface SkillReportCatalogEntry {
  key: string
  title: string
  status: 'ready' | 'unavailable'
  sumber: string
  unavailableReason?: string
}

export interface AiSkillDefinition {
  id: AiSkillId
  title: string
  shortLabel: string
  badge: string
  description: string
  focusKeywords: string[]
  reports: SkillReportCatalogEntry[]
  samplePrompts: Array<{
    title: string
    desc: string
    prompt: string
  }>
  buildSkillPrompt: (context: {
    temporal: TemporalContext
    userPrompt: string
    dataSnapshot?: any
  }) => string
}
