import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {DashboardOrder} from './components/DashboardOrder'
import {ViewOrder} from './components/ViewOrder'
import {NewOrder} from './components/NewOrder'
import {UpdateOrder} from './components/UpdateOrder'
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
            <PageTitle breadcrumbs={orderBreadCrumbs}>DASHBOARD ORDER</PageTitle>
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
            <PageTitle breadcrumbs={orderBreadCrumbs}>NEW PICKLIST FORM</PageTitle>
            <NewOrder />
          </>
        }
      />
      <Route
        path='update-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE ORDER FORM</PageTitle>
            <UpdateOrder />
          </>
        }
      />
      <Route
        path='detail-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>Detail ORDER</PageTitle>
            <DetailOrder />
          </>
        }
      />
      <Route
        path='report-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>ORDER DASHBOARD</PageTitle>
            <ReportOrder />
          </>
        }
      />
      <Route index element={<Navigate to='/order/view-order' />} />
    </Routes>
  )
}

export default OrderPage
