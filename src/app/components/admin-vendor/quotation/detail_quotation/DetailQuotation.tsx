import React, {FC, useState, useEffect} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './DetailQuotation.css'

import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Form, Table, Row, Col} from 'react-bootstrap'

const DetailQuotationVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [quotationDetail, setQuotationDetail] = useState<any>()

  const fetchQuotationData = async () => {
    try {
      await axios
        .get(`${apiUrl}/quotation/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data
          setQuotationDetail(data)
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchQuotationData()
  }, [])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <section id='detail-quotation'>
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
                  <h2 className='fw-semibold mb-2'>{quotationDetail?.store.store_name}</h2>
                  <h3 className='fw-normal'>{quotationDetail?.store.address}</h3>
                </div>
              </div>
            </div>

            <div className='payment-request'>
              <h1 className='fw-bolder'>QUOTATION</h1>

              <h3 className='fw-bolder'>
                Tanggal :
                <span className='ms-1 fw-normal'>
                  {quotationDetail ? formatDate(new Date(quotationDetail.quotation_date)) : ''}
                </span>
              </h3>

              <h3 className='fw-bolder'>
                Quotation ID : <span className='fw-normal'>{quotationDetail?.id}</span>
              </h3>

              <h3 className='fw-bolder'>
                Costumer ID : <span className='fw-normal'>{quotationDetail?.order.member_id}</span>
              </h3>
            </div>
          </div>

          <div className='invoice-detail d-flex justify-content-between'>
            <div className='receiver-information'>
              <div className='receiver-detail'>
                <h1 className='fw-bolder'>Ditunjukkan kepada :</h1>
                <h1 className='fw-bolder mt-3'>Ibu Ami</h1>
              </div>

              <div className='address'>
                <h3 className='fw-normal'>{quotationDetail?.order.project_address}</h3>
                <h3 className='fw-normal'> Telp : {quotationDetail?.order.project_number}</h3>
              </div>
            </div>

            <div className='payment-request'>
              <Form.Group as={Row}>
                <Form.Label className='fs-5 fw-bolder' column sm='7'>
                  Quotation valid until :
                </Form.Label>

                <Col sm='5'>
                  <Form.Control
                    type='text'
                    plaintext
                    readOnly
                    value={
                      quotationDetail
                        ? formatDate(new Date(quotationDetail.quotation_validity))
                        : ''
                    }
                  />
                </Col>
              </Form.Group>

              <Form.Group className='detail-info'>
                <Form.Label className='fs-5 fw-bolder'>Instruksi Spesial :</Form.Label>
                <Form.Control
                  as='textarea'
                  plaintext
                  readOnly
                  value={quotationDetail?.description}
                />
              </Form.Group>
            </div>
          </div>

          <div className='detail-table'>
            <Table hover>
              <thead>
                <tr>
                  <th className='text-center'>Item</th>
                  <th className='text-center'>Harga Satuan</th>
                  <th className='text-center'>Jumlah</th>
                  <th className='text-center'>Total Harga</th>
                </tr>
              </thead>
              <tbody>
                {quotationDetail?.order.m_order_details.map((item: any) => (
                  <>
                    <tr>
                      <td>{item?.unit}</td>
                      <td>{item?.quantity}</td>
                      <td>{`Rp. ${parseInt(item?.unit_price || 0).toLocaleString('id')}`}</td>
                      <td>{`Rp. ${item?.total.toLocaleString('id')}`}</td>
                    </tr>
                  </>
                ))}

                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Total
                  </td>
                  <td className=' fw-bolder'>Rp. 100.000</td>
                </tr>

                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Tax ( 11 % )
                  </td>
                  <td className=' fw-bolder'>Rp. 100.000</td>
                </tr>

                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Grand Total
                  </td>
                  <td className=' fw-bolder'>
                    {`Rp. ${parseInt(quotationDetail?.order?.grand_total).toLocaleString('id')}`}
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

export {DetailQuotationVendor}
