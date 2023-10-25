import React, {useState, useEffect, FC} from 'react'

import './UpdateWorkOrder.css'

import axios from 'axios'
import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Button, Row, Col} from 'react-bootstrap'

const UpdateWorkVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [orderDetail, setOrderDetail] = useState<any>()

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
          const data = response.data.data
          setOrderDetail(data)
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchOrderData()
  }, [])

  return (
    <section id='update-work-order'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-id'>
                  <h3>Nama Toko : {orderDetail?.store.store_name}</h3>
                </div>
              </div>

              <div className='costumer-information'>
                <div className='title mb-5'>
                  <h1>COSTUMER INFORMATION</h1>
                </div>

                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>Costumer ID : {orderDetail?.members.id}</p>
                  </div>

                  <div className='costumer-name  mb-3'>
                    <p className='me-5'>Costumer Name : {orderDetail?.members.full_name}</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Phone/WA : {orderDetail?.project_number}</p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>Email Address : {orderDetail?.members.email}</p>
                  </div>

                  <div className='alamat-pemasangan d-flex mb-3'>
                    <p className='me-5'>Address : {orderDetail?.project_address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <Form.Group as={Row} className='mb-3'>
                  <Form.Label column sm='4'>
                    Work order ID :
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control readOnly type='text' value={orderDetail?.id} />
                  </Col>
                </Form.Group>
              </div>

              <div className='product-information'>
                <div className='title  mb-5'>
                  <h1>PRODUCT INFORMATION</h1>
                </div>

                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>Order ID : {orderDetail?.id}</p>
                  </div>

                  <div className='costumer-name mb-3'>
                    <p className='me-5'>
                      Nama Jasa Pemasangan : {orderDetail?.order_details[0].unit}
                    </p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>Item Name : {orderDetail?.order_details[0].unit}</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5 text-uppercase'>
                      Tipe Pembayaran : {orderDetail?.payment_type}
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Harga Jasa : {orderDetail?.order_details[0].total}</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Quantity : {orderDetail?.order_details[0].quantity}</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Total Harga : {orderDetail?.grand_total}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-status'>
                  <h3>
                    Order Status : <span>Permintaan Survey</span>
                  </h3>
                </div>
              </div>

              <div className='sales-information'>
                <div className='title mb-5'>
                  <h1>WORK INFORMATION</h1>
                </div>

                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>Tanggal Request Survey : 09/06/2023</p>
                  </div>

                  <div className='costumer-name mb-3'>
                    <p className='me-5'>Tanggal Survey : 10/06/2023</p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>Tanggal Pekerjaan : 19/06/2023</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Tanggal Reschedule</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Tanggal Mulai Keja : 19/06/2023</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Tanggal Selesai : 29/06/2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className='work-status'>
            <h1 className='title text-decoration-underline'>New Work Status</h1>

            <div className='d-flex justify-content-between'>
              <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                <Form.Label>Update Work Order</Form.Label>
                <Form.Select>
                  <option value='1' selected>
                    SURVEY START
                  </option>
                  <option value='2'>WORK START</option>
                  <option value='3'>WIP</option>
                  <option value='4'>WORK END</option>
                  <option value='5'>INVESTIGATE</option>
                  <option value='6'>REWORK</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                <Form.Label>Tanggal survey : </Form.Label>
                <Form.Control type='date' />
              </Form.Group>

              <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                <Form.Label>Tanggal mulai pengerjaan : </Form.Label>
                <Form.Control type='date' />
              </Form.Group>

              <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                <Form.Label>Tanggal selesai pengerjaan : </Form.Label>
                <Form.Control type='date' />
              </Form.Group>

              <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                <Form.Label>Nama Lengkap Tehnisi : </Form.Label>
                <Form.Select>
                  <option value='1' selected>
                    Johan
                  </option>
                  <option value='2'>Sugiro</option>
                  <option value='3'>Aang</option>
                  <option value='4'>Paulus</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <div className='d-flex justify-content-center'>
            <Button variant='dark-danger' type='submit'>
              Cancel
            </Button>

            <Button variant='dark-primary' type='submit'>
              Save
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {UpdateWorkVendor}
