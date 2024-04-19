import React, {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'
import {Form, Button, Row, Card} from 'react-bootstrap'

interface Roles {
  value: number | null
  label: string
}

interface User {
  username: string
  password: string
  role_id: number | null
}

const NewUserHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
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

      if (Array.isArray(response.data.data)) {
        const tempRoles = response.data.data.map((item: any) => ({
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

  useEffect(() => {
    getRoles()
  }, [])

  // Role
  const [roles, setRoles] = useState<Roles[]>([])
  const [selectedRole, setSelectedRole] = useState<SingleValue<Roles>>({
    value: null,
    label: '',
  })

  // User
  const [userForm, setUserForm] = useState<User>({
    username: '',
    password: '',
    role_id: null,
  })

  // User Form Handler
  const userFormHandler = (e: any) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    })
  }

  // User Form Handler
  useEffect(() => {
    setUserForm((prev) => ({
      ...prev,
      role_id: selectedRole?.value ?? null,
    }))
  }, [selectedRole])

  // Function Clear State After Submit
  const clear = () => {
    setSelectedRole({
      value: null,
      label: 'Ketik/Pilih Role',
    })

    setUserForm({
      ...userForm,
      role_id: null,
      username: '',
      password: '',
    })
  }

  // Handle Create User
  const handleCreateUser = async () => {
    setIsLoading(true)

    await axios
      .post(`${apiUrl}/auth/register`, userForm, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        if (response.data.statusCode === 201) {
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
