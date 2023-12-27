/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import './ViewVendor.css'

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

type Props = {
  className: string
}

interface StoreItem {
  value: string
  label: string
}

const ViewVendorHO: React.FC<Props> = ({className}) => {
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
    vendor_id: number
    pic_name: string
    company_name: string
    email_address: string
    phone_number: number
    date_join: string
    service_type: string
    serving_area: string
    rating: string
    vendor_status: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Vendor ID',
      dataIndex: 'vendor_id',
      key: 'vendor_id',
      align: 'center',
      width: 90,
      className: 'col_order_id',
    },
    {
      title: 'Nama PIC',
      dataIndex: 'pic_name',
      key: 'pic_name',
      align: 'left',
      width: 130,
    },
    {
      title: 'Nama Perusahaan',
      dataIndex: 'company_name',
      key: 'company_name',
      align: 'left',
      width: 130,
    },
    {
      title: 'Email Address',
      dataIndex: 'email_address',
      key: 'email_address',
      align: 'left',
      width: 120,
    },
    {
      title: 'No. Handphone',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'left',
      width: 120,
    },
    {
      title: 'Service Type',
      dataIndex: 'service_type',
      key: 'service_type',
      align: 'left',
      width: 160,
    },
    {
      title: 'Serving Area',
      dataIndex: 'serving_area',
      key: 'serving_area',
      align: 'left',
      width: 160,
    },
    {
      title: 'Date Join',
      dataIndex: 'date_join',
      key: 'date_join',
      align: 'center',
      width: 110,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      align: 'center',
      width: 110,
    },
    {
      title: 'Vendor Status',
      dataIndex: 'vendor_status',
      key: 'vendor_status',
      align: 'center',
      width: 110,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      align: 'center',
      width: 80,
      render: (record) => {
        const handleDetailId = () => {
          const id = record.vendor_id
          navigate(`/vendor/detail-vendor/${id}`)
        }

        const handleUpdateId = () => {
          const id = record.vendor_id
          navigate(`/vendor/update-vendor/${id}`)
        }

        const handleDeleteId = () => {
          const id = record.vendor_id

          Swal.fire({
            title: `Apakah anda yakin akan menghapus data Vendor ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Cancel',
          })
            .then((willDelete) => {
              if (willDelete.value) {
                axios
                  .delete(`${apiUrl}/vendor/${id}`, {
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
            <a className='button-detail' onClick={handleDetailId}>
              <FontAwesomeIcon icon={faBook} size='sm' />
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

  const [vendorData, setVendorData] = useState<DataType[]>([])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchVendorList = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/vendor?date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&take=0`,
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

  const ViewVendor = async () => {
    try {
      const apiData = await fetchVendorList()

      if (!apiData) {
        console.error('No data received from fetchVendorList')
        return []
      }

      const vendorData = apiData.map((item: any) => {
        let data

        const joinDate = new Date(item.join_date)

        const vendorService = item.vendor_service
          .map((vendor_service: any) => vendor_service.service_type.service_type)
          .join(', ')

        const vendorArea = item.vendor_area
          .map((vendor_area: any) => vendor_area.city.city_name)
          .join(', ')

        data = {
          vendor_id: item.id,
          pic_name: item.users.username,
          company_name: item.company_name,
          email_address: item.email_address,
          phone_number: item.phone_number,
          date_join: formatDate(joinDate),
          service_type: vendorService,
          serving_area: vendorArea || '',
          rating: '-',
          vendor_status: item.is_active ? 'ACTIVE' : 'NON ACTIVE',
        }

        return data
      })

      return vendorData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await ViewVendor()
      setVendorData(data)
    }

    fetchData()
  }, [dateFrom, dateTo, searchFilter])

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
            city_id: item.city_id,
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
    <section id='view-vendor'>
      <div className={`card ${className}`}>
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
                    format={'DD-MM-YYYY'}
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
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={vendorData}
            rowKey={(record) => record.vendor_id}
            // scroll={{x: 2000}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewVendorHO}
