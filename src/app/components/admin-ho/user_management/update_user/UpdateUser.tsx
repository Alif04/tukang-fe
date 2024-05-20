import React, {FC, useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import Swal from 'sweetalert2'
import {Form, Button, Row, Card} from 'react-bootstrap'

interface StoreSelect {
  value: number | null
  label: string
}

interface VendorSelect {
  value: number | null
  label: string
}

interface Roles {
  value: number | null
  label: string
}

interface User {
  username: string
  password: string
  role_id: number | null
  store_id: number | null
  vendor_id: number | null
}

const UpdateUserHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch Data User
  const fetchUserData = async () => {
    try {
      await axios
        .get(`${apiUrl}/auth/find-user/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data.data

          if (data) {
            setUserForm((prev) => ({
              ...prev,
              username: data?.username,
            }))

            setSelectedRole((prev) => ({
              ...prev,
              value: data?.roles?.id,
              label: data?.roles?.role_name,
            }))

            setSelectedStore((prev) => ({
              ...prev,
              value: data?.store?.id,
              label: data?.store?.store_name,
            }))

            setSelectedVendor((prev) => ({
              ...prev,
              value: data?.vendor?.id,
              label: data?.vendor?.company_name,
            }))
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  // // Fetch Data Role
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

      if (Array.isArray(response.data.data)) {
        const tempRoles = response.data.data
          .filter((item: any) => item.name !== 'Admin HO')
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

      if (Array.isArray(response.data.data.data)) {
        const tempStore = response.data.data.data.map((item: any) => ({
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

  useEffect(() => {
    fetchUserData()
    getRoles()
    getStore()
    getVendor()
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

  // Vendor
  const [vendor, setVendor] = useState<VendorSelect[]>([])
  const [selectedVendor, setSelectedVendor] = useState<SingleValue<VendorSelect>>({
    value: null,
    label: '',
  })

  // User
  const [userForm, setUserForm] = useState<User>({
    username: '',
    password: '',
    role_id: null,
    store_id: null,
    vendor_id: null,
  })

  // User Form Handler
  const userFormHandler = (e: any) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    })
  }

  // Change Select Role
  useEffect(() => {
    setUserForm((prev) => ({
      ...prev,
      role_id: selectedRole?.value ?? null,
    }))
  }, [selectedRole])

  // User Store Handler
  useEffect(() => {
    setUserForm((prev) => ({
      ...prev,
      store_id: selectedStore?.value ?? null,
    }))
  }, [selectedStore])

  // User Vendor Handler
  useEffect(() => {
    setUserForm((prev) => ({
      ...prev,
      vendor_id: selectedVendor?.value ?? null,
    }))
  }, [selectedVendor])

  // User Validation
  const UserValidation = () => {
    let valid = true

    if (!userForm.username) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Username form',
        icon: 'error',
      })
      valid = false
    } else if (!userForm.password) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Password form',
        icon: 'error',
      })
      valid = false
    }

    return valid
  }

  // Destructure object if element null
  const updatedUser = (userForm: User) => {
    let userData: Partial<User> = {...userForm}

    if (userForm.store_id === null) {
      const {store_id, ...newUserForm} = userData
      userData = newUserForm
    } else if (userForm.vendor_id === null) {
      const {vendor_id, ...newUserForm} = userData
      userData = newUserForm
    }

    return userData
  }

  // Handle Update User
  const handleUpdate = async () => {
    if (!UserValidation()) {
      setIsLoading(true)
      return false
    }

    const userData = updatedUser(userForm)

    await axios
      .post(`${apiUrl}/auth/update/${params.id}`, userData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        if (response.data.status === 200) {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'Success Update User Data',
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
      case 'Employee':
      case 'Member':
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
                  value={{
                    value: selectedStore?.value ?? null,
                    label: selectedStore?.label ?? '',
                  }}
                  onChange={(newValue) => setSelectedStore(newValue)}
                />
              </Form.Group>
            </Row>
          </>
        )

      case 'Tukang':
        return (
          <Row className='mb-5'>
            <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Assign To Vendor :</Form.Label>

              <Select
                name='vendor_id'
                id='vendor_id'
                className='form-control p-0 form-item-name'
                classNamePrefix='select'
                placeholder='Pilih/Ketik Role'
                isSearchable={true}
                isClearable={true}
                options={vendor}
                value={{
                  value: selectedVendor?.value ?? null,
                  label: selectedVendor?.label ?? '',
                }}
                onChange={(newValue) => setSelectedVendor(newValue)}
              />
            </Form.Group>
          </Row>
        )

      default:
        return null
    }
  }

  return (
    <section id='update-user'>
      <Card className='mb-5'>
        <Card.Body>
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
                value={{
                  value: selectedRole?.value ?? null,
                  label: selectedRole?.label ?? '',
                }}
                onChange={(newValue) => setSelectedRole(newValue)}
              />
            </Form.Group>
          </Row>

          {dynamicOptions()}

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
              <Form.Label className='fs-5'>Reset Password :</Form.Label>

              <Form.Control
                name='password'
                value={userForm.password}
                onChange={(e) => userFormHandler(e)}
              />
            </Form.Group>
          </Row>

          <div className='d-flex justify-content-center'>
            <Button
              variant='dark-primary'
              type='submit'
              disabled={isLoading}
              onClick={() => handleUpdate()}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {UpdateUserHO}
