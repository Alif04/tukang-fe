import React, {FC} from 'react'

import {PreOrderStore} from '../../../components'

const PreOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Store Staff' ? (
        <>
          <PreOrderStore />
        </>
      ) : null}
    </>
  )
}

export {PreOrder}
