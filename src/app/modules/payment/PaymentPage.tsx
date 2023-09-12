import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {ViewPayment} from './components/ViewPayment'
import {NewPayment} from './components/NewPayment'
import {DetailPayment} from './components/DetailPayment'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'payment',
    path: '/payment/view-payment',
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

const PaymentPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='view-payment'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>PAYMENT LIST</PageTitle>
            <ViewPayment />
          </>
        }
      />
      {/* <Route
        path='new-payment'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>NEW VENDOR FORM</PageTitle>
            <NewPayment />
          </>
        }
      />
      <Route
        path='detail-payment'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>PAYMENT REQUEST</PageTitle>
            <DetailPayment />
          </>
        }
      /> */}
      <Route index element={<Navigate to='/payment/view-payment' />} />
    </Routes>
  )
}

export default PaymentPage
