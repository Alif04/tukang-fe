import React, {FC} from 'react'

import {ChartPie} from './components/ChartPie'
import {ChartPie2} from './components/ChartPie2'
import {ChartPie3} from './components/ChartPie3'
import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {ChartLine2} from './components/ChartLine2'
import {ChartDonut} from './components/ChartDonut'
import {ChartDonut2} from './components/ChartDonut2'
import {BestCostumers} from './components/BestCostumers'

const ReportCostumerHO: FC = () => {
  return (
    <>
      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <ChartPie className='card-xl-stretch mb-5' chartHeight='260px' />
        </div>

        <div className='col-xl-4'>
          <ChartPie2 className='card-xl-stretch mb-5' chartHeight='200px' />
        </div>

        <div className='col-xl-4'>
          <ChartPie3 className='card-xl-stretch mb-5' chartHeight='250px' />
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
          <BestCostumers className='card-xl-stretch mb-5 mb-xl-8' />
        </div>
      </div>
      {/* end::Row */}
    </>
  )
}

export {ReportCostumerHO}
