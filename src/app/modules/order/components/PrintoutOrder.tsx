import React, {FC, useState} from 'react'

import {Order} from '../../../interfaces/order'
import {PageTitle} from '../../../../_metronic/layout/core'
import {PrintoutOrder} from '../../../components'

const PrintOutOrder: FC = () => {
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (order: Order) => {
    const orderId = order?.id || undefined
    const customerName = order?.members?.full_name || ''

    setPageTitle(`PRINTOUT ORDER - ${orderId} ${customerName}`)
  }

  return (
    <>
      <PageTitle>{pageTitle}</PageTitle>
      <PrintoutOrder updatePageTitle={updatePageTitle} />
    </>
  )
}

export {PrintOutOrder}
