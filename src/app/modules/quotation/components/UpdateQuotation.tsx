import React, {FC} from 'react'

import {UpdateQuotationHO} from '../../../components'
import {UpdateQuotationVendor} from '../../../components'

const UpdateQuotation: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin-ho' ? (
        <>
          <UpdateQuotationHO />
        </>
      ) : userRole == 'admin-vendor' ? (
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
