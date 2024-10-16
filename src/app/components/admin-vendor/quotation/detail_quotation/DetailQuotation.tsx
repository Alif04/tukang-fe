import React, {FC, useState, useEffect, useRef} from 'react'
import {formatDate, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {useParams} from 'react-router-dom'

import './DetailQuotation.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Table, Row, Col, Card, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'

const DetailQuotationVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const pdfRef = useRef<HTMLDivElement>(null)
  const userRole = localStorage.getItem('userRole') as string

  const [loadingPDF, setLoadingPDF] = useState(false)
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

  // Export PDF Quotation
  const generatePdf = (order_id: number, customer_name: string) => {
    axios
      .get(`${apiUrl}/orders/quotation-pdf/${order_id}`, {
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
        link.setAttribute('download', `Quotation - ${customer_name} - Order ID ${order_id}.pdf`)
        document.body.appendChild(link)
        link.click()
      })
      .catch((error: any) => {
        Swal.fire('Error', 'Terjadi kesalahan saat mengekspor data', 'error')
      })
  }

  // Payment Stage
  const [paymentStages, setPaymentStages] = useState([
    {stage: 'Tahap 1', percentage: '25%', amount: 0},
    {stage: 'Tahap 2', percentage: '50%', amount: 0},
    {stage: 'Tahap 3', percentage: '25%', amount: 0},
  ])

  const calculatePaymentStages = (grandTotal: number) => {
    const stage1 = grandTotal * 0.25
    const stage2 = grandTotal * 0.5
    const stage3 = grandTotal * 0.25

    setPaymentStages([
      {stage: 'Tahap 1', percentage: '25%', amount: stage1},
      {stage: 'Tahap 2', percentage: '50%', amount: stage2},
      {stage: 'Tahap 3', percentage: '25%', amount: stage3},
    ])
  }

  useEffect(() => {
    calculatePaymentStages(quotationDetail?.quotation_grand_total)
  }, [quotationDetail?.quotation_grand_total])

  return (
    <section id='detail-quotation'>
      <Card ref={pdfRef}>
        <Card.Body>
          <Row className='quotation-detail mb-4'>
            <Col xxl={6} xl={6} md={6} sm={12} className='vendor-information'>
              <div className='vendor-detail'>
                {['Super User', 'Admin HO'].includes(userRole) && (
                  <img
                    alt='Logo'
                    className='h-50px logo mb-3'
                    src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
                  />
                )}

                <div className='address'>
                  <div className='fs-3 fw-semibold mb-2'>
                    {quotationDetail?.store?.store_name ?? ''}
                  </div>
                  <div className='fs-4 fw-normal'>{quotationDetail?.store?.address ?? ''}</div>
                  <div className='fs-4 fw-normal'>
                    {`Telp : ${
                      quotationDetail?.store?.phone_number_1 ??
                      quotationDetail?.store?.phone_number_2 ??
                      'Nomor telepon belum tersedia'
                    }`}
                  </div>
                </div>
              </div>
            </Col>

            <Col xxl={6} xl={6} md={6} sm={12} className='quotation-information'>
              <h1 className='fw-bolder mb-3'>QUOTATION</h1>

              <div className='fs-4 fw-semibold'>
                Tanggal :
                <span className='ms-1 fw-normal'>
                  {formatDate(quotationDetail?.quotation_date)}
                </span>
              </div>

              <div className='fs-4 fw-semibold'>
                Quotation ID : <span className='fw-normal'>{quotationDetail?.id}</span>
              </div>

              <div className='fs-4 fw-semibold'>
                Customer ID :{' '}
                <span className='fw-normal'>{quotationDetail?.order?.members?.member_number}</span>
              </div>
            </Col>
          </Row>

          <Row className='quotation-detail mb-4'>
            <Col xxl={6} xl={6} md={6} sm={12} className='receiver-information'>
              <div className='receiver-detail'>
                <div className='fs-2 fw-semibold'>Ditunjukkan kepada :</div>
                <div className='fs-4 fw-normal'>{quotationDetail?.order?.members?.full_name}</div>
                <div className='fs-4 fw-normal'>{quotationDetail?.order.project_address}</div>
                <div className='fs-4 fw-normal'>Telp : {quotationDetail?.order.project_number}</div>
              </div>
            </Col>

            <Col xxl={6} xl={6} md={6} sm={12} className='quotation-information'>
              <div className='fs-4 fw-semibold'>
                Quotation Valid Until :
                <span className='ms-1 fw-normal'>
                  {quotationDetail?.quotation_validity
                    ? formatDate(quotationDetail?.quotation_validity)
                    : '-'}
                </span>
              </div>

              <div className='description'>
                <div className='fs-4 fw-semibold'>
                  Instruksi Spesial :{' '}
                  <span className='fs-4 fw-normal'>{quotationDetail?.description ?? ''}</span>
                </div>
              </div>
            </Col>
          </Row>

          <Row className='detail-table mb-2'>
            {quotationDetail?.quotation_special === 0 && (
              <Table hover className='table-jasa'>
                <thead>
                  {['Owner Vendor', 'Admin Vendor'].includes(userRole) ? (
                    <tr>
                      <th className='text-center'>Jenis Jasa</th>
                      <th className='text-center'>QTY</th>
                      <th className='text-center'>Satuan</th>
                      <th className='text-center'>Price</th>
                      <th className='text-center'>Profit</th>
                      <th className='text-center'>Total</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className='text-center' style={{minWidth: '233px'}}>
                        Jenis Jasa
                      </th>
                      <th className='text-center'>QTY</th>
                      <th className='text-center'>Satuan</th>
                      <th className='text-center'>Final Price</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {quotationDetail?.quotation_details
                    .filter((x: any) => x.item_type === 2)
                    .map((item: any) => (
                      <>
                        {['Owner Vendor', 'Admin Vendor'].includes(userRole) ? (
                          <tr>
                            <td>{item?.name ?? '-'}</td>
                            <td>{item?.quantity}</td>
                            <td>{item?.unit}</td>
                            <td>{`Rp. ${parseInt(item?.price ?? 0).toLocaleString('id')}`}</td>
                            <td>
                              {item.margin_type === 1
                                ? `${item?.margin ?? 0}%`
                                : `Rp. ${parseInt(item?.margin ?? 0).toLocaleString('id')}`}
                            </td>
                            <td>{`Rp. ${parseInt(item?.final_price ?? 0).toLocaleString(
                              'id'
                            )}`}</td>
                          </tr>
                        ) : (
                          <tr>
                            <td>{item?.name ?? '-'}</td>
                            <td>{item?.quantity}</td>
                            <td>{item?.unit ?? '-'}</td>
                            <td>{`Rp. ${parseInt(item?.final_price || 0).toLocaleString(
                              'id'
                            )}`}</td>
                          </tr>
                        )}
                      </>
                    ))}
                </tbody>
              </Table>
            )}

            {quotationDetail?.quotation_special === 1 && (
              <>
                <hr />

                <div className='p-0'>
                  <p className='fs-7 text-black'>Keterangan : </p>
                  <p className='fs-7 fw-semibold text-black'>
                    *Quotation ini menggunakan quotation tipe spesial
                  </p>
                  <p className='fs-7 fw-semibold text-black'>
                    *Quotation spesial merupakan quotation yang nominalnya diatas 20.000.000
                  </p>
                </div>

                <hr />

                <div className='fs-6 fw-bold p-0'>Jasa Pemasangan Tahap 1</div>

                <Table hover className='table-jasa'>
                  <thead>
                    {['Owner Vendor', 'Admin Vendor'].includes(userRole) ? (
                      <tr>
                        <th className='text-center'>Jenis Jasa</th>
                        <th className='text-center'>QTY</th>
                        <th className='text-center'>Satuan</th>
                        <th className='text-center'>Price</th>
                        <th className='text-center'>Profit</th>
                        <th className='text-center'>Total</th>
                      </tr>
                    ) : (
                      <tr>
                        <th className='text-center' style={{minWidth: '233px'}}>
                          Jenis Jasa
                        </th>
                        <th className='text-center'>QTY</th>
                        <th className='text-center'>Satuan</th>
                        <th className='text-center'>Final Price</th>
                      </tr>
                    )}
                  </thead>

                  <tbody>
                    {quotationDetail?.quotation_details
                      .filter((x: any) => x.item_type === 2 && x.work_step === 1)
                      .map((item: any) => (
                        <>
                          {['Owner Vendor', 'Admin Vendor'].includes(userRole) ? (
                            <tr>
                              <td>{item?.name ?? '-'}</td>
                              <td>{item?.quantity}</td>
                              <td>{item?.unit}</td>
                              <td>{`Rp. ${parseInt(item?.price ?? 0).toLocaleString('id')}`}</td>
                              <td>
                                {item.margin_type === 1
                                  ? `${item?.margin ?? 0}%`
                                  : `Rp. ${parseInt(item?.margin ?? 0).toLocaleString('id')}`}
                              </td>
                              <td>{`Rp. ${parseInt(item?.final_price ?? 0).toLocaleString(
                                'id'
                              )}`}</td>
                            </tr>
                          ) : (
                            <tr>
                              <td>{item?.name ?? '-'}</td>
                              <td>{item?.quantity}</td>
                              <td>{item?.unit ?? '-'}</td>
                              <td>{`Rp. ${parseInt(item?.final_price || 0).toLocaleString(
                                'id'
                              )}`}</td>
                            </tr>
                          )}
                        </>
                      ))}
                  </tbody>
                </Table>

                <hr />

                <div className='fs-6 fw-bold p-0'>Jasa Pemasangan Tahap 2</div>

                <Table hover className='table-jasa'>
                  <thead>
                    {['Owner Vendor', 'Admin Vendor'].includes(userRole) ? (
                      <tr>
                        <th className='text-center'>Jenis Jasa</th>
                        <th className='text-center'>QTY</th>
                        <th className='text-center'>Satuan</th>
                        <th className='text-center'>Price</th>
                        <th className='text-center'>Profit</th>
                        <th className='text-center'>Total</th>
                      </tr>
                    ) : (
                      <tr>
                        <th className='text-center' style={{minWidth: '233px'}}>
                          Jenis Jasa
                        </th>
                        <th className='text-center'>QTY</th>
                        <th className='text-center'>Satuan</th>
                        <th className='text-center'>Final Price</th>
                      </tr>
                    )}
                  </thead>

                  <tbody>
                    {quotationDetail?.quotation_details
                      .filter((x: any) => x.item_type === 2 && x.work_step === 2)
                      .map((item: any) => (
                        <>
                          {['Owner Vendor', 'Admin Vendor'].includes(userRole) ? (
                            <tr>
                              <td>{item?.name ?? '-'}</td>
                              <td>{item?.quantity}</td>
                              <td>{item?.unit}</td>
                              <td>{`Rp. ${parseInt(item?.price ?? 0).toLocaleString('id')}`}</td>
                              <td>
                                {item.margin_type === 1
                                  ? `${item?.margin ?? 0}%`
                                  : `Rp. ${parseInt(item?.margin ?? 0).toLocaleString('id')}`}
                              </td>
                              <td>{`Rp. ${parseInt(item?.final_price ?? 0).toLocaleString(
                                'id'
                              )}`}</td>
                            </tr>
                          ) : (
                            <tr>
                              <td>{item?.name ?? '-'}</td>
                              <td>{item?.quantity}</td>
                              <td>{item?.unit ?? '-'}</td>
                              <td>{`Rp. ${parseInt(item?.final_price || 0).toLocaleString(
                                'id'
                              )}`}</td>
                            </tr>
                          )}
                        </>
                      ))}
                  </tbody>
                </Table>

                <hr />

                <div className='fs-6 fw-bold p-0'>Jasa Pemasangan Tahap 3</div>

                <Table hover className='table-jasa'>
                  <thead>
                    {['Owner Vendor', 'Admin Vendor'].includes(userRole) ? (
                      <tr>
                        <th className='text-center'>Jenis Jasa</th>
                        <th className='text-center'>QTY</th>
                        <th className='text-center'>Satuan</th>
                        <th className='text-center'>Price</th>
                        <th className='text-center'>Profit</th>
                        <th className='text-center'>Total</th>
                      </tr>
                    ) : (
                      <tr>
                        <th className='text-center' style={{minWidth: '233px'}}>
                          Jenis Jasa
                        </th>
                        <th className='text-center'>QTY</th>
                        <th className='text-center'>Satuan</th>
                        <th className='text-center'>Final Price</th>
                      </tr>
                    )}
                  </thead>

                  <tbody>
                    {quotationDetail?.quotation_details
                      .filter((x: any) => x.item_type === 2 && x.work_step === 3)
                      .map((item: any) => (
                        <>
                          {['Owner Vendor', 'Admin Vendor'].includes(userRole) ? (
                            <tr>
                              <td>{item?.name ?? '-'}</td>
                              <td>{item?.quantity}</td>
                              <td>{item?.unit}</td>
                              <td>{`Rp. ${parseInt(item?.price ?? 0).toLocaleString('id')}`}</td>
                              <td>
                                {item.margin_type === 1
                                  ? `${item?.margin ?? 0}%`
                                  : `Rp. ${parseInt(item?.margin ?? 0).toLocaleString('id')}`}
                              </td>
                              <td>{`Rp. ${parseInt(item?.final_price ?? 0).toLocaleString(
                                'id'
                              )}`}</td>
                            </tr>
                          ) : (
                            <tr>
                              <td>{item?.name ?? '-'}</td>
                              <td>{item?.quantity}</td>
                              <td>{item?.unit ?? '-'}</td>
                              <td>{`Rp. ${parseInt(item?.final_price || 0).toLocaleString(
                                'id'
                              )}`}</td>
                            </tr>
                          )}
                        </>
                      ))}
                  </tbody>
                </Table>

                <hr />
              </>
            )}

            <Table hover className='table-material'>
              <thead>
                {['Owner Vendor', 'Admin Vendor'].includes(userRole) ? (
                  <tr>
                    <th className='text-center' style={{minWidth: '200px'}}>
                      Material yang dibutuhkan
                    </th>
                    <th className='text-center'>QTY</th>
                    <th className='text-center'>Satuan</th>
                    <th className='text-center'>Price</th>
                    <th className='text-center'>Profit</th>
                    <th className='text-center'>Total</th>
                  </tr>
                ) : (
                  <tr>
                    <th className='text-center' style={{minWidth: '200px'}}>
                      Material yang dibutuhkan
                    </th>
                    <th className='text-center'>QTY</th>
                    <th className='text-center'>Satuan</th>
                    <th className='text-center'>Final Price</th>
                  </tr>
                )}
              </thead>

              <tbody>
                {quotationDetail?.quotation_details
                  .filter((x: any) => x.item_type === 1)
                  .map((item: any) => (
                    <>
                      {['Owner Vendor', 'Admin Vendor'].includes(userRole) ? (
                        <tr>
                          <td>
                            {item?.name ?? '-'}{' '}
                            {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                          </td>
                          <td>{item?.quantity}</td>
                          <td>{item?.unit}</td>
                          <td>{`Rp. ${parseInt(item?.price ?? 0).toLocaleString('id')}`}</td>
                          <td>
                            {item.margin_type === 1
                              ? `${item?.margin ?? 0}%`
                              : `Rp. ${parseInt(item?.margin ?? 0).toLocaleString('id')}`}
                          </td>
                          <td>{`Rp. ${parseInt(item?.final_price ?? 0).toLocaleString('id')}`}</td>
                        </tr>
                      ) : (
                        <tr>
                          <td>
                            {item?.name ?? '-'}{' '}
                            {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                          </td>
                          <td>{item?.quantity}</td>
                          <td>{item?.unit ?? '-'}</td>
                          <td>{`Rp. ${parseInt(item?.final_price || 0).toLocaleString('id')}`}</td>
                        </tr>
                      )}
                    </>
                  ))}

                <tr>
                  <td
                    colSpan={['Owner Vendor', 'Admin Vendor'].includes(userRole) ? 5 : 3}
                    className='text-end fw-bolder'
                  >
                    Total Jasa
                  </td>
                  <td className='fw-bolder'>{`Rp. ${parseInt(
                    quotationDetail?.quotation_details
                      .filter((x: any) => x.item_type === 2)
                      .reduce((total: any, item: any) => total + parseInt(item.final_price || 0), 0)
                  ).toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td
                    colSpan={['Owner Vendor', 'Admin Vendor'].includes(userRole) ? 5 : 3}
                    className='text-end fw-bolder'
                  >
                    Total Material
                  </td>
                  <td className='fw-bolder'>{`Rp. ${parseInt(
                    quotationDetail?.quotation_details
                      .filter((x: any) => x.item_type === 1)
                      .reduce((total: any, item: any) => total + parseInt(item.final_price || 0), 0)
                  ).toLocaleString('id')}`}</td>
                </tr>

                {['Super User', 'Admin HO'].includes(userRole) && (
                  <>
                    <tr>
                      <td colSpan={3} className='text-end fw-bolder'>
                        Promosi
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
                          : `Rp. ${parseInt(
                              quotationDetail?.promotion?.promotion ?? 0
                            ).toLocaleString('id')}`}
                      </td>
                    </tr>
                  </>
                )}

                <tr>
                  <td
                    colSpan={['Owner Vendor', 'Admin Vendor'].includes(userRole) ? 5 : 3}
                    className='text-end fw-bolder'
                  >
                    Grand Total
                  </td>
                  <td className=' fw-bolder'>
                    {`Rp. ${parseInt(quotationDetail?.quotation_grand_total).toLocaleString('id')}`}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Row>

          {quotationDetail?.quotation_special === 1 && (
            <>
              <hr />

              <div className='fs-6 fw-semibold p-0 mb-2'>Preview Pembayaran</div>

              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Tahap Pembayaran</th>
                    <th>Persentase</th>
                    <th>Nominal Pembayaran</th>
                  </tr>
                </thead>

                <tbody>
                  {paymentStages.map((stage, index) => (
                    <tr key={index}>
                      <td>{stage.stage}</td>
                      <td>{stage.percentage}</td>
                      <td>{`${stage.amount.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      })}`}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {['Super User', 'Admin HO'].includes(userRole) && (
            <Row className='payment-information mb-2'>
              <div className='payment-method'>
                <div className='fs-3 fw-semibold mb-2'>
                  Silahkan melakukan pembayaran di account di bawah ini :
                </div>

                <div className='fs-4 fw-normal'>{quotationDetail?.store?.bank_account}</div>
                <div className='fs-4 fw-normal'>{quotationDetail?.store?.bank_name}</div>
                <div className='fs-4 fw-normal'>{quotationDetail?.store?.bank_number}</div>
              </div>

              <div className='payment-evidence'>
                <div className='fs-3 fw-semibold mb-2'>
                  Silahkan kirim bukti bayar anda melalui:
                </div>

                <div className='fs-4 fw-normal'>
                  {`Telp : ${
                    quotationDetail?.store?.phone_number_1 ??
                    quotationDetail?.store?.phone_number_2 ??
                    'Nomor telepon belum tersedia'
                  }`}
                </div>

                <div className='fs-4 fw-normal'>
                  {' '}
                  {`Email : ${
                    quotationDetail?.store?.email ??
                    quotationDetail?.store?.email ??
                    'Email belum tersedia'
                  }`}
                </div>

                <div className='fs-4 fw-semibold mt-2'>
                  Terima kasih telah melakukan bisnis dengan Mitra10. Kami harap kedatangan anda
                  kembali.
                </div>
              </div>
            </Row>
          )}
        </Card.Body>
      </Card>

      <Button
        className='btn-dark-primary d-flex justify-content-center align-items-center mt-5 w-100 gap-3'
        onClick={() =>
          generatePdf(quotationDetail?.order?.id, quotationDetail?.order?.members?.full_name)
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
    </section>
  )
}

export {DetailQuotationVendor}
