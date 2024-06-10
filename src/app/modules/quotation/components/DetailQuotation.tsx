import React, {FC} from 'react'

import {DetailQuotationHO} from '../../../components'
import {DetailQuotationVendor} from '../../../components'

const DetailQuotation: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Admin HO' || userRole === 'Super User' ? (
        <>
          <DetailQuotationHO />
        </>
      ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
        <>
          <DetailQuotationVendor />
        </>
      ) : userRole === 'Tukang' ? (
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
