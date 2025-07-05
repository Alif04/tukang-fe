import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface StoreItem {
  value: number | null
  label: string
}

interface VendorItem {
  value: number | null
  label: string
}

interface orderFilter {
  queryParams: string
  searchFilter: string
  currentPage: number
  pageSize: number
  dateFrom: string
  dateTo: string
  selectedStore: StoreItem
  selectedVendor: VendorItem
  selectedOrderStatus: string[]
  selectedPaymentReceiptStatus: string[]
  selectedPaymentQuotationStatus: string[]
}

const userRole = localStorage.getItem('userRole') as string

const initialState: orderFilter = {
  queryParams: '',
  searchFilter: '',
  currentPage: 1,
  pageSize: 50,
  dateFrom: ['Super User', 'Admin HO'].includes(userRole)
    ? new Date(new Date().setDate(new Date().getDate() - 14)).toISOString().split('T')[0]
    : new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
  dateTo: new Date().toISOString().split('T')[0],
  selectedStore: {value: null, label: 'All Store'},
  selectedVendor: {value: null, label: 'All Vendor'},
  selectedOrderStatus: [],
  selectedPaymentReceiptStatus: [],
  selectedPaymentQuotationStatus: [],
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setQueryParams(state, action: PayloadAction<string>) {
      state.queryParams = action.payload
    },
    setSearchFilter(state, action: PayloadAction<string>) {
      state.searchFilter = action.payload
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload
    },
    setDateFrom(state, action: PayloadAction<string>) {
      state.dateFrom = action.payload
    },
    setDateTo(state, action: PayloadAction<string>) {
      state.dateTo = action.payload
    },
    setSelectedStore: (state, action: PayloadAction<StoreItem>) => {
      state.selectedStore = action.payload
    },
    setSelectedVendor: (state, action: PayloadAction<VendorItem>) => {
      state.selectedVendor = action.payload
    },
    setSelectedOrderStatus(state, action: PayloadAction<string[]>) {
      state.selectedOrderStatus = action.payload
    },
    setSelectedPaymentReceiptStatus(state, action: PayloadAction<string[]>) {
      state.selectedPaymentReceiptStatus = action.payload
    },
    setSelectedPaymentQuotationStatus(state, action: PayloadAction<string[]>) {
      state.selectedPaymentQuotationStatus = action.payload
    },
    resetFilters(state) {
      state.queryParams = ''
      state.searchFilter = ''
      state.dateFrom = ['Super User', 'Admin HO'].includes(userRole)
        ? new Date(new Date().setDate(new Date().getDate() - 14)).toISOString().split('T')[0]
        : new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
      state.dateTo = new Date().toISOString().split('T')[0]
      state.currentPage = 1
      state.pageSize = 10
      state.selectedStore = {value: null, label: 'All Store'}
      state.selectedVendor = {value: null, label: 'All Vendor'}
      state.selectedOrderStatus = []
      state.selectedPaymentReceiptStatus = []
      state.selectedPaymentQuotationStatus = []
    },
  },
})

export const {
  setQueryParams,
  setSearchFilter,
  setCurrentPage,
  setPageSize,
  setDateFrom,
  setDateTo,
  setSelectedStore,
  setSelectedVendor,
  setSelectedOrderStatus,
  setSelectedPaymentReceiptStatus,
  setSelectedPaymentQuotationStatus,
  resetFilters,
} = orderSlice.actions

export default orderSlice.reducer
