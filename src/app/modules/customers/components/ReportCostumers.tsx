import React, {FC} from 'react'

import {ReportCostumerStore} from '../../../components'
import {ReportCostumerHO} from '../../../components'

const ReportCostumer: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Store CS' || userRole === 'Store Staff' ? (
        <>
          <ReportCostumerStore />
        </>
      ) : userRole === 'Admin HO' || userRole === 'Super User' ? (
        <>
          <ReportCostumerHO />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ReportCostumer}
