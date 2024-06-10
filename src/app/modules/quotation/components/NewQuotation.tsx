import React, {FC} from 'react'

import {NewQuotationHO} from '../../../components'
import {NewQuotationVendor} from '../../../components'

const NewQuotation: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Admin HO' || userRole === 'Super User' ? (
        <>
          <NewQuotationHO />
        </>
      ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
        <>
          <NewQuotationVendor />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {NewQuotation}
