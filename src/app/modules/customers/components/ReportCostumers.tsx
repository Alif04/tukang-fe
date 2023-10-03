import React, {FC} from 'react'

import {ReportCostumerStore} from '../../../components'
import {ReportCostumerHO} from '../../../components'

const ReportCostumer: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin store' ? (
        <>
          <ReportCostumerStore />
        </>
      ) : userRole == 'admin-ho' ? (
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
