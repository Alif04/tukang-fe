import React, {FC, useState} from 'react'

import {Orders} from '../../../interfaces/order'
import {PageTitle} from '../../../../_metronic/layout/core'
import {PrintoutOrder} from '../../../components'
import {PrintoutOrderCS} from '../../../components'

const PrintOutOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (order: Orders) => {
    const orderId = order?.id || undefined
    const customerName = order?.members?.full_name || ''

    setPageTitle(`PRINTOUT ORDER - ${orderId} ${customerName}`)
  }

  return (
    <>
      {userRole == 'Store Staff' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <PrintoutOrder updatePageTitle={updatePageTitle} />
        </>
      ) : userRole == 'Store CS' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <PrintoutOrderCS updatePageTitle={updatePageTitle} />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {PrintOutOrder}
