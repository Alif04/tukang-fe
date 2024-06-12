import React, {FC, useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './DetailQuotation.css'

import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Form, Table, Row, Col} from 'react-bootstrap'

const DetailQuotationHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  // Fetch Data Quotation
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
                  <h2 className='fw-semibold mb-2'>{quotationDetail?.store?.store_name ?? ''}</h2>
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
                Customer ID :{' '}
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
                  <th className='text-center' style={{minWidth: '233px'}}>
                    Jenis Jasa
                  </th>
                  <th className='text-center'>QTY</th>
                  <th className='text-center'>Satuan</th>
                  {/* <th className='text-center'>Price</th>
                  <th className='text-center'>Margin</th> */}
                  <th className='text-center'>Final Price</th>
                  {/* <th className='text-center'>Keterangan</th> */}
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
                        <td>{item?.unit ?? '-'}</td>
                        {/* <td>{`Rp. ${parseInt(item?.price || 0).toLocaleString('id')}`}</td>
                        <td>{`Rp. ${parseInt(item?.margin || 0).toLocaleString('id')}`}</td> */}
                        <td>{`Rp. ${parseInt(item?.final_price || 0).toLocaleString('id')}`}</td>
                        {/* <td>{item?.description ? '' : '-'}</td> */}
                      </tr>
                    </>
                  ))}
              </tbody>
            </Table>

            <Table hover className='table-material'>
              <thead>
                <tr>
                  <th className='text-center' style={{minWidth: '200px'}}>
                    Material yang dibutuhkan
                  </th>
                  <th className='text-center'>QTY</th>
                  <th className='text-center'>Satuan</th>
                  {/* <th className='text-center'>Price</th> */}
                  <th className='text-center'>Final Price</th>
                  {/* <th className='text-center'>Keterangan</th> */}
                </tr>
              </thead>
              <tbody>
                {quotationDetail?.quotation_details
                  .filter((x: any) => x.item_type === 1)
                  .map((item: any) => (
                    <>
                      <tr>
                        <td>
                          {item?.name ?? '-'}{' '}
                          {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                        </td>
                        <td>{item?.quantity}</td>
                        <td>{item?.unit ?? '-'}</td>
                        {/* <td>{`Rp. ${parseInt(item?.price || 0).toLocaleString('id')}`}</td> */}
                        <td>{`Rp. ${parseInt(item?.final_price || 0).toLocaleString('id')}`}</td>
                        {/* <td>{item?.description ? '' : '-'}</td> */}
                      </tr>
                    </>
                  ))}

                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Total Jasa
                  </td>
                  <td className='fw-bolder'>{`Rp. ${parseInt(
                    quotationDetail?.quotation_details
                      .filter((x: any) => x.item_type === 2)
                      .reduce((total: any, item: any) => total + parseInt(item.final_price || 0), 0)
                  ).toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Total Material
                  </td>
                  <td className='fw-bolder'>{`Rp. ${parseInt(
                    quotationDetail?.quotation_details
                      .filter((x: any) => x.item_type === 1)
                      .reduce((total: any, item: any) => total + parseInt(item.final_price || 0), 0)
                  ).toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Promosi ( Free Survey )
                  </td>
                  <td className=' fw-bolder'>{`Rp. ${parseInt(
                    quotationDetail?.quotation_disc
                  ).toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    {`${
                      quotationDetail?.promotion
                        ? `Additional Promotion (${quotationDetail?.promotion?.name})`
                        : `Additional Promotion`
                    }`}
                  </td>
                  <td className=' fw-bolder'>
                    {quotationDetail?.promotion?.promotion_type === 1
                      ? `${quotationDetail?.promotion?.promotion} %`
                      : `Rp. ${parseInt(quotationDetail?.promotion?.promotion).toLocaleString(
                          'id'
                        )}`}
                  </td>
                </tr>

                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
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
              <h1 className='fw-bold'>Silahkan melakukan pembayaran di account di bawah ini :</h1>

              <h3 className='fw-normal'>{quotationDetail?.store?.bank_account}</h3>
              <h3 className='fw-normal'>{quotationDetail?.store?.bank_name}</h3>
              <h3 className='fw-normal'>{quotationDetail?.store?.bank_number}</h3>
            </div>

            <div className='payment-evidence'>
              <h1 className='fw-bold'>Silahkan kirim bukti bayar anda melalui:</h1>
              <h3 className='fw-normal'>
                {`Telp : ${
                  quotationDetail?.store?.phone_number_1 ??
                  quotationDetail?.store?.phone_number_2 ??
                  'Nomor telepon belum tersedia'
                }`}
              </h3>
              <h3 className='fw-normal'>
                {`Email : ${
                  quotationDetail?.store?.email ??
                  quotationDetail?.store?.email ??
                  'Email belum tersedia'
                }`}
              </h3>
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

export {DetailQuotationHO}
