import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {RegisterSales} from './components/NewSales'
import {ViewSales} from './components/ViewSales'
import {EditSales} from './components/UpdateSales'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Sales',
    path: '/sales/new-sales',
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

const SalesPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='new-sales'
        element={
          <>
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR PENDAFTARAN SALES</PageTitle>
            <RegisterSales />
          </>
        }
      />

      <Route
        path='update-sales/:id'
        element={
          <>
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE SALES</PageTitle>
            <EditSales />
          </>
        }
      />

      <Route
        path='view-sales'
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
              DAFTAR SALES INSTALASI & SERVICE MITRA10
            </PageTitle>
            <ViewSales />
          </>
        }
      />

      <Route index element={<Navigate to='/sales/new-sales' />} />
    </Routes>
  )
}

export default SalesPage
