import React, {FC, useState, useEffect, useRef} from 'react'

import './UpdateTukang.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Row, Col, Button, ListGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface Vendor {
  value: any
  label: string
}

interface TukangService {
  value: BigInteger
  label: string
}

interface TukangServiceValues {
  value: BigInteger
  label: string
}

const UpdateTukangVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const animatedComponents = makeAnimated()
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
          setTukangDetail(data)

          if (data?.id) {
            setTukangId(data.id)
          }

          if (data?.full_name) {
            setTukangName(data.full_name)
          }

          if (data?.phone_number) {
            setPhoneNumber(data.phone_number)
          }

          if (data?.ktp_number) {
            setKtpNumber(data.ktp_number)
          }

          if (data?.bod) {
            setDateBirth(new Date(data.join_date).toISOString().split('T')[0])
          }

          if (data?.email) {
            setEmail(data?.email)
          }

          if (data?.address) {
            setAddress(data.address)
          }

          if (data?.tukang_service) {
            const tukangService = data.tukang_service.map((item: any) => ({
              value: item.service_type.id,
              label: item.service_type.service_type,
            }))

            setTukangServiceValues(tukangService)
          }

          if (data?.vendor.id && data?.vendor.company_name) {
            setVendorId(data.vendor.id)
            setVendorName(data.vendor.company_name)
          }

          if (data?.tukang_document) {
            const documentTypes = ['ktp_file']

            type DocumentStateSetter = (state: {blob: string; fileName: string}) => void

            const documentStateSetters: Record<string, DocumentStateSetter> = {
              ktp_file: setImage,
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

  const getVendor = async () => {
    try {
      const response = await axios.get(`${apiUrl}/vendor`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempVendor = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.company_name,
        }))

        setVendor(tempVendor)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
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

        setTukangService(tempServiceType)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTukangDetail()
    getVendor()
    getTukangService()
  }, [])

  // Detail Tukang
  const [tukangDetail, setTukangDetail] = useState<any>()

  // Tukang Information
  const [tukangId, setTukangId] = useState<any>()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [tukangName, setTukangName] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<any>()
  const [dateBirth, setDateBirth] = useState<string>('')
  const [ktpNumber, setKtpNumber] = useState<any>()

  const [tukangServiceId, setTukangServiceId] = useState<any>([])
  const [tukangService, setTukangService] = useState<TukangService[]>([])
  const [tukangServiceValues, setTukangServiceValues] = useState<TukangServiceValues[]>([])

  const [uploadFotoDiri, setUploadFotoDiri] = useState<FileList | []>()
  const [image, setImage] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  // Vendor Information
  const [vendor, setVendor] = useState<Vendor[]>([])
  const [vendorId, setVendorId] = useState<any>()
  const [vendorName, setVendorName] = useState<string>('')

  // Change Input Tukang Information
  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedUsername = event.target.value
    setUsername(updatedUsername)
  }

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPassword = event.target.value
    setPassword(updatedPassword)
  }

  const handleChangeTukangName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTukangName = event.target.value
    setTukangName(updatedTukangName)
  }

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedEmail = event.target.value
    setEmail(updatedEmail)
  }

  const handleChangePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPhoneNumber = event.target.value
    setPhoneNumber(updatedPhoneNumber)
  }

  const handleChangeDateBirth = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedDateBirth = event.target.value
    setDateBirth(updatedDateBirth)
  }

  const handleChangeKtpNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedKtpNumber = event.target.value
    setKtpNumber(updatedKtpNumber)
  }

  const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedAddress = event.target.value
    setAddress(updatedAddress)
  }

  // Change Select Tukang Service
  const handleChangeTukangService = (element: any) => {
    const updatedTukangService = element.map((option: any) => ({
      value: option.value,
      label: option.label,
    }))

    const updatedTukangServiceId = element.map((option: any) => option.value)

    setTukangServiceId(updatedTukangServiceId)
    setTukangServiceValues(updatedTukangService)
  }

  // Change Select Vendor
  const handleChangeSelectVendor = (element: Vendor | null) => {
    const newVendorInfo: Vendor = {
      value: element?.value || 0,
      label: element?.label || '',
    }

    setVendorId(newVendorInfo.value)
    setVendorName(newVendorInfo.label)
  }

  // Upload Foto Diri
  const handleUploadFotoDiri = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files[0]) {
      setUploadFotoDiri(files)

      setImage({
        blob: URL.createObjectURL(files[0]),
        fileName: files[0].name,
      })
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = () => {
    setImage({
      blob: '',
      fileName: '',
    })
    setUploadFotoDiri([])
  }

  // Upload Document ( Multiple File )
  const [uploadFiles, setUploadFiles] = useState<Array<File | null>>([])
  const evidenceRef = useRef<HTMLInputElement>(null)

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleImageClicks = () => {
    const inputField = document.getElementById('file-input') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFiles = (index: number) => {
    const newEvidances = [...uploadFiles]

    newEvidances.splice(index, 1)

    setUploadFiles(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  // Handle Submit Tukang
  const handleUpdateTukang = async () => {
    setIsLoading(true)
    const formData = new FormData()

    formData.append('vendor_id', vendorId)
    formData.append('full_name', tukangName)
    formData.append('email', email)
    formData.append('ktp_number', ktpNumber)
    formData.append('bod', dateBirth)
    formData.append('address', address)
    formData.append('phone_number', phoneNumber)

    if (tukangServiceId?.length) {
      tukangServiceId.forEach((item: any, index: number) => {
        if (item) {
          formData.append(`service_type[${index}][service_type_id]`, item)
        }
      })
    }

    if (uploadFotoDiri?.length) {
      formData.append('ktp_file', uploadFotoDiri[0])
    }

    // if (uploadFiles?.length) {
    //   uploadFiles.forEach((item) => {
    //     if (item) {
    //       formData.append(`files`, item, item?.name)
    //     }
    //   })
    // }

    const response = await axios
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
      <div className='card mb-5'>
        <div className='card-body'>
          <Row>
            <Col xxl={8}>
              <Row>
                <Col xxl={6}>
                  <Form.Group className='tukang-info'>
                    <Form.Label>Tukang ID</Form.Label>
                    <Form.Control type='number' value={tukangId} />
                  </Form.Group>

                  <Form.Group className='tukang-info'>
                    <Form.Label>Nama Tukang</Form.Label>
                    <Form.Control
                      type='text'
                      onChange={handleChangeTukangName}
                      value={tukangName}
                    />
                  </Form.Group>

                  <Form.Group className='tukang-info'>
                    <Form.Label>No. Handphone</Form.Label>
                    <Form.Control
                      type='number'
                      onChange={handleChangePhoneNumber}
                      value={phoneNumber}
                    />
                  </Form.Group>

                  <Form.Group className='tukang-info'>
                    <Form.Label>Nomor KTP</Form.Label>
                    <Form.Control
                      type='number'
                      onChange={handleChangeKtpNumber}
                      value={ktpNumber}
                    />
                  </Form.Group>
                </Col>

                <Col xxl={6}>
                  <Form.Group className='tukang-info'>
                    <Form.Label>Keahlian</Form.Label>

                    <Select
                      classNamePrefix='select'
                      placeholder='Pilih Keahlian Tukang'
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      isMulti
                      options={tukangService}
                      onChange={(element) => handleChangeTukangService(element)}
                      value={tukangServiceValues}
                    />
                  </Form.Group>

                  <Form.Group className='tukang-info'>
                    <Form.Label>Tanggal Lahir</Form.Label>
                    <Form.Control type='date' onChange={handleChangeDateBirth} value={dateBirth} />
                  </Form.Group>

                  <Form.Group className='tukang-info'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' onChange={handleChangeEmail} value={email} />
                  </Form.Group>

                  <Form.Group className='tukang-info'>
                    <Form.Label>Vendor</Form.Label>

                    <Select
                      classNamePrefix='select'
                      placeholder='Pilih Nama Vendor'
                      isSearchable={true}
                      options={vendor}
                      value={{
                        value: vendorId,
                        label: vendorName,
                      }}
                      onChange={(element) => handleChangeSelectVendor(element)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Form.Group className='tukang-info'>
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control
                    as='textarea'
                    type='text'
                    onChange={handleChangeAddress}
                    value={address}
                  />
                </Form.Group>
              </Row>
            </Col>

            <Col xxl={4}>
              <Form.Group controlId='formFile'>
                <Form.Label>Upload Photo Diri / KTP</Form.Label>

                <Form className='form-input-image' onClick={handleImageClick}>
                  <Form.Control
                    type='file'
                    accept='image/*'
                    className='input-field-image'
                    hidden
                    onChange={handleUploadFotoDiri}
                  />

                  {image.blob ? (
                    <img
                      src={image.blob ? image.blob : `${apiUrl}/public/tukang/${image.fileName}`}
                      alt={image.fileName}
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

                  <span className='upload-content'>{image.fileName ? image.fileName : ''}</span>

                  <FontAwesomeIcon
                    icon={faTrash}
                    size='sm'
                    color='#ed2b2a'
                    style={{cursor: 'pointer'}}
                    onClick={handleRemoveFile}
                  />
                </div>
              </Form.Group>

              <Form.Group>
                <Form.Label>Dokumen Lainnya</Form.Label>
                <Form className='form-input-image' onClick={handleImageClicks}>
                  <Form.Control
                    id='file-input'
                    type='file'
                    accept='image/*'
                    multiple
                    hidden
                    ref={evidenceRef}
                    onChange={handleFilesChange}
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
                          onClick={(e) => handleRemoveFiles(index)}
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
              {isLoading ? 'Updating..' : 'Update'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {UpdateTukangVendor}
