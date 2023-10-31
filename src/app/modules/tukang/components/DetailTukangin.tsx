import React, {FC} from 'react'

import {DetailTukangVendor} from '../../../components'
import {DetailTukang} from '../../../components/tukang/tukang/detail_tukang/DetailTukang'

const DetailTukangin: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Admin Vendor' ? (
        <>
          <DetailTukangVendor />
        </>
      ) : userRole == 'Tukang' ? (
        <>
          <DetailTukang />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {DetailTukangin}
