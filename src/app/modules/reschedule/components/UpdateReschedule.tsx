/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'

import {PageTitle} from '../../../../_metronic/layout/core'
import {UpdateReschedule} from '../../../components'
import {UpdateRescheduleHO} from '../../../components'

const UpdateRescheduleOrder: React.FC = () => {
  const userRole = localStorage.getItem('userRole')
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (reschedule: any) => {
    const rescheduleId = reschedule?.id || undefined
    const customerName = reschedule?.order?.members?.full_name || ''

    setPageTitle(`UPDATE FORMULIR RESCHEDULE ${rescheduleId} - ${customerName}`)
  }

  return (
    <>
      {userRole === 'Admin HO' ||
      userRole === 'Super User' ||
      userRole === 'Admin Vendor' ||
      userRole === 'Owner Vendor' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateRescheduleHO updatePageTitle={updatePageTitle} />
        </>
      ) : userRole === 'Store CS' || userRole === 'Tukang' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateReschedule updatePageTitle={updatePageTitle} />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {UpdateRescheduleOrder}
