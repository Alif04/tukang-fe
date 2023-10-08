import React, {FC} from 'react'

import {DetailQuotationHO} from '../../../components'
import {DetailQuotationVendor} from '../../../components'

const DetailQuotation: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'HO Admin' ? (
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
