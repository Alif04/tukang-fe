/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'

import {PageTitle} from '../../../../_metronic/layout/core'
import {UpdateReschedule} from '../../../components'
import {UpdateRescheduleHO} from '../../../components'

const UpdateRescheduleOrder: React.FC = () => {
  const userRole = localStorage.getItem('userRole') as string
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (reschedule: any) => {
    const rescheduleId = reschedule?.id || undefined
    const customerName = reschedule?.order?.members?.full_name || ''

    setPageTitle(`UPDATE FORMULIR RESCHEDULE ${rescheduleId} - ${customerName}`)
  }

  return (
    <>
      {['Store CS', 'Tukang', 'Admin HO', 'Super User'].includes(userRole) ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateReschedule updatePageTitle={updatePageTitle} />
        </>
      ) : ['Admin Vendor', 'Owner Vendor'].includes(userRole) ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateRescheduleHO updatePageTitle={updatePageTitle} />
        </>
      ) : null}
    </>
  )
}

export {UpdateRescheduleOrder}
