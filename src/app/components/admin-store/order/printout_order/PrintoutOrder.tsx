import React, {FC, useState, useEffect} from 'react'

import './PrintoutOrder.css'

import {Orders} from '../../../../interfaces/order'
import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Table, Button, Row, Col} from 'react-bootstrap'

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

  // Grand Total Order
  const calculateTotal = (orderDetail: any) => {
    const {payment_type, is_overdistance, grand_total, additional_fee} = orderDetail ?? {}

    let totalAmount = 0

    if (payment_type === 'gratis') {
      totalAmount = is_overdistance === 0 ? 0 : grand_total + additional_fee
    } else if (payment_type === 'pemasangan_tanpa_survey') {
      totalAmount = is_overdistance === 0 ? grand_total : grand_total + additional_fee
    } else if (payment_type === 'survey') {
      totalAmount = is_overdistance === 0 ? 99000 : grand_total + additional_fee ?? 0
    }

    return `Rp. ${Number(totalAmount).toLocaleString('id')}`
  }

  return (
    <section id='printout-order'>
      <div className='card'>
        <div className='card-body'>
          <Row className='d-block m-auto mb-5'>
            <div className='header-printout d-flex justify-content-center align-items-center flex-column '>
              <img
                alt='Logo'
                className='logo mb-3'
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

          <Row>
            <Col md={6}>
              <Table className='table-printout' borderless={true}>
                <tr>
                  <th style={{width: '50%'}}></th>
                  <th style={{width: '3%'}}></th>
                  <th style={{width: '47%'}}></th>
                </tr>

                <tr>
                  <td className='fw-bold'>Order ID</td>
                  <td className='fw-bold'>:</td>
                  <td>{orderDetail?.id}</td>
                </tr>

                <tr>
                  <td className='fw-bold'>Member Name</td>
                  <td className='fw-bold'>:</td>
                  <td>{orderDetail?.members.full_name}</td>
                </tr>

                <tr>
                  <td className='fw-bold'>No Telp / WA</td>
                  <td className='fw-bold'>:</td>
                  <td>{orderDetail?.project_number}</td>
                </tr>
              </Table>
            </Col>

            <Col md={6}>
              <Table className='table-printout' borderless={true}>
                <tr>
                  <th style={{width: '50%'}}></th>
                  <th style={{width: '3%'}}></th>
                  <th style={{width: '47%'}}></th>
                </tr>

                <tr>
                  <td className='fw-bold'>Tanggal Order</td>
                  <td className='fw-bold'>:</td>
                  <td>{orderDetail ? formatDate(new Date(orderDetail.created_at)) : ''}</td>
                </tr>

                <tr>
                  <td className='fw-bold'>Copy</td>
                  <td className='fw-bold'>:</td>
                  <td>{orderDetail?.print_counter < 1 ? '-' : orderDetail?.print_counter}</td>
                </tr>

                <tr>
                  <td className='fw-bold'>
                    {orderDetail?.payment_type === 'survey'
                      ? 'Request Tanggal Survey :'
                      : 'Request Tanggal Pengerjaan'}
                  </td>
                  <td className='fw-bold'>:</td>
                  <td>{orderDetail ? formatDate(new Date(orderDetail.request_survey)) : ''}</td>
                </tr>

                <tr>
                  <td colSpan={3} className='fw-bold'>
                    <p className='m-0 p-0 fs-8 text-dark-danger'>
                      *Tanggal Request{' '}
                      <span className='fw-bolder text-decoration-underline'>bukan</span> tanggal
                      pasti. Konfirmasi kunjungan dilakukan oleh Vendor
                    </p>
                  </td>
                </tr>
              </Table>
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
                    <td colSpan={2}>
                      {orderDetail?.payment_type === 'survey'
                        ? item?.item_notes
                        : item?.item?.service_name}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td className='fs-3 fw-bolder'>Total</td>
                  <td className='fs-3'>{calculateTotal(orderDetail)}</td>
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
