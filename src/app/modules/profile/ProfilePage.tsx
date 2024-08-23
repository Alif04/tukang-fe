import React, {useState} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'
import {UpdateVendorHO} from '../../components'
import {UpdateTukangVendor} from '../../components'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/profile',
    isSeparator: false,
    isActive: false,
  },
]

const ProfilePage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  const [pageTitle, setPageTitle] = useState<string>('')

  const updatePageTitle = (vendor: any) => {
    const vendorId = vendor?.id || undefined
    const companyName = vendor?.company_name || ''

    setPageTitle(`UPDATE PROFIL ${vendorId} - ${companyName}`)
  }

  return (
    <Routes>
      <Route
        path='update-profile/:id'
        element={
          <>
            {userRole === 'Owner Vendor' && (
              <>
                <HeaderWrapper className='bg-header-vendor' />
                <PageTitle>{pageTitle}</PageTitle>
                <UpdateVendorHO updatePageTitle={updatePageTitle} />
              </>
            )}

            {userRole === 'Tukang' && (
              <>
                <HeaderWrapper className='bg-header-tukang' />
                <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE PROFIL</PageTitle>
                <UpdateTukangVendor />
              </>
            )}
          </>
        }
      />
    </Routes>
  )
}

export default ProfilePage
