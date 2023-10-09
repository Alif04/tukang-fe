import React, {FC} from 'react'

import {DetailQuotationHO} from '../../../components'
import {DetailQuotationVendor} from '../../../components'

const DetailQuotation: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Admin HO' ? (
        <>
          <DetailQuotationHO />
        </>
      ) : userRole == 'Vendor Admin' ? (
        <>
          <DetailQuotationVendor />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {DetailQuotation}
