import apiClient from './apiClient';

export const vendorSpService = {
  getAll: (params: any) => apiClient.get('/vendor-sp', { params }),
  getById: (id: string | number) => apiClient.get(`/vendor-sp/${id}`),
  getByVendor: (vendorId: string | number) => apiClient.get(`/vendor-sp/vendor/${vendorId}`),
  checkStatus: (vendorId: string | number) => apiClient.get(`/vendor-sp/check/${vendorId}`),
  create: (data: any) => apiClient.post('/vendor-sp', data),
  complete: (id: string | number, data?: any) => apiClient.put(`/vendor-sp/complete/${id}`, data),
  extend: (id: string | number, data: any) => apiClient.put(`/vendor-sp/extend/${id}`, data),
  reactivate: (data: any) => apiClient.post('/vendor-sp/reactivate', data),
  getReactivationLogs: (params: any) => apiClient.get('/vendor-sp/reactivation', { params }),
};
