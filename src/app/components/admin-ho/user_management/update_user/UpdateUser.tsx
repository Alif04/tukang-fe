import React, {FC, useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Form, Button, Row, Card} from 'react-bootstrap'

interface user {
  name: string
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
          const data = response.data.data

          if (data) {
            setUserForm((prev) => ({
              ...prev,
              name: data?.name,
            }))
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

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

  // Handle Update User
  const handleUpdate = async () => {
    setIsLoading(true)

    await axios
      .post(`${apiUrl}/auth/update/${params.id}`, userForm, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        if (response.data.statusCode === 200) {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'Success Update User Data',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate('/csi/format-pertanyaan-csi')
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
    <section id='update-user'>
      <Card className='mb-5'>
        <Card.Body>
          <Row>
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
