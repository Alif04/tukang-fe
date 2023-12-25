import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {DashboardOrder} from './components/DashboardOrder'
import {ViewOrder} from './components/ViewOrder'
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
            {userRole == 'Store CS' || userRole === 'Store Staff' || userRole === 'Sales' ? (
              <>
                <PageTitle breadcrumbs={orderBreadCrumbs}>
                  INSTALASI & SERVICE MITRA10 DASHBOARD
                </PageTitle>
              </>
            ) : userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
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
            {userRole == 'Store CS' || userRole == 'Store Staff' || userRole === 'Sales' ? (
              <>
                <PageTitle breadcrumbs={orderBreadCrumbs}>
                  LIST ORDER INSTALASI & SERVICE MITRA10
                </PageTitle>
              </>
            ) : userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
                <PageTitle breadcrumbs={orderBreadCrumbs}>
                  LIST ORDER INSTALASI & SERVICE MITRA10
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
        path='new-order'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR PESANAN BARU</PageTitle>
            <NewOrder />
          </>
        }
      />

      <Route
        path='update-order/:id'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <UpdateOrder />
          </>
        }
      />

      <Route
        path='detail-order/:id'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <DetailOrder />
          </>
        }
      />

      <Route
        path='printout-order/:id'
        element={
          <>
            {userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PrintOutOrder />
          </>
        }
      />

      <Route
        path='preview-email/:id'
        element={
          <>
            {userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PreviewEmail />
          </>
        }
      />

      <Route index element={<Navigate to='/order/view-order' />} />
    </Routes>
  )
}

export default OrderPage
