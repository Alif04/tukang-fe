export interface LiveChatRoomLike {
  id?: number | string | null
  room_id?: number | string | null
  type?: string | null
  orderId?: string | number | null
  order_id?: string | number | null
  storeId?: string | number | null
  store_id?: string | number | null
  storeName?: string | null
  store_name?: string | null
  vendorId?: string | number | null
  vendor_id?: string | number | null
  vendorName?: string | null
  vendor_name?: string | null
  store?: {
    id?: string | number | null
    name?: string | null
    storeName?: string | null
    store_name?: string | null
  } | null
  vendor?: {
    id?: string | number | null
    name?: string | number | null
    vendorName?: string | null
    vendor_name?: string | null
    company_name?: string | null
  } | null
}

export type LiveChatRoomType = 'ORDER' | 'DIRECT_STORE' | 'DIRECT_VENDOR'

interface NormalizeLiveChatRoomOptions {
  fallbackType?: LiveChatRoomType
  fallbackStoreId?: string | number | null
  fallbackStoreName?: string | null
  fallbackVendorId?: string | number | null
  fallbackVendorName?: string | number | null
}

// ── Store & Vendor normalization helpers ──────────────────────────────────────

export interface NormalizedStore {
  id: string | number
  store_name: string
}

export interface NormalizedVendor {
  id: string | number
  company_name: string
}

/**
 * Normalize a raw store object from API to a consistent shape.
 * Handles various field name formats from different API versions.
 */
export const normalizeStore = (store: any): NormalizedStore | null => {
  if (!store) return null

  const id =
    store.id ?? store.store_id ?? store.storeId ?? store['store.id'] ?? null
  if (!id) return null

  const idStr = String(id)
  const store_name =
    store.store_name ??
    store.storeName ??
    store.name ??
    store.company_name ??
    (idStr ? `Store ${idStr}` : null)

  return { id: idStr, store_name: String(store_name) }
}

/**
 * Normalize a raw vendor object from API to a consistent shape.
 * Handles various field name formats from different API versions.
 */
export const normalizeVendor = (vendor: any): NormalizedVendor | null => {
  if (!vendor) return null

  const id =
    vendor.id ??
    vendor.vendor_id ??
    vendor.vendorId ??
    vendor['vendor.id'] ??
    null
  if (!id) return null

  const idStr = String(id)
  const company_name =
    vendor.company_name ??
    vendor.companyName ??
    vendor.name ??
    vendor.vendor_name ??
    vendor.vendorName ??
    (idStr ? `Vendor ${idStr}` : null)

  return { id: idStr, company_name: String(company_name) }
}


const hasValue = (value: unknown): boolean => {
  if (value === undefined || value === null) return false
  if (typeof value === 'string') return value.trim().length > 0
  return true
}

const normalizeLabel = (value: unknown): string | null => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return null
}

const pickFirstValue = (...values: unknown[]) => {
  for (const value of values) {
    if (hasValue(value)) return value
  }

  return undefined
}

const pickFirstLabel = (...values: unknown[]): string | null => {
  for (const value of values) {
    const label = normalizeLabel(value)
    if (label) return label
  }

  return null
}

const normalizeRoomType = (
  type: unknown,
  orderId: unknown,
  storeId: unknown,
  vendorId: unknown,
  fallbackType?: LiveChatRoomType
): LiveChatRoomType | undefined => {
  const explicitType = normalizeLabel(type)?.toUpperCase()

  if (
    explicitType === 'ORDER' ||
    explicitType === 'DIRECT_STORE' ||
    explicitType === 'DIRECT_VENDOR'
  ) {
    return explicitType as LiveChatRoomType
  }

  if (fallbackType) return fallbackType
  if (hasValue(orderId)) return 'ORDER'
  if (hasValue(storeId) && !hasValue(vendorId)) return 'DIRECT_STORE'
  if (hasValue(vendorId) && !hasValue(storeId)) return 'DIRECT_VENDOR'

  return undefined
}

