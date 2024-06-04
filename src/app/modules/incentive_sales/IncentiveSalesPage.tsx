import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'

import {CreateIncentive} from './components/CreateIncentive'

const orderBreadCrumbs: Array<PageLink> = [
  {
    title: 'Incentive Sales',
    path: '/incentive-sales/create-incentive-sales',
    isSeparator: false,
    isActive: false,
  },
]

const SalesPage: React.FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <Routes>
      <Route
        path='create-incentive-sales'
        element={
          <>
            {userRole === 'Admin HO' ? (
              <>
                <HeaderWrapper className='bg-header-ho' />
              </>
            ) : (
              <></>
            )}
            <PageTitle breadcrumbs={orderBreadCrumbs}>FORMULIR PENGATURAN INSENTIF SALES</PageTitle>
            <CreateIncentive />
          </>
        }
      />

      <Route index element={<Navigate to='/incentive-sales/create-incentive-sales' />} />
    </Routes>
  )
}

export default SalesPage
