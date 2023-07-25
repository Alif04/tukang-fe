import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import { NewTukangin } from './components/NewTukangin'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Order',
    path: '/Work-Order/view-Work',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const TukangPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='NewTukangin'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>New Tukang</PageTitle>
            <NewTukangin />
          </>
        }
      />
      {/* <Route
        path='Report-work_order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>WORK ORDER DASHBOARD</PageTitle>
            <ReportWork />
          </>
        }
      /> */}
      <Route index element={<Navigate to='/work-order/view-Work_order' />} />
    </Routes>
  )
}

export default TukangPage
