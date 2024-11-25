import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'
import {ViewQuotation} from './components/ViewQuotation'
import {NewQuotation} from './components/NewQuotation'
import {UpdateQuotation} from './components/UpdateQuotation'
import {DetailQuotation} from './components/DetailQuotation'
import {ViewRequestDiscount} from './components/ViewRequestDiscount'
import {DetailRequestDiscount} from './components/DetailRequestDiscount'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Quotation',
    path: '/quotation/view-quotation',
    isSeparator: false,
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
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
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
            <PageTitle breadcrumbs={orderBreadCrumbs}>QUOTATION LIST</PageTitle>
            <ViewQuotation />
          </>
        }
      />

      <Route
        path='new-quotation'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
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
            <PageTitle breadcrumbs={orderBreadCrumbs}>NEW QUOTATION FORM</PageTitle>
            <NewQuotation />
          </>
        }
      />

      <Route
        path='update-quotation/:id'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
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
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE QUOTATION</PageTitle>
            <UpdateQuotation />
          </>
        }
      />

      <Route
        path='detail-quotation/:id'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
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
            <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL QUOTATION</PageTitle>
            <DetailQuotation />
          </>
        }
      />

      <Route
        path='view-request-discount'
        element={
          <>
            <HeaderWrapper className='bg-header-ho' />
            <PageTitle breadcrumbs={orderBreadCrumbs}>
              {userRole === 'Super User' ? 'APPROVAL PENGAJUAN DISKON' : 'DAFTAR PENGAJUAN DISKON'}
            </PageTitle>
            <ViewRequestDiscount />
          </>
        }
      />

      <Route
        path='detail-request-discount/:id'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
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
            <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL PENGAJUAN DISKON</PageTitle>
            <DetailRequestDiscount />
          </>
        }
      />

      <Route index element={<Navigate to='/quotation/view-quotation' />} />
    </Routes>
  )
}

export default VendorPage
