import React, {FC, useState} from 'react'

import {PageTitle} from '../../../../_metronic/layout/core'
import {DetailComplaintPage} from '../../../components'
import {DetailComplaintHO} from '../../../components'
import {DetailComplaintVendor} from '../../../components'
import {DetailComplaintTukang} from '../../../components'

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
      {['Sales', 'Store CS'].includes(userRole) ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <DetailComplaintPage updatePageTitle={updatePageTitle} />
        </>
      ) : ['Admin HO', 'Super User'].includes(userRole) ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <DetailComplaintHO updatePageTitle={updatePageTitle} />
        </>
      ) : ['Owner Vendor', 'Admin Vendor'].includes(userRole) ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <DetailComplaintVendor updatePageTitle={updatePageTitle} />
        </>
      ) : userRole === 'Tukang' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <DetailComplaintTukang updatePageTitle={updatePageTitle} />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {DetailComplaint}
