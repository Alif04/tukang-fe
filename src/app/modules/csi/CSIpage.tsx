import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {ListFormatCSI} from '../../components'
import {ViewCSI} from './components/ViewCSI'
import {NewCSI} from './components/NewCSI'
import {UpdateCSI} from './components/UpdateCSI'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'CSI',
    path: '/csi/view-csi',
    isSeparator: false,
    isActive: false,
  },
]

const CSIpage: React.FC = () => {
  const userRole = localStorage.getItem('userRole') as string

  return (
    <Routes>
      <Route
        path='view-csi/:id'
        element={
          <>
            {['Super User', 'Admin HO'].includes(userRole) ? (
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
            {['Super User', 'Admin HO'].includes(userRole) ? (
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
            {['Super User', 'Admin HO'].includes(userRole) ? (
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
            {['Super User', 'Admin HO'].includes(userRole) ? (
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

      <Route index element={<Navigate to='/csi/view-csi' />} />
    </Routes>
  )
}

export default CSIpage
