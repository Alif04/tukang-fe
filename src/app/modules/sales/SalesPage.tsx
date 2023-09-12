import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {NewSales} from './components/NewSales'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Sales',
    path: '/sales/new-sales',
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

const SalesPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path='new-sales'
        element={
          <>
            <PageTitle breadcrumbs={orderBreadCrumbs}>NEW SALES</PageTitle>
            <NewSales />
          </>
        }
      />
      <Route index element={<Navigate to='/sales/new-sales' />} />
    </Routes>
  )
}

export default SalesPage
