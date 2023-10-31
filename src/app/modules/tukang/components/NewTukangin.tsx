import React, {FC} from 'react'

import {NewTukang} from '../../../components/tukang/tukang/new_tukang/NewTukang'
import {NewTukangVendor} from '../../../components'

const NewTukangin: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Admin Vendor' ? (
        <>
          <NewTukangVendor />
        </>
      ) : userRole == 'Tukang' ? (
        <>
          <NewTukang />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {NewTukangin}
