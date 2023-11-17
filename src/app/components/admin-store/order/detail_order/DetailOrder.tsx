import React, {useState, FC, useEffect} from 'react'

import './DetailOrder.css'

import {Order} from '../../../../interfaces/order'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Row, Col, Form, ListGroup, Table} from 'react-bootstrap'
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

const DetailOrderStore: FC<{updatePageTitle: (order: Order) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const [order, setOrder] = useState<Order>({
    member_id: null,
    seles_id: null,
    store_id: null,
    project_status_id: null,
    request_survey: '',
    vendor_id: null,
    tukang_id: null,
    project_address: '',
    project_number: '',
    receipt_number: '',
    receipt_path: '',
    total_estimate_workdays: null,
    payment_type: '',
    grand_total: '',
    grand_total_comission: '',
    print_counter: null,
    created_by: null,
    updated_by: null,
    created_at: '',
    order_details: [],
  })

  const fetchOrderData = async () => {
    try {
      await axios
        .get(`${apiUrl}/orders/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data as Order

          setOrder(data)

          if (data?.receipt_path) {
            setImage({
              blob: '',
              fileName: data.receipt_path,
            })
          }

          updatePageTitle(data)
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchOrderData()
  }, [])

  const [image, setImage] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <section id='detail-order'>
      <div className='card'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko :{' '}
                  <span className='fs-4 ms-2 fw-normal'>
                    {order.store ? order.store.store_name : ''}
                  </span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Order ID : <span className='fs-4 ms-2 fw-normal'>{order?.id}</span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Col>
                  <Form.Label className='fs-4 fw-bold'>
                    Receipt Number :
                    <span className='fs-4 ms-2 fw-normal'>{order?.receipt_number}</span>
                  </Form.Label>
                </Col>
                <Col>
                  <Form.Label className='fs-4 fw-bold'>
                    Order Status :
                    <span className='fs-4 ms-2 fw-bold text-success'>
                      {order?.status?.category}
                    </span>
                  </Form.Label>
                </Col>
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
                        <Form.Control plaintext readOnly value={order?.members?.id} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Customer Name :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control plaintext readOnly value={order?.members?.full_name} />
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
                          value={order?.project_address}
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
                        <Form.Control plaintext readOnly value={order?.project_number} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Alamat Email :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control plaintext readOnly value={order?.members?.email} />
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
                    <Form.Control plaintext readOnly value={order?.sales?.id} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Sales Person :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Control plaintext readOnly value={order?.sales?.full_name} />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <Row className='table-warranty d-flex align-items-center mb-5'>
            <div className='table-title-warranty'>
              <div className='fs-3 fw-bold'>Informasi Pemasangan</div>
              <Row>
                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Tanggal request pemasangan :</Form.Label>
                  <Col>
                    <Form.Control
                      type='text'
                      plaintext
                      readOnly
                      value={formatDate(new Date(order.request_survey))}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Payment Type:</Form.Label>
                  <Col>
                    <Form.Control
                      type='text'
                      plaintext
                      readOnly
                      value={(() => {
                        if (order?.payment_type === 'survey') {
                          return `Berbayar & Survey`
                        } else if (order?.payment_type === 'gratis') {
                          return `Gratis`
                        } else if (order?.payment_type === 'pemasangan_tanpa_survey') {
                          return `Berbayar & Pemasangan Tanpa Survey`
                        } else {
                          return ``
                        }
                      })()}
                    />
                  </Col>
                </Form.Group>
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
                  {order?.order_details.map((item: any, index: any) => (
                    <>
                      <tr>
                        <td>{item?.item_id}</td>
                        <td>{item?.unit}</td>
                        <td>{item?.item?.category_name}</td>
                        <td>{item?.quantity}</td>
                        <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString('id')}`}</td>
                        <td>{`Rp. ${item?.total.toLocaleString('id')}`}</td>
                      </tr>
                    </>
                  ))}

                  <tr>
                    <td colSpan={5} className='text-end fw-bolder'>
                      Biaya Survey
                    </td>
                    <td className=' fw-bolder'>
                      {order?.payment_type === 'gratis' ||
                      order?.payment_type === 'pemasangan_tanpa_survey'
                        ? `Rp. ${(0).toLocaleString('id')}`
                        : order?.payment_type === 'survey'
                        ? `Rp. ${(99000).toLocaleString('id')}`
                        : `Rp. ${0}`}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={5} className='text-end fw-bolder'>
                      Grand Total
                    </td>
                    <td className=' fw-bolder'>
                      {(() => {
                        if (order?.payment_type === 'gratis') {
                          return `Rp. ${(0).toLocaleString('id')}`
                        } else if (order?.payment_type === 'pemasangan_tanpa_survey') {
                          return `Rp. ${parseInt(order?.grand_total).toLocaleString('id')}`
                        } else if (order?.payment_type === 'survey') {
                          return `Rp. ${(99000).toLocaleString('id')}`
                        } else {
                          return `Rp. ${(0).toLocaleString('id')}`
                        }
                      })()}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Row>

          {order.receipt_path !== '' ? (
            <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group controlId='formFile'>
                  <Form.Label>Bukti Receipt</Form.Label>
                  <Form className='form-input-image'>
                    <Form.Control
                      type='file'
                      accept='image/*'
                      className='input-field-image'
                      hidden
                    />

                    <img
                      src={`${apiUrl}/public/receipt/${image.fileName}`}
                      alt={image.fileName}
                      className='image-preview'
                    />
                  </Form>

                  <div className='uploaded-row'>
                    <span className='upload-content'>{image.fileName ? image.fileName : ''}</span>
                  </div>
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
            </Row>
          ) : (
            <></>
          )}

          {/* <div className='order-history mt-3 mb-3'>
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
                    <ListGroup.Item>342344.png</ListGroup.Item>
                    <ListGroup.Item>848735.png</ListGroup.Item>
                    <ListGroup.Item>Complaint.png</ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}

export {DetailOrderStore}
