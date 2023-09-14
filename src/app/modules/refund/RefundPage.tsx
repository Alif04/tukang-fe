import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {ViewRefund} from './components/ViewRefund'
import {NewRefund} from './components/NewRefund'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Refund',
    path: '/refund/view-refund',
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

const RefundPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='view-refund'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>REFUND LIST</PageTitle>
            <ViewRefund />
          </>
        }
      />
      <Route
        path='new-refund'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR REFUND - 0863572 - ALIA</PageTitle>
            <NewRefund />
          </>
        }
      />
      <Route index element={<Navigate to='/refund/view-refund' />} />
    </Routes>
  )
}

export default RefundPage
