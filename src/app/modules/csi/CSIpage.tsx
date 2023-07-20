import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {ViewCSI} from './components/ViewCSI'
import {NewCSI} from './components/NewCSI'
import {UpdateCSI} from './components/UpdateCSI'
import {ReportCSI} from './components/ReportCSI'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'CSI',
    path: '/csi/view-csi',
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

const CSIpage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='view-csi'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>CSI LIST</PageTitle>
            <ViewCSI />
          </>
        }
      />
      <Route
        path='new-csi'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>NEW CSI FORM</PageTitle>
            <NewCSI />
          </>
        }
      />
      <Route
        path='update-csi'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE CSI</PageTitle>
            <UpdateCSI />
          </>
        }
      />
      <Route
        path='report-csi'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>CSI DASHBOARD</PageTitle>
            <ReportCSI />
          </>
        }
      />
      <Route index element={<Navigate to='/csi/view-csi' />} />
    </Routes>
  )
}

export default CSIpage
