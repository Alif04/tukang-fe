import React from 'react'
import {Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {NewFormatEmail} from './components/NewFormatEmail'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Format Email',
    path: '/email/format-email',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
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
            {userRole == 'Admin HO' ? (
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
    </Routes>
  )
}

export default FormatEmailPage
