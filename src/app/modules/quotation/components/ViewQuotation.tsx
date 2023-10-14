/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ViewQuotationHO} from '../../../components'
import {ViewQuotationVendor} from '../../../components'

const ViewQuotation: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Admin HO' ? (
        <>
          <ViewQuotationHO className='' />
        </>
      ) : userRole == 'Admin Vendor' ? (
        <>
          <ViewQuotationVendor className='' />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ViewQuotation}
