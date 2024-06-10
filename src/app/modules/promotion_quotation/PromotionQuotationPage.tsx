import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {CreatePromotion} from './components/CreatePromotion'
import {UpdatePromotion} from './components/UpdatePromotion'
import {ListPromotion} from './components/ListPromotion'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Promotion Quotation',
    path: '/promotion-quotation/create-promotion',
    isSeparator: false,
    isActive: false,
  },
]

const PromotionQuotationPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='create-promotion'
        element={
          <>
            <HeaderWrapper className='bg-header-ho' />
            <PageTitle breadcrumbs={orderBreadCrumbs}>
              FORMULIR PENGATURAN PROMOSI QUOTATION
            </PageTitle>
            <CreatePromotion />
          </>
        }
      />

      <Route
        path='update-promotion/:id'
        element={
          <>
            <HeaderWrapper className='bg-header-ho' />
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR EDIT PROMOSI QUOTATION</PageTitle>
            <UpdatePromotion />
          </>
        }
      />

      <Route
        path='view-promotion'
        element={
          <>
            <HeaderWrapper className='bg-header-ho' />
            <PageTitle breadcrumbs={orderBreadCrumbs}>DAFTAR PROMOSI QUOTATION</PageTitle>
            <ListPromotion />
          </>
        }
      />

      <Route index element={<Navigate to='/promotion-quotation/create-promotion' />} />
    </Routes>
  )
}

export default PromotionQuotationPage
