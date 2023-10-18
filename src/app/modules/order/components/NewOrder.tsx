import React, {FC} from 'react'

import {NewOrderHO} from '../../../components'

const NewOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Admin HO' ? (
        <>
          <NewOrderHO />
        </>
      ) : null}
    </>
  )
}

export {NewOrder}
