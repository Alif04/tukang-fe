/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ViewOrderStoreStaff} from '../../../components'
import {ViewOrderStoreCS} from '../../../components'
import {ViewOrderHO} from '../../../components'

const ViewOrder: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store Staff' || userRole === 'Sales' ? (
        <>
          <ViewOrderStoreStaff className='' />
        </>
      ) : userRole == 'Store CS' ? (
        <>
          <ViewOrderStoreCS className='' />
        </>
      ) : userRole == 'Admin HO' ? (
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
