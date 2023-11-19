import React, {FC, useState} from 'react'

import {Order} from '../../../interfaces/order'
import {PageTitle} from '../../../../_metronic/layout/core'
import {UpdateOrderStoreStaff} from '../../../components'
import {UpdateOrderStoreCS} from '../../../components'
import {UpdateOrderHO} from '../../../components'

const UpdateOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (order: Order) => {
    const orderId = order?.id || undefined
    const customerName = order?.members?.full_name || ''

    setPageTitle(`ORDER NUMBER : ${orderId} ${customerName}`)
  }

  return (
    <>
      {userRole == 'Store Staff' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateOrderStoreStaff updatePageTitle={updatePageTitle} />
        </>
      ) : userRole == 'Store CS' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateOrderStoreCS updatePageTitle={updatePageTitle} />
        </>
      ) : userRole == 'Admin HO' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateOrderHO updatePageTitle={updatePageTitle} />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {UpdateOrder}
