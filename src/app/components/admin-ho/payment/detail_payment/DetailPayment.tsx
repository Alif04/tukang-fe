import React, {FC} from 'react'

import './DetailPayment.css'

import {KTSVG, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Table, Button} from 'react-bootstrap'

const DetailPaymentHO: FC = () => {
  return (
    <section id='detail-payment'>
      <div className='card'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='receiver-information'>
              <img
                alt='Logo'
                className='h-50px logo mb-3'
                src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
              />

              <div className='receiver-detail'>
                <h1 className='fw-bolder'>Ditunjukkan kepada :</h1>
                <h1 className='fw-bolder'>Finance Dept</h1>

                <div className='address'>
                  <h3 className='fw-normal'>Jalan Gading Serpong Boulevard Blok Mitra10</h3>
                  <h3 className='fw-normal'>Curug Sangereng, Klp. Dua, Tangerang, </h3>
                  <h3 className='fw-normal'>Banten Kode Pos : 15310 </h3>
                  <h3 className='fw-normal'> Telp: (021) 54217373</h3>
                </div>
              </div>
            </div>

            <div className='payment-request'>
              <h1 className='fw-bolder'>PAYMENT REQ</h1>

              <h3 className='fw-bolder'>
                Periode <span className='fw-normal'>16/3/2023 - 16/4/2023</span>
              </h3>

              <h3 className='fw-bolder'>
                Invoice ID : <span className='fw-normal'>897983245</span>
              </h3>

              <h3 className='fw-bolder'>
                Vendor ID : <span className='fw-normal'>121768</span>
              </h3>

              <h3 className='fw-bolder'>
                Vendor Name : <span className='fw-normal'>PT.ABC</span>
              </h3>
            </div>
          </div>

          <div className='detail-table'>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className='text-center'>Order ID</th>
                  <th className='text-center'>Date Order</th>
                  <th className='text-center'>Quotation ID</th>
                  <th className='text-center'>Vendor Name</th>
                  <th className='text-center'>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>78453992</td>
                  <td>10/2/2023</td>
                  <td>898393</td>
                  <td>PT.ABC</td>
                  <td>500.000</td>
                </tr>
                <tr>
                  <td>78453992</td>
                  <td>10/2/2023</td>
                  <td>898393</td>
                  <td>PT.ABC</td>
                  <td>500.000</td>
                </tr>
                <tr>
                  <td>78453992</td>
                  <td>10/2/2023</td>
                  <td>898393</td>
                  <td>PT.ABC</td>
                  <td>500.000</td>
                </tr>
                <tr>
                  <td>78453992</td>
                  <td>10/2/2023</td>
                  <td>898393</td>
                  <td>PT.ABC</td>
                  <td>500.000</td>
                </tr>
                <tr>
                  <td>78453992</td>
                  <td>10/2/2023</td>
                  <td>898393</td>
                  <td>PT.ABC</td>
                  <td>500.000</td>
                </tr>
                <tr>
                  <td colSpan={4} className='text-end fw-bolder'>
                    TOTAL
                  </td>
                  <td className=' fw-bolder'>2.500.000</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  )
}

export {DetailPaymentHO}
