import React, {useState, useEffect, FC} from 'react'
import {useNavigate} from 'react-router-dom'

import './NewSales.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import {Row, Col, Form, FormGroup, Table, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'

interface StoreItemSelect {
  value: number | null
  label: string
  address: string
  city_id: number | null
  zip_code: string
}

interface BankSelect {
  value: number | null
  label: string
}

interface BrandSelect {
  value: number | null
  label: string
}

interface CategorySelect {
  value: number | null
  label: string
  commission: number
}

interface Sales {
  store_id: any
  bank_id: any
  full_name: string
  account_name: string
  phone_number: any
  account_number: any
  sales_brands: BrandSelect[]
  sales_categories: CategorySelect[]
}

const NewSales: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const animatedComponents = makeAnimated()

  // Fetch API Data
  useEffect(() => {
    const getSalesId = async () => {
      try {
        const response = await axios.get(`${apiUrl}/sales/next-code`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        const data = response.data.code
        console.log(data)

        if (response.status === 200) {
          const {data} = response
          setSalesId(data.data.code)
        }
      } catch (err) {
        console.error(err)
      }
    }

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

    const getBrands = async () => {
      try {
        const response = await axios.get(`${apiUrl}/brands`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempBrands = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.name,
          }))

          setBrands(tempBrands)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const getCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/categories`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempCategories = response.data.data.map((item: any) => ({
            value: item.id,
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

    getSalesId()
    getStore()
    getBank()
    getBrands()
    getCategories()
  }, [])

  // Store
  const [store, setStore] = useState<StoreItemSelect[]>([])
  const [storeId, setStoreId] = useState<string>('')
  const [storeName, setStoreName] = useState<string>('')

  // Sales
  const [salesInfo, setSalesInfo] = useState<Sales>({
    store_id: null,
    bank_id: null,
    full_name: '',
    account_name: '',
    phone_number: '',
    account_number: '',
    sales_brands: [],
    sales_categories: [],
  })

  const [salesId, setSalesId] = useState<any>()
  const [salesName, setSalesName] = useState<string>('')
  const [salesPhoneNumber, setSalesPhoneNumber] = useState<any>()

  const [bank, setBank] = useState<BankSelect[]>([])
  const [bankId, setBankId] = useState<string>('')
  const [bankName, setBankName] = useState<string>('')
  const [accountNumber, setAccountNumber] = useState<any>()
  const [accountName, setAccountName] = useState<string>('')

  const [brandsId, setBrandsId] = useState<any>([])
  const [brands, setBrands] = useState<BrandSelect[]>([])

  const [categoryId, setCategoryId] = useState<any>([])
  const [categories, setCategories] = useState<CategorySelect[]>([])
  const [categoryForm, setCategoryForm] = useState<CategorySelect[]>([
    {
      value: null,
      label: '',
      commission: 0,
    },
  ])

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

    // setAccountName(newAccountName)
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
    const newBrandsId = element.map((option: any) => ({brand_id: option.value}))

    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      sales_brands: newBrandsId,
    }))

    setBrandsId(newBrandsId)
  }

  // Change Select Category
  const handleChangeCategoryId = (element: any) => {
    const newCategoryId = element.map((option: any) => ({category_id: option.value}))

    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      sales_categories: newCategoryId,
    }))

    setCategoryId(newCategoryId)
  }

  // Add Sales Category
  const addSalesCategory = () => {
    const newSalesCategory = {
      value: null,
      label: '',
      commission: 0,
    }

    setCategoryForm((prevCategories) => [...prevCategories, newSalesCategory])
  }

  const handleRemoveSalesCategory = (index: any) => {
    setCategoryForm((prevCategories) => {
      const updatedCategories = [...prevCategories]
      updatedCategories.splice(index, 1)
      return updatedCategories
    })
  }

  // Commission Handler
  const categoryFormHandler = (e: any, index: number) => {
    setCategoryForm((prevValues) => {
      const updatedValues = [...prevValues]
      console.log(updatedValues)

      updatedValues[index] = {
        ...updatedValues[index],
        [e.target.name]: e.target.value,
      }
      console.log(updatedValues)
      return updatedValues
    })

    console.log(categoryForm)
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
    } else if (!salesInfo.full_name) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Name Sales Consultant form',
        icon: 'error',
      })
      valid = false
    } else if (!salesInfo.phone_number) {
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
    } else if (!salesInfo.sales_categories) {
      Swal.fire({
        title: 'Error',
        text: 'Please select Brands form',
        icon: 'error',
      })
      valid = false
    } else if (!salesInfo.bank_id) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nama Bank form',
        icon: 'error',
      })
      valid = false
    } else if (!salesInfo.account_number) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nomor Akun Bank form',
        icon: 'error',
      })
      valid = false
    } else if (!salesInfo.account_name) {
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
    if (!SalesValidation()) {
      return false
    }

    const form = {
      ...salesInfo,
      sales_categories: categoryForm.map((value) => ({
        category_id: value.value,
        commission: value.commission,
      })),
    }

    await axios
      .post(`${apiUrl}/sales`, form, {
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
                    value={salesInfo.full_name}
                    onChange={(element) => handleChangeSalesName(element)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group className='mb-5'>
                  <Form.Label>Nomor Akun Bank</Form.Label>
                  <Form.Control
                    type='number'
                    value={salesInfo.account_number}
                    onChange={(element) => handleChangeAccountNumber(element)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className='mb-5'>
                  <Form.Label>WA / Phone Number</Form.Label>
                  <Form.Control
                    type='number'
                    value={salesInfo.phone_number}
                    onChange={(element) => handleChangeSalesPhoneNumber(element)}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className='mb-5'>
                  <Form.Label>Nama Pemilik Akun</Form.Label>
                  <Form.Control
                    type='text'
                    value={salesInfo.account_name}
                    onChange={(element) => handleChangeAccountName(element)}
                  />
                </Form.Group>
              </Col>

              <Col></Col>
            </Row>
          </div>

          <div className='sales-category'>
            <div className='d-flex justify-content-end align-items-center'>
              <button className='button-add' onClick={() => addSalesCategory()}>
                Tambah Sales Category
              </button>
            </div>

            <Table hover responsive='md'>
              <thead className='table-order-head'>
                <tr>
                  <th>Sales Category</th>
                  <th>Commission</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categoryForm.map((value, index) => (
                  <tr key={`${index}-sales_categories`}>
                    <td>
                      <Select
                        id={`sales-category-${index}`}
                        name={`category_id`}
                        className='form-control p-0 form-item-name'
                        classNamePrefix='select'
                        placeholder='Pilih/Ketik Sales Category'
                        isSearchable={true}
                        options={categories}
                        onChange={(newValue) => {
                          setCategoryForm((prevValues) => {
                            const updatedValues = [...prevValues]
                            updatedValues[index] = {
                              ...updatedValues[index],
                              value: newValue?.value ?? null,
                              label: newValue?.label ?? '',
                            }
                            return updatedValues
                          })
                        }}
                      />
                    </td>

                    <td>
                      <Form.Control
                        id={`sales-commission-${index}`}
                        name='commission'
                        value={`${categoryForm[index].commission}`}
                        onChange={(e) => {
                          categoryFormHandler(e, index)
                        }}
                      />
                    </td>

                    <td>
                      <Button variant='danger' onClick={() => handleRemoveSalesCategory(value)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className='d-flex justify-content-center mt-5'>
            <Button variant='dark-danger' type='submit' onClick={handleCancelCreateSales}>
              Cancel
            </Button>

            <Button
              variant='dark-primary'
              type='submit'
              onClick={() => {
                handleSubmitNewSales()
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewSales}
