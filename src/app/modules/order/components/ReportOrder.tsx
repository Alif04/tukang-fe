import React, {FC} from 'react'

import {ReportOrderStore} from '../../../components'
import {ReportOrderHO} from '../../../components'

const ReportOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin-store' ? (
        <>
          <ReportOrderStore />
        </>
      ) : userRole == 'admin-ho' ? (
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
