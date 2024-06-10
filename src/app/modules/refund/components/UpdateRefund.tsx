/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {UpdateRefundCS} from '../../../components'
import {UpdateRefundHO} from '../../../components'

const UpdateRefund: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Store CS' ? (
        <>
          <UpdateRefundCS />
        </>
      ) : userRole === 'Admin HO' || userRole === 'Super User' ? (
        <>
          <UpdateRefundHO />
        </>
      ) : (
        <></>
      )}{' '}
    </>
  )
}

export {UpdateRefund}
