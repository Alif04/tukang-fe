import React, {FC, useState, useEffect} from 'react'

import './DetailInvoice.css'

import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Form, Table, Row, Col} from 'react-bootstrap'

const DetailInvoiceVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [invoiceDetail, setInvoiceDetail] = useState<any>()
  const [grandTotal, setGrandTotal] = useState<any>()

  console.log(invoiceDetail)

  const fetchInvoiceData = async () => {
    try {
      await axios
        .get(`${apiUrl}/invoices/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data.invoice
          const grandTotals = response?.data?.data?.totalQuotation ?? 0

          setInvoiceDetail(data)
          setGrandTotal(grandTotals)
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchInvoiceData()
  }, [])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <section id='detail-invoice'>
      <div className='card'>
        <div className='card-body'>
          <div className='invoice-detail d-flex justify-content-between'>
            <div className='vendor-information'>
              <div className='vendor-detail'>
                <h1 className='fw-bolder'>{invoiceDetail?.vendor?.company_name}</h1>

                <div className='address'>
                  <h3 className='fw-normal'>{invoiceDetail?.vendor?.address}</h3>
                </div>
              </div>
            </div>

            <div className='payment-request'>
              <h1 className='fw-bolder'>INVOICE</h1>

              <h3 className='fw-bolder'>
                Tanggal :{' '}
                <span className='fw-normal'>
                  {invoiceDetail ? formatDate(new Date(invoiceDetail?.created_at)) : ''}
                </span>
              </h3>

              <h3 className='fw-bolder'>
                Invoice ID :{' '}
                <span className='fw-normal'>{invoiceDetail?.invoice_details[0]?.invoice_id}</span>
              </h3>
            </div>
          </div>

          <div className='invoice-detail d-flex justify-content-between'>
            <div className='receiver-information'>
              <div className='receiver-detail'>
                <h1 className='fw-bolder'>Ditunjukkan kepada :</h1>
                <h1 className='fw-bolder mt-3'>
                  {invoiceDetail?.invoice_details[0]?.quotation?.order?.store?.store_name ?? ''}
                </h1>
              </div>

              <div className='address'>
                <h3 className='fw-normal'>
                  {invoiceDetail?.invoice_details[0]?.quotation?.order?.store?.address ?? ''}
                </h3>

                <h3 className='fw-normal'>
                  {`Telp : ${
                    invoiceDetail?.invoice_details[0]?.quotation?.order?.store?.phone_number_1 ??
                    invoiceDetail?.invoice_details[0]?.quotation?.order?.store?.phone_number_2 ??
                    'Nomor telepon belum tersedia'
                  }`}
                </h3>
              </div>
            </div>
          </div>

          <div className='detail-table'>
            <Table hover>
              <thead>
                <tr>
                  <th className='text-center'>Order ID</th>
                  <th className='text-center'>Tanggal Order</th>
                  <th className='text-center'>Nama Jasa Pemasangan</th>
                  <th className='text-center'>Jumlah</th>
                  <th className='text-center'>Price</th>
                  <th className='text-center'>Total Harga</th>
                </tr>
              </thead>

              <tbody>
                {invoiceDetail?.invoice_details.map((item: any) => (
                  <>
                    <tr>
                      <td>{item?.quotation?.order_id ?? '-'}</td>
                      <td>{formatDate(new Date(item?.quotation?.order?.request_survey)) ?? '-'}</td>

                      <td>{item?.quotation?.quotation_details[0]?.name ?? '-'}</td>
                      <td>{item?.quotation?.quotation_details[0]?.quantity ?? '-'}</td>

                      <td>{`Rp. ${parseInt(
                        item?.quotation?.quotation_details[0]?.price ?? 0
                      ).toLocaleString('id')}`}</td>

                      <td>{`Rp. ${parseInt(
                        item?.quotation?.quotation_details[0]?.final_price ?? 0
                      ).toLocaleString('id')}`}</td>
                    </tr>
                  </>
                ))}

                {/* <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Total
                  </td>
                  <td className=' fw-bolder'>Rp. 100.000</td>
                </tr> */}

                {/* <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Tax ( 11 % )
                  </td>
                  <td className=' fw-bolder'>
                    {`Rp. ${parseInt(
                      invoiceDetail?.invoice_details[0]?.quotation?.quotation_disc
                    ).toLocaleString('id')}`}
                  </td>
                </tr> */}

                <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Grand Total
                  </td>

                  <td className=' fw-bolder'>
                    {`Rp. ${parseInt(grandTotal).toLocaleString('id')}`}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className='payment-detail'>
            <div className='payment-method'>
              <h1 className='fw-bolder'>Silahkan melakukan pembayaran di account di bawah ini :</h1>

              <h3 className='fw-bold'>{invoiceDetail?.vendor?.vendor_bank[0]?.bank?.bank_name}</h3>
              <h3 className='fw-bold'>{invoiceDetail?.vendor?.company_name}</h3>
              <h3 className='fw-bold'>{invoiceDetail?.vendor?.vendor_bank[0]?.account_number}</h3>
            </div>

            <div className='payment-evidence'>
              <h1 className='fw-normal'>Silahkan kirim bukti bayar anda melalui:</h1>
              <h1 className='fw-normal'>WA : {invoiceDetail?.vendor?.phone_number}</h1>
              <h1 className='fw-normal'>Email : {invoiceDetail?.vendor?.email_address}</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export {DetailInvoiceVendor}
