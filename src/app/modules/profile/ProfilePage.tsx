import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'
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
  return (
    <Routes>
      <Route
        path='update-profile/:id'
        element={
          <>
            <HeaderWrapper className='bg-header-tukang' />
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE PROFIL</PageTitle>
            <UpdateTukangVendor />
          </>
        }
      />
    </Routes>
  )
}

export default ProfilePage
