import React, {FC} from 'react'

import {DateRange} from './components/DateRange'
import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {ChartLine2} from './components/ChartLine2'
import {ChartDonut} from './components/ChartDonut'
import {ChartDonut2} from './components/ChartDonut2'
import {TableList} from './components/TableList'

import Card from 'react-bootstrap/Card'

const DashboardOrderStore: FC = () => {
  return (
    <>
      <div className='row gy-5 g-xl-8'>
        <div className='col-xxl-4 mb-5'>
          <div className='d-flex justify-content-between'>
            <h3 className='d-flex align-items-center fs-5 w-50 fw-bold'>Pilih Periode :</h3>

            <DateRange className='date-range' />
          </div>
        </div>
      </div>

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-12'>
          <Card className='mb-5'>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Order bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                <div className='order-total'>
                  <div className='d-flex flex-column align-items-center ms-5 gap-2'>
                    <h1 className='fw-normal'>20</h1>
                    <p>Total Order</p>
                  </div>
                </div>

                <div className='order-survey'>
                  <div className='d-flex flex-column align-items-center ms-5 me-5 gap-2'>
                    <h1 className='fw-normal'>18</h1>
                    <p>Survey</p>
                  </div>
                </div>

                <div className='order-progress'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>02</h1>
                    <p>On Progress</p>
                  </div>
                </div>

                <div className='order-complete'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>18</h1>
                    <p>Complete</p>
                  </div>
                </div>

                <div className='order-reschedule'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>12</h1>
                    <p className='text-danger'>Reschedule</p>
                  </div>
                </div>

                <div className='order-cancel'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>05</h1>
                    <p className='text-danger'>Cancel</p>
                  </div>
                </div>

                <div className='order-refund'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>01</h1>
                    <p className='text-danger'>Refund</p>
                  </div>
                </div>

                <div className='order-waiting-survey'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>18</h1>
                    <p className='text-gray-800 fw-bold'>Menunggu Survey</p>
                  </div>
                </div>

                <div className='order-waiting-payment'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>01</h1>
                    <p className='text-gray-800 fw-bold'>Menunggu Bayar</p>
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
          <ChartLine2 className='card-xl-stretch mb-xl-8' />
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
    </>
  )
}

export {DashboardOrderStore}
