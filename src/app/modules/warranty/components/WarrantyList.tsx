/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {WarrantyClaimList} from '../../../components'
import {WarrantyClaimListHO} from '../../../components'

const WarrantyList: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin store' ? (
        <>
          <WarrantyClaimList className='' />
        </>
      ) : userRole == 'admin-ho' ? (
        <>
          <WarrantyClaimListHO className='' />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {WarrantyList}
