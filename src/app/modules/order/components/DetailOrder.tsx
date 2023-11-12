import React, {FC, useState} from 'react'

import {PageTitle} from '../../../../_metronic/layout/core'
import {Order} from '../../../interfaces/order'
import {DetailOrderStore} from '../../../components'
import {DetailOrderHO} from '../../../components'

const DetailOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (order: Order) => {
    const orderId = order?.id || undefined
    const customerName = order?.members?.full_name || ''

    setPageTitle(`DETAIL ORDER - ${orderId} ${customerName}`)
  }

  return (
    <>
      {userRole == 'Store CS' || 'Store Staff' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <DetailOrderStore updatePageTitle={updatePageTitle} />
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
