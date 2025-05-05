import React, {useState, useEffect, FC} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './UpdateSales.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import {Card, Row, Col, Form, Button} from 'react-bootstrap'

interface StoreSelect {
  value: number | null
  label: string
}

interface BankSelect {
  value: number | null
  label: string
}

interface CategorySelect {
  category_id: string
  label: string
}

interface Sales {
  store_id: any
  bank_id: any
  full_name: string
  username: string
  account_name: string
  phone_number: string
  account_number: string
  sales_brand: string
  sales_categories: CategorySelect[]
  password: string
  is_active: number
}

const UpdateSales: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const animatedComponents = makeAnimated()
  const userRole = localStorage.getItem('userRole')
  const staffStoreId = localStorage.getItem('storeId') as any
  const staffStoreName = localStorage.getItem('storeName') as string
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // List Store
  const [store, setStore] = useState<StoreSelect[]>([])
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreSelect>>({
    value: null,
    label: '',
  })

  // List Sales
  const [salesId, setSalesId] = useState<any>()
  const [salesInfo, setSalesInfo] = useState<Sales>({
    store_id: null,
    bank_id: null,
    full_name: '',
    username: '',
    account_name: '',
    phone_number: '',
    account_number: '',
    sales_brand: '',
    sales_categories: [],
    password: '',
    is_active: 1,
  })

  // Bank
  const [bank, setBank] = useState<BankSelect[]>([])
  const [selectedBank, setSelectedBank] = useState<SingleValue<BankSelect>>({
    value: null,
    label: '',
  })

  // Category
  const [categories, setCategories] = useState<CategorySelect[]>([])
  const [selectedCategories, setSelectedCategories] = useState<CategorySelect[]>([])

  // Fetch API Data
  useEffect(() => {
    const getSalesData = async () => {
      try {
        await axios
          .get(`${apiUrl}/sales/${params.id}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          })
          .then((response) => {
            const data = response.data.data

            if (data?.id) {
              setSalesId(data.id)
            }

            if (data?.store_id) {
              setSelectedStore((prev) => ({
                ...prev,
                value: data.store.id,
                label: data.store.store_name,
              }))

              setSalesInfo((prev) => ({
                ...prev,
                store_id: data.store_id,
              }))
            }

            if (data?.bank_id) {
              setSalesInfo((prev) => ({
                ...prev,
                bank_id: data.bank_id,
              }))

              setSelectedBank((prev) => ({
                ...prev,
                value: data.bank.id,
                label: data.bank.bank_name,
              }))
            }

            if (data) {
              const salesCategory = data?.sales_categories.map((item: any) => ({
                category_id: item?.categories.id ?? null,
                label: item?.categories?.category_name ?? '',
              }))

              const uniqueCategories = Array.from(
                new Set(salesCategory.map((item: any) => item.category_id))
              ).map((category_id) => {
                return salesCategory.find((item: any) => item.category_id === category_id)
              })

              setSelectedCategories(uniqueCategories)
              setSalesInfo((prev) => ({
                ...prev,
                full_name: data?.full_name,
                username: data?.users?.username,
                account_name: data.account_name,
                phone_number: data?.phone_number,
                account_number: data?.account_number,
                sales_brand: data?.sales_brand,
                sales_categories: uniqueCategories,
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
        const response = await axios.get(`${apiUrl}/bank?take=0`, {
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

    const getCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/categories?take=0`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempCategories = response.data.data.map((item: any) => ({
            category_id: item.id,
            label: item.category_name,
          }))

          setCategories(tempCategories)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getSalesData()
    getStore()
    getBank()
    getCategories()
  }, [])

  // Store ID
  const storeId =
    userRole === 'Admin HO' && selectedStore && selectedStore.value
      ? `&store_id=${selectedStore.value}`
      : userRole === 'Store Staff' || userRole === 'Store CS'
      ? `&store_id=${staffStoreId}`
      : ''

  // Sales Form
  const salesInfoFormHandler = (e: any) => {
    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      [e.target.name]: e.target.value,
    }))
  }

  // Change Select Store
  useEffect(() => {
    setSalesInfo((prev) => ({
      ...prev,
      store_id: selectedStore?.value ?? null,
    }))
  }, [selectedStore])

  // Change Select Bank
  useEffect(() => {
    setSalesInfo((prev) => ({
      ...prev,
      bank_id: selectedBank?.value ?? null,
    }))
  }, [selectedBank])

  // Change Select Category
  const handleChangeCategories = (element: any) => {
    const updatedCategories = element.map((option: any) => ({
      value: option.value,
      label: option.label,
    }))

    setSelectedCategories(updatedCategories)

    const updatedCategoriesId = updatedCategories.map((option: any) => ({
      category_id: option.value,
    }))

    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      sales_categories: updatedCategoriesId,
    }))
  }

  // Handle Change Select Category
  const handleChangeCategory = (newValue: CategorySelect[]) => {
    if (newValue) {
      setSelectedCategories(newValue)
      setSalesInfo((prevSalesInfo) => ({
        ...prevSalesInfo,
        sales_categories: newValue,
      }))
    }
  }

  // Sales Validation
  const SalesValidation = () => {
    let valid = true

    if (salesInfo.full_name === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong isi formulir Nama Sales Consultant',
        icon: 'warning',
      })
      valid = false
    } else if (salesInfo.store_id === null) {
      Swal.fire({
        title: 'Warning',
        text: 'Please pilih formulir Nama Toko',
        icon: 'warning',
      })
      valid = false
    } else if (salesInfo.phone_number === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong isi formulir WA/Phone Number',
        icon: 'warning',
      })
      valid = false
    } else if (salesInfo.bank_id === null) {
      Swal.fire({
        title: 'Warning',
        text: 'Please pilih formulir Nama Bank',
        icon: 'warning',
      })
      valid = false
    } else if (salesInfo.account_number === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong isi formulir Nomor Akun Bank',
        icon: 'warning',
      })
      valid = false
    } else if (salesInfo.account_name === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong isi formulir Nama Pemilik Akun Bank',
        icon: 'warning',
      })
      valid = false
    } else if (salesInfo.sales_brand === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong isi formulir Brands',
        icon: 'warning',
      })
      valid = false
    } else if (salesInfo.sales_categories.length === 0) {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong pilih formulir Nama Category',
        icon: 'warning',
      })
      valid = false
    }

    return valid
  }

  // Desctructure Object if the value null or empty string
  const objectValueCheck = (data: Sales) => {
    let cleanedData: Partial<Sales> = {}

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        cleanedData[key as keyof Sales] = value
      }
    })

    return cleanedData
  }

  // Handle Submit New Sales
  const handleUpdateSales = async () => {
    if (!SalesValidation()) {
      setIsLoading(false)
      return false
    }

    setIsLoading(true)

    const salesData = objectValueCheck(salesInfo)

    await axios
      .post(`${apiUrl}/sales/${params.id}`, salesData, {
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
            text: 'Success Update Sales',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
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

        navigate('/sales/new-sales')
      })
      .catch((error) => {
        setIsLoading(false)
        console.error(error)
        Swal.fire({
          title: 'Terjadi Kesalahan Pada Server',
          text: 'Tolong untuk mencoba hubungi administrator',
          icon: 'error',
        })
      })
  }

  const handleCancelCreateSales = () => {
    navigate('/sales/new-sales')
  }

  return (
    <section id='update-sales'>
      <div className='form-wrapper'>
        <Card className='mb-3'>
          <Card.Header>
            <Card.Title>Profile</Card.Title>
          </Card.Header>

          <Card.Body>
            <Row>
              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Nama Toko
                  {userRole === 'Admin HO' ? (
                    <Select
                      name='store_id'
                      className='form-control p-0'
                      classNamePrefix='select'
                      placeholder='Pilih Toko'
                      isSearchable={true}
                      options={store}
                      onChange={(newValue) => setSelectedStore(newValue)}
                      value={{
                        value: selectedStore?.value ?? null,
                        label: selectedStore?.label ?? '',
                      }}
                    />
                  ) : (
                    <span className='fs-6 ms-2 pt-2 pb-2 fw-semibold bg-secondary'>
                      {staffStoreName}
                    </span>
                  )}
                </Form.Label>
              </Form.Group>
            </Row>

            <Row>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Sales ID</Form.Label>
                  <Form.Control readOnly type='number' value={salesId} />
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
                    value={{
                      value: selectedBank?.value ?? null,
                      label: selectedBank?.label ?? '',
                    }}
                    onChange={(newValue) => setSelectedBank(newValue)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Brands</Form.Label>
                  <Form.Control
                    name='sales_brand'
                    type='text'
                    value={salesInfo.sales_brand}
                    onChange={(e) => salesInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className='input-order'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Nama Sales Consultant</Form.Label>
                  <Form.Control
                    name='full_name'
                    type='text'
                    value={salesInfo.full_name}
                    onChange={(e) => salesInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Nomor Akun Bank</Form.Label>
                  <Form.Control
                    name='account_number'
                    type='number'
                    value={salesInfo.account_number}
                    onChange={(e) => salesInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Category</Form.Label>
                  <Select
                    placeholder='Pilih Category'
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={categories}
                    value={selectedCategories}
                    getOptionLabel={(option: CategorySelect) => option.label}
                    getOptionValue={(option: CategorySelect) => option.category_id}
                    onChange={(newValue) => handleChangeCategory(newValue as CategorySelect[])}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>WA / Phone Number</Form.Label>
                  <Form.Control
                    name='phone_number'
                    type='number'
                    value={salesInfo.phone_number}
                    onChange={(e) => salesInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Nama Pemilik Akun</Form.Label>
                  <Form.Control
                    name='account_name'
                    type='text'
                    value={salesInfo.account_name}
                    onChange={(e) => salesInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
            </Row>
          </Card.Body>
        </Card>

        <hr />

        <Card>
          <Card.Header>
            <Card.Title>Account</Card.Title>
          </Card.Header>

          <Card.Body>
            <Row>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group className='mb-5'>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    name='username'
                    type='text'
                    value={salesInfo.username}
                    onChange={(e) => salesInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group className='mb-5'>
                  <Form.Label>Reset Password</Form.Label>
                  <Form.Control
                    name='password'
                    type='text'
                    value={salesInfo.password}
                    onChange={(e) => salesInfoFormHandler(e)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>

      <div className='d-flex justify-content-center mt-5'>
        <Button variant='dark-danger' type='submit' onClick={handleCancelCreateSales}>
          Cancel
        </Button>

        <Button
          className='d-flex justify-content-center align-items-center'
          variant='dark-primary'
          type='submit'
          disabled={isLoading}
          onClick={() => {
            handleUpdateSales()
          }}
        >
          {isLoading ? 'Updating..' : 'Update'}
        </Button>
      </div>
    </section>
  )
}

export {UpdateSales}
