import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'
import {ViewQuotation} from './components/ViewQuotation'
import {NewQuotation} from './components/NewQuotation'
import {UpdateQuotation} from './components/UpdateQuotation'
import {DetailQuotation} from './components/DetailQuotation'
import {DashboardFinance} from './components/DashboardFinance'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Quotation',
    path: '/quotation/view-quotation',
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

const VendorPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='view-quotation'
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
            <PageTitle breadcrumbs={orderBreadCrumbs}>DAFTAR QUOTATION</PageTitle>
            <ViewQuotation />
          </>
        }
      />

      <Route
        path='new-quotation'
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
            <PageTitle breadcrumbs={orderBreadCrumbs}>NEW QUOTATION FORM</PageTitle>
            <NewQuotation />
          </>
        }
      />

      <Route
        path='update-quotation/:id'
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
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE QUOTATION</PageTitle>
            <UpdateQuotation />
          </>
        }
      />

      <Route
        path='detail-quotation/:id'
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
            <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL QUOTATION</PageTitle>
            <DetailQuotation />
          </>
        }
      />

      <Route
        path='report-finance'
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
            <PageTitle breadcrumbs={orderBreadCrumbs}>FINANCIAL DASHBOARD</PageTitle>
            <DashboardFinance />
          </>
        }
      />

      <Route index element={<Navigate to='/quotation/view-quotation' />} />
    </Routes>
  )
}

export default VendorPage
