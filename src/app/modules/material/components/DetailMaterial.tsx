/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {DetailMaterialVendor} from '../../../components'
// import {DetailMaterialTukang} from '../../../components'

const DetailMaterial: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {/* {userRole === 'Admin Vendor' ? (
        <>
          <DetailMaterialVendor />
        </>
      ) : userRole === 'Tukang' ? (
        <>
          <DetailMaterialTukang />
        </>
      ) : (
        <></>
      )} */}
      <DetailMaterialVendor />
    </>
  )
}

export {DetailMaterial}
