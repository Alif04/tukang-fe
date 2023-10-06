import React, {FC} from 'react'

import {DetailOrderStore} from '../../../components'
import {DetailOrderHO} from '../../../components'

const DetailOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin store' ? (
        <>
          <DetailOrderStore />
        </>
      ) : userRole == 'admin-ho' ? (
        <>
          <DetailOrderHO />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {DetailOrder}
