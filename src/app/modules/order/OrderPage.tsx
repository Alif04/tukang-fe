import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {DashboardOrder} from './components/DashboardOrder'
import {ViewOrder} from './components/ViewOrder'
import {PreOrder} from './components/PreOrder'
import {NewOrder} from './components/NewOrder'
import {UpdateOrder} from './components/UpdateOrder'
import {DetailOrder} from './components/DetailOrder'
import {PrintOutOrder} from './components/PrintoutOrder'
import {PreviewEmail} from './components/PreviewEmail'

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
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='dashboard-order'
        element={
          <>
            {userRole == 'Store CS' || userRole === 'Store Staff' ? (
              <>
                <PageTitle breadcrumbs={orderBreadCrumbs}>
                  INSTALASI & SERVICE MITRA10 DASHBOARD
                </PageTitle>
              </>
            ) : userRole == 'Admin HO' ? (
              <>
                <PageTitle breadcrumbs={orderBreadCrumbs}>ORDER DASHBOARD</PageTitle>
              </>
            ) : (
              <></>
            )}
            <DashboardOrder />
          </>
        }
      />

      <Route
        path='view-order'
        element={
          <>
            {userRole == 'Store CS' || userRole == 'Store Staff' ? (
              <>
                <PageTitle breadcrumbs={orderBreadCrumbs}>ORDER LIST</PageTitle>
              </>
            ) : userRole == 'Admin HO' ? (
              <>
                <PageTitle breadcrumbs={orderBreadCrumbs}>
                  LIST INSTALASI & SERVICE MITRA10
                </PageTitle>
              </>
            ) : (
              <></>
            )}
            <ViewOrder />
          </>
        }
      />

      <Route
        path='pre-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR PRE ORDER</PageTitle>
            <PreOrder />
          </>
        }
      />

      <Route
        path='new-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR NEW ORDER</PageTitle>
            <NewOrder />
          </>
        }
      />

      <Route
        path='update-order/:id'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE ORDER FORM</PageTitle>
            <UpdateOrder />
          </>
        }
      />

      <Route
        path='detail-order/:id'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL ORDER</PageTitle>
            <DetailOrder />
          </>
        }
      />

      <Route
        path='printout-order/:id'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>PRINTOUT ORDER</PageTitle>
            <PrintOutOrder />
          </>
        }
      />

      <Route
        path='preview-email/:id'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>PREVIEW EMAIL</PageTitle>
            <PreviewEmail />
          </>
        }
      />

      <Route index element={<Navigate to='/order/view-order' />} />
    </Routes>
  )
}

export default OrderPage
