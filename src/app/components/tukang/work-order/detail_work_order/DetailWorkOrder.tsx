import React, {FC, useState, useEffect} from 'react'
import {formatDate, formatDateWithTime} from '../../../../../_metronic/helpers'

import './DetailWorkOrder.css'

import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Image, Skeleton} from 'antd'
import {Card, Row, Col, Form, ListGroup, Table} from 'react-bootstrap'
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

const DetailWorkTukang: FC<{updatePageTitle: (order: any) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [workOrderDetail, setWorkOrderDetail] = useState<any>()

  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)
  const [isLoadingPage, setIsLoadingPage] = useState(true)

  // Order History
  const [OrderHistory, setOrderHistory] = useState<OrderHistory[]>([])

  const getWorkOrderData = async () => {
    try {
      await axios
        .get(`${apiUrl}/work-orders/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          setWorkOrderDetail(data)
          updatePageTitle(data)
          setIsLoadingPage(false)

          if (data?.order?.order_history) {
            const orderHistory = data?.order?.order_history.map((item: any) => {
              return {
                status: item?.status?.description,
                created_at: item?.created_at ? formatDateWithTime(item?.created_at) : '-',
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
    getWorkOrderData()
  }, [])

  // Statuses for Order Timeline
  const storedStatus = sessionStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []

  const getStatuses = (categories: string[]) =>
    statusData.filter((status: any) => categories.includes(status.category)).map((x) => x.value)

  const bookStatuses = getStatuses(['BOOK', 'BOOKED', 'PICKLIST', 'UNPAID', 'PAID'])
  const surveyStatuses = getStatuses(['SURVEYREQ', 'TUKANGSURVEY', 'SURVEYSTART', 'SURVEYDONE'])
  const workStatuses = getStatuses([
    'WORKREQ',
    'TUKANGWORK',
    'WORKSTART',
    'WORKREQSTEPONE',
    'WORKREQSTEPTWO',
    'WORKREQSTEPTHREE',
    'WORKSTARTSTEPONE',
    'WORKSTARTSTEPTWO',
    'WORKSTARTSTEPTHREE',
    'TUKANGWORKSTEPONE',
    'TUKANGWORKSTEPTWO',
    'TUKANGWORKSTEPTHREE',
  ])
  const workDoneStatuses = getStatuses([
    'WORKEND',
    'DONE',
    'WORKENDSTEPONE',
    'WORKENDSTEPTWO',
    'WORKENDSTEPTHREE',
  ])

  const orderHistory = [
    {title: 'Booking Process', value: bookStatuses},
    {title: 'Survey Process', value: surveyStatuses},
    {title: 'Work in Progress', value: workStatuses},
    {title: 'Work Done', value: workDoneStatuses},
  ]

  // Statuses for Complaint Timeline
  const complaintReceivedStatuses = getStatuses(['INVESTIGATED'])
  const investigationProcessStatuses = getStatuses([
    'COMPLAINTAPPROVEDBYHO',
    'COMPLAINTREJECTEDBYHO',
  ])
  const remedialProgressStatuses = getStatuses([
    'RESURVEYREQ',
    'RESURVEYSTART',
    'REWORKREQ',
    'REWORKSTART',
  ])
  const complaintDoneStatuses = getStatuses(['RESURVEYDONE', 'REWORKEND'])
  const complaintHistory = [
    {
      title: 'Diselidiki',
      value: complaintReceivedStatuses,
    },
    {
      title: 'Disetujui atau Ditolak',
      value: investigationProcessStatuses,
    },
    {
      title: 'Survei/Pengerjaan Ulang',
      value: remedialProgressStatuses,
    },
    {
      title: 'Komplain Selesai',
      value: complaintDoneStatuses,
    },
  ]

  return (
    <section id='detail-work-order'>
      <Card className='mb-5'>
        <Card.Body className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Skeleton active loading={isLoadingPage} paragraph={{rows: 0}}>
                  <Form.Label className='fs-4 fw-bold'>
                    Nama Toko :{' '}
                    <span className='fs-4 ms-2 fw-normal'>
                      {workOrderDetail?.order?.store?.store_name ?? ''}
                    </span>
                  </Form.Label>
                </Skeleton>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
                  <Col>
                    <Form.Label className='fs-4 fw-bold'>
                      Order ID :{' '}
                      <span className='fs-4 ms-2 fw-normal'>{workOrderDetail?.order_id ?? ''}</span>
                    </Form.Label>
                  </Col>

                  <Col>
                    <Form.Label className='fs-4 fw-bold'>
                      Work Order ID :{' '}
                      <span className='fs-4 ms-2 fw-normal'>{workOrderDetail?.id ?? '-'}</span>
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
                        {workOrderDetail?.order?.receipt_number ?? '-'}
                      </span>
                    </Form.Label>
                  </Col>

                  <Col>
                    <Form.Label className='fs-4 fw-bold'>
                      Order Status :
                      <span className='fs-4 ms-2 fw-bold text-success'>
                        {(() => {
                          if (workOrderDetail?.work_order_status?.length >= 0) {
                            if (
                              [
                                'QUOTEIN',
                                'QUOTEOUT',
                                'WARRANTYCLAIM',
                                'INVESTIGATED',
                                'RESCHEDULE',
                                'CANCEL',
                              ].includes(workOrderDetail?.order?.status?.category ?? '')
                            ) {
                              return workOrderDetail?.order?.status?.description
                            } else if (
                              ['WORKREQ'].includes(
                                workOrderDetail?.order?.status?.category ?? ''
                              ) &&
                              workOrderDetail?.order?.payment_type === 'survey' &&
                              !['WORKSTART', 'WORKEND'].includes(
                                workOrderDetail?.work_order_status[0]?.status?.category ?? ''
                              )
                            ) {
                              return workOrderDetail?.order?.status?.description
                            } else {
                              return workOrderDetail?.work_order_status[0]?.status?.description
                            }
                          } else {
                            return workOrderDetail?.order?.status?.description
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
                          <p className='fs-7'>
                            {workOrderDetail?.order?.members?.member_number ?? ''}
                          </p>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='6'>
                          Customer Name :
                        </Form.Label>
                        <Col sm='6'>
                          <p className='fs-7'>{workOrderDetail?.order?.members?.full_name ?? ''}</p>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='6'>
                          Alamat Pemasangan
                        </Form.Label>
                        <Col sm='6'>
                          <p className='fs-7'>{workOrderDetail?.order?.project_address ?? ''}</p>
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='4'>
                          Nomor Telp/WA
                        </Form.Label>

                        <Col sm='8'>
                          <p className='fs-7'>{workOrderDetail?.order?.project_number ?? ''}</p>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='4'>
                          Alamat Email
                        </Form.Label>

                        <Col sm='8'>
                          <p className='fs-7'>{workOrderDetail?.order?.members?.email ?? ''} </p>
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
                    workOrderDetail?.work_order_status.length
                      ? workOrderDetail?.work_order_status[0]?.status?.category
                      : workOrderDetail?.order?.status?.category
                  ) && (
                    <Col>
                      <div className='survey mb-3'>
                        <div className='detail-info mb-3'>
                          <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
                            <p className='fs-4 fw-bold'>Survey dikerjakan pada:</p>
                            <p className='fs-7'>
                              {workOrderDetail?.order?.payment_type === 'survey' ? (
                                <>
                                  {workOrderDetail?.work_order_status.length ? (
                                    <>{formatDateWithTime(workOrderDetail?.survey_date)}</>
                                  ) : (
                                    'Jadwal belum ditentukan oleh vendor'
                                  )}
                                </>
                              ) : (
                                <>
                                  <p>Order ini tanpa survey</p>
                                </>
                              )}
                            </p>
                          </Skeleton>
                        </div>

                        <div className='detail-info mb-3'>
                          <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
                            <p className='fs-5 fw-bold'>Oleh:</p>
                            {workOrderDetail?.order?.payment_type === 'survey' ? (
                              <>
                                {workOrderDetail?.work_order_status.length ? (
                                  <p className='fs-7'>
                                    {workOrderDetail?.work_order_tukang
                                      .filter((x: any) => x.type === 1)
                                      .map((item: any) => item?.tukang?.full_name)
                                      .join(', ')}
                                  </p>
                                ) : (
                                  'Jadwal belum ditentukan oleh vendor'
                                )}
                              </>
                            ) : (
                              <>
                                <p>Order ini tanpa survey</p>
                              </>
                            )}
                          </Skeleton>
                        </div>

                        <div className='detail-info mb-3'>
                          <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
                            <p className='fs-5 fw-bold'>Sesi :</p>
                            {workOrderDetail?.session !== null ? (
                              <p>
                                {workOrderDetail?.session === 1
                                  ? 'Sesi Pagi'
                                  : workOrderDetail?.session === 2
                                  ? 'Sesi Siang'
                                  : workOrderDetail?.session === 3
                                  ? 'Sesi Sore'
                                  : 'Sesi belum ditentukan oleh vendor'}
                              </p>
                            ) : (
                              <p>Sesi belum diset oleh vendor</p>
                            )}
                          </Skeleton>
                        </div>
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
                    'WORKREQSTEPONE',
                    'WORKREQSTEPTWO',
                    'WORKREQSTEPTHREE',
                    'WORKSTARTSTEPONE',
                    'WORKSTARTSTEPTWO',
                    'WORKSTARTSTEPTHREE',
                    'WORKENDSTEPONE',
                    'WORKENDSTEPTWO',
                    'WORKENDSTEPTHREE',
                    'TUKANGWORKSTEPONE',
                    'TUKANGWORKSTEPTWO',
                    'TUKANGWORKSTEPTHREE',
                  ].includes(
                    workOrderDetail?.work_order_status.length
                      ? workOrderDetail?.work_order_status[0]?.status?.category
                      : workOrderDetail?.order?.status?.category
                  ) && (
                    <Col>
                      <div className='work-date'>
                        <Skeleton active loading={isLoadingPage} paragraph={{rows: 5}}>
                          <p className='fs-4 fw-bold'>Pekerjaan dilakukan pada:</p>

                          <Form.Group as={Row} className='detail-info'>
                            <Form.Label column sm='3'>
                              MULAI
                            </Form.Label>

                            <Col sm='9'>
                              <p className='fs-7'>
                                {formatDateWithTime(workOrderDetail?.work_start_date)}
                              </p>
                            </Col>
                          </Form.Group>

                          <Form.Group as={Row} className='detail-info'>
                            <Form.Label column sm='3'>
                              SELESAI
                            </Form.Label>

                            <Col sm='9'>
                              <p className='fs-7'>
                                {formatDateWithTime(workOrderDetail?.work_end_date)}
                              </p>
                            </Col>
                          </Form.Group>

                          <div className='detail-info mb-3'>
                            <p className='fs-5 fw-bold'>Oleh:</p>

                            <p className='fs-7'>
                              {workOrderDetail?.work_order_tukang
                                .filter((x: any) => x.type === 2)
                                .map((item: any) => item?.tukang?.full_name)
                                .join(', ')}
                            </p>
                          </div>
                        </Skeleton>
                      </div>

                      <div className='detail-info mb-3'>
                        <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
                          <p className='fs-5 fw-bold'>Sesi :</p>
                          {workOrderDetail?.session !== null ? (
                            <p>
                              {workOrderDetail?.session === 1
                                ? 'Sesi Pagi'
                                : workOrderDetail?.session === 2
                                ? 'Sesi Siang'
                                : workOrderDetail?.session === 3
                                ? 'Sesi Sore'
                                : 'Sesi belum ditentukan oleh vendor'}
                            </p>
                          ) : (
                            <p>Sesi belum diset oleh vendor</p>
                          )}
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
                      {(() => {
                        if (workOrderDetail?.order?.payment_type === 'survey') {
                          return `Tanggal request survey`
                        } else {
                          return `Tanggal request pemasangan`
                        }
                      })()}
                    </Form.Label>

                    <Col>
                      <p className='fs-7 p-0'>
                        {formatDate(workOrderDetail?.order?.request_survey)}
                      </p>
                    </Col>
                  </Skeleton>
                </Form.Group>

                {workOrderDetail?.order?.payment_type === 'survey' && (
                  <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                    <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
                      <Form.Label column>Tanggal request pemasangan :</Form.Label>

                      <Col>
                        <p className='fs-7 p-0'>
                          {workOrderDetail?.order?.request_work
                            ? formatDate(workOrderDetail?.order?.request_work)
                            : 'Tanggal belum diset oleh toko'}
                        </p>
                      </Col>
                    </Skeleton>
                  </Form.Group>
                )}

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
                    <Form.Label column>Informasi Vendor Pemasangan :</Form.Label>
                    <Col>
                      <p className='fs-7 p-0'>{workOrderDetail?.vendor?.company_name ?? '-'}</p>
                    </Col>
                  </Skeleton>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
                    <Form.Label column>Payment Type:</Form.Label>
                    <Col>
                      <p className='fs-7 p-0'>
                        {(() => {
                          if (workOrderDetail?.order?.payment_type === 'survey') {
                            return `Berbayar & Survey`
                          } else if (workOrderDetail?.order?.payment_type === 'gratis') {
                            return `Gratis`
                          } else if (
                            workOrderDetail?.order?.payment_type === 'pemasangan_tanpa_survey'
                          ) {
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
              {/* Newest */}
              {(() => {
                if (
                  workOrderDetail?.order?.payment_type === 'survey' &&
                  workOrderDetail?.work_order_status[0]?.work_order_items.length === 0 &&
                  workOrderDetail?.order?.quotation?.length === 0
                ) {
                  return (
                    <div className='table-warranty-content'>
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
                          {workOrderDetail?.order?.m_order_details?.map((item: any, index: any) => (
                            <>
                              <tr key={`${index} - order_detail`}>
                                <td>{item?.item_code}</td>
                                <td>{item?.item_name}</td>
                                <td>{item?.item_notes}</td>
                                <td>{item?.quantity ?? 0}</td>
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </Table>
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
                  ].includes(workOrderDetail?.work_order_status[0]?.status?.category) &&
                  workOrderDetail?.order?.payment_type === 'survey' &&
                  workOrderDetail?.work_order_status[0]?.work_order_items.length >= 1 &&
                  workOrderDetail?.order?.quotation?.length === 0
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
                          {workOrderDetail?.work_order_status[0]?.work_order_items.length ? (
                            workOrderDetail?.work_order_status[0]?.work_order_items.map(
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
                  workOrderDetail?.order?.quotation?.length >= 1 &&
                  workOrderDetail?.order?.payment_type === 'survey'
                ) {
                  return (
                    <div className='table-warranty-content'>
                      {workOrderDetail?.order?.quotation[0]?.quotation_special === 0 ? (
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
                            </tr>
                          </thead>

                          <tbody>
                            {workOrderDetail?.order?.quotation[0]?.quotation_details
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
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      ) : (
                        <>
                          <div className='fs-6 fw-bold'>Pemasangan Tahap 1</div>
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
                              </tr>
                            </thead>

                            <tbody>
                              {workOrderDetail?.order?.quotation[0]?.quotation_details
                                .filter((x: any) => x.item_type === 2 && x.work_step === 1)
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
                                  </tr>
                                ))}
                            </tbody>
                          </Table>

                          <div className='fs-6 fw-bold'>Pemasangan Tahap 2</div>
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
                              </tr>
                            </thead>

                            <tbody>
                              {workOrderDetail?.order?.quotation[0]?.quotation_details
                                .filter((x: any) => x.item_type === 2 && x.work_step === 2)
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
                                  </tr>
                                ))}
                            </tbody>
                          </Table>

                          <div className='fs-6 fw-bold'>Pemasangan Tahap 3</div>
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
                              </tr>
                            </thead>

                            <tbody>
                              {workOrderDetail?.order?.quotation[0]?.quotation_details
                                .filter((x: any) => x.item_type === 2 && x.work_step === 3)
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
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </>
                      )}

                      {workOrderDetail?.order?.quotation[0]?.quotation_details.filter(
                        (x: any) => x.item_type === 1
                      ).length > 0 && (
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
                            </tr>
                          </thead>

                          <tbody>
                            {workOrderDetail?.order?.quotation[0]?.quotation_details
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
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      )}
                    </div>
                  )
                } else if (
                  workOrderDetail?.order?.payment_type === 'gratis' ||
                  workOrderDetail?.order?.payment_type === 'pemasangan_tanpa_survey'
                ) {
                  return (
                    <div className='table-warranty-content'>
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
                          {workOrderDetail?.order?.m_order_details?.map((item: any, index: any) => (
                            <>
                              <tr key={`${index} - order_detail`}>
                                <td>{item?.item_code}</td>
                                <td>{item?.item_name}</td>
                                <td>{item?.item?.service_name}</td>
                                <td>{item?.quantity ?? 0}</td>
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )
                }
              })()}
            </Skeleton>
          </Row>

          <Row>
            <Col>
              <div className='fs-3 fw-bold'>Catatan Order</div>

              <div className='detail-info mb-3'>
                <p className='fs-5 fw-bold'>Catatan Toko :</p>

                <p className='fs-7'>
                  {workOrderDetail?.orders?.notes
                    ? workOrderDetail?.orders?.notes
                    : 'Toko tidak memberikan catatan'}
                </p>
              </div>

              <div className='detail-info mb-3'>
                <p className='fs-5 fw-bold'>Catatan Tukang :</p>

                <p className='fs-7'>
                  {workOrderDetail?.work_orders?.work_order_status[0]?.description
                    ? workOrderDetail?.work_orders?.work_order_status[0]?.description
                    : 'Tukang tidak memberikan catatan'}
                </p>
              </div>

              <div className='detail-info mb-3'>
                <p className='fs-5 fw-bold'>Intruksi Spesial :</p>

                <p className='fs-7'>
                  {workOrderDetail?.orders?.quotation?.[0]?.description
                    ? workOrderDetail?.orders?.quotation?.[0]?.description
                    : 'Vendor tidak memberikan catatan'}
                </p>
              </div>
            </Col>
          </Row>

          <Skeleton active loading={isLoadingPage}>
            {workOrderDetail?.work_order_evidences.length > 0 && (
              <Row>
                <Col>
                  <Form.Label className='mt-3'>Work Before :</Form.Label>
                  <ListGroup>
                    {workOrderDetail?.work_order_evidences
                      .filter((x: any) => x.type === 2)
                      .map((item: any) => (
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
                    {workOrderDetail?.work_order_evidences
                      .filter((x: any) => x.type === 3)
                      .map((item: any) => (
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
            )}
          </Skeleton>

          <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
            <div className='order-history mt-3 mb-3'>
              <div className='fs-3 text-uppercase fw-bold text-black mb-4'>Order History</div>
              <Steps
                className='order-history-timeline'
                current={orderHistory.findIndex((step) =>
                  step.value.includes(
                    workOrderDetail?.work_order_status.length > 0
                      ? workOrderDetail?.work_order_status[0]?.status?.id
                      : workOrderDetail?.order?.status?.id
                  )
                )}
                labelPlacement='vertical'
                items={orderHistory}
              />
            </div>
          </Skeleton>

          <Skeleton active loading={isLoadingPage} paragraph={{rows: 1}}>
            {workOrderDetail?.complaints && workOrderDetail?.complaints?.length >= 1 && (
              <div className='complaint-history  mt-3 mb-3'>
                <div className='fs-3 text-uppercase fw-bold text-black mb-4'>Complaint History</div>
                <Steps
                  className='complaint-history-timeline'
                  current={complaintHistory.findIndex((step) =>
                    step.value.includes(workOrderDetail?.complaints?.[0]?.complaint_status ?? 0)
                  )}
                  labelPlacement='vertical'
                  items={complaintHistory}
                />
              </div>
            )}
          </Skeleton>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
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
        </Card.Body>
      </Card>
    </section>
  )
}

export {DetailWorkTukang}
