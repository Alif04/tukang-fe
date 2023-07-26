/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'

import {Form} from 'react-bootstrap'

// Dashboard Store
import {
  SalesReportWidget,
  CalendarWidget,
  TransactionWidget,
  TopSalesWidget,
  RecentEventWidget,
  TotalOrderStore,
  TotalComplaint,
  TotalFinishedJob,
  TotalReschedule,
  OrderTracking,
} from '../../components'

// Dashboard HO
import {
  ChartBarOrderHO,
  ChartBarPerformance,
  ChartDonutQuotationHO,
  ChartDonutWorkHO,
  ChartLineComplaintHO,
  ChartLineSurveyHO,
  TotalComplaintHO,
  TotalOrderHO,
  TotalWorkOrder,
  DateRange,
} from '../../components'

// Dashboard Vendor
import {
  TotalOrderVendor,
  TotalWorkVendor,
  TotalComplaintVendor,
  ChartBarOrderVendor,
  ChartLineSurveyVendor,
  ChartLineComplaintVendor,
  ChartDonutComplaintVendor,
  ChartDonutWorkVendor,
} from '../../components'

// Dashboard Tukang
import {
  CardItem,
  ChartBarOrderTukang,
  ChartLineSurveyTukang,
  ChartLineComplaintTukang,
  ChartDonutWorkTukang,
  ChartDonutQuotationTukang,
} from '../../components'

const DashboardStore: FC = () => (
  <>
    {/* begin::Row */}
    <div className='row gy-5 g-xl-8'>
      <div className='col-xxl-4'>
        <SalesReportWidget
          className='card-xl-stretch mb-xl-8'
          backGroundColor='white'
          chartHeight='250px'
        />
      </div>

      <div className='col-xxl-4'>
        <TotalOrderStore className='card-xxl-stretch-50 mb-5 mb-xl-8' chartHeight='200px' />
        <TotalComplaint
          className='card-xxl-stretch-50 mb-5 mb-xl-8'
          chartColor='danger'
          chartHeight='175px'
        />
      </div>

      <div className='col-xxl-4'>
        <TotalFinishedJob
          className='card-xxl-stretch-50 mb-5 mb-xl-8'
          chartColor='success'
          chartHeight='150px'
        />
        <TotalReschedule
          className='card-xxl-stretch-50 mb-5 mb-xl-8'
          chartColor='success'
          chartHeight='175px'
        />
      </div>
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className='row gy-5 g-xl-8'>
      <div className='col-xl-4'>
        <TransactionWidget className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-3'>
        <TopSalesWidget className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-5'>
        <RecentEventWidget className='card-xl-stretch mb-5 mb-xl-8' items={5} />
      </div>
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className='row g-5 gx-xxl-8'>
      <div className='col-xxl-7'>
        <OrderTracking className='card-xxl-stretch mb-5 mb-xxl-8' />
      </div>

      <div className='col-xxl-5'>
        <CalendarWidget className='card-xxl-stretch mb-xl-3' />
      </div>
    </div>
    {/* end::Row */}
  </>
)

