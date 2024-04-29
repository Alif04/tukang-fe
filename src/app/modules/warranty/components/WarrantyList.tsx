/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {WarrantyClaimList} from '../../../components'
import {WarrantyClaimListHO} from '../../../components'
import {WarrantyClaimListVendor} from '../../../components'

const WarrantyList: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Store CS' ? (
        <>
          <WarrantyClaimList className='' />
        </>
      ) : userRole === 'Admin HO' ? (
        <>
          <WarrantyClaimListHO className='' />
        </>
      ) : userRole === 'Admin Vendor' || userRole === 'Tukang' ? (
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
