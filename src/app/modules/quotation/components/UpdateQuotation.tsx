import React, {FC} from 'react'

import {UpdateQuotationHO} from '../../../components'
import {UpdateQuotationVendor} from '../../../components'

const UpdateQuotation: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'HO Admin' ? (
        <>
          <UpdateQuotationHO />
        </>
      ) : userRole == 'Vendor Admin' ? (
        <>
          <UpdateQuotationVendor />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {UpdateQuotation}
