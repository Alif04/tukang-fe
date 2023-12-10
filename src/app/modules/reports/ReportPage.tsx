import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {TotalOrderReportStore} from '../../components'
import {PrintReport} from './components/PrintReport'
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
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN INSENTIF</PageTitle>
            <ReportInsentifList />
          </>
        }
      />

      <Route
        path='report-performance'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN PERFORMANCE</PageTitle>
            <ReportPerformanceList />
          </>
        }
      />

      <Route
        path='report-total-order'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN TOTAL ORDER</PageTitle>
            <TotalOrderReportStore className='' statusName='' />
          </>
        }
      />

      <Route
        path='report-pending-survey'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER PENDING SURVEY</PageTitle>
            <TotalOrderReportStore className='' statusName='SURVEYREQ' />
          </>
        }
      />

      <Route
        path='report-survey'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER SURVEY</PageTitle>
            <TotalOrderReportStore className='' statusName='SURVEYSTART' />
          </>
        }
      />

      <Route
        path='report-pending-quotation'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER PENDING QUOTATION</PageTitle>
            <TotalOrderReportStore className='' statusName='QUOTEIN' />
          </>
        }
      />

      <Route
        path='report-pending-bayar'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER PENDING BAYAR</PageTitle>
            <TotalOrderReportStore className='' statusName='UNPAID' />
          </>
        }
      />

      <Route
        path='report-on-progress'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER ON PROGRESS</PageTitle>
            <TotalOrderReportStore className='' statusName='WIP' />
          </>
        }
      />

      <Route
        path='report-complete'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER COMPLETE</PageTitle>
            <TotalOrderReportStore className='' statusName='DONE' />
          </>
        }
      />

      <Route
        path='report-reschedule'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER RESCHEDULE</PageTitle>
            <TotalOrderReportStore className='' statusName='RESCHEDULE' />
          </>
        }
      />

      <Route
        path='report-cancel'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER CANCEL</PageTitle>
            <TotalOrderReportStore className='' statusName='REJECTED' />
          </>
        }
      />

      <Route
        path='report-refund'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>LAPORAN ORDER REFUND</PageTitle>
            <TotalOrderReportStore className='' statusName='REFUND' />
          </>
        }
      />

      <Route
        path='print-report'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>PRINT REPORT</PageTitle>
            <PrintReport />
          </>
        }
      />

      <Route index element={<Navigate to='/reports/view-report' />} />
    </Routes>
  )
}

export default RefundPage
