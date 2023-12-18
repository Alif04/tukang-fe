import React, {useState, useEffect, FC} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './UpdateStore.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import Swal from 'sweetalert2'
import {Row, Col, Form, Button, Card} from 'react-bootstrap'

interface City {
  value: number | null
  label: string
}

interface Bank {
  value: number | null
  label: string
}

interface Store {
  store_id: number | null
  store_name: string
  address_1: string
  address_2: string
  city_id: number | null
  phone_number: number | null
  email: string
  bank_id: number | null
  account_name: string
  account_number: number | null
}

const UpdateStores: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()

  // Store
  const [storeInfo, setStoreInfo] = useState<Store>({
    store_id: null,
    store_name: '',
    address_1: '',
    address_2: '',
    city_id: null,
    phone_number: null,
    email: '',
    bank_id: null,
    account_name: '',
    account_number: null,
  })

  // City
  const [city, setCity] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<SingleValue<City>>({
    value: null,
    label: '',
  })

  // Bank
  const [bank, setBank] = useState<Bank[]>([])
  const [selectedBank, setSelectedBank] = useState<SingleValue<Bank>>({
    value: null,
    label: '',
  })

  // Fetch API Data
  useEffect(() => {
    const getStoreData = async () => {
      try {
        await axios
          .get(`${apiUrl}/stores/${params.id}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          })
          .then((response) => {
            const data = response.data.data

            if (data?.city_id) {
              setStoreInfo((prev) => ({
                ...prev,
                city_id: data.city_id,
              }))

              setSelectedCity((prev) => ({
                ...prev,
                value: data?.city?.id,
                label: data?.city?.city_name,
              }))
            }

            if (data) {
              setStoreInfo((prev) => ({
                ...prev,
                bank_id: data?.bank_id,
              }))

              setSelectedBank((prev) => ({
                ...prev,
                value: data?.id,
                label: data?.bank_name,
              }))
            }

            if (data) {
              setStoreInfo((prev) => ({
                ...prev,
                store_id: data?.id,
                store_name: data?.store_name,
                address_1: data?.address,
                address_2: data?.address_2,
                phone_number: data?.phone_number_1,
                email: data?.email,
                account_name: data?.bank_account,
                account_number: data?.bank_number,
              }))
            }
          })
      } catch (error) {
        console.error(error)
      }
    }

    const getCity = async () => {
      try {
        const response = await axios.get(`${apiUrl}/city`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempCity = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.store_name,
          }))

          setCity(tempCity)
        } else {
          console.error('API response data is not an array:', response.data)
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

    getCity()
    getBank()
    getStoreData()
  }, [])

  // Store Form Handler
  const storeInfoFormHandler = (e: any) => {
    setStoreInfo((prevStoreInfo) => ({
      ...prevStoreInfo,
      [e.target.name]: e.target.value,
    }))
  }

  // Change Select City
  useEffect(() => {
    setStoreInfo((prev) => ({
      ...prev,
      city_id: selectedCity?.value ?? null,
    }))
  }, [selectedCity])

  // Change Select Bank
  useEffect(() => {
    setStoreInfo((prev) => ({
      ...prev,
      bank_id: selectedBank?.value ?? null,
    }))
  }, [selectedBank])

  // Store Validation
  const StoreValidation = () => {
    let valid = true

    if (!storeInfo.store_name) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nama Toko form',
        icon: 'error',
      })
      valid = false
    } else if (!storeInfo.address_1) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Alamat 1 form',
        icon: 'error',
      })
      valid = false
    } else if (!storeInfo.city_id) {
      Swal.fire({
        title: 'Error',
        text: 'Please select City form',
        icon: 'error',
      })
      valid = false
    } else if (!storeInfo.phone_number) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Telpon form',
        icon: 'error',
      })
      valid = false
    } else if (!storeInfo.email) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Email form',
        icon: 'error',
      })
      valid = false
    } else if (!storeInfo.bank_id) {
      Swal.fire({
        title: 'Error',
        text: 'Please select Bank form',
        icon: 'error',
      })
      valid = false
    } else if (!storeInfo.account_name) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nama Pemilik Akun form',
        icon: 'error',
      })
      valid = false
    } else if (!storeInfo.account_number) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nomor Akun form',
        icon: 'error',
      })
      valid = false
    }

    return valid
  }

  const handleUpdateStoreInfo = async () => {
    await axios
      .post(`${apiUrl}/stores/${params.id}`, storeInfo, {
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
            text: 'Success Update Store',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate(`/store/view-store`)
          })
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })
        }
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

  const handleCancel = () => {
    navigate('/store/view-store')
  }

  return (
    <section id='update-store'>
      <Card className='mb-5'>
        <Card.Body>
          <div className='form-wrapper'>
            <div className='form-update-store'>
              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group>
                    <Form.Label>Toko ID</Form.Label>
                    <Form.Control
                      name='store_id'
                      type='number'
                      readOnly
                      value={storeInfo.store_id ?? ''}
                      onChange={(e) => storeInfoFormHandler(e)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group>
                    <Form.Label>Nama Toko</Form.Label>
                    <Form.Control
                      name='store_name'
                      type='text'
                      value={storeInfo.store_name ?? ''}
                      onChange={(e) => storeInfoFormHandler(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control
                    as='textarea'
                    name='address_1'
                    className='field-alamat'
                    value={storeInfo.address_1 ?? ''}
                    onChange={(e) => storeInfoFormHandler(e)}
                  />
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Alamat 2</Form.Label>
                  <Form.Control
                    as='textarea'
                    name='address_2'
                    className='field-alamat'
                    value={storeInfo.address_2 ?? ''}
                    onChange={(e) => storeInfoFormHandler(e)}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Select
                      classNamePrefix='select'
                      placeholder='Pilih Nama Kota'
                      isSearchable={true}
                      options={city}
                      value={{
                        value: selectedCity?.value ?? null,
                        label: selectedCity?.label ?? '',
                      }}
                      onChange={(newValue) => setSelectedCity(newValue)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}></Col>
              </Row>

              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Telpon</Form.Label>
                  <Form.Control
                    name='phone_number'
                    value={storeInfo.phone_number ?? ''}
                    onChange={(e) => storeInfoFormHandler(e)}
                  />
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    name='email'
                    value={storeInfo.email ?? ''}
                    onChange={(e) => storeInfoFormHandler(e)}
                  />
                </Col>
              </Row>

              <hr />

              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group>
                    <Form.Label>Nama Bank</Form.Label>
                    <Select
                      classNamePrefix='select'
                      placeholder='Pilih Nama Bank'
                      isSearchable={true}
                      options={bank}
                      value={{
                        value: selectedBank?.value ?? null,
                        label: selectedBank?.label ?? '',
                      }}
                      onChange={(newValue) => setSelectedBank(newValue)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Nomor Akun</Form.Label>
                  <Form.Control
                    name='account_number'
                    value={storeInfo.account_number ?? ''}
                    onChange={(e) => storeInfoFormHandler(e)}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group>
                    <Form.Label>Nama Pemilik Akun</Form.Label>
                    <Form.Control
                      type='text'
                      name='account_name'
                      value={storeInfo.account_name ?? ''}
                      onChange={(e) => storeInfoFormHandler(e)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}></Col>
              </Row>
            </div>
          </div>

          <div className='button-wrapper d-flex justify-content-center align-items-center'>
            <Button variant='dark-danger' onClick={handleCancel}>
              Cancel
            </Button>

            <Button variant='dark-primary' onClick={handleUpdateStoreInfo}>
              Save Update
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {UpdateStores}
