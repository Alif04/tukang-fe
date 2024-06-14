import React, {useState, FC, useEffect} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import {Header} from '../../../_metronic/layout/components/header/Header'
import {Topbar} from '../../../_metronic/layout/components/header/Topbar'
import {useLayout} from '../../../_metronic/layout/core'

import './DetailOrderWithoutAuth.css'

import {Orders} from '../../interfaces/order'

// External Components
import axios from 'axios'
import clsx from 'clsx'
import {useLocation, Link, useNavigate} from 'react-router-dom'
import {Image, Steps} from 'antd'
import {Row, Col, Form, ListGroup, Table} from 'react-bootstrap'

interface Status {
  value: number | null
  category: string
}

const DetailOrderWithoutAuth = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const orderId = queryParams.get('order_id')
  const phoneNumber = queryParams.get('phone_number')
  const emailMember = queryParams.get('email_member')
  const memberNumber = queryParams.get('member_number')

  const {config, classes, attributes} = useLayout()
  const {header, aside} = config
  const [order, setOrder] = useState<Orders>({
    id: null,
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
  })

  const trackingOrderData = async (
    orderId: string | null,
    phoneNumbers: string | null,
    emailMembers: string | null,
    memberNumbers: string | null
  ) => {
    const queryPhoneNumber = phoneNumber ? `&phone_number=${phoneNumbers}` : ``
    const queryEmailMember = emailMember ? `&email_member=${emailMembers}` : ``
    const queryMemberNumber = memberNumber ? `&member_number=${memberNumbers}` : ``

    try {
      await axios
        .get(
          `${apiUrl}/orders/data?order_id=${orderId}${queryPhoneNumber}${queryEmailMember}${queryMemberNumber}`,
          {
            headers: {
              Accept: 'application/json',
            },
          }
        )
        .then((response) => {
          const data = response.data.data as Orders
          setOrder(data)
        })
    } catch (error: any) {
      if (error.response.data.status === 400 || error.response.data.status === 404) {
        navigate('/error')
      }
    }
  }

  useEffect(() => {
    if (orderId || phoneNumber || emailMember || memberNumber) {
      trackingOrderData(orderId, phoneNumber, emailMember, memberNumber)
    }
  }, [orderId, phoneNumber, emailMember, memberNumber])

  const [status, setStatus] = useState<Status[]>([])

  // Get Status
  const getStatus = async () => {
    try {
      const response = await axios.get(`${apiUrl}/status?take=0`, {
        headers: {
          Accept: 'application/json',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempStatus = response.data.data.map((item: any) => ({
          value: item.id,
          category: item.category,
        }))

        setStatus(tempStatus)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    getStatus()
  }, [])

  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const statusData: Status[] = status
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
  const workStatuses = getStatuses(['WORKREQ', 'WORKSTART', 'WIP'])
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

  // Grand Total Order
  const calculateTotal = (orderDetail: any) => {
    const {payment_type, is_overdistance, grand_total, additional_fee} = orderDetail ?? {}

    let totalAmount = 0

    if (payment_type === 'gratis') {
      totalAmount = is_overdistance === 1 ? Number(grand_total) + Number(additional_fee) : 0
    } else if (payment_type === 'pemasangan_tanpa_survey') {
      totalAmount =
        is_overdistance === 1 ? Number(grand_total) + Number(additional_fee) : grand_total ?? 0
    } else if (payment_type === 'survey') {
      totalAmount = is_overdistance === 1 ? Number(99000) + Number(additional_fee) : 99000 ?? 0
    }

    return `Rp. ${Number(totalAmount).toLocaleString('id')}`
  }

  return (
    <div className='wrapper d-flex flex-column flex-row-fluid' id='page_without_order'>
      <div
        id='kt_header_page_without_auth'
        className={clsx('header', classes.header.join(' '), 'align-items-stretch bg-primary')}
        {...attributes.headerMenu}
      >
        <div
          className={clsx(
            classes.headerContainer.join(' '),
            'd-flex align-items-stretch justify-content-between'
          )}
        >
          {aside.display && (
            <div className='d-flex align-items-center d-lg-none ms-n3 me-1' title='Show aside menu'>
              <div
                className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
                id='kt_aside_mobile_toggle'
              >
                <KTSVG
                  path='/media/icons/duotune/abstract/abs015.svg'
                  className='svg-icon-2x mt-1'
                />
              </div>
            </div>
          )}

          {!aside.display && (
            <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'>
              <Link to='/dashboard' className='d-lg-none'>
                <img
                  alt='Logo'
                  src={toAbsoluteUrl('/media/logos/default-small.svg')}
                  className='h-30px'
                />
              </Link>
            </div>
          )}

          <div className='d-flex align-items-stretch justify-content-between flex-lg-grow-1'>
            {header.left === 'menu' && (
              <div className='d-flex align-items-stretch' id='kt_header_nav'>
                <div
                  className='header-menu align-items-stretch'
                  data-kt-drawer='true'
                  data-kt-drawer-name='header-menu'
                  data-kt-drawer-activate='{default: true, lg: false}'
                  data-kt-drawer-overlay='true'
                  data-kt-drawer-width="{default:'200px', '300px': '250px'}"
                  data-kt-drawer-direction='end'
                  data-kt-drawer-toggle='#kt_header_menu_mobile_toggle'
                  data-kt-swapper='true'
                  data-kt-swapper-mode='prepend'
                  data-kt-swapper-parent="{default: '#kt_body', lg: '#kt_header_nav'}"
                >
                  <div
                    className='menu menu-lg-rounded menu-column menu-lg-row menu-state-bg menu-title-gray-700 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-400 fw-bold my-5 my-lg-0 align-items-stretch'
                    id='#kt_header_menu'
                    data-kt-menu='true'
                  >
                    <div id='kt_page_title' className={clsx('page-title d-flex')}>
                      <h1 className='d-flex align-items-center  text-light-md-black fw-bolder my-1 fs-1'>
                        {`DETAIL ORDER ${order?.id} - ${order?.members?.full_name}`}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className='d-flex align-items-stretch flex-shrink-0'>
              <Topbar />
            </div>
          </div>
        </div>
      </div>

      <div
        id='kt_content_without_auth'
        className='content d-flex flex-column flex-column-fluid'
        style={{marginTop: '-3.5rem'}}
      >
        <section id='detail-order-without-order'>
          <div className='card'>
            <div className='card-body'>
              <div className='form-wrapper'>
                <Row className='form-header'>
                  <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                    <Form.Label className='fs-4 fw-bold'>
                      Nama Toko :{' '}
                      <span className='fs-4 ms-2 fw-normal'>
                        {order.store ? order.store.store_name : ''}
                      </span>
                    </Form.Label>
                  </Col>

                  <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                    <Form.Label className='fs-4 fw-bold'>
                      Order ID : <span className='fs-4 ms-2 fw-normal'>{order?.id}</span>
                    </Form.Label>
                  </Col>

                  <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                    <Col>
                      <Form.Label className='fs-4 fw-bold'>
                        Receipt Number :
                        <span className='fs-4 ms-2 fw-normal'>{order?.receipt_number ?? '-'}</span>
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Label className='fs-4 fw-bold'>
                        Order Status :
                        <span className='fs-4 ms-2 fw-bold text-success'>
                          {order?.status?.category}
                        </span>
                      </Form.Label>
                    </Col>
                  </Col>
                </Row>

                <Row className='information-detail'>
                  <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='costumer-info mb-5'>
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
                            Nomor Telp/WA :
                          </Form.Label>
                          <Col sm='7'>
                            <p className='fs-7'>{order?.project_number}</p>
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
                  </Col>

                  <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='sales-info mb-5'>
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
                  </Col>
                </Row>
              </div>

              <Row className='table-warranty d-flex align-items-center mb-5'>
                <div className='table-title-warranty'>
                  <div className='fs-3 fw-bold'>Informasi Pemasangan</div>
                  <Row>
                    <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                      <Form.Label column>
                        {order?.payment_type === 'survey'
                          ? 'Tanggal request survey :'
                          : 'Tanggal request pemasangan :'}
                      </Form.Label>
                      <Col>
                        <p className='fs-7 p-0'>{formatDate(new Date(order?.request_survey))}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                      <Form.Label column>Informasi Vendor Pemasangan :</Form.Label>
                      <Col>
                        <p className='fs-7 p-0'>{order.vendor?.company_name ?? '-'}</p>
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
                </div>

                {/* Newest */}
                {(() => {
                  if (
                    (order?.payment_type === 'survey' && order?.work_orders === null) ||
                    (order?.work_orders?.work_order_status.length === 1 &&
                      order?.payment_type === 'survey')
                  ) {
                    return (
                      <div className='table-warranty-content'>
                        {order?.is_overdistance === 1 && (
                          <>
                            <Form.Text className='fs-8 text-dark'>
                              *Order ini lebih dari{' '}
                              <span className='fw-bolder text-decoration-underline'>10 KM</span>{' '}
                              dari toko sehingga dikenakan biaya tambahan
                            </Form.Text>
                          </>
                        )}

                        <Table hover responsive='md'>
                          <thead className='table-warranty-head'>
                            <tr>
                              <th>Item Code</th>
                              <th>Item Name</th>
                              <th>Nama Pemasangan</th>
                              <th>QTY Pemasangan</th>
                            </tr>
                          </thead>

                          <tbody>
                            {order?.m_order_details.map((item: any, index: any) => (
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

                                  <td className=' fw-bolder'>{calculateTotal(order)}</td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    )
                  } else if (
                    ['QUOTEIN', 'QUOTEOUT'].includes(order?.status?.category ?? '') &&
                    order?.payment_type === 'survey'
                  ) {
                    return (
                      <div className='table-warranty-content'>
                        <Table hover responsive='md'>
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
                                    {item?.is_customer === true
                                      ? '( Disediakan oleh customer )'
                                      : ''}
                                  </td>
                                  <td>{item?.quantity ?? 0}</td>
                                  <td>{item?.unit}</td>
                                  <td>{`Rp. ${parseInt(item?.final_price ?? 0).toLocaleString(
                                    'id'
                                  )}`}</td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>

                        <Table hover responsive='md'>
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
                                    {item?.is_customer === true
                                      ? '( Disediakan oleh customer )'
                                      : ''}
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
                                Promosi ( Free Survey )
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
                                      order?.quotation[0]?.promotion?.promotion
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
                        </Table>
                      </div>
                    )
                  } else if (
                    ['SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE', 'WIP', 'WORKEND', 'DONE'].includes(
                      order?.work_orders?.work_order_status[0]?.status?.category
                    ) &&
                    order?.payment_type === 'survey' &&
                    order?.work_orders?.work_order_status.length >= 1
                  ) {
                    return (
                      <div className='table-warranty-content'>
                        <Table hover responsive='md'>
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
                        </Table>
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
                              <span className='fw-bolder text-decoration-underline'>10 KM</span>{' '}
                              dari toko sehingga dikenakan biaya tambahan
                            </Form.Text>
                          </>
                        )}

                        <Table hover responsive='md'>
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
                            {order?.m_order_details.map((item: any, index: any) => (
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

                              <td className=' fw-bolder'>{calculateTotal(order)}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    )
                  }
                })()}
              </Row>

              {order.order_files.length >= 1 ? (
                <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
                  <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                    <Form.Label className='mt-3'>Bukti Receipt :</Form.Label>
                    <ListGroup>
                      {order?.order_files.map((item: any) => (
                        <ListGroup.Item
                          key={item.id}
                          action
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
                      </div>
                    )}
                  </Col>

                  <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
                  <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
                </Row>
              ) : (
                <></>
              )}

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
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export {DetailOrderWithoutAuth}
