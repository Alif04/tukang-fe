import React, {FC, useState, useEffect} from 'react'

import './DetailWorkOrder.css'

import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Form, Button, InputGroup, Row, Col, Table} from 'react-bootstrap'

const DetailWorkVendor: FC = () => {
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

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <section id='detail-work-order'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-id'>
                  <h3>
                    {orderDetail?.work_orders === null
                      ? `Order ID : ${orderDetail?.id}`
                      : `Work Order ID : ${orderDetail?.work_orders.id}`}
                  </h3>
                </div>
              </div>

              <div className='costumer-information'>
                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>
                      <span>Costumer ID :</span> {orderDetail?.members.id}
                    </p>
                  </div>

                  <div className='costumer-name  mb-3'>
                    <p className='me-5'>
                      <span>Costumer Name :</span> {orderDetail?.members.full_name}
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      <span>Phone/WA :</span> {orderDetail?.project_number}
                    </p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>
                      <span>Email Address :</span> {orderDetail?.members.email}
                    </p>
                  </div>

                  <div className='alamat-pemasangan d-flex mb-3'>
                    <p className='me-5'>
                      <span>Address :</span> {orderDetail?.project_address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <h3>
                  WORK ORDER STATUS :{' '}
                  <span className='text-success text-uppercase'>
                    {orderDetail?.status.category}
                  </span>
                </h3>
              </div>

              <div className='product-information'>
                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>
                      <span>Order ID : </span>
                      {orderDetail?.id}
                    </p>
                  </div>

                  {/* <div className='costumer-name mb-3'>
                    <p className='me-5'>
                      <span>Nama Jasa Pemasangan : </span>Pemasangan Water Heater
                    </p>
                  </div> */}

                  <div className='email mb-3'>
                    <p className='me-5'>
                      <span>Item Name : </span>
                      {orderDetail?.order_details[0].item_id}
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      <span>Tipe Pembayaran : </span>
                      {(() => {
                        if (orderDetail?.payment_type === 'survey') {
                          return `Berbayar & Survey`
                        } else if (orderDetail?.payment_type === 'gratis') {
                          return `Gratis`
                        } else if (orderDetail?.payment_type === 'pemasangan_tanpa_survey') {
                          return `Berbayar & Pemasangan Tanpa Survey`
                        } else {
                          return ``
                        }
                      })()}
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      <span>Harga Jasa : </span>
                      {`Rp. ${parseInt(
                        orderDetail?.order_details[0].survey_price || 0
                      )?.toLocaleString('id')}`}
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      <span>Quantity : </span>
                      {orderDetail?.order_details[0].quantity}
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      <span>Total Harga : </span>
                      {`Rp. ${parseInt(orderDetail?.grand_total || 0)?.toLocaleString('id')}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-status'>
                  <h3>
                    Nama Toko : <span>{orderDetail?.store.store_name}</span>
                  </h3>
                </div>
              </div>

              <div className='sales-information'>
                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>
                      <span>Tanggal Request Survey : </span>
                      {orderDetail?.work_orders
                        ? formatDate(new Date(orderDetail?.work_orders.request_work_time))
                        : ''}
                    </p>
                  </div>

                  <div className='costumer-name mb-3'>
                    <p className='me-5'>
                      <span>Tanggal Survey : </span>{' '}
                      {orderDetail?.work_orders
                        ? formatDate(new Date(orderDetail?.work_orders.survey_date))
                        : ''}
                      {/* <span>Oleh : </span> Saiful */}
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      <span>Tanggal Mulai Kerja : </span>{' '}
                      {orderDetail?.work_orders
                        ? formatDate(new Date(orderDetail?.work_orders.work_start_date))
                        : ''}
                      {/* <span>Oleh : </span> Udin, Jamal */}
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      <span>Tanggal Selesai : </span>{' '}
                      {orderDetail?.work_orders
                        ? formatDate(new Date(orderDetail?.work_orders.work_end_date))
                        : ''}
                      {/* <span>Oleh : </span> Udin, Jamal */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='table-item'>
            <Table hover>
              <thead className='table-item-head'>
                <tr>
                  <th>Item</th>
                </tr>
              </thead>
              <tbody>
                {orderDetail?.payment_type === 'survey' ? (
                  <>
                    <tr>
                      <td colSpan={6}>Survey</td>
                    </tr>
                  </>
                ) : (
                  orderDetail?.order_details.map((item: any) => (
                    <>
                      <tr>
                        <td>{item?.unit}</td>
                      </tr>
                    </>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          <div className='d-flex justify-content-center'>
            <Button variant='info' type='submit'>
              Print Work Order Detail
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {DetailWorkVendor}
