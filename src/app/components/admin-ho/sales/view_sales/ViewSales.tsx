/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import './ViewSales.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import {Table, Tag} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faPen,
  faTrash,
  faFileExcel,
  faSearch,
  faPlus,
  faUserPlus,
  faFilter,
} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

interface StoreItem {
  value: string
  label: string
}

const ViewSalesHO: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [store, setStore] = useState<StoreItem[]>([])
  const [searchByStore, setSearchByStore] = useState<any>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const handleChangeSelectStore = (element: any) => {
    const updatedStoreId = element.value
    const updatedStoreName = element.label

    setSearchByStore(updatedStoreId)
  }

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
      defaultSortOrder: 'descend',
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
    {
      title: 'NIK',
      dataIndex: 'nik',
      key: 'nik',
      align: 'left',
      width: 120,
      sorter: (a, b) => a.nik - b.nik,
    },
    {
      title: 'Brand Sales',
      dataIndex: 'sales_brand',
      key: 'sales_brand',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.sales_brand.includes(String(value)),
      sorter: (a, b) => a.sales_brand.length - b.sales_brand.length,
    },
    {
      title: 'Kategori Sales',
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
      fixed: 'right',
      width: 70,
      render: (record) => {
        const handleNewSales = () => {
          navigate('/sales/new-sales')
        }

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
            <a className='button-add' onClick={handleNewSales}>
              <FontAwesomeIcon icon={faUserPlus} size='sm' className='text-black' />
            </a>

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

  const [salesData, setSalesData] = useState<DataType[]>([])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

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
          nik: item.nik,
          sales_brand: salesBrand,
          sales_category: salesCategory,
          is_active: item.is_active === 'true' ? 'ACTIVE' : 'NON ACTIVE',
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

  return (
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
                onChange={(element) => handleChangeSelectStore(element)}
              /> */}
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={salesData}
            rowKey={(record) => record.sales_id}
            scroll={{x: 1500}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewSalesHO}
