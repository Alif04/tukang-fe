import React, {FC, useState} from 'react'

import {DetailWorkVendor, DetailWorkTukang} from '../../../components'

import {PageTitle} from '../../../../_metronic/layout/core'
import {Orders} from '../../../interfaces/order'

const DetailWorkOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (order: Orders) => {
    const orderId = order?.id || undefined
    const customerName = order?.members?.full_name || ''

    setPageTitle(`DETAIL ORDER - ${orderId} - ${customerName}`)
  }

  return (
    <>
      {userRole == 'Admin Vendor' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <DetailWorkVendor updatePageTitle={updatePageTitle} />
        </>
      ) : userRole == 'Tukang' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <DetailWorkTukang updatePageTitle={updatePageTitle} />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {DetailWorkOrder}
