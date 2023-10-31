import React, {FC} from 'react'

import {ViewTukangin} from '../../../components'
import {ViewTukangVendor} from '../../../components'

const ViewTukang: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Admin Vendor' ? (
        <>
          <ViewTukangVendor />
        </>
      ) : userRole == 'Tukang' ? (
        <>
          <ViewTukangin />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ViewTukang}
