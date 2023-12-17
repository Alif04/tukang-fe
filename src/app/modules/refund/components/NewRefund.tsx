/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {NewRefundCS} from '../../../components'
import {NewRefundHO} from '../../../components'

const NewRefund: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' ? (
        <>
          <NewRefundCS />
        </>
      ) : userRole == 'Admin HO' ? (
        <>
          <NewRefundHO />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {NewRefund}
