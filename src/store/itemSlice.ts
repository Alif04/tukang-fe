import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface StoreItem {
  value: number | null
  label: string
}

interface itemFilter {
  queryParams: string
  searchFilter: string
  currentPage: number
  pageSize: number
  dateFrom: string
  dateTo: string
  selectedStore: StoreItem
}

const initialState: itemFilter = {
  queryParams: '',
  searchFilter: '',
  currentPage: 1,
  pageSize: 50,
  dateFrom: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
  dateTo: new Date().toISOString().split('T')[0],
  selectedStore: {value: null, label: 'All Store'},
}

const itemSlice = createSlice({
  name: 'item',
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
    resetFilters(state) {
      state.queryParams = ''
      state.searchFilter = ''
      state.dateFrom = new Date(new Date().setDate(new Date().getDate() - 7))
        .toISOString()
        .split('T')[0]
      state.dateTo = new Date().toISOString().split('T')[0]
      state.currentPage = 1
      state.pageSize = 10
      state.selectedStore = {value: null, label: 'All Store'}
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
  resetFilters,
} = itemSlice.actions

export default itemSlice.reducer
