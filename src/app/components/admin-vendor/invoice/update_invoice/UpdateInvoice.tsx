import React, {FC, useState, useEffect, useRef} from 'react'
import {useParams, useNavigate, Link} from 'react-router-dom'
import {formatDateWithTime} from '../../../../../_metronic/helpers'

import './UpdateInvoice.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Image} from 'antd'
import {Form, ListGroup, Table, Row, Col, Card, Button} from 'react-bootstrap'
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

interface Invoice {
  vendor_id: number | null
  status: number | null
  total: number
  pph_nominal: number
  ppn_nominal: number
  pkp_nominal: number
  penalty_nominal: number
  grand_total?: number
  invoice_evidences: Array<any>
  invoice_details: Array<{
    id?: number | null
    order_id: number | null
    type?: number | null
  }>
}

const UpdateInvoiceVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()
  const pdfRef = useRef<HTMLDivElement>(null)

  const userRole = localStorage.getItem('userRole') as string

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingPDF, setLoadingPDF] = useState<boolean>(false)
  const [loadingTemplate, setLoadingTemplate] = useState<boolean>(false)

  // Store
  const [store, setStore] = useState<Store[]>([])

  // Invoice
  const [invoiceDetail, setInvoiceDetail] = useState<any>()
  const [invoices, setInvoices] = useState<Invoice>({
    vendor_id: null,
    status: null,
    total: 0,
    pph_nominal: 0,
    ppn_nominal: 0,
    pkp_nominal: 0,
    penalty_nominal: 0,
    grand_total: 0,
    invoice_evidences: [],
    invoice_details: [
      {
        id: null,
        order_id: null,
        type: null,
      },
    ],
  })

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
          setInvoices((prevInvoices) => ({
            ...prevInvoices,
            vendor_id: data?.vendor?.id,
            status: data?.status,
            total: data?.invoice_details?.reduce(
              (acc: number, item: any) => acc + parseInt(item?.total),
              0
            ),
            pph_nominal: data?.pph_nominal ?? 0,
            ppn_nominal: data?.ppn_nominal ?? 0,
            pkp_nominal: parseInt(data?.pkp_nominal ?? 0),
            penalty_nominal: parseInt(data?.penalty_nominal ?? 0),
            invoice_details: data?.invoice_details.map((item: any) => ({
              id: item.id,
              order_id: item.order_id,
              type: item.type,
            })),
          }))
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
    // eslint-disable-next-line
  }, [store])

  useEffect(() => {
    getStore()
    // eslint-disable-next-line
  }, [])

  // Format Period
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

  // Handle Change Invoice
  const handleChangeInvoice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target

    setInvoices((prevInvoices) => ({
      ...prevInvoices,
      [name]: value,
    }))
  }

  // Calculate Grand Total
  const calculateGrandTotal = () => {
    const total = invoices.total
    const pph = (total * invoices.pph_nominal) / 100
    const ppn = (total * invoices.ppn_nominal) / 100
    const grandTotal = total + ppn + pph + invoices.pkp_nominal - invoices.penalty_nominal

    setInvoices((prev) => ({
      ...prev,
      grand_total: grandTotal,
    }))
  }

  useEffect(() => {
    if (invoiceDetail) {
      calculateGrandTotal()
    }
    // eslint-disable-next-line
  }, [invoiceDetail, invoices.pph_nominal, invoices.ppn_nominal])

  // Handle Update Invoice
  const handleUpdateInvoice = async (status: number) => {
    setIsLoading(true)
    const formData = new FormData()

    formData.append('vendor_id', String(invoices.vendor_id))
    formData.append('status', String(status))
    formData.append('pkp_nominal', String(invoices.pkp_nominal))
    formData.append('pph_nominal', String(invoices.pph_nominal))
    formData.append('ppn_nominal', String(invoices.ppn_nominal))

    try {
      const response = await axios.post(`${apiUrl}/invoices/${params.id}`, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response.data.status === 201) {
        Swal.fire({
          title: 'Success',
          text: 'Berhasil update invoice',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate(`/invoice/view-invoice`)
        })

        setIsLoading(false)
      } else {
        Swal.fire({
          title: 'Error',
          text: response.data.message,
          icon: 'error',
        })

        setIsLoading(false)
      }
    } catch (error: any) {
      console.error(error)
      setIsLoading(false)

      Swal.fire({
        title: 'Error',
        text: error.response.data.message,
        icon: 'error',
      })
    }
  }

  const generatePDFVendor = () => {
    setLoadingPDF(true)
    axios
      .get(`${apiUrl}/invoices/pdf/${params.id}`, {
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
        link.setAttribute('download', `Invoice PDF.pdf`)
        document.body.appendChild(link)
        link.click()
      })
      .finally(() => {
        setLoadingPDF(false)
      })
  }

  const generatePDFHO = () => {
    setLoadingPDF(true)
    axios
      .get(`${apiUrl}/invoices/rekonsel-pdf/${params.id}`, {
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
        link.setAttribute('download', `Invoice PDF.pdf`)
        document.body.appendChild(link)
        link.click()
      })
      .finally(() => {
        setLoadingPDF(false)
      })
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

  const exportTemplateRekonsel = () => {
    setLoadingTemplate(true)

    axios
      .get(`${apiUrl}/invoices/${params.id}/rekonsel/export-excel`, {
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
        link.setAttribute(
          'download',
          `Rekonsel Invoice ID ${params.id} ${formatDateWithTime(new Date())}.xlsx`
        )
        document.body.appendChild(link)
        link.click()

        setLoadingTemplate(false)
      })
  }

  const getReceiptQuotation = (data: any) => {
    const {order} = data || {}
    const {quotation, receipt_number} = order || {}

    if (!quotation || quotation.length === 0) {
      return receipt_number
    }

    const {quotation_receipt, receipt_quotation} = quotation[0] || {}

    if (receipt_quotation !== null) {
      return receipt_quotation
    }

    if (quotation_receipt && quotation_receipt.length > 0) {
      const validReceipt = quotation_receipt.find(
        (receipt: any) => receipt?.receipt_quotation !== null
      )

      return validReceipt?.receipt_quotation || receipt_number
    }

    return receipt_number
  }

  return (
    <section id='update-invoice'>
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
                {invoiceDetail?.invoice_details?.map((item: any) => (
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
                        {getReceiptQuotation(item)}
                      </Link>
                    </td>
                    <td>{`Rp. ${parseInt(item?.total).toLocaleString('id')}`}</td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={7} className='text-end fw-bolder'>
                    Total
                  </td>

                  <td className='fw-bolder'>{`Rp. ${parseInt(
                    invoices.total.toString() || '0'
                  ).toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={7} className='text-end fw-bolder'>
                    PPn {invoiceDetail?.vendor?.type === 1 ? '( Vendor PKP )' : ''}
                  </td>

                  <td className='fw-bolder'>
                    <div className='custom-input'>
                      <Form.Control
                        name='ppn_nominal'
                        type='number'
                        id='percentage'
                        value={invoices.ppn_nominal}
                        onChange={(e: any) => handleChangeInvoice(e)}
                      />

                      <span className='percentage fs-1'>%</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td colSpan={7} className='text-end fw-bolder'>
                    PPh
                  </td>

                  <td className='fw-bolder'>
                    <div className='custom-input'>
                      <Form.Control
                        name='pph_nominal'
                        type='number'
                        id='percentage'
                        value={invoices.pph_nominal}
                        onChange={(e: any) => handleChangeInvoice(e)}
                      />

                      <span className='percentage fs-1'>%</span>
                    </div>
                  </td>
                </tr>

                {/* <tr>
                  <td colSpan={7} className='text-end fw-bolder'>
                    PKP ( 1, 11 %)
                  </td>

                  <td className='fw-bolder'>{`Rp. ${parseInt(
                    invoices.pkp_nominal.toString() ?? 0
                  ).toLocaleString('id')}`}</td>
                </tr> */}

                <tr>
                  <td colSpan={7} className='text-end fw-bolder'>
                    Penalty
                  </td>

                  <td className='fw-bolder'>{`Rp. ${parseInt(
                    invoices.penalty_nominal.toString() ?? 0
                  ).toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={7} className='text-end fw-bolder'>
                    Grand Total
                  </td>

                  <td className='fw-bolder'>
                    {`Rp. ${invoices.grand_total?.toLocaleString('id')}`}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Row>

          <Row>
            <div className='d-flex justify-content-center align-items-center gap-3'>
              <Button
                disabled={isLoading}
                variant='danger'
                type='submit'
                onClick={() => handleUpdateInvoice(3)}
              >
                {isLoading ? 'Updating..' : 'Reject Invoice'}
              </Button>

              <Button
                className='d-flex justify-content-center align-items-center'
                variant='primary'
                type='submit'
                disabled={isLoading}
                onClick={() => handleUpdateInvoice(2)}
              >
                {isLoading ? 'Updating..' : 'Approve Invoice'}
              </Button>
            </div>
          </Row>

          {['Owner Vendor', 'Admin Vendor'].includes(userRole) && (
            <Row className='signature'>
              <Col xxl={8} xl={8} md={8} sm={12}></Col>

              <Col xxl={4} xl={4} md={4} sm={12} className='signature'>
                <div className='signature-label'>Tanda Tangan :</div>
                <div className='signature-label'>{formatDate(invoiceDetail?.created_at)}</div>
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
          onClick={() =>
            ['Owner Vendor', 'Admin Vendor'].includes(userRole)
              ? exportTemplate()
              : exportTemplateRekonsel()
          }
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

        {!['Finance'].includes(userRole) && (
          <Button
            className='btn-dark-primary d-flex justify-content-center align-items-center w-100 gap-3 m-0'
            onClick={() =>
              ['Owner Vendor', 'Admin Vendor'].includes(userRole)
                ? generatePDFVendor()
                : generatePDFHO()
            }
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
        )}
      </div>
    </section>
  )
}

export {UpdateInvoiceVendor}
