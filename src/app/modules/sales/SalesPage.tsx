import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'
import {NewSales} from '../../components'

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
            {userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR PENDAFTARAN SALES</PageTitle>
            <NewSales />
          </>
        }
      />

      <Route index element={<Navigate to='/sales/new-sales' />} />
    </Routes>
  )
}

export default SalesPage