export const normalizeLiveChatRoom = (
  room: LiveChatRoomLike,
  options: NormalizeLiveChatRoomOptions = {}
): LiveChatRoomLike => {
  const normalizedId = pickFirstValue(room.id, room.room_id)
  const normalizedOrderId = pickFirstValue(room.orderId, room.order_id)
  const normalizedStoreId = pickFirstValue(
    room.storeId,
    room.store_id,
    room.store?.id,
    options.fallbackStoreId
  )
  const normalizedVendorId = pickFirstValue(
    room.vendorId,
    room.vendor_id,
    room.vendor?.id,
    options.fallbackVendorId
  )
  const normalizedStoreName = pickFirstLabel(
    room.storeName,
    room.store_name,
    room.store?.storeName,
    room.store?.store_name,
    room.store?.name,
    options.fallbackStoreName
  )
  const normalizedVendorName = pickFirstLabel(
    room.vendorName,
    room.vendor_name,
    room.vendor?.vendorName,
    room.vendor?.vendor_name,
    room.vendor?.company_name,
    room.vendor?.name,
    options.fallbackVendorName
  )
  const normalizedType = normalizeRoomType(
    room.type,
    normalizedOrderId,
    normalizedStoreId,
    normalizedVendorId,
    options.fallbackType
  )

  const normalizedRoom: LiveChatRoomLike = { ...room }

  if (hasValue(normalizedId)) normalizedRoom.id = normalizedId as number | string
  if (hasValue(normalizedOrderId)) normalizedRoom.orderId = normalizedOrderId as string | number
  if (hasValue(normalizedStoreId)) normalizedRoom.storeId = normalizedStoreId as string | number
  if (hasValue(normalizedVendorId)) normalizedRoom.vendorId = normalizedVendorId as string | number
  if (normalizedStoreName) {
    normalizedRoom.storeName = room.storeName || normalizedStoreName
    normalizedRoom.store_name = room.store_name || normalizedStoreName
  }
  if (normalizedVendorName) {
    normalizedRoom.vendorName = room.vendorName || normalizedVendorName
    normalizedRoom.vendor_name = room.vendor_name || normalizedVendorName
  }
  if (normalizedType) normalizedRoom.type = normalizedType

  if (room.store || hasValue(normalizedStoreId) || normalizedStoreName) {
    normalizedRoom.store = {
      ...(room.store || {}),
      ...(hasValue(normalizedStoreId)
        ? { id: room.store?.id || (normalizedStoreId as string | number) }
        : {}),
      ...(normalizedStoreName
        ? {
          name: room.store?.name || normalizedStoreName,
          storeName: room.store?.storeName || normalizedStoreName,
          store_name: room.store?.store_name || normalizedStoreName,
        }
        : {}),
    }
  }

  if (room.vendor || hasValue(normalizedVendorId) || normalizedVendorName) {
    normalizedRoom.vendor = {
      ...(room.vendor || {}),
      ...(hasValue(normalizedVendorId)
        ? { id: room.vendor?.id || (normalizedVendorId as string | number) }
        : {}),
      ...(normalizedVendorName
        ? {
          name: room.vendor?.name || normalizedVendorName,
          vendorName: room.vendor?.vendorName || normalizedVendorName,
          vendor_name: room.vendor?.vendor_name || normalizedVendorName,
          company_name: room.vendor?.company_name || normalizedVendorName,
        }
        : {}),
    }
  }

  return normalizedRoom
}

export const getStoreDisplayName = (room: LiveChatRoomLike): string | null =>
  pickFirstLabel(
    room.storeName,
    room.store_name,
    room.store?.storeName,
    room.store?.store_name,
    room.store?.name,
    room.storeId ? `Store ${room.storeId}` : null,
  )

export const getVendorDisplayName = (room: LiveChatRoomLike): string | null =>
  pickFirstLabel(
    room.vendorName,
    room.vendor_name,
    room.vendor?.vendorName,
    room.vendor?.vendor_name,
    room.vendor?.company_name,
    room.vendor?.name,
    room.vendorId ? `Vendor ${room.vendorId}` : null,
  )
