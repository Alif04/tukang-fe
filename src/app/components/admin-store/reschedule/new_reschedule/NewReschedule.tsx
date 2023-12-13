import React, {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './NewReschedule.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import Swal from 'sweetalert2'
import {Table, Form, Button, Row, Col, Card, FormGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface SelectedOrder {
  value: number | null
  label: string
}

interface Reschedule {
  order_id: number | null
  status_id: number | null
  reschedule_date: string
}

const NewReschedule: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [order, setOrder] = useState<any>()
  const [orderDetail, setOrderDetail] = useState<any>()
  const [selectedOrder, setSelectedOrder] = useState<any>({
    value: null,
    label: '',
  })

  const [reschedule, setReschedule] = useState<Reschedule>({
    order_id: null,
    status_id: null,
    reschedule_date: '',
  })

  const getOrder = async () => {
    try {
      const response = await axios.get(`${apiUrl}/orders?order_by=desc&take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempOrder = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.id,
        }))

        setOrder(tempOrder)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getOrderDetail = async () => {
    try {
      await axios
        .get(`${apiUrl}/orders/${selectedOrder?.value}`, {
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
        })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getOrder()
  }, [])

  useEffect(() => {
    if (selectedOrder?.value) {
      getOrderDetail()
    }
  }, [selectedOrder?.value])

  // Format Date
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Selected Order
  useEffect(() => {
    setReschedule({
      ...reschedule,
      order_id: selectedOrder?.value ?? null,
    })
  }, [selectedOrder])

  // Reschedule Status
  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatus = statusData.find((status: any) => status.category === 'RESCHEDULE')
    const statusId = desiredStatus.value

    setReschedule((prevRescheduleValues) => ({
      ...prevRescheduleValues,
      status_id: statusId,
    }))
  }, [reschedule])

  // Reschedule Handler Form
  const today = new Date().toISOString().split('T')[0]

  const RescheduleFormHandler = (e: any) => {
    setReschedule({
      ...reschedule,
      [e.target.name]: e.target.value,
    })
  }

  // Handle Submit New Refund
  const handleSubmitReschedule = async () => {
    await axios
      .post(`${apiUrl}/reschedule`, reschedule, {
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
            text: 'Success Create Reschedule',
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

        navigate('/complaint/reschedule')
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

  return (
    <section id='new-reschedule'>
      <Card className='mb=5'>
        <Card.Body>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko :
                  <span className='fs-4 ms-2 fw-normal'>
                    {orderDetail?.store?.store_name ?? ''}
                  </span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group as={Row} className='order-id-complaint'>
                  <Form.Label column sm='3' className='fs-4 fw-bold'>
                    Order ID :
                  </Form.Label>
                  <Col sm='9'>
                    <Select
                      name='order_id'
                      className='form-control p-0'
                      placeholder='Ketik/Pilih Order Id'
                      isSearchable={true}
                      options={order}
                      onChange={(newValue) => setSelectedOrder(newValue)}
                    />
                  </Col>
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Receipt Number :
                  <span className='fs-4 ms-2 fw-normal'>{orderDetail?.receipt_number ?? '-'}</span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-4 fw-bold'>
                  LAST ORDER STATUS :{' '}
                  <span className='fs-4 ms-2 fw-bold text-success'>
                    {orderDetail?.status?.category}
                  </span>
                </Form.Label>
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
                        <p className='fs-7'>{orderDetail?.members?.member_number}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Customer Name :
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>{orderDetail?.members?.full_name}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Alamat Pemasangan :
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>{orderDetail?.project_address}</p>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='5'>
                        Nomor Telp/WA :
                      </Form.Label>
                      <Col sm='7'>
                        <p className='fs-7'>{orderDetail?.project_number}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='5'>
                        Alamat Email :
                      </Form.Label>
                      <Col sm='7'>
                        <p className='fs-7'>{orderDetail?.members?.email} </p>
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
                    <p className='fs-7'>{orderDetail?.sales?.id} </p>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='3'>
                    Sales Person :
                  </Form.Label>
                  <Col sm='9'>
                    <p className='fs-7'>{orderDetail?.sales?.full_name} </p>
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

            <div className='table-warranty-content'>
              <Table hover responsive='md'>
                <thead className='table-warranty-head'>
                  <tr>
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Nama Pemasangan</th>
                    <th>QTY Pemasangan</th>
                    {!(
                      orderDetail?.payment_type === 'gratis' ||
                      orderDetail?.payment_type === 'survey'
                    ) && (
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
                      <tr key={`${index} - detail-order`}>
                        <td>{item?.item_code ?? '-'}</td>
                        <td>{item?.item_name ?? '-'}</td>
                        <td>{item?.item?.service_name ?? '-'}</td>
                        <td>{item?.quantity ?? '-'}</td>
                        {!(
                          orderDetail?.payment_type === 'gratis' ||
                          orderDetail?.payment_type === 'survey'
                        ) && (
                          <>
                            <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString(
                              'id'
                            )}`}</td>
                            <td>{`Rp. ${parseInt(item?.total || 0).toLocaleString('id')}`}</td>
                          </>
                        )}
                      </tr>
                    </>
                  ))}

                  {orderDetail?.payment_type !== 'gratis' &&
                    orderDetail?.payment_type !== 'pemasangan_tanpa_survey' && (
                      <tr>
                        <td
                          colSpan={orderDetail?.payment_type === 'survey' ? 3 : 5}
                          className='text-end fw-bolder'
                        >
                          Biaya Survey
                        </td>

                        <td className=' fw-bolder'>
                          {orderDetail?.payment_type === 'gratis' ||
                          orderDetail?.payment_type === 'pemasangan_tanpa_survey'
                            ? `Rp. ${(0).toLocaleString('id')}`
                            : orderDetail?.payment_type === 'survey'
                            ? `Rp. ${(99000).toLocaleString('id')}`
                            : `Rp. ${0}`}
                        </td>
                      </tr>
                    )}

                  {orderDetail?.payment_type !== 'survey' && (
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
                            return `Rp. ${parseInt(orderDetail?.grand_total).toLocaleString('id')}`
                          } else if (orderDetail?.payment_type === 'survey') {
                            return `Rp. ${(99000).toLocaleString('id')}`
                          } else {
                            return `Rp. ${(0).toLocaleString('id')}`
                          }
                        })()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Row>

          <hr />

          <div className='title'>
            <h1 className='text-uppercase'>formulir reschedule</h1>
          </div>

          <Form.Group className='detail-info mb-3'>
            <Form.Label column md='6'>
              Tanggal Request Survey/Pekerjaan :
            </Form.Label>

            <Col md={6}>
              <p className='fs-3'>
                {orderDetail?.request_survey
                  ? formatDate(new Date(orderDetail?.request_survey))
                  : ''}
              </p>
            </Col>
          </Form.Group>

          <Form.Group className='detail-info mb-3'>
            <Form.Label column md='6'>
              Tanggal Reschedule :
            </Form.Label>

            <Col md={6}>
              <Form.Control
                name='reschedule_date'
                type='date'
                min={today}
                onChange={(e) => RescheduleFormHandler(e)}
              />
            </Col>
          </Form.Group>

          <div className='d-flex justify-content-center mt-5'>
            <Button variant='dark-primary' type='submit' onClick={handleSubmitReschedule}>
              Save Update
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {NewReschedule}
