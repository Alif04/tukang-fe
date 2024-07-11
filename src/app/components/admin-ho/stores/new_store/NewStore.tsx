import React, {FC, useState, useEffect} from 'react'

import './NewStore.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, Button, Card} from 'react-bootstrap'

interface AreaItem {
  value: number | null
  label: string
}

// interface Bank {
//   value: number | null
//   label: string
// }

interface Store {
  id: number | null
  store_name: string
  address: string
  additional_address: string
  area_id: number | null
  phone_number_1: number | null
  email: string
  bank_name: string
  bank_number: string
  bank_account: number | null
  zip_code: string
  username: string
  default_password: string
}

const NewStore: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Store
  const [storeInfo, setStoreInfo] = useState<Store>({
    id: null,
    store_name: '',
    address: '',
    additional_address: '',
    area_id: null,
    phone_number_1: null,
    email: '',
    bank_name: '',
    bank_number: '',
    bank_account: null,
    zip_code: '',
    username: '',
    default_password: '',
  })

  console.log('store info', storeInfo)

  // Area
  const [area, setArea] = useState<AreaItem[]>([])
  const [selectedArea, setSelectedArea] = useState<SingleValue<AreaItem>>({
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
          const tempCity = response.data.data.map((item: any) => ({
            value: item?.id ?? null,
            label: item?.area ?? '',
          }))

          setArea(tempCity)
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

    getStoreId()
    getArea()
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
      area_id: selectedArea?.value ?? null,
    }))
  }, [selectedArea])

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
        text: 'Please fill Alamat form',
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
        text: 'Please fill Nama Bank form',
        icon: 'error',
      })
      valid = false
    } else if (!storeInfo.bank_account) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nama Akun form',
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
    } else if (!storeInfo.default_password) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Password form',
        icon: 'error',
      })
      valid = false
    }

    return valid
  }

  const objectValueCheck = (data: Store) => {
    let cleanedData: Partial<Store> = {}

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        cleanedData[key as keyof Store] = value
      }
    })

    return cleanedData
  }

  const handleSubmitNewStore = async () => {
    if (!StoreValidation()) {
      return false
    }

    setIsLoading(true)
    const storeBody = objectValueCheck(storeInfo)
    await axios
      .post(`${apiUrl}/stores`, storeBody, {
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
            text: 'Success Add New Store',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate(`/store/view-store`)
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
        console.error(error)
        setIsLoading(false)

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
                  <Form.Label>
                    Alamat Kedua<span className='text-optional text-danger'> (optional)</span>
                  </Form.Label>
                  <Form.Control
                    as='textarea'
                    name='additional_address'
                    className='field-alamat'
                    onChange={(e) => storeInfoFormHandler(e)}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    name='email'
                    onChange={(e) => storeInfoFormHandler(e)}
                  />
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Telpon</Form.Label>
                  <Form.Control
                    type='text'
                    name='phone_number_1'
                    onChange={(e) => storeInfoFormHandler(e)}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type='number'
                    name='zip_code'
                    onChange={(e) => storeInfoFormHandler(e)}
                  />
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Default Password</Form.Label>

                  <Form.Control
                    type='text'
                    name='default_password'
                    onChange={(e) => storeInfoFormHandler(e)}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>
                    Username <span className='text-optional text-danger'> (optional)</span>
                  </Form.Label>

                  <Form.Control
                    type='text'
                    name='username'
                    onChange={(e) => storeInfoFormHandler(e)}
                  />

                  <Form.Text className='fs-8 fs-l text-dark-danger'>
                    *Jika username kosong, maka sistem akan menghasilkan username secara otomatis
                    dari nama toko, dengan format semua huruf kecil dan spasi diganti menjadi
                    underscore ( _ ).
                  </Form.Text>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group>
                    <Form.Label>Area</Form.Label>
                    <Select
                      classNamePrefix='select'
                      placeholder='Pilih Area'
                      isSearchable={true}
                      options={area}
                      onChange={(newValue) => setSelectedArea(newValue)}
                    />
                  </Form.Group>
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
              {isLoading ? 'Saving..' : 'Save'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {NewStore}
