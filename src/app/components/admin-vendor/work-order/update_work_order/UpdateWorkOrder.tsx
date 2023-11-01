import React, {useState, useEffect, FC} from 'react'

import './UpdateWorkOrder.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Button, Row, Col} from 'react-bootstrap'

interface WorkOrder {
  order_id: any
  vendor_id: any
  tukang_id: Tukang[]
  request_work_time: string
  survey_date: string
  work_order_status: any
  complaint_status: any
  work_start_date: string
  work_end_date: string
}

interface Tukang {
  value: any
  label: string
}

const UpdateWorkVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const animatedComponents = makeAnimated()

  const [orderDetail, setOrderDetail] = useState<any>()

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

          if (data?.id) {
            setOrderId(data.id)
          }

          if (data?.created_at) {
            setRequestWorkTime(formatDateRequestWorkTime(new Date(data.created_at)))
          }

          if (data?.vendor_id) {
            setVendorId(data.vendor_id)
          }

          if (data?.complaints[0].complaint_status) {
            setComplaintStatusId(data.complaints[0].complaint_status)
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
        const tempTukang = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.full_name,
        }))

        setTukang(tempTukang)
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
  }, [])

  const today = new Date().toISOString().split('T')[0]

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatDateRequestWorkTime = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  // New Work Order

  const [orderId, setOrderId] = useState<any>()
  const [vendorId, setVendorId] = useState<any>()
  const [workOrderStatus, setWorkOrderStatus] = useState<any>()
  const [requestWorkTime, setRequestWorkTime] = useState<string>('')
  const [surveyDate, setSurveyDate] = useState<any>()
  const [complaintStatusId, setComplaintStatusId] = useState<any>()
  const [workStart, setWorkStart] = useState<string>('')
  const [workEnd, setWorkEnd] = useState<string>('')

  // Option Tukang
  const [tukang, setTukang] = useState<Tukang[]>([])
  const [tukangId, setTukangId] = useState<any>([])

  // Handle Change Work Order Status
  const handleChangeWorkOrderStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedWorkOrderStatus = event.target.value
    const updatedWorkOrderStatusInteger = parseInt(updatedWorkOrderStatus)
    setWorkOrderStatus(updatedWorkOrderStatusInteger)
  }

  // Change Input Date
  const handleChangeSurveyDate = (element: any) => {
    const updatedSurveyDate = element.target.value
    setSurveyDate(updatedSurveyDate)
  }

  const handleChangeWorkStartDate = (element: any) => {
    const updatedWorkStartDate = element.target.value
    setWorkStart(updatedWorkStartDate)
  }

  const handleChangeWorkEndDate = (element: any) => {
    const updatedWorkEndDate = element.target.value
    setWorkEnd(updatedWorkEndDate)
  }

  // Change Tukang
  const handleChangeSelectTukang = (element: any) => {
    const updatedTukangId = element.map((option: any) => option.value)
    setTukangId(updatedTukangId)
  }

  // Handle Update Work Order
  const handleUpdateWorkOrder = async () => {
    const formData = new FormData()

    formData.append('order_id', orderId)
    formData.append('vendor_id', vendorId)
    formData.append('work_order_status', workOrderStatus)
    formData.append('request_work_time', requestWorkTime)
    formData.append('survey_date', surveyDate)
    formData.append('complaint_status', complaintStatusId)
    formData.append('work_start_date', workStart)
    formData.append('work_end_date', workEnd)

    if (tukangId?.length) {
      tukangId.forEach((item: any, index: number) => {
        if (item) {
          formData.append(`work_order_tukang[${index}][tukang_id]`, item)
        }
      })
    }

    const response = await axios
      .post(`${apiUrl}/work-orders`, formData, {
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
            text: 'Success Create Sales',
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
        navigate('/home')
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
    navigate('/home')
  }

  return (
    <section id='update-work-order'>
      <div className='card mb-5'>
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
                    Work order ID :
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control readOnly type='text' value={orderDetail?.id} />
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
                    <p className='me-5 text-uppercase'>
                      Tipe Pembayaran : {orderDetail?.payment_type}
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
                      Tanggal Request Survey :
                      {orderDetail ? formatDate(new Date(orderDetail?.created_at)) : ''}
                    </p>
                  </div>

                  <div className='costumer-name mb-3'>
                    <p className='me-5'>Tanggal Survey :</p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>Tanggal Pekerjaan : </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Tanggal Reschedule</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Tanggal Mulai Keja :</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Tanggal Selesai : </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className='work-status'>
            <h1 className='title text-decoration-underline'>New Work Status</h1>

            <Row>
              <Col>
                <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                  <Form.Label>Update Work Order</Form.Label>
                  <Form.Select onChange={handleChangeWorkOrderStatus}>
                    <option selected>SELECT STATUS</option>
                    <option value='6'>SURVEY START</option>
                    <option value='11'>WORK START</option>
                    <option value='12'>WIP</option>
                    <option value='13'>WORK END</option>
                    <option value='3'>INVESTIGATE</option>
                    <option value='23'>REWORK</option>
                    <option value='29'>REWORKSTART</option>
                    <option value='6'>RIP</option>
                    <option value='24'>REWORKEND</option>
                    <option value='22'>RESCHEDULE</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                  <Form.Label>Tanggal survey : </Form.Label>
                  <Form.Control type='date' min={today} onChange={handleChangeSurveyDate} />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                  <Form.Label>Tanggal mulai pengerjaan : </Form.Label>
                  <Form.Control type='date' min={today} onChange={handleChangeWorkStartDate} />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                  <Form.Label>Tanggal selesai pengerjaan : </Form.Label>
                  <Form.Control type='date' min={today} onChange={handleChangeWorkEndDate} />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                  <Form.Label>Nama Lengkap Tehnisi : </Form.Label>
                  <Select
                    classNamePrefix='select'
                    placeholder='Pilih Tehnisi'
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={tukang}
                    onChange={(element) => handleChangeSelectTukang(element)}
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
      </div>
    </section>
  )
}

export {UpdateWorkVendor}
