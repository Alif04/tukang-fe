import React, {FC} from 'react'

import {ChartBar} from './components/ChartBar'
import {ChartBar2} from './components/ChartBar2'
import {ChartLine} from './components/ChartLine'
import {ChartLine2} from './components/ChartLine2'
import {ChartDonut} from './components/ChartDonut'
import {ChartDonut2} from './components/ChartDonut2'
import {QoutationCostumer} from './components/QuotationCostumer'
import {VendorInvoice} from './components/VendorInvoice'
import {SalesIntensitive} from './components/SalesIntensitive'

import Card from 'react-bootstrap/Card'

const DashboardFinanceVendor: FC = () => {
  return (
    <>
      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <QoutationCostumer className='card-xl-stretch mb-xl-8' chartHeight='250px' />
        </div>
        <div className='col-xl-4'>
          <VendorInvoice className='card-xl-stretch mb-xl-8' chartHeight='250px' />
        </div>
        <div className='col-xl-4'>
          <SalesIntensitive className='card-xl-stretch mb-xl-8' chartHeight='250px' />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <ChartBar className='card-xl-stretch mb-xl-8' />
        </div>
        <div className='col-xl-4'>
          <ChartLine className='card-xl-stretch mb-5 mb-xl-8' />
        </div>
        <div className='col-xl-4'>
          <ChartLine2 className='card-xl-stretch mb-xl-8' />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <ChartDonut className='card-xl-stretch mb-xl-8' chartHeight='300px' />
        </div>
        <div className='col-xl-4'>
          <ChartDonut2 className='card-xl-stretch mb-5 mb-xl-8' chartHeight='300px' />
        </div>
        <div className='col-xl-4'>
          <ChartBar2 className='card-xl-stretch mb-xl-8' />
        </div>
      </div>
      {/* end::Row */}
    </>
  )
}

export {DashboardFinanceVendor}
