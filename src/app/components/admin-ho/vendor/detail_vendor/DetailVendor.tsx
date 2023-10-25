import React, {FC, useState, useEffect, useRef} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './DetailVendor.css'

import {ChartPie} from './components/ChartPie'
import {TableList} from './components/TableList'
import {TableList2} from './components/TableList2'

import axios from 'axios'
import {Rate} from 'antd'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Row, Col, Button, ListGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faImage, faFileImage, faTrash} from '@fortawesome/free-solid-svg-icons'

const DetailVendorHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()

  const [vendorDetail, setVendorDetail] = useState<any>()

  const [uploadFiles, setUploadFiles] = useState<Array<File | null>>([])
  const evidenceRef = useRef<HTMLInputElement>(null)

  // Fetch API
  const fetchVendorData = async () => {
    try {
      await axios
        .get(`${apiUrl}/vendor/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data
          setVendorDetail(data)
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchVendorData()
  }, [])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
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

      setUploadFiles(file)
    }
  }

  const handleImageClick = () => {
    const inputField = document.getElementById('file-input') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = (index: number) => {
    const newEvidances = [...uploadFiles]

    newEvidances.splice(index, 1)

    setUploadFiles(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  // Handle Submit Upload File
  const handleSubmitUploadFile = async () => {
    // const formData = new FormData()
    // if (uploadFiles?.length) {
    //   uploadFiles.forEach((item) => {
    //     if (item) {
    //       formData.append(`vendor_document`, item, item?.name)
    //     }
    //   })
    // }
    // const response = await axios
    //   .post(`${apiUrl}/vendor`, formData, {
    //     headers: {
    //       Accept: 'application/json',
    //       Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    //       'Access-Control-Allow-Origin': '*',
    //       'ngrok-skip-browser-warning': 'true',
    //     },
    //   })
    //   .then((response) => {
    //     if (response.data.status === 200 || response.data.status === 201) {
    //       Swal.fire({
    //         title: 'Success',
    //         text: 'Success Upload Document Vendor',
    //         icon: 'success',
    //         showConfirmButton: false,
    //         timer: 1500,
    //       })
    //     } else {
    //       Swal.fire({
    //         title: 'Error',
    //         text: response.data.message,
    //         icon: 'error',
    //       })
    //     }
    //     navigate('/vendor/view-vendor')
    //   })
    //   .catch((error) => {
    //     console.error(error)
    //     Swal.fire({
    //       title: 'Error',
    //       text: error.response.data.message,
    //       icon: 'error',
    //     })
    //   })
  }

  const handleCancelUploadFile = () => {
    navigate('/vendor/view-vendor')
  }

  return (
    <section id='detail-vendor'>
      <div className='card mb-5'>
        <div className='card-body'>
          <Row>
            <Col xl={3}>
              <div className='vendor-profile'>
                <img
                  className='d-block m-auto mb-4'
                  src={toAbsoluteUrl('/media/avatars/300-1.jpg')}
                  alt='Avatar'
                />
              </div>

              <h1 className='d-flex justify-content-center fs-1 fw-bold'>
                {vendorDetail?.company_name}
              </h1>

              <Row className='d-flex justify-content-center'>
                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Vendor ID :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>{vendorDetail?.id}</Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Join Since :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>
                      {vendorDetail ? formatDate(new Date(vendorDetail.created_at)) : ''}
                    </Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Status :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>
                      {vendorDetail?.is_active ? 'ACTIVE' : 'NON ACTIVE'}
                    </Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Margin :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>
                      {vendorDetail?.vendor_area[0].default_markup} %
                    </Form.Label>
                  </Col>
                </Form.Group>

                <Rate className='d-flex justify-content-center' />

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Phone Number :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>{vendorDetail?.phone_number}</Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Email Address :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>
                      {vendorDetail?.email_address}
                    </Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Address :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>{vendorDetail?.address}</Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Nama PIC :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>Hendra Setiawan</Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Phone Number :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>{vendorDetail?.phone_number}</Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Email Address :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>
                      {vendorDetail?.email_address}
                    </Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Service Type :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fw-normal mt-3'>
                      {vendorDetail?.vendor_service.map((item: any) => (
                        <>
                          <Form.Label className='fw-normal mt-3'>
                            {item?.service_type_name}
                          </Form.Label>
                        </>
                      ))}
                    </Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Service Area :
                  </Form.Label>
                  <Col sm='6'>
                    {vendorDetail?.vendor_area.map((item: any) => (
                      <>
                        <Form.Label className='fw-normal mt-3'>{item?.city_name}</Form.Label>
                      </>
                    ))}
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Jumlah Teknisi :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Label className='fs-1 fw-semibold'>20</Form.Label>
                  </Col>
                </Form.Group>
              </Row>
            </Col>

            <Col xl={9}>
              <Row>
                <Col xl={6}>
                  <div className='d-flex flex-column'>
                    <div className='stats mt-5 mb-5'>
                      <div className='card'>
                        <ChartPie className='' chartHeight='280px' />
                      </div>
                    </div>

                    <div className='table border p-1'>
                      <TableList />
                    </div>
                  </div>
                </Col>

                <Col xl={6}>
                  <div className='table border p-1'>
                    <TableList2 />
                  </div>
                </Col>
              </Row>

              <hr />

              <Row>
                <Col xl={6}>
                  <Form.Group>
                    <Form.Label>Upload Dokumen Lain</Form.Label>
                    <Form className='form-input-image' onClick={handleImageClick}>
                      <Form.Control
                        id='file-input'
                        type='file'
                        accept='image/*'
                        multiple
                        hidden
                        ref={evidenceRef}
                        onChange={handleFileChange}
                      />

                      <div className='input-image-text'>
                        <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                        <p>Add File</p>
                      </div>
                    </Form>

                    <ListGroup className='pt-3'>
                      {uploadFiles.length ? (
                        uploadFiles.map((item, index) => (
                          <ListGroup.Item
                            key={`${item?.name}-${index}-${item?.type}`}
                            className='d-flex justify-content-between'
                          >
                            <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                            <span className='upload-content'>{item?.name}</span>

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

                <Col xl={6}>
                  <Row>
                    <Col xl={6}>
                      <div className='documents'>
                        <h1 className='fs-3 text-decoration-underline fw-bold mb-3'>DOCUMENTS</h1>

                        <ul style={{listStyle: 'none', padding: '0'}}>
                          {vendorDetail?.vendor_document.map((document: any) => (
                            <>
                              <li className='fs-6 text-decoration-underline fw-semibold'>
                                {document.document_name}
                              </li>
                            </>
                          ))}
                        </ul>
                      </div>
                    </Col>

                    <Col xl={6}>
                      <div className='bank-information'>
                        <h1 className='fs-3 text-decoration-underline fw-bold mb-2'>
                          INFORMASI BANK
                        </h1>

                        <Form.Group as={Row} className='detail-info'>
                          <Form.Label column sm='6' className='fw-semibold'>
                            NAMA BANK :
                          </Form.Label>
                          <Col sm='6'>
                            <Form.Label className='fw-normal mt-3'>
                              {vendorDetail?.vendor_bank[0].bank_name}
                            </Form.Label>
                          </Col>
                        </Form.Group>

                        <Form.Group as={Row} className='detail-info'>
                          <Form.Label column sm='6' className='fw-semibold'>
                            NAMA CABANG :
                          </Form.Label>
                          <Col sm='6'>
                            <Form.Label className='fw-normal mt-3'>
                              {vendorDetail?.vendor_bank[0].bank_name}
                            </Form.Label>
                          </Col>
                        </Form.Group>

                        <Form.Group as={Row} className='detail-info'>
                          <Form.Label column sm='6' className='fw-semibold'>
                            NOMOR REKENING :
                          </Form.Label>
                          <Col sm='6'>
                            <Form.Label className='fw-normal mt-3'>
                              {vendorDetail?.vendor_bank[0].account_number}
                            </Form.Label>
                          </Col>
                        </Form.Group>

                        <Form.Group as={Row} className='detail-info'>
                          <Form.Label column sm='6' className='fw-semibold'>
                            PEMILIK REKENING :
                          </Form.Label>
                          <Col sm='6'>
                            <Form.Label className='fw-normal mt-3'>
                              {vendorDetail?.vendor_bank[0].account_name}
                            </Form.Label>
                          </Col>
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <div className='d-flex justify-content-center mt-5'>
                <Button variant='dark-danger' type='submit' onClick={handleCancelUploadFile}>
                  Cancel
                </Button>

                <Button variant='dark-primary' type='submit' onClick={handleSubmitUploadFile}>
                  Save
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  )
}

export {DetailVendorHO}
