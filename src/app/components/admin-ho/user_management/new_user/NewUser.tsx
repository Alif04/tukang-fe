import React, {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'
import {Form, Button, Row, Card} from 'react-bootstrap'

interface StoreSelect {
  value: number | null
  label: string
}

interface Roles {
  value: number | null
  label: string
}

interface User {
  role_id: number | null
  store_id: number | null
  vendor_id: number | null
  pic_name: string
  email: string
  username: string
  password: string
}

const NewUserHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const userRole = localStorage.getItem('userRole')
  const vendorId = localStorage.getItem('vendor_id') as any

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch Data Role
  const getRoles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/roles`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data.data)) {
        const tempRoles = response.data.data.data
          .filter(
            (item: any) => !['Admin Vendor', 'Tukang', 'Employee', 'Member'].includes(item.name)
          )
          .map((item: any) => ({
            value: item.id,
            label: item.name,
          }))

        setRoles(tempRoles)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
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
        }))

        setStore(tempStore)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getRoles()
    getStore()
  }, [])

  // Role
  const [roles, setRoles] = useState<Roles[]>([])
  const [selectedRole, setSelectedRole] = useState<SingleValue<Roles>>({
    value: null,
    label: '',
  })

  // Store
  const [store, setStore] = useState<StoreSelect[]>([])
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreSelect>>({
    value: null,
    label: '',
  })

  // User
  const [userForm, setUserForm] = useState<User>({
    role_id: userRole === 'Owner Vendor' ? Number(5) : null,
    store_id: null,
    vendor_id: userRole === 'Owner Vendor' ? Number.parseInt(vendorId) ?? null : null,
    pic_name: '',
    email: '',
    username: '',
    password: '',
  })

  // User Form Handler
  const userFormHandler = (e: any) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    })
  }

  // User Role Handler
  useEffect(() => {
    if (userRole === 'Super User') {
      setUserForm((prev) => ({
        ...prev,
        role_id: selectedRole?.value ?? null,
      }))
    }
  }, [selectedRole])

  // User Store Handler
  useEffect(() => {
    setUserForm((prev) => ({
      ...prev,
      store_id: selectedStore?.value ?? null,
    }))
  }, [selectedStore])

  // Function Clear State After Submit
  const clear = () => {
    setSelectedRole({
      value: null,
      label: 'Ketik/Pilih Role',
    })

    setUserForm({
      ...userForm,
      role_id: null,
      store_id: null,
      vendor_id: null,
      username: '',
      password: '',
    })
  }

  // User Validation
  const UserValidation = () => {
    let valid = true

    if (!userForm.username) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Username form',
        icon: 'warning',
      })
      valid = false
    } else if (!userForm.password) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Password form',
        icon: 'warning',
      })
      valid = false
    }

    return valid
  }

  // Desctructure Object if the value null or empty string
  const objectValueCheck = (data: User) => {
    let cleanedData: Partial<User> = {}

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        cleanedData[key as keyof User] = value
      }
    })

    return cleanedData
  }

  // Handle Create User
  const handleCreateUser = async () => {
    if (!UserValidation()) {
      setIsLoading(false)
      return false
    }

    setIsLoading(true)
    const userData = objectValueCheck(userForm)

    await axios
      .post(`${apiUrl}/auth/register`, userData, {
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
            icon: 'success',
            text: 'Success Create User',
            showConfirmButton: false,
            timer: 1500,
          })

          setIsLoading(false)
        } else {
          setIsLoading(false)

          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })
        }

        navigate('/user/view-user')
      })
      .catch((error) => {
        setIsLoading(false)

        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
        })
      })
  }

  // Dynamic Fields
  const dynamicOptions = () => {
    const role = selectedRole?.label ?? ''

    switch (role) {
      case 'Store Staff':
      case 'Store CS':
      case 'Sales':
        return (
          <>
            <Row className='mb-5'>
              <Form.Group className='form-template'>
                <Form.Label className='fs-5'>Assign To Store :</Form.Label>

                <Select
                  name='store_id'
                  id='store_id'
                  className='form-control p-0 form-item-name'
                  classNamePrefix='select'
                  placeholder='Pilih/Ketik Role'
                  isSearchable={true}
                  isClearable={true}
                  options={store}
                  onChange={(newValue) => setSelectedStore(newValue)}
                />
              </Form.Group>
            </Row>
          </>
        )

      default:
        return null
    }
  }

  return (
    <section id='new-user'>
      <Card className='mb-5'>
        <Card.Body>
          {userRole === 'Super User' && (
            <>
              <Row className='mb-5'>
                <Form.Group className='form-template'>
                  <Form.Label className='fs-5'>Roles :</Form.Label>

                  <Select
                    name='role_id'
                    id='role_id'
                    className='form-control p-0 form-item-name'
                    classNamePrefix='select'
                    placeholder='Pilih/Ketik Role'
                    isSearchable={true}
                    isClearable={true}
                    options={roles}
                    onChange={(newValue) => setSelectedRole(newValue)}
                  />
                </Form.Group>
              </Row>

              {dynamicOptions()}
            </>
          )}

          {userRole === 'Owner Vendor' && (
            <>
              <Row className='mb-5'>
                <Form.Group className='form-template'>
                  <Form.Label className='fs-5'>Nama :</Form.Label>

                  <Form.Control
                    name='pic_name'
                    value={userForm.pic_name}
                    onChange={(e) => userFormHandler(e)}
                  />
                </Form.Group>
              </Row>

              <Row className='mb-5'>
                <Form.Group className='form-template'>
                  <Form.Label className='fs-5'>Email :</Form.Label>

                  <Form.Control
                    name='email'
                    value={userForm.email}
                    onChange={(e) => userFormHandler(e)}
                  />
                </Form.Group>
              </Row>
            </>
          )}

          <Row className='mb-5'>
            <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Username :</Form.Label>

              <Form.Control
                name='username'
                value={userForm.username}
                onChange={(e) => userFormHandler(e)}
              />
            </Form.Group>
          </Row>

          <Row className='mb-5'>
            <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Password :</Form.Label>

              <Form.Control
                name='password'
                value={userForm.password}
                onChange={(e) => userFormHandler(e)}
              />
            </Form.Group>
          </Row>

          <div className='d-flex justify-content-center'>
            <Button
              className='d-flex justify-content-center align-items-center m-0'
              variant='dark-primary'
              type='submit'
              disabled={isLoading}
              onClick={() => handleCreateUser()}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {NewUserHO}
