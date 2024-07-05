import React, {FC, useState, useEffect, useRef} from 'react'
import {useParams} from 'react-router-dom'

import './DetailInvoice.css'

import axios from 'axios'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {Form, Table, Row, Col, Card, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'

interface Store {
  store_id: number
  store_name: string
  address: string
  phone_number_1: string
  phone_number_2: string
}

const DetailInvoiceVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const pdfRef = useRef<HTMLDivElement>(null)

  const [loadingPDF, setLoadingPDF] = useState(false)
  const [store, setStore] = useState<Store[]>([])
  const [invoiceDetail, setInvoiceDetail] = useState<any>()

  const getInvoiceData = async () => {
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
          const data = response.data.data
          setInvoiceDetail(data)
        })
    } catch (error) {
      console.error(error)
    }
  }

  const getStore = async () => {
    try {
      const response = await axios.get(`${apiUrl}/stores?take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempStore = response.data.data.map((item: any) => ({
          store_id: item.id,
          store_name: item.store_name,
          address: item.address,
          phone_number_1: item.phone_number_1,
          phone_number_2: item.phone_number_2,
        }))

        setStore(tempStore)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getInvoiceData()
  }, [store])

  useEffect(() => {
    getStore()
  }, [])

  const getFormattedPeriod = () => {
    const now = new Date()
    const lastMonth = new Date(now)
    lastMonth.setMonth(now.getMonth() - 1)

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('id-ID', {
        month: 'long',
      })
    }

    return `${formatDate(lastMonth)} - ${formatDate(now)} ${now.getFullYear()}`
  }

  const generatePdf = async () => {
    setLoadingPDF(true)
    const input = pdfRef.current
    if (input) {
      const canvas = await html2canvas(input)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(
        `Invoice - ${invoiceDetail?.id} - ${new Date(invoiceDetail?.created_at).toLocaleDateString(
          'id-ID',
          {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }
        )}.pdf`
      )
    }
    setLoadingPDF(false)
  }

  return (
    <section id='detail-invoice'>
      <Card ref={pdfRef}>
        <Card.Body>
          <Row className='invoice-detail mb-4'>
            <Col xxl={6} xl={6} md={6} sm={12} className='vendor-information'>
              <h1 className='fw-bolder'>{invoiceDetail?.vendor?.company_name}</h1>
              <div className='fs-3 fw-normal'>{invoiceDetail?.vendor?.address}</div>
            </Col>

            <Col xxl={6} xl={6} md={6} sm={12} className='invoice-information'>
              <h1 className='fw-bolder'>INVOICE</h1>

              <div className='fs-3 fw-semibold'>
                Tanggal Dibuat :{' '}
                <span className='fw-normal'>
                  {new Date(invoiceDetail?.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className='fs-3 fw-semibold'>
                Invoice ID : <span className='fw-normal'>{invoiceDetail?.id}</span>
              </div>
            </Col>
          </Row>

          <Row className='invoice-detail mb-4'>
            <Col xxl={6} xl={6} md={6} sm={12} className='receiver-information'>
              <div className='fs-2 fw-semibold'>Ditunjukkan kepada :</div>
              <div className='fs-4 mb-2 fw-bold'>PT Catur Mitra Sejati Sentosa</div>
              <h3 className='fs-4 mb-2 fw-normal'>
                Jl. Gading Serpong Boulevard Blok mitra 10, Curug Sangereng, Kec. Klp. Dua,
                Kabupaten Tangerang, Banten 15820
              </h3>
              <h3 className='fs-4 mb-2 fw-normal'>Telp : 0878-8210-5748</h3>
            </Col>

            <Col xxl={6} xl={6} md={6} sm={12} className='receiver-information'>
              {invoiceDetail?.status === 3 && (
                <Form.Group>
                  <Form.Label className='fs-5 fw-bold text-danger'>Alasan Ditolak :</Form.Label>
                  <Form.Control
                    style={{minHeight: '80px'}}
                    as='textarea'
                    readOnly
                    value={invoiceDetail?.description ?? ''}
                  />
                </Form.Group>
              )}
            </Col>
          </Row>

          <Row className='detail-table mb-2'>
            <Table responsive hover>
              <thead>
                <tr>
                  <th className='text-center'>Order ID</th>
                  <th className='text-center'>Tanggal Order</th>
                  <th className='text-center'>Nama Toko</th>
                  <th className='text-center'>Nama Konsumen</th>
                  <th className='text-center'>Jenis Pekerjaan</th>
                  <th className='text-center'>Nomor Receipt</th>
                  <th className='text-center'>Total Harga</th>
                </tr>
              </thead>

              <tbody>
                {invoiceDetail?.invoice_details.map((item: any) => (
                  <tr key={item?.order?.id}>
                    <td>{item?.order?.id}</td>
                    <td>
                      {new Date(item?.order?.request_survey).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      {store.find((x: any) => x.store_id === item?.order?.store_id)?.store_name}
                    </td>
                    <td>{item?.order?.members?.full_name}</td>
                    <td>
                      {item?.order?.payment_type === 'survey'
                        ? 'Survey'
                        : 'Pemasangan Tanpa Survey'}
                    </td>
                    <td>
                      {item?.order?.quotation?.length > 0 &&
                      item?.order?.quotation[0]?.receipt_quotation !== null
                        ? item?.order?.quotation[0]?.receipt_quotation
                        : item?.order?.receipt_number}
                    </td>
                    <td>{`Rp. ${parseInt(item?.total).toLocaleString('id')}`}</td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={6} className='text-end fw-bolder'>
                    Grand Total
                  </td>

                  <td className='fw-bolder'>{`Rp. ${parseInt(
                    invoiceDetail?.total_amount
                  ).toLocaleString('id')}`}</td>
                </tr>
              </tbody>
            </Table>
          </Row>

          <Row className='payment-information mb-2'>
            <div className='payment-method'>
              <div className='fs-3 fw-semibold mb-1'>
                Silahkan melakukan pembayaran di account di bawah ini :
              </div>

              <div className='fs-4 fw-normal'>
                Nama Akun : {invoiceDetail?.vendor?.account_name}
              </div>
              <div className='fs-4 fw-normal'>
                Nomor Akun : {invoiceDetail?.vendor?.account_number}
              </div>
            </div>

            <div className='payment-evidence'>
              <div className='fs-3 fw-semibold mb-1'>Silahkan kirim bukti bayar anda melalui:</div>

              <div className='fs-4 fw-normal'>WA : {invoiceDetail?.vendor?.phone_number}</div>
              <div className='fs-4 fw-normal'>Email : {invoiceDetail?.vendor?.email_address}</div>
            </div>
          </Row>

          <Row className='signature'>
            <Col xxl={8} xl={8} md={8} sm={12}></Col>

            <Col xxl={4} xl={4} md={4} sm={12} className='signature'>
              <div className='signature-label'>Tanda Tangan :</div>
              <div className='signature-label'>{getFormattedPeriod()}</div>
              <div className='signature-line'></div>
              <div className='signature-name'>{invoiceDetail?.vendor?.company_name}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Button
        className='btn-dark-primary d-flex justify-content-center align-items-center mt-5 w-100 gap-3'
        onClick={generatePdf}
      >
        {loadingPDF === false ? (
          <>
            <FontAwesomeIcon icon={faDownload} size='lg' />
            Download PDF
          </>
        ) : (
          'Generating PDF...'
        )}
      </Button>
    </section>
  )
}

export {DetailInvoiceVendor}
