import React, {FC, useState} from 'react'

import {DetailWorkVendor, DetailWorkTukang} from '../../../components'
import {PageTitle} from '../../../../_metronic/layout/core'

const DetailWorkOrder: FC = () => {
  const userRole = localStorage.getItem('userRole')
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (order: any) => {
    const workOrderId =
      userRole === 'Admin Vendor'
        ? order?.work_orders === null
          ? order?.id
          : order?.work_orders?.id
        : order?.id

    const customerName =
      userRole === 'Admin Vendor'
        ? order?.members?.full_name ?? '-'
        : order?.order?.members?.full_name ?? '-'

    setPageTitle(
      `${
        order?.work_orders === null ? 'DETAIL ORDER' : 'DETAIL WORK ORDER'
      } - ${workOrderId} - ${customerName}`
    )
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
