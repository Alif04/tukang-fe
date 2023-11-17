import React, {FC, useState} from 'react'

import {PageTitle} from '../../../../_metronic/layout/core'
import {UpdateVendorHO} from '../../../components'

const UpdateVendor: FC = () => {
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (vendor: any) => {
    const vendorId = vendor?.id || undefined
    const companyName = vendor?.company_name || ''

    setPageTitle(`UPDATE ${vendorId} - ${companyName}`)
  }

  return (
    <>
      <PageTitle>{pageTitle}</PageTitle>
      <UpdateVendorHO updatePageTitle={updatePageTitle} />
    </>
  )
}

export {UpdateVendor}
