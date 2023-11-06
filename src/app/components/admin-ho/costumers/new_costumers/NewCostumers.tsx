import React, {FC, useState, useEffect, ChangeEvent} from 'react'

import './NewCostumers.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, InputGroup, Table, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface StoreItem {
  value: string
  label: string
  address: string
  city_id: BigInteger
  zip_code: string
}

interface Member {
  store_id: any
  full_name: string
  email: string
  phone_number: any
  whatsapp_number: any
  address_1: any
}

const NewCostumerHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  // Fetch API Data
  useEffect(() => {
    const getStore = async () => {
      try {
        const response = await axios.get(`${apiUrl}/stores`, {
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
            address: item.address,
            city_id: item.city_id,
            zip_code: item.zip_code,
          }))

          setStore(tempStore)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getStore()
  }, [])

  // Store
  const [store, setStore] = useState<StoreItem[]>([])
  const [storeId, setStoreId] = useState<string>('')
  const [storeName, setStoreName] = useState<string>('')

  // Member
  const [memberInfo, setMemberInfo] = useState<Member>({
    store_id: null,
    full_name: '',
    email: '',
    phone_number: '',
    whatsapp_number: '',
    address_1: '',
  })

  const [memberId, setMemberId] = useState<any>()
  const [memberName, setMemberName] = useState<string>('')
  const [memberPhoneNumber, setMemberPhoneNumber] = useState<any>()
  const [memberEmail, setMemberEmail] = useState<any>()
  const [memberAddress, setMemberAddress] = useState<any>()

  const [isWhatsapp, setIsWhatsapp] = useState<boolean>(false)

  // Select Store
  const handleChangeSelectStore = (element: any) => {
    const updatedStoreId = element.value
    const updatedStoreName = element.label

    setMemberInfo((prevMemberInfo) => ({
      ...prevMemberInfo,
      store_id: updatedStoreId,
    }))

    setStoreId(updatedStoreId)
    setStoreName(updatedStoreName)
  }

  // Change Select Member Id
  const handleChangeMemberId = (element: any) => {
    const newMemberId = element.target.value

    setMemberInfo((prevMemberInfo) => ({
      ...prevMemberInfo,
      id: newMemberId,
    }))

    setMemberId(newMemberId)
  }

  // Change Select Member Name
  const handleChangeMemberName = (element: any) => {
    const newMemberName = element.target.value

    setMemberInfo((prevMemberInfo) => ({
      ...prevMemberInfo,
      full_name: newMemberName,
    }))

    setMemberName(newMemberName)
  }

  // Change Select Member Email Address
  const handleChangeMemberEmailAddress = (element: any) => {
    const newMemberEmail = element.target.value

    setMemberInfo((prevMemberInfo) => ({
      ...prevMemberInfo,
      email: newMemberEmail,
    }))

    setMemberEmail(newMemberEmail)
  }

  // Change Select Member Phone Number
  const handleChangeRadio = (element: ChangeEvent<HTMLInputElement>) => {
    setIsWhatsapp(!isWhatsapp)
  }

  const handleChangeMemberPhoneNumber = (element: ChangeEvent<HTMLInputElement>) => {
    const newMemberPhoneNumber = element.target.value

    setMemberPhoneNumber(newMemberPhoneNumber)
  }

  useEffect(() => {
    if (isWhatsapp) {
      setMemberInfo((prevMemberInfo) => ({
        ...prevMemberInfo,
        whatsapp_number: '',
        phone_number: memberPhoneNumber,
      }))
    } else {
      setMemberInfo((prevMemberInfo) => ({
        ...prevMemberInfo,
        whatsapp_number: memberPhoneNumber,
        phone_number: memberPhoneNumber,
      }))
    }
  }, [memberPhoneNumber, isWhatsapp])

  // Change Select Member Address
  const handleChangeMemberAddress = (element: any) => {
    const newMemberAddress = element.target.value

    setMemberInfo((prevMemberInfo) => ({
      ...prevMemberInfo,
      address_1: newMemberAddress,
    }))

    setMemberAddress(newMemberAddress)
  }

  const handleSubmitNewMember = async () => {
    const response = await axios
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
            navigate(`/costumers/view-costumer`)
          })
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })
        }
      })
      .catch((error) => {
        console.error(error)
        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
        })
      })
  }

  const handleCancel = () => {
    navigate('/costumers/view-costumer')
  }

  return (
    <section id='new-costumer'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={3} lg={3} xl={3} xxl={3} className='mb-3'>
                <Form.Group as={Row}>
                  <Form.Label column sm='4'>
                    Nama Toko
                  </Form.Label>

                  <Col sm='8'>
                    <Select
                      name='store_id'
                      className='form-control p-0'
                      classNamePrefix='select'
                      placeholder='Pilih Toko'
                      isSearchable={true}
                      options={store}
                      onChange={(element) => handleChangeSelectStore(element)}
                    />
                  </Col>
                </Form.Group>
              </Col>

              <Col xs={12} md={9} lg={9} xl={9} xxl={9}></Col>
            </Row>

            <div className='form-new-costumer'>
              <Row className='input-order'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Costumer ID</Form.Label>
                    <Form.Control
                      type='number'
                      value={memberId}
                      onChange={(element) => handleChangeMemberId(element)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Costumer Name</Form.Label>
                    <Form.Control
                      type='text'
                      value={memberName}
                      onChange={(element) => handleChangeMemberName(element)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className='input-order'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <div className='d-flex justify-content-between'>
                      <Form.Label>WA / Phone Number</Form.Label>

                      <div className='form-check-request'>
                        <Form.Check
                          inline
                          label='Bukan Whatsapp'
                          name='group1'
                          value='1'
                          type='checkbox'
                          onChange={handleChangeRadio}
                        />
                      </div>
                    </div>

                    <InputGroup className='mb-5'>
                      <InputGroup.Text>+ 62</InputGroup.Text>
                      <Form.Control
                        type='number'
                        value={memberPhoneNumber}
                        onChange={handleChangeMemberPhoneNumber}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type='email'
                      value={memberEmail}
                      onChange={(element) => handleChangeMemberEmailAddress(element)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className='alamat-order'>
                <Col>
                  <Form.Group className='mb-5'>
                    <Form.Label>Alamat</Form.Label>
                    <Form.Control
                      as='textarea'
                      className='field-alamat'
                      value={memberAddress}
                      onChange={(element) => handleChangeMemberAddress(element)}
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

            <Button variant='dark-primary' onClick={handleSubmitNewMember}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewCostumerHO}
