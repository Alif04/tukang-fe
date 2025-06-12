import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {RegisterManager} from './components/NewManager'
import {EditManager} from './components/UpdateManager'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Manager',
    path: '/manager/new-manager',
    isSeparator: false,
    isActive: false,
  },
]

const ManagerPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='new-manager'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR PENDAFTARAN MANAGER STORE</PageTitle>
            <RegisterManager />
          </>
        }
      />

      <Route
        path='update-manager/:id'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE MANAGER</PageTitle>
            <EditManager />
          </>
        }
      />

      <Route index element={<Navigate to='/manager/new-manager' />} />
    </Routes>
  )
}

export default ManagerPage
