import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {CreateIncentive} from './components/CreateIncentive'
import {UpdateIncentive} from './components/UpdateIncentive'
import {ListIncentive} from './components/ListIncentive'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Incentive Sales',
    path: '/incentive-sales/create-incentive',
    isSeparator: false,
    isActive: false,
  },
]

const IncentiveSalesPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='create-incentive'
        element={
          <>
            <HeaderWrapper className='bg-header-ho' />
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR PENGATURAN INSENTIF SALES</PageTitle>
            <CreateIncentive />
          </>
        }
      />

      <Route
        path='update-incentive/:id'
        element={
          <>
            <HeaderWrapper className='bg-header-ho' />
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR EDIT INSENTIF SALES</PageTitle>
            <UpdateIncentive />
          </>
        }
      />

      <Route
        path='view-incentive'
        element={
          <>
            <HeaderWrapper className='bg-header-ho' />
            <PageTitle breadcrumbs={orderBreadCrumbs}>DAFTAR INSENTIF SALES</PageTitle>
            <ListIncentive />
          </>
        }
      />

      <Route index element={<Navigate to='/incentive-sales/create-incentive' />} />
    </Routes>
  )
}

export default IncentiveSalesPage
