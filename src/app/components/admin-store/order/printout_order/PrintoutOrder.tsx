import React, {FC, useState, useEffect} from 'react'

import './PrintoutOrder.css'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Table, Form, Button, Row, Col} from 'react-bootstrap'

const PrintoutOrder: FC = () => {
  return (
    <section id='printout-order'>
      <div className='card'>
        <div className='card-body'>
          <Row className='d-block m-auto mb-5'>
            <div className='header-printout d-flex justify-content-center align-items-center flex-column '>
              <img
                alt='Logo'
                className='h-100px logo mb-3'
                src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
              />

              <h3 className='store fw-bold'>MITRA 10 FATMAWATI</h3>
              <h3 className='address fw-normal'>Jalan Gading Serpong Boulevard</h3>
            </div>

            <div className='body-printout d-flex justify-content-center align-items-center flex-column mt-5'>
              <h2 className='fw-bold'>Instalasi & Service</h2>
              <h4 className='fw-normal'>Tanggal : 14/10/2023</h4>
            </div>
          </Row>

          <Row className='mt-5 mb-5'>
            <Col>
              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  Order ID :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control plaintext readOnly defaultValue='01' />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  Customer Name :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control plaintext readOnly defaultValue='Syukron' />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  No Telp / WA :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control plaintext readOnly defaultValue='084384334' />
                </Col>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  Request Tanggal Survey :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control plaintext readOnly defaultValue='01' />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  Copy :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control plaintext readOnly defaultValue='0' />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  No Telp / WA :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control plaintext readOnly defaultValue='084384334' />
                </Col>
              </Form.Group>
            </Col>
          </Row>

          <div className='detail-table'>
            <Table hover>
              <thead>
                <tr>
                  <th colSpan={2} className='text-start'>
                    Nama Item
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={2}>Larry the Bird</td>
                </tr>

                <tr>
                  <td className='fs-3 fw-bolder'>Total</td>
                  <td className='fs-3'>Rp. 99.000</td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className='receipt-id d-flex'>
            <h1>Receipt ID :</h1>
            <hr className='line' />
          </div>
        </div>
      </div>
    </section>
  )
}

export {PrintoutOrder}
