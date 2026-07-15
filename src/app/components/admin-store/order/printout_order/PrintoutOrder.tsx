import React, {FC, useState, useEffect} from 'react'
import {Orders} from '../../../../interfaces/order'

import './PrintoutOrder.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Skeleton} from 'antd'
import {useNavigate, useParams} from 'react-router-dom'
import {formatDate, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Card, Button, Row} from 'react-bootstrap'

const PrintoutOrder: FC<{updatePageTitle: (order: Orders) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()

  const [orderDetail, setOrderDetail] = useState<any>()
  const [isPrinting, setIsPrinting] = useState<boolean>(false)
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true)

  const fetchOrderData = async () => {
    try {
      await axios
        .get(`${apiUrl}/orders/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            // 'Access-Control-Allow-Origin': '*',
           // 'ngrok-skip-browser-warning':  'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          setOrderDetail(data)
          updatePageTitle(data)
          setIsLoadingPage(false)
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
            // 'Access-Control-Allow-Origin': '*',
           // 'ngrok-skip-browser-warning':  'true',
          },
        })

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
    navigate(`/order/view-order`)
  }

  return (
    <section id='printout-order'>
      <Card>
        <Card.Body>
          <Row>
            <div className='header-printout d-flex'>
              <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
                <img
                  alt='Logo'
                  className='logo mb-2'
                  src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
                />
              </Skeleton>

              <Skeleton active loading={isLoadingPage} paragraph={{rows: 2}}>
                <div className='store'>
                  <h3 className='store fw-bold text-uppercase text-start'>
                    {orderDetail?.store?.store_name}
                  </h3>

                  <h3 className='address fw-bold text-start text-uppercase'>
                    {orderDetail?.store?.address}
                  </h3>

                  <h3 className='phone-number fw-bold text-start text-uppercase'>
                    Telp Toko :{' '}
                    {`${
                      orderDetail?.store?.phone_number_1 ??
                      orderDetail?.store?.phone_number_2 ??
                      'Nomor telepon belum tersedia'
                    }`}
                  </h3>
                </div>
              </Skeleton>
            </div>

            <div className='body-printout d-flex justify-content-center align-items-center flex-column mt-4'>
              <Skeleton active loading={isLoadingPage}>
                <h2 className='fw-bold text-center'>Instalasi & Service</h2>

                <h4 className='fw-normal text-center'>
                  Tanggal : {formatDate(orderDetail?.created_at)}
                </h4>
              </Skeleton>
            </div>
          </Row>

          <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
            <hr className='line-1' />
            <hr className='line-1' />
          </Skeleton>

          <Skeleton active loading={isLoadingPage} paragraph={{rows: 5}}>
            <Row className='mt-2'>
              <h4>Informasi Order</h4>

              <h4 className='fw-normal'>
                Order ID : <span>{orderDetail?.id}</span>
              </h4>

              <h4 className='fw-normal'>
                Copy :{' '}
                <span> {orderDetail?.print_counter < 1 ? '-' : orderDetail?.print_counter}</span>
              </h4>

              <h4 className='fw-normal'>
                Tanggal Order : <span>{formatDate(orderDetail?.created_at)}</span>
              </h4>

              <h4 className='fw-normal'>
                {' '}
                {orderDetail?.payment_type === 'survey'
                  ? 'Request Tanggal Survey :'
                  : 'Request Tanggal Pengerjaan :'}
                <span> {formatDate(orderDetail?.request_survey)}</span>
              </h4>

              <h5 className='fw-normal'>
                *Tanggal Request <span className='fw-bolder text-decoration-underline'>bukan</span>{' '}
                tanggal pasti. Konfirmasi kunjungan dilakukan oleh Vendor
              </h5>
            </Row>
          </Skeleton>

          <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
            <hr className='line-2' />
          </Skeleton>

          <Skeleton active loading={isLoadingPage} paragraph={{rows: 2}}>
            <Row className='mt-2'>
              <h4>Informasi Member</h4>

              <h4 className='fw-normal'>
                Nama Member : <span>{orderDetail?.members?.full_name}</span>
              </h4>

              <h4 className='fw-normal'>
                WA/No. Telp : <span> {orderDetail?.project_number}</span>
              </h4>
            </Row>
          </Skeleton>

          <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
            <hr className='line-3' />
          </Skeleton>

          <Skeleton active loading={isLoadingPage} paragraph={{rows: 2}}>
            <Row className='mt-2'>
              {orderDetail?.payment_type !== 'survey' && <h4 className='mb-1'>Nama Pemasangan</h4>}

              {orderDetail?.order_details.map((item: any, index: any) => (
                <h4 className='fw-normal'>
                  {orderDetail?.payment_type === 'survey'
                    ? `${index + 1}. ${item?.item_notes}`
                    : `${index + 1}. ${item?.item?.service_name}`}
                </h4>
              ))}
            </Row>
          </Skeleton>

          <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
            <hr className='line-4' />

            <Row className='mt-2 d-flex justify-content-end align-items-end'>
              <h4>Total : {`Rp. ${Number(orderDetail?.grand_total).toLocaleString('id')}`}</h4>
            </Row>

            <Row className='receipt-id mb-5'>
              <h2>Receipt ID :</h2>
            </Row>

            <hr className='line-5' />

            <div className='button-wrapper d-flex justify-content-center align-items-center mt-5'>
              <Button
                className='hide-print-button'
                variant='dark-danger'
                onClick={handleCancelPrint}
              >
                Cancel
              </Button>

              <Button
                className='hide-print-button'
                variant='dark-primary'
                onClick={handlePrintOrder}
              >
                {orderDetail?.print_counter < 1 ? 'Print' : 'Reprint'}
              </Button>
            </div>
          </Skeleton>
        </Card.Body>
      </Card>
    </section>
  )
}

export {PrintoutOrder}
