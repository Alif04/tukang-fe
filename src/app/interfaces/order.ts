import {Item} from './item'
import {Member} from './member'
import {Sales} from './sales'
import {Status} from './status'
import {Store} from './store'
import {Tukang} from './tukang'
import {Vendor} from './vendor'

interface OrderDetail {
  id?: number
  order_id: number

  item_id: number
  item?: Item

  order_status_id: number
  status?: Status

  unit: string
  unit_price: string
  quote_price: string
  quantity: string
  total: number | null
  survey_price: string
  comission: number | null
  created_by?: number
  updated_by?: number | null
  created_at?: string // Assuming this is a date string
  updated_at?: string | null // Assuming this is a date string or null
}

export interface Order {
  id?: number | null

  member_id: number | null
  members?: Member | null

  seles_id: number | null
  sales?: Sales | null

  store_id: number | null
  store?: Store | null

  project_status_id: number | null
  status?: Status | null

  vendor_id: number | null
  vendor?: Vendor | null

  tukang_id: number | null
  tukang?: Tukang | null

  project_address: string
  project_number: string
  receipt_number: string
  receipt_path: string
  request_survey: string
  total_estimate_workdays: number | null
  payment_type: string
  grand_total: string
  grand_total_comission: string
  print_counter: number | null
  created_by: number | null
  updated_by: number | null
  created_at: string

  complaints?: any[]
  work_orders?: any[]

  order_details: OrderDetail[]
}
