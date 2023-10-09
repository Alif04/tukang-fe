import React, {FC} from 'react'

import {DashboardOrderStore} from '../../../components'
import {DashboardOrderHO} from '../../../components'

const DashboardOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' || 'Store Staff' ? (
        <>
          <DashboardOrderStore />
        </>
      ) : userRole == 'Admin HO' ? (
        <>
          <DashboardOrderHO />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {DashboardOrder}
