import React, {FC} from 'react'

import {ViewWorkVendor} from '../../../components'
import {ViewWorkOrderTukang} from '../../../components'

const ViewWork: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Admin Vendor' ? (
        <>
          <ViewWorkVendor className='' />
        </>
      ) : userRole == 'Tukang' ? (
        <>
          <ViewWorkOrderTukang className='' />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ViewWork}
