import React, {FC} from 'react'

import {NewOrderStoreStaff, NewOrderStoreCS, NewOrderHO} from '../../../components'

const NewOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store Staff' ? (
        <>
          <NewOrderStoreStaff />
        </>
      ) : userRole == 'Store CS' ? (
        <>
          <NewOrderStoreCS />
        </>
      ) : userRole == 'Admin HO' ? (
        <>
          <NewOrderHO />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {NewOrder}
