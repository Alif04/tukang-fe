/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {UpdateMaterialVendor} from '../../../components'
// import {UpdateMaterialTukang} from '../../../components'

const UpdateMaterial: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {/* {userRole === 'Admin Vendor' ? (
        <>
          <UpdateMaterialVendor />
        </>
      ) : userRole === 'Tukang' ? (
        <>
          <UpdateMaterialTukang />
        </>
      ) : (
        <></>
      )} */}
      <UpdateMaterialVendor />
    </>
  )
}

export {UpdateMaterial}
