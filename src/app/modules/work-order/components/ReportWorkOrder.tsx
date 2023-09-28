import React, {FC} from 'react'

import {ReportWorkVendor} from '../../../components'
import {ReportWorkTukang} from '../../../components'

const ReportWork: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin-vendor' ? (
        <>
          <ReportWorkVendor />
        </>
      ) : userRole == 'admin-tukang' ? (
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
