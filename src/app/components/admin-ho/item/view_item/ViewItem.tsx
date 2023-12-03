/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import './ViewItem.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import type {ColumnsType} from 'antd/es/table'
import {Form, InputGroup, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faTrash, faPen, faSearch} from '@fortawesome/free-solid-svg-icons'

import {Table} from 'antd'

const ViewItemHO: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    material_id: number
    store_name: string
    product_name: string
    service_name: string
    default_price: number
    min_order: number
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Material ID',
      dataIndex: 'material_id',
      key: 'material_id',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.material_id - b.material_id,
    },
    {
      title: 'Assign To Store',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
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

  // Fetch Data Material
  const [itemData, setItemData] = useState<DataType[]>([])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const getItemList = async () => {
    try {
      const response = await axios.get(`${apiUrl}/items?take=0&search=${searchFilter}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewItem = async () => {
    try {
      const apiData = await getItemList()

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const itemData = apiData.map((item: any) => {
        let data

        data = {
          material_id: item?.id,
          store_name: item?.prices[0]?.store.store_name || '-',
          product_name: item?.item_name || '-',
          service_name: item?.service_name || '-',
          default_price: `Rp. ${parseInt(item?.default_price).toLocaleString('id')}`,
          min_order: item?.prices[0]?.min_order || '-',
        }

        return data
      })

      return itemData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await ViewItem()
      setItemData(data)
    }

    fetchData()
  }, [searchFilter])

  return (
    <section id='view-item'>
      <div className='card'>
        <div className='card-body'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4}></Col>

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

            <Col xs={12} md={12} lg={12} xl={4} xxl={4}></Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={itemData}
            rowKey={(record) => record.material_id}
            // scroll={{x: 1800}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewItemHO}
