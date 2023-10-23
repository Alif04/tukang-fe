import React, {useState, useEffect, FC} from 'react'

import './NewSales.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, FormGroup, Table, Button} from 'react-bootstrap'

interface StoreItem {
  value: string
  label: string
  address: string
  city_id: BigInteger
  zip_code: string
}

interface Bank {
  value: any
  label: string
}

interface Brand {
  value: any
  label: string
}

interface Sales {
  id: any
  store_id: any
  bank_id: any
  full_name: string
  account_name: string
  // bank_branch: string
  // nik: string
  phone_number: any
  account_number: any
  brand: Brand[]
}

const NewSalesHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const animatedComponents = makeAnimated()

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

    const getBank = async () => {
      try {
        const response = await axios.get(`${apiUrl}/bank`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempBank = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.bank_name,
          }))

          setBank(tempBank)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const getServiceType = async () => {
      try {
        const response = await axios.get(`${apiUrl}/service-type`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempServiceType = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.service_type,
          }))

          setBrands(tempServiceType)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getStore()
    getBank()
    getServiceType()
  }, [])

  // Store
  const [store, setStore] = useState<StoreItem[]>([])
  const [storeId, setStoreId] = useState<string>('')
  const [storeName, setStoreName] = useState<string>('')

  // Sales
  const [salesInfo, setSalesInfo] = useState<Sales>({
    id: null,
    store_id: null,
    bank_id: null,
    full_name: '',
    account_name: '',
    // nik: '',
    phone_number: '',
    // bank_branch: '',
    account_number: '',
    brand: [],
  })

  const [salesId, setSalesId] = useState<any>()
  const [salesName, setSalesName] = useState<string>('')
  const [salesPhoneNumber, setSalesPhoneNumber] = useState<any>()

  const [bank, setBank] = useState<Bank[]>([])
  const [bankId, setBankId] = useState<string>('')
  const [bankName, setBankName] = useState<string>('')
  const [accountNumber, setAccountNumber] = useState<any>()
  const [accountName, setAccountName] = useState<string>('')

  const [brandsId, setBrandsId] = useState<any>([])
  const [brands, setBrands] = useState<Brand[]>([])

  // Change Select Store
  const handleChangeSelectStore = (element: any) => {
    const updatedStoreId = element.value
    const updatedStoreName = element.label

    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      store_id: updatedStoreId,
    }))

    setStoreId(updatedStoreId)
    setStoreName(updatedStoreName)
  }

  // Change Select Sales Id
  const handleChangeSalesId = (element: any) => {
    const newSalesId = element.target.value

    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      id: newSalesId,
    }))

    setSalesId(newSalesId)
  }

  // Change Select Bank
  const handleChangeSelectBank = (element: any) => {
    const newBankId = element.value
    const newBankName = element.label

    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      bank_id: newBankId,
    }))

    setBankId(newBankId)
    setBankName(newBankName)
  }

  // Change Input Sales Name
  const handleChangeSalesName = (element: any) => {
    const newSalesName = element.target.value

    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      full_name: newSalesName,
    }))

    setSalesName(newSalesName)
  }

  // Change Input Account Number
  const handleChangeAccountNumber = (element: any) => {
    const newAccountNumber = element.target.value

    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      account_number: newAccountNumber,
    }))

    setAccountNumber(newAccountNumber)
  }

  // Change Input Account Name
  const handleChangeAccountName = (element: any) => {
    const newAccountName = element.target.value

    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      account_name: newAccountName,
    }))

    setAccountName(newAccountName)
  }

  // Change Input WA / Phone Number
  const handleChangeSalesPhoneNumber = (element: any) => {
    const newSalesPhoneNumber = element.target.value

    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      phone_number: newSalesPhoneNumber,
    }))

    setSalesPhoneNumber(newSalesPhoneNumber)
  }

  // Change Select Brand
  const handleChangeBrandsId = (element: any) => {
    const newBrandsId = element.map((option: any) => option.value)

    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      brand: newBrandsId,
    }))

    setBrandsId(newBrandsId)
  }

  // Sales Validation
  const SalesValidation = () => {
    let valid = true

    if (!storeId) {
      Swal.fire({
        title: 'Error',
        text: 'Please select Store form',
        icon: 'error',
      })
      valid = false
    } else if (!salesId) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Sales Id form',
        icon: 'error',
      })
      valid = false
    } else if (!salesName) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Name Sales Consultant form',
        icon: 'error',
      })
      valid = false
    } else if (!salesPhoneNumber) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill WA / Phone Number form',
        icon: 'error',
      })
      valid = false
    } else if (!brandsId) {
      Swal.fire({
        title: 'Error',
        text: 'Please select Brands form',
        icon: 'error',
      })
      valid = false
    } else if (!bankName) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nama Bank form',
        icon: 'error',
      })
      valid = false
    } else if (!accountNumber) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nomor Akun Bank form',
        icon: 'error',
      })
      valid = false
    } else if (!accountName) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nama Pemilik Akun form',
        icon: 'error',
      })
      valid = false
    }

    return valid
  }

  // Handle Submit New Sales
  const handleSubmitNewSales = async () => {
    if (SalesValidation()) {
      const response = await axios
        .post(`${apiUrl}/sales/create`, salesInfo, {
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
              text: 'Success Create Sales',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            })
          } else {
            Swal.fire({
              title: 'Error',
              text: response.data.message,
              icon: 'error',
            })
          }

          navigate('/home')
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
  }

  const handleCancelCreateSales = () => {
    navigate('/home')
  }

  return (
    <section id='new-sales'>
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

            <Row>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Sales ID</Form.Label>
                  <Form.Control
                    type='number'
                    value={salesId}
                    onChange={(element) => handleChangeSalesId(element)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Nama Bank</Form.Label>

                  <Select
                    classNamePrefix='select'
                    placeholder='Pilih Nama Bank'
                    isSearchable={true}
                    options={bank}
                    onChange={(element) => handleChangeSelectBank(element)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Brands</Form.Label>

                  <Select
                    placeholder='Pilih Brands'
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={brands}
                    onChange={(element) => handleChangeBrandsId(element)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className='input-order'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Nama Sales Consultant</Form.Label>
                  <Form.Control
                    type='text'
                    value={salesName}
                    onChange={(element) => handleChangeSalesName(element)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Nomor Akun Bank</Form.Label>
                  <Form.Control
                    type='number'
                    value={accountNumber}
                    onChange={(element) => handleChangeAccountNumber(element)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className='mb-5'>
                  <Form.Label>WA / Phone Number</Form.Label>
                  <Form.Control
                    type='number'
                    value={salesPhoneNumber}
                    onChange={(element) => handleChangeSalesPhoneNumber(element)}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className='mb-5'>
                  <Form.Label>Nama Pemilik Akun</Form.Label>
                  <Form.Control
                    type='text'
                    value={accountName}
                    onChange={(element) => handleChangeAccountName(element)}
                  />
                </Form.Group>
              </Col>

              <Col></Col>
            </Row>
          </div>

          <div className='d-flex justify-content-center mt-5'>
            <Button variant='dark-danger' type='submit' onClick={handleCancelCreateSales}>
              Cancel
            </Button>

            <Button variant='dark-primary' type='submit' onClick={handleSubmitNewSales}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewSalesHO}
