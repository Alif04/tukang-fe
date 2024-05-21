import React, {useState, useEffect, FC} from 'react'
import {useNavigate} from 'react-router-dom'

import './NewEmployee.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import {Table, PaginationProps} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import Swal from 'sweetalert2'
import {Row, Col, Form, InputGroup, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faTrash, faSearch} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

interface PositionSelect {
  value: number | null
  label: string
}

interface StoreSelect {
  value: number | null
  label: string
}

interface Employee {
  store_id: number | null
  position_id: number | null
  full_name: string
  birth: string
  email: string
  nik: string
  phone_number: string
  default_password: string
}

interface DataType {
  no: number
  employee_id: number
  store_name: string
  position: string
  full_name: string
  birth: string
  email: string
  nik: string
  phone_number: string
}

const NewEmployee: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
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

  // List Position
  const [position, setPosition] = useState<PositionSelect[]>([])
  const [selectedPosition, setSelectedPosition] = useState<SingleValue<PositionSelect>>({
    value: null,
    label: '',
  })

  // List Employee
  const [employeeData, setEmployeeData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  // Employee
  const [employeeId, setEmployeeId] = useState<any>()
  const [employeeInfo, setEmployeeInfo] = useState<Employee>({
    store_id: null,
    position_id: null,
    full_name: '',
    birth: '',
    email: '',
    nik: '',
    phone_number: '',
    default_password: '',
  })

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

    const getEmployeeId = async () => {
      try {
        const response = await axios.get(`${apiUrl}/employee/next-code`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (response.status === 200) {
          const {data} = response
          setEmployeeId(data.data.code)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const getPosition = async () => {
      try {
        const response = await axios.get(`${apiUrl}/positions`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempPosition = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.position_name,
          }))

          setPosition(tempPosition)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getEmployeeId()
    getStore()
    getPosition()
  }, [])

  // Store ID
  const storeId =
    userRole === 'Admin HO' && selectedStore && selectedStore.value
      ? `&store_id=${selectedStore.value}`
      : `&store_id=${staffStoreId}`

  // Fetch Sales List
  const getEmployee = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get(
        `${apiUrl}/employees?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&page=${page}&take=${pageSize}${storeId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      setCurrentPage(response.data.data.page)
      setTotalData(response.data.takeTotal)

      return response.data.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewEmployee = async (page: number, pageSize: number) => {
    try {
      const apiData = await getEmployee(page, pageSize)

      if (!apiData) {
        console.error('No data received from getEmployee')
        return []
      }

      const employeeData = apiData.map((item: any, index: number) => {
        let data

        data = {
          no: index + 1,
          employee_id: item?.id ?? '',
          store_name: item?.store?.store_name ?? '',
          position: item?.store?.position ?? '',
          full_name: item?.full_name ?? '',
          birth: item?.birth ?? '',
          email: item?.email ?? '',
          nik: item?.nik ?? '',
          phone_number: item?.phone_number ?? '',
        }

        return data
      })

      return employeeData
    } catch (error) {
      console.error('Error getting employee list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewEmployee(page, pageSize)
    setEmployeeData(data)
  }

  useEffect(() => {
    fetchData(1, 10)
  }, [dateFrom, dateTo, searchFilter, selectedStore])

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

  // Employee Form
  const employeeFormHandler = (e: any) => {
    setEmployeeInfo((prevSalesInfo) => ({
      ...prevSalesInfo,
      [e.target.name]: e.target.value,
    }))
  }

  // Change Select Store
  useEffect(() => {
    setEmployeeInfo((prev) => ({
      ...prev,
      store_id:
        userRole === 'Admin HO' ? selectedStore?.value ?? null : Number.parseInt(staffStoreId),
    }))
  }, [selectedStore])

  // Change Select Position
  useEffect(() => {
    setEmployeeInfo((prev) => ({
      ...prev,
      position_id: selectedPosition?.value ?? null,
    }))
  }, [selectedPosition])

  // Filter Search Handler
  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
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
    },
    {
      title: 'Nama Staff',
      dataIndex: 'full_name',
      key: 'full_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.full_name.includes(String(value)),
      sorter: (a, b) => a.full_name.length - b.full_name.length,
    },
    {
      title: 'NIK',
      dataIndex: 'nik',
      key: 'nik',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.nik.includes(String(value)),
      sorter: (a, b) => a.nik.length - b.nik.length,
    },
    {
      title: 'Posisi',
      dataIndex: 'full_name',
      key: 'full_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.full_name.includes(String(value)),
      sorter: (a, b) => a.full_name.length - b.full_name.length,
    },
    {
      title: 'Assign To Store',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.email.includes(String(value)),
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.phone_number.includes(String(value)),
      sorter: (a, b) => a.phone_number.length - b.phone_number.length,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 45,
      render: (record) => {
        const handleUpdateId = () => {
          const id = record.employee_id
          navigate(`/employee/update-employee/${id}`)
        }

        const handleDeleteId = () => {
          const id = record.employee_id

          Swal.fire({
            title: `Apakah anda yakin akan menghapus data staff ini ?`,
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
                  .delete(`${apiUrl}/employee/${id}`, {
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

  // Employee Validation
  const EmployeeValidation = () => {
    let valid = true

    if (!employeeInfo.full_name) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nama Staff form',
        icon: 'error',
      })
      valid = false
    } else if (!employeeInfo.nik) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill NIK form',
        icon: 'error',
      })
      valid = false
    } else if (!employeeInfo.birth) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Tanggal Lahir form',
        icon: 'error',
      })
      valid = false
    } else if (!employeeInfo.phone_number) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill WA / Phone Number form',
        icon: 'error',
      })
      valid = false
    } else if (!employeeInfo.email) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Email form',
        icon: 'error',
      })
      valid = false
    } else if (!employeeInfo.default_password) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Password form',
        icon: 'error',
      })
      valid = false
    }

    return valid
  }

  // Handle Submit New Employee
  const handleSubmit = async () => {
    if (!EmployeeValidation()) {
      setIsLoading(true)
      return false
    }

    await axios
      .post(`${apiUrl}/employee`, employeeInfo, {
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
            text: 'Success Create Employee',
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

  const handleCancel = () => {
    navigate('/employee/view-employee')
  }

  return (
    <>
      <section id='new-employee'>
        <div className='card mb-5'>
          <div className='card-body'>
            <div className='form-wrapper'>
              <Row className='form-header mb-4'>
                <Form.Group>
                  <Form.Label>
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
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Staff ID</Form.Label>
                    <Form.Control readOnly type='number' value={employeeId} />
                  </Form.Group>

                  <Form.Group className='mb-5'>
                    <Form.Label>Nama Staff</Form.Label>
                    <Form.Control
                      name='full_name'
                      type='text'
                      onChange={(e) => employeeFormHandler(e)}
                    />
                  </Form.Group>

                  <Form.Group className='mb-5'>
                    <Form.Label>Tanggal Lahir</Form.Label>
                    <Form.Control
                      name='birth'
                      type='date'
                      onChange={(e) => employeeFormHandler(e)}
                    />
                  </Form.Group>

                  <Form.Group className='mb-5'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name='email'
                      type='text'
                      onChange={(e) => employeeFormHandler(e)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Posisi</Form.Label>

                    {userRole === 'Admin HO' ? (
                      <Select
                        classNamePrefix='select'
                        placeholder='Pilih Nama Posisi'
                        isSearchable={true}
                        options={position}
                        onChange={(newValue) => setSelectedPosition(newValue)}
                      />
                    ) : (
                      <Form.Control readOnly type='text' value='Store Staff' />
                    )}
                  </Form.Group>

                  <Form.Group className='mb-5'>
                    <Form.Label>NIK</Form.Label>
                    <Form.Control
                      name='nik'
                      type='number'
                      onChange={(e) => employeeFormHandler(e)}
                    />
                  </Form.Group>

                  <Form.Group className='mb-5'>
                    <Form.Label>WA / Phone Number</Form.Label>
                    <Form.Control
                      name='phone_number'
                      type='number'
                      onChange={(e) => employeeFormHandler(e)}
                    />
                  </Form.Group>

                  <Form.Group className='mb-5'>
                    <Form.Label>Default Password</Form.Label>
                    <Form.Control
                      name='default_password'
                      type='text'
                      onChange={(e) => employeeFormHandler(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className='d-flex justify-content-center mt-5'>
              <Button variant='dark-danger' type='submit' onClick={handleCancel}>
                Cancel
              </Button>

              <Button
                variant='dark-primary'
                type='submit'
                disabled={isLoading}
                onClick={() => {
                  handleSubmit()
                }}
              >
                {isLoading ? 'Saving..' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id='view-employee'>
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
                {userRole === 'Admin HO' && (
                  <Select
                    name='store_id'
                    className='form-control p-0'
                    classNamePrefix='select'
                    placeholder='Pilih Toko'
                    isSearchable={true}
                    options={store}
                    onChange={(newValue) => setSelectedStore(newValue)}
                  />
                )}
              </Col>
            </Row>

            <Table
              className='table-striped-rows'
              bordered
              columns={columns}
              dataSource={employeeData}
              rowKey={(record) => record.employee_id}
              pagination={{
                position: ['bottomRight'],
                current: currentPage,
                total: totalData,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50, 100],
                onChange: (page, pageSize) => {
                  fetchData(page, pageSize)
                },
                itemRender: itemRender,
                showTotal: (total, range) => (
                  <span style={{left: 0, position: 'absolute'}}>
                    Showing {range[0]} - {range[1]} of {total} Total Staff
                  </span>
                ),
              }}
            />
          </div>
        </div>
      </section>
    </>
  )
}

export {NewEmployee}
