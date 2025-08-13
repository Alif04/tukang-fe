export interface Quotation {
  id: number | null

  order_id: number | null
  store_id: number | null

  quotation_status: number | null
  quotation_special: number
  description: string
  quotation_number: string
  quotation_date: string
  quotation_validity: string
  quotation_disc: number
  quotation_promotion: number | null
  quotation_grand_total: string

  readiness: number
  receipt_quotation: string

  quotation_receipt: Array<{
    index: number
    receipt_quotation: string
    quotation_step: number
  }>

  receipts_quotation: Array<{
    index: number
    receipt_quotation: string
    quotation_step: number
  }>

  promotion: {
    id: number
    name: string
    min_order: number
    promotion: string
    promotion_type: number
  }

  quotation_details: Array<{
    id: number | null
    index: string
    item_id: number | null
    work_order_item_id: number | null
    category_id: number | null
    type: number
    item_name: string
    unit_price: number
    unit: string
    description: string
    total: number
    final_price: number
    margin: number
    margin_type: number
    quantity: number
    is_user: number
    work_step?: number
  }>

  quotation_files: any[]
}

export interface DailyQuotation {
  quotation_follow_up: Array<{
    quotation_id: number | null
    follow_up_1: number
    follow_up_2: number
    follow_up_3: number
    description: string
  }>
}
