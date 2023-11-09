import React, {FC} from 'react'

import {UpdateComplaintStore} from '../../../components'
import {UpdateComplaintHO} from '../../../components'
import {UpdateComplaintVendor} from '../../../components'
import {UpdateComplaintTukang} from '../../../components'

const UpdateComplaint: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' || userRole === 'Store Staff' ? (
        <>
          <UpdateComplaintStore />
        </>
      ) : userRole == 'Admin HO' ? (
        <>
          <UpdateComplaintHO />
        </>
      ) : userRole == 'Admin Vendor' ? (
        <>
          <UpdateComplaintVendor />
        </>
      ) : userRole == 'Tukang' ? (
        <>
          <UpdateComplaintTukang />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {UpdateComplaint}
