import React, {FC} from 'react'

import {ViewWorkVendor} from '../../../components'
import {ViewWorkTukang} from '../../../components'

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
          <ViewWorkTukang className='' />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ViewWork}
