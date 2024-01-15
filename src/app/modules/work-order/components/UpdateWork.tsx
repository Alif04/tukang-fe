import React, {FC, useState} from 'react'

import {WorkOrder} from '../../../interfaces/work-order'
import {PageTitle} from '../../../../_metronic/layout/core'

import {UpdateWorkVendor} from '../../../components'
import {UpdateWorkTukang} from '../../../components'

const UpdateWork: FC = () => {
  const userRole = localStorage.getItem('userRole')
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (work_order: WorkOrder) => {
    const orderId = work_order?.id || undefined
    const customerName = work_order?.members?.full_name || ''

    setPageTitle(`UPDATE ORDER - ${orderId} ${customerName}`)
  }

  return (
    <>
      {userRole == 'Admin Vendor' ? (
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
