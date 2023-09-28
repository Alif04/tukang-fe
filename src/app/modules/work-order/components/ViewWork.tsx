import React, {FC} from 'react'

import {ViewWorkVendor} from '../../../components'
import {ViewWorkTukang} from '../../../components'

const ViewWork: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin-vendor' ? (
        <>
          <ViewWorkVendor className='' />
        </>
      ) : userRole == 'admin-tukang' ? (
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
