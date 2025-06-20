/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {UpdateRefundCS} from '../../../components'
import {UpdateRefundHO} from '../../../components'

const UpdateRefund: React.FC = () => {
  const userRole = localStorage.getItem('userRole') as string

  return (
    <>
      {userRole === 'Store CS' ? (
        <UpdateRefundCS />
      ) : ['Admin HO', 'Super User'].includes(userRole) ? (
        <UpdateRefundHO />
      ) : null}
    </>
  )
}

export {UpdateRefund}
