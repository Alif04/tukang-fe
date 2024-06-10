/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ViewQuotationHO} from '../../../components'
import {ViewQuotationVendor} from '../../../components'

const ViewQuotation: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Admin HO' || userRole === 'Super User' ? (
        <>
          <ViewQuotationHO className='' />
        </>
      ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
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
