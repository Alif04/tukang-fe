import React, {useState, useEffect, FC} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './UpdateManager.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'

import {Card, Row, Col, Form, Button} from 'react-bootstrap'

interface StoreSelect {
  value: number | null
  label: string
}

interface BankSelect {
  value: number | null
  label: string
}

interface Manager {
  id: number | null
  store_id: number | null
  bank_id: number | null
  full_name: string
  nik: string
  username: string
  account_name: string
  phone_number: string
  account_number: string
  password: string
  is_active: number
}

const UpdateManager: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()

  const userRole = localStorage.getItem('userRole') as string
  const staffStoreName = localStorage.getItem('storeName') as string

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // List Store
  const [store, setStore] = useState<StoreSelect[]>([])
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreSelect>>({
    value: null,
    label: '',
  })

  // List Manager
  const [managerId, setManagerId] = useState<any>()
  const [managerInfo, setManagerInfo] = useState<Manager>({
    id: null,
    store_id: null,
    bank_id: null,
    full_name: '',
    username: '',
    nik: '',
    account_name: '',
    phone_number: '',
    account_number: '',
    password: '',
    is_active: 1,
  })

  // Bank
  const [bank, setBank] = useState<BankSelect[]>([])
  const [selectedBank, setSelectedBank] = useState<SingleValue<BankSelect>>({
    value: null,
    label: '',
  })

  // Fetch API Data
  useEffect(() => {
    const getSalesData = async () => {
      try {
        await axios
          .get(`${apiUrl}/manager/${params.id}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          })
          .then((response) => {
            const data = response.data.data
            console.log(data)

            if (data?.id) {
              setManagerId(data.id)
            }

            if (data?.store_id) {
              setSelectedStore((prev) => ({
                ...prev,
                value: data.store.id,
                label: data.store.store_name,
              }))

              setManagerInfo((prev: any) => ({
                ...prev,
                store_id: data.store_id,
              }))
            }

            if (data?.bank_id) {
              setManagerInfo((prev: any) => ({
                ...prev,
                bank_id: data.bank_id,
              }))

              setSelectedBank((prev) => ({
                ...prev,
                value: data.bank.id,
                label: data.bank.bank_name,
              }))
            }

            if (data) {
              setManagerInfo((prev: any) => ({
                ...prev,
                full_name: data?.full_name,
                username: data?.users?.username,
                account_name: data.account_name,
                phone_number: data?.phone_number,
                account_number: data?.account_number,
              }))
            }
          })
      } catch (error) {
        console.error(error)
      }
    }

    const getStore = async () => {
      try {
        const response = await axios.get(`${apiUrl}/stores?take=0`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempStore = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.store_name,
            address: item.address,
            city_id: item.city_id,
            zip_code: item.zip_code,
          }))

          setStore(tempStore)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const getBank = async () => {
      try {
        const response = await axios.get(`${apiUrl}/bank?take=0`, {
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

    getSalesData()
    getStore()
    getBank()
    // eslint-disable-next-line
  }, [])

  // Manager Form
  const managerInfoFormHandler = (e: any) => {
    setManagerInfo((prevManagerInfo: any) => ({
      ...prevManagerInfo,
      [e.target.name]: e.target.value,
    }))
  }

  // Change Select Store
  useEffect(() => {
    setManagerInfo((prev: any) => ({
      ...prev,
      store_id: selectedStore?.value ?? null,
    }))
  }, [selectedStore])

  // Change Select Bank
  useEffect(() => {
    setManagerInfo((prev: any) => ({
      ...prev,
      bank_id: selectedBank?.value ?? null,
    }))
  }, [selectedBank])

  // Manager Validation
  const ManagerValidation = () => {
    let valid = true

    if (managerInfo.full_name === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong isi formulir Nama Manager Consultant',
        icon: 'warning',
      })
      valid = false
    } else if (managerInfo.store_id === null) {
      Swal.fire({
        title: 'Warning',
        text: 'Please pilih formulir Nama Toko',
        icon: 'warning',
      })
      valid = false
    } else if (managerInfo.phone_number === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong isi formulir WA/Phone Number',
        icon: 'warning',
      })
      valid = false
    } else if (managerInfo.bank_id === null) {
      Swal.fire({
        title: 'Warning',
        text: 'Please pilih formulir Nama Bank',
        icon: 'warning',
      })
      valid = false
    } else if (managerInfo.account_number === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong isi formulir Nomor Akun Bank',
        icon: 'warning',
      })
      valid = false
    } else if (managerInfo.account_name === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong isi formulir Nama Pemilik Akun Bank',
        icon: 'warning',
      })
      valid = false
    }

    return valid
  }

  // Desctructure Object if the value null or empty string
  const objectValueCheck = (data: Manager) => {
    let cleanedData: Partial<Manager> = {}

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        cleanedData[key as keyof Manager] = value
      }
    })

    return cleanedData
  }

  // Handle Submit New Manager
  const handleUpdateManager = async () => {
    if (!ManagerValidation()) {
      setIsLoading(false)
      return false
    }

    setIsLoading(true)

    const salesData = objectValueCheck(managerInfo)

    await axios
      .post(`${apiUrl}/manager/${params.id}`, salesData, {
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
            text: 'Success Update Manager',
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

        navigate('/manager/new-manager')
      })
      .catch((error) => {
        setIsLoading(false)
        console.error(error)
        Swal.fire({
          title: 'Terjadi Kesalahan Pada Server',
          text: 'Tolong untuk mencoba hubungi administrator',
          icon: 'error',
        })
      })
  }

  const handleCancelCreateManager = () => {
    navigate('/manager/new-manager')
  }

  return (
    <section id='update-manager'>
      <div className='form-wrapper'>
        <Card className='mb-3'>
          <Card.Header>
            <Card.Title>Profile</Card.Title>
          </Card.Header>

          <Card.Body>
            <Row>
              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Nama Toko
                  {['Super User', 'Admin HO'].includes(userRole) ? (
                    <Select
                      name='store_id'
                      className='form-control p-0'
                      classNamePrefix='select'
                      placeholder='Pilih Toko'
                      isSearchable={true}
                      options={store}
                      onChange={(newValue) => setSelectedStore(newValue)}
                      value={{
                        value: selectedStore?.value ?? null,
                        label: selectedStore?.label ?? '',
                      }}
                    />
                  ) : (
                    <span className='fs-6 ms-2 pt-2 pb-2 fw-semibold bg-secondary'>
                      {staffStoreName}
                    </span>
                  )}
                </Form.Label>
              </Form.Group>
            </Row>

            <Row>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Manager ID</Form.Label>
                  <Form.Control readOnly type='number' value={managerId} />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
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

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Nama Manager Consultant</Form.Label>
                  <Form.Control
                    name='full_name'
                    type='text'
                    value={managerInfo.full_name}
                    onChange={(e) => managerInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className='input-order'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Nomor Akun Bank</Form.Label>
                  <Form.Control
                    name='account_number'
                    type='number'
                    value={managerInfo.account_number}
                    onChange={(e) => managerInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>WA / Phone Number</Form.Label>
                  <Form.Control
                    name='phone_number'
                    type='number'
                    value={managerInfo.phone_number}
                    onChange={(e) => managerInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Nama Pemilik Akun</Form.Label>
                  <Form.Control
                    name='account_name'
                    type='text'
                    value={managerInfo.account_name}
                    onChange={(e) => managerInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>NIK</Form.Label>
                  <Form.Control
                    name='nik'
                    type='number'
                    value={managerInfo.nik}
                    onChange={(e) => managerInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <hr />

        <Card>
          <Card.Header>
            <Card.Title>Account</Card.Title>
          </Card.Header>

          <Card.Body>
            <Row>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group className='mb-5'>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    name='username'
                    type='text'
                    value={managerInfo.username}
                    onChange={(e) => managerInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group className='mb-5'>
                  <Form.Label>Reset Password</Form.Label>
                  <Form.Control
                    name='password'
                    type='text'
                    value={managerInfo.password}
                    onChange={(e) => managerInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>

      <div className='d-flex justify-content-center mt-5'>
        <Button variant='dark-danger' type='submit' onClick={handleCancelCreateManager}>
          Cancel
        </Button>

        <Button
          className='d-flex justify-content-center align-items-center'
          variant='dark-primary'
          type='submit'
          disabled={isLoading}
          onClick={() => {
            handleUpdateManager()
          }}
        >
          {isLoading ? 'Updating..' : 'Update'}
        </Button>
      </div>
    </section>
  )
}

export {UpdateManager}
