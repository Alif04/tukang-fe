/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'

import {PageTitle} from '../../../../_metronic/layout/core'
import {WarrantyFormClaim} from '../../../components'

const ClaimWarrantyForm: React.FC = () => {
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (warranty: any) => {
    const orderId = warranty?.id || undefined
    const customerName = warranty?.members?.full_name ?? ''

    setPageTitle(`FORMULIR CLAIM  ${orderId} - ${customerName}`)
  }

  return (
    <>
      <PageTitle>{pageTitle}</PageTitle>
      <WarrantyFormClaim updatePageTitle={updatePageTitle} />
    </>
  )
}

export {ClaimWarrantyForm}
