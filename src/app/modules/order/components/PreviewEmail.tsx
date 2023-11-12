import React, {FC, useState} from 'react'

import {Order} from '../../../interfaces/order'
import {PageTitle} from '../../../../_metronic/layout/core'
import {PreviewEmailOrder} from '../../../components'

const PreviewEmail: FC = () => {
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (order: Order) => {
    const orderId = order?.id || undefined
    const customerName = order?.members?.full_name || ''

    setPageTitle(`PREVIEW EMAIL - ${orderId} ${customerName}`)
  }

  return (
    <>
      <PageTitle>{pageTitle}</PageTitle>
      <PreviewEmailOrder updatePageTitle={updatePageTitle} />
    </>
  )
}

export {PreviewEmail}
