/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {
  ViewReportStore,
  ViewReportHO,
  ViewReportVendor,
  ViewReportTukang,
} from '../../../components'

const ViewReport: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' || userRole === 'Store Staff' ? (
        <>
          <ViewReportStore />
        </>
      ) : userRole == 'Admin HO' ? (
        <>
          <ViewReportHO />
        </>
      ) : userRole == 'Admin Vendor' ? (
        <>
          <ViewReportVendor />
        </>
      ) : userRole == 'Tukang' ? (
        <>
          <ViewReportTukang />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ViewReport}
