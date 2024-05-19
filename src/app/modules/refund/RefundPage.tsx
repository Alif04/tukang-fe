import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {ViewRefund} from './components/ViewRefund'
import {NewRefund} from './components/NewRefund'
import {UpdateRefund} from './components/UpdateRefund'
import {DetailRefund} from './components/DetailRefund'

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
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='view-refund'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>REFUND LIST</PageTitle>
            <ViewRefund />
          </>
        }
      />

      <Route
        path='new-refund/:id'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR REFUND</PageTitle>
            <NewRefund />
          </>
        }
      />

      <Route
        path='update-refund/:id'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE REFUND</PageTitle>
            <UpdateRefund />
          </>
        }
      />

      <Route
        path='detail-refund/:id'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL REFUND</PageTitle>
            <DetailRefund />
          </>
        }
      />

      <Route index element={<Navigate to='/refund/view-refund' />} />
    </Routes>
  )
}

export default RefundPage
