import React, {FC} from 'react'

import {UpdateTukang} from '../../../components/tukang/tukang/update_tukang/UpdateTukang'
import {UpdateTukangVendor} from '../../../components'

const UpdateTukangin: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Admin Vendor' ? (
        <>
          <UpdateTukangVendor />
        </>
      ) : userRole == 'Tukang' ? (
        <>
          <UpdateTukang />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {UpdateTukangin}
