import React, {useState, FC, useEffect, useRef} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import {Orders} from '../../../../interfaces/order'
import './DetailOrder.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Image, Steps, Skeleton, Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, ListGroup, Button, Card, Modal} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'

interface Status {
  value: number | null
  category: string
}

interface OrderHistory {
  order_id: number
  order_status: string
  created_at: Date
  created_at_label: string
}

const DetailOrders: FC<{updatePageTitle: (order: Orders) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const pdfRef = useRef<HTMLDivElement>(null)

  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true)
  const [loadingPDF, setLoadingPDF] = useState(false)

  const [order, setOrder] = useState<Orders>({
    member_id: null,
    seles_id: null,
    store_id: null,
    project_status_id: null,
    request_survey: '',
    vendor_id: null,
    tukang_id: null,
    project_address: '',
    project_number: '',
    receipt_number: '',
    receipt_path: '',
    total_estimate_workdays: null,
    payment_type: '',
    grand_total: '',
    grand_total_comission: '',
    is_overdistance: 0,
    additional_fee: 0,
    print_counter: 0,
    created_by: null,
    updated_by: null,
    created_at: '',
    order_details: [],
    m_order_details: [],
    order_files: [],
    complaints: [],
    work_orders: {
      work_order_status: [],
    },
    quotation: [],
    order_history: null,
  })

  // Order History
  const [orderHistorical, setOrderHistorical] = useState<OrderHistory[]>([])

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
          const data = response.data.data as Orders
          setOrder(data)
          updatePageTitle(data)
          setIsLoadingPage(false)

          if (data?.order_history) {
            const orderHistory = data?.order_history.map((item: any) => ({
              order_id: item.order_id,
              order_status: item?.status?.description,
              created_at: item?.created_at,
              created_at_label: item?.created_at
                ? `${new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })} ${item.created_by ? `oleh ${item?.created_by?.username}` : ''}`
                : '-',
            }))

            setOrderHistorical(orderHistory)
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchOrderData()
  }, [])

  // Order Receipt
  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)
  const handleClose = () => setVisible(false)

  // Work Before & Work After
  const [visibleWorkBefore, setVisibleWorkBefore] = useState(false)
  const [visibleWorkAfter, setVisibleWorkAfter] = useState(false)

  // Quotation Receipt
  const [visibleQuotationReceipt, setVisibleQuotationReceipt] = useState(false)
  const [visibleQuotationFiles, setVisibleQuotationFiles] = useState(false)

  const storedStatus = sessionStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
  const getStatuses = (categories: string[]) =>
    statusData.filter((status: any) => categories.includes(status.category)).map((x) => x.value)

  // Statuses for Order Timeline
  const bookStatuses = getStatuses(['BOOK', 'BOOKED', 'PICKLIST', 'UNPAID', 'PAID'])
  const surveyStatuses = getStatuses([
    'SURVEYREQ',
    'SURVEYSTART',
    'SURVEYDONE',
    'QUOTEIN',
    'QUOTEOUT',
  ])
  const workStatuses = getStatuses(['WORKREQ', 'TUKANGWORK', 'WORKSTART'])
  const workDoneStatuses = getStatuses(['WORKEND', 'DONE'])

  const orderHistory = [
    {title: 'Booking Process', value: bookStatuses},
    {title: 'Survey Process', value: surveyStatuses},
    {title: 'Work in Progress', value: workStatuses},
    {title: 'Work Done', value: workDoneStatuses},
  ]

  // Statuses for Complaint Timeline
  const complaintReceivedStatuses = getStatuses(['INVESTIGATE'])
  const investigationProcessStatuses = getStatuses(['INVESTIGATED', 'APPROVED', 'ACCEPTED'])
  const remedialProgressStatuses = getStatuses([
    'RESURVEYREQ',
    'RESURVEYSTART',
    'REWORKREQ',
    'REWORKSTART',
  ])
  const complaintDoneStatuses = getStatuses(['RESURVEYDONE', 'REWORKEND'])

  const complaintHistory = [
    {
      title: 'Complaint Received',
      value: complaintReceivedStatuses,
    },
    {
      title: 'Investigation Proccess',
      value: investigationProcessStatuses,
    },
    {
      title: 'Remedial Progress',
      value: remedialProgressStatuses,
    },
    {
      title: 'Complaint Done',
      value: complaintDoneStatuses,
    },
  ]

  // Reprint Order
  const handleReprintOrderCS = async () => {
    await axios
      .request({
        url: `${apiUrl}/orders/${params.id}/counter`,
        method: 'post',
        maxBodyLength: Infinity,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then(() => {
        if (['PICKLIST'].includes(order?.status?.category ?? '')) {
          navigate(`/order/printout-order-picklist/${params.id}`)
        } else if (
          ['BOOK', 'BOOKED', 'SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE'].includes(
            order?.status?.category ?? ''
          )
        ) {
          navigate(`/order/printout-order-dipesan/${params.id}`)
        }
      })
      .catch((error) => {
        console.error(error)

        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
        })
      })
  }

  // Export PDF Quotation
  const exportToPDF = (order_id: number) => {
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
        link.setAttribute('download', `Quotation - Order ID ${order_id}.pdf`)
        document.body.appendChild(link)
        link.click()
      })
      .catch((error: any) => {
        Swal.fire('Error', 'Terjadi kesalahan saat mengekspor data', 'error')
      })
  }

  // Order History
  const columns: ColumnsType<OrderHistory> = [
    {
      title: 'ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'order_status',
      key: 'order_status',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.order_status.includes(String(value)),
      sorter: (a, b) => a.order_status.length - b.order_status.length,
    },
    {
      title: 'Terakhir Update Order',
      dataIndex: 'created_at_label',
      key: 'created_at_label',
      align: 'center',
      width: 110,
    },
  ]

  const generatePdf = (order_id: any, receipt_quotation: any, customer_name: any) => {
    setLoadingPDF(true)

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
        link.setAttribute(
          'download',
          `Quotation ${
            receipt_quotation === null ? 'Belum Dibayar' : 'Sudah Dibayar'
          } - ${customer_name} - Order ID ${order_id}.pdf`
        )
        document.body.appendChild(link)
        link.click()

        setLoadingPDF(false)
      })
      .catch((error: any) => {
        setLoadingPDF(false)
        Swal.fire('Error', 'Terjadi kesalahan saat mengekspor data', 'error')
      })
  }

  return (
    <section id='detail-order'>
      {['QUOTEOUT'].includes(order?.status?.category ?? '') && (
        <Row className='d-flex justify-content-end mb-3'>
          <Button
            className='btn-dark-primary d-flex justify-content-center align-items-center w-100 gap-3'
            disabled={loadingPDF}
            onClick={() =>
              generatePdf(
                order?.id,
                order?.quotation[0]?.receipt_quotation,
                order?.members?.full_name
              )
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
        </Row>
      )}

      <Card>
        <Card.Body>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
                  <Form.Label className='fs-4 fw-bold'>
                    Nama Toko :{' '}
                    <span className='fs-4 ms-2 fw-normal'>{order?.store?.store_name ?? ''}</span>
                  </Form.Label>
                </Skeleton>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
                  <Form.Label className='fs-4 fw-bold'>
                    Order ID : <span className='fs-4 ms-2 fw-normal'>{order?.id}</span>
                  </Form.Label>
                </Skeleton>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Col>
                  <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
                    <Form.Label className='fs-4 fw-bold'>
                      Receipt Number :
                      <span className='fs-4 ms-2 fw-normal'>{order?.receipt_number ?? '-'}</span>
                    </Form.Label>

                    {order?.quotation[0]?.receipt_quotation && (
                      <Form.Label className='fs-4 fw-bold'>
                        Receipt Quotation :
                        <span className='fs-4 ms-2 fw-normal'>
                          {order?.quotation[0]?.receipt_quotation ?? '-'}
                        </span>
                      </Form.Label>
                    )}
                  </Skeleton>
                </Col>

                <Col>
                  <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
                    <Form.Label className='fs-4 fw-bold'>
                      Order Status :
                      <span className='fs-4 ms-2 fw-bold text-success'>
                        {(() => {
                          if (order?.work_orders?.work_order_status?.length >= 0) {
                            if (
                              [
                                'QUOTEIN',
                                'QUOTEOUT',
                                'CANCEL',
                                'WARRANTYCLAIM',
                                'INVESTIGATED',
                                'COMPLAINTAPPROVEDBYHO',
                                'COMPLAINTREJECTEDBYHO',
                                'RESCHEDULE',
                                'RESURVEYREQ',
                                'REWORKREQ',
                              ].includes(order?.status?.category ?? '')
                            ) {
                              return order?.status?.description
                            } else if (
                              ['WORKREQ'].includes(order?.status?.category ?? '') &&
                              order?.payment_type === 'survey' &&
                              !['WORKSTART', 'WORKEND'].includes(
                                order?.work_orders?.work_order_status[0]?.status?.category ?? ''
                              )
                            ) {
                              return order?.status?.description
                            } else {
                              return order?.work_orders?.work_order_status[0]?.status?.description
                            }
                          } else {
                            return order?.status?.description
                          }
                        })()}
                      </span>
                    </Form.Label>
                  </Skeleton>
                </Col>
              </Col>
            </Row>

            <Row className='information-detail'>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='costumer-info mb-5'>
                <Skeleton active loading={isLoadingPage} paragraph={{rows: 3}}>
                  <div className='fs-3 fw-bold'>Informasi Pembeli</div>

                  <Row>
                    <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='6'>
                          No Member :
                        </Form.Label>
                        <Col sm='6'>
                          <p className='fs-7'>{order?.members?.member_number}</p>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='6'>
                          Customer Name :
                        </Form.Label>
                        <Col sm='6'>
                          <p className='fs-7'>{order?.members?.full_name}</p>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='6'>
                          Alamat Pemasangan :
                        </Form.Label>
                        <Col sm='6'>
                          <p className='fs-7'>{order?.project_address}</p>
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='5'>
                          Nomor Whatsapp :
                        </Form.Label>
                        <Col sm='7'>
                          <p className='fs-7'>
                            {!order?.project_number.startsWith('0')
                              ? `+62${order?.members?.whatsapp_number}`
                              : '-'}
                          </p>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='5'>
                          Nomor Telepon :
                        </Form.Label>
                        <Col sm='7'>
                          <p className='fs-7'>
                            {order?.project_number.startsWith('0')
                              ? order?.members?.phone_number
                              : '-'}
                          </p>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='5'>
                          Alamat Email :
                        </Form.Label>
                        <Col sm='7'>
                          <p className='fs-7'>{order?.members?.email} </p>
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                </Skeleton>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='sales-info mb-5'>
                <Skeleton active loading={isLoadingPage} paragraph={{rows: 3}}>
                  <div className='fs-3 fw-bold'>Informasi Penjual</div>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='3'>
                      Sales ID :
                    </Form.Label>
                    <Col sm='9'>
                      <p className='fs-7'>{order?.sales?.id} </p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='3'>
                      Sales Person :
                    </Form.Label>
                    <Col sm='9'>
                      <p className='fs-7'>{order?.sales?.full_name} </p>
                    </Col>
                  </Form.Group>
                </Skeleton>
              </Col>
            </Row>
          </div>

          <Row className='table-warranty d-flex align-items-center mb-5'>
            <div className='table-title-warranty'>
              <Skeleton active loading={isLoadingPage} paragraph={{rows: 2}}>
                <div className='fs-3 fw-bold'>Informasi Pemasangan</div>

                <Row>
                  <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                    <Form.Label column>
                      {order?.payment_type === 'survey'
                        ? 'Tanggal request survey :'
                        : 'Tanggal request pemasangan :'}
                    </Form.Label>
                    <Col>
                      <p className='fs-7 p-0'>
                        {new Date(order?.request_survey).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                    <Form.Label column>Informasi Vendor Pemasangan :</Form.Label>
                    <Col>
                      <p className='fs-7 p-0'>{order?.vendor?.company_name ?? '-'}</p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                    <Form.Label column>Payment Type:</Form.Label>
                    <Col>
                      <p className='fs-7 p-0'>
                        {(() => {
                          if (order?.payment_type === 'survey') {
                            return `Berbayar & Survey`
                          } else if (order?.payment_type === 'gratis') {
                            return `Gratis`
                          } else if (order?.payment_type === 'pemasangan_tanpa_survey') {
                            return `Berbayar & Pemasangan Tanpa Survey`
                          } else {
                            return ``
                          }
                        })()}
                      </p>
                    </Col>
                  </Form.Group>
                </Row>
              </Skeleton>
            </div>

            <Skeleton active loading={isLoadingPage} paragraph={{rows: 3}}>
              {(() => {
                if (
                  (order?.payment_type === 'survey' &&
                    order?.work_orders === null &&
                    order?.quotation?.length === 0) ||
                  (order?.work_orders?.work_order_status[0]?.work_order_items.length === 0 &&
                    order?.payment_type === 'survey' &&
                    order?.quotation?.length === 0)
                ) {
                  return (
                    <div className='table-warranty-content'>
                      {order?.is_overdistance === 1 && (
                        <>
                          <Form.Text className='fs-8 text-dark'>
                            *Order ini lebih dari{' '}
                            <span className='fw-bolder text-decoration-underline'>10 KM</span> dari
                            toko sehingga dikenakan biaya tambahan
                          </Form.Text>
                        </>
                      )}

                      <table className='table hover responsive'>
                        <thead className='table-warranty-head'>
                          <tr>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Nama Pemasangan</th>
                            <th>QTY Pemasangan</th>
                          </tr>
                        </thead>

                        <tbody>
                          {order?.order_details.map((item: any, index: any) => (
                            <>
                              <tr key={`${index} - order_detail`}>
                                <td>{item?.item_code}</td>
                                <td>{item?.item_name}</td>
                                <td>{item?.item_notes}</td>
                                <td>{item?.quantity ?? 0}</td>
                              </tr>
                            </>
                          ))}

                          <tr>
                            <td colSpan={3} className='text-end fw-bolder'>
                              Biaya Survey
                            </td>

                            <td className=' fw-bolder'>Rp. 99.000</td>
                          </tr>

                          {order?.is_overdistance === 1 && (
                            <>
                              <tr>
                                <td colSpan={3} className='text-end fw-bolder align-middle'>
                                  Biaya Tambahan
                                </td>

                                <td className=' fw-bolder'>{`Rp. ${Number(
                                  order?.additional_fee
                                ).toLocaleString('id')}`}</td>
                              </tr>

                              <tr>
                                <td colSpan={3} className='text-end fw-bolder'>
                                  Grand Total
                                </td>

                                <td className=' fw-bolder'>{`Rp. ${Number(
                                  order?.grand_total
                                ).toLocaleString('id')}`}</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )
                } else if (
                  ['SURVEYREQ', 'TUKANGSURVEY', 'SURVEYSTART', 'SURVEYDONE'].includes(
                    order?.work_orders?.work_order_status[0]?.status?.category
                  ) &&
                  order?.payment_type === 'survey' &&
                  order?.work_orders?.work_order_status[0]?.work_order_items.length >= 1 &&
                  order?.quotation?.length === 0
                ) {
                  return (
                    <div className='table-warranty-content'>
                      <table className='table hover responsive'>
                        <thead className='table-warranty-head'>
                          <tr>
                            <th>Nama Pemasangan</th>
                            <th>QTY Pemasangan</th>
                            <th>Satuan</th>
                          </tr>
                        </thead>

                        <tbody>
                          {order?.work_orders?.work_order_status[0]?.work_order_items.length ? (
                            order.work_orders.work_order_status[0].work_order_items.map(
                              (item: any, index: any) => (
                                <tr key={`${index}-work_order_detail`}>
                                  <td>
                                    {item.name ?? ''}{' '}
                                    {item.is_customer ? '( Disediakan oleh customer )' : ''}
                                  </td>
                                  <td>{item.quantity ?? 0}</td>
                                  <td>{item.unit ?? ''}</td>
                                </tr>
                              )
                            )
                          ) : (
                            <tr>
                              <td>Item belum diset oleh Tukang/Vendor</td>
                              <td>Quantity belum diset oleh Tukang/Vendor</td>
                              <td>Satuan belum diset oleh Tukang/Vendor</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )
                } else if (order?.quotation?.length >= 1 && order?.payment_type === 'survey') {
                  return (
                    <div className='table-warranty-content'>
                      <table className='table hover responsive'>
                        <thead className='table-warranty-head'>
                          <tr>
                            <th className='text-center' style={{width: '355px'}}>
                              Jenis Jasa
                            </th>

                            <th className='text-center' style={{width: '100px'}}>
                              QTY
                            </th>

                            <th className='text-center' style={{width: '250px'}}>
                              Satuan
                            </th>

                            <th className='text-center' style={{width: '250px'}}>
                              Final Price
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {order?.quotation[0]?.quotation_details
                            .filter((x: any) => x.item_type === 2)
                            .map((item: any, index: any) => (
                              <tr key={`${index}-quotation`}>
                                <td>
                                  {item?.name ?? '-'}{' '}
                                  {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                                </td>
                                <td>{item?.quantity ?? 0}</td>
                                <td>{item?.unit}</td>
                                <td>{`Rp. ${parseInt(item?.final_price ?? 0).toLocaleString(
                                  'id'
                                )}`}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>

                      <table className='table hover responsive'>
                        <thead className='table-warranty-head'>
                          <tr>
                            <th className='text-center' style={{width: '355px'}}>
                              Material Yang Dibutuhkan
                            </th>

                            <th className='text-center' style={{width: '100px'}}>
                              QTY
                            </th>

                            <th className='text-center' style={{width: '250px'}}>
                              Satuan
                            </th>

                            <th className='text-center' style={{width: '250px'}}>
                              Final Price
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {order?.quotation[0]?.quotation_details
                            .filter((x: any) => x.item_type === 1)
                            .map((item: any, index: any) => (
                              <tr key={`${index}-quotation`}>
                                <td>
                                  {item?.name ?? '-'}{' '}
                                  {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                                </td>
                                <td>{item?.quantity ?? 0}</td>
                                <td>{item?.unit ?? '-'}</td>
                                <td>{`Rp. ${parseInt(item?.final_price ?? 0).toLocaleString(
                                  'id'
                                )}`}</td>
                              </tr>
                            ))}

                          <tr>
                            <td colSpan={3} className='text-end fw-bolder'>
                              Total Jasa
                            </td>
                            <td className='fw-bolder'>{`Rp. ${parseInt(
                              order?.quotation[0]?.quotation_details
                                .filter((x: any) => x.item_type === 2)
                                .reduce(
                                  (total: any, item: any) =>
                                    total + parseInt(item.final_price || 0),
                                  0
                                )
                            ).toLocaleString('id')}`}</td>
                          </tr>

                          <tr>
                            <td colSpan={3} className='text-end fw-bolder'>
                              Total Material
                            </td>
                            <td className='fw-bolder'>{`Rp. ${parseInt(
                              order?.quotation[0]?.quotation_details
                                .filter((x: any) => x.item_type === 1)
                                .reduce(
                                  (total: any, item: any) =>
                                    total + parseInt(item.final_price || 0),
                                  0
                                )
                            ).toLocaleString('id')}`}</td>
                          </tr>

                          <tr>
                            <td colSpan={3} className='text-end fw-bolder'>
                              Promosi
                            </td>
                            <td className=' fw-bolder'>
                              {`Rp. ${parseInt(
                                order?.quotation[0]?.quotation_disc ?? 0
                              ).toLocaleString('id')}`}
                            </td>
                          </tr>

                          <tr>
                            <td colSpan={3} className='text-end fw-bolder'>
                              {`${
                                order?.quotation[0]?.promotion
                                  ? `Additional Promotion (${order?.quotation[0]?.promotion?.name})`
                                  : `Additional Promotion`
                              }`}
                            </td>

                            <td className=' fw-bolder'>
                              {order?.quotation[0]?.promotion?.promotion_type === 1
                                ? `${order?.quotation[0]?.promotion?.promotion} %`
                                : `Rp. ${parseInt(
                                    order?.quotation[0]?.promotion?.promotion ?? 0
                                  ).toLocaleString('id')}`}
                            </td>
                          </tr>

                          <tr>
                            <td colSpan={3} className='text-end fw-bolder'>
                              Grand Total
                            </td>
                            <td className=' fw-bolder'>
                              {`Rp. ${parseInt(
                                order?.quotation[0]?.quotation_grand_total ?? 0
                              ).toLocaleString('id')}`}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )
                } else if (
                  order?.payment_type === 'gratis' ||
                  order?.payment_type === 'pemasangan_tanpa_survey'
                ) {
                  return (
                    <div className='table-warranty-content'>
                      {order?.is_overdistance === 1 && (
                        <>
                          <Form.Text className='fs-8 text-dark'>
                            *Order ini lebih dari{' '}
                            <span className='fw-bolder text-decoration-underline'>10 KM</span> dari
                            toko sehingga dikenakan biaya tambahan
                          </Form.Text>
                        </>
                      )}

                      <table className='table hover responsive'>
                        <thead className='table-warranty-head'>
                          <tr>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Nama Pemasangan</th>
                            <th>QTY Pemasangan</th>
                            {!(order?.payment_type === 'gratis') && (
                              <>
                                <th>Harga Jasa</th>
                                <th>Jumlah</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {order?.order_details.map((item: any, index: any) => (
                            <>
                              <tr key={`${index} - order_detail`}>
                                <td>{item?.item_code}</td>
                                <td>{item?.item_name}</td>
                                <td>{item?.item?.service_name}</td>
                                <td>{item?.quantity ?? 0}</td>
                                {!(order?.payment_type === 'gratis') && (
                                  <>
                                    <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString(
                                      'id'
                                    )}`}</td>
                                    <td>{`Rp. ${parseInt(item?.total || 0).toLocaleString(
                                      'id'
                                    )}`}</td>
                                  </>
                                )}
                              </tr>
                            </>
                          ))}

                          {order?.is_overdistance === 1 && (
                            <>
                              <tr>
                                <td
                                  colSpan={order?.payment_type !== 'gratis' ? 5 : 3}
                                  className='text-end fw-bolder align-middle'
                                >
                                  Biaya Tambahan
                                </td>

                                <td className=' fw-bolder'>{`Rp. ${Number(
                                  order?.additional_fee
                                ).toLocaleString('id')}`}</td>
                              </tr>
                            </>
                          )}

                          <tr>
                            <td
                              colSpan={order?.payment_type !== 'gratis' ? 5 : 3}
                              className='text-end fw-bolder'
                            >
                              Grand Total
                            </td>

                            <td className=' fw-bolder'>{`Rp. ${Number(
                              order?.grand_total
                            ).toLocaleString('id')}`}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )
                }
              })()}
            </Skeleton>
          </Row>

          <Row>
            <Col>
              <Skeleton active loading={isLoadingPage} paragraph={{rows: 3}}>
                <Row className='information-detail'>
                  <div className='fs-3 fw-bold'>Informasi Survei Yang Dilakukan Oleh Vendor</div>

                  <div className='survey'>
                    <div className='detail-info mb-3'>
                      <p className='fs-5 fw-bold'>Survey dikerjakan pada:</p>

                      <p className='fs-7 p-0'>
                        {order?.payment_type === 'survey' ? (
                          <>
                            {order?.work_orders?.work_order_status.length ? (
                              <p className='fs-7'>
                                Tanggal :{' '}
                                {new Date(order?.work_orders?.survey_date).toLocaleDateString(
                                  'id-ID',
                                  {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  }
                                )}
                              </p>
                            ) : (
                              <p className='fs-7'>Jadwal belum ditentukan oleh vendor</p>
                            )}
                          </>
                        ) : (
                          <p className='fs-7'>Order ini tanpa survey</p>
                        )}
                      </p>
                    </div>

                    <div className='detail-info mb-3'>
                      <p className='fs-5 fw-bold'>Oleh:</p>

                      {order?.payment_type === 'survey' ? (
                        <>
                          {order?.work_orders?.work_order_status.length ? (
                            <p className='fs-7'>
                              {order?.work_orders?.work_order_tukang
                                .filter((x: any) => x.type === 1)
                                .map((item: any) => item?.tukang?.full_name)
                                .join(', ')}
                            </p>
                          ) : (
                            <p className='fs-7'>Jadwal belum ditentukan oleh vendor</p>
                          )}
                        </>
                      ) : (
                        <p className='fs-7'>Order ini tanpa survey</p>
                      )}
                    </div>
                  </div>
                </Row>
              </Skeleton>
            </Col>

            <Col>
              <Skeleton active loading={isLoadingPage} paragraph={{rows: 3}}>
                <Row className='information-detail'>
                  <div className='fs-3 fw-bold'>
                    Informasi Pengerjaan Yang Dilakukan Oleh Vendor
                  </div>

                  <div className='work-date'>
                    <p className='fs-5 fw-bold'>Pekerjaan dilakukan pada:</p>

                    <div className='detail-info mb-3'>
                      {order?.work_orders !== null &&
                      order?.work_orders?.work_start_date !== null ? (
                        <div>
                          <p className='fs-7'>
                            MULAI{' '}
                            <span className='ms-5'>
                              {new Date(order?.work_orders?.work_start_date).toLocaleDateString(
                                'id-ID',
                                {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                }
                              )}
                            </span>
                          </p>

                          <p className='fs-7'>
                            SELESAI{' '}
                            <span className='ms-3'>
                              {new Date(order?.work_orders?.work_end_date).toLocaleDateString(
                                'id-ID',
                                {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                }
                              )}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <p className='fs-7'>Jadwal belum ditentukan oleh vendor</p>
                      )}
                    </div>

                    <div className='detail-info mb-3'>
                      <p className='fs-5 fw-bold'>Oleh:</p>

                      {order?.work_orders?.work_order_tukang?.filter((x: any) => x.type === 2)
                        ?.length ? (
                        <p className='fs-7'>
                          {order?.work_orders?.work_order_tukang
                            ?.filter((x: any) => x.type === 2)
                            ?.map((item: any) => item?.tukang?.full_name)
                            .join(', ')}
                        </p>
                      ) : (
                        <p className='fs-7'>Tukang belum diset oleh vendor</p>
                      )}
                    </div>
                  </div>
                </Row>
              </Skeleton>
            </Col>
          </Row>

          {order?.order_files.length >= 1 ? (
            <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
                  <Form.Label className='mt-3'>Bukti Receipt :</Form.Label>
                  <ListGroup>
                    {order?.order_files.map((item: any) => (
                      <ListGroup.Item
                        key={item.id}
                        action
                        style={{cursor: 'pointer'}}
                        onClick={() => {
                          setPreviewImage(item.path)
                          setVisible(true)
                        }}
                      >
                        {item.path}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  {previewImage && (
                    <div>
                      {previewImage.endsWith('.pdf') ? (
                        <>
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
                                src={`${apiUrl}/public/receipt/${previewImage}`}
                                style={{border: 'none'}}
                              />
                            </Modal.Body>
                          </Modal>
                        </>
                      ) : (
                        <Image
                          key={previewImage}
                          width={200}
                          style={{display: 'none'}}
                          src={`${apiUrl}/public/receipt/${previewImage}`}
                          preview={{
                            visible,
                            src: `${apiUrl}/public/receipt/${previewImage}`,
                            onVisibleChange: (value) => {
                              setVisible(value)
                            },
                          }}
                        />
                      )}
                    </div>
                  )}
                </Skeleton>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='mt-3'>Bukti Receipt Quotation :</Form.Label>
                <ListGroup>
                  {order?.quotation[0]?.quotation_files
                    .filter((x: any) => x.type === 2)
                    .map((item: any) => (
                      <ListGroup.Item
                        key={item.id}
                        action
                        style={{cursor: 'pointer'}}
                        onClick={() => {
                          setPreviewImage(item.path)
                          setVisibleQuotationReceipt(true)
                        }}
                      >
                        {item.path}
                      </ListGroup.Item>
                    ))}
                </ListGroup>

                {order?.quotation[0]?.quotation_files.length ? (
                  <>
                    {previewImage && (
                      <div>
                        <Image
                          key={previewImage}
                          width={200}
                          style={{display: 'none'}}
                          src={`${apiUrl}/public/quotation/${previewImage}`}
                          preview={{
                            visible: visibleQuotationReceipt,
                            src: `${apiUrl}/public/quotation/${previewImage}`,
                            onVisibleChange: (value) => {
                              setVisibleQuotationReceipt(value)
                            },
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className='d-flex justify-content-start align-items-center'>
                    <p className='fs-7 text-danger'>Pembayaran belum diverifikasi oleh Toko</p>
                  </div>
                )}
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='mt-3'>Bukti Transfer Quotation :</Form.Label>
                <ListGroup>
                  {order?.quotation[0]?.quotation_files
                    .filter((x: any) => x.type === 1)
                    .map((item: any) => (
                      <ListGroup.Item
                        key={item.id}
                        action
                        style={{cursor: 'pointer'}}
                        onClick={() => {
                          setPreviewImage(item.path)
                          setVisibleQuotationFiles(true)
                        }}
                      >
                        {item.path}
                      </ListGroup.Item>
                    ))}
                </ListGroup>

                {order?.quotation[0]?.quotation_files.length ? (
                  <>
                    {previewImage && (
                      <div>
                        <Image
                          key={previewImage}
                          width={200}
                          style={{display: 'none'}}
                          src={`${apiUrl}/public/quotation/${previewImage}`}
                          preview={{
                            visible: visibleQuotationFiles,
                            src: `${apiUrl}/public/quotation/${previewImage}`,
                            onVisibleChange: (value) => {
                              setVisibleQuotationFiles(value)
                            },
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className='d-flex justify-content-start align-items-center'>
                    <p className='fs-7 text-danger'>Pembayaran belum diverifikasi oleh Toko</p>
                  </div>
                )}
              </Col>
            </Row>
          ) : (
            <></>
          )}

          <Skeleton active loading={isLoadingPage}>
            {order?.work_orders?.work_order_evidences?.length > 0 ? (
              <Row>
                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Label className='mt-3'>Work Before :</Form.Label>
                  <ListGroup>
                    {order?.work_orders?.work_order_evidences
                      .filter((x: any) => x.type === 2)
                      .map((item: any) => (
                        <ListGroup.Item
                          key={item.id}
                          action
                          style={{cursor: 'pointer'}}
                          onClick={() => {
                            setPreviewImage(item.evidence_location)
                            setVisibleWorkBefore(true)
                          }}
                        >
                          {item.evidence_location}
                        </ListGroup.Item>
                      ))}
                  </ListGroup>

                  {order?.work_orders?.work_order_evidences?.filter((x: any) => x.type === 2)
                    .length ? (
                    <>
                      {previewImage && (
                        <div>
                          <Image
                            key={previewImage}
                            width={200}
                            style={{display: 'none'}}
                            src={`${apiUrl}/public/work-orders/${previewImage}`}
                            preview={{
                              visible: visibleWorkBefore,
                              src: `${apiUrl}/public/work-orders/${previewImage}`,
                              onVisibleChange: (value) => {
                                setVisibleWorkBefore(value)
                              },
                            }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className='d-flex justify-content-start align-items-center'>
                      <p className='fs-7 text-danger'>Foto belum diupload oleh Tukang</p>
                    </div>
                  )}
                </Col>

                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Label className='mt-3'>Work After :</Form.Label>
                  <ListGroup>
                    {order?.work_orders?.work_order_evidences
                      .filter((x: any) => x.type === 3)
                      .map((item: any) => (
                        <ListGroup.Item
                          key={item.id}
                          action
                          style={{cursor: 'pointer'}}
                          onClick={() => {
                            setPreviewImage(item.evidence_location)
                            setVisibleWorkAfter(true)
                          }}
                        >
                          {item.evidence_location}
                        </ListGroup.Item>
                      ))}
                  </ListGroup>

                  {order?.work_orders?.work_order_evidences?.filter((x: any) => x.type === 3)
                    .length ? (
                    <>
                      {previewImage && (
                        <div>
                          <Image
                            key={previewImage}
                            width={200}
                            style={{display: 'none'}}
                            src={`${apiUrl}/public/work-orders/${previewImage}`}
                            preview={{
                              visible: visibleWorkAfter,
                              src: `${apiUrl}/public/work-orders/${previewImage}`,
                              onVisibleChange: (value) => {
                                setVisibleWorkAfter(value)
                              },
                            }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className='d-flex justify-content-start align-items-center'>
                      <p className='fs-7 text-danger'>Foto belum diupload oleh Tukang</p>
                    </div>
                  )}
                </Col>
              </Row>
            ) : (
              <></>
            )}
          </Skeleton>

          <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
            <div className='order-history mt-3 mb-3'>
              <div className='fs-3 fw-bold text-success mb-4'>Order History</div>
              <Steps
                className='order-history-timeline'
                current={orderHistory.findIndex((step) =>
                  step.value.includes(
                    order?.work_orders?.work_order_status.length > 0
                      ? order?.work_orders?.work_order_status[0]?.status?.id
                      : order?.project_status_id
                  )
                )}
                labelPlacement='vertical'
                items={orderHistory}
              />
            </div>

            {order?.complaints && order?.complaints?.length >= 1 && (
              <div className='complaint-history  mt-3 mb-3'>
                <div className='fs-3 fw-bold text-danger mb-4'>Complaint History</div>
                <Steps
                  className='complaint-history-timeline'
                  current={complaintHistory.findIndex((step) =>
                    step.value.includes(order?.complaints?.[0]?.complaint_status ?? 0)
                  )}
                  labelPlacement='vertical'
                  items={complaintHistory}
                />
              </div>
            )}

            {order?.print_counter >= 1 &&
              ['PICKLIST', 'BOOK', 'BOOKED', 'SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE'].includes(
                order?.status?.category ?? ''
              ) && (
                <div className='d-flex justify-content-center align-items-center'>
                  <Button type='submit' onClick={handleReprintOrderCS} variant='warning'>
                    Reprint Order
                  </Button>
                </div>
              )}
          </Skeleton>
        </Card.Body>
      </Card>

      <Card className='mt-5'>
        <Card.Body>
          <div className='work-order-history'>
            <h1 className='title fw-bold mb-5'>Order History</h1>

            <Table
              className='table-striped-rows'
              bordered
              columns={columns}
              dataSource={orderHistorical}
              rowKey={(record) => record.order_id}
              pagination={false}
            />
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {DetailOrders}
