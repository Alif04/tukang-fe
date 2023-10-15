import React, {FC, useState, useEffect} from 'react'

import './PreviewEmail.css'

import axios from 'axios'
import {useParams} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Table, Form, Button, Row, Col} from 'react-bootstrap'

const PreviewEmailOrder: FC = () => {
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
                <h3 className='fw-normal'>{orderDetail?.members.address_1}</h3>
                <h3 className='fw-normal'> Telp : {orderDetail?.members.phone_number}</h3>
              </div>
            </div>

            <div className='payment-request'>
              <h3 className='fw-bolder'>
                Costumer ID : <span className='fw-normal'>{orderDetail?.members.id}</span>
              </h3>

              <h3 className='fw-bolder'>
                Tipe Pembayaran :{' '}
                <span className='fw-normal text-capitalize'>{orderDetail?.payment_type}</span>
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
                {orderDetail?.order_details.map((item: any, index: any) => (
                  <>
                    <tr>
                      <td>{item?.item_id}</td>
                      <td>{item?.unit}</td>
                      <td>{item?.status?.description}</td>
                      <td>{item?.quantity}</td>
                      <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString('id')}`}</td>
                      <td>{`Rp. ${item?.total.toLocaleString('id')}`}</td>
                    </tr>
                  </>
                ))}

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

            <div className='payment-evidence'>
              <h1 className='fw-bolder'>Silahkan kirim bukti bayar anda melalui:</h1>
              <h1 className='fw-bolder'>WA: 0813748392</h1>
              <h1 className='fw-bolder'>Email: Installation.support@mitra10.com</h1>
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
