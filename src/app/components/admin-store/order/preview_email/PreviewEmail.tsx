import React, {FC, useState, useEffect} from 'react'

import './PreviewEmail.css'

import {Orders} from '../../../../interfaces/order'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Table, Row, Col, Card} from 'react-bootstrap'

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

  // Grand Total Order
  const calculateTotal = (orderDetail: any) => {
    const {payment_type, is_overdistance, grand_total, additional_fee} = orderDetail ?? {}

    let totalAmount = 0

    if (payment_type === 'gratis') {
      totalAmount = is_overdistance === 1 ? Number(grand_total) + Number(additional_fee) : 0
    } else if (payment_type === 'pemasangan_tanpa_survey') {
      totalAmount =
        is_overdistance === 1 ? Number(grand_total) + Number(additional_fee) : grand_total ?? 0
    } else if (payment_type === 'survey') {
      totalAmount = is_overdistance === 1 ? Number(99000) + Number(additional_fee) : 99000 ?? 0
    }

    return `Rp. ${Number(totalAmount).toLocaleString('id')}`
  }

  return (
    <section id='preview-email'>
      <Card>
        <Card.Header>
          <Row className='content-header'>
            <Col md={6} sm={12}>
              <div className='header-logo'>
                <img
                  alt='Logo Mitra10'
                  className='h-30px logo mb-3 pe-1'
                  src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
                />

                <h1 className='ps-1 fs-3 fw-bold text-white'>Instalasi & Service Mitra 10</h1>
              </div>
            </Col>

            <Col md={6} sm={12}>
              <div className='header-information'>
                <h1 className='fs-5 fw-bold mb-2 text-white'>
                  Tanggal Order :{' '}
                  <span className='fw-normal text-white'>
                    {new Date(orderDetail?.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </h1>

                <h1 className='fs-5 fw-bold mb-2 text-white'>
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
                  :{' '}
                  <span className='fw-normal text-white'>
                    {new Date(orderDetail?.request_survey).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </h1>

                <h1 className='fs-5 fw-bold mb-2 text-white'>
                  Order ID : <span className='fw-normal text-white'>{orderDetail?.id}</span>
                </h1>
              </div>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <h3 className='fs-4 fw-normal mb-1'>Hi, {orderDetail?.members?.full_name}</h3>

          <h3 className='fs-4 fw-bold mb-5'>
            Terima kasih telah melakukan order Layanan Jasa Instalasi & Service Mitra10
          </h3>

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
                <>
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
                </>
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

                  <td className=' fw-bolder'>{calculateTotal(orderDetail)}</td>
                </tr>
              )}
            </tbody>
          </Table>

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

          <Row>
            <Col>
              <h3 className='fs-3 fw-bold mb-1'>Syarat & Ketentuan</h3>

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

          <Row>
            <Col>
              <h3 className='fs-3 fw-bold mb-1'>Informasi</h3>

              <ol>
                <li className='fw-normal'>
                  Kontak layanan pelanggan Instalasi/Service (WA Only) : 0878-8482-1089.
                </li>

                <li className='fw-normal'>
                  Operasional hari senin s/d jumat - Office hour 09:00 s/d 16:00.
                </li>

                <li className='fw-normal'>
                  Orderan instalasi/service yang masuk diluar jam operasional akan diproses pada jam
                  operasional.
                </li>
              </ol>
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
            <h3 className='fs-5 fw-normal'>
              Ini adalah email yang dikirimkan oleh sistem. Mohon untuk tidak membalas email ini.
              Kunjungi Help Centre kami untuk informasi lebih lanjut : customer.relation@mitra10.com
            </h3>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {PreviewEmailOrder}
