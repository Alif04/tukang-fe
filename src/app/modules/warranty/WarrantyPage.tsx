import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

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

const OrderPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='claim-warranty-list'
        element={
          <>
            <PageTitle breadcrumbs={warrantyBreadCrumbs}>LIST CLAIM GARANSI</PageTitle>
            <WarrantyList />
          </>
        }
      />
      <Route
        path='claim-warranty-form'
        element={
          <>
            <PageTitle breadcrumbs={warrantyBreadCrumbs}>FORMULIR CLAIM - 78453992 ALIA</PageTitle>
            <ClaimWarrantyForm />
          </>
        }
      />
      <Route index element={<Navigate to='/warranty/claim-warranty-list' />} />
    </Routes>
  )
}

export default OrderPage
