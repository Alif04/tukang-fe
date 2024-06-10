import React, {FC, useState} from 'react'

import {PageTitle} from '../../../../_metronic/layout/core'
import {UpdateComplaintStore} from '../../../components'
import {UpdateComplaintHO} from '../../../components'
import {UpdateComplaintVendor} from '../../../components'
import {UpdateComplaintTukang} from '../../../components'

const UpdateComplaint: FC = () => {
  const userRole = localStorage.getItem('userRole')
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (complaint: any) => {
    const complaintId = complaint?.id || undefined
    const customerName = complaint?.orders?.members?.full_name || ''

    setPageTitle(`UPDATE FORMULIR PENGADUAN ${complaintId} - ${customerName}`)
  }

  return (
    <>
      {userRole === 'Store CS' || userRole === 'Store Staff' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateComplaintStore updatePageTitle={updatePageTitle} />
        </>
      ) : userRole === 'Admin HO' || userRole === 'Super User' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateComplaintHO updatePageTitle={updatePageTitle} />
        </>
      ) : userRole === 'Owner Vendor' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateComplaintVendor updatePageTitle={updatePageTitle} />
        </>
      ) : userRole === 'Admin Vendor' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateComplaintVendor updatePageTitle={updatePageTitle} />
        </>
      ) : userRole === 'Tukang' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateComplaintTukang updatePageTitle={updatePageTitle} />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {UpdateComplaint}
