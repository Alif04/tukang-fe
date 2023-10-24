import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {ViewCostumer} from '../customers/components/ViewCostumers'
import {NewCostumers} from '../customers/components/NewCostumers'
import {DetailCostumer} from './components/DetailCostumers'
import {ReportCostumer} from './components/ReportCostumers'

const costumersBreadCrumbs: Array<PageLink> = [
  {
    title: 'Costumers',
    path: '/costumers/view-costumers',
    isSeparator: false,
    isActive: false,
  },
]

const CostumersPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='view-costumers'
        element={
          <>
            <PageTitle breadcrumbs={costumersBreadCrumbs}>COSTUMERS LIST</PageTitle>
            <ViewCostumer />
          </>
        }
      />

      <Route
        path='new-costumers'
        element={
          <>
            <PageTitle breadcrumbs={costumersBreadCrumbs}>NEW COSTUMER FORM</PageTitle>
            <NewCostumers />
          </>
        }
      />

      <Route
        path='detail-costumers/:id'
        element={
          <>
            <PageTitle breadcrumbs={costumersBreadCrumbs}>PROFILE COSTUMER</PageTitle>
            <DetailCostumer />
          </>
        }
      />

      <Route
        path='report-costumers'
        element={
          <>
            <PageTitle breadcrumbs={costumersBreadCrumbs}>COSTUMERS DASHBOARD</PageTitle>
            <ReportCostumer />
          </>
        }
      />
      <Route index element={<Navigate to='/costumers/view-costumers' />} />
    </Routes>
  )
}

export default CostumersPage
