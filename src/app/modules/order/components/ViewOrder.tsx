/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ViewOrderStore} from '../../../components'
import {ViewOrderHO} from '../../../components'

const ViewOrder: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin-store' ? (
        <>
          <ViewOrderStore className='' />
        </>
      ) : userRole == 'admin-ho' ? (
        <>
          <ViewOrderHO className='' />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ViewOrder}
