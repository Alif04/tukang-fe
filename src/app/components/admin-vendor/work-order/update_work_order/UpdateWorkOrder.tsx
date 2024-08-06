import React, {useState, useEffect, FC, SetStateAction} from 'react'
import {WorkOrder, WorkOrderTukang} from '../../../../interfaces/work-order'

import './UpdateWorkOrder.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import dayjs from 'dayjs'
import {DatePicker, Steps} from 'antd'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Button, Row, Col, Card, Table} from 'react-bootstrap'
const {RangePicker} = DatePicker

interface StatusStorage {
  value: number
  category: any
  description: string
}

interface OrderHistory {
  order_id: number
  status: string
  created_at: string
  updated_by: string
}

const UpdateWorkVendor: FC<{updatePageTitle: (work_order: WorkOrder) => void}> = ({
  updatePageTitle,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const animatedComponents = makeAnimated()
  const vendorId = localStorage.getItem('vendor_id')

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Order Detail
  const [orderDetail, setOrderDetail] = useState<any>({})

  // Order History
  const [OrderHistory, setOrderHistory] = useState<OrderHistory[]>([])

  console.log('order history', OrderHistory)

  // New Work Order
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
    work_order_item: [
      {
        id: null,
        index: Date.now().toString(),
        item_name: '',
        is_user: 0,
        type: 1,
        quantity: null,
        unit: '',
      },
      {
        id: null,
        index: (Date.now() + 1).toString(),
        item_name: '',
        is_user: 0,
        type: 2,
        quantity: null,
        unit: '',
      },
    ],
  })

  console.log('work order', workOrder)

  // Option Tukang
  const [tukang, setTukang] = useState<WorkOrderTukang[]>([])

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

          if (data?.work_orders?.id) {
            workOrderHandler(data.work_orders.id, 'id')
          }

          if (data?.id) {
            workOrderHandler(data.id, 'order_id')

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

          if (data?.vendor_id) {
            workOrderHandler(data.vendor_id, 'vendor_id')
          }

          if (data?.work_orders?.work_order_tukang) {
            const tukang = data.work_orders.work_order_tukang.map((item: any) => ({
              id: item.id,
              tukang_id: item.tukang_id,
              tukang_name: item.tukang.full_name,
              type: item.type,
            }))

            workOrderHandler(tukang, 'tukang_id')
          }

          if (data?.request_survey) {
            workOrderHandler(formatInputDate(new Date(data.request_survey)), 'request_work_time')
          }

          // old without time
          // if (data?.work_orders?.survey_date) {
          //   workOrderHandler(formatInputDate(new Date(data.work_orders.survey_date)), 'survey_date')
          // }

          // new with time
          if (data?.work_orders?.survey_date) {
            setWorkOrder((prev) => {
              return {
                ...prev,
                survey_date: data.work_orders.survey_date,
              }
            })
          }

          if (data?.work_orders?.work_start_date) {
            setWorkOrder((prev) => {
              return {
                ...prev,
                work_start_date: data.work_orders.work_start_date,
              }
            })
          }

          if (data?.work_orders?.work_end_date) {
            setWorkOrder((prev) => {
              return {
                ...prev,
                work_end_date: data.work_orders.work_end_date,
              }
            })
          }

          if (
            Array.isArray(data?.work_orders?.work_order_status) &&
            data?.work_orders?.work_order_status?.length > 1
          ) {
            if (
              ['WORKREQ', 'RESURVEYREQ', 'REWORKREQ'].includes(data?.status?.category) &&
              !['WORKSTART'].includes(data?.work_orders?.work_order_status[0]?.status?.category)
            ) {
              workOrderHandler(data?.status?.id, 'work_order_status')
            } else {
              workOrderHandler(
                data?.work_orders?.work_order_status[0]?.status_id,
                'work_order_status'
              )
            }
          } else {
            workOrderHandler(data?.status?.id, 'work_order_status')
          }

          if (data?.complaints[0]?.complaint_status) {
            workOrderHandler(data.complaints[0].complaint_status, 'complaint_status')
          }

          if (data?.quotation) {
            const workOrderItem = data?.quotation[0]?.quotation_details.map(
              (item: any, index: number) => ({
                id: item.id,
                index: (Date.now() + index).toString(),
                item_name: item?.name,
                unit: item?.unit,
                is_user: item?.is_customer === true ? 1 : 0,
                type: item?.item_type,
                quantity: item?.quantity,
              })
            )

            setWorkOrder((prev) => ({
              ...prev,
              work_order_item: workOrderItem,
            }))
          }

          updatePageTitle(data)
        })
    } catch (error) {
      console.error(error)
    }
  }

  const getTukang = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tukang?vendor_id=${vendorId}&take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempTukang = response.data.data.map((item: any) => ({
          tukang_id: item.id ?? 0,
          tukang_name: item.full_name,
          is_active: item.is_active,
        }))
        const filteredTukang = tempTukang.filter((x: any) => x.is_active !== false)
        setTukang(filteredTukang)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchOrderData()
    getTukang()
  }, [workOrder.id])

  // Format Date
  const today = new Date().toISOString().split('T')[0]
  const formatInputDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  // Filter Work Order Status
  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData: Array<StatusStorage> = storedStatus ? JSON.parse(storedStatus) : []

    const getStatusNameByCategory = (category: string) => {
      switch (category) {
        case 'SURVEYREQ':
          return 'TUKANGSURVEY'
        case 'WORKREQ':
          return 'TUKANGWORK'
      }
    }

    const status = getStatusNameByCategory(orderDetail?.status?.category)
    const desiredStatus =
      statusData.find((statuses: StatusStorage) => statuses.category === status)?.value ?? null

    setWorkOrder({
      ...workOrder,
      work_order_status: desiredStatus === null ? orderDetail?.status?.id : desiredStatus,
    })
  }, [orderDetail?.status])

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

  const tukangHandler = (selectedOptions: any, field: any) => {
    const type = field === 'survey_tukang_id' ? 1 : 2

    setWorkOrder((prevWorkOrder) => {
      const updatedTukang = selectedOptions.map((option: any) => ({
        ...option,
        type: type,
      }))

      const filteredTukang = prevWorkOrder.tukang_id.filter((x: any) => x.type !== type)
      const mergedTukang = [...filteredTukang, ...updatedTukang]

      return {
        ...prevWorkOrder,
        tukang_id: mergedTukang,
      }
    })
  }

  // Session
  const range = (start: number, end: number): number[] =>
    Array.from({length: end - start}, (_, i) => start + i)
  const disabledHoursSessionMorning = (): number[] =>
    range(0, 24).filter((hour) => hour < 8 || hour > 11)
  const disabledHoursSessionAfternoon = (): number[] =>
    range(0, 24).filter((hour) => hour < 12 || hour > 15)
  const disabledHoursSessionNight = (): number[] =>
    range(0, 24).filter((hour) => hour < 15 || hour > 18)

  const getDisabledHours = (session: string): number[] => {
    switch (session) {
      case 'pagi':
        return disabledHoursSessionMorning()
      case 'siang':
        return disabledHoursSessionAfternoon()
      case 'sore':
        return disabledHoursSessionNight()
      default:
        return []
    }
  }

  const getSession = (): string => {
    const currentHour = new Date().getHours()

    if (currentHour >= 8 && currentHour < 12) {
      return 'pagi'
    } else if (currentHour >= 12 && currentHour < 15) {
      return 'siang'
    } else if (currentHour >= 15 && currentHour < 18) {
      return 'sore'
    }
    return 'none'
  }

  const session = getSession()

  // Handle Update Work Order
  const handleUpdateWorkOrder = async () => {
    // TODO: Fix conditional url
    const url = !workOrder.id
      ? `${apiUrl}/work-orders`
      : workOrder?.id && workOrder?.work_order_item?.length === 0
      ? `${apiUrl}/work-orders/${workOrder.id}`
      : `${apiUrl}/work-orders/${workOrder.id}`

    const formData = new FormData()
    setIsLoading(true)

    let errorBags = []
    const requiredFields = [
      {key: 'order_id', fieldName: 'Order'},
      {key: 'vendor_id', fieldName: 'Vendor'},
      {key: 'tukang_id', fieldName: 'Tehnisi'},
      {key: 'request_work_time', fieldName: 'Tanggal Request Survey'},
      {key: 'survey_date', fieldName: 'Tanggal survey'},
      {key: 'work_order_status', fieldName: 'Update Work Order Status'},
      {key: 'work_start_date', fieldName: 'Tanggal mulai pengerjaan'},
      {key: 'work_end_date', fieldName: 'Tanggal selesai pengerjaan'},
      // {key: 'work_order_item', fieldName: 'Work Order Item'},
    ]

    const requiredWorkOrderFields = [{key: 'tukang_id', fieldName: 'Tehnisi'}]

    for (const key in workOrder) {
      if (Object.prototype.hasOwnProperty.call(workOrder, key)) {
        const value = workOrder[key]
        const required = requiredFields.find((fields: {key: string}) => fields.key === key)

        if (required) {
          if (value) {
            if (key === 'tukang_id' && Array.isArray(workOrder.tukang_id)) {
              value.forEach((item: any, index: number) => {
                requiredWorkOrderFields.forEach((field) => {
                  if (!item[field.key]) {
                    errorBags.push({
                      message: `Field ${field.fieldName} in work order tukang ${
                        index + 1
                      } cannot be empty`,
                    })
                  }
                })

                if (item) {
                  if (item.tukang_id) {
                    formData.append(`work_order_tukang[${index}][tukang_id]`, item.tukang_id)
                  }

                  if (item.type) {
                    formData.append(`work_order_tukang[${index}][type]`, item.type)
                  }
                }
              })
            } else {
              formData.append(key, workOrder[key])
            }
          } else if (['survey_date', 'work_start_date', 'work_end_date'].includes(key)) {
            if (value) {
              formData.append(key, workOrder[key])
            }
          } else {
            errorBags.push({
              message: `${required.fieldName} cannot be empty`,
            })
          }
        }
      }
    }

    if (errorBags.length > 0) {
      setIsLoading(false)

      Swal.fire({
        title: 'warning',
        text: errorBags[0].message,
        icon: 'warning',
      })

      return false
    }

    await axios
      .post(url, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          Swal.fire({
            title: 'Success',
            text: 'Work Order Updated',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          })

          setIsLoading(false)
        } else {
          Swal.fire({
            title: 'Warning',
            text: response.data.message,
            icon: 'warning',
          })

          setIsLoading(false)
        }
        navigate('/work-order/view-work-order')
      })
      .catch((error) => {
        setIsLoading(false)

        Swal.fire({
          title: 'Warning',
          text: error.response.data.message,
          icon: 'warning',
        })
      })
  }

  return (
    <section id='update-work-order'>
      <Card className=' mb-5'>
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
                  <Form.Group as={Row}>
                    <Form.Label className='fs-4 fw-bold pt-0'>
                      {orderDetail?.work_orders === null
                        ? 'New Work Status : '
                        : 'Update Work Status : '}
                      <span className='fw-normal'>
                        {orderDetail?.status?.category === 'SURVEYREQ'
                          ? 'Tukang ditugaskan untuk survei'
                          : orderDetail?.status?.category === 'WORKREQ'
                          ? 'Tukang ditugaskan untuk pengerjaan'
                          : orderDetail?.status?.description}
                      </span>
                    </Form.Label>
                  </Form.Group>
                </Col>
              </Col>
            </Row>

            <Row className='information-detail'>
              <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={12} className='costumer-info mb-5'>
                <div className='fs-4 fw-bold'>Informasi Pembeli</div>

                <Row>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        No Member
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>{orderDetail?.members?.member_number ?? ''}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Customer Name
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

                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
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

              <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={12} className='sales-info mb-5'>
                <Row>
                  {[
                    'SURVEYREQ',
                    'TUKANGSURVEY',
                    'SURVEYSTART',
                    'SURVEYDONE',
                    'RESURVEYREQ',
                    'RESURVEYSTART',
                    'RESURVEYDONE',
                    'RESCHEDULE',
                  ].includes(orderDetail?.status?.category) && (
                    <Col>
                      <div className='survey mb-3'>
                        <div className='fs-4 fw-bold'>Survey</div>

                        <Form.Group className='detail-info mb-3'>
                          <Form.Label>Tanggal Survey :</Form.Label>

                          {/* <Form.Control
                            type='date'
                            min={today}
                            defaultValue={workOrder ? workOrder.survey_date : ''}
                            onChange={(e) => workOrderHandler(e.target.value, 'survey_date')}
                          /> */}

                          {orderDetail?.status?.category !== 'SURVEYDONE' ? (
                            <DatePicker
                              showTime={{
                                format: 'HH:mm',
                                hideDisabledOptions: true,
                                disabledHours: () => getDisabledHours(session),
                              }}
                              className='date-range w-100'
                              format='DD-MM-YYYY HH:mm'
                              value={
                                workOrder.survey_date
                                  ? dayjs(workOrder.survey_date, 'YYYY-MM-DD HH:mm')
                                  : null
                              }
                              onChange={(value) => {
                                const surveyDate = value ? value.format('YYYY-MM-DDTHH:mm') : ''
                                setWorkOrder((prev) => ({
                                  ...prev,
                                  survey_date: surveyDate,
                                }))
                              }}
                            />
                          ) : (
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
                          )}
                        </Form.Group>

                        <Form.Group className='detail-info mb-3'>
                          <Form.Label>Nama Lengkap Tehnisi :</Form.Label>

                          <Select
                            classNamePrefix='select'
                            placeholder='Pilih Tehnisi'
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={tukang}
                            getOptionLabel={(option) => `${option.tukang_name}`}
                            getOptionValue={(option) => `${option.tukang_id}`}
                            value={workOrder.tukang_id.filter((x) => x.type === 1)}
                            onChange={(e) => tukangHandler(e, 'survey_tukang_id')}
                          />
                        </Form.Group>
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
                  ].includes(orderDetail?.status?.category) && (
                    <Col>
                      <div className='work-date'>
                        <div className='fs-4 fw-bold'>Pengerjaan</div>

                        <Form.Group className='detail-info mb-3'>
                          <Form.Label>Tanggal mulai pengerjaan :</Form.Label>

                          {orderDetail?.status?.category !== 'WORKEND' ? (
                            <RangePicker
                              showTime={{
                                format: 'HH:mm',
                                hideDisabledOptions: true,
                                disabledHours: () => getDisabledHours(session),
                              }}
                              className='date-range w-100'
                              format='DD-MM-YYYY HH:mm'
                              value={
                                (workOrder.work_start_date &&
                                  workOrder.work_end_date && [
                                    dayjs(workOrder.work_start_date, 'YYYY-MM-DD HH:mm'),
                                    dayjs(workOrder.work_end_date, 'YYYY-MM-DD HH:mm'),
                                  ]) ||
                                undefined
                              }
                              onChange={(values) => {
                                if (values && values.length === 2) {
                                  const dateFromFormatted =
                                    values[0]?.format('YYYY-MM-DDTHH:mm') || ''
                                  const dateToFormatted =
                                    values[1]?.format('YYYY-MM-DDTHH:mm') || ''

                                  setWorkOrder((prev) => ({
                                    ...prev,
                                    work_start_date: dateFromFormatted,
                                    work_end_date: dateToFormatted,
                                  }))
                                } else {
                                  setWorkOrder({
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
                                    work_order_item: [],
                                  })
                                }
                              }}
                            />
                          ) : (
                            <p className='p-0'>
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
                              {new Date(orderDetail?.work_orders?.work_end_date).toLocaleDateString(
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
                          )}
                        </Form.Group>

                        <Form.Group className='detail-info mb-3'>
                          <Form.Label>Nama Lengkap Tehnisi :</Form.Label>

                          <Select
                            classNamePrefix='select'
                            placeholder='Pilih Tehnisi'
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={tukang}
                            getOptionLabel={(option) => `${option.tukang_name}`}
                            getOptionValue={(option) => `${option.tukang_id}`}
                            value={workOrder.tukang_id.filter((x) => x.type === 2)}
                            onChange={(e) => tukangHandler(e, 'work_tukang_id')}
                          />
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
                <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
                  <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
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
                  </Form.Group>
                </Col>

                <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
                  <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                    <Form.Label column>Informasi Vendor Pemasangan :</Form.Label>
                    <Col>
                      <p className='fs-7 p-0'>{orderDetail?.vendor?.company_name ?? '-'}</p>
                    </Col>
                  </Form.Group>
                </Col>

                <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
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
                </Col>
              </Row>
            </div>

            {/* Newest */}
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
                          <tr key={`${index} - order_detail`}>
                            <td>{item?.item_code}</td>
                            <td>{item?.item_name}</td>
                            <td>{item?.item_notes}</td>
                            <td>{item?.quantity ?? 0}</td>
                          </tr>
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
                        {orderDetail?.work_orders?.work_order_status[0]?.work_order_items.length ? (
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
                                (total: any, item: any) => total + parseInt(item.final_price || 0),
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
                                (total: any, item: any) => total + parseInt(item.final_price || 0),
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
          </Row>

          {orderDetail?.work_orders?.work_order_status.length > 1 &&
          orderDetail?.work_orders?.work_order_status[0]?.status?.category === 'WORKEND' &&
          !['RESURVEYREQ', 'REWORKREQ'].includes(orderDetail?.status?.category) ? (
            <div className='d-flex justify-content-center'>
              <Button
                className='btn-done d-flex justify-content-center align-items-center'
                type='submit'
                disabled
              >
                Order Ini Pengerjaannya Telah Selesai
              </Button>
            </div>
          ) : (
            <div className='d-flex justify-content-center'>
              {/* <Button variant='dark-danger' type='submit' onClick={handleCancelUpdateWorkOrder}>
                Cancel
              </Button> */}

              <Button
                className='d-flex justify-content-center align-items-center'
                variant='dark-primary'
                type='submit'
                disabled={isLoading}
                onClick={handleUpdateWorkOrder}
              >
                {isLoading ? 'Submitting Order...' : 'Save'}
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card className='mb-5'>
        <Card.Body>
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
        </Card.Body>
      </Card>
    </section>
  )
}

export {UpdateWorkVendor}
