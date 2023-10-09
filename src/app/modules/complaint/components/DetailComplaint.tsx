import React, {FC} from 'react'

import {DetailComplaintStore} from '../../../components'
import {DetailComplaintHO} from '../../../components'

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
      ) : (
        <></>
      )}
    </>
  )
}

export {DetailComplaint}
