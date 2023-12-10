import React, {FC, useState, useEffect, useRef} from 'react'

import './DetailComplaint.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select from 'react-select'
import {useNavigate, useParams} from 'react-router-dom'
import {Row, Col, Form, ListGroup, Table, Button} from 'react-bootstrap'
import {Image} from 'antd'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface Member {
  value: any
  label: string
}

const DetailComplaintStore: FC<{updatePageTitle: (complaint: any) => void}> = ({
  updatePageTitle,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()

  const [complaintId, setComplaintId] = useState<any>()
  const [complaintStatusApprove, setComplaintStatusApprove] = useState<any>()
  const [complaintStatusCancel, setComplaintStatusCancel] = useState<any>()
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
          setComplaintDetail(data)
          updatePageTitle(data)

          if (data?.id) {
            setComplaintId(data.id)
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  const getCostumer = async () => {
    try {
      const response = await axios.get(`${apiUrl}/member`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      if (Array.isArray(response.data.data.member)) {
        const tempMember = response.data.data.member.map((item: any) => ({
          value: item.id,
          label: item.full_name,
        }))

        setPicFeedback(tempMember)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchComplaintData()
    getCostumer()
  }, [])

  // Complaint Status Approve
  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatusApprove = statusData.find((status: any) => status.category === 'ACCEPTED')
    const statusApproveId = desiredStatusApprove.value

    const desiredStatusCancel = statusData.find((status: any) => status.category === 'REJECTED')
    const statusCancelId = desiredStatusCancel.value

    setComplaintStatusApprove(statusApproveId)
    setComplaintStatusCancel(statusCancelId)
  }, [complaintStatusApprove, complaintStatusCancel])

  const phoneNumber =
    complaintDetail?.orders.members.phone_number !== null
      ? complaintDetail?.orders.members.phone_number
      : complaintDetail?.orders.members.whatsapp_number

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // PIC Feedback
  const [picFeedbackId, setPicFeedbackId] = useState<any>()
  const [picFeedback, setPicFeedback] = useState<Member[]>([])
  const [picFeedbackName, setPicFeedbackName] = useState<string>('')

  // Add Feedback

  const [feedbackStatus, setFeedbackStatusId] = useState<any>()
  const [feedbackDesc, setFeedbackDesc] = useState<any>('')
  const [feedbackStartDate, setFeedbackStartDate] = useState<string>('')
  const [feedbackEvidence, setFeedbackEvidence] = useState<Array<File | null>>([])

  const evidenceRef = useRef<HTMLInputElement>(null)

  // Feedback Status
  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatusName = 'FEEDBACK'
    const desiredStatus = statusData.find((status: any) => status.category === desiredStatusName)
    const statusId = desiredStatus.value

    setFeedbackStatusId(statusId)
  }, [feedbackStatus])

  const handlePicFeedbackChange = (element: Member | null) => {
    const newMemberInfo: Member = {
      value: element?.value || 0,
      label: element?.label || '',
    }

    setPicFeedbackId(newMemberInfo.value)
    setPicFeedbackName(newMemberInfo.label)
  }

  // Handle Change Feedback Desc
  const handleInputFeedbackDesc = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedInputValue = event.target.value
    setFeedbackDesc(updatedInputValue)
  }

  // Handle Feedback Date Change
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setFeedbackStartDate(today)
  }, [])

  // Handle Upload File
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files

    if (fileList && fileList.length <= 5) {
      const file: Array<File | null> = new Array<File>()
      const {length} = fileList

      for (let i = 0; i < length; i++) {
        file[i] = fileList.item(i)
      }

      setFeedbackEvidence(file)
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
    const newEvidances = [...feedbackEvidence]

    newEvidances.splice(index, 1)

    setFeedbackEvidence(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  // Feedback Validation
  const FeedbackValidation = () => {
    let valid = true

    if (!picFeedback) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill PIC Feedback form',
        icon: 'error',
      })
      valid = false
    } else if (!feedbackDesc) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill feedback store description form',
        icon: 'error',
      })
      valid = false
    } else if (!feedbackEvidence) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill feedback evidence form',
        icon: 'error',
      })
      valid = false
    }
    return valid
  }

  // Handle Submit Feedback
  const handleSubmitNewFeedback = async () => {
    if (FeedbackValidation()) {
      const formData = new FormData()

      formData.append('complaint_id', complaintId)
      formData.append('remedial_action', feedbackDesc)
      formData.append('ra_date_start', feedbackStartDate)
      formData.append('remedial_pic', picFeedbackId)
      formData.append('remedial_status', feedbackStatus)

      if (feedbackEvidence?.length) {
        feedbackEvidence.forEach((item) => {
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
              text: 'Success Add Feedback',
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

  // Cancel Complaint
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
                  Nama Toko :
                  <span className='fs-4 ms-2 fw-normal'>
                    {complaintDetail?.orders.store.store_name}
                  </span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-4 fw-bold'>
                  Complaint ID : <span className='fs-4 ms-2 fw-normal'>{complaintDetail?.id}</span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Order ID :
                  <span className='fs-4 ms-2 fw-normal'>{complaintDetail?.orders.id}</span>
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
                      value={
                        complaintDetail?.orders
                          ? formatDate(new Date(complaintDetail?.orders?.request_survey))
                          : ''
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Receipt Number :
                  <span className='fs-4 ms-2 fw-normal'>
                    {complaintDetail?.orders.receipt_number ?? '-'}
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
                          value={complaintDetail?.orders.members.id}
                        />
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
                          value={complaintDetail?.orders.members.full_name}
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
                          value={complaintDetail?.orders.project_address}
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
                        <Form.Control
                          plaintext
                          readOnly
                          value={complaintDetail?.orders.members.email}
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='sales-info mb-5'>
                <Row>
                  <div className='fs-3 fw-bold'>Informasi Penjual</div>

                  <div className='d-flex'>
                    <Form.Group as={Row}>
                      <Form.Label column md='4'>
                        Sales ID :
                      </Form.Label>

                      <Col md='8'>
                        <Form.Control plaintext readOnly value={complaintDetail?.orders.sales.id} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                      <Form.Label column md='5'>
                        Sales Person :
                      </Form.Label>

                      <Col md='7'>
                        <Form.Control
                          plaintext
                          readOnly
                          value={complaintDetail?.orders.sales.full_name}
                        />
                      </Col>
                    </Form.Group>
                  </div>
                </Row>

                <Row>
                  <div className='fs-3 fw-bold'>Informasi Vendor Pemasangan</div>

                  <div className='d-flex'>
                    <Form.Group as={Row}>
                      <Form.Label column md='5'>
                        Vendor Name :
                      </Form.Label>

                      <Col md='7'>
                        <Form.Control
                          plaintext
                          readOnly
                          value={complaintDetail?.orders?.vendor?.company_name ?? '-'}
                        />
                      </Col>
                    </Form.Group>
                  </div>
                </Row>
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
                    <th>Nama Jasa Pemasangan</th>
                    <th>QTY Pemasangan</th>
                    {!(
                      complaintDetail?.orders?.payment_type === 'gratis' ||
                      complaintDetail?.orders?.payment_type === 'survey'
                    ) && (
                      <>
                        <th>Harga Jasa</th>
                        <th>Jumlah</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {complaintDetail?.orders.m_order_details.map((item: any, index: any) => (
                    <>
                      <tr key={`${index} - detail-order`}>
                        <td>{item?.item_id}</td>
                        <td>{item?.item_name}</td>
                        <td>{item?.item?.service_name ?? '-'}</td>
                        <td>{item?.quantity}</td>
                        {!(
                          complaintDetail?.orders?.payment_type === 'gratis' ||
                          complaintDetail?.orders?.payment_type === 'survey'
                        ) && (
                          <>
                            <td>{`Rp. ${parseInt(item?.unit_price || 0).toLocaleString('id')}`}</td>
                            <td>{`Rp. ${parseInt(item?.total || 0).toLocaleString('id')}`}</td>
                          </>
                        )}
                      </tr>
                    </>
                  ))}

                  {complaintDetail?.orders?.payment_type !== 'gratis' &&
                    complaintDetail?.orders?.payment_type !== 'pemasangan_tanpa_survey' && (
                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Biaya Survey
                        </td>

                        <td className=' fw-bolder'>
                          {complaintDetail?.orders?.payment_type === 'gratis' ||
                          complaintDetail?.orders?.payment_type === 'pemasangan_tanpa_survey'
                            ? `Rp. ${(0).toLocaleString('id')}`
                            : complaintDetail?.orders?.payment_type === 'survey'
                            ? `Rp. ${(99000).toLocaleString('id')}`
                            : `Rp. ${0}`}
                        </td>
                      </tr>
                    )}

                  {complaintDetail?.orders?.payment_type !== 'survey' && (
                    <tr>
                      <td
                        colSpan={complaintDetail?.orders?.payment_type !== 'gratis' ? 5 : 3}
                        className='text-end fw-bolder'
                      >
                        Grand Total
                      </td>

                      <td className=' fw-bolder'>
                        {(() => {
                          if (complaintDetail?.orders?.payment_type === 'gratis') {
                            return `Rp. ${(0).toLocaleString('id')}`
                          } else if (
                            complaintDetail?.orders?.payment_type === 'pemasangan_tanpa_survey'
                          ) {
                            return `Rp. ${parseInt(
                              complaintDetail?.orders?.grand_total
                            ).toLocaleString('id')}`
                          } else if (complaintDetail?.orders?.payment_type === 'survey') {
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
                  <Form.Control
                    plaintext
                    readOnly
                    value={complaintDetail?.orders.members.full_name}
                  />
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

          {complaintDetail?.remedials && complaintDetail.remedials.length > 0 && (
            <>
              <hr />

              <div className='fs-3 fw-bold text-uppercase text-decoration-underline'>
                REMEDIAL HISTORY
              </div>

              {complaintDetail.remedials.map((item: any) => (
                <Row key={item.id}>
                  <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        PIC Feedback:
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control plaintext readOnly value={item.remedial_pic} />
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                    <Form.Label className='mt-3'>Feedback Description:</Form.Label>
                    <Form.Control
                      style={{minHeight: '200px'}}
                      as='textarea'
                      plaintext
                      readOnly
                      value={item.remedial_action}
                    ></Form.Control>
                  </Col>

                  <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                    <Form.Label className='mt-3'>Remedial Evidence:</Form.Label>
                    <ListGroup>
                      {item?.remedial_evidence?.map((evidenceItem: any) => (
                        <ListGroup.Item
                          key={evidenceItem.id}
                          action
                          onClick={() => {
                            setPreviewImage(evidenceItem.evidence_location)
                            setVisible(true)
                          }}
                        >
                          {evidenceItem.evidence_location}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>

                    {previewImage && (
                      <div>
                        <Image
                          key={previewImage}
                          width={200}
                          style={{display: 'none'}}
                          src={`${apiUrl}/public/remedials/${previewImage}`}
                          preview={{
                            visible,
                            src: `${apiUrl}/public/remedials/${previewImage}`,
                            onVisibleChange: (value) => {
                              setVisible(value)
                            },
                          }}
                        />
                      </div>
                    )}
                  </Col>
                </Row>
              ))}
            </>
          )}

          <hr />

          <Row>
            <Col xs={12} md={8} lg={8} xl={8} xxl={8} className='mb-3'>
              <Form.Label className='fs-3 fw-bold'>FEEDBACK :</Form.Label>
              <Form.Control
                style={{minHeight: '170px'}}
                as='textarea'
                value={feedbackDesc}
                onChange={handleInputFeedbackDesc}
              ></Form.Control>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
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
                  {feedbackEvidence.length ? (
                    feedbackEvidence.map((item, index) => (
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

          <Row>
            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Group>
                <Form.Label>Nama Pemberi Feedback</Form.Label>

                <Select
                  name='member'
                  id='member'
                  className='form-control p-0 form-item-name'
                  classNamePrefix='select'
                  placeholder='Pilih PIC Feedback'
                  isSearchable={true}
                  options={picFeedback}
                  onChange={(element) => handlePicFeedbackChange(element)}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'></Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'></Col>
          </Row>

          <div className='d-flex justify-content-center align-items-center mt-5'>
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
          </div>

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
    </section>
  )
}

export {DetailComplaintStore}
