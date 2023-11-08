import React, {FC} from 'react'

import {NewComplaintStore} from '../../../components'
import {NewComplaintHO} from '../../../components'
import {NewComplaintVendor} from '../../../components'
import {NewComplaintTukang} from '../../../components'

const NewComplaint: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' || userRole === 'Store Staff' ? (
        <>
          <NewComplaintStore />
        </>
      ) : userRole === 'Admin HO' ? (
        <>
          <NewComplaintHO />
        </>
      ) : userRole === 'Admin Vendor' ? (
        <>
          <NewComplaintVendor />
        </>
      ) : userRole === 'Tukang ' ? (
        <>
          <NewComplaintTukang />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {NewComplaint}
