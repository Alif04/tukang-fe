import React, {FC} from 'react'

import {DetailCostumerStore} from '../../../components'
import {DetailCostumerHO} from '../../../components'

const DetailCostumer: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin-store' ? (
        <>
          <DetailCostumerStore />
        </>
      ) : userRole == 'admin-ho' ? (
        <>
          <DetailCostumerHO />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {DetailCostumer}
