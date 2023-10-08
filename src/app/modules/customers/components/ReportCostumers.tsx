import React, {FC} from 'react'

import {ReportCostumerStore} from '../../../components'
import {ReportCostumerHO} from '../../../components'

const ReportCostumer: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' || 'Store Staff' ? (
        <>
          <ReportCostumerStore />
        </>
      ) : userRole == 'HO Admin' ? (
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
