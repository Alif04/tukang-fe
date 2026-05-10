import apiClient from './apiClient';

export const vendorViolationService = {
  // Violation Types
  getTypes: (params?: any) => apiClient.get('/vendor-violation/type', { params }),
  getTypeById: (id: string | number) => apiClient.get(`/vendor-violation/type/${id}`),
  createType: (data: any) => apiClient.post('/vendor-violation/type', data),
  updateType: (id: string | number, data: any) => apiClient.put(`/vendor-violation/type/${id}`, data),
  deleteType: (id: string | number) => apiClient.delete(`/vendor-violation/type/${id}`),

  // Violation Logs
  getLogs: (params?: any) => apiClient.get('/vendor-violation/log', { params }),
  getLogsByVendor: (vendorId: string | number, params?: any) =>
    apiClient.get('/vendor-violation/log', { params: { ...params, vendor_id: vendorId } }),
  createLog: (data: any) => apiClient.post('/vendor-violation/log', data),
  getVendorQuarterPoints: (vendorId: string | number, quarter?: number, year?: number) =>
    apiClient.get(`/vendor-violation/vendor/${vendorId}/points`, {
      params: { quarter, year },
    }),
};