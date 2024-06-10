import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {ViewReschedules} from './components/ViewReschedule'
import {NewRescheduleOrder} from './components/NewReschedule'
import {UpdateRescheduleOrder} from './components/UpdateReschedule'

const rescheduleBreadCrumbs: Array<PageLink> = [
  {
    title: 'Reschedule',
    path: '/reschedule/view-reschedule',
    isSeparator: false,
    isActive: false,
  },
]

const RefundPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='view-reschedule'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={rescheduleBreadCrumbs}>LIST RESCHEDULE</PageTitle>
            <ViewReschedules />
          </>
        }
      />

      <Route
        path='new-reschedule'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <PageTitle breadcrumbs={rescheduleBreadCrumbs}>FORMULIR RESCHEDULE</PageTitle>
            <NewRescheduleOrder />
          </>
        }
      />

      <Route
        path='update-reschedule/:id'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole === 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole === 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}

            <UpdateRescheduleOrder />
          </>
        }
      />
    </Routes>
  )
}

export default RefundPage
