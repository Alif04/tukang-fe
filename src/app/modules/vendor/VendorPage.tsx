import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

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
  return (
    <Routes>
      <Route
        path='view-vendor'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>VENDOR LIST</PageTitle>
            <ViewVendor />
          </>
        }
      />
      <Route
        path='new-vendor'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>NEW VENDOR FORM</PageTitle>
            <NewVendor />
          </>
        }
      />
      <Route
        path='update-vendor'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE VENDOR</PageTitle>
            <UpdateVendor />
          </>
        }
      />
      <Route
        path='detail-vendor'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL VENDOR</PageTitle>
            <DetailVendor />
          </>
        }
      />
      <Route
        path='report-vendor'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>VENDOR DASHBOARD</PageTitle>
            <ReportVendor />
          </>
        }
      />
      <Route index element={<Navigate to='/vendor/view-vendor' />} />
    </Routes>
  )
}

export default VendorPage
