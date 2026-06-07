import React, {useState, useEffect, FC} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './UpdateEmployee.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import Swal from 'sweetalert2'
import {Row, Col, Form, Button} from 'react-bootstrap'

interface PositionSelect {
  value: number | null
  label: string
}

interface StoreSelect {
  value: number | null
  label: string
}

interface Employee {
  store_id: number | null
  position_id: number | null
  full_name: string
  birth: string
  email: string
  nik: string
  phone_number: string
  default_password: string
}

const UpdateEmployee: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const userRole = localStorage.getItem('userRole')

  const staffStoreId = localStorage.getItem('storeId') as any
  const staffStoreName = localStorage.getItem('storeName') as string

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // List Store
  const [store, setStore] = useState<StoreSelect[]>([])
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreSelect>>({
    value: null,
    label: '',
  })

  // List Position
  const [position, setPosition] = useState<PositionSelect[]>([])
  const [selectedPosition, setSelectedPosition] = useState<SingleValue<PositionSelect>>({
    value: null,
    label: '',
  })

  // Employee
  const [employeeId, setEmployeeId] = useState<any>()
  const [employeeInfo, setEmployeeInfo] = useState<Employee>({
    store_id: null,
    position_id: null,
    full_name: '',
    birth: '',
    email: '',
    nik: '',
    phone_number: '',
    default_password: '',
  })

  // Fetch API Data
  useEffect(() => {
    const getEmployeeData = async () => {
      try {
        await axios
          .get(`${apiUrl}/employee/${params.id}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              // 'Access-Control-Allow-Origin': '*',
             // 'ngrok-skip-browser-warning':  'true',
            },
          })
          .then((response) => {
            const data = response.data.data

            if (data?.store_id) {
              setSelectedStore((prev) => ({
                ...prev,
                value: data.store.id,
                label: data.store.store_name,
              }))

              setEmployeeInfo((prev) => ({
                ...prev,
                store_id: data.store_id,
              }))
            }

            if (data?.position_id) {
              setEmployeeInfo((prev) => ({
                ...prev,
                position_id: data.position_id,
              }))

              setSelectedPosition((prev) => ({
                ...prev,
                value: data.position.id,
                label: data.position.position_name,
              }))
            }

            if (data) {
              setEmployeeId((prev: any) => ({
                ...prev,
                full_name: data?.full_name,
                birth: data?.birth,
                email: data?.email,
                nik: data?.nik,
                phone_number: data?.phone_number,
                default_password: data?.default_password,
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
            // 'Access-Control-Allow-Origin': '*',
           // 'ngrok-skip-browser-warning':  'true',
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

    const getPosition = async () => {
      try {
        const response = await axios.get(`${apiUrl}/positions`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            // 'Access-Control-Allow-Origin': '*',
           // 'ngrok-skip-browser-warning':  'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempPosition = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.position_name,
          }))

          setPosition(tempPosition)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getEmployeeData()
    getStore()
    getPosition()
  }, [])

  // Employee Form
  const employeeFormHandler = (e: any) => {
    setEmployeeInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      [e.target.name]: e.target.value,
    }))
  }

  // Change Select Store
  useEffect(() => {
    setEmployeeInfo((prev) => ({
      ...prev,
      store_id:
        userRole === 'Admin HO' ? selectedStore?.value ?? null : Number.parseInt(staffStoreId),
    }))
  }, [selectedStore])

  // Change Select Position
  useEffect(() => {
    setEmployeeInfo((prev) => ({
      ...prev,
      position_id: selectedPosition?.value ?? null,
    }))
  }, [selectedPosition])

  // Employee Validation
  const EmployeeValidation = () => {
    let valid = true

    if (!employeeInfo.full_name) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nama Staff form',
        icon: 'error',
      })
      valid = false
    } else if (!employeeInfo.nik) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill NIK form',
        icon: 'error',
      })
      valid = false
    } else if (!employeeInfo.birth) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Tanggal Lahir form',
        icon: 'error',
      })
      valid = false
    } else if (!employeeInfo.phone_number) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill WA / Phone Number form',
        icon: 'error',
      })
      valid = false
    } else if (!employeeInfo.email) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Email form',
        icon: 'error',
      })
      valid = false
    }

    return valid
  }

  // Handle Submit New Sales
  const handleUpdate = async () => {
    if (!EmployeeValidation()) {
      return false
    }

    setIsLoading(true)

    await axios
      .post(`${apiUrl}/employee/${params.id}`, employeeInfo, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        //  // 'Access-Control-Allow-Origin': '*',
        // // 'ngrok-skip-browser-warning':  'true',
        },
      })
      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          Swal.fire({
            title: 'Success',
            text: 'Success Update Employee',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          })
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })
        }

        navigate('/employee/new-employee')
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
    navigate('/employee/new-employee')
  }

  return (
    <section id='update-employee'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header mb-4'>
              <Form.Group>
                <Form.Label>
                  Nama Toko
                  {userRole === 'Admin HO' ? (
                    <Select
                      name='store_id'
                      className='form-control p-0'
                      classNamePrefix='select'
                      placeholder='Pilih Toko'
                      isSearchable={true}
                      options={store}
                      onChange={(newValue) => setSelectedStore(newValue)}
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
              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group className='mb-5'>
                  <Form.Label>Staff ID</Form.Label>
                  <Form.Control readOnly type='number' value={employeeId} />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Nama Staff</Form.Label>
                  <Form.Control
                    name='full_name'
                    type='text'
                    onChange={(e) => employeeFormHandler(e)}
                  />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Tanggal Lahir</Form.Label>
                  <Form.Control name='birth' type='date' onChange={(e) => employeeFormHandler(e)} />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control name='email' type='text' onChange={(e) => employeeFormHandler(e)} />
                </Form.Group>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group className='mb-5'>
                  <Form.Label>Posisi</Form.Label>

                  {userRole === 'Admin HO' ? (
                    <Select
                      classNamePrefix='select'
                      placeholder='Pilih Nama Posisi'
                      isSearchable={true}
                      options={position}
                      onChange={(newValue) => setSelectedPosition(newValue)}
                    />
                  ) : (
                    <Form.Control readOnly type='text' value='Store Staff' />
                  )}
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>NIK</Form.Label>
                  <Form.Control name='nik' type='number' onChange={(e) => employeeFormHandler(e)} />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>WA / Phone Number</Form.Label>
                  <Form.Control
                    name='phone_number'
                    type='number'
                    onChange={(e) => employeeFormHandler(e)}
                  />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Reset Password</Form.Label>
                  <Form.Control
                    name='default_password'
                    type='text'
                    onChange={(e) => employeeFormHandler(e)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className='d-flex justify-content-center mt-5'>
            <Button variant='dark-danger' type='submit' onClick={handleCancel}>
              Cancel
            </Button>

            <Button
              variant='dark-primary'
              type='submit'
              disabled={isLoading}
              onClick={() => {
                handleUpdate()
              }}
            >
              {isLoading ? 'Updating..' : 'Update'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {UpdateEmployee}
