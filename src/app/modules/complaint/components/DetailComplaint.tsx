import React, {FC, useState} from 'react'

import {PageTitle} from '../../../../_metronic/layout/core'
import {DetailComplaintPage} from '../../../components'
import {UpdateComplaintVendor} from '../../../components'

const DetailComplaint: FC = () => {
  const userRole = localStorage.getItem('userRole') as string
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (complaint: any) => {
    const complaintId = complaint?.id || undefined
    const customerName = complaint?.orders?.members?.full_name || ''

    setPageTitle(`DETAIL ${complaintId} - ${customerName}`)
  }

  return (
    <>
      {['Owner Vendor', 'Admin Vendor'].includes(userRole) ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateComplaintVendor updatePageTitle={updatePageTitle} />
        </>
      ) : (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <DetailComplaintPage updatePageTitle={updatePageTitle} />
        </>
      )}
    </>
  )
}

export {DetailComplaint}
