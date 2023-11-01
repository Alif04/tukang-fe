export interface Position {
  id?: number
  position_name: string
  is_active: boolean
  created_at: string
  updated_at: string | null
  deleted_at: string | null
  created_by: number | null
}
