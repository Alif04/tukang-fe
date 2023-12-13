import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {NewRescheduleOrder} from './components/NewReschedule'
import {UpdateRescheduleOrder} from './components/UpdateReschedule'

const rescheduleBreadCrumbs: Array<PageLink> = [
  {
    title: 'Reschedule',
    path: '/reschedule/view-reschedule',
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

const RefundPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='new-reschedule'
        element={
          <>
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole == 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole == 'Tukang' ? (
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
            {userRole == 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : userRole == 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
              </>
            ) : userRole == 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={rescheduleBreadCrumbs}>UPDATE RESCHEDULE</PageTitle>
            <UpdateRescheduleOrder />
          </>
        }
      />
    </Routes>
  )
}

export default RefundPage
