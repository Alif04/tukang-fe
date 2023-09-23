import React, {FC, useState} from 'react'

import './DetailOrder.css'

import {Image} from 'antd'
import {Row, Col, Form, InputGroup, ListGroup, Table, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'
import {Steps} from 'antd'

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

const complaintHistory = [
  {
    title: 'Complaint Received',
  },
  {
    title: 'Investigation Proccess',
  },
  {
    title: 'Remedial Progress',
  },
  {
    title: 'Complaint Done',
  },
]

const DetailOrderHO: FC = () => {
  const [image, setImage] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  return (
    <section id='detail-order'>
      <div className='card'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko : <span className='fs-4 ms-2 fw-normal'>MITRA 10 - BSD</span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Order ID : <span className='fs-4 ms-2 fw-normal'>77652739</span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Receipt Number : <span className='fs-4 ms-2 fw-normal'>898823469121</span>
                </Form.Label>
              </Col>
            </Row>

            <Row className='information-detail'>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='costumer-info mb-5'>
                <div className='fs-3 fw-bold'>Informasi Pembeli</div>
                <Row>
                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
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
                  </Col>

                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Nomor Telp/WA :
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
                  </Col>
                </Row>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='sales-info mb-5'>
                <div className='fs-3 fw-bold'>Informasi Penjual</div>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Sales ID :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Control plaintext readOnly defaultValue='876123887787' />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Sales Person :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Control plaintext readOnly defaultValue='Wendy Silitonga' />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <Row className='table-warranty d-flex align-items-center mb-5'>
            <div className='table-title-warranty'>
              <div className='fs-3 fw-bold'>Informasi Pemasangan</div>

              <Row className='table-header mb-5'>
                <Col
                  xs={12}
                  md={3}
                  lg={3}
                  xl={3}
                  xxl={3}
                  className='request-date order-2 order-md-1'
                >
                  {/* <Form.Group as={Row} className='mb-3' controlId='formPlaintextEmail'>
                    <Form.Label column sm='6'>
                      Tanggal request pemasangan :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control type='date' plaintext readOnly />
                    </Col>
                  </Form.Group> */}

                  <Form.Label>Tanggal request pemasangan :</Form.Label>
                  <Form.Control type='date' plaintext readOnly />
                </Col>

                <Col
                  xs={12}
                  md={3}
                  lg={3}
                  xl={3}
                  xxl={3}
                  className='assigned-vendor order-2 order-md-1'
                >
                  <Form.Label>Assigned Vendor :</Form.Label>
                  <Form.Select>
                    <option value='1'>PT. ABC</option>
                    <option value='2'>PT. BCA</option>
                    <option value='3'>PT. AZA</option>
                    <option value='4'>PT. DBK</option>
                  </Form.Select>
                </Col>

                <Col xs={12} md={3} lg={3} xl={3} xxl={3} className='btn-update order-3 order-md-2'>
                  <Button variant='dark-primary'>Save Update</Button>
                </Col>

                <Col
                  xs={12}
                  md={3}
                  lg={3}
                  xl={3}
                  xxl={3}
                  className='order-status order-1 order-md-2'
                >
                  <Form.Label className='fs-4 fw-bold'>
                    ORDER STATUS : <span className='fs-4 ms-2 fw-bold text-success'>ORDER</span>
                  </Form.Label>
                </Col>
              </Row>
            </div>

            <div className='table-warranty-content'>
              <Table hover responsive='md'>
                <thead className='table-warranty-head'>
                  <tr>
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Nama Pemasangan</th>
                    <th>QTY Pemasangan</th>
                    <th>Harga Jasa</th>
                    <th>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>500.00</td>
                  </tr>

                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>500.00</td>
                  </tr>

                  <tr>
                    <td colSpan={5} className='text-end fw-bolder'>
                      Total
                    </td>
                    <td className=' fw-bolder'>1.000.000</td>
                  </tr>

                  <tr>
                    <td colSpan={5} className='text-end fw-bolder'>
                      Biaya Survey
                    </td>
                    <td className=' fw-bolder'>700.000</td>
                  </tr>

                  <tr>
                    <td colSpan={5} className='text-end fw-bolder'>
                      Grand Total
                    </td>
                    <td className=' fw-bolder'>1.700.000</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Row>

          <div className='order-history mt-3 mb-3'>
            <div className='fs-3 fw-bold text-success mb-4'>Order History</div>
            <Steps
              className='order-history-timeline'
              current={0}
              labelPlacement='vertical'
              items={orderHistory}
            />
          </div>

          <div className='complaint-history  mt-3 mb-3'>
            <div className='fs-3 fw-bold text-danger mb-4'>Complaint History</div>
            <Steps
              className='complaint-history-timeline'
              current={2}
              labelPlacement='vertical'
              items={complaintHistory}
            />
          </div>

          <div className='card'>
            <div className='card-body'>
              <Row>
                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Complaint Date :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control type='date' plaintext readOnly />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      PIC Complaint :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Call' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      PIC Complaint :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Nuning' />
                    </Col>
                  </Form.Group>
                </Col>

                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Label className='mt-3'>Complaint Detail :</Form.Label>
                  <Form.Control
                    style={{minHeight: '200px'}}
                    as='textarea'
                    plaintext
                    readOnly
                    defaultValue='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
                        in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat'
                  ></Form.Control>
                </Col>

                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Label className='mt-3'>Complaint Evidence :</Form.Label>
                  <ListGroup>
                    <ListGroup.Item action onClick={() => setVisible(true)}>
                      342344.png
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => setVisible(true)}>
                      848735.png
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => setVisible(true)}>
                      Complaint.docx
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>

      <Image
        width={200}
        style={{display: 'none'}}
        src='https://images.unsplash.com/photo-1682686580433-2af05ee670ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60'
        preview={{
          visible,
          src: 'https://images.unsplash.com/photo-1682686580433-2af05ee670ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60',
          onVisibleChange: (value) => {
            setVisible(value)
          },
        }}
      />
    </section>
  )
}

export {DetailOrderHO}
