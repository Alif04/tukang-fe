import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import { ViewWork } from './components/ViewWork'
import { ReportWork } from './components/ReportWorkOrder'
// import { DetailWork } from './components/DetailWork'
import { UpdateWork } from './components/UpdateWork'

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

const WorkOrderPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='View-work_order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>WORK ORDER LIST</PageTitle>
            <ViewWork />
          </>
        }
      />
      <Route
        path='Report-work_order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>WORK ORDER DASHBOARD</PageTitle>
            <ReportWork />
          </>
        }
      />
      <Route
        path='Update-work_order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE WORK ORDER V2.</PageTitle>
            <UpdateWork />
          </>
        }
      />
      {/* <Route
        path='Detail-work_order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL WORK ORDER</PageTitle>
            <DetailWork />
          </>
        }
      /> */}
      <Route index element={<Navigate to='/work-order/view-Work_order' />} />
    </Routes>
  )
}

export default WorkOrderPage
