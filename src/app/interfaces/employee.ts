import {Position} from './position'
import {Store} from './store'

export interface Employee {
  id?: number

  position_id: number
  positions?: Position

  store_id: number
  store?: Store

  user_id: number
  user?: any

  first_name: string
  middle_name: string
  last_name: string
  full_name: string
  email: string
  birth: string
  gender: string
  nik: string
  phone_number: string
  whatsapp_number: string
  created_at: string
  updated_at: string | null
  created_by: number | null
}
