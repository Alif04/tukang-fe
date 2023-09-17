import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {DashboardOrder} from './components/DashboardOrder'
import {ViewOrder} from './components/ViewOrder'
import {NewOrder} from './components/NewOrder'
import {DetailOrder} from './components/DetailOrder'
import {ReportOrder} from './components/ReportOrder'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Order',
    path: '/order/view-order',
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

const OrderPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='dashboard-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>
              INSTALASI & SERVICE MITRA10 DASHBOARD
            </PageTitle>
            <DashboardOrder />
          </>
        }
      />
      <Route
        path='view-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>ORDER LIST</PageTitle>
            <ViewOrder />
          </>
        }
      />
      <Route
        path='new-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR PESANAN BARU</PageTitle>
            <NewOrder />
          </>
        }
      />
      <Route
        path='detail-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL ORDER - 78453992 ALIA</PageTitle>
            <DetailOrder />
          </>
        }
      />
      <Route
        path='report-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>
              INSTALASI & SERVICE MITRA10 DASHBOARD
            </PageTitle>
            <ReportOrder />
          </>
        }
      />
      <Route index element={<Navigate to='/order/view-order' />} />
    </Routes>
  )
}

export default OrderPage
