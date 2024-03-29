import React, {FC, useState, useEffect, SetStateAction} from 'react'
import {Orders} from '../../../../interfaces/order'
import {WorkOrder} from '../../../../interfaces/work-order'

import './DetailWorkOrder.css'

import axios from 'axios'
import Select from 'react-select'
import dayjs from 'dayjs'
import {useParams} from 'react-router-dom'
import {Image} from 'antd'
import {Row, Col, Form, ListGroup, Table} from 'react-bootstrap'
import {DatePicker, Steps} from 'antd'
const {RangePicker} = DatePicker

interface Status {
  value: number | null
  category: string
}

const DetailWorkVendor: FC<{updatePageTitle: (order: Orders) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [orderDetail, setOrderDetail] = useState<any>()
  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)

  const [workOrder, setWorkOrder] = useState<WorkOrder>({
    id: null,
    order_id: null,
    vendor_id: null,
    tukang_id: [],
    request_work_time: '',
    survey_date: '',
    work_order_status: null,
    complaint_status: null,
    work_start_date: '',
    work_end_date: '',
  })

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

          if (data?.work_orders?.work_order_tukang) {
            const tukang = data.work_orders.work_order_tukang.map((item: any) => ({
              id: item.id,
              tukang_id: item.tukang_id,
              tukang_name: item.tukang.full_name,
              type: item.type,
            }))

            workOrderHandler(tukang, 'tukang_id')
          }

          if (data?.work_orders) {
            setWorkOrder((prev) => ({
              ...prev,
              work_start_date: data?.work_orders.work_start_date,
              work_end_date: data?.work_orders.work_end_date,
            }))
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchOrderData()
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

  const formatDateValues = (date: any) => {
    if (isNaN(date.getTime())) {
      return ''
    }

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  const workOrderHandler = (
    value: number | string | Array<number | string | null> | any | null,
    target: string,
    setStateAction: SetStateAction<typeof setWorkOrder> = setWorkOrder
  ) => {
    setWorkOrder((prev) => {
      const cache = {...prev, [target]: value}
      return cache
    })
  }

  // Statuses for Order Timeline
  const storedStatus = sessionStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []

  const getStatuses = (categories: string[]) =>
    statusData.filter((status: any) => categories.includes(status.category)).map((x) => x.value)

  const bookStatuses = getStatuses(['BOOK', 'BOOKED', 'PICKLIST', 'UNPAID', 'PAID'])
  const surveyStatuses = getStatuses(['SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE'])
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

  // console.log(
  //   'item',
  //   orderDetail?.order_details?.map((item: any) => {
  //     return item?.item?.service_name
  //   })
  // )

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
                    {orderDetail?.store?.store_name ?? ''}
                  </span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Col>
                  <Form.Label className='fs-4 fw-bold'>
                    Order ID : <span className='fs-4 ms-2 fw-normal'>{orderDetail?.id ?? ''}</span>
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
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
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
                      {orderDetail?.work_orders === null
                        ? orderDetail?.status?.category
                        : orderDetail?.work_orders?.work_order_status[0]?.status?.category ?? ''}
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
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='sales-info mb-5'>
                <Row>
                  {['SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE'].includes(
                    orderDetail?.work_orders !== null
                      ? orderDetail?.work_orders?.work_order_status[0]?.status?.category
                      : orderDetail?.status?.category
                  ) && (
                    <Col>
                      <div className='survey mb-3'>
                        <div className='fs-4 fw-bold'>Survey</div>

                        <Form.Group className='detail-info mb-3'>
                          <Form.Label>Tanggal Survey :</Form.Label>

                          {orderDetail?.work_orders !== null ? (
                            <Form.Control
                              type='date'
                              readOnly
                              value={formatDateValues(
                                new Date(orderDetail?.work_orders?.survey_date)
                              )}
                            />
                          ) : (
                            <p>Tanggal survey belum diset oleh vendor</p>
                          )}
                        </Form.Group>

                        <Form.Group className='detail-info mb-3'>
                          <Form.Label>Nama Lengkap Tehnisi :</Form.Label>

                          {orderDetail?.work_orders !== null ? (
                            <Select
                              classNamePrefix='select'
                              closeMenuOnSelect={false}
                              isClearable={false}
                              isMulti
                              menuIsOpen={false}
                              getOptionLabel={(option) => `${option.tukang_name}`}
                              getOptionValue={(option) => `${option.tukang_id}`}
                              value={workOrder.tukang_id.filter((x) => x.type === 1)}
                            />
                          ) : (
                            <p>Tukang belum diset oleh vendor</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>
                  )}

                  {[
                    'WORKREQ',
                    'WORKSTART',
                    'WIP',
                    'WORKEND',
                    'REWORK',
                    'REWORKSTART',
                    'RIP',
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
                        <div className='fs-4 fw-bold'>Pengerjaan</div>

                        <Form.Group className='detail-info mb-3'>
                          <Form.Label>Tanggal mulai pengerjaan :</Form.Label>

                          {orderDetail?.work_orders !== null ? (
                            <RangePicker
                              className='date-range w-100'
                              format='YYYY-MM-DD'
                              value={
                                (workOrder.work_start_date &&
                                  workOrder.work_end_date && [
                                    dayjs(workOrder.work_start_date, 'YYYY-MM-DD'),
                                    dayjs(workOrder.work_end_date, 'YYYY-MM-DD'),
                                  ]) ||
                                undefined
                              }
                              disabled={[true, true]}
                            />
                          ) : (
                            <p>Tanggal Pengerjaan belum diset oleh vendor</p>
                          )}
                        </Form.Group>

                        <Form.Group className='detail-info mb-3'>
                          <Form.Label>Nama Lengkap Tehnisi :</Form.Label>

                          {orderDetail?.work_orders !== null ? (
                            <Select
                              placeholder='Tukang belum diset oleh Vendor'
                              classNamePrefix='select'
                              closeMenuOnSelect={false}
                              isClearable={false}
                              isMulti
                              menuIsOpen={false}
                              getOptionLabel={(option) => `${option.tukang_name}`}
                              getOptionValue={(option) => `${option.tukang_id}`}
                              value={workOrder.tukang_id.filter((x) => x.type === 2)}
                            />
                          ) : (
                            <p>Tukang belum diset oleh vendor</p>
                          )}
                        </Form.Group>
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
                  <Form.Label column>
                    {orderDetail?.payment_type !== 'survey'
                      ? 'Tanggal request pemasangan'
                      : 'Tanggal request survey'}
                  </Form.Label>

                  <Col>
                    <p className='fs-7 p-0'>{formatDate(new Date(orderDetail?.request_survey))}</p>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Informasi Vendor Pemasangan :</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>{orderDetail?.vendor?.company_name ?? '-'}</p>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
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
                </Form.Group>
              </Row>
            </div>

            {/* Newest */}
            {(() => {
              if (
                orderDetail?.payment_type === 'survey' &&
                orderDetail?.work_orders?.work_order_status.length === 1
              ) {
                return (
                  <div className='table-warranty-content'>
                    {orderDetail?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari
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
                        </tr>
                      </thead>

                      <tbody>
                        {orderDetail?.order_details?.map((item: any, index: any) => (
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
                    </Table>
                  </div>
                )
              } else if (
                ['QUOTEIN', 'QUOTEOUT'].includes(orderDetail?.status?.category ?? '') &&
                orderDetail?.payment_type === 'survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    {orderDetail?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari
                          <span className='fw-bolder text-decoration-underline'>10 KM</span> dari
                          toko sehingga dikenakan biaya tambahan
                        </Form.Text>
                      </>
                    )}

                    <Table hover responsive='md'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th className='text-center'>Jenis Jasa</th>
                          <th className='text-center'>QTY</th>
                          <th className='text-center'>Satuan</th>
                          <th className='text-center'>Price</th>
                          <th className='text-center'>Total</th>
                          <th className='text-center'>Keterangan</th>
                        </tr>
                      </thead>

                      <tbody>
                        {orderDetail?.quotation[0]?.quotation_details.map(
                          (item: any, index: any) => (
                            <tr key={`${index}-quotation`}>
                              <td>{item?.name ?? '-'}</td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>{item?.unit}</td>
                              <td>{`Rp. ${parseInt(item?.price || 0).toLocaleString('id')}`}</td>
                              <td>{`Rp. ${parseInt(item?.final_price || 0).toLocaleString(
                                'id'
                              )}`}</td>
                              <td>{item?.description ? '' : '-'}</td>
                            </tr>
                          )
                        )}

                        <tr>
                          <td colSpan={6} className='text-end fw-bolder'>
                            Promosi ( Free Survey )
                          </td>
                          <td className=' fw-bolder'>
                            {`Rp. ${parseInt(
                              orderDetail?.quotation[0]?.quotation_disc ?? 0
                            ).toLocaleString('id')}`}
                          </td>
                        </tr>

                        {orderDetail?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td colSpan={3} className='text-end fw-bolder align-middle'>
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                orderDetail?.additional_fee
                              ).toLocaleString('id')}.`}</td>
                            </tr>
                          </>
                        )}

                        <tr>
                          <td colSpan={5} className='text-end fw-bolder'>
                            Grand Total
                          </td>
                          <td className=' fw-bolder'>
                            {`Rp. ${parseInt(
                              orderDetail?.quotation[0]?.quotation_grand_total ?? 0
                            ).toLocaleString('id')}`}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                ['SURVEYSTART', 'SURVEYDONE', 'WIP', 'WORKEND', 'DONE'].includes(
                  orderDetail?.work_orders?.work_order_status[0]?.status?.category
                ) &&
                orderDetail?.work_orders?.work_order_status.length > 1 &&
                orderDetail?.payment_type === 'survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    <Table hover responsive='md'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th>Item / Nama Pemasangan</th>
                          <th>QTY Pemasangan</th>
                          <th>Satuan</th>
                        </tr>
                      </thead>

                      <tbody>
                        {orderDetail?.work_orders?.work_order_status[0]?.work_order_items.map(
                          (item: any, index: any) => (
                            <tr key={`${index}-work_order_detail`}>
                              <td>{item?.name ?? '-'}</td>
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
                orderDetail?.payment_type === 'gratis' ||
                orderDetail?.payment_type === 'pemasangan_tanpa_survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    {orderDetail?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari
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
                          {!(orderDetail?.payment_type === 'gratis') && (
                            <>
                              <th>Harga Jasa</th>
                              <th>Jumlah</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetail?.order_details?.map((item: any, index: any) => (
                          <>
                            <tr key={`${index} - order_detail`}>
                              <td>{item?.item_code}</td>
                              <td>{item?.item?.item_name}</td>
                              <td>{item?.item?.service_name ?? '-'}</td>
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
                              <td colSpan={3} className='text-end fw-bolder align-middle'>
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                orderDetail?.additional_fee
                              ).toLocaleString('id')}.`}</td>
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

                          <td className=' fw-bolder'>
                            {(() => {
                              if (orderDetail?.payment_type === 'gratis') {
                                return `Rp. ${(0).toLocaleString('id')}`
                              } else if (orderDetail?.payment_type === 'pemasangan_tanpa_survey') {
                                return `Rp. ${parseInt(orderDetail?.grand_total).toLocaleString(
                                  'id'
                                )}`
                              } else {
                                return `Rp. ${(0).toLocaleString('id')}`
                              }
                            })()}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )
              }
            })()}
          </Row>

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
        </div>
      </div>
    </section>
  )
}

export {DetailWorkVendor}
