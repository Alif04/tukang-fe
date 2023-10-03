import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {ViewComplaint} from './components/ViewComplaint'
import {NewComplaint} from './components/NewComplaint'
import {DetailComplaint} from './components/DetailComplaint'
import {ReportComplaint} from './components/ReportComplaint'

const complaintBreadCrumbs: Array<PageLink> = [
  {
    title: 'Complaint',
    path: '/complaint/view-complaint',
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

const ComplaintPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='view-complaint'
        element={
          <>
            <PageTitle breadcrumbs={complaintBreadCrumbs}>LIST PENGADUAN</PageTitle>
            <ViewComplaint />
          </>
        }
      />
      <Route
        path='new-complaint'
        element={
          <>
            <PageTitle breadcrumbs={complaintBreadCrumbs}>FORMULIR PENGADUAN</PageTitle>
            <NewComplaint />
          </>
        }
      />

      <Route
        path='detail-complaint/:id'
        element={
          <>
            <PageTitle breadcrumbs={complaintBreadCrumbs}>DETAIL PENGADUAN</PageTitle>
            <DetailComplaint />
          </>
        }
      />

      <Route
        path='report-complaint'
        element={
          <>
            <PageTitle breadcrumbs={complaintBreadCrumbs}>PENGADUAN KONSUMEN DASHBOARD</PageTitle>
            <ReportComplaint />
          </>
        }
      />
      <Route index element={<Navigate to='/complaint/view-complaint' />} />
    </Routes>
  )
}

export default ComplaintPage
