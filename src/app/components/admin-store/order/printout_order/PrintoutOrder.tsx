import React, {FC, useState, useEffect} from 'react'

import './PrintoutOrder.css'

import {Order} from '../../../../interfaces/order'
import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Table, Form, Button, Row, Col} from 'react-bootstrap'

const PrintoutOrder: FC<{updatePageTitle: (order: Order) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()

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
          updatePageTitle(data)
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

  // Handle Print Order
  const handlePrintOrder = async () => {
    const response = await axios
      .request({
        url: `${apiUrl}/orders/${params.id}/counter`,
        method: 'post',
        maxBodyLength: Infinity,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        printElement('printout-order')
      })
      .catch((error) => {
        console.error(error)

        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
        })
      })
  }

  // Handle Cancel Print
  const handleCancelPrint = () => {
    navigate(`/order/update-order/${params.id}`)
  }

  // Fungsi untuk mencetak elemen
  const printElement = (elementId: string) => {
    const printContents = document.getElementById(elementId)
    const originalContents = document.body.innerHTML

    if (printContents) {
      document.body.innerHTML = printContents.innerHTML
      window.print()
      document.body.innerHTML = originalContents
    }
  }

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

              <h3 className='store fw-bold text-uppercase'>{orderDetail?.store.store_name}</h3>
              <h3 className='address fw-normal'>{orderDetail?.store.address}</h3>
            </div>

            <div className='body-printout d-flex justify-content-center align-items-center flex-column mt-5'>
              <h2 className='fw-bold'>Instalasi & Service</h2>
              <h4 className='fw-normal'>
                Tanggal : {orderDetail ? formatDate(new Date(orderDetail.created_at)) : ''}
              </h4>
            </div>
          </Row>

          <Row className='mt-5 mb-5'>
            <Col>
              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  Order ID :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control plaintext readOnly value={orderDetail?.id} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  Customer Name :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control plaintext readOnly value={orderDetail?.members.full_name} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  No Telp / WA :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control plaintext readOnly value={orderDetail?.project_number} />
                </Col>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  Request Tanggal Survey :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control
                    plaintext
                    readOnly
                    value={orderDetail ? formatDate(new Date(orderDetail.request_survey)) : ''}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  Copy :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control plaintext readOnly value={orderDetail?.print_counter} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  Tanggal Order :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control
                    plaintext
                    readOnly
                    value={orderDetail ? formatDate(new Date(orderDetail.created_at)) : ''}
                  />
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
                {orderDetail?.payment_type === 'survey' ? (
                  <>
                    <tr>
                      <td colSpan={2}>Survey</td>
                    </tr>
                  </>
                ) : (
                  orderDetail?.order_details.map((item: any, index: any) => (
                    <>
                      <tr>
                        <td colSpan={2}>{item?.unit}</td>
                      </tr>
                    </>
                  ))
                )}

                <tr>
                  <td className='fs-3 fw-bolder'>Total</td>
                  <td className='fs-3'>
                    {(() => {
                      if (orderDetail?.payment_type === 'gratis') {
                        return `Rp. ${0?.toLocaleString('id')}`
                      } else if (orderDetail?.payment_type === 'pemasangan_tanpa_survey') {
                        return `Rp. ${parseInt(orderDetail?.grand_total).toLocaleString('id')}`
                      } else if (orderDetail?.payment_type === 'survey') {
                        return `Rp. ${99000?.toLocaleString('id')}`
                      } else {
                        return `Rp. ${0?.toLocaleString('id')}`
                      }
                    })()}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className='receipt-id mb-5'>
            <Row>
              <Col xl={2}>
                <h1 className='fs-2'>Receipt ID :</h1>
              </Col>

              <Col xl={10}>
                <hr className='line' />
              </Col>
            </Row>
          </div>

          <div className='button-wrapper d-flex justify-content-center align-items-center mt-5'>
            <Button className='hide-print-button' variant='dark-danger' onClick={handleCancelPrint}>
              Cancel
            </Button>

            <Button className='hide-print-button' variant='dark-primary' onClick={handlePrintOrder}>
              Print
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {PrintoutOrder}
