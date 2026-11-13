// Nest's TransformInterceptor wraps successful responses in {status, message, data}.
export function unwrapAnalyticsResponse(response: any): any {
  if (response && typeof response === 'object' && 'data' in response && 'status' in response) return response.data
  return response
}

export function parseDashboardResponse(response: any): any {
  const dashboard = unwrapAnalyticsResponse(response)
  if (!dashboard || typeof dashboard !== 'object' || !Array.isArray(dashboard.monthly) || !Array.isArray(dashboard.statuses) || !Array.isArray(dashboard.stores)) {
    throw new Error('Format data dashboard tidak sesuai')
  }
  return dashboard
}

export function parseConversationsResponse(response: any): any[] {
  const conversations = unwrapAnalyticsResponse(response)
  if (!Array.isArray(conversations)) throw new Error('Format riwayat tidak sesuai')
  return conversations
}
