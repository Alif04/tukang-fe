/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'

import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'
import {DashboardStore} from '../../components'
import {DashboardHO} from '../../components'
import {DashboardVendor} from '../../components'
import {DashboardTukang} from '../../components'

const DashboardWrapper: FC = () => {
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole === 'Store CS' || userRole === 'Store Staff' || userRole === 'Sales' ? (
        <>
          <PageTitle>Instalasi & Service Mitra 10 Performance Report</PageTitle>
          <DashboardStore />
        </>
      ) : userRole === 'Admin HO' ? (
        <>
          <HeaderWrapper className='bg-header-ho' />
          <PageTitle>Installasi & Service Mitra10 Dashboard</PageTitle>
          <DashboardHO />
        </>
      ) : userRole === 'Admin Vendor' ? (
        <>
          <HeaderWrapper className='bg-header-vendor' />
          <PageTitle>VENDOR DASHBOARD</PageTitle>
          <DashboardVendor />
        </>
      ) : userRole === 'Tukang' ? (
        <>
          <HeaderWrapper className='bg-header-tukang' />
          <PageTitle>TUKANG DASHBOARD</PageTitle>
          <DashboardTukang />
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export {DashboardWrapper}
