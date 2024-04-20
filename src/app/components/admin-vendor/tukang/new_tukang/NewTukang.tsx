import React, {FC, useEffect} from 'react'
import {useState} from 'react'

import './NewTukang.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import {useNavigate} from 'react-router-dom'
import {Form, Row, Col, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface Bank {
  value: BigInteger
  label: string
}

interface TukangService {
  value: BigInteger
  label: any
}

const NewTukangVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const vendorId = localStorage.getItem('vendor_id') as any
  const vendorName = localStorage.getItem('vendorName') as string

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const animatedComponents = makeAnimated()

  const getTukangId = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tukang/next-code`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response.status === 200) {
        const {data} = response
        setTukangId(data.data.code)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getBank = async () => {
    try {
      const response = await axios.get(`${apiUrl}/bank`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempBank = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.bank_name,
        }))

        setBank(tempBank)
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
    getTukangId()
    getBank()
    getTukangService()
  }, [])

  // Add Tukang
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

  const [uploadDocument, setUploadDocument] = useState<FileList | []>()
  const [image, setImage] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  // Bank Information
  const [bank, setBank] = useState<Bank[]>([])
  const [bankId, setBankId] = useState<string>('')
  const [nomorRekening, setNomorRekening] = useState<any>()
  const [namaRekening, setNamaRekening] = useState<any>()

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

  // Change Select Service Type
  const handleChangeServiceTypeId = (element: any) => {
    const updatedTukangServiceId = element.map((option: any) => option.value)
    setTukangServiceId(updatedTukangServiceId)
  }

  // Change Select Bank
  const handleChangeSelectBank = (element: any) => {
    const updatedBankId = element.value
    setBankId(updatedBankId)
  }

  const handleChangeNomorRekening = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedNomorRekening = event.target.value
    setNomorRekening(updatedNomorRekening)
  }

  const handleChangeNamaRekening = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedNamaRekening = event.target.value
    setNamaRekening(updatedNamaRekening)
  }

  // Upload Document
  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files[0]) {
      setUploadDocument(files)

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
    setUploadDocument([])
  }

  // Tukang Validation
  const TukangValidation = () => {
    let valid = true

    if (!username) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill username form',
        icon: 'error',
      })
      valid = false
    } else if (!password) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill password form',
        icon: 'error',
      })
      valid = false
    } else if (!tukangName) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nama Tukang form',
        icon: 'error',
      })
      valid = false
    } else if (!email) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Email form',
        icon: 'error',
      })
      valid = false
    } else if (!phoneNumber) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill No. Handphone form',
        icon: 'error',
      })
      valid = false
    } else if (!dateBirth) {
      Swal.fire({
        title: 'Error',
        text: 'Please select Tanggal Lahir form',
        icon: 'error',
      })
      valid = false
    } else if (!address) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Alamat form',
        icon: 'error',
      })
      valid = false
    } else if (!ktpNumber) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nomor KTP form',
        icon: 'error',
      })
      valid = false
    } else if (!tukangServiceId) {
      Swal.fire({
        title: 'Error',
        text: 'Please select Keahlian form',
        icon: 'error',
      })
      valid = false
    } else if (!uploadDocument) {
      Swal.fire({
        title: 'Error',
        text: 'Please Upload Document form',
        icon: 'error',
      })
      valid = false
    }
    return valid
  }

  // Handle Submit Tukang
  const handleSubmitNewTukang = async () => {
    if (TukangValidation()) {
      setIsLoading(true)
      const formData = new FormData()

      formData.append('vendor_id', vendorId)
      formData.append('full_name', tukangName)
      formData.append('email', email)
      formData.append('ktp_number', ktpNumber)
      formData.append('bod', dateBirth)
      formData.append('username', username)
      formData.append('password', password)
      formData.append('address', address)
      formData.append('phone_number', phoneNumber)

      if (tukangServiceId?.length) {
        tukangServiceId.forEach((item: any, index: number) => {
          if (item) {
            formData.append(`service_types[${index}][service_type_id]`, item)
          }
        })
      }

      if (uploadDocument?.length) {
        formData.append('ktp_file', uploadDocument[0])
      }

      await axios
        .post(`${apiUrl}/tukang`, formData, {
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
              text: 'Success Add Tukang',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
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

          navigate('/tukang/view-tukang')
        })
        .catch((error) => {
          console.error(error)
          setIsLoading(false)

          Swal.fire({
            title: 'Error',
            text: error.response.data.message,
            icon: 'error',
          })
        })
    }
  }

  const handleCancelAddTukang = () => {
    navigate('/tukang/view-tukang')
  }

  return (
    <section id='new-tukang'>
      <div className='card mb-5'>
        <div className='card-body'>
          <Row className='mb-3'>
            <Form.Label>
              Nama Vendor{' '}
              <span className='fs-6 ms-2 pt-2 pb-2 fw-semibold bg-secondary'>{vendorName}</span>
            </Form.Label>
          </Row>

          <Row>
            <Col xxl={4}>
              <Form.Group className='tukang-info'>
                <Form.Label>Tukang ID</Form.Label>
                <Form.Control readOnly type='number' value={tukangId} />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>Nama Tukang</Form.Label>
                <Form.Control type='text' onChange={handleChangeTukangName} />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>No. Handphone</Form.Label>
                <Form.Control type='number' onChange={handleChangePhoneNumber} />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>Username</Form.Label>
                <Form.Control type='text' onChange={handleChangeUsername} />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>Tanggal Lahir</Form.Label>
                <Form.Control type='date' onChange={handleChangeDateBirth} />
              </Form.Group>
            </Col>

            <Col xxl={4}>
              <Form.Group className='tukang-info'>
                <Form.Label>Keahlian</Form.Label>

                <Select
                  classNamePrefix='select'
                  placeholder='Pilih Keahlian Tukang'
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={tukangService}
                  onChange={(element) => handleChangeServiceTypeId(element)}
                />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' onChange={handleChangeEmail} />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>Nomor KTP</Form.Label>
                <Form.Control type='number' onChange={handleChangeKtpNumber} />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='text' onChange={handleChangePassword} />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>Alamat</Form.Label>
                <Form.Control as='textarea' type='text' onChange={handleChangeAddress} />
              </Form.Group>
            </Col>

            <Col xxl={4}>
              <Form.Group className='tukang-info'>
                <Form.Label>Nomor Rekening</Form.Label>
                <Form.Control type='number' onChange={handleChangeNomorRekening} />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>Nama Rekening</Form.Label>
                <Form.Control type='text' onChange={handleChangeNamaRekening} />
              </Form.Group>

              <Form.Group className='tukang-info'>
                <Form.Label>Nama Bank</Form.Label>

                <Select
                  classNamePrefix='select'
                  placeholder='Pilih Nama Bank'
                  isSearchable={true}
                  options={bank}
                  onChange={(element) => handleChangeSelectBank(element)}
                />
              </Form.Group>

              <Form.Group controlId='formFile'>
                <Form.Label>Upload Document</Form.Label>
                <Form className='form-input-image' onClick={handleImageClick}>
                  <Form.Control
                    type='file'
                    accept='image/*'
                    className='input-field-image'
                    hidden
                    onChange={handleDocumentChange}
                  />

                  {image.blob ? (
                    <img src={image.blob} alt={image.fileName} className='image-preview' />
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
            </Col>
          </Row>

          <div className='d-flex justify-content-center'>
            <Button variant='dark-danger' type='submit' onClick={handleCancelAddTukang}>
              Cancel
            </Button>

            <Button
              variant='dark-primary'
              type='submit'
              disabled={isLoading}
              onClick={handleSubmitNewTukang}
            >
              {isLoading ? 'Saving..' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewTukangVendor}
