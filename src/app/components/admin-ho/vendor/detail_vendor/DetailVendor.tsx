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
            <Col lg={3}>
              <div className='vendor-profile'>
                <img
                  className='d-block m-auto mb-4'
                  src={toAbsoluteUrl('/media/avatars/300-1.jpg')}
                  alt='Avatar'
                />
              </div>

              <h1 className='d-flex justify-content-center fs-1 fw-bold'>PT. ABC</h1>

              <Row className='d-flex justify-content-center'>
                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Vendor ID :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>876992300239</Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Join Since :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>14/12/2000</Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Status :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>ACTIVE</Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Margin :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>35%</Form.Label>
                  </Col>
                </Form.Group>

                <Rate className='d-flex justify-content-center' />

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Phone Number :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>(021) 765-9899</Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Email Address :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>pt.abc@gmail.com</Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Address :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>
                      Jl. Rs. Fatmawati No.39 12150 Jakarta Selatan Dki Jakarta
                    </Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Nama PIC :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>Hendra Setiawan</Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Phone Number :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>0815 765-9899</Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Email Address :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>Hendra@gmail.com</Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Service Type :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>
                      'Civil (service by unit) Electrical (service by unit) Renovasi (service by
                      project)'
                    </Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Service Area :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>JABODETABEK</Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Jumlah Teknisi :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fs-1 fw-semibold'>20</Form.Label>
                  </Col>
                </Form.Group>
              </Row>
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

            <Col lg={5}>
              <div className='table border p-1'>
                <TableList />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  )
}

export {DetailVendorHO}
