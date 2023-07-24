import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {ViewWorkOrder} from './components/ViewWorkOrder'
import { ReportWorkOrder } from './components/ReportWorkOrder'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Order',
    path: '/Work-Order/view-Work',
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

const WorkOrderPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='view-work_order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>View Work Order</PageTitle>
            <ViewWorkOrder className="your-class-name-here"/>
          </>
        }
      />
      <Route
        path='Report-work_order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>NEW VENDOR FORM</PageTitle>
            <ReportWorkOrder />
          </>
        }
      />
      {/* <Route
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
      /> */}
      <Route index element={<Navigate to='/work-order/view-Work_order' />} />
    </Routes>
  )
}

export default WorkOrderPage
