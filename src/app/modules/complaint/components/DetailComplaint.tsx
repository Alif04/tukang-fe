import React, {FC} from 'react'

import {DetailComplaintStore} from '../../../components'
import {DetailComplaintHO} from '../../../components'
import {DetailComplaintVendor} from '../../../components'

const DetailComplaint: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' || userRole === 'Store Staff' ? (
        <>
          <DetailComplaintStore />
        </>
      ) : userRole == 'Admin HO' ? (
        <>
          <DetailComplaintHO />
        </>
      ) : userRole == 'Admin Vendor' ? (
        <>
          <DetailComplaintVendor />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {DetailComplaint}