const DashboardHO: FC = () => (
  <>
    <div className='row gy-5 g-xl-8'>
      <div className='col-xxl-4 mb-5'>
        <div className='d-flex justify-content-between'>
          <h3 className='d-flex align-items-center fs-7 w-100 fw-normal'>Lihat Store Dashboard</h3>

          <Form.Select>
            <option value='1' selected>
              All
            </option>
            <option value='2'>DKI JAKARTA</option>
            <option value='3'>JABODETABEK</option>
            <option value='3'>001 - Mitra10 BSD </option>
            <option value='3'>002 - Mitra10 Tanggerang </option>
            <option value='3'>003 - Mitra10 Bekasi </option>
          </Form.Select>
        </div>
      </div>

      <div className='col-xxl-4 mb-5'>
        <div className='d-flex justify-content-between'>
          <h3 className='d-flex align-items-center fs-7 w-100 fw-normal'>Pilih rentang waktu</h3>

          <DateRange className='date-range' />
        </div>
      </div>

      <div className='col-xxl-4 mb-5'>
        <div className='d-flex justify-content-between'>
          <h3 className='d-flex align-items-center fs-7 w-100 fw-normal'>Track order/Complaint</h3>

          <div className='filter-search w-100'>
            <Form.Control placeholder='Masukkan Order ID' className='filter' />
          </div>
        </div>
      </div>
    </div>

    <div className='row gy-5 g-xl-8'>
      <div className='col-xxl-4'>
        <TotalOrderHO className='card-xl-stretch mb-5 mb-xl-8' chartHeight='240px' />
      </div>

      <div className='col-xxl-4'>
        <TotalWorkOrder className='card-xl-stretch mb-5 mb-xl-8' chartHeight='240px' />
      </div>

      <div className='col-xxl-4'>
        <TotalComplaintHO className='card-xl-stretch mb-5 mb-xl-8' chartHeight='270px' />
      </div>
    </div>

    <div className='row gy-5 g-xl-8'>
      <div className='col-xl-4'>
        <ChartBarOrderHO className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-4'>
        <ChartLineSurveyHO className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-4'>
        <ChartLineComplaintHO className='card-xl-stretch mb-5 mb-xl-8' />
      </div>
    </div>

    <div className='row gy-5 g-xl-8'>
      <div className='col-xl-4'>
        <ChartDonutQuotationHO className='card-xl-stretch mb-xl-8' chartHeight='300px' />
      </div>
      <div className='col-xl-4'>
        <ChartDonutWorkHO className='card-xl-stretch mb-xl-8' chartHeight='300px' />
      </div>
      <div className='col-xl-4'>
        <ChartBarPerformance className='card-xl-stretch mb-5 mb-xl-8' />
      </div>
    </div>
  </>
)

const DashboardVendor: FC = () => (
  <>
    <div className='row gy-5 g-xl-8'>
      <div className='col-xxl-4'>
        <TotalOrderVendor className='card-xl-stretch mb-5 mb-xl-8' chartHeight='240px' />
      </div>

      <div className='col-xxl-4'>
        <TotalWorkVendor className='card-xl-stretch mb-5 mb-xl-8' chartHeight='240px' />
      </div>

      <div className='col-xxl-4'>
        <TotalComplaintVendor className='card-xl-stretch mb-5 mb-xl-8' chartHeight='270px' />
      </div>
    </div>

    <div className='row gy-5 g-xl-8'>
      <div className='col-xl-4'>
        <ChartBarOrderVendor className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-4'>
        <ChartLineSurveyVendor className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-4'>
        <ChartLineComplaintVendor className='card-xl-stretch mb-5 mb-xl-8' />
      </div>
    </div>

    <div className='row gy-5 g-xl-8'>
      <div className='col-xl-4'>
        <ChartDonutComplaintVendor className='card-xl-stretch mb-xl-8' chartHeight='300px' />
      </div>
      <div className='col-xl-4'>
        <ChartDonutWorkVendor className='card-xl-stretch mb-xl-8' chartHeight='300px' />
      </div>
    </div>
  </>
)

const DashboardTukang: FC = () => (
  <>
    <div className='row-gy-5 g-xl-8 mb-5'>
      <CardItem className='' />
    </div>

    <div className='row gy-5 g-xl-8'>
      <div className='col-xl-4'>
        <ChartBarOrderTukang className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-4'>
        <ChartLineSurveyTukang className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-4'>
        <ChartLineComplaintTukang className='card-xl-stretch mb-5 mb-xl-8' />
      </div>
    </div>

    <div className='row gy-5 g-xl-8'>
      <div className='col-xl-4'>
        <ChartDonutQuotationTukang className='card-xl-stretch mb-xl-8' chartHeight='300px' />
      </div>
      <div className='col-xl-4'>
        <ChartDonutWorkTukang className='card-xl-stretch mb-xl-8' chartHeight='300px' />
      </div>
    </div>
  </>
)

const DashboardWrapper: FC = () => {
  return (
    <>
      <PageTitle>STORE DASHBOARD</PageTitle>
      <DashboardStore />
      {/* <DashboardHO /> */}
      {/* <DashboardVendor /> */}
      {/* <DashboardTukang /> */}
    </>
  )
}

export {DashboardWrapper}
