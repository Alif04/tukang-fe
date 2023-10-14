import React, {FC, useState, useEffect} from 'react'

import './DetailComplaint.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {Row, Col, Form, ListGroup, Table, Button} from 'react-bootstrap'
import {Image} from 'antd'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

const DetailComplaintStore: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()

  const [orderDetail, setOrderDetail] = useState<any>()
  const [complaintDetail, setComplaintDetail] = useState<any>()

  const fetchComplaintData = async () => {
    try {
      await axios
        .get(`${apiUrl}/complaints/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data
          setComplaintDetail(data)
        })
    } catch (error) {
      console.error(error)
    }
  }

  const fetchOrderData = async () => {
    const orderId = complaintDetail?.order_id
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
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchComplaintData()
  }, [])

  useEffect(() => {
    if (complaintDetail) {
      fetchOrderData()
    }
  }, [complaintDetail])

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

  // Add Feedback

  const [memberName, setMemberName] = useState<string>('')
  const [position, setPosition] = useState<string>('')
  const [feedbackDesc, setFeedbackDesc] = useState<any>('')
  const [feedbackDate, setFeedbackDate] = useState<string>('')
  const [evidenceComplaint, setEvidenceComplaint] = useState<string>('No selected file')
  const [image, setImage] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  // Handle Input Change
  const handleInputMemberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedInputValue = event.target.value
    setMemberName(updatedInputValue)
  }

  const handleInputPositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedInputValue = event.target.value
    setPosition(updatedInputValue)
  }

  const handleInputFeedbackDesc = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedInputValue = event.target.value
    setFeedbackDesc(updatedInputValue)
  }

  // Handle Feedback Date Change
  const handleChangeFeedbackDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFeedbackDate = event.target.value
    setFeedbackDate(updatedFeedbackDate)
  }

  // Handle Upload File
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      setEvidenceComplaint(files[0].name)
      setImage(URL.createObjectURL(files[0]))
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = () => {
    setEvidenceComplaint('No selected file')
    setImage(null)
  }

  // Handle Submit Feedback
  const handleSubmitNewFeedback = async () => {
    try {
      const formData = new FormData()

      formData.append('member_name', memberName)
      formData.append('position', position)
      formData.append('feedback_date', feedbackDate)
      formData.append('feedback_desc', feedbackDesc)
      formData.append('evidence_feedback', evidenceComplaint)

      console.log(formData)

      // const response = await axios.post(`${apiUrl}/feedback/create`, formData, {
      //   headers: {
      //     Accept: 'application/json',
      //     Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      //     'Access-Control-Allow-Origin': '*',
      //     'ngrok-skip-browser-warning': 'true',
      //   },
      // })

      // Swal.fire({
      //   title: 'Success',
      //   text: 'Success update realization',
      //   icon: 'success',
      // })

      // navigate('/complaint/view-complaint')
    } catch (error) {
      console.error(error)

      Swal.fire({
        title: 'Error',
        text: 'Cant Add Order',
        icon: 'error',
      })
    }
  }

  const handleCancel = () => {
    navigate('/complaint/view-complaint')
  }

  return (
    <section id='detail-complaint'>
      <div className='card'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko :{' '}
                  <span className='fs-4 ms-2 fw-normal'>{orderDetail?.store.store_name}</span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-4 fw-bold'>
                  Complaint ID : <span className='fs-4 ms-2 fw-normal'>{complaintDetail?.id}</span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Order ID : <span className='fs-4 ms-2 fw-normal'>{orderDetail?.id}</span>
                </Form.Label>

                <Form.Group as={Row}>
                  <Form.Label column sm='4' className='fs-4 fw-bold m-0'>
                    Order Date :
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control
                      type='text'
                      plaintext
                      readOnly
                      value={orderDetail ? formatDate(new Date(orderDetail.created_at)) : ''}
                    />
                  </Col>
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Receipt Number :{' '}
                  <span className='fs-4 ms-2 fw-normal'>{orderDetail?.receipt_number}</span>
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
                        <Form.Control plaintext readOnly value={orderDetail?.members.id} />
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
                      <Form.Label column sm='4'>
                        Nomor Telp/WA :
                      </Form.Label>
                      <Col sm='8'>
                        <Form.Control plaintext readOnly value={phoneNumber} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='4'>
                        Alamat Email :
                      </Form.Label>
                      <Col sm='8'>
                        <Form.Control plaintext readOnly value={orderDetail?.members.email} />
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
                    <Form.Control plaintext readOnly value={orderDetail?.sales.id} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Sales Person :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Control plaintext readOnly value={orderDetail?.sales.full_name} />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <Row className='table-warranty d-flex align-items-center mb-5'>
            <div className='table-title-warranty mb-2'>
              <div className='fs-3 fw-bold'>Informasi Pemasangan</div>
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
                        <td>{item?.status?.description}</td>
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

          <Row>
            <div className='fs-3 fw-bold text-uppercase text-decoration-underline'>
              COMPLAINT HISTORY
            </div>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  Complaint Date :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control
                    type='text'
                    plaintext
                    readOnly
                    value={
                      complaintDetail ? formatDate(new Date(complaintDetail.complaint_date)) : ''
                    }
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  Complaint via :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control
                    plaintext
                    readOnly
                    value={complaintDetail?.complaint_channels.name}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  PIC Complaint :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control plaintext readOnly value={orderDetail?.members.full_name} />
                </Col>
              </Form.Group>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <Form.Label className='mt-3'>Complaint Detail :</Form.Label>
              <Form.Control
                style={{minHeight: '200px'}}
                as='textarea'
                plaintext
                readOnly
                value={complaintDetail?.description}
              ></Form.Control>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <Form.Label className='mt-3'>Complaint Evidence :</Form.Label>
              <ListGroup>
                {complaintDetail?.complaint_evidence.map((item: any) => (
                  <ListGroup.Item action onClick={() => setVisible(true)}>
                    {item.evidence_location}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>

          {/* <hr /> */}

          {/* <Row>
            <Col xs={12} md={8} lg={8} xl={8} xxl={8} className='mb-3'>
              <Form.Label className='fs-3 fw-bold'>Feedback Store :</Form.Label>
              <Form.Control
                style={{minHeight: '170px'}}
                as='textarea'
                value={feedbackDesc}
                onChange={handleInputFeedbackDesc}
              ></Form.Control>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Group controlId='formFile'>
                <Form.Label className='fs-3 fw-normal'>UPLOAD BUKTI</Form.Label>
                <Form className='form-input-image' onClick={handleImageClick}>
                  <Form.Control
                    type='file'
                    accept='image/*'
                    className='input-field-image'
                    hidden
                    onChange={handleFileChange}
                  />

                  {image ? (
                    <img src={image} alt={evidenceComplaint} className='image-preview' />
                  ) : (
                    <div className='input-image-text'>
                      <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                      <p>Add File</p>
                    </div>
                  )}
                </Form>

                <div className='uploaded-row'>
                  <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                  <span className='upload-content'>{evidenceComplaint}</span>

                  <FontAwesomeIcon
                    icon={faTrash}
                    size='sm'
                    color='#ed2b2a'
                    style={{cursor: 'pointer'}}
                    onClick={handleRemoveFile}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row> */}
          {/* 
          <Row>
            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Group>
                <Form.Label>Nama Pemberi Feedback</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='John Doe'
                  value={memberName}
                  onChange={handleInputMemberChange}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Group>
                <Form.Label>Jabatan</Form.Label>
                <Form.Control type='text' value={position} onChange={handleInputPositionChange} />
              </Form.Group>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Group>
                <Form.Label>Tanggal Feedback : </Form.Label>
                <Form.Control type='date' onChange={handleChangeFeedbackDate} />
              </Form.Group>
            </Col>
          </Row> */}

          {/* <div className='d-flex justify-content-center align-items-center mt-5'>
            <Button
              variant='dark-danger'
              className='d-flex justify-content-center align-items-center'
              type='submit'
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button
              variant='dark-primary'
              className='d-flex justify-content-center align-items-center'
              type='submit'
              onClick={handleSubmitNewFeedback}
            >
              Submit
            </Button>
          </div> */}

          {/* <hr />

          <div className='card'>
            <div className='card-body'>
              <Row>
                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Complaint Date :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control type='date' plaintext readOnly />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Complaint via :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Call' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      PIC Complaint :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Nuning' />
                    </Col>
                  </Form.Group>
                </Col>

                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Label className='mt-3'>Complaint Detail :</Form.Label>
                  <Form.Control
                    style={{minHeight: '200px'}}
                    as='textarea'
                    plaintext
                    readOnly
                    defaultValue='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
                        in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat'
                  ></Form.Control>
                </Col>

                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Label className='mt-3'>Complaint Evidence :</Form.Label>
                  <ListGroup>
                    <ListGroup.Item action onClick={() => setVisible(true)}>
                      342344.png
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => setVisible(true)}>
                      848735.png
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => setVisible(true)}>
                      Complaint.docx
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </div>
          </div> */}
        </div>
      </div>

      <Image
        width={200}
        style={{display: 'none'}}
        src='https://images.unsplash.com/photo-1682686580433-2af05ee670ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60'
        preview={{
          visible,
          src: 'https://images.unsplash.com/photo-1682686580433-2af05ee670ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=500&q=60',
          onVisibleChange: (value) => {
            setVisible(value)
          },
        }}
      />
    </section>
  )
}

export {DetailComplaintStore}
