import React, {FC, useRef} from 'react'
import {useState, useEffect} from 'react'

import './NewComplaint.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, Table, Button, ListGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface ComplaintChannel {
  value: BigInteger
  label: string
}

const NewComplaintTukang: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  // Fetch Data Order
  const [order, setOrder] = useState<any>()
  const [orderId, setOrderId] = useState<string>('')
  const [orderDetail, setOrderDetail] = useState<any>()
  const [complaintChannel, setComplaintChannel] = useState<ComplaintChannel[]>([])
  const [complaintChannelId, setComplaintChannelId] = useState<string>('')
  const [complaintCode, setComplaintCode] = useState<string | number>('NaN')

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
        .get(`${apiUrl}/orders/${orderId}`, {
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

  const getComplaintChannel = async () => {
    try {
      const response = await axios.get(`${apiUrl}/complaint-channels`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempComplaintChannel = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        }))

        setComplaintChannel(tempComplaintChannel)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getCode = async () => {
    try {
      const response = await axios.get(`${apiUrl}/complaints/next-code`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      console.log(response, response.status)

      if (response.status === 200) {
        const {data} = response
        setComplaintCode(data.data.code)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getOrder()
    getComplaintChannel()
    getCode()
  }, [])

  useEffect(() => {
    if (orderId) {
      getOrderDetail()
    }
  }, [orderId])

  const phoneNumber =
    orderDetail?.members.phone_number !== null
      ? orderDetail?.members.phone_number
      : orderDetail?.members.whatsapp_number

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Select Order
  const handleChangeSelectOrder = (element: any) => {
    const selectedOrder = element.value
    setOrderId(selectedOrder)
  }

  // Add Complaint
  const [complaintDesc, setComplaintDesc] = useState<any>('')
  const [complaintDate, setComplaintDate] = useState<string>('')
  const [complaintStatus, setComplaintStatus] = useState<any>()
  const [complaintEvidence, setComplaintEvidence] = useState<Array<File | null>>([])

  const evidenceRef = useRef<HTMLInputElement>(null)

  // Complaint Status
  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatus = statusData.find((status: any) => status.category === 'INVESTIGATED')
    const statusId = desiredStatus?.value

    setComplaintStatus(statusId)
  }, [complaintStatus])

  // Handle Input Change
  const handleInputComplaintDesc = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedInputValue = event.target.value
    setComplaintDesc(updatedInputValue)
  }

  // Handle Complaint Date Change
  const today = new Date().toISOString().split('T')[0]

  const handleChangeComplaintDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedComplaintDate = event.target.value
    setComplaintDate(updatedComplaintDate)
  }

  // Handle Change Upload File
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const {length} = fileList

      for (let i = 0; i < length; i++) {
        file[i] = fileList.item(i)
      }

      setComplaintEvidence(file)
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = (index: number) => {
    const newEvidances = [...complaintEvidence]

    newEvidances.splice(index, 1)

    setComplaintEvidence(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  // Handle Change Complaint Channel
  const handleChangeSelectComplaintChannel = (element: any) => {
    const updatedSelectComplaintChannel = element.value
    setComplaintChannelId(updatedSelectComplaintChannel)
  }

  // Complaint Validation
  const ComplaintValidation = () => {
    let valid = true

    if (!orderId) {
      Swal.fire({
        title: 'Error',
        text: 'Please select order Id',
        icon: 'error',
      })
      valid = false
    } else if (!complaintDesc) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill complaint description form',
        icon: 'error',
      })
      valid = false
    } else if (!complaintChannelId) {
      Swal.fire({
        title: 'Error',
        text: 'Please select complaint channel',
        icon: 'error',
      })
      valid = false
    } else if (!complaintDate) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill complaint date form',
        icon: 'error',
      })
      valid = false
    } else if (!complaintEvidence) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill complaint evidence form',
        icon: 'error',
      })
      valid = false
    }
    return valid
  }

  // Handle Submit Complaint
  const handleSubmitNewComplaint = async () => {
    if (ComplaintValidation()) {
      const formData = new FormData()

      formData.append('order_id', orderId)
      formData.append('description', complaintDesc)
      formData.append('complaint_channel', complaintChannelId)
      formData.append('complaint_date', complaintDate)
      formData.append('complaint_status', complaintStatus)

      if (complaintEvidence?.length) {
        complaintEvidence.forEach((item) => {
          if (item) {
            formData.append(`complaint_evidences`, item, item?.name)
          }
        })
      }

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
              text: 'Success Add Complaint',
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

          navigate('/complaint/view-complaint')
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

  const handleCancelComplaint = () => {
    navigate('/complaint/view-complaint')
  }

  return (
    <section id='new-complaint'>
      <div className='card'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko :
                  <span className='fs-4 ms-2 fw-normal'>{orderDetail?.store.store_name || ''}</span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-4 fw-bold'>
                  Complaint ID :<span className='fs-4 ms-2 fw-normal'> {complaintCode} </span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group as={Row} className='order-id-complaint'>
                  <Form.Label column sm='3' className='fs-4 fw-bold'>
                    Order ID :
                  </Form.Label>
                  <Col sm='9'>
                    <Select
                      name='order-id'
                      className='form-control p-0'
                      placeholder='Ketik/Pilih Order Id'
                      isSearchable={true}
                      options={order}
                      onChange={(e) => handleChangeSelectOrder(e)}
                    />
                  </Col>
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Receipt Number :
                  <span className='fs-4 ms-2 fw-normal'>{orderDetail?.receipt_number || ''}</span>
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
                        <Form.Control plaintext readOnly value={orderDetail?.members.id || ''} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Customer Name :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control
                          plaintext
                          readOnly
                          value={orderDetail?.members.full_name || ''}
                        />
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
                          value={orderDetail?.project_address || ''}
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
                        <Form.Control plaintext readOnly value={phoneNumber || ''} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Alamat Email :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control plaintext readOnly value={orderDetail?.members.email || ''} />
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
                    <Form.Control plaintext readOnly value={orderDetail?.sales.id || ''} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Sales Person :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Control plaintext readOnly value={orderDetail?.sales.full_name || ''} />
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
                    value={orderDetail ? formatDate(new Date(orderDetail?.created_at)) : ''}
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
                    <th>Harga Jasa</th>
                    <th>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetail?.order_details.map((item: any, index: any) => (
                    <>
                      <tr>
                        <td>{item?.item_id}</td>
                        <td>{item?.unit}</td>
                        <td>{item?.item?.category_name}</td>
                        <td>{item?.quantity}</td>
                        <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString('id')}`}</td>
                        <td>{`Rp. ${item?.total.toLocaleString('id')}`}</td>
                      </tr>
                    </>
                  ))}

                  <tr>
                    <td colSpan={5} className='text-end fw-bolder'>
                      Biaya Survey
                    </td>
                    <td className=' fw-bolder'>
                      {orderDetail?.payment_type === 'gratis' ||
                      orderDetail?.payment_type === 'pemasangan_tanpa_survey'
                        ? `                      Rp. ${0?.toLocaleString(
                            'id'
                          )}                        `
                        : orderDetail?.payment_type === 'survey'
                        ? `                      Rp. ${99000?.toLocaleString(
                            'id'
                          )}                        `
                        : `Rp. ${0}`}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={5} className='text-end fw-bolder'>
                      Grand Total
                    </td>
                    <td className=' fw-bolder'>
                      Rp. {parseInt(orderDetail?.grand_total || 0)?.toLocaleString('id')}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Row>

          <hr />

          <Row className='mb-5'>
            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Group className='mb-3'>
                <Form.Label>Tanggal Komplain :</Form.Label>
                <Form.Control type='date' onChange={handleChangeComplaintDate} min={today} />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>Komplain melalui : </Form.Label>
                <Select
                  name='complaint_channel_id'
                  className='form-control p-0'
                  classNamePrefix='select'
                  placeholder='Complaint Via'
                  isSearchable={true}
                  options={complaintChannel}
                  onChange={(e) => handleChangeSelectComplaintChannel(e)}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Label>Alasan :</Form.Label>
              <Form.Control
                style={{minHeight: '250px'}}
                as='textarea'
                value={complaintDesc}
                onChange={handleInputComplaintDesc}
              ></Form.Control>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Group controlId='formFile'>
                <Form.Label>UPLOAD BUKTI COMPLAINT</Form.Label>
                <Form className='form-input-image' onClick={handleImageClick}>
                  <Form.Control
                    type='file'
                    accept='image/*'
                    className='input-field-image'
                    multiple
                    hidden
                    id='file-input'
                    ref={evidenceRef}
                    onChange={handleFileChange}
                  />

                  <div className='input-image-text'>
                    <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                    <p>Add File</p>
                  </div>
                </Form>

                <ListGroup className='pt-3'>
                  {complaintEvidence.length ? (
                    complaintEvidence.map((item, index) => (
                      <ListGroup.Item
                        key={`${item?.name}-${index}-${item?.type}`}
                        className='d-flex justify-content-between'
                      >
                        <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                        <span className='upload-content'> {item?.name}</span>

                        <FontAwesomeIcon
                          icon={faTrash}
                          size='sm'
                          color='#ed2b2a'
                          style={{cursor: 'pointer'}}
                          onClick={(e) => handleRemoveFile(index)}
                        />
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item className='d-flex justify-content-center'>
                      Tidak ada file yang dipilih
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Form.Group>
            </Col>
          </Row>

          <div className='d-flex justify-content-center align-items-center mt-5'>
            <Button
              variant='dark-danger'
              className='d-flex justify-content-center align-items-center'
              type='submit'
              onClick={handleCancelComplaint}
            >
              Cancel
            </Button>

            <Button
              variant='dark-primary'
              className='d-flex justify-content-center align-items-center'
              type='submit'
              onClick={handleSubmitNewComplaint}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewComplaintTukang}
