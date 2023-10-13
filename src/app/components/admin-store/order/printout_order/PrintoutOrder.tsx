import React, {FC, useState, useEffect} from 'react'

import './PrintoutOrder.css'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Table, Form, Button, Row, Col} from 'react-bootstrap'

const PrintoutOrder: FC = () => {
  return (
    <section id='printout-order'>
      <div className='card'>
        <div className='card-body'>
          <Row className='d-block m-auto'>
            <div className='header-printout d-flex justify-content-center align-items-center flex-column mb-5'>
              <img
                alt='Logo'
                className='h-100px logo mb-3'
                src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
              />

              <h3 className='store fw-bold'>MITRA 10 FATMAWATI</h3>
              <h3 className='address fw-normal'>Jalan Gading Serpong Boulevard</h3>
            </div>

            <div className='body-printout d-flex justify-content-center align-items-center flex-column mt-5 mb-5'>
              <h2 className='fw-bold'>Instalasi & Service</h2>
              <h4 className='fw-normal'>Tanggal : 14/10/2023</h4>
            </div>
          </Row>

          <Row>
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

          {/* <div className='invoice-detail d-flex justify-content-between'>
            <div className='vendor-information'>
              <div className='vendor-detail'>
                <img
                  alt='Logo'
                  className='h-50px logo mb-3'
                  src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
                />

                <div className='address'>
                  <h3 className='fw-normal'>Jalan Gading Serpong Boulevard Blok Mitra10</h3>
                  <h3 className='fw-normal'>Curug Sangereng, Klp. Dua, Tangerang, </h3>
                  <h3 className='fw-normal'>Banten Kode Pos : 15310 </h3>
                  <h3 className='fw-normal'> Telp: (021) 54217373</h3>
                </div>
              </div>
            </div>

            <div className='payment-request'>
              <h1 className='fw-bolder'>QUOTATION</h1>

              <h3 className='fw-bolder'>
                Tanggal : <span className='fw-normal'>16/3/2023</span>
              </h3>

              <h3 className='fw-bolder'>
                Quotation ID : <span className='fw-normal'>897983245</span>
              </h3>

              <h3 className='fw-bolder'>
                Costumer ID : <span className='fw-normal'>121768</span>
              </h3>
            </div>
          </div>

          <div className='invoice-detail d-flex justify-content-between'>
            <div className='receiver-information'>
              <div className='receiver-detail'>
                <h1 className='fw-bolder'>Ditunjukkan kepada :</h1>
                <h1 className='fw-bolder'>Ibu Ami</h1>
              </div>

              <div className='address'>
                <h3 className='fw-normal'>Jalan Gading Serpong Boulevard Blok Mitra10</h3>
                <h3 className='fw-normal'>Curug Sangereng, Klp. Dua, Tangerang, </h3>
                <h3 className='fw-normal'>Banten Kode Pos : 15310 </h3>
                <h3 className='fw-normal'> Telp: (021) 54217373</h3>
              </div>
            </div>

            <div className='payment-request'>
              <h3 className='fw-bolder'>
                Quotation valid until : <span className='fw-normal'>21/3/2023</span>
              </h3>

              <h3 className='fw-bolder'>
                Instruksi spesial : <span className='fw-normal'>Tidak ada</span>
              </h3>
            </div>
          </div> */}

          <div className='detail-table'>
            <Table hover>
              <thead>
                <tr>
                  <th className='text-center'>Item</th>
                  <th className='text-center'>Harga Satuan</th>
                  <th className='text-center'>Jumlah</th>
                  <th className='text-center'>Total Harga</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Instalasi AC</td>
                  <td>500.000</td>
                  <td>1</td>
                  <td>500.000</td>
                </tr>
                <tr>
                  <td>Pipa AC</td>
                  <td>50.000</td>
                  <td>16</td>
                  <td>800.000</td>
                </tr>
                <tr>
                  <td>Pipa Paralon</td>
                  <td>50.000</td>
                  <td>10</td>
                  <td>500.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Total
                  </td>
                  <td className=' fw-bolder'>1.800.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Tax (11%)
                  </td>
                  <td className=' fw-bolder'>198.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Discount (8%)
                  </td>
                  <td className=' fw-bolder'>-144.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Grand Total
                  </td>
                  <td className=' fw-bolder'>1.854.000</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  )
}

export {PrintoutOrder}
