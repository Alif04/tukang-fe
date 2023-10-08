import React, {FC} from 'react'

import {DashboardFinanceHO} from '../../../components'
import {DashboardFinanceVendor} from '../../../components'

const DashboardFinance: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'HO Admin' ? (
        <>
          <DashboardFinanceHO />
        </>
      ) : userRole == 'Vendor Admin' ? (
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
