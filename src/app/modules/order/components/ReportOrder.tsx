import React, {FC} from 'react'

import {ReportOrderStore} from '../../../components'
import {ReportOrderHO} from '../../../components'

const ReportOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' || 'Store Staff' ? (
        <>
          <ReportOrderStore />
        </>
      ) : userRole == 'HO Admin' ? (
        <>
          <ReportOrderHO />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ReportOrder}
