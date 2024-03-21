import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {ViewCostumer} from '../customers/components/ViewCostumers'
import {NewCostumers} from '../customers/components/NewCostumers'
import {DetailCostumer} from './components/DetailCostumers'
import {UpdateCostumers} from './components/UpdateCostumers'
import {ReportCostumer} from './components/ReportCostumers'

const costumersBreadCrumbs: Array<PageLink> = [
  {
    title: 'Costumers',
    path: '/costumers/view-costumers',
    isSeparator: false,
    isActive: false,
  },
]

const CostumersPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='view-costumers'
        element={
          <>
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={costumersBreadCrumbs}>
              Daftar Customer Installasi & Service Mitra10
            </PageTitle>
            <ViewCostumer />
          </>
        }
      />

      <Route
        path='new-costumers'
        element={
          <>
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={costumersBreadCrumbs}>NEW COSTUMER FORM</PageTitle>
            <NewCostumers />
          </>
        }
      />

      <Route
        path='update-costumers/:id'
        element={
          <>
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={costumersBreadCrumbs}>UPDATE COSTUMER</PageTitle>
            <UpdateCostumers />
          </>
        }
      />

      <Route
        path='detail-costumers/:id'
        element={
          <>
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={costumersBreadCrumbs}>PROFILE COSTUMER</PageTitle>
            <DetailCostumer />
          </>
        }
      />

      <Route
        path='report-costumers'
        element={
          <>
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={costumersBreadCrumbs}>COSTUMERS DASHBOARD</PageTitle>
            <ReportCostumer />
          </>
        }
      />
      <Route index element={<Navigate to='/costumers/view-costumers' />} />
    </Routes>
  )
}

export default CostumersPage
