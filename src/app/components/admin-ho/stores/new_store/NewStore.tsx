import React, {FC, useState, useEffect} from 'react'

import './NewStore.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, Button, Card} from 'react-bootstrap'

interface City {
  value: number | null
  label: string
}

// interface Province {
//   value: number | null
//   label: string
// }

// interface Bank {
//   value: number | null
//   label: string
// }

interface Store {
  id: number | null
  store_name: string
  address: string
  address_2: string
  city_id: number | null
  // province_id: number | null
  phone_number_1: number | null
  email: string
  bank_name: string
  bank_number: string
  bank_account: number | null
  zip_code: string
}

const NewStore: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  // Store
  const [storeInfo, setStoreInfo] = useState<Store>({
    id: null,
    store_name: '',
    address: '',
    address_2: '',
    city_id: null,
    // province_id: null,
    phone_number_1: null,
    email: '',
    bank_name: '',
    bank_number: '',
    bank_account: null,
    zip_code: '',
  })

  // City
  const [city, setCity] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<SingleValue<City>>({
    value: null,
    label: '',
  })

  // // Province
  // const [province, setProvince] = useState<Province[]>([])
  // const [selectedProvince, setSelectedProvince] = useState<SingleValue<Province>>({
  //   value: null,
  //   label: '',
  // })

  // Bank
  // const [bank, setBank] = useState<Bank[]>([])
  // const [selectedBank, setSelectedBank] = useState<SingleValue<Bank>>({
  //   value: null,
  //   label: '',
  // })

  // Fetch API Data
  useEffect(() => {
    const getCity = async () => {
      try {
        const response = await axios.get(`${apiUrl}/city?take=0`, {
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
            label: item.city_name,
          }))

          setCity(tempCity)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const getStoreId = async () => {
      try {
        const response = await axios.get(`${apiUrl}/stores/next-code`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        console.log(response.data.data.code)

        if (response.status === 200) {
          const {data} = response
          setStoreInfo((prev) => ({
            ...prev,
            id: data.data.code,
          }))
        }
      } catch (err) {
        console.error(err)
      }
    }

    // const getBank = async () => {
    //   try {
    //     const response = await axios.get(`${apiUrl}/bank`, {
    //       headers: {
    //         Accept: 'application/json',
    //         Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    //         'Access-Control-Allow-Origin': '*',
    //         'ngrok-skip-browser-warning': 'true',
    //       },
    //     })

    //     if (Array.isArray(response.data.data)) {
    //       const tempBank = response.data.data.map((item: any) => ({
    //         value: item.id,
    //         label: item.bank_name,
    //       }))

    //       setBank(tempBank)
    //     } else {
    //       console.error('API response data is not an array:', response.data)
    //     }
    //   } catch (err) {
    //     console.error(err)
    //   }
    // }

    getCity()
    getStoreId()
    // getBank()
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

  // Change Select Province
  // useEffect(() => {
  //   setStoreInfo((prev) => ({
  //     ...prev,
  //     province_id: selectedProvince?.value ?? null,
  //   }))
  // }, [selectedProvince])

  // Change Select Bank
  // useEffect(() => {
  //   setStoreInfo((prev) => ({
  //     ...prev,
  //     bank_id: selectedBank?.value ?? null,
  //   }))
  // }, [selectedBank])

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
    } else if (!storeInfo.address) {
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
    } else if (!storeInfo.phone_number_1) {
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
    } else if (!storeInfo.bank_name) {
      Swal.fire({
        title: 'Error',
        text: 'Please select Bank form',
        icon: 'error',
      })
      valid = false
    } else if (!storeInfo.bank_number) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nama Pemilik Akun form',
        icon: 'error',
      })
      valid = false
    } else if (!storeInfo.bank_account) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nomor Akun form',
        icon: 'error',
      })
      valid = false
    }

    return valid
  }

  const handleSubmitNewStore = async () => {
    if (!StoreValidation()) {
      return false
    }

    await axios
      .post(`${apiUrl}/stores`, storeInfo, {
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
            text: 'Success Add New Stores',
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
    <section id='new-store'>
      <Card className='mb-5'>
        <Card.Body>
          <div className='form-wrapper'>
            <div className='form-new-store'>
              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group>
                    <Form.Label>Toko ID</Form.Label>
                    <Form.Control
                      name='id'
                      type='number'
                      readOnly
                      value={storeInfo.id?.toString()}
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
                    name='address'
                    className='field-alamat'
                    onChange={(e) => storeInfoFormHandler(e)}
                  />
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Alamat 2</Form.Label>
                  <Form.Control
                    as='textarea'
                    name='address_2'
                    className='field-alamat'
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
                      onChange={(newValue) => setSelectedCity(newValue)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    name='email'
                    onChange={(e) => storeInfoFormHandler(e)}
                  />
                  {/* <Form.Group>
                    <Form.Label>Province</Form.Label>
                    <Select
                      classNamePrefix='select'
                      placeholder='Pilih Nama Provinsi'
                      isSearchable={true}
                      options={province}
                      value={{
                        value: selectedProvince?.value ?? null,
                        label: selectedProvince?.label ?? '',
                      }}
                      onChange={(newValue) => setSelectedProvince(newValue)}
                    />
                  </Form.Group> */}
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Telpon</Form.Label>
                  <Form.Control
                    type='number'
                    name='phone_number_1'
                    onChange={(e) => storeInfoFormHandler(e)}
                  />
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type='number'
                    name='zip_code'
                    onChange={(e) => storeInfoFormHandler(e)}
                  />
                  {/* <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    name='email'
                    onChange={(e) => storeInfoFormHandler(e)}
                  /> */}
                </Col>
              </Row>

              <hr />

              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group>
                    <Form.Label>Nama Bank</Form.Label>
                    <Form.Control
                      type='text'
                      name='bank_name'
                      onChange={(e) => storeInfoFormHandler(e)}
                    />
                    {/* <Select
                      classNamePrefix='select'
                      placeholder='Pilih Nama Bank'
                      isSearchable={true}
                      options={bank}
                      onChange={(newValue) => setSelectedBank(newValue)}
                    /> */}
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Nomor Akun</Form.Label>
                  <Form.Control
                    type='number'
                    name='bank_account'
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
                      name='bank_number'
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

            <Button variant='dark-primary' onClick={handleSubmitNewStore}>
              Save Update
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {NewStore}
