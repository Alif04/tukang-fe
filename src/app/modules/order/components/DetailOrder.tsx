import React, {FC, useState} from 'react'

import {PageTitle} from '../../../../_metronic/layout/core'
import {Orders} from '../../../interfaces/order'
import {DetailOrders} from '../../../components'

const DetailOrder: FC = () => {
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (order: Orders) => {
    const orderId = order?.id || undefined
    const customerName = order?.members?.full_name || ''

    setPageTitle(`DETAIL ORDER - ${orderId} ${customerName}`)
  }

  return (
    <>
      <PageTitle>{pageTitle}</PageTitle>
      <DetailOrders updatePageTitle={updatePageTitle} />
    </>
  )
}

export {DetailOrder}
