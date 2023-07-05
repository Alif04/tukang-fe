import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {OrderDataTable} from './components/OrderDataTable'
import {NewOrder} from './components/NewOrder'
import {OrderDashboard} from './components/OrderDashboard'

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
        path='view-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>ORDER LIST</PageTitle>
            <OrderDataTable className='' />
          </>
        }
      />
      <Route
        path='new-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>NEW ORDER FORM</PageTitle>
            <NewOrder />
          </>
        }
      />
      <Route
        path='report-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>ORDER DASHBOARD</PageTitle>
            <OrderDashboard />
          </>
        }
      />
      <Route index element={<Navigate to='/order/view-order' />} />
    </Routes>
  )
}

export default OrderPage
