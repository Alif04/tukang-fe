import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {ViewReport} from './components/ViewReport'
import {ReportPerformanceList} from './components/ReportPerformanceList'
import {ReportInsentifList} from './components/ReportInsentifList'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Reports',
    path: '/reports/view-report',
    isSeparator: false,
    isActive: false,
  },
]

const RefundPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='view-report'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LIST LAPORAN</PageTitle>
            <ViewReport />
          </>
        }
      />
      <Route
        path='report-insentif'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TOTAL ORDER</PageTitle>
            <ReportInsentifList />
          </>
        }
      />
      <Route
        path='report-performance'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TOTAL ORDER</PageTitle>
            <ReportPerformanceList />
          </>
        }
      />

      <Route index element={<Navigate to='/reports/view-report' />} />
    </Routes>
  )
}

export default RefundPage
