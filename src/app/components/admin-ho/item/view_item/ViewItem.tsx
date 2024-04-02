/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import './ViewItem.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'
import {Table, PaginationProps} from 'antd'
import {useNavigate} from 'react-router-dom'
import type {ColumnsType} from 'antd/es/table'
import {Form, InputGroup, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faTrash, faSearch, faFilter} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

interface DataType {
  no: number
  material_id: number
  store_name: string
  product_name: string
  service_name: string
  default_price: number
  min_order: number
}

interface StoreItem {
  value: number | null
  label: string
}

const ViewItemHO: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [itemData, setItemData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [store, setStore] = useState<StoreItem[]>([])
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreItem>>({
    value: null,
    label: 'All Store',
  })

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const storeOptions = [{value: null, label: 'All Store'}, ...store]

  const columns: ColumnsType<DataType> = [
    {
      title: 'No. ',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
      sorter: (a, b) => a.no - b.no,
    },
    {
      title: 'Material ID',
      dataIndex: 'material_id',
      key: 'material_id',
      align: 'center',
      sorter: (a, b) => a.material_id - b.material_id,
    },
    {
      title: 'Assign To Store',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
      width: 280,
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      align: 'center',
      onFilter: (value, record) => record.product_name.includes(String(value)),
      sorter: (a, b) => a.product_name.length - b.product_name.length,
    },
    {
      title: 'Nama Jasa Pemasangan',
      dataIndex: 'service_name',
      key: 'service_name',
      align: 'center',
      onFilter: (value, record) => record.service_name.includes(String(value)),
      sorter: (a, b) => a.service_name.length - b.service_name.length,
    },
    {
      title: 'Price',
      dataIndex: 'default_price',
      key: 'default_price',
      align: 'center',
      sorter: (a, b) => a.default_price - b.default_price,
    },
    {
      title: 'Min Order',
      dataIndex: 'min_order',
      key: 'min_order',
      align: 'center',
      sorter: (a, b) => a.min_order - b.min_order,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => {
        const handleUpdate = () => {
          const id = record.material_id
          navigate(`/item/update-item/${id}`)
        }

        const handleDetail = () => {
          const id = record.material_id
          navigate(`/item/detail-item/${id}`)
        }

        const handleDeleteId = () => {
          const id = record.material_id

          Swal.fire({
            title: `Apakah anda yakin akan menghapus data Item ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Cancel',
          })
            .then((willDelete) => {
              if (willDelete.value) {
                axios
                  .delete(`${apiUrl}/items/${id}`, {
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
            <a className='button-detail' onClick={handleDetail}>
              <FontAwesomeIcon icon={faBook} size='sm' />
            </a>

            <a className='button-detail' onClick={handleUpdate}>
              <FontAwesomeIcon icon={faPen} className='text-black' size='sm' />
            </a>

            <a className='button-delete' onClick={handleDeleteId}>
              <FontAwesomeIcon icon={faTrash} size='sm' />
            </a>
          </div>
        )
      },
      fixed: 'right',
      width: 90,
    },
  ]

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const getItemList = async (page: number, pageSize: number) => {
    const storeId = selectedStore && selectedStore.value ? `&store_id=${selectedStore.value}` : ''

    try {
      const response = await axios.get(
        `${apiUrl}/items?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&take=0${storeId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      // setCurrentPage(response.data.page)
      setTotalData(response?.data?.total ?? 0)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewItem = async (page: number, pageSize: number) => {
    try {
      const apiData = await getItemList(page, pageSize)

      if (!apiData) {
        console.error('No data received from getItemList')
        return []
      }

      const itemData = apiData.map((item: any, index: number) => {
        let data

        const storeItem = item?.prices[0]?.price_stores
          .map((storeDetail: any) => storeDetail?.store?.store_name ?? '-')
          .join(', ')

        data = {
          no: index + 1,
          material_id: item?.id,
          store_name: storeItem,
          product_name: item?.item_name ?? '-',
          service_name: item?.service_name ?? '-',
          default_price: `Rp. ${parseInt(item?.default_price).toLocaleString('id')}`,
          min_order: item?.prices[0]?.min_order ?? '-',
        }

        return data
      })

      return itemData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewItem(page, pageSize)
    setItemData(data)
  }

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

  useEffect(() => {
    fetchData(1, 10)
  }, [dateFrom, dateTo, searchFilter, selectedStore?.value])

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
    <section id='view-item'>
      <div className='card'>
        <div className='card-body'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4}>
              <Form.Group as={Row}>
                <Form.Label className='fs-3' column sm='4'>
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

            <Col xs={12} md={12} lg={12} xl={4} xxl={4}>
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

            <Col xs={12} md={12} lg={12} xl={4} xxl={4}>
              <Select
                name='store_id'
                className='form-control p-0'
                classNamePrefix='select'
                placeholder='Pilih Toko'
                isSearchable={true}
                options={storeOptions}
                value={selectedStore}
                onChange={(newValue) => setSelectedStore(newValue)}
              />
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={itemData}
            rowKey={(record) => record.material_id}
            // scroll={{x: 1800}}
            pagination={{
              position: ['bottomRight'],
              // current: currentPage,
              total: totalData,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50, 100],
              // onChange: (page, pageSize) => {
              //   fetchData(page, pageSize)
              // },
              itemRender: itemRender,
              showTotal: (total, range) => (
                <span style={{left: 0, position: 'absolute'}}>
                  Showing {range[0]} - {range[1]} of {total} Total Item
                </span>
              ),
            }}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewItemHO}
