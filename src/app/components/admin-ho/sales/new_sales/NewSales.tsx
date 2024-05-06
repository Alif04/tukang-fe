import React, {useState, useEffect, FC} from 'react'
import {useNavigate} from 'react-router-dom'

import './NewSales.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import {Table, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
import type {ColumnsType} from 'antd/es/table'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import {Row, Col, Form, InputGroup, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faTrash, faSearch} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

interface BankSelect {
  value: number | null
  label: string
}

interface CategorySelect {
  value: number | null
  label: string
}

interface StoreItem {
  value: number | null
  label: string
}

interface Sales {
  store_id: number | null
  bank_id: number | null
  full_name: string
  username: string
  account_name: string
  phone_number: string
  account_number: string
  sales_brand: string
  sales_categories: CategorySelect[]
  default_password: string
}

const NewSales: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const animatedComponents = makeAnimated()

  const userRole = localStorage.getItem('userRole')
  const staffStoreId = localStorage.getItem('storeId') as any
  const staffStoreName = localStorage.getItem('storeName') as string

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  // List Store
  const [store, setStore] = useState<StoreItem[]>([])
  const storeOptions = [{value: null, label: 'All Store'}, ...store]
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreItem>>({
    value: null,
    label: 'All Store',
  })

  // List Sales
  const [salesData, setSalesData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  // Sales
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
    default_password: '',
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

        if (response.status === 200) {
          const {data} = response
          setSalesId(data.data.code)
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

    getStore()
    getSalesId()
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

  // Fetch Sales List
  const fetchSalesList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/sales?order_by=desc&page=${page}&take=${pageSize}${storeId}${queryparams}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setCurrentPage(response.data.page)
      setTotalData(response.data.total)
      setLoadData(false)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewSales = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchSalesList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchVendorList')
        return []
      }

      const salesData = apiData.map((item: any, index: number) => {
        let data

        const salesCategory = item.sales_categories
          .map((sales_categories: any) => sales_categories.categories.category_name)
          .join(', ')

        data = {
          no: index + 1,
          sales_id: item?.id ?? '',
          store_name: item?.store?.store_name ?? '',
          full_name: item?.full_name ?? '',
          // nik: item?.nik ?? '-',
          sales_brand: item?.sales_brand ?? '-',
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

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewSales(page, pageSize, queryparams)
    setSalesData(data)
  }

  useEffect(() => {
    fetchData(1, 10, '')
  }, [])

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

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
      store_id:
        userRole === 'Admin HO' ? selectedStore?.value ?? null : Number.parseInt(staffStoreId),
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

    const updatedCategoriesId = element.map((option: any) => ({
      category_id: option.value,
    }))

    setSalesInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      sales_categories: updatedCategoriesId,
    }))
  }

  // Filter Search Handler
  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  // Data Type List Sales

  interface DataType {
    no: number
    sales_id: number
    store_name: string
    full_name: string
    // nik: number
    sales_brand: string
    sales_category: string
    is_active: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
      width: 70,
      className: 'col_order_id',
      sorter: (a, b) => a.no - b.no,
      render: (text: any, record: any, index: number) => {
        return (currentPage - 1) * pageSize + index + 1
      },
    },
    {
      title: 'Sales ID',
      dataIndex: 'sales_id',
      key: 'sales_id',
      align: 'center',
      width: 70,
      className: 'col_order_id',
      sorter: (a, b) => a.sales_id - b.sales_id,
    },
    {
      title: 'Assign From Store',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Nama Sales',
      dataIndex: 'full_name',
      key: 'full_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.full_name.includes(String(value)),
      sorter: (a, b) => a.full_name.length - b.full_name.length,
    },
    // {
    //   title: 'NIK',
    //   dataIndex: 'nik',
    //   key: 'nik',
    //   align: 'left',
    //   width: 120,
    //   sorter: (a, b) => a.nik - b.nik,
    // },
    {
      title: 'Brands',
      dataIndex: 'sales_brand',
      key: 'sales_brand',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.sales_brand.includes(String(value)),
      sorter: (a, b) => a.sales_brand.length - b.sales_brand.length,
    },
    {
      title: 'Category',
      dataIndex: 'sales_category',
      key: 'sales_category',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.sales_category.includes(String(value)),
      sorter: (a, b) => a.sales_category.length - b.sales_category.length,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'left',
      width: 110,
      onFilter: (value, record) => record.is_active.includes(String(value)),
      sorter: (a, b) => a.is_active.length - b.is_active.length,
      filters: [
        {text: 'ACTIVE', value: 'ACTIVE'},
        {text: 'INACTIVE', value: 'INACTIVE'},
      ],
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
            title: `Apakah anda yakin akan mengubah status Sales ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            confirmButtonColor: 'gray',
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

    if (salesInfo.full_name === '') {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Name Sales Consultant form',
        icon: 'error',
      })
      valid = false
    } else if (salesInfo.phone_number === '') {
      Swal.fire({
        title: 'Error',
        text: 'Please fill WA / Phone Number form',
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
    } else if (salesInfo.account_number === '') {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nomor Akun Bank form',
        icon: 'error',
      })
      valid = false
    } else if (salesInfo.account_name === '') {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nama Pemilik Akun form',
        icon: 'error',
      })
      valid = false
    } else if (salesInfo.username === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Jika anda mengosongkan kolom username, maka username akan dibuat otomatis oleh sistem dan diambil dari nama lengkap dengan format semua huruf kecil dan jika ada spasi maka diganti dengan underscore ( _ )',
        icon: 'warning',
        showConfirmButton: true,
        timer: 1500,
      })
      valid = true
    }

    return valid
  }

  // Handle Submit New Sales
  const handleSubmitNewSales = async () => {
    if (!SalesValidation()) {
      setIsLoading(true)
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

          setIsLoading(false)
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })

          setIsLoading(false)
        }

        window.location.reload()
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

  const handleCancelCreateSales = () => {
    navigate('/home')
  }

  const handleSubmitFilter = async () => {
    setLoadingButton(true)

    let queryparams = ``

    if (dateFrom) {
      queryparams += `&date_from=${dateFrom}`
    }

    if (dateTo) {
      queryparams += `&date_to=${dateTo}`
    }

    if (searchFilter) {
      queryparams += `&search=${searchFilter}`
    }

    const data = await ViewSales(1, 10, queryparams)
    setSalesData(data)

    setLoadingButton(false)
  }

  return (
    <>
      <section id='new-sales'>
        <div className='card mb-5'>
          <div className='card-body'>
            <div className='form-wrapper'>
              <Row className='form-header'>
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
                      onChange={(e) => salesInfoFormHandler(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Nama Sales Consultant</Form.Label>
                    <Form.Control
                      name='full_name'
                      type='text'
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
                      onChange={(element) => handleChangeCategories(element)}
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
                      onChange={(e) => salesInfoFormHandler(e)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Nama Pemilik Akun Bank</Form.Label>
                    <Form.Control
                      name='account_name'
                      type='text'
                      onChange={(e) => salesInfoFormHandler(e)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Default Password</Form.Label>
                    <Form.Control
                      name='default_password'
                      type='text'
                      onChange={(e) => salesInfoFormHandler(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Username</Form.Label>

                    <Form.Control
                      name='username'
                      type='text'
                      onChange={(e) => salesInfoFormHandler(e)}
                    />

                    <Form.Text className='fs-8 fs-l text-dark-danger'>
                      *Jika username kosong, maka sistem akan menghasilkan username secara otomatis
                      dari nama lengkap, dengan format semua huruf kecil dan spasi diganti menjadi
                      underscore ( _ ).
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>

                <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
              </Row>
            </div>

            <div className='d-flex justify-content-center mt-5'>
              <Button variant='dark-danger' type='submit' onClick={handleCancelCreateSales}>
                Cancel
              </Button>

              <Button
                variant='dark-primary'
                type='submit'
                disabled={isLoading}
                onClick={() => {
                  handleSubmitNewSales()
                }}
              >
                {isLoading ? 'Saving..' : 'Save'}
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
                {userRole === 'Admin HO' ? (
                  <div className='d-flex'>
                    <Select
                      name='store_id'
                      className='form-control p-0'
                      classNamePrefix='select'
                      placeholder='Pilih Toko'
                      isSearchable={true}
                      isClearable={true}
                      options={storeOptions}
                      onChange={(newValue) => setSelectedStore(newValue)}
                    />

                    <Button
                      className='btn-dark-primary button-submit'
                      disabled={loadingButton}
                      onClick={handleSubmitFilter}
                    >
                      {loadingButton ? 'Filtering..' : 'Submit'}
                    </Button>
                  </div>
                ) : (
                  <Button
                    className='btn-dark-primary button-submit'
                    disabled={loadingButton}
                    onClick={handleSubmitFilter}
                  >
                    {loadingButton ? 'Filtering..' : 'Submit'}
                  </Button>
                )}
              </Col>
            </Row>

            <Spin
              tip='Loading...'
              spinning={loadData}
              size='large'
              indicator={<LoadingOutlined style={{fontSize: 24}} spin rev />}
            >
              <Table
                className='table-striped-rows'
                bordered
                columns={columns}
                dataSource={salesData}
                rowKey={(record) => record.sales_id}
                pagination={false}
              />
            </Spin>

            <Pagination
              className='mt-5'
              style={{textAlign: 'right', position: 'relative'}}
              current={currentPage}
              total={totalData}
              showSizeChanger
              pageSizeOptions={[5, 10, 20, 50, 100, 250, 500]}
              itemRender={itemRender}
              onShowSizeChange={(current, size) => setPageSize(size)}
              onChange={(page, pageSize) => {
                fetchData(page, pageSize, '')
              }}
              showTotal={(total, range) => (
                <span style={{left: 0, position: 'absolute'}}>
                  Showing {range[0]} - {range[1]} of {total} Total Sales
                </span>
              )}
            />
          </div>
        </div>
      </section>
    </>
  )
}

export {NewSales}
