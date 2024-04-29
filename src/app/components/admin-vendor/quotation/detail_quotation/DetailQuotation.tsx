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
                <div className='address'>
                  <h2 className='fw-bolder mb-2'>{quotationDetail?.store?.store_name ?? ''}</h2>
                  <h3 className='fw-normal'>{quotationDetail?.store?.address ?? ''}</h3>
                  <h3 className='fw-normal'>
                    {`Telp : ${
                      quotationDetail?.store?.phone_number_1 ??
                      quotationDetail?.store?.phone_number_2 ??
                      'Nomor telepon belum tersedia'
                    }`}
                  </h3>
                </div>
              </div>
            </div>

            <div className='payment-request'>
              <h1 className='fw-bolder'>QUOTATION</h1>

              <h3 className='fw-bolder'>
                Tanggal :
                <span className='ms-1 fw-normal'>
                  {new Date(quotationDetail?.quotation_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </h3>

              <h3 className='fw-bolder'>
                Quotation ID : <span className='fw-normal'>{quotationDetail?.id}</span>
              </h3>

              <h3 className='fw-bolder'>
                Costumer ID :{' '}
                <span className='fw-normal'>{quotationDetail?.order?.members?.member_number}</span>
              </h3>
            </div>
          </div>

          <div className='invoice-detail d-flex justify-content-between'>
            <div className='receiver-information'>
              <div className='receiver-detail'>
                <h1 className='fw-bolder'>Ditunjukkan kepada :</h1>
                <h1 className='fw-bolder mt-3'>{quotationDetail?.order?.members?.full_name}</h1>
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
                  value={quotationDetail?.description ?? ''}
                />
              </Form.Group>
            </div>
          </div>

          <div className='detail-table'>
            <Table hover className='table-jasa'>
              <thead>
                <tr>
                  <th className='text-center'>Jenis Jasa</th>
                  <th className='text-center'>QTY</th>
                  <th className='text-center'>Satuan</th>
                  <th className='text-center'>Price</th>
                  <th className='text-center'>Total</th>
                  <th className='text-center'>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {quotationDetail?.quotation_details
                  .filter((x: any) => x.item_type === 2)
                  .map((item: any) => (
                    <>
                      <tr>
                        <td>{item?.name ?? '-'}</td>
                        <td>{item?.quantity}</td>
                        <td>{item?.unit}</td>
                        <td>{`Rp. ${parseInt(item?.price || 0).toLocaleString('id')}`}</td>
                        <td>{`Rp. ${parseInt(item?.final_price || 0).toLocaleString('id')}`}</td>
                        <td>{item?.description ? '' : '-'}</td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </Table>

            <Table hover className='table-material'>
              <thead>
                <tr>
                  <th className='text-center'>Material yang dibutuhkan</th>
                  <th className='text-center'>QTY</th>
                  <th className='text-center'>Satuan</th>
                  <th className='text-center'>Price</th>
                  <th className='text-center'>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {quotationDetail?.quotation_details
                  .filter((x: any) => x.item_type === 1)
                  .map((item: any) => (
                    <>
                      <tr>
                        <td>{item?.name ?? '-'}</td>
                        <td>{item?.quantity ?? 0}</td>
                        <td>{item?.unit ?? '-'}</td>
                        <td>{`Rp. ${parseInt(item?.price ?? 0).toLocaleString('id')}`}</td>
                        <td>{item?.description ? '' : '-'}</td>
                      </tr>
                    </>
                  ))}

                <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Promosi / Discount
                  </td>
                  <td className=' fw-bolder'>{`Rp. ${parseInt(
                    quotationDetail?.quotation_disc
                  ).toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Grand Total
                  </td>
                  <td className=' fw-bolder'>
                    {`Rp. ${parseInt(quotationDetail?.quotation_grand_total).toLocaleString('id')}`}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className='payment-detail'>
            <div className='payment-method'>
              <h1 className='fw-bolder'>Silahkan melakukan pembayaran di account di bawah ini :</h1>

              <h3 className='fw-normal'>{quotationDetail?.store?.bank_account}</h3>
              <h3 className='fw-normal'>{quotationDetail?.store?.bank_name}</h3>
              <h3 className='fw-normal'>{quotationDetail?.store?.bank_number}</h3>
            </div>

            <div className='payment-evidence'>
              <h1 className='fw-bolder'>Silahkan kirim bukti bayar anda melalui:</h1>
              <h1 className='fw-bolder'>
                {`Telp : ${
                  quotationDetail?.store?.phone_number_1 ??
                  quotationDetail?.store?.phone_number_2 ??
                  'Nomor telepon belum tersedia'
                }`}
              </h1>
              <h1 className='fw-bolder'>
                {`Email : ${
                  quotationDetail?.store?.email ??
                  quotationDetail?.store?.email ??
                  'Email belum tersedia'
                }`}
              </h1>
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
