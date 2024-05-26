import React, {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './NewCostumers.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'
import {Row, Col, Form, InputGroup, Button, Card} from 'react-bootstrap'

interface Store {
  value: number | null
  label: string
}

interface Member {
  full_name: string
  email: string
  phone_number: any
  whatsapp_number: any
  address_1: string
  address_2: string
  join_location: number | null
}

const NewCostumerHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Store
  const [store, setStore] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<SingleValue<Store>>({
    value: null,
    label: 'All Store',
  })

  // Member
  const [memberInfo, setMemberInfo] = useState<Member>({
    full_name: '',
    email: '',
    phone_number: '',
    whatsapp_number: '',
    address_1: '',
    address_2: '',
    join_location: null,
  })

  // Member Info Form Handler
  const memberInfoFormHandler = (e: any) => {
    let newValue = e.target.value

    if (e.target.name === 'phone_number' && !newValue.startsWith('08')) {
      newValue = '08' + newValue
    }

    setMemberInfo((prevMemberInfo) => ({
      ...prevMemberInfo,
      [e.target.name]: newValue,
    }))
  }

  // Change Select Store
  useEffect(() => {
    setMemberInfo((prev) => ({
      ...prev,
      join_location: selectedStore?.value ?? null,
    }))
  }, [selectedStore])

  // Fetch Store Data
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

  // Member Validation
  const MemberValidation = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let valid = true

    if (memberInfo.full_name === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Full Name form',
        icon: 'warning',
      })
      valid = false
    } else if (memberInfo.phone_number === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Phone Number form',
        icon: 'warning',
      })
      valid = false
    } else if (memberInfo.whatsapp_number === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Whatsapp Number form',
        icon: 'warning',
      })
      valid = false
    } else if (memberInfo.address_1 === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Address 1 form',
        icon: 'warning',
      })
      valid = false
    } else if (memberInfo.join_location === null) {
      Swal.fire({
        title: 'Warning',
        text: 'Please select store',
        icon: 'warning',
      })
      valid = false
    } else if (memberInfo.email === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Email form',
        icon: 'warning',
      })
      valid = false
    } else if (memberInfo.email && !emailPattern.test(memberInfo.email)) {
      Swal.fire({
        title: 'Invalid Email',
        text: 'Please fill with correct Email',
        icon: 'warning',
      })
      valid = false
    }

    return valid
  }

  const handleSubmitNewMember = async () => {
    if (!MemberValidation()) {
      setIsLoading(false)
      return false
    }

    setIsLoading(true)
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
        if (response.data.status === 201) {
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
      <Card className='mb-5'>
        <Card.Body>
          <div className='form-wrapper'>
            <Row className='input-store mb-5'>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group>
                  <Form.Label>Nama Toko :</Form.Label>

                  <Select
                    name='store_id'
                    className='form-control p-0'
                    classNamePrefix='select'
                    placeholder='Pilih Toko'
                    isSearchable={true}
                    isClearable={true}
                    options={store}
                    onChange={(newValue) => setSelectedStore(newValue)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6}></Col>
            </Row>

            <Row className='input-member mb-5'>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    name='full_name'
                    type='text'
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
                    onChange={(e) => memberInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className='input-member mb-5'>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>

                  <InputGroup>
                    <InputGroup.Text>08</InputGroup.Text>
                    <Form.Control
                      name='phone_number'
                      type='number'
                      onChange={(e) => memberInfoFormHandler(e)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group>
                  <Form.Label>Whatsapp Number</Form.Label>

                  <InputGroup>
                    <InputGroup.Text>+ 62</InputGroup.Text>
                    <Form.Control
                      name='whatsapp_number'
                      type='number'
                      onChange={(e) => memberInfoFormHandler(e)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row className='alamat-member'>
              <Col>
                <Form.Group>
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
                <Form.Group>
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

          <div className='button-wrapper d-flex justify-content-center align-items-center'>
            <Button variant='dark-danger' onClick={handleCancel}>
              Cancel
            </Button>

            <Button variant='dark-primary' disabled={isLoading} onClick={handleSubmitNewMember}>
              {isLoading ? 'Saving..' : 'Save'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {NewCostumerHO}
