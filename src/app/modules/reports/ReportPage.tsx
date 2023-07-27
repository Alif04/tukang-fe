import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {ViewReport} from './components/ViewReports'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Reports',
    path: '/reports/view-report',
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
        path='view-report'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>REPORT LIST</PageTitle>
            <ViewReport />
          </>
        }
      />
      <Route index element={<Navigate to='/reports/view-report' />} />
    </Routes>
  )
}

export default RefundPage
