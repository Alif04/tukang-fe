import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {RegisterDataRole} from './components/NewDataRole'
import {ListDataRole} from './components/ViewDataRole'
import {UpdateDataRoles} from './components/UpdateDataRole'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'data-role',
    path: '/data-role/new-role-master',
    isSeparator: false,
    isActive: false,
  },
]

const DataRolePage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='new-data-role'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>TAMBAH DATA ROLE</PageTitle>
            <RegisterDataRole />
          </>
        }
      />

      <Route
        path='update-data-role/:id'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE DATA ROLE</PageTitle>
            <UpdateDataRoles />
          </>
        }
      />

      <Route
        path='view-data-role'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>DAFTAR DATA ROLE MITRA10</PageTitle>
            <ListDataRole />
          </>
        }
      />

      <Route index element={<Navigate to='/data-role/new-data-role' />} />
    </Routes>
  )
}

export default DataRolePage
