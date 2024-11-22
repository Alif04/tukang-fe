/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useState, useEffect} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'

import axios from 'axios'
import {HeaderWrapper} from '../../../_metronic/layout/components/header/HeaderWrapper'
import {DashboardStore} from '../../components'
import {DashboardHO} from '../../components'
import {DashboardVendor} from '../../components'
import {DashboardTukang} from '../../components'

interface Status {
  value: number | null
  category: string
  decription: string
}

const DashboardWrapper: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const userRole = localStorage.getItem('userRole') as string
  const [status, setStatus] = useState<Status[]>([])

  // Get Status
  const getStatus = async () => {
    try {
      const response = await axios.get(`${apiUrl}/status?take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempStatus = response.data.data.map((item: any) => ({
          value: item.id,
          category: item.category,
          description: item.description,
        }))

        setStatus(tempStatus)

        localStorage.setItem('statusData', JSON.stringify(tempStatus))
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    getStatus()
  }, [])

  return (
    <>
      {['Store Staff', 'Store CS', 'Sales'].includes(userRole) ? (
        <>
          <PageTitle>Instalasi & Service Mitra 10 Performance Report</PageTitle>
          <DashboardStore />
        </>
      ) : ['Admin HO', 'Super User'].includes(userRole) ? (
        <>
          <HeaderWrapper className='bg-header-ho' />
          <PageTitle>Installasi & Service Mitra10 Dashboard</PageTitle>
          <DashboardHO />
        </>
      ) : ['Owner Vendor', 'Admin Vendor'].includes(userRole) ? (
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
