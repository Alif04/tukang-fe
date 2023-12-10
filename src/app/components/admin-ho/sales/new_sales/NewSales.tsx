import React, {useState, useEffect, FC} from 'react'
import {useNavigate} from 'react-router-dom'

import './NewSales.css'

import axios from 'axios'
import Select from 'react-select'
import {Table, Tag} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import {Row, Col, Form, InputGroup, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faPen,
  faTrash,
  faSearch,
  faPlus,
  faUserPlus,
  faFilter,
} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

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
}

interface Sales {
  store_id: number | null
  bank_id: number | null
  full_name: string
  account_name: string
  phone_number: string
  account_number: string
  sales_brands: string
  sales_categories: CategorySelect[]
}

const NewSales: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const animatedComponents = makeAnimated()

  // List Sales
  const [salesData, setSalesData] = useState<DataType[]>([])
  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [searchByStore, setSearchByStore] = useState<any>('')

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
    sales_brands: '',
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
    },
  ])

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
    getCategories()
  }, [])

  // Fetch Sales List
  const fetchSalesList = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/sales?date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&take=0`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewSales = async () => {
    try {
      const apiData = await fetchSalesList()

      if (!apiData) {
        console.error('No data received from fetchVendorList')
        return []
      }

      const salesData = apiData.map((item: any) => {
        let data

        const joinDate = new Date(item.join_date)

        const salesBrand = item.sales_brands
          .map((sales_brands: any) => sales_brands.brands.name)
          .join(', ')

        const salesCategory = item.sales_categories
          .map((sales_categories: any) => sales_categories.categories.category_name)
          .join(', ')

        data = {
          sales_id: item.id,
          store_name: item.store.store_name,
          full_name: item.full_name,
          nik: item?.nik ?? '-',
          sales_brand: salesBrand,
          sales_category: salesCategory,
          is_active: item.is_active === true ? 'ACTIVE' : 'NON ACTIVE',
        }

        return data
      })

      return salesData
    } catch (error) {
      console.error('Error getting sales list data:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await ViewSales()
      setSalesData(data)
    }

    fetchData()
  }, [dateFrom, dateTo, searchFilter])

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

  // Handle Change Brands
  const handleChangeBrands = (element: any) => {
    const newBrands = element.target.value

    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      sales_brands: newBrands,
    }))

    setBrandsId(newBrands)
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

  // Filter Search Handler
  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const handleChangeSelectStores = (element: any) => {
    const updatedStoreId = element.value
    setSearchByStore(updatedStoreId)
  }

  // Data Type List Sales

  interface DataType {
    sales_id: number
    store_name: string
    full_name: string
    nik: number
    sales_brand: string
    sales_category: string
    is_active: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Sales ID',
      dataIndex: 'sales_id',
      key: 'sales_id',
      align: 'center',
      width: 70,
      className: 'col_order_id',
    },
    {
      title: 'Assign From Store',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'left',
      width: 140,
    },
    {
      title: 'Nama Sales',
      dataIndex: 'full_name',
      key: 'full_name',
      align: 'left',
      width: 140,
    },
    {
      title: 'NIK',
      dataIndex: 'nik',
      key: 'nik',
      align: 'left',
      width: 120,
    },
    {
      title: 'Brand Sales',
      dataIndex: 'sales_brand',
      key: 'sales_brand',
      align: 'left',
      width: 120,
    },
    {
      title: 'Kategori Sales',
      dataIndex: 'sales_category',
      key: 'sales_category',
      align: 'left',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'left',
      width: 110,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 45,
      render: (record) => {
        const handleUpdateId = () => {
          const id = record.sales_id
          navigate(`/sales/update-sales/${id}`)
        }

        const handleDeleteId = () => {
          const id = record.sales_id

          Swal.fire({
            title: `Apakah anda yakin akan menghapus data Sales ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Cancel',
          })
            .then((willDelete) => {
              if (willDelete.value) {
                axios
                  .delete(`${apiUrl}/sales/${id}`, {
                    headers: {
                      Accept: 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                      'Access-Control-Allow-Origin': '*',
                      'ngrok-skip-browser-warning': 'true',
                    },
                  })
                  .then((response) => {
                    Swal.fire({
                      title: 'Success',
                      text: response.data.message,
                      icon: 'success',
                    }).then(() => {
                      window.location.reload()
                    })
                  })
                  .catch((error) => {
                    Swal.fire({
                      title: 'Error',
                      text: error.response.data.message,
                      icon: 'error',
                    })
                  })
              }
            })
            .catch((error) => {
              Swal.fire({
                title: 'Error',
                text: error.response.data.message,
                icon: 'error',
              })
            })
        }

        return (
          <div className='button-wrapper'>
            <a className='button-edit' onClick={handleUpdateId}>
              <FontAwesomeIcon icon={faPen} size='sm' />
            </a>

            <a className='button-delete' onClick={handleDeleteId}>
              <FontAwesomeIcon icon={faTrash} size='sm' />
            </a>
          </div>
        )
      },
    },
  ]

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

    await axios
      .post(`${apiUrl}/sales`, salesInfo, {
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

        window.location.reload()
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
    <>
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

                    <Form.Control type='text' onChange={(element) => handleChangeBrands(element)} />
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

                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Category</Form.Label>
                    <Select
                      placeholder='Pilih Category'
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      isMulti
                      options={categories}
                      onChange={(element) => handleChangeCategoryId(element)}
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

      <section id='view-sales'>
        <div className='card'>
          <div className='card-body table-view-order'>
            <Row className='table-head-wrapper'>
              <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
                <Form.Group as={Row}>
                  <Form.Label className='fs-3' column sm='4'>
                    <FontAwesomeIcon icon={faFilter} size='sm' className='me-1' />
                    Date :
                  </Form.Label>

                  <Col sm='8'>
                    <RangePicker
                      className='date-range ms-3'
                      onChange={(values) => {
                        if (values && values.length === 2) {
                          const dateFromFormatted = values[0]?.format('YYYY-MM-DD')
                          const dateToFormatted = values[1]?.format('YYYY-MM-DD')

                          setDateFrom(dateFromFormatted)
                          setDateTo(dateToFormatted)
                        } else {
                          setDateFrom('')
                          setDateTo('')
                        }
                      }}
                    />
                  </Col>
                </Form.Group>
              </Col>

              <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
                <div className='filter-search'>
                  <InputGroup>
                    <InputGroup.Text className='filter-ltr'>
                      <FontAwesomeIcon icon={faSearch} size='sm' />
                    </InputGroup.Text>

                    <Form.Control
                      placeholder='Search'
                      className='filter-ltr'
                      onChange={handleChangeSearchFilter}
                    />
                  </InputGroup>
                </div>
              </Col>

              <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
                {/* <Select
                name='store_id'
                className='form-control p-0'
                classNamePrefix='select'
                placeholder='Pilih Toko'
                isSearchable={true}
                options={store}
                onChange={(element) => handleChangeSelectStores(element)}
              /> */}
              </Col>
            </Row>

            <Table
              className='table-striped-rows'
              bordered
              columns={columns}
              dataSource={salesData}
              rowKey={(record) => record.sales_id}
              // scroll={{x: 1500}}
              pagination={{position: ['bottomRight']}}
            />
          </div>
        </div>
      </section>
    </>
  )
}

export {NewSales}
