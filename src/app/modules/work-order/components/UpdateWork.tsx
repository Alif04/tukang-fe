import React, {FC, useState} from 'react'

import {WorkOrder} from '../../../interfaces/work-order'
import {PageTitle} from '../../../../_metronic/layout/core'

import {UpdateWorkVendor} from '../../../components'
import {UpdateWorkTukang} from '../../../components'

const UpdateWork: FC = () => {
  const userRole = localStorage.getItem('userRole')
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (work_order: WorkOrder) => {
    const workOrderId =
      userRole === 'Admin Vendor' || userRole === 'Owner Vendor'
        ? work_order?.work_orders === null
          ? work_order?.id
          : work_order?.work_orders?.id
        : work_order?.id

    const customerName =
      userRole === 'Admin Vendor' || userRole === 'Owner Vendor'
        ? work_order?.members?.full_name ?? '-'
        : work_order?.order?.members?.full_name ?? '-'

    setPageTitle(
      `${
        work_order?.work_orders === null ? 'UPDATE ORDER' : 'UPDATE WORK ORDER'
      } - ${workOrderId} - ${customerName}`
    )
  }

  return (
    <>
      {userRole == 'Admin Vendor' || userRole === 'Owner Vendor' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateWorkVendor updatePageTitle={updatePageTitle} />
        </>
      ) : userRole == 'Tukang' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateWorkTukang updatePageTitle={updatePageTitle} />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {UpdateWork}
