import React from 'react'
import {Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {ViewVendorRegistration} from './components/ViewVendorRegistration'
import {VendorRegistrationApproval} from './components/VendorRegistrationApproval'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Pendaftaran Vendor',
    path: '/vendor-registration/view',
    isSeparator: false,
    isActive: false,
  },
]

const VendorRegistrationPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        index
        element={<ViewVendorRegistration />}
      />
      <Route
        path='view'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>
              DAFTAR PENDAFTARAN VENDOR
            </PageTitle>
            <ViewVendorRegistration />
          </>
        }
      />

      <Route
        path='approval/:id'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>
              APPROVAL PENDAFTARAN VENDOR
            </PageTitle>
            <VendorRegistrationApproval />
          </>
        }
      />
    </Routes>
  )
}

export default VendorRegistrationPage
