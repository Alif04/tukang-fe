import React, {FC} from 'react'

import {UpdateOrderStoreStaff} from '../../../components'
import {UpdateOrderStoreCS} from '../../../components'

const UpdateOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store Staff' ? (
        <>
          <UpdateOrderStoreStaff />
        </>
      ) : userRole == 'Store CS' ? (
        <>
          <UpdateOrderStoreCS />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {UpdateOrder}
