import React from 'react'
import {useParams, Navigate, Route, Routes} from 'react-router-dom'
import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {ViewComplaint} from './components/ViewComplaint'
import {NewComplaint} from './components/NewComplaint'
import {UpdateComplaint} from './components/UpdateComplaint'
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
            <HeaderWrapper className='bg-danger-complaint' />
            <PageTitle breadcrumbs={complaintBreadCrumbs}>LIST PENGADUAN</PageTitle>
            <ViewComplaint />
          </>
        }
      />

      <Route
        path='new-complaint'
        element={
          <>
            <HeaderWrapper className='bg-danger-complaint' />
            <PageTitle breadcrumbs={complaintBreadCrumbs}>FORMULIR PENGADUAN</PageTitle>
            <NewComplaint />
          </>
        }
      />

      <Route
        path='update-complaint/:id'
        element={
          <>
            <HeaderWrapper className='bg-danger-complaint' />
            <UpdateComplaint />
          </>
        }
      />

      <Route
        path='detail-complaint/:id'
        element={
          <>
            <HeaderWrapper className='bg-danger-complaint' />
            <DetailComplaint />
          </>
        }
      />

      <Route
        path='report-complaint'
        element={
          <>
            <HeaderWrapper className='bg-danger-complaint' />
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
