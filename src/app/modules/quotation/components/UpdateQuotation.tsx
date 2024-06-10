import React, {FC} from 'react'

import {UpdateQuotationHO} from '../../../components'
import {UpdateQuotationVendor} from '../../../components'

const UpdateQuotation: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Admin HO' || userRole === 'Super User' ? (
        <>
          <UpdateQuotationHO />
        </>
      ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
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
