import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {RegisterBank} from './components/NewBank'
import {ListBanks} from './components/ViewBank'
import {UpdateBank} from './components/UpdateBank'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Bank',
    path: '/bank/new-bank',
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

const BankPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='new-bank'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR PENDAFTARAN BANK</PageTitle>
            <RegisterBank />
          </>
        }
      />

      <Route
        path='update-bank/:id'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE BANK</PageTitle>
            <UpdateBank />
          </>
        }
      />

      <Route
        path='view-bank'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>DAFTAR BANK MITRA10</PageTitle>
            <ListBanks />
          </>
        }
      />

      <Route index element={<Navigate to='/bank/new-bank' />} />
    </Routes>
  )
}

export default BankPage
