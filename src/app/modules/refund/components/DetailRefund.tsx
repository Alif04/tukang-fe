/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {DetailRefundCS} from '../../../components'
import {DetailRefundHO} from '../../../components'

const DetailRefund: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' ? (
        <>
          <DetailRefundCS />
        </>
      ) : userRole == 'Admin HO' ? (
        <>
          <DetailRefundHO />
        </>
      ) : (
        <></>
      )}{' '}
    </>
  )
}

export {DetailRefund}
