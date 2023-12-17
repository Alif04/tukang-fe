/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {ViewRefundCS} from '../../../components'
import {ViewRefundHO} from '../../../components'

const ViewRefund: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'Store CS' ? (
        <>
          <ViewRefundCS className='' />
        </>
      ) : userRole == 'Admin HO' ? (
        <>
          <ViewRefundHO className='' />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ViewRefund}
