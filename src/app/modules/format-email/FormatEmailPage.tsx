import React from 'react'
import {Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {NewFormatEmail} from './components/NewFormatEmail'
import {UpdateFormatEmail} from './components/UpdateFormatEmail'
import {ListFormatEmail} from './components/ListFormatEmail'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Format Email',
    path: '/email/format-email',
    isSeparator: false,
    isActive: false,
  },
]

const FormatEmailPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='format-email'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMAT EMAIL</PageTitle>
            <NewFormatEmail />
          </>
        }
      />

      <Route
        path='update-format-email/:id'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE FORMAT EMAIL</PageTitle>
            <UpdateFormatEmail />
          </>
        }
      />

      <Route
        path='view-format-email'
        element={
          <>
            {userRole === 'Admin HO' || userRole === 'Super User' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>DAFTAR FORMAT EMAIL</PageTitle>
            <ListFormatEmail />
          </>
        }
      />
    </Routes>
  )
}

export default FormatEmailPage
