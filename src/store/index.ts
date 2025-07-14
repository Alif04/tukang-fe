// src/store/index.ts
import {configureStore} from '@reduxjs/toolkit'
import workOrderReducer from './workOrderSlice'
import itemReducer from './itemSlice'
import invoiceReducer from './invoiceSlice'
import quotationReducer from './quotationSlice'
import orderReducer from './orderSlice'
import vendorReducer from './vendorSlice'

export const store = configureStore({
  reducer: {
    order: orderReducer,
    workOrder: workOrderReducer,
    item: itemReducer,
    invoice: invoiceReducer,
    quotation: quotationReducer,
    vendor: vendorReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
