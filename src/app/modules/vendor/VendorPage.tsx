import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {ViewVendor} from './components/ViewVendor'
import {NewVendor} from './components/NewVendor'
import {UpdateVendor} from './components/UpdateVendor'
import {DetailVendor} from './components/DetailVendor'
import {ReportVendor} from './components/ReportVendor'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Vendor',
    path: '/vendor/view-vendor',
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
        path='view-vendor'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>
              DAFTAR VENDOR INSTALASI & SERVICE MITRA10
            </PageTitle>
            <ViewVendor />
          </>
        }
      />

      <Route
        path='new-vendor'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR REGISTRASI VENDOR</PageTitle>
            <NewVendor />
          </>
        }
      />

      <Route
        path='update-vendor/:id'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <UpdateVendor />
          </>
        }
      />

      <Route
        path='detail-vendor/:id'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <DetailVendor />
          </>
        }
      />

      <Route
        path='report-vendor'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>VENDOR SUMMARY</PageTitle>
            <ReportVendor />
          </>
        }
      />
      <Route index element={<Navigate to='/vendor/view-vendor' />} />
    </Routes>
  )
}

export default VendorPage
