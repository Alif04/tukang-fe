import React, {FC, useState, useEffect} from 'react'
import {Orders} from '../../../../interfaces/order'

import './PreviewEmail.css'

import axios from 'axios'
import {Skeleton} from 'antd'
import {useParams} from 'react-router-dom'
import {formatDate, formatDateWithTime, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Table, Row, Col, Card} from 'react-bootstrap'

const PreviewEmailOrder: FC<{updatePageTitle: (order: Orders) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
    
  const [orderDetail, setOrderDetail] = useState<any>()
  const [emailDetail, setEmailDetail] = useState<any>()
  const [headerImg, setHeaderImg] = useState<any>()
  const [footerImg, setFooterImg] = useState<any>()
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

  const fetchEmailData = async () => {
    try {
      await axios
        .get(`${apiUrl}/mails`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            // 'Access-Control-Allow-Origin': '*',
           // 'ngrok-skip-browser-warning':  'true',
          },
          params: {
            order_by: 'asc',
            type_email_message: 1,
          },
        })
        .then((response) => {
          const data = response.data.data.data[0]
          setEmailDetail(data)

          setHeaderImg(
            apiUrl +
              '/public/mails-image/' +
              data.email_message_image.filter((item: any) => item.type === 1)[0]?.path
          )

          setFooterImg(
            apiUrl +
              '/public/mails-image/' +
              data.email_message_image.filter((item: any) => item.type === 2)[0]?.path
          )
        })
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchOrderData()
    fetchEmailData()
  }, [])
  
  return (
    <section id='preview-email'>
      <Card>
        <Card.Header
          style={{
            backgroundImage: `url('${headerImg}')`,
          }}
        ></Card.Header>

        <Card.Body>
          <Row className='content-header'>
            <Col md={6} sm={12}>
              <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
                <div className='header-logo'>
                  <img
                    alt='Logo Mitra10'
                    className='h-30px logo mb-3 pe-1'
                    src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
                  />

                  <h1 className='ps-1 fs-3 fw-bold'>Instalasi & Service Mitra 10</h1>
                </div>
              </Skeleton>
            </Col>

            <Col md={6} sm={12}>
              <Skeleton active loading={isLoadingPage} paragraph={{rows: 2}}>
                <div className='header-information'>
                  <h1 className='fs-5 fw-bol  d mb-2'>
                    Tanggal Order :{' '}
                    <span className='fw-normal'>{formatDateWithTime(orderDetail?.created_at)}</span>
                  </h1>

                  <h1 className='fs-5 fw-bold mb-2'>
                    {(() => {
                      if (orderDetail?.payment_type === 'survey') {
                        return `Request Survey`
                      } else if (orderDetail?.payment_type === 'gratis') {
                        return `Request Pemasangan`
                      } else if (orderDetail?.payment_type === 'pemasangan_tanpa_survey') {
                        return `Request Pemasangan`
                      } else {
                        return ``
                      }
                    })()}{' '}
                    : <span className='fw-normal '>{formatDate(orderDetail?.request_survey)}</span>
                  </h1>

                  <h1 className='fs-5 fw-bold mb-2 '>
                    Order ID : <span className='fw-normal'>{orderDetail?.id}</span>
                  </h1>
                </div>
              </Skeleton>
            </Col>
          </Row>

          <Skeleton active loading={isLoadingPage}>
            <h3 className='fs-4 fw-normal mb-1'>
              {emailDetail?.welcome_header} {orderDetail?.members?.full_name}
            </h3>

            <h3 className='fs-4 fw-bold mb-5'>{emailDetail?.greetings}</h3>

            <h3 className='fs-3 fw-bold mb-1'>Detail Pemesanan</h3>

            <Table hover responsive>
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Nama Jasa Pemasangan</th>
                  <th>QTY Pemasangan</th>
                  {!(
                    orderDetail?.payment_type === 'gratis' || orderDetail?.payment_type === 'survey'
                  ) && (
                    <>
                      <th>Harga Jasa</th>
                      <th>Jumlah</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {orderDetail?.order_details?.map((item: any, index: any) => (
                  <tr key={`${index} - order_detail`}>
                    <td>{item?.item_code ?? '-'}</td>
                    <td>{item?.item_name ?? '-'}</td>
                    <td>
                      {orderDetail?.payment_type === 'survey'
                        ? item?.item_notes
                        : item?.item?.service_name}
                    </td>
                    <td>{item?.quantity ?? 0}</td>
                    {!(
                      orderDetail?.payment_type === 'gratis' ||
                      orderDetail?.payment_type === 'survey'
                    ) && (
                      <>
                        <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString('id')}`}</td>
                        <td>{`Rp. ${parseInt(item?.total || 0).toLocaleString('id')}`}</td>
                      </>
                    )}
                  </tr>
                ))}

                {orderDetail?.payment_type !== 'gratis' &&
                  orderDetail?.payment_type !== 'pemasangan_tanpa_survey' && (
                    <tr>
                      <td
                        colSpan={
                          orderDetail?.payment_type === 'survey'
                            ? 3
                            : orderDetail?.payment_type === 'pemasangan_tanpa_survey'
                            ? 5
                            : 0
                        }
                        className='text-end fw-bolder'
                      >
                        Biaya Survey
                      </td>

                      <td className=' fw-bolder'>
                        {orderDetail?.payment_type === 'gratis' ||
                        orderDetail?.payment_type === 'pemasangan_tanpa_survey'
                          ? `Rp. ${(0).toLocaleString('id')}`
                          : orderDetail?.payment_type === 'survey'
                          ? `Rp. ${(99000).toLocaleString('id')}`
                          : `Rp. ${0}`}
                      </td>
                    </tr>
                  )}

                {orderDetail?.is_overdistance === 1 && (
                  <tr>
                    <td
                      className='text-end fw-bolder'
                      colSpan={
                        orderDetail?.payment_type === 'gratis' ||
                        orderDetail?.payment_type === 'survey'
                          ? 3
                          : orderDetail?.payment_type === 'pemasangan_tanpa_survey'
                          ? 5
                          : 0
                      }
                    >
                      Biaya Tambahan
                    </td>
                    <td className=' fw-bolder'>{`Rp. ${parseInt(
                      orderDetail?.additional_fee ?? 0
                    ).toLocaleString('id')}`}</td>
                  </tr>
                )}

                {(orderDetail?.payment_type !== 'survey' || orderDetail?.is_overdistance === 1) && (
                  <tr>
                    <td
                      colSpan={
                        orderDetail?.payment_type === 'gratis' ||
                        orderDetail?.payment_type === 'survey'
                          ? 3
                          : orderDetail?.payment_type === 'pemasangan_tanpa_survey'
                          ? 5
                          : 0
                      }
                      className='text-end fw-bolder'
                    >
                      Grand Total
                    </td>

                    <td className=' fw-bolder'>{`Rp. ${Number(
                      orderDetail?.grand_total
                    ).toLocaleString('id')}`}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Skeleton>

          <Skeleton active loading={isLoadingPage}>
            <h3 className='fs-3 fw-bold mb-1'>Detail Pemasangan</h3>

            <Row className='mb-5'>
              <Col>
                <h3 className='fs-5 fw-semibold mb-1'>{orderDetail?.members?.full_name}</h3>
                <h3 className='fs-5 fw-normal mb-1'>{orderDetail?.project_address}</h3>
                <h3 className='fs-5 fw-normal mb-1'>Telp : {orderDetail?.project_number}</h3>
              </Col>

              <Col></Col>
            </Row>

            <div className='announcement mb-3'>
              <h3 className='fs-5 fw-normal'>
                Transaksi Anda telah berhasil dengan nomor Order ID {orderDetail?.id}
              </h3>

              <h3 className='fs-5 fw-normal'>
                Silahkan unduh file yang terlampir pada email ini untuk mencetak Tanda Terima
                transaksi Anda.
              </h3>

              <h3 className='fs-5 fw-normal'>
                Untuk menghubungi Admin Instalasi kami melalui Whatsapp melalui nomor 087884821089
              </h3>
            </div>
          </Skeleton>

          <Skeleton active loading={isLoadingPage} paragraph={{rows: 10}}>
            <Row>
              <Col>
                <h3 className='fs-3 fw-bold mb-1'>Syarat & Ketentuan</h3>

                {emailDetail?.terms_detail?.map((item: any, index: number) => (
                  <ol key={index} className='fw-normal' start={index + 1}>
                    <li className='fw-normal'>{item.terms}</li>
                  </ol>
                ))}
              </Col>
            </Row>

            <Row>
              <Col>
                <h3 className='fs-3 fw-bold mb-1'>Informasi</h3>

                {emailDetail?.information_detail?.map((item: any, index: number) => (
                  <ol key={index} className='fw-normal' start={index + 1}>
                    <li className='fw-normal'>{item.information}</li>
                  </ol>
                ))}
              </Col>
            </Row>

            <div className='payment-bank mb-2'>
              <h3 className='fs-5 fw-semibold'>
                Silahkan melakukan pembayaran di account di bawah ini :
              </h3>
              <h3 className='fs-5 fw-normal'>{orderDetail?.store?.bank_account}</h3>
              <h3 className='fs-5 fw-normal'>{orderDetail?.store?.bank_name}</h3>
              <h3 className='fs-5 fw-normal'>{orderDetail?.store?.bank_number}</h3>
            </div>

            <div className='store-information mb-5'>
              <h3 className='fs-5 fw-semibold'>Silahkan kirim bukti bayar anda melalui :</h3>
              <h3 className='fs-5 fw-normal'>
                {`Telp : ${
                  orderDetail?.store?.phone_number_1 ??
                  orderDetail?.store?.phone_number_2 ??
                  'Nomor telepon belum tersedia'
                }`}
              </h3>
              <h3 className='fs-5 fw-normal'>
                {`Email : ${
                  orderDetail?.store?.email ?? orderDetail?.store?.email ?? 'Email belum tersedia'
                }`}
              </h3>
            </div>

            <div className='footer-card'>
              <h1 className='fs-3 fw-semibold'>Hormat Kami, Mitra10</h1>
              <h3 className='fs-5 fw-normal'>{emailDetail?.footer}</h3>
            </div>
          </Skeleton>
        </Card.Body>

        <Card.Footer
          className='bg-cover bg-no-repeat bg-position-cover'
          style={{
            backgroundImage: `url('${footerImg}')`,
          }}
        ></Card.Footer>
      </Card>
    </section>
  )
}

export {PreviewEmailOrder}
