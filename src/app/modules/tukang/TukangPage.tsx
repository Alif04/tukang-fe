import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {ViewTukang} from './components/ViewTukang'
import {NewTukangin} from './components/NewTukangin'
import {UpdateTukangin} from './components/UpdateTukangin'
import {DetailTukangin} from './components/DetailTukangin'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Order',
    path: '/Work-Order/view-Work',
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

const TukangPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='view-tukang'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>TUKANG LIST</PageTitle>
            <ViewTukang />
          </>
        }
      />

      <Route
        path='new-tukang'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>NEW TUKANG FORM</PageTitle>
            <NewTukangin />
          </>
        }
      />

      <Route
        path='update-tukang'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>UPDATE TUKANG FORM</PageTitle>
            <UpdateTukangin />
          </>
        }
      />

      <Route
        path='detail-tukang'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>DETAIL TUKANG</PageTitle>
            <DetailTukangin />
          </>
        }
      />

      <Route index element={<Navigate to='/work-order/view-Work_order' />} />
    </Routes>
  )
}

export default TukangPage
