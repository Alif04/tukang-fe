import React, {useState, useEffect, FC} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './UpdateSales.css'

import axios from 'axios'
import Select, {MultiValue, SingleValue} from 'react-select'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import {Row, Col, Form, Table, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'

interface StoreSelect {
  value: number | null
  label: string
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
  index: string
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

const UpdateSalesOld: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const animatedComponents = makeAnimated()

  // Store
  const [store, setStore] = useState<StoreSelect[]>([])
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreSelect>>({
    value: null,
    label: '',
  })

  // Sales
  const [salesId, setSalesId] = useState<any>()
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

  // Bank
  const [bank, setBank] = useState<BankSelect[]>([])
  const [selectedBank, setSelectedBank] = useState<SingleValue<BankSelect>>({
    value: null,
    label: '',
  })

  // Brand
  const [brands, setBrands] = useState<BrandSelect[]>([])
  const [selectedBrands, setSelectedBrands] = useState<BrandSelect[]>([])

  // Category
  const [categories, setCategories] = useState<CategorySelect[]>([])
  const [categoryForm, setCategoryForm] = useState<CategorySelect[]>([
    {
      index: Date.now().toString(),
      value: null,
      label: '',
      commission: 0,
    },
  ])

  // Fetch API Data
  useEffect(() => {
    const getSalesData = async () => {
      try {
        await axios
          .get(`${apiUrl}/sales/${params.id}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              // 'Access-Control-Allow-Origin': '*',
             // 'ngrok-skip-browser-warning':  'true',
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
              const salesBrands = data.sales_brands.map((item: any, index: number) => ({
                index: (Date.now() + index).toString(),
                value: item.brands.id,
                label: item.brands.name,
              }))

              const salesCategory = data.sales_categories.map((item: any) => ({
                value: item.categories.id,
                label: item.categories.category_name,
                commission: item.commission,
              }))

              setSalesInfo((prev) => ({
                ...prev,
                full_name: data.full_name,
                account_name: data.account_name,
                phone_number: data?.phone_number,
                account_number: data?.account_number,
                sales_brands: salesBrands,
                sales_categories: salesCategory,
              }))

              setSelectedBrands(salesBrands)
              setCategoryForm(salesCategory)
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
            // 'Access-Control-Allow-Origin': '*',
           // 'ngrok-skip-browser-warning':  'true',
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
            // 'Access-Control-Allow-Origin': '*',
           // 'ngrok-skip-browser-warning':  'true',
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
            // 'Access-Control-Allow-Origin': '*',
           // 'ngrok-skip-browser-warning':  'true',
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
            // 'Access-Control-Allow-Origin': '*',
           // 'ngrok-skip-browser-warning':  'true',
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

    getSalesData()
    getStore()
    getBank()
    getBrands()
    getCategories()
  }, [])

  // Sales Form
  const salesInfoFormHandler = (e: any) => {
    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      [e.target.name]: e.target.value,
    }))
  }

  // Change Select Service Area
  const handleChangeBrands = (element: any) => {
    const updatedBrands = element.map((option: any) => ({
      value: option.value,
      label: option.label,
    }))

    const updatedBrandsId = element.map((option: any) => ({
      brand_id: option.value,
    }))

    setSelectedBrands(updatedBrands)

    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      sales_brands: updatedBrandsId,
    }))
  }

  // Add Sales Category
  const addSalesCategory = () => {
    const newSalesCategory = {
      index: Date.now().toString(),
      value: null,
      label: '',
      commission: 0,
    }

    setCategoryForm((prevCategories) => [...prevCategories, newSalesCategory])
  }

  const handleRemoveSalesCategory = (index: any) => {
    setCategoryForm((prevCategories) => {
      const updatedCategories = [...prevCategories]
      const typeIndex = updatedCategories.findIndex((item) => item.index === index)

      if (typeIndex !== -1) {
        updatedCategories.splice(typeIndex, 1)
      }

      return updatedCategories
    })
  }

  // Commission Handler
  const categoryFormHandler = (e: any, index: number) => {
    setCategoryForm((prevValues) => {
      const updatedValues = [...prevValues]

      updatedValues[index] = {
        ...updatedValues[index],
        [e.target.name]: e.target.value,
      }
      return updatedValues
    })
  }

  // Sales Validation
  const SalesValidation = () => {
    let valid = true

    if (!salesInfo.store_id) {
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
    } else if (!salesInfo.sales_brands) {
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
  const handleUpdateSales = async () => {
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
      .post(`${apiUrl}/sales/${params.id}`, form, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        //  // 'Access-Control-Allow-Origin': '*',
        // // 'ngrok-skip-browser-warning':  'true',
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
    navigate('/sales/view-sales')
  }

  return (
    <section id='update-sales'>
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
                      value={{
                        value: selectedStore?.value ?? null,
                        label: selectedStore?.label ?? '',
                      }}
                      onChange={(newValue) => setSelectedStore(newValue)}
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

                  <Select
                    placeholder='Pilih Brands'
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={brands}
                    value={selectedBrands}
                    onChange={(element) => handleChangeBrands(element)}
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
            </Row>

            <Row>
              <Col>
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

              <Col>
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
                {categoryForm.map((element, index) => (
                  <tr key={`${element.index}-sales_categories`}>
                    <td>
                      <Select
                        id={`sales-category-${index}`}
                        name={`category_id`}
                        className='form-control p-0 form-item-name'
                        classNamePrefix='select'
                        placeholder='Pilih/Ketik Sales Category'
                        isSearchable={true}
                        options={categories}
                        value={{
                          value: element.value,
                          label: element.label,
                        }}
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
                        value={element.commission}
                        onChange={(e) => {
                          categoryFormHandler(e, index)
                        }}
                      />
                    </td>

                    <td>
                      <Button
                        variant='danger'
                        onClick={() => handleRemoveSalesCategory(element.index)}
                      >
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
                handleUpdateSales()
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

export {UpdateSalesOld}
