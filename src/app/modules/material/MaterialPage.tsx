import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {ViewMaterial} from './components/ViewMaterial'
import {NewMaterial} from './components/NewMaterial'
import {UpdateMaterial} from './components/UpdateMaterial'
import {DetailMaterial} from './components/DetailMaterial'

const materialBreadCrumbs: Array<PageLink> = [
  {
    title: 'Material',
    path: '/material/view-material',
    isSeparator: false,
    isActive: false,
  },
]

const MaterialPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='view-material'
        element={
          <>
            <HeaderWrapper className='bg-header-vendor' />
            <PageTitle breadcrumbs={materialBreadCrumbs}>MATERIAL LIST</PageTitle>
            <ViewMaterial />
          </>
        }
      />

      <Route
        path='new-material'
        element={
          <>
            <HeaderWrapper className='bg-header-vendor' />
            <PageTitle breadcrumbs={materialBreadCrumbs}>NEW MATERIAL FORM</PageTitle>
            <NewMaterial />
          </>
        }
      />

      <Route
        path='update-material/:id'
        element={
          <>
            <HeaderWrapper className='bg-header-vendor' />
            <PageTitle breadcrumbs={materialBreadCrumbs}>UPDATE MATERIAL</PageTitle>
            <UpdateMaterial />
          </>
        }
      />

      <Route
        path='detail-material/:id'
        element={
          <>
            <HeaderWrapper className='bg-header-vendor' />
            <PageTitle breadcrumbs={materialBreadCrumbs}>DETAIL MATERIAL</PageTitle>
            <DetailMaterial />
          </>
        }
      />
      <Route index element={<Navigate to='/material/view-material' />} />
    </Routes>
  )
}

export default MaterialPage
