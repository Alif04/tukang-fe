/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ReportInsentifStore} from '../../../components'
import {ReportInsentifHO} from '../../../components'

const ReportInsentifList: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Admin HO' ? (
        <>
          <ReportInsentifHO className='' />
        </>
      ) : userRole === 'Store Staff' || userRole === 'Store CS' || userRole === 'Sales' ? (
        <>
          <ReportInsentifStore className='' />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ReportInsentifList}
