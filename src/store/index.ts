// src/store/index.ts
import {configureStore} from '@reduxjs/toolkit'
import tableReducer from './tableSlice'
import workOrderReducer from './workOrderSlice'

export const store = configureStore({
  reducer: {
    table: tableReducer,
    workOrder: workOrderReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
