import React, {FC, useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './UpdateCostumers.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'
import {Card, Row, Col, Form, Button} from 'react-bootstrap'

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

const UpdateCostumerHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch API Data
  useEffect(() => {
    const getMemberData = async () => {
      try {
        await axios
          .get(`${apiUrl}/member/${params.id}`, {
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
              setMemberInfo((prev) => ({
                ...prev,
                full_name: data.full_name,
                email: data.email,
                phone_number: data.phone_number,
                whatsapp_number: data.whatsapp_number,
                address_1: data.address_1,
                address_2: data.address_2,
              }))
            }

            if (data?.join_location_store) {
              setSelectedStore((prev) => ({
                ...prev,
                value: data.join_location_store.id,
                label: data.join_location_store.store_name,
              }))

              setMemberInfo((prev) => ({
                ...prev,
                join_location: data.join_location,
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

    getMemberData()
    getStore()
  }, [])

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

    if (e.target.name === 'whatsapp_number' && !newValue.startsWith('+62')) {
      newValue = '+62' + newValue
    } else if (e.target.name === 'phone_number' && !newValue.startsWith('08')) {
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

  const handleUpdateMember = async () => {
    setIsLoading(true)

    await axios
      .post(`${apiUrl}/member/${params.id}`, memberInfo, {
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
            text: 'Success Update Customers Data',
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
    <section id='update-costumer'>
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
                    value={{
                      value: selectedStore?.value ?? null,
                      label: selectedStore?.label ?? '',
                    }}
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
                    value={memberInfo.full_name}
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
                    value={memberInfo.email}
                    onChange={(e) => memberInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className='input-member mb-5'>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    name='phone_number'
                    type='number'
                    value={memberInfo.phone_number}
                    onChange={(e) => memberInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group>
                  <Form.Label>Whatsapp Number</Form.Label>

                  <Form.Control
                    name='whatsapp_number'
                    type='text'
                    value={memberInfo.whatsapp_number}
                    onChange={(e) => memberInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className='alamat-member mb-5'>
              <Col>
                <Form.Group>
                  <Form.Label>Address 1</Form.Label>
                  <Form.Control
                    name='address_1'
                    as='textarea'
                    className='field-alamat w-100'
                    value={memberInfo.address_1}
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
                    value={memberInfo.address_2}
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

            <Button variant='dark-primary' disabled={isLoading} onClick={handleUpdateMember}>
              {isLoading ? 'Saving..' : 'Save'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {UpdateCostumerHO}
