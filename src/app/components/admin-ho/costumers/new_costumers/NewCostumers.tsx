import React, {FC, useState, useEffect} from 'react'

import './NewCostumers.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, InputGroup, Button} from 'react-bootstrap'

interface Member {
  full_name: string
  email: string
  phone_number: any
  whatsapp_number: any
  address_1: string
  address_2: string
}

const NewCostumerHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [memberInfo, setMemberInfo] = useState<Member>({
    full_name: '',
    email: '',
    phone_number: '',
    whatsapp_number: '',
    address_1: '',
    address_2: '',
  })

  // Member Info Form Handler
  const memberInfoFormHandler = (e: any) => {
    let newValue = e.target.value

    if (e.target.name === 'whatsapp_number' && !newValue.startsWith('+62')) {
      newValue = '+62' + newValue
    }

    setMemberInfo((prevMemberInfo) => ({
      ...prevMemberInfo,
      [e.target.name]: newValue,
    }))
  }

  // Is Whatsapp
  // useEffect(() => {
  //   setMemberInfo({
  //     ...memberInfo,
  //     whatsapp_number: isWhatsapp === true ? memberInfo.whatsapp_number : memberInfo.phone_number,
  //   })
  // }, [isWhatsapp])

  const handleSubmitNewMember = async () => {
    await axios
      .post(`${apiUrl}/member`, memberInfo, {
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
            text: 'Success Add New Customers',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate(`/costumers/view-costumers`)
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
    navigate('/costumers/view-costumers')
  }

  return (
    <section id='new-costumer'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <div className='form-new-costumer'>
              <Row className='input-order'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      name='full_name'
                      type='text'
                      onChange={(e) => memberInfoFormHandler(e)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      name='email'
                      type='email'
                      onChange={(e) => memberInfoFormHandler(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className='input-order'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      name='phone_number'
                      type='number'
                      onChange={(e) => memberInfoFormHandler(e)}
                    />
                  </Form.Group>

                  {/* <Form.Group className='mb-5'>
                    <div className='d-flex justify-content-between'>
                      <Form.Label>WA / Phone Number</Form.Label>

                      <div className='form-check-request'>
                        <Form.Check
                          inline
                          label='Bukan Whatsapp'
                          name='group1'
                          value='1'
                          type='checkbox'
                          onChange={() => setIsWhatsapp(!isWhatsapp)}
                        />
                      </div>
                    </div>

                    <InputGroup className='mb-5'>
                      <InputGroup.Text>+ 62</InputGroup.Text>
                      <Form.Control
                        name={isWhatsapp === true ? 'whatsapp_number' : 'phone_number'}
                        type='number'
                        value={
                          isWhatsapp === true ? memberInfo.whatsapp_number : memberInfo.phone_number
                        }
                        onChange={(e) => {
                          memberInfoFormHandler(e)
                        }}
                      />
                    </InputGroup>
                  </Form.Group> */}
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Label>Whatsapp Number</Form.Label>

                  <InputGroup className='mb-5'>
                    <InputGroup.Text>+ 62</InputGroup.Text>
                    <Form.Control
                      name='whatsapp_number'
                      type='number'
                      onChange={(e) => memberInfoFormHandler(e)}
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row className='alamat-order'>
                <Col>
                  <Form.Group className='mb-5'>
                    <Form.Label>Address 1</Form.Label>
                    <Form.Control
                      name='address_1'
                      as='textarea'
                      className='field-alamat w-100'
                      onChange={(e) => memberInfoFormHandler(e)}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className='mb-5'>
                    <Form.Label>Address 2</Form.Label>
                    <Form.Control
                      name='address_2'
                      as='textarea'
                      className='field-alamat w-100'
                      onChange={(e) => memberInfoFormHandler(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>

          <div className='button-wrapper d-flex justify-content-center align-items-center'>
            <Button variant='dark-danger' onClick={handleCancel}>
              Cancel
            </Button>

            <Button variant='dark-primary' disabled={isLoading} onClick={handleSubmitNewMember}>
              {isLoading ? 'Saving..' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewCostumerHO}
