export interface Store {
  id?: number
  store_name: string
  address: string
  city_id: number
  zip_code: string
  created_at: string
  updated_at: string | null
  created_by: number | null
  updated_by: number | null
}
