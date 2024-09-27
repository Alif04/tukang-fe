/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ViewInvoiceHO} from '../../../components'
import {ViewInvoiceVendor} from '../../../components'

const ViewInvoice: React.FC = () => {
  const userRole = localStorage.getItem('userRole') as string

  return (
    <>
      {['Admin HO', 'Super User', 'Finance'].includes(userRole) ? (
        <>
          <ViewInvoiceHO />
        </>
      ) : ['Owner Vendor', 'Admin Vendor'].includes(userRole) ? (
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
