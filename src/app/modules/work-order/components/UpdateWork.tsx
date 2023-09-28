import React, {FC} from 'react'

import {UpdateWorkVendor} from '../../../components'
import {UpdateWorkTukang} from '../../../components'

const UpdateWork: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin-vendor' ? (
        <>
          <UpdateWorkVendor />
        </>
      ) : userRole == 'admin-tukang' ? (
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
