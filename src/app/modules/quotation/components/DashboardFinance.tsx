import React, {FC} from 'react'

import {DashboardFinanceHO} from '../../../components'
import {DashboardFinanceVendor} from '../../../components'

const DashboardFinance: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin-ho' ? (
        <>
          <DashboardFinanceHO />
        </>
      ) : userRole == 'admin-vendor' ? (
        <>
          <DashboardFinanceVendor />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {DashboardFinance}
