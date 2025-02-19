import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {CreateIncentive} from './components/CreateIncentive'
import {UpdateIncentive} from './components/UpdateIncentive'
import {ListIncentive} from './components/ListIncentive'
import {ListRequestIncentive} from './components/ListRequestIncentive'
import {RequestIncentive} from './components/RequestIncentive'
import {DetailRequestIncentive} from './components/DetailRequestIncentive'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Incentive Manager',
    path: '/incentive-manager/create-incentive',
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
          <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR PENGATURAN INSENTIF MANAGER</PageTitle>
          <CreateIncentive />
        </>
      }
    />

    <Route
      path='update-incentive/:id'
      element={
        <>
          <HeaderWrapper className='bg-header-ho' />
          <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR EDIT INSENTIF MANAGER</PageTitle>
          <UpdateIncentive />
        </>
      }
    />

    <Route
      path='view-incentive'
      element={
        <>
          <HeaderWrapper className='bg-header-ho' />
          <PageTitle breadcrumbs={orderBreadCrumbs}>DAFTAR INSENTIF MANAGER</PageTitle>
          <ListIncentive />
        </>
      }
    />

    <Route
      path='list-request-incentive-manager'
      element={
        <>
          <HeaderWrapper className='bg-header-ho' />
          <PageTitle breadcrumbs={orderBreadCrumbs}>DAFTAR PENGAJUAN INSENTIF MANAGER</PageTitle>
          <ListRequestIncentive />
        </>
      }
    />

    <Route
      path='request-incentive-manager'
      element={
        <>
          <HeaderWrapper className='bg-header-ho' />
          <PageTitle breadcrumbs={orderBreadCrumbs}>HALAMAN PENGAJUAN INSENTIF MANAGER</PageTitle>
          <RequestIncentive />
        </>
      }
    />

    <Route
      path='detail-request-incentive-manager/:id'
      element={
        <>
          <HeaderWrapper className='bg-header-ho' />
          <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL PENGAJUAN INSENTIF MANAGER</PageTitle>
          <DetailRequestIncentive />
        </>
      }
    />

    <Route index element={<Navigate to='/incentive-manager/create-incentive' />} />
  </Routes>
  )
}

export default IncentiveSalesPage
