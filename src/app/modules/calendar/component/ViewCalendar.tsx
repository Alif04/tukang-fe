/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ViewCalendarVendor} from '../../../components'
import {ViewCalendarTukang} from '../../../components'

const ViewCalendar: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Vendor Admin' ? (
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
