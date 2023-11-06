/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ViewMaterialVendor} from '../../../components'
// import {ViewMaterialTukang} from '../../../components'

const ViewMaterial: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {/* {userRole === 'Admin Vendor' ? (
        <>
          <ViewMaterialVendor />
        </>
      ) : userRole === 'Tukang' ? (
        <>
          <ViewMaterialTukang />
        </>
      ) : (
        <></>
      )} */}
      <ViewMaterialVendor />
    </>
  )
}

export {ViewMaterial}
