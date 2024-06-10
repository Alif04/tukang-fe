import React from 'react'
import {Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {NewUser} from './components/NewUser'
import {UpdateUser} from './components/UpdateUser'
import {ListUser} from './components/ListUser'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'User',
    path: '/user/new-user',
    isSeparator: false,
    isActive: false,
  },
]

const UserManagementPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='new-user'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR PENDAFTARAN USER</PageTitle>
            <NewUser />
          </>
        }
      />

      <Route
        path='update-user/:id'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE DATA USER</PageTitle>
            <UpdateUser />
          </>
        }
      />

      <Route
        path='view-user'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>DAFTAR USER</PageTitle>
            <ListUser />
          </>
        }
      />
    </Routes>
  )
}

export default UserManagementPage
