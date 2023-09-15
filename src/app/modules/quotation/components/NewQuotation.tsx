import React, {FC} from 'react'

import {NewQuotationHO} from '../../../components'
import {NewQuotationVendor} from '../../../components'

const NewQuotation: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin-ho' ? (
        <>
          <NewQuotationHO />
        </>
      ) : userRole == 'admin-vendor' ? (
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
