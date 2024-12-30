// src/store/index.ts
import {configureStore} from '@reduxjs/toolkit'
import tableReducer from './tableSlice'
import workOrderReducer from './workOrderSlice'
import itemReducer from './itemSlice'

export const store = configureStore({
  reducer: {
    table: tableReducer,
    workOrder: workOrderReducer,
    item: itemReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
