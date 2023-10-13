import React, {FC} from 'react'

import {UpdateWorkVendor} from '../../../components'
import {UpdateWorkTukang} from '../../../components'

const UpdateWork: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Admin Vendor' ? (
        <>
          <UpdateWorkVendor />
        </>
      ) : userRole == 'Tukang' ? (
        <>
          <UpdateWorkTukang />
        </>
      ) : (
        <></>
      )}{' '}
    </>
  )
}

export {UpdateWork}
