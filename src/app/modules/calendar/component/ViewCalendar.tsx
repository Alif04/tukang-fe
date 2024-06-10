/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {
  ViewCalendarCS,
  ViewCalendarHO,
  ViewCalendarVendor,
  ViewCalendarTukang,
} from '../../../components'

const ViewCalendar: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Sales' || userRole === 'Store Staff' || userRole === 'Store CS' ? (
        <>
          <ViewCalendarCS />
        </>
      ) : userRole === 'Admin HO' || userRole === 'Super User' ? (
        <>
          <ViewCalendarHO />
        </>
      ) : userRole === 'Owner Vendor' ? (
        <>
          <ViewCalendarVendor />
        </>
      ) : userRole === 'Admin Vendor' ? (
        <>
          <ViewCalendarVendor />
        </>
      ) : userRole === 'Tukang' ? (
        <>
          <ViewCalendarTukang />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ViewCalendar}
