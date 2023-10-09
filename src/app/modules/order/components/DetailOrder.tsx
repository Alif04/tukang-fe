import React, {FC} from 'react'

import {DetailOrderStore} from '../../../components'
import {DetailOrderHO} from '../../../components'

const DetailOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' || 'Store Staff' ? (
        <>
          <DetailOrderStore />
        </>
      ) : userRole == 'Admin HO' ? (
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
