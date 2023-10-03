import React, {FC} from 'react'

import {DashboardOrderStore} from '../../../components'
import {DashboardOrderHO} from '../../../components'

const DashboardOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin store' ? (
        <>
          <DashboardOrderStore />
        </>
      ) : userRole == 'admin-ho' ? (
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
