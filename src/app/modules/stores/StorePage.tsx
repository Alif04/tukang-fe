import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {RegisterStore} from './components/NewStore'
import {ListStores} from './components/ViewStore'
import {UpdateStore} from './components/UpdateStore'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Store',
    path: '/store/new-store',
    isSeparator: false,
    isActive: false,
  },
]

const StorePage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='new-store'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR PENDAFTARAN STORE</PageTitle>
            <RegisterStore />
          </>
        }
      />

      <Route
        path='update-store/:id'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE STORE</PageTitle>
            <UpdateStore />
          </>
        }
      />

      <Route
        path='view-store'
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
              DAFTAR STORE INSTALASI & SERVICE MITRA10
            </PageTitle>
            <ListStores />
          </>
        }
      />

      <Route index element={<Navigate to='/store/new-store' />} />
    </Routes>
  )
}

export default StorePage
