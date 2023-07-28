import React, {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './DetailVendor.css'

import {Rate} from 'antd'
import {Form, Table, Button, Row, Col} from 'react-bootstrap'
import {ChartPie} from './components/ChartPie'
import {TableList} from './components/TableList'
import {TableList2} from './components/TableList2'

const DetailVendorHO: FC = () => {
  return (
    <section id='detail-vendor'>
      <div className='card mb-5'>
        <div className='card-body'>
          <Row>
            <Col lg={4}>
              <div className='vendor-profile'>
                <img
                  className='d-block m-auto mb-4'
                  src={toAbsoluteUrl('/media/avatars/300-1.jpg')}
                  alt='Avatar'
                />

                <div className='vendor-information'>
                  <h1>PT ABC</h1>

                  <tr>
                    <td className='left'>
                      <h3 className='fw-bold text-start'>Vendor ID :</h3>
                    </td>
                    <td className='right'>
                      <h3 className='fw-bold text-start'>77652739</h3>
                    </td>
                  </tr>

                  <tr>
                    <td className='left'>
                      <h3 className='fw-bold text-start'>Join Since :</h3>
                    </td>
                    <td className='right'>
                      <h3 className='fw-bold text-start'>14/12/2000</h3>
                    </td>
                  </tr>

                  <Rate className='d-flex justify-content-center mt-3 mb-3' />

                  <tr>
                    <td className='left'>
                      <h3 className='fw-bold text-start'>Phone Number :</h3>
                    </td>
                    <td className='right'>
                      <h3 className='fw-bold text-start'>(021) 765-9899</h3>
                    </td>
                  </tr>

                  <tr>
                    <td className='left'>
                      <h3 className='fw-bold text-start'>Email Address :</h3>
                    </td>
                    <td className='right'>
                      <h3 className='fw-bold text-start'>pt.abc@gmail.com</h3>
                    </td>
                  </tr>

                  <div className='d-flex justify-content-center'>
                    <h3 className='fw-bold pt-2  pb-2 w-75'>Address :</h3>
                    <h3 className='fw-bold pt-2  pb-2'>
                      RS. Fatmawati No.39 12150 Jakarta Selatan DKI Jakarta
                    </h3>
                  </div>

                  <div className='serving-area d-flex justify-content-start'>
                    <h3 className='fw-bold pt-2  pb-2'>Serving Area :</h3>

                    <ul className='mt-2'>
                      <li>
                        <h3 className='fw-bold text-start p-0'>JABODETABEK</h3>
                      </li>
                      <li>
                        <h3 className='fw-bold text-start p-0'>MEDAN</h3>
                      </li>
                      <li>
                        <h3 className='fw-bold text-start p-0'>UJUNG PADANG</h3>
                      </li>
                    </ul>
                  </div>

                  <h3 className='fw-bold pt-2 pb-2 text-start'>
                    Jumlah Teknisi : <span className='fw-normal fs-2'>20</span>
                  </h3>
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className='d-flex flex-column'>
                <div className='stats mt-5 mb-5'>
                  <div className='card'>
                    <ChartPie className='' chartHeight='280px' />
                  </div>
                </div>

                <div className='table border p-1'>
                  <TableList />
                </div>
              </div>
            </Col>

            <Col lg={4}>Table 2</Col>
          </Row>
        </div>
      </div>
    </section>
  )
}

export {DetailVendorHO}
