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
      {userRole === 'Store CS' || userRole === 'Store Staff' ? (
        <>
          <ViewReportStore />
        </>
      ) : userRole === 'Admin HO' || userRole === 'Super User' ? (
        <>
          <ViewReportHO />
        </>
      ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
        <>
          <ViewReportVendor />
        </>
      ) : userRole === 'Tukang' ? (
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
