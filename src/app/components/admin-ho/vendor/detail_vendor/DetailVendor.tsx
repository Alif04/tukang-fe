import React, {FC, useState, useEffect, useRef} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Vendor} from '../../../../interfaces/vendor'

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

const DetailVendorHO: FC<{updatePageTitle: (vendor: Vendor) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()

  const [vendorDetail, setVendorDetail] = useState<any>()

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
          updatePageTitle(data)

          if (data?.vendor_document) {
            const documentTypes = ['npwp_file', 'ktp_file', 'compro_file', 'surat_permohonan_file']

            type DocumentStateSetter = (state: {blob: string; fileName: string}) => void

            const documentStateSetters: Record<string, DocumentStateSetter> = {
              npwp_file: setimageNPWP,
              ktp_file: setimageKTP,
              compro_file: setimageCompro,
              surat_permohonan_file: setimageSuratPermohonan,
            }

            data.vendor_document.forEach((document: any) => {
              const {document_name, path} = document

              if (documentTypes.includes(document_name)) {
                const setter = documentStateSetters[document_name]

                if (setter) {
                  setter({
                    blob: '',
                    fileName: path,
                  })
                }
              }
            })
          }
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

  // Vendor Evidence
  const [imageKTP, setimageKTP] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  const [imageNPWP, setimageNPWP] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  const [imageCompro, setimageCompro] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  const [imageSuratPermohonan, setimageSuratPermohonan] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

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
                      {vendorDetail?.vendor_service.map((item: any, key: number) => (
                        <Form.Label
                          className='fw-normal mt-3'
                          key={`${item.service_type_name} - ${key}`}
                        >
                          {item?.service_type_name}
                        </Form.Label>
                      ))}
                    </Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Service Area :
                  </Form.Label>
                  <Col sm='6'>
                    {vendorDetail?.vendor_area.map((item: any, key: number) => (
                      <Form.Label className='fw-normal mt-3' key={`${item.city_name} - ${key}`}>
                        {item?.city_name}
                      </Form.Label>
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
                <Col xxl={4}>
                  <div className='d-flex flex-column'>
                    <div className='mb-5'>
                      <Form.Group controlId='formFile'>
                        <Form.Label>Foto KTP</Form.Label>
                        <Form className='form-input-image'>
                          <Form.Control
                            type='file'
                            accept='image/*'
                            className='input-field-image'
                            hidden
                          />

                          {imageKTP?.fileName ? (
                            <img
                              src={`${apiUrl}/public/vendors/${imageKTP.fileName}`}
                              alt={imageKTP.fileName}
                              className='image-preview'
                            />
                          ) : (
                            <></>
                          )}
                        </Form>
                      </Form.Group>
                    </div>

                    <div className='mb-5'>
                      <Form.Group controlId='formFile'>
                        <Form.Label>Foto NPWP</Form.Label>
                        <Form className='form-input-image'>
                          <Form.Control
                            type='file'
                            accept='image/*'
                            className='input-field-image'
                            hidden
                          />

                          {imageNPWP?.fileName ? (
                            <img
                              src={`${apiUrl}/public/vendors/${imageNPWP.fileName}`}
                              alt={imageNPWP.fileName}
                              className='image-preview'
                            />
                          ) : (
                            <></>
                          )}
                        </Form>
                      </Form.Group>
                    </div>
                  </div>
                </Col>

                <Col xxl={4}>
                  <Form.Group controlId='formFile'>
                    <Form.Label>Foto Company Profile</Form.Label>
                    <Form className='form-input-image'>
                      <Form.Control
                        type='file'
                        accept='image/*'
                        className='input-field-image'
                        hidden
                      />

                      {imageCompro?.fileName ? (
                        <img
                          src={`${apiUrl}/public/vendors/${imageCompro.fileName}`}
                          alt={imageCompro.fileName}
                          className='image-preview'
                        />
                      ) : (
                        <></>
                      )}
                    </Form>
                  </Form.Group>
                </Col>

                <Col xxl={4}>
                  <Form.Group controlId='formFile'>
                    <Form.Label>Foto Surat Permohonan</Form.Label>
                    <Form className='form-input-image'>
                      <Form.Control
                        type='file'
                        accept='image/*'
                        className='input-field-image'
                        hidden
                      />

                      {imageSuratPermohonan?.fileName ? (
                        <img
                          src={`${apiUrl}/public/vendors/${imageSuratPermohonan.fileName}`}
                          alt={imageSuratPermohonan.fileName}
                          className='image-preview'
                        />
                      ) : (
                        <></>
                      )}
                    </Form>
                  </Form.Group>
                </Col>
              </Row>

              <hr />

              <Row>
                <div className='bank-information'>
                  <h1 className='fs-3 text-decoration-underline fw-bold mb-2'>INFORMASI BANK</h1>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='2' className='fw-semibold'>
                      NAMA BANK :
                    </Form.Label>
                    <Col sm='10'>
                      <Form.Label className='fw-normal mt-3'>
                        {vendorDetail?.vendor_bank[0].bank.bank_name}
                      </Form.Label>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='2' className='fw-semibold'>
                      NAMA CABANG :
                    </Form.Label>
                    <Col sm='10'>
                      <Form.Label className='fw-normal mt-3'></Form.Label>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='2' className='fw-semibold'>
                      NOMOR REKENING :
                    </Form.Label>
                    <Col sm='10'>
                      <Form.Label className='fw-normal mt-3'>
                        {vendorDetail?.vendor_bank[0].account_number}
                      </Form.Label>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='2' className='fw-semibold'>
                      PEMILIK REKENING :
                    </Form.Label>
                    <Col sm='10'>
                      <Form.Label className='fw-normal mt-3'>
                        {vendorDetail?.vendor_bank[0].account_name}
                      </Form.Label>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='2' className='fw-semibold'>
                      PTKP :
                    </Form.Label>
                    <Col sm='10'>
                      <Form.Label className='fw-normal mt-3'>{vendorDetail?.ktp_number}</Form.Label>
                    </Col>
                  </Form.Group>
                </div>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  )
}

export {DetailVendorHO}
