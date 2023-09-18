import React from 'react'

import './PrintReport.css'
import {Steps} from 'antd'
import {Row, Col, Button, Card, Form} from 'react-bootstrap'

const orderHistory = [
  {
    title: 'Booking Process',
  },
  {
    title: 'Survey Process',
  },
  {
    title: 'Work in Progress',
  },
  {
    title: 'Work Done',
  },
  {
    title: 'Work Done',
  },
]

const PrintReportStore = () => {
  return (
    <section id='print-report'>
      <Card>
        <Card.Body>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Order ID : <span className='fs-4 ms-2 fw-normal'>77652739</span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-4 fw-bold'>
                  Receipt Number : <span className='fs-4 ms-2 fw-normal'>898823469121</span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-2 text-uppercase fw-bold'>
                  Order Status : <span className='fs-2 ms-2 fw-bold text-success'>BOOKED</span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko : <span className='fs-4 ms-2 fw-normal'>MITRA 10 BSD - 101121</span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-4 fw-bold'>
                  Biaya : <span className='fs-4 ms-2 fw-bold text-success'>FREE</span>
                </Form.Label>
              </Col>
            </Row>

            <Row className='information-detail'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='costumer-info mb-3'>
                <div className='fs-3 fw-bold mb-2'>Informasi Pembeli</div>
                <Row>
                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      No Member :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='876992300239' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Customer Name :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Ryan Filbert' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      No Telp / WA :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='08126768945' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Alamat Email :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='ryan.filbert@gmail.com' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Alamat Pemasangan :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control
                        as='textarea'
                        plaintext
                        readOnly
                        rows={3}
                        defaultValue='Jl. Kijang no.9, Jakarta Timur DKI Jakarta, Indonesia'
                      />
                    </Col>
                  </Form.Group>
                </Row>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='product-info mb-3'>
                <div className='fs-3 fw-bold mb-2'>Informasi Produk</div>

                <Row>
                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Nama Jasa Pemasangan:
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Install Water Heater New' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Item Name - Item ID :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control
                        as='textarea'
                        plaintext
                        readOnly
                        rows={3}
                        defaultValue='Electrolux Water Heater - 123765782'
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Harga Jasa :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Rp. 1.000.000' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Jumlah Pemasangan :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='1' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Total Harga Jasa :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Rp. 1.000.000' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Tanggal request pemasangan :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control type='date' plaintext readOnly />
                    </Col>
                  </Form.Group>
                </Row>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='sales-info mb-3'>
                <div className='fs-3 fw-bold mb-2'>Informasi Penjual</div>

                <Row>
                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Sales Person :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Wendy Silitonga' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      NIK :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='876123888788' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Brand / Division :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Keramik' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Nama Bank :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='BCA' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Nomor Akun Bank :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='12312399' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Nama Pemilik Akun :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Wendy Silitonga' />
                    </Col>
                  </Form.Group>
                </Row>
              </Col>
            </Row>
          </div>

          <div className='order-history mt-3 mb-3'>
            <div className='fs-3 fw-bold text-uppercase mb-4'>Order History</div>
            <Steps
              className='order-history-timeline'
              current={0}
              labelPlacement='vertical'
              items={orderHistory}
            />
          </div>

          <div className='d-flex justify-content-center align-items-center'>
            <Button
              variant='danger'
              className='d-flex align-items-center justify-content-center me-2'
            >
              Cancel
            </Button>

            <Button
              variant='dark-primary'
              className='d-flex align-items-center justify-content-center ms-2'
            >
              Save
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {PrintReportStore}
