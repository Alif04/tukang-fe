import {Tukang} from './tukang'

export interface WorkOrder {
  id?: number | null
  order_id: number | null
  vendor_id: number | null
  tukang_id: Tukang[]

  request_work_time: string
  survey_date: string

  work_order_status: number | null
  complaint_status: number | null

  work_start_date: string
  work_end_date: string

  [key: string]: any
}
