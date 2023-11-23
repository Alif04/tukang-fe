/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ViewCalendarHO} from '../../../components'
import {ViewCalendarVendor} from '../../../components'
import {ViewCalendarTukang} from '../../../components'

const ViewCalendar: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Admin HO' ? (
        <>
          <ViewCalendarHO />
        </>
      ) : userRole == 'Admin Vendor' ? (
        <>
          <ViewCalendarVendor />
        </>
      ) : userRole == 'Tukang' ? (
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
