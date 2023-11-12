import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'
import {ViewCalendar} from './component/ViewCalendar'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Calendar',
    path: '/calendar/view-calendar',
    isSeparator: false,
    isActive: false,
  },
]

const CalendarPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='view-calendar'
        element={
          <>
            {userRole == 'Admin Vendor' ? (
              <>
                <HeaderWrapper className='bg-header-vendor' />
                <PageTitle breadcrumbs={orderBreadCrumbs}>CALENDAR WORK</PageTitle>
              </>
            ) : userRole == 'Tukang' ? (
              <>
                <HeaderWrapper className='bg-header-tukang' />
                <PageTitle breadcrumbs={orderBreadCrumbs}>CALENDAR WORK ORDER</PageTitle>
              </>
            ) : (
              <></>
            )}
            <ViewCalendar />
          </>
        }
      />
    </Routes>
  )
}

export default CalendarPage
