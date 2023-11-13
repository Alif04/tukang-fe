import React, {FC, useState} from 'react'

import {PageTitle} from '../../../../_metronic/layout/core'
import {DetailComplaintStore} from '../../../components'
import {DetailComplaintHO} from '../../../components'
import {DetailComplaintVendor} from '../../../components'
import {DetailComplaintTukang} from '../../../components'

const DetailComplaint: FC = () => {
  const userRole = localStorage.getItem('userRole')
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (complaint: any) => {
    const complaintId = complaint?.id || undefined
    const customerName = complaint?.orders?.members?.full_name || ''

    setPageTitle(`DETAIL ${complaintId} - ${customerName}`)
  }

  return (
    <>
      {userRole == 'Store CS' || userRole === 'Store Staff' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <DetailComplaintStore updatePageTitle={updatePageTitle} />
        </>
      ) : userRole == 'Admin HO' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <DetailComplaintHO updatePageTitle={updatePageTitle} />
        </>
      ) : userRole == 'Admin Vendor' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <DetailComplaintVendor updatePageTitle={updatePageTitle} />
        </>
      ) : userRole == 'Tukang' ? (
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
