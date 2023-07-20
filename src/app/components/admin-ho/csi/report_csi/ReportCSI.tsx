import React, {FC} from 'react'

import {ChartPie} from './components/ChartPie'
import {ChartBar} from './components/ChartBar'
import {ChartBar2} from './components/ChartBar2'
import {ChartLine} from './components/ChartLine'
import {ChartLine2} from './components/ChartLine2'
import {ChartDonut} from './components/ChartDonut'
import {ComplaintList} from './components/ComplaintList'

import Card from 'react-bootstrap/Card'

const ReportCSIHO: FC = () => {
  return (
    <>
      {/* begin::Row */}
      <div className='row g-5'>
        <div className='col-xl-12'>
          <ChartPie className='card-xl-stretch mb-5' chartHeight='250px' />
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
          <ChartBar2 className='card-xl-stretch mb-xl-8' />
        </div>
        <div className='col-xl-4'>
          <ComplaintList className='card-xl-stretch mb-xl-8' />
        </div>
      </div>
      {/* end::Row */}
    </>
  )
}

export {ReportCSIHO}
