import React, {FC} from 'react'

import {UpdateTukangVendor} from '../../../components'

const UpdateTukangin: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      <UpdateTukangVendor />
    </>
  )
}

export {UpdateTukangin}
