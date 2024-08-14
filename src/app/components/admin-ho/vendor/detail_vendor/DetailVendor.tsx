import React, {FC, useState, useEffect} from 'react'
import axiosInstance from '../../../../../_metronic/layout/core/axiosInterceptor'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Vendor} from '../../../../interfaces/vendor'

import './DetailVendor.css'

import axios from 'axios'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Row, Col} from 'react-bootstrap'

const DetailVendorHO: FC<{updatePageTitle: (vendor: Vendor) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [vendorDetail, setVendorDetail] = useState<any>()

  // Fetch API
  const fetchVendorData = async () => {
    try {
      await axiosInstance
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
                  src={toAbsoluteUrl('/media/avatars/blank.png')}
                  alt='Avatar'
                />
              </div>

              <h1 className='text-center fs-1 fw-bold'>{vendorDetail?.company_name}</h1>

              <Row className='d-flex justify-content-center'>
                <Col>
                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Vendor ID :
                    </Form.Label>
                    <Col sm='6'>
                      <p className='fw-normal mt-3'>{vendorDetail?.id}</p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Join Since :
                    </Form.Label>

                    <Col sm='6'>
                      <p className='fw-normal mt-3'>
                        {vendorDetail ? formatDate(new Date(vendorDetail?.created_at)) : ''}
                      </p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Status :
                    </Form.Label>
                    <Col sm='6'>
                      <p className='fw-normal mt-3'>
                        {vendorDetail?.is_active ? 'ACTIVE' : 'NON ACTIVE'}
                      </p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Margin :
                    </Form.Label>
                    <Col sm='6'>
                      <p className='fw-normal mt-3'>
                        {vendorDetail?.vendor_area[0].default_markup} %
                      </p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Phone Number :
                    </Form.Label>
                    <Col sm='6'>
                      <p className='fw-normal mt-3'>{vendorDetail?.phone_number}</p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Email Address :
                    </Form.Label>
                    <Col sm='6'>
                      <p className='fw-normal mt-3'>{vendorDetail?.email_address}</p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Address :
                    </Form.Label>
                    <Col sm='6'>
                      <p className='fw-normal mt-3'>{vendorDetail?.address}</p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Nama PIC :
                    </Form.Label>
                    <Col sm='6'>
                      <p className='fw-normal mt-3'>{vendorDetail?.pic_name ?? ''}</p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Phone Number :
                    </Form.Label>
                    <Col sm='6'>
                      <p className='fw-normal mt-3'>{vendorDetail?.phone_number}</p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Email Address :
                    </Form.Label>

                    <Col sm='6'>
                      <p className='fw-normal mt-3'>{vendorDetail?.email_address}</p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Service Type :
                    </Form.Label>

                    <Col sm='6'>
                      {vendorDetail?.vendor_service.length ? (
                        <p className='fw-normal mt-3'>
                          {Array.from(
                            new Set(
                              vendorDetail?.vendor_service.map(
                                (item: any) => item?.service_type?.service_type ?? '-'
                              )
                            )
                          ).join(', ')}
                        </p>
                      ) : (
                        <p className='fw-normal mt-3'>Service type belum diset</p>
                      )}
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Area Toko :
                    </Form.Label>
                    <Col sm='6'>
                      <p className='fw-normal mt-3'>
                        {Array.from(
                          new Set(
                            vendorDetail?.vendor_store.map(
                              (item: any) => item?.store?.store_name ?? '-'
                            )
                          )
                        ).join(', ')}
                      </p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Jumlah Teknisi :
                    </Form.Label>
                    <Col sm='6'>
                      <p className='fs-1 fw-semibold mt-2'>{vendorDetail?.tukang?.length}</p>
                    </Col>
                  </Form.Group>
                </Col>
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
                        {vendorDetail?.bank?.bank_name}
                      </Form.Label>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='2' className='fw-semibold'>
                      NOMOR REKENING :
                    </Form.Label>
                    <Col sm='10'>
                      <Form.Label className='fw-normal mt-3'>
                        {vendorDetail?.account_number}
                      </Form.Label>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='2' className='fw-semibold'>
                      PEMILIK REKENING :
                    </Form.Label>
                    <Col sm='10'>
                      <Form.Label className='fw-normal mt-3'>
                        {vendorDetail?.account_name}
                      </Form.Label>
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
