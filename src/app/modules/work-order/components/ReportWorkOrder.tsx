import React, {FC} from 'react'

import {ReportWorkVendor} from '../../../components'
import {ReportWorkTukang} from '../../../components'

const ReportWork: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Admin Vendor' || userRole === 'Owner Vendor' ? (
        <>
          <ReportWorkVendor />
        </>
      ) : userRole == 'Tukang' ? (
        <>
          <ReportWorkTukang />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ReportWork}
