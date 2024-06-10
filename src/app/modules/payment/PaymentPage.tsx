import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

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
]

const PaymentPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='view-payment'
        element={
          <>
            <HeaderWrapper className='bg-header-ho' />
            <PageTitle breadcrumbs={orderBreadCrumbs}>LIST PAYMENT REQUEST</PageTitle>
            <ViewPayment />
          </>
        }
      />

      <Route
        path='new-payment'
        element={
          <>
            <HeaderWrapper className='bg-header-ho' />
            <PageTitle breadcrumbs={orderBreadCrumbs}>NEW PAYMENT</PageTitle>
            <NewPayment />
          </>
        }
      />

      <Route
        path='detail-payment'
        element={
          <>
            <HeaderWrapper className='bg-header-ho' />
            <PageTitle breadcrumbs={orderBreadCrumbs}>PAYMENT REQUEST</PageTitle>
            <DetailPayment />
          </>
        }
      />

      <Route index element={<Navigate to='/payment/view-payment' />} />
    </Routes>
  )
}

export default PaymentPage
