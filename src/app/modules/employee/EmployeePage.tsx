import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {RegisterEmployee} from './components/NewEmployee'
import {EditEmployee} from './components/UpdateEmployee'
import {ListEmployee} from './components/ViewEmployee'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Staff',
    path: '/employee/new-employee',
    isSeparator: false,
    isActive: false,
  },
]

const SalesPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='new-employee'
        element={
          <>
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR PENDAFTARAN STAFF</PageTitle>
            <RegisterEmployee />
          </>
        }
      />

      <Route
        path='update-employee/:id'
        element={
          <>
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE DATA STAFF</PageTitle>
            <EditEmployee />
          </>
        }
      />

      <Route
        path='view-employee'
        element={
          <>
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={orderBreadCrumbs}>
              DAFTAR USER INSTALASI & SERVICE MITRA10
            </PageTitle>

            <ListEmployee />
          </>
        }
      />

      <Route index element={<Navigate to='/employee/new-employee' />} />
    </Routes>
  )
}

export default SalesPage
