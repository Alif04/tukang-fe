import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {WarrantyList} from './components/WarrantyList'
import {ClaimWarrantyForm} from './components/FormClaimWarranty'

const warrantyBreadCrumbs: Array<PageLink> = [
  {
    title: 'Warranty',
    path: '/warranty/claim-warranty-list',
    isSeparator: false,
    isActive: false,
  },
]

const WarrantyPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='claim-warranty-list'
        element={
          <>
            {userRole == 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={warrantyBreadCrumbs}>LIST CLAIM GARANSI</PageTitle>
            <WarrantyList />
          </>
        }
      />

      <Route
        path='claim-warranty-form/:id'
        element={
          <>
            {userRole == 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <ClaimWarrantyForm />
          </>
        }
      />

      <Route index element={<Navigate to='/warranty/claim-warranty-list' />} />
    </Routes>
  )
}

export default WarrantyPage
