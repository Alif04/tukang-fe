/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'

import {PageTitle} from '../../../../_metronic/layout/core'
import {UpdateWarrantyHO} from '../../../components'

const UpdateWarrantyForm: React.FC = () => {
  const userRole = localStorage.getItem('userRole')
  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (warranty: any) => {
    const orderId = warranty?.id || undefined
    const customerName = warranty?.members?.full_name ?? ''

    setPageTitle(`FORMULIR CLAIM  ${orderId} - ${customerName}`)
  }

  return (
    <>
      {userRole === 'Admin HO' ? (
        <>
          <PageTitle>{pageTitle}</PageTitle>
          <UpdateWarrantyHO updatePageTitle={updatePageTitle} />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {UpdateWarrantyForm}
