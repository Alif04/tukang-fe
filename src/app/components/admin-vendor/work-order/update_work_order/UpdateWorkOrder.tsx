import React, {useState, useEffect, FC, SetStateAction} from 'react'

import './UpdateWorkOrder.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Button, Row, Col, Card} from 'react-bootstrap'
import {WorkOrder, WorkOrderTukang} from '../../../../interfaces/work-order'
import {Tukang} from '../../../../interfaces/tukang'

interface Status {
  value: any
  category: string
  label: string
}

interface WorkOrderHistory {
  work_order_id: number
  work_order_status: string
  created_at: string
  updated_at: string
  work_date_time: string
  time_spent: string
  updated_by: string
}

const UpdateWorkVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const animatedComponents = makeAnimated()

  // Order Detail
  const [orderDetail, setOrderDetail] = useState<any>(null)

  // Work Order History
  const [workOrderHistory, setWorkOrderHistory] = useState<WorkOrderHistory[]>([])

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
  })

  // Option Tukang
  const [tukang, setTukang] = useState<WorkOrderTukang[]>([])

  // Option Work Order Status
  const [workOrderStatus, setWorkOrderStatus] = useState<Status[]>([])

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
          }

          if (data?.vendor_id) {
            workOrderHandler(data.vendor_id, 'vendor_id')
          }

          if (data?.work_orders?.work_order_tukang) {
            const tukang = data.work_orders.work_order_tukang.map((item: any) => ({
              id: item.id,
              tukang_id: item.tukang_id,
              tukang_name: item.tukang.full_name,
            }))

            workOrderHandler(tukang, 'tukang_id')
          }

          if (data?.request_survey) {
            console.log(data)
            workOrderHandler(formatInputDate(new Date(data.request_survey)), 'request_work_time')
          }

          if (data?.work_orders?.survey_date) {
            workOrderHandler(formatInputDate(new Date(data.work_orders.survey_date)), 'survey_date')
          }

          if (data?.work_orders?.work_order_status) {
            workOrderHandler(data.work_orders.work_order_status[0].status_id, 'work_order_status')
          }

          if (data?.complaints[0]?.complaint_status) {
            workOrderHandler(data.complaints[0].complaint_status, 'complaint_status')
          }

          if (data?.work_orders?.work_start_date) {
            workOrderHandler(
              formatInputDate(new Date(data.work_orders.work_start_date)),
              'work_start_date'
            )
          }

          if (data?.work_orders?.work_end_date) {
            workOrderHandler(
              formatInputDate(new Date(data.work_orders.work_end_date)),
              'work_end_date'
            )
          }

          if (data.work_orders) {
            const workOrderHistoryData = data.work_orders.work_order_status.map((item: any) => ({
              work_order_id: item.work_order_id,
              work_order_status: workOrderStatus.find((option) => option.value === item.status_id)
                ?.category,
              created_at: item.created_at ? formatDate(new Date(item.created_at)) : '',
              updated_at: item.updated_at ? formatDate(new Date(item.updated_at)) : '',
              work_date_time: item.work_date_time ? formatDate(new Date(item.work_date_time)) : '-',
              time_spent: item.time_spent ? item.time_spent : '-',
              updated_by: item.updated_by,
            }))

            setWorkOrderHistory(workOrderHistoryData)
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  const getTukang = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tukang`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tukang: WorkOrderTukang[] = (response.data.data as Tukang[]).map((item) => ({
          tukang_id: item.id ?? 0,
          tukang_name: item.full_name,
        }))
        setTukang(tukang)
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

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatInputDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  // Filter Work Order Status
  useEffect(() => {
    const workOrderStatusOption = () => {
      const storedStatus = sessionStorage.getItem('statusData')
      const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
      const desiredStatus = statusData.filter((status: Status) =>
        [
          'SURVEYSTART',
          'WORKSTART',
          'WIP',
          'WORKEND',
          'REWORK',
          'REWORKSTART',
          'RIP',
          'REWORKEND',
          'RESCHEDULE',
        ].includes(status.category)
      )

      const selectedStatus = desiredStatus.map((status: Status) => ({
        value: status.value,
        category: status.category,
        label: status.category,
      }))

      setWorkOrderStatus(selectedStatus)
    }

    workOrderStatusOption()
  }, [])

  const workOrderHandler = (
    value: number | string | Array<number | string | null> | any | null,
    target: string,
    setStateAction: SetStateAction<typeof setWorkOrder> = setWorkOrder
  ) => {
    setWorkOrder((prev) => {
      const cache = {...prev, [target]: value}
      return cache
    })

    console.log(workOrder)
  }

  // Handle Update Work Order
  const handleUpdateWorkOrder = async () => {
    const url = !workOrder.id ? `${apiUrl}/work-orders` : `${apiUrl}/work-orders/${workOrder.id}`
    const formData = new FormData()

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
    ]

    for (const key in workOrder) {
      if (Object.prototype.hasOwnProperty.call(workOrder, key)) {
        const value = workOrder[key]
        const required = requiredFields.find((fields: {key: string}) => fields.key === key)

        if (required) {
          if (value) {
            if (key === 'tukang_id') {
              value.forEach((item: any, index: number) => {
                if (item) {
                  if (item?.id) {
                    formData.append(`work_order_tukang[${index}][id]`, item.id)
                  }
                  formData.append(`work_order_tukang[${index}][tukang_id]`, item.tukang_id)
                }
              })
            } else {
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
            text: response.data.message,
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          })
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })
        }
        navigate('/work-order/view-work-order')
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

  const handleCancelUpdateWorkOrder = () => {
    navigate('/work-order/view-work-order')
  }

  // Work Order History
  const columns: ColumnsType<WorkOrderHistory> = [
    {
      title: 'ID',
      dataIndex: 'work_order_id',
      key: 'work_order_id',
      align: 'center',
      width: 100,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.work_order_id - b.work_order_id,
    },
    {
      title: 'Status',
      dataIndex: 'work_order_status',
      key: 'work_order_status',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.work_order_status.includes(String(value)),
      sorter: (a, b) => a.work_order_status.length - b.work_order_status.length,
    },
    {
      title: 'Date Order',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.created_at.includes(String(value)),
      sorter: (a, b) => a.created_at.length - b.created_at.length,
    },
    {
      title: 'Work Date Time',
      dataIndex: 'work_date_time',
      key: 'work_date_time',
      align: 'center',
      width: 120,
      onFilter: (value, record) => record.work_date_time.includes(String(value)),
      sorter: (a, b) => a.work_date_time.length - b.work_date_time.length,
    },
    {
      title: 'Time Spent',
      dataIndex: 'time_spent',
      key: 'time_spent',
      align: 'center',
      width: 140,
      onFilter: (value, record) => record.time_spent.includes(String(value)),
      sorter: (a, b) => a.time_spent.length - b.time_spent.length,
    },
  ]

  return (
    <section id='update-work-order'>
      <Card className=' mb-5'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-id'>
                  <h3>Nama Toko : {orderDetail?.store.store_name}</h3>
                </div>
              </div>

              <div className='costumer-information'>
                <div className='title mb-5'>
                  <h1>COSTUMER INFORMATION</h1>
                </div>

                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>Costumer ID : {orderDetail?.members.id}</p>
                  </div>

                  <div className='costumer-name  mb-3'>
                    <p className='me-5'>Costumer Name : {orderDetail?.members.full_name}</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Phone/WA : {orderDetail?.project_number}</p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>Email Address : {orderDetail?.members.email}</p>
                  </div>

                  <div className='alamat-pemasangan d-flex mb-3'>
                    <p className='me-5'>Address : {orderDetail?.project_address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <Form.Group as={Row} className='mb-3'>
                  <Form.Label column sm='4'>
                    {orderDetail?.work_orders === null ? 'Order ID' : 'Work Order ID'}
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control
                      readOnly
                      type='text'
                      value={
                        orderDetail?.work_orders === null
                          ? orderDetail?.id
                          : orderDetail?.work_orders.id
                      }
                    />
                  </Col>
                </Form.Group>
              </div>

              <div className='product-information'>
                <div className='title  mb-5'>
                  <h1>PRODUCT INFORMATION</h1>
                </div>

                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>Order ID : {orderDetail?.id}</p>
                  </div>

                  <div className='costumer-name mb-3'>
                    <p className='me-5'>
                      Nama Jasa Pemasangan : {orderDetail?.order_details[0].unit}
                    </p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>Item Name : {orderDetail?.order_details[0].unit}</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      Tipe Pembayaran :
                      <span className='ms-1 text-uppercase'>{orderDetail?.payment_type}</span>
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Harga Jasa : {orderDetail?.order_details[0].total}</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Quantity : {orderDetail?.order_details[0].quantity}</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Total Harga : {orderDetail?.grand_total}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-status'>
                  <h3>
                    Order Status : <span>{orderDetail?.status.category}</span>
                  </h3>
                </div>
              </div>

              <div className='sales-information'>
                <div className='title mb-5'>
                  <h1>WORK INFORMATION</h1>
                </div>

                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>
                      Tanggal Request Survey :{' '}
                      {orderDetail?.request_survey
                        ? formatDate(new Date(orderDetail?.request_survey))
                        : ''}
                    </p>
                  </div>

                  <div className='costumer-name mb-3'>
                    <p className='me-5'>
                      Tanggal Survey :{' '}
                      {orderDetail?.work_orders
                        ? formatDate(new Date(orderDetail?.work_orders.survey_date))
                        : ''}
                    </p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>Tanggal Pekerjaan : </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Tanggal Reschedule : </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      Tanggal Mulai Kerja :{' '}
                      {orderDetail?.work_orders
                        ? formatDate(new Date(orderDetail?.work_orders.work_start_date))
                        : ''}
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      Tanggal Selesai :{' '}
                      {orderDetail?.work_orders
                        ? formatDate(new Date(orderDetail?.work_orders.work_end_date))
                        : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className='work-status'>
            <h1 className='title text-decoration-underline'>
              {orderDetail?.work_orders === null ? 'New Work Status' : 'Update Work Status'}
            </h1>

            <Row>
              <Col>
                <Form.Group className='mt-5 mb-5'>
                  <Form.Label>Update Work Order</Form.Label>
                  <Select
                    classNamePrefix='select'
                    placeholder='Select Status'
                    isSearchable={true}
                    options={workOrderStatus}
                    value={
                      workOrder.work_order_status
                        ? {
                            value: workOrder.work_order_status,
                            label: workOrderStatus.find(
                              (option) => option.value === workOrder.work_order_status
                            )?.category,
                          }
                        : null
                    }
                    onChange={(e) => {
                      if (e !== null) {
                        workOrderHandler(e.value, 'work_order_status')
                      }
                    }}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className='mt-5 mb-5'>
                  <Form.Label>Tanggal survey : </Form.Label>
                  <Form.Control
                    type='date'
                    min={today}
                    defaultValue={workOrder ? workOrder.survey_date : ''}
                    disabled={orderDetail?.work_orders !== null ? true : false}
                    onChange={(e) => workOrderHandler(e.target.value, 'survey_date')}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className='mt-5 mb-5'>
                  <Form.Label>Tanggal mulai pengerjaan : </Form.Label>
                  <Form.Control
                    type='date'
                    min={today}
                    defaultValue={workOrder ? workOrder.work_start_date : ''}
                    disabled={orderDetail?.work_orders !== null ? true : false}
                    onChange={(e) => workOrderHandler(e.target.value, 'work_start_date')}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className='mt-5 mb-5'>
                  <Form.Label>Tanggal selesai pengerjaan : </Form.Label>
                  <Form.Control
                    type='date'
                    min={today}
                    defaultValue={workOrder ? workOrder.work_end_date : ''}
                    disabled={orderDetail?.work_orders !== null ? true : false}
                    onChange={(e) => workOrderHandler(e.target.value, 'work_end_date')}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className='mt-5 mb-5'>
                  <Form.Label>Nama Lengkap Tehnisi : </Form.Label>
                  <Select
                    classNamePrefix='select'
                    placeholder='Pilih Tehnisi'
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={tukang}
                    getOptionLabel={(option) => `${option.tukang_name}`}
                    getOptionValue={(option) => `${option.tukang_id}`}
                    value={workOrder.tukang_id}
                    onChange={(e) => workOrderHandler(e, 'tukang_id')}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className='d-flex justify-content-center'>
            <Button variant='dark-danger' type='submit' onClick={handleCancelUpdateWorkOrder}>
              Cancel
            </Button>

            <Button variant='dark-primary' type='submit' onClick={handleUpdateWorkOrder}>
              Save
            </Button>
          </div>
        </div>
      </Card>

      {orderDetail?.work_orders ? (
        <Card className='mb-5'>
          <Card.Body>
            <div className='work-order-history'>
              <h1 className='title text-decoration-underline mb-5'>Work Order History</h1>

              <Table
                className='table-striped-rows'
                bordered
                columns={columns}
                dataSource={workOrderHistory}
                rowKey={(record) => record.work_order_id}
                pagination={{position: ['bottomRight']}}
              />
            </div>
          </Card.Body>
        </Card>
      ) : (
        ''
      )}
    </section>
  )
}

export {UpdateWorkVendor}
