import React, {FC, useState, useEffect, useRef} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './UpdateTukang.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import {Image} from 'antd'
import {Form, Row, Col, Button, ListGroup, Card, FormCheck} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface TukangAreaSelect {
  area_id: number | null
  label: string
}

interface TukangServiceSelect {
  service_type_id: number | null
  label: string
}

interface Tukang {
  is_active: number
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
  area_id: TukangAreaSelect[]
}

const UpdateTukangVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()
  const animatedComponents = makeAnimated()

  const userRole = localStorage.getItem('userRole') as string
  const vendorId = localStorage.getItem('vendor_id') as any
  const vendorName = localStorage.getItem('vendorName') as string

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Tukang
  const [tukang, setTukang] = useState<Tukang>({
    is_active: 1,
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
    area_id: [],
  })

  console.log('tukang ', tukang)

  // Tukang Services
  const [tukangServices, setTukangServices] = useState<TukangServiceSelect[]>([])

  // Tukang Area
  const [tukangArea, setTukangArea] = useState<TukangAreaSelect[]>([])

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
          const data = response.data.data

          if (data) {
            const tukangServices = data?.tukang_service?.map((item: any) => ({
              service_type_id: item.service_type.id,
            }))

            const tukangArea = data?.tukang_area?.map((item: any) => ({
              area_id: item.area.id,
            }))

            setTukang((prev) => ({
              ...prev,
              is_active: data?.is_active === true ? 1 : 0,
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
              area_id: tukangArea,
            }))
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
          service_type_id: item.id,
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

  const getArea = async () => {
    try {
      const response = await axios.get(`${apiUrl}/area?take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempArea = response.data.data.map((item: any) => ({
          area_id: item?.id,
          label: item?.area,
        }))

        setTukangArea(tempArea)
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
    getArea()
  }, [])

  // Tukang Form
  const tukangFormHandler = (e: any) => {
    setTukang((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // Switch Handler
  const handleCheckboxChange = (isChecked: boolean) => {
    setTukang((prev) => ({
      ...prev,
      is_active: isChecked ? 1 : 0,
    }))
  }

  // Change Services
  const serviceHandler = (selectedOption: any) => {
    const updatedServices = selectedOption.map((option: any) => ({
      service_type_id: option.service_type_id,
    }))

    setTukang((prev) => ({
      ...prev,
      service_type_id: updatedServices,
    }))
  }

  const areaHandler = (selectedOptions: any) => {
    const updatedArea = selectedOptions.map((option: any) => ({
      area_id: option.area_id,
    }))

    setTukang((prev) => ({
      ...prev,
      area_id: updatedArea,
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

  // Tukang Validation
  const TukangValidation = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let valid = true

    if (tukang.full_name === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong Isi Formulir Nama Tukang',
        icon: 'warning',
      })
      valid = false
    } else if (tukang.address === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong Isi Formulir Alamat Tukang',
        icon: 'warning',
      })
      valid = false
    } else if (tukang.email === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong Isi Formulir Email Tukang',
        icon: 'warning',
      })
      valid = false
    } else if (tukang.phone_number === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong Isi Formulir Nomor Telepon Tukang',
        icon: 'warning',
      })
      valid = false
    } else if (tukang.bod === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong Isi Tanggal Lahir Tukang',
        icon: 'warning',
      })
      valid = false
    } else if (tukang.username === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong Isi Formulir Username Tukang',
        icon: 'warning',
      })
      valid = false
    } else if (tukang.email && !emailPattern.test(tukang.email)) {
      Swal.fire({
        title: 'Invalid Email',
        text: 'Tolong Isi dengan format Email yang benar',
        icon: 'warning',
      })
      valid = false
    }

    return valid
  }

  // Handle Submit Tukang
  const handleUpdateTukang = async () => {
    if (!TukangValidation()) {
      setIsLoading(false)
      return false
    }

    setIsLoading(true)
    const formData = new FormData()

    formData.append('is_active', String(tukang.is_active))
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

    if (tukang.area_id?.length) {
      tukang.area_id.forEach((item: any, index: number) => {
        if (item) {
          formData.append(`tukang_area[${index}][area_id]`, item.area_id)
        }
      })
    }

    if (ktpEvidence?.length) {
      formData.append('ktp_file', ktpEvidence[0])
    }

    if (npwpEvidence?.length) {
      formData.append('npwp_file', npwpEvidence[0])
    }

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
            text: `${
              userRole === 'Tukang' ? 'Berhasil update biodata' : 'Berhasil update data tukang'
            }`,
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            userRole === 'Tukang' ? window.location.reload() : navigate('/tukang/view-tukang')
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
          {['Tukang'].includes(userRole) && (
            <Form.Check
              id='switch-active'
              type='switch'
              label='Available'
              className='mb-5'
              checked={tukang.is_active === 1}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
            />
          )}

          {!['Tukang'].includes(userRole) && (
            <Row className='mb-3'>
              <Form.Label>
                Nama Vendor{' '}
                <span className='fs-6 ms-2 pt-2 pb-2 fw-semibold bg-secondary'>{vendorName}</span>
              </Form.Label>
            </Row>
          )}

          <Row>
            <Col xxl={6} xl={6} lg={6} md={6} sm={12}>
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
                  getOptionValue={(option: TukangServiceSelect) => `${option.service_type_id}`}
                  getOptionLabel={(option: TukangServiceSelect) =>
                    tukangServices.find((item) => item.service_type_id === option.service_type_id)
                      ?.label || 'Pilih Keahlian Tukang'
                  }
                  value={tukang.service_type_id}
                  onChange={(e) => serviceHandler(e)}
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

            <Col xxl={6} xl={6} lg={6} md={6} sm={12}>
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
                <Form.Label>Tukang Area</Form.Label>

                <Select
                  classNamePrefix='select'
                  placeholder='Pilih Area Tukang'
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={tukangArea}
                  getOptionValue={(option: TukangAreaSelect) => `${option.area_id}`}
                  getOptionLabel={(option: TukangAreaSelect) =>
                    tukangArea.find((item) => item.area_id === option.area_id)?.label ||
                    'Pilih Area Tukang'
                  }
                  value={tukang.area_id}
                  onChange={(e) => areaHandler(e)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <hr />

      <Card className='mb-5'>
        <Card.Header>
          <Card.Title>File Pendukung</Card.Title>
        </Card.Header>

        <Card.Body>
          <Row>
            <Col xxl={6} xl={6} lg={6} md={6} sm={12}>
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
                  <FontAwesomeIcon
                    style={{cursor: 'pointer'}}
                    icon={faFileImage}
                    color='#858585'
                    size='sm'
                  />

                  <span className='upload-content'>
                    <ListGroup.Item
                      key={imageKTP.fileName}
                      action
                      onClick={() => {
                        setPreviewKTP(imageKTP?.fileName)
                        setVisibleKTP(true)
                      }}
                    >
                      {imageKTP?.fileName}
                    </ListGroup.Item>
                  </span>

                  <FontAwesomeIcon
                    icon={faTrash}
                    size='sm'
                    color='#ed2b2a'
                    style={{cursor: 'pointer'}}
                    onClick={handleRemoveKTP}
                  />
                </div>

                {previewKTP && (
                  <div>
                    <Image
                      key={previewKTP}
                      width={200}
                      style={{display: 'none'}}
                      src={`${apiUrl}/public/tukang/${previewKTP}`}
                      preview={{
                        visible: visibleKTP,
                        src: `${apiUrl}/public/tukang/${previewKTP}`,
                        onVisibleChange: (value) => {
                          setVisibleKTP(value)
                        },
                      }}
                    />
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col xxl={6} xl={6} lg={6} md={6} sm={12}>
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
                    <img
                      src={imageNPWP.blob}
                      alt={imageNPWP.fileName}
                      style={{cursor: 'pointer'}}
                      className='image-preview'
                    />
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
                        setPreviewNPWP(imageNPWP?.fileName)
                        setVisibleNPWP(true)
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

                {previewNPWP && (
                  <div>
                    <Image
                      key={previewNPWP}
                      width={200}
                      style={{display: 'none'}}
                      src={`${apiUrl}/public/tukang/${previewNPWP}`}
                      preview={{
                        visible: visibleNPWP,
                        src: `${apiUrl}/public/tukang/${previewNPWP}`,
                        onVisibleChange: (value) => {
                          setVisibleNPWP(value)
                        },
                      }}
                    />
                  </div>
                )}
              </Form.Group>
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
        {!['Tukang'].includes(userRole) && (
          <Button
            className='d-flex justify-content-center align-items-center'
            variant='dark-danger'
            type='submit'
            disabled={isLoading}
            onClick={handleCancelUpdateTukang}
          >
            Cancel
          </Button>
        )}

        <Button
          className='d-flex justify-content-center align-items-center'
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
