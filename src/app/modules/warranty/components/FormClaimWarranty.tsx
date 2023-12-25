/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'

import {PageTitle} from '../../../../_metronic/layout/core'
import {WarrantyFormClaim} from '../../../components'
import {WarrantyFormClaimVendor} from '../../../components'

const ClaimWarrantyForm: React.FC = () => {
  const userRole = localStorage.getItem('userRole')
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (warranty: any) => {
    const orderId = warranty?.id || undefined
    const customerName = warranty?.members?.full_name ?? ''

    setPageTitle(`FORMULIR CLAIM  ${orderId} - ${customerName}`)
  }

  return (
    <>
      {userRole === 'Store CS' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <WarrantyFormClaim updatePageTitle={updatePageTitle} />
        </>
      ) : userRole === 'Admin HO' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <WarrantyFormClaim updatePageTitle={updatePageTitle} />
        </>
      ) : userRole === 'Admin Vendor' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <WarrantyFormClaimVendor updatePageTitle={updatePageTitle} />
        </>
      ) : userRole === 'Tukang' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <WarrantyFormClaim updatePageTitle={updatePageTitle} />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {ClaimWarrantyForm}
