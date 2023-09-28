import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

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
            {userRole == 'admin-vendor' ? (
              <>
                <PageTitle breadcrumbs={orderBreadCrumbs}>CALENDAR WORK</PageTitle>
              </>
            ) : userRole == 'admin-tukang' ? (
              <>
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
