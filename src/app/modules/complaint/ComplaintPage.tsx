import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

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
            <PageTitle breadcrumbs={complaintBreadCrumbs}>COMPLAINT LIST</PageTitle>
            {/* <Overview /> */}
          </>
        }
      />
      <Route
        path='new-complaint'
        element={
          <>
            <PageTitle breadcrumbs={complaintBreadCrumbs}>NEW COMPLAINT FORM</PageTitle>
            {/* <Settings /> */}
          </>
        }
      />
      <Route
        path='report-complaint'
        element={
          <>
            <PageTitle breadcrumbs={complaintBreadCrumbs}>COMPLAINT DASHBOARD</PageTitle>
            {/* <Settings /> */}
          </>
        }
      />
      <Route index element={<Navigate to='/complaint/view-complaint' />} />
    </Routes>
  )
}

export default ComplaintPage
