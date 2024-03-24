import React, {useState, useEffect, FC} from 'react'

import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {ChartLine2} from './components/ChartLine2'
import {ChartDonut} from './components/ChartDonut'
import {ChartDonut2} from './components/ChartDonut2'
import {TopVendorWidget} from './components/TopVendor'

import Card from 'react-bootstrap/Card'

import axios from 'axios'

const ReportVendorHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const [vendorData, setVendorData] = useState<any[]>([])

  useEffect(() => {
    const getVendor = async () => {
      try {
        const response = await axios.get(`${apiUrl}/vendor`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          setVendorData(response.data.data)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getVendor()
  }, [])

  return (
    <>
      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Pekerjaan bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                <div className='order-in'>
                  <div className='d-flex flex-column align-items-center ms-5 gap-2'>
                    <h1 className='fw-normal'>20</h1>
                    <p>MASUK</p>
                  </div>
                </div>

                <div className='order-pending'>
                  <div className='d-flex flex-column align-items-center ms-5 me-5 gap-2'>
                    <h1 className='fw-normal'>18</h1>
                    <p>PENDING</p>
                  </div>
                </div>

                <div className='order-cancel'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>02</h1>
                    <p className='text-danger'>DITOLAK</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Invoice bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                <div className='order-in'>
                  <div className='d-flex flex-column align-items-center ms-5 gap-2'>
                    <h1 className='fw-normal'>20</h1>
                    <p>MASUK</p>
                  </div>
                </div>

                <div className='order-pending'>
                  <div className='d-flex flex-column align-items-center ms-5 me-5 gap-2'>
                    <h1 className='fw-normal'>18</h1>
                    <p>PENDING</p>
                  </div>
                </div>

                <div className='order-cancel'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>02</h1>
                    <p className='text-danger'>DIBAYAR</p>
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
                <div className='order-in'>
                  <div className='d-flex flex-column align-items-center ms-5 gap-2'>
                    <h1 className='fw-normal'>02</h1>
                    <p className=' text-danger'>MASUK</p>
                  </div>
                </div>

                <div className='order-pending'>
                  <div className='d-flex flex-column align-items-center ms-5 me-5 gap-2'>
                    <h1 className='fw-normal'>00</h1>
                    <p>DITOLAK</p>
                  </div>
                </div>

                <div className='order-cancel'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>02</h1>
                    <p className='text-success'>SELESAI</p>
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
          <TopVendorWidget className='card-xl-stretch mb-5 mb-xl-8' vendorData={vendorData} />
        </div>
      </div>
      {/* end::Row */}
    </>
  )
}

export {ReportVendorHO}
