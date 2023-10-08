import React, {FC} from 'react'

import {DetailCostumerStore} from '../../../components'
import {DetailCostumerHO} from '../../../components'

const DetailCostumer: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' || 'Store Staff' ? (
        <>
          <DetailCostumerStore />
        </>
      ) : userRole == 'HO Admin' ? (
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
