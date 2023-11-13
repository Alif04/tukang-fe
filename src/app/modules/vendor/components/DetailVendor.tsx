import React, {FC, useState} from 'react'

import {PageTitle} from '../../../../_metronic/layout/core'
import {DetailVendorHO} from '../../../components'

const DetailVendor: FC = () => {
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (vendor: any) => {
    const companyName = vendor?.company_name || ''

    setPageTitle(`${companyName}`)
  }

  return (
    <>
      <PageTitle>{pageTitle}</PageTitle>
      <DetailVendorHO updatePageTitle={updatePageTitle} />
    </>
  )
}

export {DetailVendor}
