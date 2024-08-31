import React, {FC, useState, useEffect, useRef} from 'react'
import {useParams, useNavigate, Link} from 'react-router-dom'

import './DetailInvoice.css'

import axios from 'axios'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {Image} from 'antd'
import {ListGroup, Table, Row, Col, Card, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'
import {formatDate} from '../../../../../_metronic/helpers'

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

  const userRole = localStorage.getItem('userRole') as string

  const [loadingPDF, setLoadingPDF] = useState<boolean>(false)
  const [loadingTemplate, setLoadingTemplate] = useState<boolean>(false)

  const [store, setStore] = useState<Store[]>([])

  // Invoice
  const [invoiceDetail, setInvoiceDetail] = useState<any>()

  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)

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

  // Export Template Excel
  const exportTemplate = () => {
    setLoadingTemplate(true)

    axios
      .get(`${apiUrl}/invoices/export-excel?invoce_id=${params.id}`, {
        method: 'GET',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `Invoice.xlsx`)
        document.body.appendChild(link)
        link.click()

        setLoadingTemplate(false)
      })
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
                Invoice ID : <span className='fw-normal'>{invoiceDetail?.id}</span>
              </div>

              <div className='fs-3 fw-semibold'>
                Tanggal dibuat :{' '}
                <span className='fw-normal'>{formatDate(invoiceDetail?.created_at)}</span>
              </div>

              <div className='fs-3 fw-semibold'>
                Periode : <span className='fw-normal'>{getFormattedPeriod()}</span>
              </div>

              {['Super User', 'Admin HO'].includes(userRole) && (
                <div className='fs-3 fw-semibold'>
                  Tanggal diberikan kepada Finance :{' '}
                  <span className='fw-normal'>
                    {invoiceDetail?.invoice_to_finance_date ? (
                      <>{formatDate(invoiceDetail?.invoice_to_finance_date)}</>
                    ) : (
                      <>Invoice ini belum dikirimkan kepada finance</>
                    )}
                  </span>
                </div>
              )}
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
              <h3 className='fs-4 mb-2 fw-normal'>Telp : 0878-8482-1089</h3>
            </Col>

            <Col xxl={6} xl={6} md={6} sm={12} className='notes'>
              {invoiceDetail?.status === 3 && (
                <div className='fs-3 fw-semibold text-danger'>
                  Alasan ditolak : <br></br>
                  <span className='text-dark fw-normal'>{invoiceDetail?.notes}</span>
                </div>
              )}
            </Col>
          </Row>

          <Row className='detail-table mb-2'>
            <Table responsive hover>
              <thead>
                <tr>
                  <th className='text-center'>No. Invoice</th>
                  <th className='text-center'>Order ID</th>
                  <th className='text-center'>Tanggal Order</th>
                  <th className='text-center'>Nama Toko</th>
                  <th className='text-center'>Nama Konsumen</th>
                  <th className='text-center'>Tipe Order</th>
                  <th className='text-center'>Nomor Receipt</th>
                  <th className='text-center'>Total Harga</th>
                </tr>
              </thead>

              <tbody>
                {invoiceDetail?.invoice_details.map((item: any) => (
                  <tr key={item?.order?.id}>
                    <td align='center'>{item?.invoice_number}</td>
                    <td align='center'>{item?.order?.id}</td>
                    <td>{formatDate(item?.order?.request_survey)}</td>
                    <td>
                      {store.find((x: any) => x.store_id === item?.order?.store_id)?.store_name}
                    </td>
                    <td>{item?.order?.members?.full_name}</td>
                    <td>
                      {item?.order?.payment_type === 'survey'
                        ? 'Survey'
                        : item?.order?.payment_type === 'pemasangan_tanpa_survey'
                        ? 'Pemasangan Tanpa Survey'
                        : item?.order?.payment_type === 'gratis'
                        ? 'Gratis'
                        : ''}
                    </td>
                    <td>
                      <Link to={`/order/detail-order/${item?.order?.id}`}>
                        {item?.order?.quotation?.length > 0 &&
                        item?.order?.quotation[0]?.receipt_quotation !== null
                          ? item?.order?.quotation[0]?.receipt_quotation
                          : item?.order?.receipt_number}
                      </Link>
                    </td>
                    <td>{`Rp. ${parseInt(item?.total).toLocaleString('id')}`}</td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={7} className='text-end fw-bolder'>
                    Total
                  </td>

                  <td className='fw-bolder'>
                    {`Rp. ${invoiceDetail?.invoice_details
                      .reduce((acc: number, item: any) => acc + parseInt(item?.total), 0)
                      .toLocaleString('id')}`}
                  </td>
                </tr>

                <tr>
                  <td colSpan={7} className='text-end fw-bolder'>
                    PPn {invoiceDetail?.vendor?.type === 1 ? '( Vendor PKP )' : ''}
                  </td>

                  <td className='fw-bolder'>{`Rp. ${parseInt(
                    invoiceDetail?.ppn_nominal ?? 0
                  ).toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={7} className='text-end fw-bolder'>
                    PPh
                  </td>

                  <td className='fw-bolder'>{`Rp. ${parseInt(
                    invoiceDetail?.pph_nominal ?? 0
                  ).toLocaleString('id')}`}</td>
                </tr>

                {/* <tr>
                  <td colSpan={7} className='text-end fw-bolder'>
                    PKP ( 1, 11 %)
                  </td>

                  <td className='fw-bolder'>{`Rp. ${parseInt(
                    invoiceDetail?.pkp_nominal ?? 0
                  ).toLocaleString('id')}`}</td>
                </tr> */}

                <tr>
                  <td colSpan={7} className='text-end fw-bolder'>
                    Penalty
                  </td>

                  <td className='fw-bolder'>{`Rp. ${parseInt(
                    invoiceDetail?.penalty_nominal ?? 0
                  ).toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={7} className='text-end fw-bolder'>
                    Grand Total
                  </td>

                  <td className='fw-bolder'>{`Rp. ${parseInt(
                    invoiceDetail?.total_amount ?? 0
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

          {['Owner Vendor', 'Admin Vendor'].includes(userRole) && (
            <Row className='signature'>
              <Col xxl={8} xl={8} md={8} sm={12}></Col>

              <Col xxl={4} xl={4} md={4} sm={12} className='signature'>
                <div className='signature-label'>Tanda Tangan :</div>
                <div className='signature-label'>
                  {new Date(invoiceDetail?.created_at).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <div className='signature-line'></div>
                <div className='signature-name'>{invoiceDetail?.vendor?.company_name}</div>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      <Card className='mt-5'>
        <Card.Header>
          <Card.Title>File Tagihan</Card.Title>
        </Card.Header>

        <Card.Body>
          <Row>
            <Col>
              <ListGroup>
                {invoiceDetail?.invoice_evidence.map((item: any) => (
                  <ListGroup.Item
                    key={item.id}
                    action
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                      setPreviewImage(item.evidence_location)
                      setVisible(true)
                    }}
                  >
                    {item.evidence_location}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {invoiceDetail?.invoice_evidence?.length ? (
                <>
                  {previewImage && (
                    <div>
                      <Image
                        key={previewImage}
                        width={200}
                        style={{display: 'none'}}
                        src={`${apiUrl}/public/invoices/${previewImage}`}
                        preview={{
                          visible: visible,
                          src: `${apiUrl}/public/invoices/${previewImage}`,
                          onVisibleChange: (value) => {
                            setVisible(value)
                          },
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className='d-flex justify-content-start align-items-center'>
                  <p className='fs-7 text-danger'>Belum ada file tagihan</p>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className='button-wrapper d-flex justify-content-center align-items-center gap-3 mt-3'>
        <Button
          className='btn-dark-success d-flex justify-content-center align-items-center w-100 gap-3 m-0'
          disabled={loadingPDF}
          onClick={() => exportTemplate()}
        >
          {loadingTemplate === false ? (
            <>
              <FontAwesomeIcon icon={faDownload} size='lg' />
              Export Excel
            </>
          ) : (
            'Exporting...'
          )}
        </Button>

        <Button
          className='btn-dark-primary d-flex justify-content-center align-items-center w-100 gap-3 m-0'
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
      </div>
    </section>
  )
}

export {DetailInvoiceVendor}
