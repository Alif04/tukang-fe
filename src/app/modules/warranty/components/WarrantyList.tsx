/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {WarrantyClaimList} from '../../../components'
import {WarrantyClaimListVendor} from '../../../components'

const WarrantyList: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Store CS' || userRole === 'Admin HO' || userRole === 'Tukang' ? (
        <>
          <WarrantyClaimList className='' />
        </>
      ) : userRole === 'Admin Vendor' ? (
        <>
          <WarrantyClaimListVendor className='' />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {WarrantyList}
