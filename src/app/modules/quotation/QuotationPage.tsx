import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

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
  return (
    <Routes>
      <Route
        path='view-quotation'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>QUOTATION LIST</PageTitle>
            <ViewQuotation />
          </>
        }
      />
      <Route
        path='new-quotation'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>QUOTATION</PageTitle>
            <NewQuotation />
          </>
        }
      />
      <Route
        path='update-quotation'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE QUOTATION</PageTitle>
            <UpdateQuotation />
          </>
        }
      />
      <Route
        path='detail-quotation'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL QUOTATION</PageTitle>
            <DetailQuotation />
          </>
        }
      />
      <Route
        path='report-finance'
        element={
          <>
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
