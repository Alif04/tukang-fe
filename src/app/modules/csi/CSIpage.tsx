import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

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
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='view-csi'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>SURVEY KEPUASAN PELANGGAN</PageTitle>
            <ViewCSI />
          </>
        }
      />
      <Route
        path='format-pertanyaan-csi'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMAT PERTANYAAN CSI</PageTitle>
            <NewCSI />
          </>
        }
      />
      <Route
        path='format-email-csi'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMAT EMAIL CSI</PageTitle>
            <UpdateCSI />
          </>
        }
      />
      <Route
        path='report-csi'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
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
