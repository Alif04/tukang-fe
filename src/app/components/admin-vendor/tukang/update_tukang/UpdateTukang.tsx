import React, {FC, useState, useEffect, useRef} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './UpdateTukang.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import {Image} from 'antd'
import {Form, Row, Col, Button, ListGroup, Card} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface TukangServiceSelect {
  value: number | null
  label: any
}

interface Tukang {
  tukang_id: string
  vendor_id: number | null
  full_name: string
  email: string
  ktp_number: string
  bod: string
  address: string
  phone_number: string
  username: string
  password: string
  service_type_id: TukangServiceSelect[]
}

const UpdateTukangVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()
  const animatedComponents = makeAnimated()

  const vendorId = localStorage.getItem('vendor_id') as any
  const vendorName = localStorage.getItem('vendorName') as string

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Tukang
  const [tukang, setTukang] = useState<Tukang>({
    tukang_id: '',
    vendor_id: Number.parseInt(vendorId),
    full_name: '',
    email: '',
    ktp_number: '',
    bod: '',
    address: '',
    phone_number: '',
    username: '',
    password: '',
    service_type_id: [],
  })

  // Tukang Services
  const [tukangServices, setTukangServices] = useState<TukangServiceSelect[]>([])
  const [selectedServices, setSelectedServices] = useState<TukangServiceSelect[]>([])

  // KTP File
  const [previewKTP, setPreviewKTP] = useState<any>()
  const [visibleKTP, setVisibleKTP] = useState(false)

  const [ktpEvidence, setKtpEvidence] = useState<FileList | []>()
  const [imageKTP, setimageKTP] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  // NPWP FIle
  const [previewNPWP, setPreviewNPWP] = useState<any>()
  const [visibleNPWP, setVisibleNPWP] = useState(false)

  const [npwpEvidence, setNpwpEvidence] = useState<FileList | []>()
  const [imageNPWP, setimageNPWP] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  // Upload Document ( Multiple )
  const [documentFiles, setDocumentFiles] = useState<Array<File | null>>([])
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)
  const evidenceRef = useRef<HTMLInputElement>(null)

  // Preview Image
  const [previewImage, setPreviewImageNPWP] = useState<any>()
  const [visible, setVisibleImageNPWP] = useState(false)

  const fetchTukangDetail = async () => {
    try {
      await axios
        .get(`${apiUrl}/tukang/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data.data

          if (data) {
            const tukangServices = data.tukang_service.map((item: any) => ({
              value: item.service_type.id,
              label: item.service_type.service_type,
            }))

            setTukang((prev) => ({
              ...prev,
              tukang_id: data?.id,
              vendor_id: data?.vendor?.id,
              full_name: data?.full_name,
              email: data?.email,
              ktp_number: data?.ktp_number,
              bod: new Date(data?.bod).toISOString().split('T')[0],
              address: data?.address,
              phone_number: data?.phone_number,
              username: data?.users?.username,
              service_type_id: tukangServices,
            }))

            setSelectedServices(tukangServices)
          }

          if (data?.tukang_document) {
            const documentTypes = ['ktp_file', 'npwp_file']

            type DocumentStateSetter = (state: {blob: string; fileName: string}) => void

            const documentStateSetters: Record<string, DocumentStateSetter> = {
              ktp_file: setimageKTP,
              npwp_file: setimageNPWP,
            }

            data.tukang_document.forEach((document: any) => {
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

          if (data?.tukang_document) {
            const filteredData = data?.tukang_document.filter(
              (item: any) => item.document_name === 'vendor_document'
            )

            const TukangDocument = filteredData.map((item: any) => ({
              id: item.id,
              name: item.path,
            }))

            setDocumentFiles(TukangDocument)
          }
        })
    } catch (error) {
      console.log(error)
    }
  }

  const getTukangService = async () => {
    try {
      const response = await axios.get(`${apiUrl}/service-type`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempServiceType = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.service_type,
        }))

        setTukangServices(tempServiceType)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTukangDetail()
    getTukangService()
  }, [])

  // Tukang Form
  const tukangFormHandler = (e: any) => {
    setTukang((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // Change Services
  const handleChangeServices = (element: any) => {
    const updatedServiceId = element.map((option: any) => ({
      service_type_id: option.value,
    }))

    const updatedServices = element.map((option: any) => ({
      value: option.value,
      label: option.label,
    }))

    setSelectedServices(updatedServices)
    setTukang((prev) => ({
      ...prev,
      service_type_id: updatedServiceId,
    }))
  }

  // KTP Evidence
  const handleFileChangeKTP = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files[0]) {
      setKtpEvidence(files)

      setimageKTP({
        blob: URL.createObjectURL(files[0]),
        fileName: files[0].name,
      })
    }
  }

  const handleImageKTP = () => {
    const inputField = document.querySelector('.input-ktp') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveKTP = () => {
    setimageKTP({
      blob: '',
      fileName: '',
    })

    setKtpEvidence([])
  }

  // NPWP Evidence
  const handleFileChangeNPWP = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files[0]) {
      setNpwpEvidence(files)

      setimageNPWP({
        blob: URL.createObjectURL(files[0]),
        fileName: files[0].name,
      })
    }
  }

  const handleUploadNPWP = () => {
    const inputField = document.getElementById('input-npwp-file') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveNPWP = () => {
    setimageNPWP({
      blob: '',
      fileName: '',
    })

    setNpwpEvidence([])
  }

  // Upload Document
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const {length} = fileList

      for (let i = 0; i < length; i++) {
        file[i] = fileList.item(i)
      }

      setDocumentFiles(file)
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = (index: number) => {
    const newEvidances = [...documentFiles]
    newEvidances.splice(index, 1)
    setDocumentFiles(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  const handleFileClick = (index: number) => {
    setPreviewImageNPWP(documentFiles[index]?.name)
    setVisibleImageNPWP(true)
    setSelectedFileIndex(index)
  }

  // Handle Submit Tukang
  const handleUpdateTukang = async () => {
    setIsLoading(true)
    const formData = new FormData()

    formData.append('vendor_id', vendorId)
    formData.append('full_name', tukang.full_name)
    formData.append('email', tukang.email)
    formData.append('ktp_number', tukang.ktp_number)
    formData.append('bod', tukang.bod)
    formData.append('username', tukang.username)
    formData.append('password', tukang.password)
    formData.append('address', tukang.address)
    formData.append('phone_number', tukang.phone_number)

    if (tukang.service_type_id?.length) {
      tukang.service_type_id.forEach((item: any, index: number) => {
        if (item) {
          formData.append(`service_types[${index}][service_type_id]`, item.service_type_id)
        }
      })
    }

    if (ktpEvidence?.length) {
      formData.append('ktp_file', ktpEvidence[0])
    }

    if (npwpEvidence?.length) {
      formData.append('npwp_file', npwpEvidence[0])
    }

    // if (documentFiles?.length) {
    //   documentFiles.forEach((item) => {
    //     if (item) {
    //       formData.append(`tukang_document`, item, item?.name)
    //     }
    //   })
    // }

    await axios
      .post(`${apiUrl}/tukang/${params.id}`, formData, {
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
            text: 'Success Update Tukang',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate('/tukang/view-tukang')
          })

          setIsLoading(false)
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })

          setIsLoading(false)
        }
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
        })

        setIsLoading(false)
      })
  }

  const handleCancelUpdateTukang = () => {
    navigate('/tukang/view-tukang')
  }

  return (
    <section id='update-tukang'>
      <Card>
        <Card.Header>
          <Card.Title>Profile</Card.Title>
        </Card.Header>

        <Card.Body>
          <Row className='mb-3'>
            <Form.Label>
              Nama Vendor{' '}
              <span className='fs-6 ms-2 pt-2 pb-2 fw-semibold bg-secondary'>{vendorName}</span>
            </Form.Label>
          </Row>

          <Row>
            <Col>
              <Form.Group className='tukang-info'>
                <Form.Label>Tukang ID</Form.Label>
                <Form.Control readOnly value={tukang.tukang_id} />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>Nama Tukang</Form.Label>
                <Form.Control
                  type='text'
                  name='full_name'
                  value={tukang.full_name}
                  onChange={(e) => tukangFormHandler(e)}
                />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>No. Handphone</Form.Label>
                <Form.Control
                  type='number'
                  name='phone_number'
                  value={tukang.phone_number}
                  onChange={(e) => tukangFormHandler(e)}
                />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>Keahlian</Form.Label>

                <Select
                  classNamePrefix='select'
                  placeholder='Pilih Keahlian Tukang'
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={tukangServices}
                  value={selectedServices}
                  onChange={(element) => handleChangeServices(element)}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className='tukang-info'>
                <Form.Label>Tanggal Lahir</Form.Label>
                <Form.Control
                  type='date'
                  name='bod'
                  value={tukang.bod}
                  onChange={(e) => tukangFormHandler(e)}
                />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  name='email'
                  value={tukang.email}
                  onChange={(e) => tukangFormHandler(e)}
                />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>Nomor KTP</Form.Label>
                <Form.Control
                  type='number'
                  name='ktp_number'
                  value={tukang.ktp_number}
                  onChange={(e) => tukangFormHandler(e)}
                />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>Alamat</Form.Label>
                <Form.Control
                  as='textarea'
                  type='text'
                  name='address'
                  value={tukang.address}
                  onChange={(e) => tukangFormHandler(e)}
                />
              </Form.Group>
            </Col>

            <Col>
              <div className='mb-5'>
                <Form.Group controlId='formFile'>
                  <Form.Label>Upload KTP</Form.Label>
                  <Form className='form-input-image' onClick={handleImageKTP}>
                    <Form.Control
                      type='file'
                      accept='image/*'
                      className='input-ktp'
                      hidden
                      onChange={handleFileChangeKTP}
                    />

                    {imageKTP.blob ? (
                      <img src={imageKTP.blob} alt={imageKTP.fileName} className='image-preview' />
                    ) : (
                      <div className='input-image-text'>
                        <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                        <p>Add File</p>
                      </div>
                    )}
                  </Form>

                  <div className='uploaded-row'>
                    <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                    <span className='upload-content'>
                      {imageKTP.fileName ? imageKTP.fileName : ''}
                    </span>

                    <FontAwesomeIcon
                      icon={faTrash}
                      size='sm'
                      color='#ed2b2a'
                      style={{cursor: 'pointer'}}
                      onClick={handleRemoveKTP}
                    />
                  </div>
                </Form.Group>
              </div>

              <Form.Group controlId='formFile'>
                <Form.Label>Upload NPWP</Form.Label>
                <Form className='form-input-image' onClick={handleUploadNPWP}>
                  <Form.Control
                    type='file'
                    accept='image/*'
                    className='input-ktp-image'
                    hidden
                    onChange={handleFileChangeNPWP}
                  />

                  {imageNPWP.blob ? (
                    <img src={imageNPWP.blob} alt={imageNPWP.fileName} className='image-preview' />
                  ) : (
                    <div className='input-image-text'>
                      <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                      <p>Add File</p>
                    </div>
                  )}
                </Form>

                <div className='uploaded-row'>
                  <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                  <span className='upload-content'>
                    <ListGroup.Item
                      key={imageNPWP.fileName}
                      action
                      onClick={() => {
                        setPreviewImageNPWP(imageNPWP?.fileName)
                        setVisibleImageNPWP(true)
                      }}
                    >
                      {imageNPWP?.fileName}
                    </ListGroup.Item>
                  </span>

                  <FontAwesomeIcon
                    icon={faTrash}
                    size='sm'
                    color='#ed2b2a'
                    style={{cursor: 'pointer'}}
                    onClick={handleRemoveNPWP}
                  />
                </div>

                {previewImage && (
                  <div>
                    <Image
                      key={previewImage}
                      width={200}
                      style={{display: 'none'}}
                      src={`${apiUrl}/public/tukang/${previewImage}`}
                      preview={{
                        visible,
                        src: `${apiUrl}/public/tukang/${previewImage}`,
                        onVisibleChange: (value) => {
                          setVisibleImageNPWP(value)
                        },
                      }}
                    />
                  </div>
                )}
              </Form.Group>

              {/* <Form.Group className='tukang-info'>
                <Form.Label>Upload Document Lainnya</Form.Label>
                <Form className='form-input-image' onClick={handleImageClick}>
                  <Form.Control
                    type='file'
                    accept='image/jpeg, image/png'
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
                  {documentFiles.length ? (
                    documentFiles.map((item, index) => (
                      <ListGroup>
                        <ListGroup.Item
                          className='d-flex justify-content-between align-items-center'
                          key={`${item?.name}-${index}-${item?.type}`}
                        >
                          <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                          <span className='upload-content' onClick={() => handleFileClick(index)}>
                            {item?.name}
                          </span>

                          <FontAwesomeIcon
                            icon={faTrash}
                            size='sm'
                            color='#ed2b2a'
                            style={{cursor: 'pointer'}}
                            onClick={(e) => handleRemoveFile(index)}
                          />
                        </ListGroup.Item>

                        {selectedFileIndex === index && item && (
                          <Image
                            key={`${previewImage} - ${index}`}
                            width={200}
                            style={{display: 'none'}}
                            src={URL.createObjectURL(item)}
                            preview={{
                              visible,
                              src: URL.createObjectURL(item),
                              onVisibleChange: (value) => {
                                setVisibleImageNPWP(value)
                              },
                            }}
                          />
                        )}
                      </ListGroup>
                    ))
                  ) : (
                    <ListGroup.Item className='d-flex justify-content-center'>
                      Tidak ada file yang dipilih
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Form.Group> */}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <hr />

      <Card className='mb-5'>
        <Card.Header>
          <Card.Title>Account</Card.Title>
        </Card.Header>

        <Card.Body>
          <Row>
            <Col xxl={6}>
              <Form.Group className='tukang-info'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type='text'
                  name='username'
                  value={tukang.username}
                  onChange={(e) => tukangFormHandler(e)}
                />
              </Form.Group>
            </Col>

            <Col xxl={6}>
              <Form.Group className='tukang-info'>
                <Form.Label>Reset Password</Form.Label>
                <Form.Control
                  type='text'
                  name='password'
                  value={tukang.password}
                  onChange={(e) => tukangFormHandler(e)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className='d-flex justify-content-center'>
        <Button variant='dark-danger' type='submit' onClick={handleCancelUpdateTukang}>
          Cancel
        </Button>

        <Button
          variant='dark-primary'
          type='submit'
          disabled={isLoading}
          onClick={handleUpdateTukang}
        >
          {isLoading ? 'Saving..' : 'Save'}
        </Button>
      </div>
    </section>
  )
}

export {UpdateTukangVendor}
