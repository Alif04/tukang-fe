import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {ViewWork} from './components/ViewWork'
import {ReportWork} from './components/ReportWorkOrder'
import {UpdateWork} from './components/UpdateWork'
import {DetailWorkOrder} from './components/DetailWorkOrder'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Order',
    path: '/work-order/view-work-order',
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
        path='view-work-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>WORK ORDER LIST</PageTitle>
            <ViewWork />
          </>
        }
      />
      <Route
        path='report-work-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>WORK ORDER DASHBOARD</PageTitle>
            <ReportWork />
          </>
        }
      />
      <Route
        path='update-work-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE WORK ORDER</PageTitle>
            <UpdateWork />
          </>
        }
      />
      <Route
        path='detail-work-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL WORK ORDER</PageTitle>
            <DetailWorkOrder />
          </>
        }
      />
      <Route index element={<Navigate to='/work-order/view-work-order' />} />
    </Routes>
  )
}

export default WorkOrderPage
