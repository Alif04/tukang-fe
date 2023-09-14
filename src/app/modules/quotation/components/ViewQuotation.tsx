/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ViewQuotationHO} from '../../../components'
import {ViewQuotationVendor} from '../../../components'

const ViewQuotation: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin-ho' ? (
        <>
          <ViewQuotationHO className='' />
        </>
      ) : userRole == 'admin-vendor' ? (
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
