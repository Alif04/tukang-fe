import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {ViewInvoice} from './components/ViewInvoice'
import {NewInvoice} from './components/NewInvoice'
import {UpdateInvoice} from './components/UpdateInvoice'
import {DetailInvoice} from './components/DetailInvoice'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Invoice',
    path: '/invoice/view-invoice',
    isSeparator: false,
    isActive: false,
  },
]

const InvoicePage: React.FC = () => {
  const userRole = localStorage.getItem('userRole') as string

  return (
    <Routes>
      <Route
        path='view-invoice'
        element={
          <>
            {['Admin HO', 'Super User', 'Finance'].includes(userRole) ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>INVOICE LIST</PageTitle>
            <ViewInvoice />
          </>
        }
      />

      <Route
        path='new-invoice'
        element={
          <>
            {['Admin HO', 'Super User', 'Finance'].includes(userRole) ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>NEW INVOICE</PageTitle>
            <NewInvoice />
          </>
        }
      />

      <Route
        path='update-invoice/:id'
        element={
          <>
            {['Admin HO', 'Super User', 'Finance'].includes(userRole) ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE INVOICE</PageTitle>
            <UpdateInvoice />
          </>
        }
      />

      <Route
        path='detail-invoice/:id'
        element={
          <>
            {['Admin HO', 'Super User', 'Finance'].includes(userRole) ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL INVOICE</PageTitle>
            <DetailInvoice />
          </>
        }
      />

      <Route index element={<Navigate to='/invoice/view-invoice' />} />
    </Routes>
  )
}

export default InvoicePage
