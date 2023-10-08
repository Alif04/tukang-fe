/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ViewQuotationHO} from '../../../components'
import {ViewQuotationVendor} from '../../../components'

const ViewQuotation: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'HO Admin' ? (
        <>
          <ViewQuotationHO className='' />
        </>
      ) : userRole == 'Vendor Admin' ? (
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
