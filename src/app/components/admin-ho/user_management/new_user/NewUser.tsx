import React, {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Form, Button, Row, Card} from 'react-bootstrap'

interface user {
  name: string
}

const NewUserHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // User State
  const [userForm, setUserForm] = useState<user>({
    name: '',
  })

  // User Form Handler
  const userFormHandler = (e: any) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    })
  }

  // Function Clear State After Submit
  const clear = () => {
    setUserForm((prev) => ({
      ...prev,
      name: '',
    }))
  }

  // Handle Create User
  const handleCreateUser = async () => {
    setIsLoading(true)

    await axios
      .post(`${apiUrl}/auth/user`, userForm, {
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
            text: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            clear()
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
              <Form.Label className='fs-5'>Nama :</Form.Label>

              <Form.Control
                name='name'
                value={userForm.name}
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
