import React, {FC} from 'react'

import './DashboardOrder.css'
import {DateRange} from './components/DateRange'
import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {MoreInformation} from './components/MoreInformation'
import {TableList} from './components/TableList'

import {Card, Row, Col} from 'react-bootstrap'

const DashboardOrderStore: FC = () => {
  return (
    <section id='dashboard-order'>
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

      {/* begin::Row */}
      <div className='row g-5 g-xl-8 mb-5'>
        <div className='col-xl-12'>
          <Card>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Order bulan ini</div>

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
                    <h1 className='fw-normal'>05</h1>
                    <p className='text-danger text-center'>Cancel</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>01</h1>
                    <p className='text-danger text-center'>Refund</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>18</h1>
                    <p className='text-brown fw-bold text-center'>Menunggu Survey</p>
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
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8 mb-5'>
        <div className='col-xl-4'>
          <MoreInformation className='card-xl-stretch mb-xl-8' />
        </div>
        <div className='col-xl-4'>
          <ChartBar className='card-xl-stretch mb-xl-8' />
        </div>
        <div className='col-xl-4'>
          <ChartLine className='card-xl-stretch mb-xl-8' />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-12'>
          <TableList className='card-xl-stretch mb-5 mb-xl-8' />
        </div>
      </div>
      {/* end::Row */}
    </section>
  )
}

export {DashboardOrderStore}
