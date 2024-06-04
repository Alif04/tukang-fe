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

interface IncentiveSales {
  role_id: number | null
  store_id: number | null
  vendor_id: number | null
  pic_name: string
  email: string
  username: string
  password: string
}

const CreateIncentiveSales: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const userRole = localStorage.getItem('userRole')
  const vendorId = localStorage.getItem('vendor_id') as any

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch Data
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
    getStore()
  }, [])

  // Store
  const [store, setStore] = useState<StoreSelect[]>([])
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreSelect>>({
    value: null,
    label: '',
  })

  // User
  const [userForm, setUserForm] = useState<IncentiveSales>({
    role_id: null,
    store_id: null,
    vendor_id: userRole === 'Admin Vendor' ? Number.parseInt(vendorId) ?? null : null,
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

  // User Store Handler
  useEffect(() => {
    setUserForm((prev) => ({
      ...prev,
      store_id: selectedStore?.value ?? null,
    }))
  }, [selectedStore])

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
    } else if (!userForm.pic_name) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill PIC Name form',
        icon: 'warning',
      })
      valid = false
    }

    return valid
  }

  // Desctructure Object if the value null or empty string
  const objectValueCheck = (data: IncentiveSales) => {
    let cleanedData: Partial<IncentiveSales> = {}

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        cleanedData[key as keyof IncentiveSales] = value
      }
    })

    return cleanedData
  }

  // Handle Create User
  const handleCreateUser = async () => {
    if (!UserValidation()) {
      setIsLoading(true)
      return false
    }

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
        if (response.data.statusCode === 201 || response.data.statusCode === 200) {
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

  return (
    <section id='new-user'>
      <Card className='mb-5'>
        <Card.Body>
          <Row className='mb-5'>
            <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Nama PIC :</Form.Label>

              <Form.Control
                name='pic_name'
                value={userForm.pic_name}
                onChange={(e) => userFormHandler(e)}
              />
            </Form.Group>
          </Row>

          <Row className='mb-5'>
            <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Email PIC :</Form.Label>

              <Form.Control
                name='email'
                value={userForm.email}
                onChange={(e) => userFormHandler(e)}
              />
            </Form.Group>
          </Row>

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
              className='d-flex justify-content-center align-items-center'
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

export {CreateIncentiveSales}
