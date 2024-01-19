import React, {FC, useState, useEffect} from 'react'

import './WarrantyFormClaim.css'

import axios from 'axios'
import {useNavigate, useParams} from 'react-router-dom'
import Swal from 'sweetalert2'
import {Form, Row, Col, Table, Button} from 'react-bootstrap'

const WarrantyFormClaim: FC<{updatePageTitle: (warranty: any) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()

  // Order Detail
  const [orderId, setOrderId] = useState<string>('')
  const [orderDetail, setOrderDetail] = useState<any>()

  const getOrderDetail = async () => {
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

          if (data?.id) {
            setOrderId(data.id)
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getOrderDetail()
  }, [])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Add Warranty Claim
  const [complaintStatus, setComplaintStatus] = useState<any>()
  console.log(complaintStatus)
  const [date, setDate] = useState<any>()
  const [desc, setDesc] = useState<any>()
  const [complantChannel, setComplaintChannel] = useState<number>(1)

  // Set Status Warranty Claim
  const storedStatus = sessionStorage.getItem('statusData')
  const statusData = storedStatus ? JSON.parse(storedStatus) : []

  const desiredStatusName = 'WARRANTYCLAIM'
  const desiredStatus = statusData.find((status: any) => status.category === desiredStatusName)

  useEffect(() => {
    if (desiredStatus) {
      const statusId = desiredStatus?.value
      setComplaintStatus(statusId)
    }
  }, [complaintStatus])

  // Handle Change Date Warranty Claim
  const today = new Date().toISOString().split('T')[0]

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValueDateClaim = event.target.value
    setDate(updatedValueDateClaim)
  }

  // Handle Change Description Claim Warranty
  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValueDescription = event.target.value
    setDesc(updatedValueDescription)
  }

  // Handle Submit Warranty
  const ClaimWarrantyValidation = () => {
    let valid = true

    if (!date) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill date form',
        icon: 'error',
      })
      valid = false
    } else if (!desc) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill warranty claim description form',
        icon: 'error',
      })
      valid = false
    }
    return valid
  }

  // Handle Submit Claim Warranty
  const handleSubmitWarrantyClaim = async () => {
    if (ClaimWarrantyValidation()) {
      const formData = new FormData()

      formData.append('order_id', orderId)
      formData.append('description', desc)
      formData.append('complaint_date', date)
      formData.append('complaint_channel', complantChannel.toString())
      formData.append('complaint_status', complaintStatus)

      const response = await axios
        .post(`${apiUrl}/complaints`, formData, {
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
              text: 'Success Add Claim Warranty',
              icon: 'success',
            })
          } else {
            Swal.fire({
              title: 'Error',
              text: response.data.message,
              icon: 'error',
            })
          }

          navigate('/warranty/claim-warranty-list')
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
  }

  return (
    <section id='warranty-form'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko :{' '}
                  <span className='fs-4 ms-2 fw-normal'>{orderDetail?.store.store_name}</span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Order ID : <span className='fs-4 ms-2 fw-normal'>{orderDetail?.id}</span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Receipt Number :
                  <span className='fs-4 ms-2 fw-normal'>{orderDetail?.receipt_number ?? '-'}</span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-4 fw-bold'>
                  Order Status :
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
                        <Form.Control
                          plaintext
                          readOnly
                          value={orderDetail?.members?.member_number}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Customer Name :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control plaintext readOnly value={orderDetail?.members.full_name} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Alamat Pemasangan :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control
                          as='textarea'
                          plaintext
                          readOnly
                          rows={3}
                          value={orderDetail?.project_address}
                        />
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Nomor Telp/WA :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control plaintext readOnly value={orderDetail?.project_number} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Alamat Email :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control plaintext readOnly value={orderDetail?.members?.email} />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='sales-info mb-5'>
                <div className='fs-3 fw-bold'>Informasi Penjual</div>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Sales ID :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Control plaintext readOnly value={orderDetail?.sales?.id} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Sales Person :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Control plaintext readOnly value={orderDetail?.sales?.full_name} />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <Row className='table-warranty d-flex align-items-center mb-5'>
            <div className='table-title-warranty'>
              <div className='fs-3 fw-bold'>Informasi Pemasangan</div>

              <Form.Group as={Row} className='mb-3' controlId='formPlaintextEmail'>
                <Form.Label column sm='3'>
                  Tanggal request pemasangan :
                </Form.Label>
                <Col sm='9'>
                  <Form.Control
                    type='text'
                    plaintext
                    readOnly
                    value={orderDetail ? formatDate(new Date(orderDetail.request_survey)) : ''}
                  />
                </Col>
              </Form.Group>
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
                      <tr key={`${index} - order_detail`}>
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
                        <td colSpan={3} className='text-end fw-bolder'>
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

          <Row className='claim-warranty-form d-flex align-items-start mt-5 mb-5'>
            <div className='fs-3 fw-bold text-uppercase mb-3'>Formulir Claim</div>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <div className='fs-5 fw-normal'>Tanggal Pengajuan Claim</div>
              <Form.Control type='date' onChange={handleChangeDate} min={today} />
            </Col>

            <Col xs={12} md={8} lg={8} xl={8} xxl={8} className='mb-3'>
              <div className='fs-5 fw-normal'>Alasan Claim</div>
              <Form.Control as='textarea' onChange={handleChangeDescription} rows={3} />
            </Col>
          </Row>

          <div className='button-submit d-flex justify-content-center align-items-center'>
            <Button variant='dark-primary' onClick={handleSubmitWarrantyClaim}>
              Ajukan Claim
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {WarrantyFormClaim}
