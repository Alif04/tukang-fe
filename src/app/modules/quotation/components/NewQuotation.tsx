import React, {FC} from 'react'

import {NewQuotationHO} from '../../../components'
import {NewQuotationVendor} from '../../../components'

const NewQuotation: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'HO Admin' ? (
        <>
          <NewQuotationHO />
        </>
      ) : userRole == 'Vendor Admin' ? (
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
