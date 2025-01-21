import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {RegisterDataMaster} from './components/NewDataMaster'
import {ListDataMaster} from './components/ViewDataMaster'
import {UpdateDataMasters} from './components/UpdateDataMaster'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'data-master',
    path: '/data-master/new-data-master',
    isSeparator: false,
    isActive: false,
  },
]

const DataMasterPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='new-data-master'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>TAMBAH DATA MASTER</PageTitle>
            <RegisterDataMaster />
          </>
        }
      />

      <Route
        path='update-data-master/:id'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE DATA MASTE</PageTitle>
            <UpdateDataMasters />
          </>
        }
      />

      <Route
        path='view-data-master'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>DAFTAR DATA MASTER MITRA10</PageTitle>
            <ListDataMaster />
          </>
        }
      />

      <Route index element={<Navigate to='/data-master/new-data-master' />} />
    </Routes>
  )
}

export default DataMasterPage
