/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ViewInvoiceHO} from '../../../components'
import {ViewInvoiceVendor} from '../../../components'

const ViewInvoice: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Admin HO' || userRole === 'Super User' ? (
        <>
          <ViewInvoiceHO />
        </>
      ) : userRole === 'Admin Vendor' || userRole === 'Owner Vendor' ? (
        <>
          <ViewInvoiceVendor />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ViewInvoice}
