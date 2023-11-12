import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'
import {ViewWork} from './components/ViewWork'
import {ReportWork} from './components/ReportWorkOrder'
import {UpdateWork} from './components/UpdateWork'
import {DetailWorkOrder} from './components/DetailWorkOrder'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Order',
    path: '/work-order/view-work-order',
    isSeparator: false,
    isActive: false,
  },
]

const WorkOrderPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='view-work-order'
        element={
          <>
            {userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>WORK ORDER LIST</PageTitle>
            <ViewWork />
          </>
        }
      />
      <Route
        path='report-work-order'
        element={
          <>
            {userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>WORK ORDER DASHBOARD</PageTitle>
            <ReportWork />
          </>
        }
      />
      <Route
        path='update-work-order/:id'
        element={
          <>
            {userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE WORK ORDER</PageTitle>
            <UpdateWork />
          </>
        }
      />
      <Route
        path='detail-work-order/:id'
        element={
          <>
            {userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL WORK ORDER</PageTitle>
            <DetailWorkOrder />
          </>
        }
      />
      <Route index element={<Navigate to='/work-order/view-work-order' />} />
    </Routes>
  )
}

export default WorkOrderPage
