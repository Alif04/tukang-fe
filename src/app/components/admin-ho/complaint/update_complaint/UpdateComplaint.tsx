import React, {FC, useState, useEffect, useRef, ChangeEvent} from 'react'

import './UpdateComplaint.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Image} from 'antd'
import {useNavigate, useParams} from 'react-router-dom'
import {Row, Col, Form, Table, Button, ListGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface OptionRemedialStatus {
  value: any
  label: string
}

const UpdateComplaintHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()

  const userId = localStorage.getItem('user_id') as any

  // Complaint Detail
  const [orderDetail, setOrderDetail] = useState<any>()

  const [complaintId, setComplaintId] = useState<any>()
  const [complaintDetail, setComplaintDetail] = useState<any>()

  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)

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
          if (data?.id) {
            setComplaintId(data.id)
          }

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

  const fetchRemedialStatus = async () => {
    try {
      const response = await axios.get(`${apiUrl}/status`, {
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
          label: item.category,
        }))

        setOptionRemedialStatus(tempComplaintChannel)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchComplaintData()
    fetchRemedialStatus()
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

  // Add Remedial Action
  const [picRemedialId, setPicRemedialId] = useState<any>()
  const [remedialDesc, setRemedialDesc] = useState<any>('')
  const [remedialStartDate, setremedialStartDate] = useState<string>('')
  const [remedialEndDate, setremedialEndDate] = useState<string>('')
  const [remedialEvidence, setRemedialEvidence] = useState<Array<File | null>>([])

  const evidenceRef = useRef<HTMLInputElement>(null)

  // Remedial Status
  const [optionRemedialStatus, setOptionRemedialStatus] = useState<OptionRemedialStatus[]>([])
  const [optionRemedialStatusId, setOptionRemedialStatusId] = useState<string>('')
  const [optionRemedialStatusName, setOptionRemedialStatusName] = useState<string>('')

  // PIC Remedial
  useEffect(() => {
    const updatedPicRemedial = userId.toString()
    setPicRemedialId(updatedPicRemedial)
  }, [userId])

  // Handle Input Change
  const handleInputRemedialDesc = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedInputValue = event.target.value
    setRemedialDesc(updatedInputValue)
  }

  // Handle Change Remedial Status
  const handleChangeSelectRemedialStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedOptionRemedialStatusId = event.target.value
    setOptionRemedialStatusId(updatedOptionRemedialStatusId)
  }

  // const handleChangeSelectRemedialStatus = (element: any) => {
  //   const updatedOptionRemedialStatusId = element.value
  //   const updatedOptionRemedialStatusName = element.label

  //   setOptionRemedialStatusId(updatedOptionRemedialStatusId)
  //   setOptionRemedialStatusName(updatedOptionRemedialStatusName)
  // }

  // Handle Complaint Date Change
  const today = new Date().toISOString().split('T')[0]

  const handleChangeremedialStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedremedialStartDate = event.target.value
    setremedialStartDate(updatedremedialStartDate)
  }

  const handleChangeremedialEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedremedialEndDate = event.target.value
    setremedialEndDate(updatedremedialEndDate)
  }

  // Handle Change Upload File
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files

    if (fileList && fileList.length <= 5) {
      const file: Array<File | null> = new Array<File>()
      const existingFiles = [...remedialEvidence]
      const mergedFiles = existingFiles.concat(file)

      const {length: existingFilesLength} = existingFiles
      const {length: fileListLength} = fileList

      for (let i = 0; i < fileListLength; i++) {
        mergedFiles[existingFilesLength + i] = fileList.item(i)
      }

      setRemedialEvidence(mergedFiles)
    } else {
      Swal.fire({
        title: 'Error',
        text: 'File yang diupload maksimal 5',
        icon: 'error',
        showConfirmButton: false,
        timer: 2000,
      })
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = (index: number) => {
    const newEvidances = [...remedialEvidence]

    newEvidances.splice(index, 1)

    setRemedialEvidence(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  // Remedial Validation
  const RemedialValidation = () => {
    let valid = true

    if (!remedialDesc) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill remedial notes form',
        icon: 'error',
      })
      valid = false
    } else if (!remedialStartDate) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill remedial start date form',
        icon: 'error',
      })
      valid = false
    } else if (!remedialEndDate) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill remedial end date form',
        icon: 'error',
      })
      valid = false
    } else if (!optionRemedialStatus) {
      Swal.fire({
        title: 'Error',
        text: 'Please select remedial status',
        icon: 'error',
      })
      valid = false
    } else if (!remedialEvidence) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill remedial evidence form',
        icon: 'error',
      })
      valid = false
    }
    return valid
  }

  // Handle Submit Remedial Action
  const handleSubmitRemedialAction = async () => {
    if (RemedialValidation()) {
      const formData = new FormData()

      formData.append('complaint_id', complaintId)
      formData.append('remedial_action', remedialDesc)
      formData.append('ra_date_start', remedialStartDate)
      formData.append('ra_date_end', remedialEndDate)
      formData.append('remedial_pic', picRemedialId)
      formData.append('remedial_status', optionRemedialStatusId)

      if (remedialEvidence?.length) {
        remedialEvidence.forEach((item) => {
          if (item) {
            formData.append(`remedial_evidences`, item, item?.name)
          }
        })
      }

      const response = await axios
        .post(`${apiUrl}/remedials`, formData, {
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
              text: 'Success Update Complaint',
              icon: 'success',
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

  const handleCancelRemedial = () => {
    navigate('/complaint/view-complaint')
  }

  return (
    <section id='update-complaint'>
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
                      <tr key={index}>
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
                      {orderDetail?.payment_type === 'GRATIS'
                        ? `                      Rp. ${0?.toLocaleString(
                            'id'
                          )}                        `
                        : orderDetail?.payment_type === 'BERBAYAR'
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
            <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
              <div className='fs-3 fw-bold text-danger'>COMPLAINT HISTORY</div>

              <Row>
                <Col>
                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='7'>
                      Complaint ID :
                    </Form.Label>
                    <Col sm='5'>
                      <Form.Control type='text' plaintext readOnly value={complaintDetail?.id} />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='7'>
                      Complaint Channel :
                    </Form.Label>
                    <Col sm='5'>
                      <Form.Control
                        plaintext
                        readOnly
                        value={complaintDetail?.complaint_channels.name}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Label className='mt-3'>Complaint Detail :</Form.Label>
                  <Form.Control
                    style={{minHeight: '200px'}}
                    as='textarea'
                    plaintext
                    readOnly
                    value={complaintDetail?.description}
                  ></Form.Control>
                </Col>

                <Col>
                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='7'>
                      Complaint Date :
                    </Form.Label>
                    <Col sm='5'>
                      <Form.Control
                        type='text'
                        plaintext
                        readOnly
                        value={
                          complaintDetail
                            ? formatDate(new Date(complaintDetail.complaint_date))
                            : ''
                        }
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='7'>
                      Complaint Handler :
                    </Form.Label>
                    <Col sm='5'>
                      <Form.Control plaintext readOnly defaultValue='HO' />
                    </Col>
                  </Form.Group>

                  <Form.Label className='mt-3'>Complaint Evidence :</Form.Label>
                  <ListGroup>
                    {complaintDetail?.complaint_evidence.map((item: any) => (
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
                        src={`${apiUrl}/public/complaints/${previewImage}`}
                        preview={{
                          visible,
                          src: `${apiUrl}/public/complaints/${previewImage}`,
                          onVisibleChange: (value) => {
                            setVisible(value)
                          },
                        }}
                      />
                    </div>
                  )}
                </Col>
              </Row>
            </Col>

            <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
              <div className='fs-3 fw-bold text-success'>REMEDIAL ACTION</div>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label className='mt-3'>Start Date :</Form.Label>
                    <Form.Control
                      type='date'
                      min={today}
                      onChange={handleChangeremedialStartDate}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className='mt-3'>Change Status :</Form.Label>

                    <Form.Select onChange={handleChangeSelectRemedialStatus}>
                      <option selected>Select Status</option>
                      <option value='3'>INVESTIGATE</option>
                      <option value='19'>ACCEPT</option>
                      <option value='21'>REJECT</option>
                      <option value='1005'>REWORKREQ</option>
                      <option value='1004'>REWORKSTART</option>
                      <option value='24'>REWORKEND</option>
                      <option value='1006'>RESURVEYREQ</option>
                      <option value='22'>RESCHEDULE</option>
                      <option value='18'>REFUND</option>
                      <option value='1007'>DONE</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className='mt-5'>Notes :</Form.Label>
                    <Form.Control
                      style={{minHeight: '200px'}}
                      as='textarea'
                      onChange={handleInputRemedialDesc}
                    ></Form.Control>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label className='mt-3'>End Date :</Form.Label>
                    <Form.Control type='date' min={today} onChange={handleChangeremedialEndDate} />
                  </Form.Group>

                  <Form.Group controlId='formFile'>
                    <Form.Label>Upload Bukti</Form.Label>
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
                      {remedialEvidence.length ? (
                        remedialEvidence.map((item, index) => (
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
            </Col>
          </Row>

          <div className='d-flex justify-content-center align-items-center mt-5'>
            <Button
              variant='dark-danger'
              className='d-flex justify-content-center align-items-center'
              type='submit'
              onClick={handleCancelRemedial}
            >
              Cancel
            </Button>

            <Button
              variant='dark-primary'
              className='d-flex justify-content-center align-items-center'
              type='submit'
              onClick={handleSubmitRemedialAction}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {UpdateComplaintHO}
