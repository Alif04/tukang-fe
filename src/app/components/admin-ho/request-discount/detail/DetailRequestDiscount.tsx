import React, {FC, useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import {formatDate, formatDateWithTime, toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './DetailRequestDiscount.css'

import axios from 'axios'
import {Image} from 'antd'
import {Modal, ListGroup, Table, Row, Col, Card, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'

const DetailRequestDiscountHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const userRole = localStorage.getItem('userRole') as string

  // Loader
  const [loadingPDF, setLoadingPDF] = useState<boolean>(false)
  const [loadingTemplate, setLoadingTemplate] = useState<boolean>(false)

  // Incentive Sales
  const [requestDiscountDetail, setRequestDiscountDetail] = useState<any>()
  const [quotationID, setQuotationID] = useState<any>()
  const [quotationDetail, setQuotationDetail] = useState<any>()
  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)
  const handleClose = () => setVisible(false)

  const getIncentiveData = async () => {
    try {
      await axios
        .get(`${apiUrl}/quotation-promotion/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data
          setQuotationID(data.quotation_id)
          setRequestDiscountDetail(data)
        })
    } catch (error) {
      console.error(error)
    }
  }

  const getDetailQuotation = async () => {
    try {
      await axios
        .get(`${apiUrl}/quotation/${quotationID}`, {
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
    getIncentiveData()
  }, [])

  useEffect(() => {
    getDetailQuotation()
  }, [quotationID])

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

  // Generate PDF
  const generatePDF = () => {
    setLoadingPDF(true)
    axios
      .get(`${apiUrl}/quotation-promotion/${params.id}/pdf`, {
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
          `Insentif ID ${params.id} - ${formatDateWithTime(new Date())}.pdf`
        )
        document.body.appendChild(link)
        link.click()
      })
      .finally(() => {
        setLoadingPDF(false)
      })
  }

  // Export Excel
  const exportExcel = () => {
    setLoadingTemplate(true)

    axios
      .get(`${apiUrl}/quotation-promotion/${params.id}/export-excel`, {
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
          `Pengajuan Insentif ID ${params.id} - ${formatDateWithTime(new Date())}.xlsx`
        )
        document.body.appendChild(link)
        link.click()

        setLoadingTemplate(false)
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

  return (
    <section id='detail-quotation'>
      <Card>
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
              <h1 className='fw-bolder mb-3'>PENGAJUAN</h1>

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
                <div className='fs-2 fw-semibold'>Informasi Konsumen :</div>
                <div className='fs-4 fw-normal'>{quotationDetail?.order?.members?.full_name}</div>
                <div className='fs-4 fw-normal'>{quotationDetail?.order?.project_address}</div>
                <div className='fs-4 fw-normal'>
                  Telp : {quotationDetail?.order?.project_number}
                </div>
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

                <div className='fs-4 fw-semibold'>
                  Alasan Pengajuan :{' '}
                  <span className='fs-4 fw-normal'>{requestDiscountDetail?.description ?? ''}</span>
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
                {quotationDetail?.quotation?.quotation_details
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
                      ?.filter((x: any) => x.item_type === 2)
                      ?.reduce(
                        (total: any, item: any) => total + parseInt(item.final_price || 0),
                        0
                      )
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
                      ?.filter((x: any) => x.item_type === 1)
                      ?.reduce(
                        (total: any, item: any) => total + parseInt(item.final_price || 0),
                        0
                      )
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
                    Total Sebelum Pengajuan Diskon
                  </td>
                  <td className=' fw-bolder'>
                    {`Rp. ${parseInt(quotationDetail?.quotation_grand_total).toLocaleString('id')}`}
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan={['Owner Vendor', 'Admin Vendor'].includes(userRole) ? 5 : 3}
                    className='text-end fw-bolder'
                  >
                    Nominal Pengajuan Diskon
                  </td>
                  <td className=' fw-bolder'>
                    {`Rp. ${parseInt(requestDiscountDetail?.promotion_nominal).toLocaleString(
                      'id'
                    )}`}
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan={['Owner Vendor', 'Admin Vendor'].includes(userRole) ? 5 : 3}
                    className='text-end fw-bolder'
                  >
                    Grand Total
                  </td>
                  <td className=' fw-bolder'>
                    {`Rp. ${(
                      Number(quotationDetail?.quotation_grand_total || 0) -
                      Number(requestDiscountDetail?.promotion_nominal || 0)
                    ).toLocaleString('id')}`}
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
        </Card.Body>
      </Card>

      <Card className='mt-5'>
        <Card.Header>
          <Card.Title>File Bukti Persetujuan</Card.Title>
        </Card.Header>

        <Card.Body>
          <Row>
            <Col>
              <ListGroup>
                {quotationDetail?.comission_sales_incentive_evidence?.map((item: any) => (
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

              {quotationDetail?.comission_sales_incentive_evidence?.length ? (
                <>
                  {previewImage && (
                    <div>
                      {previewImage.endsWith('.pdf') ? (
                        <div>
                          <Modal
                            dialogClassName='modal-show-pdf'
                            centered
                            show={visible}
                            onHide={handleClose}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>File - {previewImage}</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                              <iframe
                                key={previewImage}
                                width='100%'
                                height='100%'
                                src={`${apiUrl}/public/comission_sales_incentive/${previewImage}`}
                                style={{border: 'none'}}
                              />
                            </Modal.Body>
                          </Modal>
                        </div>
                      ) : (
                        <Image
                          key={previewImage}
                          width={200}
                          style={{display: 'none'}}
                          src={`${apiUrl}/public/comission_sales_incentive/${previewImage}`}
                          preview={{
                            visible: visible,
                            src: `${apiUrl}/public/comission_sales_incentive/${previewImage}`,
                            onVisibleChange: (value) => {
                              setVisible(value)
                            },
                          }}
                        />
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className='d-flex justify-content-start align-items-center'>
                  <p className='fs-7 text-danger'>Belum ada file persetujuan</p>
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
          onClick={() => exportExcel()}
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
          onClick={() => generatePDF()}
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

export {DetailRequestDiscountHO}
