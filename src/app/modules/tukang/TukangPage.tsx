import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'
import {ViewTukang} from './components/ViewTukang'
import {NewTukangin} from './components/NewTukangin'
import {UpdateTukangin} from './components/UpdateTukangin'
import {DetailTukangin} from './components/DetailTukangin'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Tukang',
    path: '/tukang/view-tukang',
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

const TukangPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='view-tukang'
        element={
          <>
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
                <PageTitle breadcrumbs={orderBreadCrumbs}>
                  DAFTAR TUKANG INSTALASI & SERVICE MITRA10
                </PageTitle>
              </>
            ) : userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
                <PageTitle breadcrumbs={orderBreadCrumbs}>LIST TUKANG</PageTitle>
              </>
            ) : (
              <></>
            )}

            <ViewTukang />
          </>
        }
      />

      <Route
        path='new-tukang'
        element={
          <>
            {userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
                <PageTitle breadcrumbs={orderBreadCrumbs}>NEW TUKANG FORM</PageTitle>
              </>
            ) : (
              <></>
            )}

            <NewTukangin />
          </>
        }
      />

      <Route
        path='update-tukang/:id'
        element={
          <>
            {userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
                <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE TUKANG FORM</PageTitle>
              </>
            ) : (
              <></>
            )}

            <UpdateTukangin />
          </>
        }
      />

      <Route
        path='detail-tukang/:id'
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

            <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL TUKANG</PageTitle>
            <DetailTukangin />
          </>
        }
      />

      <Route index element={<Navigate to='/work-order/view-Work_order' />} />
    </Routes>
  )
}

export default TukangPage
