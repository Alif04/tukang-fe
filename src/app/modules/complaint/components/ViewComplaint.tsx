/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ViewComplaintStore} from '../../../components'
import {ViewComplaintHO} from '../../../components'
import {ViewComplaintVendor} from '../../../components'

const ViewComplaint: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' || userRole === 'Store Staff' ? (
        <>
          <ViewComplaintStore className='' />
        </>
      ) : userRole == 'Admin HO' ? (
        <>
          <ViewComplaintHO className='' />
        </>
      ) : userRole == 'Admin Vendor' ? (
        <>
          <ViewComplaintVendor className='' />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ViewComplaint}
