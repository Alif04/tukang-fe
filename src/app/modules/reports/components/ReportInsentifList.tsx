/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ReportInsentifStore} from '../../../components'
import {ReportInsentifHO} from '../../../components'

const ReportInsentifList: React.FC = () => {
  const userRole = localStorage.getItem('userRole') as string

  return (
    <>
      {['Admin HO', 'Super User', 'Payroll'].includes(userRole) ? (
        <>
          <ReportInsentifHO className='' />
        </>
      ) : ['Store Staff', 'Store CS', 'Sales'].includes(userRole) ? (
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
