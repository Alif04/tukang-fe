import React, {FC} from 'react'

import {NewOrderStore} from '../../../components'
import {NewOrderHO} from '../../../components'

const NewOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' || userRole === 'Store Staff' ? (
        <>
          <NewOrderStore />
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
