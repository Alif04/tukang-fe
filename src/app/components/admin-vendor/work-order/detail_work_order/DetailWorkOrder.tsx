import React, {FC, useState, useEffect} from 'react'
import {Orders} from '../../../../interfaces/order'

import './DetailWorkOrder.css'

import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Image, Skeleton} from 'antd'
import {Row, Col, Form, ListGroup} from 'react-bootstrap'
import {Steps} from 'antd'

interface Status {
  value: number | null
  category: string
}

interface OrderHistory {
  order_id: number
  status: string
  created_at: string
  updated_by: string
}

const DetailWorkVendor: FC<{updatePageTitle: (order: Orders) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [orderDetail, setOrderDetail] = useState<any>()
  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)
  const [isLoadingPage, setIsLoadingPage] = useState(true)

  // Order History
  const [OrderHistory, setOrderHistory] = useState<OrderHistory[]>([])

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
          const data = response.data.data

          setOrderDetail(data)
          updatePageTitle(data)
          setIsLoadingPage(false)

          if (data?.order_history) {
            const orderHistory = data?.order_history.map((item: any) => {
              return {
                status: item?.status?.description,
                created_at: item?.created_at
                  ? new Date(item?.created_at).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })
                  : item?.created_at
                  ? new Date(item?.created_at).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })
                  : '-',
                updated_by: item?.created_by?.username,
              }
            })

            setOrderHistory(orderHistory)
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchOrderData()
  }, [])

  // Statuses for Order Timeline
  const storedStatus = sessionStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []

  const getStatuses = (categories: string[]) =>
    statusData.filter((status: any) => categories.includes(status.category)).map((x) => x.value)

  const bookStatuses = getStatuses(['BOOK', 'BOOKED', 'PICKLIST', 'UNPAID', 'PAID'])
  const surveyStatuses = getStatuses(['SURVEYREQ', 'TUKANGSURVEY', 'SURVEYSTART', 'SURVEYDONE'])
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

  return (
    <section id='detail-work-order'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
                  <Form.Label className='fs-4 fw-bold'>
                    Nama Toko :{' '}
                    <span className='fs-4 ms-2 fw-normal'>
                      {orderDetail?.store?.store_name ?? ''}
                    </span>
                  </Form.Label>
                </Skeleton>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
                  <Col>
                    <Form.Label className='fs-4 fw-bold'>
                      Order ID :{' '}
                      <span className='fs-4 ms-2 fw-normal'>{orderDetail?.id ?? ''}</span>
                    </Form.Label>
                  </Col>

                  <Col>
                    <Form.Label className='fs-4 fw-bold'>
                      Work Order ID :{' '}
                      <span className='fs-4 ms-2 fw-normal'>
                        {orderDetail?.work_orders?.id ?? '-'}
                      </span>
                    </Form.Label>
                  </Col>
                </Skeleton>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
                  <Col>
                    <Form.Label className='fs-4 fw-bold'>
                      Receipt Number :
                      <span className='fs-4 ms-2 fw-normal'>
                        {orderDetail?.receipt_number ?? '-'}
                      </span>
                    </Form.Label>
                  </Col>

                  <Col>
                    <Form.Label className='fs-4 fw-bold'>
                      Order Status :
                      <span className='fs-4 ms-2 fw-bold text-success'>
                        {(() => {
                          if (orderDetail?.work_orders?.work_order_status?.length >= 0) {
                            if (
                              [
                                'QUOTEIN',
                                'QUOTEOUT',
                                'WARRANTYCLAIM',
                                'INVESTIGATED',
                                'RESCHEDULE',
                                'CANCEL',
                                'RESURVEYREQ',
                                'REWORKREQ',
                              ].includes(orderDetail?.status?.category)
                            ) {
                              return orderDetail?.status?.description
                            } else if (
                              ['WORKREQ', 'TUKANGWORK'].includes(orderDetail?.status?.category) &&
                              orderDetail?.payment_type === 'survey' &&
                              !['WORKSTART', 'WORKEND'].includes(
                                orderDetail?.work_orders?.work_order_status[0]?.status?.category
                              )
                            ) {
                              return orderDetail?.status?.description
                            } else {
                              return orderDetail?.work_orders?.work_order_status[0]?.status
                                ?.description
                            }
                          } else {
                            return orderDetail?.status?.description
                          }
                        })()}
                      </span>
                    </Form.Label>
                  </Col>
                </Skeleton>
              </Col>
            </Row>

            <Row className='information-detail'>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='costumer-info mb-5'>
                <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
                  <div className='fs-4 fw-bold'>Informasi Pembeli</div>
                </Skeleton>

                <Skeleton active loading={isLoadingPage} paragraph={{rows: 3}}>
                  <Row>
                    <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='6'>
                          No Member :
                        </Form.Label>
                        <Col sm='6'>
                          <p className='fs-7'>{orderDetail?.members?.member_number ?? ''}</p>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='6'>
                          Customer Name :
                        </Form.Label>
                        <Col sm='6'>
                          <p className='fs-7'>{orderDetail?.members?.full_name ?? ''}</p>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='6'>
                          Alamat Pemasangan
                        </Form.Label>
                        <Col sm='6'>
                          <p className='fs-7'>{orderDetail?.project_address ?? ''}</p>
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='4'>
                          Nomor Telp/WA
                        </Form.Label>

                        <Col sm='8'>
                          <p className='fs-7'>{orderDetail?.project_number ?? ''}</p>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='4'>
                          Alamat Email
                        </Form.Label>

                        <Col sm='8'>
                          <p className='fs-7'>{orderDetail?.members?.email ?? ''} </p>
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                </Skeleton>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='sales-info mb-5'>
                <Row>
                  {[
                    'SURVEYREQ',
                    'TUKANGSURVEY',
                    'SURVEYSTART',
                    'SURVEYDONE',
                    'RESURVEYREQ',
                    'RESURVEYSTART',
                    'RESURVEYDONE',
                  ].includes(
                    orderDetail?.work_orders !== null
                      ? orderDetail?.work_orders?.work_order_status[0]?.status?.category
                      : orderDetail?.status?.category
                  ) && (
                    <Col>
                      <div className='survey mb-3'>
                        <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
                          <div className='fs-4 fw-bold'>Survey</div>
                        </Skeleton>

                        <Skeleton active loading={isLoadingPage} paragraph={{rows: 3}}>
                          <Form.Group className='detail-info mb-3'>
                            <Form.Label>Tanggal Survey :</Form.Label>

                            {orderDetail?.work_orders !== null ? (
                              <p>
                                {new Date(orderDetail?.work_orders?.survey_date).toLocaleDateString(
                                  'id-ID',
                                  {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                  }
                                )}
                              </p>
                            ) : (
                              <p>Tanggal survey belum diset oleh vendor</p>
                            )}
                          </Form.Group>

                          <Form.Group className='detail-info mb-3'>
                            <Form.Label>Nama Lengkap Tehnisi :</Form.Label>

                            {orderDetail?.work_orders !== null ? (
                              <p>
                                {Array.from(
                                  new Set(
                                    orderDetail?.work_orders?.work_order_tukang
                                      ?.filter((x: any) => x.type === 1)
                                      ?.map((x: any) => x?.tukang?.full_name ?? '-')
                                  )
                                ).join(', ')}
                              </p>
                            ) : (
                              <p>Tukang belum diset oleh vendor</p>
                            )}
                          </Form.Group>
                        </Skeleton>
                      </div>
                    </Col>
                  )}

                  {[
                    'WORKREQ',
                    'TUKANGWORK',
                    'WORKSTART',
                    'WORKEND',
                    'REWORKREQ',
                    'REWORKSTART',
                    'REWORKEND',
                    'RESCHEDULE',
                    'DONE',
                  ].includes(
                    orderDetail?.work_orders !== null
                      ? orderDetail?.work_orders?.work_order_status[0]?.status?.category
                      : orderDetail?.status?.category
                  ) && (
                    <Col>
                      <div className='work-date'>
                        <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
                          <div className='fs-4 fw-bold'>Pengerjaan</div>
                        </Skeleton>

                        <Skeleton active loading={isLoadingPage} paragraph={{rows: 3}}>
                          <Form.Group className='detail-info mb-3'>
                            <Form.Label>Tanggal mulai pengerjaan :</Form.Label>

                            {orderDetail?.work_orders !== null ? (
                              <p>
                                {new Date(
                                  orderDetail?.work_orders?.work_start_date
                                ).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                })}{' '}
                                sampai{' '}
                                {new Date(
                                  orderDetail?.work_orders?.work_end_date
                                ).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                })}
                              </p>
                            ) : (
                              <p>Tanggal Pengerjaan belum diset oleh vendor</p>
                            )}
                          </Form.Group>

                          <Form.Group className='detail-info mb-3'>
                            <Form.Label>Nama Lengkap Tehnisi :</Form.Label>

                            {orderDetail?.work_orders !== null ? (
                              <p>
                                {Array.from(
                                  new Set(
                                    orderDetail?.work_orders?.work_order_tukang
                                      ?.filter((x: any) => x.type === 2)
                                      ?.map((x: any) => x?.tukang?.full_name ?? '-')
                                  )
                                ).join(', ')}
                              </p>
                            ) : (
                              <p>Tukang belum diset oleh vendor</p>
                            )}
                          </Form.Group>
                        </Skeleton>
                      </div>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </div>

          <Row className='table-warranty d-flex align-items-center mb-5'>
            <div className='table-title-warranty'>
              <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
                <div className='fs-3 fw-bold'>Informasi Pemasangan</div>
              </Skeleton>

              <Row>
                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
                    <Form.Label column>
                      {orderDetail?.payment_type !== 'survey'
                        ? 'Tanggal request pemasangan'
                        : 'Tanggal request survey'}
                    </Form.Label>

                    <Col>
                      <p className='fs-7 p-0'>
                        {new Date(orderDetail?.request_survey).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </Col>
                  </Skeleton>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
                    <Form.Label column>Informasi Vendor Pemasangan :</Form.Label>
                    <Col>
                      <p className='fs-7 p-0'>{orderDetail?.vendor?.company_name ?? '-'}</p>
                    </Col>
                  </Skeleton>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
                    <Form.Label column>Payment Type:</Form.Label>
                    <Col>
                      <p className='fs-7 p-0'>
                        {(() => {
                          if (orderDetail?.payment_type === 'survey') {
                            return `Berbayar & Survey`
                          } else if (orderDetail?.payment_type === 'gratis') {
                            return `Gratis`
                          } else if (orderDetail?.payment_type === 'pemasangan_tanpa_survey') {
                            return `Berbayar & Pemasangan Tanpa Survey`
                          } else {
                            return ``
                          }
                        })()}
                      </p>
                    </Col>
                  </Skeleton>
                </Form.Group>
              </Row>
            </div>

            <Skeleton active loading={isLoadingPage} paragraph={{rows: 4}}>
              {(() => {
                if (
                  (orderDetail?.payment_type === 'survey' &&
                    orderDetail?.work_orders === null &&
                    orderDetail?.quotation?.length === 0) ||
                  (orderDetail?.work_orders?.work_order_status[0]?.work_order_items.length === 0 &&
                    orderDetail?.payment_type === 'survey' &&
                    orderDetail?.quotation?.length === 0)
                ) {
                  return (
                    <div className='table-warranty-content'>
                      {orderDetail?.is_overdistance === 1 && (
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
                          {orderDetail?.order_details.map((item: any, index: any) => (
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

                          {orderDetail?.is_overdistance === 1 && (
                            <>
                              <tr>
                                <td colSpan={3} className='text-end fw-bolder align-middle'>
                                  Biaya Tambahan
                                </td>

                                <td className=' fw-bolder'>{`Rp. ${Number(
                                  orderDetail?.additional_fee
                                ).toLocaleString('id')}`}</td>
                              </tr>

                              <tr>
                                <td colSpan={3} className='text-end fw-bolder'>
                                  Grand Total
                                </td>

                                <td className=' fw-bolder'>{`Rp. ${Number(
                                  orderDetail?.grand_total
                                ).toLocaleString('id')}`}</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )
                } else if (
                  [
                    'SURVEYREQ',
                    'TUKANGSURVEY',
                    'SURVEYSTART',
                    'SURVEYDONE',
                    'RESURVEYREQ',
                    'RESURVEYSTART',
                    'RESURVEYDONE',
                  ].includes(orderDetail?.work_orders?.work_order_status[0]?.status?.category) &&
                  orderDetail?.payment_type === 'survey' &&
                  orderDetail?.work_orders?.work_order_status[0]?.work_order_items.length >= 1 &&
                  orderDetail?.quotation?.length === 0
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
                          {orderDetail?.work_orders?.work_order_status[0]?.work_order_items
                            .length ? (
                            orderDetail.work_orders.work_order_status[0].work_order_items.map(
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
                } else if (
                  orderDetail?.quotation?.length >= 1 &&
                  orderDetail?.payment_type === 'survey'
                ) {
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
                          {orderDetail?.quotation[0]?.quotation_details
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
                          {orderDetail?.quotation[0]?.quotation_details
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
                              orderDetail?.quotation[0]?.quotation_details
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
                              orderDetail?.quotation[0]?.quotation_details
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
                              Grand Total
                            </td>
                            <td className=' fw-bolder'>
                              {`Rp. ${parseInt(
                                orderDetail?.quotation[0]?.quotation_grand_total ?? 0
                              ).toLocaleString('id')}`}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )
                } else if (
                  orderDetail?.payment_type === 'gratis' ||
                  orderDetail?.payment_type === 'pemasangan_tanpa_survey'
                ) {
                  return (
                    <div className='table-warranty-content'>
                      {orderDetail?.is_overdistance === 1 && (
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
                            {!(orderDetail?.payment_type === 'gratis') && (
                              <>
                                <th>Harga Jasa</th>
                                <th>Jumlah</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {orderDetail?.order_details.map((item: any, index: any) => (
                            <>
                              <tr key={`${index} - order_detail`}>
                                <td>{item?.item_code}</td>
                                <td>{item?.item_name}</td>
                                <td>{item?.item?.service_name}</td>
                                <td>{item?.quantity ?? 0}</td>
                                {!(orderDetail?.payment_type === 'gratis') && (
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

                          {orderDetail?.is_overdistance === 1 && (
                            <>
                              <tr>
                                <td
                                  colSpan={orderDetail?.payment_type !== 'gratis' ? 5 : 3}
                                  className='text-end fw-bolder align-middle'
                                >
                                  Biaya Tambahan
                                </td>

                                <td className=' fw-bolder'>{`Rp. ${Number(
                                  orderDetail?.additional_fee
                                ).toLocaleString('id')}`}</td>
                              </tr>
                            </>
                          )}

                          <tr>
                            <td
                              colSpan={orderDetail?.payment_type !== 'gratis' ? 5 : 3}
                              className='text-end fw-bolder'
                            >
                              Grand Total
                            </td>

                            <td className=' fw-bolder'>{`Rp. ${Number(
                              orderDetail?.grand_total
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

          <Skeleton active loading={isLoadingPage}>
            {orderDetail?.work_orders?.work_order_evidences.length ? (
              <Row>
                <Col>
                  <Form.Label className='mt-3'>Work Before :</Form.Label>
                  <ListGroup>
                    {orderDetail?.work_orders?.work_order_evidences
                      .filter((x: any) => x.type === 2)
                      .map((item: any) => (
                        <ListGroup.Item
                          key={item.id}
                          action
                          onClick={() => {
                            setPreviewImage(item.evidence_location)
                            setVisible(true)
                          }}
                        >
                          {item.evidence_location}
                        </ListGroup.Item>
                      ))}
                  </ListGroup>

                  {previewImage && (
                    <div>
                      <Image
                        key={previewImage}
                        width={200}
                        style={{display: 'none'}}
                        src={`${apiUrl}/public/work-orders/${previewImage}`}
                        preview={{
                          visible,
                          src: `${apiUrl}/public/work-orders/${previewImage}`,
                          onVisibleChange: (value) => {
                            setVisible(value)
                          },
                        }}
                      />
                    </div>
                  )}
                </Col>

                <Col>
                  <Form.Label className='mt-3'>Work After :</Form.Label>
                  <ListGroup>
                    {orderDetail?.work_orders?.work_order_evidences
                      .filter((x: any) => x.type === 3)
                      .map((item: any) => (
                        <ListGroup.Item
                          key={item.id}
                          action
                          onClick={() => {
                            setPreviewImage(item.evidence_location)
                            setVisible(true)
                          }}
                        >
                          {item.evidence_location}
                        </ListGroup.Item>
                      ))}
                  </ListGroup>

                  {previewImage && (
                    <div>
                      <Image
                        key={previewImage}
                        width={200}
                        style={{display: 'none'}}
                        src={`${apiUrl}/public/work-orders/${previewImage}`}
                        preview={{
                          visible,
                          src: `${apiUrl}/public/work-orders/${previewImage}`,
                          onVisibleChange: (value) => {
                            setVisible(value)
                          },
                        }}
                      />
                    </div>
                  )}
                </Col>
              </Row>
            ) : (
              <></>
            )}
          </Skeleton>

          <Skeleton active loading={isLoadingPage}>
            <div className='order-history mt-3 mb-3'>
              <div className='fs-3 text-uppercase fw-bold text-black mb-4'>Order History</div>
              <Steps
                className='order-history-timeline'
                current={orderHistory.findIndex((step) =>
                  step.value.includes(
                    orderDetail?.work_orders?.work_order_status.length > 0
                      ? orderDetail?.work_orders?.work_order_status[0]?.status?.id
                      : orderDetail?.project_status_id
                  )
                )}
                labelPlacement='vertical'
                items={orderHistory}
              />
            </div>
          </Skeleton>

          <Skeleton active loading={isLoadingPage}>
            {orderDetail?.complaints && orderDetail?.complaints?.length >= 1 && (
              <div className='complaint-history  mt-3 mb-3'>
                <div className='fs-3 text-uppercase fw-bold text-black mb-4'>Complaint History</div>
                <Steps
                  className='complaint-history-timeline'
                  current={complaintHistory.findIndex((step) =>
                    step.value.includes(orderDetail?.complaints?.[0]?.complaint_status ?? 0)
                  )}
                  labelPlacement='vertical'
                  items={complaintHistory}
                />
              </div>
            )}
          </Skeleton>
        </div>

        <div className='card'>
          <div className='card-body'>
            <Skeleton active loading={isLoadingPage}>
              <div className='work-order-history'>
                <h1 className='title mb-5'>Order History</h1>

                <Steps
                  progressDot
                  current={OrderHistory.length - 1}
                  direction='vertical'
                  items={OrderHistory.map((item) => ({
                    title: item?.status,
                    description: `Terakhir update : ${item?.created_at} ${
                      item.updated_by ? `oleh ${item?.updated_by}` : ''
                    }`,
                  }))}
                />
              </div>
            </Skeleton>
          </div>
        </div>
      </div>
    </section>
  )
}

export {DetailWorkVendor}
