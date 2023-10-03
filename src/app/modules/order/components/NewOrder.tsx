import React, {FC} from 'react'

import {NewOrderStore} from '../../../components'
import {NewOrderHO} from '../../../components'

const NewOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin store' ? (
        <>
          <NewOrderStore />
        </>
      ) : userRole == 'admin-ho' ? (
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
