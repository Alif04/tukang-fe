import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

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
  return (
    <Routes>
      <Route
        path='view-invoice'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>INVOICE LIST</PageTitle>
            <ViewInvoice />
          </>
        }
      />
      <Route
        path='new-invoice'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>NEW INVOICE</PageTitle>
            <NewInvoice />
          </>
        }
      />
      <Route
        path='detail-invoice'
        element={
          <>
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
