import React, {FC} from 'react'

import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {ChartLine2} from './components/ChartLine2'
import {ChartDonut} from './components/ChartDonut'
import {ChartDonut2} from './components/ChartDonut2'
import {TableList} from './components/TableList'

import Card from 'react-bootstrap/Card'

const ReportCostumerStore: FC = () => {
  return (
    <>
      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Costumer bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                <div className='order-in'>
                  <div className='d-flex flex-column align-items-center ms-5 gap-2'>
                    <h1 className='fw-normal'>20</h1>
                    <p>NEW</p>
                  </div>
                </div>

                <div className='order-pending'>
                  <div className='d-flex flex-column align-items-center ms-5 me-5 gap-2'>
                    <h1 className='fw-normal'>18</h1>
                    <p>EXISTING</p>
                  </div>
                </div>

                <div className='order-cancel'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>02</h1>
                    <p className='text-danger'>DORMANT</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Pekerjaan bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                <div className='survey'>
                  <div className='d-flex flex-column align-items-center ms-5 gap-2'>
                    <h1 className='fw-normal'>18</h1>
                    <p>SURVEY</p>
                  </div>
                </div>

                <div className='wip'>
                  <div className='d-flex flex-column align-items-center ms-5 me-5 gap-2'>
                    <h1 className='fw-normal'>12</h1>
                    <p>WIP</p>
                  </div>
                </div>

                <div className='done'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>05</h1>
                    <p className='text-success'>DONE</p>
                  </div>
                </div>

                <div className='complaint'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>01</h1>
                    <p className='text-danger'>COMPLAINT</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Complaint bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                <div className='rework'>
                  <div className='d-flex flex-column align-items-center ms-5 gap-2'>
                    <h1 className='fw-normal'>00</h1>
                    <p>REWORK</p>
                  </div>
                </div>

                <div className='reschedule'>
                  <div className='d-flex flex-column align-items-center ms-5 me-5 gap-2'>
                    <h1 className='fw-normal'>00</h1>
                    <p>RESCHEDULE</p>
                  </div>
                </div>

                <div className='refund'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>00</h1>
                    <p>REFUND</p>
                  </div>
                </div>

                <div className='resolve'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>01</h1>
                    <p>RESOLVE</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
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
          <TableList className='card-xl-stretch mb-5 mb-xl-8' />
        </div>
      </div>
      {/* end::Row */}
    </>
  )
}

export {ReportCostumerStore}
