import React, {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './UpdateProfile.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Card, Row, Col, Form, Button} from 'react-bootstrap'

interface Profile {
  full_name: string
  username: string
  email: string
  password: string
}

const UpdateProfile: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const userId = localStorage.getItem('user_id')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch API Data
  useEffect(() => {
    const getProfileData = async () => {
      try {
        await axios
          .get(`${apiUrl}/member/${userId}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          })
          .then((response) => {
            const data = response.data.data.member

            if (data) {
              setUserInfo((prev) => ({
                ...prev,
                full_name: data.full_name,
                email: data.email,
                phone_number: data.phone_number,
                whatsapp_number: data.whatsapp_number,
                address_1: data.address_1,
                address_2: data.address_2,
              }))
            }
          })
      } catch (error) {
        console.error(error)
      }
    }

    getProfileData()
  }, [])

  // User Profile
  const [userInfo, setUserInfo] = useState<Profile>({
    full_name: '',
    username: '',
    email: '',
    password: '',
  })

  // User Info Form Handler
  const memberInfoFormHandler = (e: any) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [e.target.name]: e.target.value,
    }))
  }

  const handleUpdateProfile = async () => {
    setIsLoading(true)

    await axios
      .post(`${apiUrl}/member/${userInfo}`, userInfo, {
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
            text: 'Success Update Profile',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate(`/home`)
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

  return (
    <section id='update-costumer'>
      <Card className='mb-5'>
        <Card.Body>
          <div className='form-wrapper'>
            <Row className='input-member mb-5'>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    name='full_name'
                    type='text'
                    value={userInfo.full_name}
                    onChange={(e) => memberInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    name='email'
                    type='email'
                    value={userInfo.email}
                    onChange={(e) => memberInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className='input-member mb-5'>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    name='username'
                    type='text'
                    value={userInfo.username}
                    onChange={(e) => memberInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group>
                  <Form.Label>Password</Form.Label>

                  <Form.Control
                    name='password'
                    type='text'
                    value={userInfo.password}
                    onChange={(e) => memberInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className='button-wrapper d-flex justify-content-center align-items-center'>
            <Button variant='dark-primary' disabled={isLoading} onClick={handleUpdateProfile}>
              {isLoading ? 'Updating..' : 'Update'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {UpdateProfile}
