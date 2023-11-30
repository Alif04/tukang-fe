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
          <div className='invoice-detail d-flex justify-content-between'>
            <div className='vendor-information'>
              <div className='vendor-detail'>
                <img
                  alt='Logo'
                  className='h-50px logo mb-3'
                  src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
                />

                <div className='address'>
                  <h3 className='fs-1 fw-bolder text-uppercase'>{orderDetail?.store.store_name}</h3>
                  <h3 className='fw-normal'>{orderDetail?.store.address}</h3>
                </div>
              </div>
            </div>

            <div className='payment-request'>
              <h1 className='fw-bolder'>EMAIL ORDER</h1>

              <h3 className='fw-bolder'>
                Tanggal Order :{' '}
                <span className='fw-normal'>
                  {orderDetail ? formatDate(new Date(orderDetail.created_at)) : ''}
                </span>
              </h3>
            </div>
          </div>

          <div className='invoice-detail d-flex justify-content-between'>
            <div className='receiver-information'>
              <div className='receiver-detail'>
                <h1 className='fw-bolder'>Ditunjukkan kepada :</h1>
                <h1 className='fw-bolder'>{orderDetail?.members.full_name}</h1>
              </div>

              <div className='address'>
                <h3 className='fw-normal'>{orderDetail?.project_address}</h3>
                <h3 className='fw-normal'> Telp : {orderDetail?.members.phone_number}</h3>
              </div>
            </div>

            <div className='payment-request'>
              <h3 className='fw-bolder'>
                Customer ID :{' '}
                <span className='fw-normal'>{orderDetail?.members.member_number}</span>
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
            </div>
          </div>

          <div className='detail-table'>
            <Table hover>
              <thead>
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
                {orderDetail?.payment_type === 'survey' ? (
                  <>
                    <tr>
                      <td colSpan={6}>Survey</td>
                    </tr>
                  </>
                ) : (
                  orderDetail?.order_details.map((item: any, index: any) => (
                    <>
                      <tr>
                        <td>{item?.item_id}</td>
                        <td>{item?.item_name}</td>
                        <td>{item?.item?.service_name}</td>
                        <td>{item?.quantity}</td>
                        <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString('id')}`}</td>
                        <td>{`Rp. ${item?.total.toLocaleString('id')}`}</td>
                      </tr>
                    </>
                  ))
                )}

                <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Biaya Survey
                  </td>
                  <td className=' fw-bolder'>
                    {orderDetail?.payment_type === 'gratis' ||
                    orderDetail?.payment_type === 'pemasangan_tanpa_survey'
                      ? `                      Rp. ${0?.toLocaleString(
                          'id'
                        )}                        `
                      : orderDetail?.payment_type === 'survey'
                      ? `                      Rp. ${99000?.toLocaleString(
                          'id'
                        )}                        `
                      : `Rp. ${0}`}
                  </td>
                </tr>

                <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Grand Total
                  </td>
                  <td className=' fw-bolder'>
                    Rp. {parseInt(orderDetail?.grand_total || 0)?.toLocaleString('id')}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className='payment-detail'>
            <div className='payment-method'>
              <h1 className='fw-bolder'>Silahkan melakukan pembayaran di account di bawah ini :</h1>

              <h3 className='fw-normal'>BANK BCA</h3>
              <h3 className='fw-normal'>PT.MITRA10</h3>
              <h3 className='fw-normal'>123-876-90</h3>
            </div>

            <div className='payment-method'>
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
            </div>

            <div className='payment-method'>
              <h1 className='fw-bolder'>Informasi :</h1>

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
            </div>

            <div className='payment-evidence'>
              <h1 className='fw-bolder'>Silahkan kirim bukti bayar anda melalui:</h1>
              <h1 className='fw-bolder'>WA : 0813748392</h1>
              <h1 className='fw-bolder'>Email : Installation.support@mitra10.com</h1>
            </div>

            <h1 className='fw-bolder'>
              Terima kasih telah melakukan bisnis dengan Mitra10. Kami harap kedatangan anda
              kembali.
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}

export {PreviewEmailOrder}
