import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {ViewCSI} from './components/ViewCSI'
import {ListCSI} from './components/ListCSI'
import {ListFormatCSI} from '../../components'
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
]

const CSIpage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='list-csi'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>SURVEY KEPUASAN PELANGGAN</PageTitle>
            <ListCSI />
          </>
        }
      />

      <Route
        path='view-csi/:id'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>RESPON SURVEY KEPUASAN PELANGGAN</PageTitle>
            <ViewCSI />
          </>
        }
      />

      <Route
        path='format-pertanyaan-csi'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>LIST FORMAT PERTANYAAN CSI</PageTitle>
            <ListFormatCSI />
          </>
        }
      />

      <Route
        path='new-csi'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>
              FORMULIR PEMBUATAN SURVEY KEPUASAN PELANGGAN
            </PageTitle>
            <NewCSI />
          </>
        }
      />

      <Route
        path='update-csi/:id'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE SURVEY KEPUASAN PELANGGAN</PageTitle>
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
