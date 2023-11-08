import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'
import {ViewInvoice} from './components/ViewInvoice'
import {NewInvoice} from './components/NewInvoice'
import {DetailInvoice} from './components/DetailInvoice'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Invoice',
    path: '/invoice/view-invoice',
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

const InvoicePage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='view-invoice'
        element={
          <>
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' ? (
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
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' ? (
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
        path='detail-invoice'
        element={
          <>
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' ? (
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
