import React, {FC, useState, useEffect} from 'react'

import './PrintoutOrder.css'

import {Orders} from '../../../../interfaces/order'
import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Table, Form, Button, Row, Col} from 'react-bootstrap'

const PrintoutOrder: FC<{updatePageTitle: (order: Orders) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()

  const [orderDetail, setOrderDetail] = useState<any>()
  const [isPrinting, setIsPrinting] = useState<boolean>(false)

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

  useEffect(() => {
    if (isPrinting) {
      window.print()
      setIsPrinting(false)
    }
  }, [isPrinting])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Handle Print Order
  const handlePrintOrder = async () => {
    try {
      await axios
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

        // fetchOrderData()
        .then(() => {
          setIsPrinting(true)
        })
        .catch((error) => {
          console.error(error)

          Swal.fire({
            title: 'Error',
            text: error.response.data.message,
            icon: 'error',
          })
        })
    } catch (error) {
      console.error(error)
    }
  }

  // Handle Cancel Print
  const handleCancelPrint = () => {
    navigate(`/order/update-order/${params.id}`)
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

              <h3 className='store fw-bold text-uppercase text-center'>
                {orderDetail?.store.store_name}
              </h3>
              <h3 className='address fw-normal text-center'>{orderDetail?.store.address}</h3>
            </div>

            <div className='body-printout d-flex justify-content-center align-items-center flex-column mt-5'>
              <h2 className='fw-bold text-center'>Instalasi & Service</h2>
              <h4 className='fw-normal text-center'>
                Tanggal : {orderDetail ? formatDate(new Date(orderDetail.created_at)) : ''}
              </h4>
            </div>
          </Row>

          <Row className='mt-5 mb-5'>
            <Col md='6' sm='6'>
              <Form.Group as={Row} className='detail-info'>
                <Form.Label column md='4' sm='12'>
                  Order ID :
                </Form.Label>
                <Col md='8' sm='12'>
                  <Form.Control plaintext readOnly value={orderDetail?.id} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column md='4' sm='12'>
                  Member Name :
                </Form.Label>
                <Col md='8' sm='12'>
                  <Form.Control plaintext readOnly value={orderDetail?.members.full_name} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column md='4' sm='12'>
                  No Telp / WA :
                </Form.Label>
                <Col md='8' sm='12'>
                  <Form.Control plaintext readOnly value={orderDetail?.project_number} />
                </Col>
              </Form.Group>
            </Col>

            <Col md='6' sm='6'>
              <Form.Group as={Row} className='detail-info'>
                <Form.Label column md='6' sm='12'>
                  Tanggal Order :
                </Form.Label>
                <Col md='6'>
                  <Form.Control
                    plaintext
                    readOnly
                    value={orderDetail ? formatDate(new Date(orderDetail.request_survey)) : ''}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column md='6' sm='12'>
                  Copy :
                </Form.Label>
                <Col md='6'>
                  <Form.Control
                    plaintext
                    readOnly
                    value={orderDetail?.print_counter < 1 ? '-' : orderDetail?.print_counter}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column md='6' sm='12'>
                  Request Tanggal Survey :
                </Form.Label>

                <Col md='6'>
                  <Form.Control
                    plaintext
                    readOnly
                    value={orderDetail ? formatDate(new Date(orderDetail.request_survey)) : ''}
                  />
                </Col>

                <Form.Text className='m-0 fs-8 text-dark-danger'>
                  *Tanggal Request{' '}
                  <span className='fw-bolder text-decoration-underline'>bukan</span> tanggal pasti.
                  Konfirmasi kunjungan dilakukan oleh Vendor
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <div className='detail-table'>
            <Table hover>
              <thead>
                {orderDetail?.payment_type !== 'survey' && (
                  <tr>
                    <th colSpan={2} className='text-start'>
                      Nama Pemasangan
                    </th>
                  </tr>
                )}
              </thead>
              <tbody>
                {orderDetail?.order_details.map((item: any, index: any) => (
                  <tr key={`service-${index}`}>
                    <td colSpan={2}>{item?.item?.service_name}</td>
                  </tr>
                ))}

                <tr>
                  <td className='fs-3 fw-bolder'>Total</td>
                  <td className='fs-3'>
                    {(() => {
                      if (orderDetail?.payment_type === 'gratis') {
                        return `Rp. ${0?.toLocaleString('id')} ( GRATIS )`
                      }
                      if (orderDetail?.payment_type === 'pemasangan_tanpa_survey') {
                        return `Rp. ${parseInt(orderDetail?.grand_total).toLocaleString('id')}`
                      }
                      if (orderDetail?.payment_type === 'survey') {
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
              {orderDetail?.print_counter < 1 ? 'Print' : 'Reprint'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {PrintoutOrder}
