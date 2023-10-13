import React, {FC} from 'react'

import {DetailWorkVendor} from '../../../components'
import {DetailWorkTukang} from '../../../components'

const DetailWorkOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Admin Vendor' ? (
        <>
          <DetailWorkVendor />
        </>
      ) : userRole == 'Tukang' ? (
        <>
          <DetailWorkTukang />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {DetailWorkOrder}
