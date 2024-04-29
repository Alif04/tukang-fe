import React, {FC, useState, useEffect} from 'react'

import './DetailWorkOrder.css'

import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Image} from 'antd'
import {Row, Col, Form, ListGroup, Table} from 'react-bootstrap'
import {Steps} from 'antd'

interface Status {
  value: number | null
  category: string
}

const DetailWorkTukang: FC<{updatePageTitle: (order: any) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [workOrderDetail, setWorkOrderDetail] = useState<any>()

  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)

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
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getWorkOrderData()
  }, [])

  const formatDate = (date: any) => {
    if (isNaN(date.getTime())) {
      return ''
    }

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatDateTime = (date: any) => {
    if (isNaN(date.getTime())) {
      return ''
    }

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `Tanggal ${day}-${month}-${year} Jam ${hours}:${minutes}`
  }

  // Statuses for Order Timeline
  const storedStatus = sessionStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []

  const getStatuses = (categories: string[]) =>
    statusData.filter((status: any) => categories.includes(status.category)).map((x) => x.value)

  const bookStatuses = getStatuses(['BOOK', 'BOOKED', 'PICKLIST', 'UNPAID', 'PAID'])
  const surveyStatuses = getStatuses(['SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE'])
  const workStatuses = getStatuses(['WORKREQ', 'WORKSTART', 'WIP', 'WORKEND'])
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
  const calculateTotal = (workOrderDetail: any) => {
    const {payment_type, is_overdistance, grand_total, additional_fee} = workOrderDetail ?? {}

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
    <section id='detail-work-order'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko :{' '}
                  <span className='fs-4 ms-2 fw-normal'>
                    {workOrderDetail?.order?.store?.store_name ?? ''}
                  </span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
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
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
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
                      {workOrderDetail?.work_order_status[0].length === 0
                        ? workOrderDetail?.status?.description
                        : workOrderDetail?.work_order_status[0]?.status?.description ?? ''}
                    </span>
                  </Form.Label>
                </Col>
              </Col>
            </Row>

            <Row className='information-detail'>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='costumer-info mb-5'>
                <div className='fs-4 fw-bold'>Informasi Pembeli</div>
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
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='sales-info mb-5'>
                <Row>
                  {['SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE'].includes(
                    workOrderDetail?.work_order_status.length
                      ? workOrderDetail?.work_order_status[0]?.status?.category
                      : workOrderDetail?.order?.status?.category
                  ) && (
                    <Col>
                      <div className='survey mb-3'>
                        <div className='detail-info mb-3'>
                          <p className='fs-4 fw-bold'>Survey dikerjakan pada:</p>
                          <p className='fs-7'>
                            {workOrderDetail?.order?.payment_type === 'survey' ? (
                              <>
                                {workOrderDetail?.work_order_status.length ? (
                                  <>{formatDateTime(new Date(workOrderDetail?.survey_date))}</>
                                ) : (
                                  'Jadwal belum diset oleh vendor'
                                )}
                              </>
                            ) : (
                              <>
                                <p>Order ini tanpa survey</p>
                              </>
                            )}
                          </p>
                        </div>

                        <div className='detail-info mb-3'>
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
                                'Jadwal belum diset oleh vendor'
                              )}
                            </>
                          ) : (
                            <>
                              <p>Order ini tanpa survey</p>
                            </>
                          )}
                        </div>
                      </div>
                    </Col>
                  )}

                  {[
                    'WORKSTART',
                    'WORKREQ',
                    'WIP',
                    'WORKEND',
                    'REWORK',
                    'REWORKSTART',
                    'RIP',
                    'REWORKEND',
                    'RESCHEDULE',
                    'DONE',
                  ].includes(
                    workOrderDetail?.work_order_status.length
                      ? workOrderDetail?.work_order_status[0]?.status?.category
                      : workOrderDetail?.order?.status?.category
                  ) && (
                    <Col>
                      <div className='work-date'>
                        <p className='fs-4 fw-bold'>Pekerjaan dilakukan pada:</p>

                        <Form.Group as={Row} className='detail-info'>
                          <Form.Label column sm='3'>
                            MULAI
                          </Form.Label>

                          <Col sm='9'>
                            <p className='fs-7'>
                              {formatDateTime(new Date(workOrderDetail?.work_start_date))}
                            </p>
                          </Col>
                        </Form.Group>

                        <Form.Group as={Row} className='detail-info'>
                          <Form.Label column sm='3'>
                            SELESAI
                          </Form.Label>

                          <Col sm='9'>
                            <p className='fs-7'>
                              {formatDateTime(new Date(workOrderDetail?.work_end_date))}
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
                      </div>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </div>

          <Row className='table-warranty d-flex align-items-center mb-5'>
            <div className='table-title-warranty'>
              <div className='fs-3 fw-bold'>Informasi Pemasangan</div>
              <Row>
                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Tanggal request pemasangan :</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {formatDate(new Date(workOrderDetail?.order?.request_survey))}
                    </p>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Informasi Vendor Pemasangan :</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>{workOrderDetail?.vendor?.company_name ?? '-'}</p>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
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
                </Form.Group>
              </Row>
            </div>

            {/* Newest */}
            {(() => {
              if (
                workOrderDetail?.order?.payment_type === 'survey' &&
                workOrderDetail?.work_order_status.length === 1
              ) {
                return (
                  <div className='table-warranty-content'>
                    {workOrderDetail?.order?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari
                          <span className='fw-bolder text-decoration-underline'> 10 KM</span> dari
                          toko sehingga dikenakan biaya tambahan
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

                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            Biaya Survey
                          </td>

                          <td className=' fw-bolder'>Rp. 99.000</td>
                        </tr>

                        {workOrderDetail?.order?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td colSpan={3} className='text-end fw-bolder align-middle'>
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                workOrderDetail?.order?.additional_fee
                              ).toLocaleString('id')}`}</td>
                            </tr>

                            <tr>
                              <td colSpan={3} className='text-end fw-bolder'>
                                Grand Total
                              </td>

                              <td className=' fw-bolder'>
                                {calculateTotal(workOrderDetail?.order)}
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                ['QUOTEIN', 'QUOTEOUT'].includes(workOrderDetail?.order?.status?.category ?? '') &&
                workOrderDetail?.order?.payment_type === 'survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    {workOrderDetail?.order?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari
                          <span className='fw-bolder text-decoration-underline'> 10 KM</span> dari
                          toko sehingga dikenakan biaya tambahan
                        </Form.Text>
                      </>
                    )}

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
                            Price
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
                                {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                              </td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>{item?.unit}</td>
                              <td>{`Rp. ${parseInt(item?.price ?? 0).toLocaleString('id')}`}</td>
                            </tr>
                          ))}

                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            Total
                          </td>

                          <td className='fw-bolder'>
                            {`Rp. ${workOrderDetail?.order?.quotation[0]?.quotation_details
                              .filter((x: any) => x.item_type === 2)
                              .map((item: any) => parseInt(item?.price ?? 0))
                              .reduce((total: number, price: number) => total + price, 0)
                              .toLocaleString('id')}`}
                          </td>
                        </tr>
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
                            Price
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
                                {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                              </td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>{item?.unit}</td>
                              <td>{`Rp. ${parseInt(item?.price ?? 0).toLocaleString('id')}`}</td>
                            </tr>
                          ))}

                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            Promosi ( Free Survey )
                          </td>
                          <td className=' fw-bolder'>
                            {`Rp. ${parseInt(
                              workOrderDetail?.order?.quotation[0]?.quotation_disc ?? 0
                            ).toLocaleString('id')}`}
                          </td>
                        </tr>

                        {workOrderDetail?.order?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td colSpan={3} className='text-end fw-bolder align-middle'>
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                workOrderDetail?.order?.additional_fee
                              ).toLocaleString('id')}.`}</td>
                            </tr>
                          </>
                        )}

                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            Grand Total
                          </td>
                          <td className=' fw-bolder'>
                            {`Rp. ${parseInt(
                              workOrderDetail?.order?.quotation[0]?.quotation_grand_total ?? 0
                            ).toLocaleString('id')}`}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                ['SURVEYSTART', 'SURVEYDONE', 'WIP', 'WORKEND', 'DONE'].includes(
                  workOrderDetail?.work_order_status[0]?.status?.category
                ) &&
                workOrderDetail?.order?.payment_type === 'survey' &&
                workOrderDetail?.work_order_status.length >= 2
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
                        {workOrderDetail?.work_order_status[0]?.work_order_items.map(
                          (item: any, index: any) => (
                            <tr key={`${index}-work_order_detail`}>
                              <td>
                                {item?.name ?? '-'}{' '}
                                {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                              </td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>{item?.unit ?? ''}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                workOrderDetail?.order?.payment_type === 'gratis' ||
                workOrderDetail?.order?.payment_type === 'pemasangan_tanpa_survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    {workOrderDetail?.order?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari{' '}
                          <span className='fw-bolder text-decoration-underline'>10 KM</span> dari
                          toko sehingga dikenakan biaya tambahan
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
                          {!(workOrderDetail?.order?.payment_type === 'gratis') && (
                            <>
                              <th>Harga Jasa</th>
                              <th>Jumlah</th>
                            </>
                          )}
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
                              {!(workOrderDetail?.order?.payment_type === 'gratis') && (
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

                        {workOrderDetail?.order?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td
                                colSpan={workOrderDetail?.order?.payment_type !== 'gratis' ? 5 : 3}
                                className='text-end fw-bolder align-middle'
                              >
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                workOrderDetail?.order?.additional_fee
                              ).toLocaleString('id')}.`}</td>
                            </tr>
                          </>
                        )}

                        <tr>
                          <td
                            colSpan={workOrderDetail?.order?.payment_type !== 'gratis' ? 5 : 3}
                            className='text-end fw-bolder'
                          >
                            Grand Total
                          </td>

                          <td className=' fw-bolder'>{calculateTotal(workOrderDetail?.order)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )
              }
            })()}
          </Row>

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
        </div>
      </div>
    </section>
  )
}

export {DetailWorkTukang}
