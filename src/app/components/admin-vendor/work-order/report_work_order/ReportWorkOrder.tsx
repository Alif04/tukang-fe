import React, {FC} from 'react'

import {TotalOrder} from './components/TotalOrder'
import {TotalWork} from './components/TotalWork'
import {TotalComplaint} from './components/TotalComplaint'
import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {ChartLine2} from './components/ChartLine2'
import {ChartDonut} from './components/ChartDonut'
import {ChartDonut2} from './components/ChartDonut2'

import Card from 'react-bootstrap/Card'

const ReportWorkVendor: FC = () => {
  return (
    <>
      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <TotalOrder className='card-xl-stretch mb-xl-8' chartHeight='250px' />
        </div>
        <div className='col-xl-4'>
          <TotalWork className='card-xl-stretch mb-5 mb-xl-8' chartHeight='250px' />
        </div>
        <div className='col-xl-4'>
          <TotalComplaint className='card-xl-stretch mb-xl-8' chartHeight='250px' />
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
      </div>
      {/* end::Row */}
    </>
  )
}

export {ReportWorkVendor}
