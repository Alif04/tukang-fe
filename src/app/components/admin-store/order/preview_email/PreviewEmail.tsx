import React, {FC, useState, useEffect} from 'react'

import './PreviewEmail.css'

import {Orders} from '../../../../interfaces/order'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Table, Form, Button, Row, Col} from 'react-bootstrap'

const PreviewEmailOrder: FC<{updatePageTitle: (order: Orders) => void}> = ({updatePageTitle}) => {
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

  return (
    <section id='preview-email'>
      <div className='card'>
        <div className='card-body'>
          <Row className='preview-detail d-flex justify-content-between'>
            <Col md='6' sm='12' className='vendor-information order-2 order-md-1'>
              <div className='vendor-detail'>
                <img
                  alt='Logo'
                  className='h-50px logo mb-3'
                  src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
                />

                <div className='address'>
                  <h2 className='fs-1 text-uppercase fw-semibold mb-2'>
                    {orderDetail?.store?.store_name ?? ''}
                  </h2>
                  <h3 className='fw-normal'>{orderDetail?.store?.address ?? ''}</h3>
                  <h3 className='fw-normal'>
                    {`Telp : ${
                      orderDetail?.store?.phone_number_1 ??
                      orderDetail?.store?.phone_number_2 ??
                      'Nomor telepon belum tersedia'
                    }`}
                  </h3>
                </div>
              </div>
            </Col>

            <Col md='6' sm='12' className='payment-request order-1 order-md-2'>
              <h1 className='fw-bolder'>EMAIL ORDER</h1>

              <h3 className='fw-bolder'>
                Tanggal Order :{' '}
                <span className='fw-normal'>
                  {orderDetail ? formatDate(new Date(orderDetail.request_survey)) : '-'}
                </span>
              </h3>
            </Col>
          </Row>

          <Row className='preview-detail d-flex justify-content-between'>
            <Col md='6' sm='12' className='receiver-information'>
              <div className='receiver-detail'>
                <h1 className='fw-bolder'>Ditunjukkan kepada :</h1>
                <h1 className='fw-bolder'>{orderDetail?.members?.full_name}</h1>
              </div>

              <div className='address'>
                <h3 className='fw-normal'>{orderDetail?.project_address}</h3>
                <h3 className='fw-normal'> Telp : {orderDetail?.project_number}</h3>
              </div>
            </Col>

            <Col md='6' sm='12' className='payment-request'>
              <h3 className='fw-bolder'>
                Customer ID :{' '}
                <span className='fw-normal'>{orderDetail?.members?.member_number}</span>
              </h3>

              <h3 className='fw-bolder'>
                Tipe Pembayaran :{' '}
                <span className='fw-normal text-capitalize'>
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
                </span>
              </h3>
            </Col>
          </Row>

          <div className='detail-table'>
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
                {orderDetail?.payment_type === 'survey' ? (
                  <>
                    <tr>
                      <td colSpan={6}>Survey</td>
                    </tr>
                  </>
                ) : (
                  orderDetail?.order_details.map((item: any, index: any) => (
                    <>
                      <tr key={`${index} - order_detail`}>
                        <td>{item?.item_code}</td>
                        <td>{item?.item_name}</td>
                        <td>{item?.item?.service_name}</td>
                        <td>{item?.quantity}</td>
                        {!(
                          orderDetail?.payment_type === 'gratis' ||
                          orderDetail?.payment_type === 'survey'
                        ) && (
                          <>
                            <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString(
                              'id'
                            )}`}</td>
                            <td>{`Rp. ${parseInt(item?.total || 0).toLocaleString('id')}`}</td>
                          </>
                        )}
                      </tr>
                    </>
                  ))
                )}

                {orderDetail?.payment_type !== 'gratis' &&
                  orderDetail?.payment_type !== 'pemasangan_tanpa_survey' && (
                    <tr>
                      <td colSpan={3} className='text-end fw-bolder'>
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

                {orderDetail?.payment_type !== 'survey' && (
                  <tr>
                    <td
                      colSpan={orderDetail?.payment_type !== 'gratis' ? 5 : 3}
                      className='text-end fw-bolder'
                    >
                      Grand Total
                    </td>

                    <td className=' fw-bolder'>
                      {(() => {
                        if (orderDetail?.payment_type === 'gratis') {
                          return `Rp. ${(0).toLocaleString('id')}`
                        } else if (orderDetail?.payment_type === 'pemasangan_tanpa_survey') {
                          return `Rp. ${parseInt(orderDetail?.grand_total).toLocaleString('id')}`
                        } else if (orderDetail?.payment_type === 'survey') {
                          return `Rp. ${(99000).toLocaleString('id')}`
                        } else {
                          return `Rp. ${(0).toLocaleString('id')}`
                        }
                      })()}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className='payment-detail'>
            <Row className='payment-method'>
              <Col>
                <h1 className='fw-bolder'>
                  Silahkan melakukan pembayaran di account di bawah ini :
                </h1>

                <h3 className='fw-normal'>{orderDetail?.store?.bank_account}</h3>
                <h3 className='fw-normal'>{orderDetail?.store?.bank_name}</h3>
                <h3 className='fw-normal'>{orderDetail?.store?.bank_number}</h3>
              </Col>
            </Row>

            <Row className='payment-method'>
              <Col>
                <h1 className='fw-bolder'>Syarat & Ketentuan :</h1>

                <ol>
                  <li className='fw-normal'>
                    Jadwal survey/pengerjaan akan ditentukan oleh teknisi, setelah material tersedia
                    dan barang diterima customer, serta barang yang akan dikerjakan jasa instalasi
                    adalah barang dari Mitra10.
                  </li>

                  <li className='fw-normal'>
                    Penjadwalan ulang pada H-1 tidak dikenakan biaya, penjadwalan ulang pada hari H
                    akan dikenakan biaya tambahan minimal sebesar Rp 75.000.
                  </li>

                  <li className='fw-normal'>
                    Pekerjaan tambahan (Pekerjaan diluar yang sudah diajukan & di transaksikan) akan
                    dikenakan biaya tambahan.
                  </li>

                  <li className='fw-normal'>
                    Semua jasa pemasangan wajib dilakukan survey. Biaya survey akan dikembalikan
                    apabila biaya jasa instalasi/service minimal Rp 500.000.
                  </li>

                  <li className='fw-normal'>
                    Quotation diberikan kepada customer maksimal H+2 hari kerja setelah survey
                    selesai.
                  </li>

                  <li className='fw-normal'>
                    Garansi 7 (Tujuh) hari untuk instalasi/service terhitung sejak tanggal serah
                    terima pekerjaan dan hanya 1x kunjungan. Kerusakan produk yang terpasang, tidak
                    menjadi bagian garansi dan proses instalasi/service.
                  </li>

                  <li className='fw-normal'>
                    Biaya transportasi, jarak dari toko Mitra10 lokasi pengerjaan kurang dari 10KM
                    adalah FREE : Lebih dari 10KM dikenakan biaya transportasi Rp 25.000 Max 40KM
                  </li>
                </ol>
              </Col>
            </Row>

            <Row className='payment-method'>
              <Col>
                <h1 className='fw-bolder'>Informasi :</h1>

                <ol>
                  <li className='fw-normal'>
                    Kontak layanan pelanggan Instalasi/Service (WA Only) : 0878-8482-1089.
                  </li>

                  <li className='fw-normal'>
                    Operasional hari senin s/d jumat - Office hour 09:00 s/d 16:00.
                  </li>

                  <li className='fw-normal'>
                    Orderan instalasi/service yang masuk diluar jam operasional akan diproses pada
                    jam operasional.
                  </li>
                </ol>
              </Col>
            </Row>

            <Row className='payment-evidence'>
              <Col>
                <h1 className='fw-bolder'>Silahkan kirim bukti bayar anda melalui:</h1>
                <h1 className='fw-bolder'>
                  {`Telp : ${
                    orderDetail?.store?.phone_number_1 ??
                    orderDetail?.store?.phone_number_2 ??
                    'Nomor telepon belum tersedia'
                  }`}
                </h1>
                <h1 className='fw-bolder'>
                  {`Email : ${
                    orderDetail?.store?.email ?? orderDetail?.store?.email ?? 'Email belum tersedia'
                  }`}
                </h1>

                <h1 className='fw-bolder'>
                  Terima kasih telah melakukan bisnis dengan Mitra10. Kami harap kedatangan anda
                  kembali.
                </h1>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </section>
  )
}

export {PreviewEmailOrder}
