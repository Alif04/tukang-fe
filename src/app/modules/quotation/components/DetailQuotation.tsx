import React, {FC} from 'react'

import {DetailQuotationHO} from '../../../components'
import {DetailQuotationVendor} from '../../../components'

const DetailQuotation: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin-ho' ? (
        <>
          <DetailQuotationHO />
        </>
      ) : userRole == 'admin-vendor' ? (
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
