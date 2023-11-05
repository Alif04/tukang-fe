/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {NewMaterialVendor} from '../../../components'
// import {NewMaterialTukang} from '../../../components'

const NewMaterial: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {/* {userRole === 'Admin Vendor' ? (
        <>
          <NewMaterialVendor />
        </>
      ) : userRole === 'Tukang' ? (
        <>
          <NewMaterialTukang />
        </>
      ) : (
        <></>
      )} */}
      <NewMaterialVendor />
    </>
  )
}

export {NewMaterial}
