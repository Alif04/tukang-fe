/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {WarrantyFormClaim} from '../../../components'
import {WarrantyFormClaimVendor} from '../../../components'

const ClaimWarrantyForm: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Admin HO' ? (
        <>
          <WarrantyFormClaim />
        </>
      ) : userRole === 'Admin Vendor' ? (
        <>
          <WarrantyFormClaimVendor />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ClaimWarrantyForm}
