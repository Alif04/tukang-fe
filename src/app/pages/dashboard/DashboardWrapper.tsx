/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'

import {Row, Col, Card, Form} from 'react-bootstrap'

// Dashboard Store
import {
  SalesReportWidget,
  TransactionWidget,
  WaitingCostumerPay,
  TopSalesWidget,
  TotalOrderStore,
  TotalComplaint,
  TotalReschedule,
} from '../../components'

// Dashboard HO
import '../../components/admin-ho/dashboard/DashboardHO.css'
import {
  ChartBarPerformance,
  DateRange,
  ChartBarOrder,
  ChartBarSurvey,
  MoreInformation,
  TableList,
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
    <div className='row'>
      <div className='col-xxl-4 col-xl-6 col-lg-12 mb-5'>
        <div className='row'>
          <div className='col-xxl-4 col-xl-4 col-lg-4 d-flex align-items-center '>
            <h3 className='d-flex align-items-center fs-3 fw-normal mb-3'>Pilih Periode :</h3>
          </div>

          <div className='col-xxl-8 col-xl-8 col-lg-8'>
            <DateRange className='date-range' />
          </div>
        </div>
      </div>
    </div>

    {/* begin::Row 1 */}
    <div className='row gy-5 g-xl-8'>
      <div className='col-xxl-4 col-xl-4 col-lg-12'>
        <SalesReportWidget
          className='card-xl-stretch mb-xl-8'
          backGroundColor='white'
          chartHeight='250px'
        />
      </div>

      <div className='col-xxl-4 col-xl-4 col-lg-12'>
        <TotalOrderStore
          className='card-xxl-stretch-50 card-xl-stretch-50  mb-xl-8 mb-5'
          chartHeight='220px'
        />
        <TotalComplaint className='card-xxl-stretch-50 card-xl-stretch-50  mb-xl-8 mb-5' />
      </div>

      <div className='col-xxl-4 col-xl-4 col-lg-12'>
        <WaitingCostumerPay
          className='card-xxl-stretch-50 mb-xl-8  mb-5'
          chartColor='success'
          chartHeight='150px'
        />
        <TotalReschedule className='card-xxl-stretch-50 card-xl-stretch-50  mb-xl-8 mb-5' />
      </div>
    </div>
    {/* end::Row 2*/}

    {/* begin::Row 3 */}
    <div className='row gy-5 g-xl-8'>
      <div className='col-xxl-4 col-xl-4 col-lg-12'>
        <TransactionWidget className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xxl-4 col-xl-4 col-lg-12'>
        <TopSalesWidget className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xxl-4 col-xl-4 col-lg-12'></div>
    </div>
    {/* end::Row 3*/}
  </>
)

const DashboardHO: FC = () => (
  <section id='dashboard-ho'>
    <div className='row'>
      <div className='col-xxl-4 col-xl-4 col-lg-12 mb-5'>
        <div className='row'>
          <div className='col-xxl-4 col-xl-4 col-lg-4 d-flex align-items-center '>
            <h3 className='title-header fs-7 fw-normal'>Lihat Store Dashboard</h3>
          </div>

          <div className='col-xxl-8 col-xl-8 col-lg-8'>
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
      </div>

      <div className='col-xxl-4 col-xl-4 col-lg-12 mb-5'>
        <div className='row'>
          <div className='col-xxl-4 col-xl-4 col-lg-4 d-flex align-items-center'>
            <h3 className='title-header fs-7 fw-normal'>Pilih rentang waktu</h3>
          </div>

          <div className='col-xxl-8 col-xl-8 col-lg-8'>
            <DateRange className='date-range' />
          </div>
        </div>
      </div>

      <div className='col-xxl-4 col-xl-4 col-lg-12 mb-5'>
        <div className='row'>
          <div className='col-xxl-4 col-xl-4 col-lg-4 d-flex align-items-center'>
            <h3 className='title-header fs-7 fw-normal'>Track Order</h3>
          </div>

          <div className='col-xxl-8 col-xl-8 col-lg-8 d-flex align-items-center'>
            <div className='filter-search w-100'>
              <Form.Control placeholder='Masukkan Order ID' className='filter' />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className='row g-5 g-xl-8 mb-5'>
      <div className='col-xl-12'>
        <Card>
          <Card.Body>
            <div className='fs-5 fw-normal mb-5'>Order</div>

            <Row className='justify-content-md-center'>
              <Col className='mb-5'>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal'>20</h1>
                  <p className='text-center'>Total Order</p>
                </div>
              </Col>

              <Col className='mb-5'>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal'>18</h1>
                  <p className='text-center'>Survey</p>
                </div>
              </Col>

              <Col className='mb-5'>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal'>02</h1>
                  <p className='text-center'>On Progress</p>
                </div>
              </Col>

              <Col className='mb-5'>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal'>18</h1>
                  <p className='text-center'>Complete</p>
                </div>
              </Col>

              <Col className='mb-5'>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal'>12</h1>
                  <p className='text-danger text-center'>Reschedule</p>
                </div>
              </Col>

              <Col className='mb-5'>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal'>01</h1>
                  <p className='text-brown fw-bold text-center'>Menunggu Bayar</p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </div>

    <div className='row'>
      <div className='col-xxl-8'>
        <div className='row g-5 g-xl-8 mb-5'>
          <div className='col-xl-6'>
            <MoreInformation className='card-xl-stretch mb-xl-8' />
          </div>
          <div className='col-xl-6'>
            <ChartBarSurvey className='card-xl-stretch mb-xl-8' />
          </div>
        </div>

        <div className='row g-5 g-xl-8 mb-5'>
          <div className='col-xl-6'>
            <ChartBarOrder className='card-xl-stretch mb-xl-8' />
          </div>
          <div className='col-xl-6'>
            <ChartBarPerformance className='card-xl-stretch mb-xl-8' />
          </div>
        </div>
      </div>

      <div className='col-xxl-4'>
        <TableList className='card-xl-stretch mb-5 mb-xl-8' />
      </div>
    </div>
  </section>
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
  const userRole = localStorage.getItem('userRole')

  return (
    <>
      {userRole == 'admin store' ? (
        <>
          <PageTitle>Instalasi & Service Mitra 10 Performance Report</PageTitle>
          <DashboardStore />
        </>
      ) : userRole == 'admin-ho' ? (
        <>
          <PageTitle>Installasi & Service Mitra10 Dashboard</PageTitle>
          <DashboardHO />
        </>
      ) : userRole == 'admin-vendor' ? (
        <>
          <PageTitle>VENDOR DASHBOARD</PageTitle>
          <DashboardVendor />
        </>
      ) : userRole == 'admin-tukang' ? (
        <>
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
