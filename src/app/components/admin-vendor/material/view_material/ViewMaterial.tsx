/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import './ViewMaterial.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import type {ColumnsType} from 'antd/es/table'
import {Form, InputGroup, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faTrash, faPen, faSearch} from '@fortawesome/free-solid-svg-icons'

import {Table} from 'antd'

const ViewMaterialVendor: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    material_id: number
    product_name: string
    price: number
    amount: number
    status: string
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
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      align: 'center',
      onFilter: (value, record) => record.product_name.includes(String(value)),
      sorter: (a, b) => a.product_name.length - b.product_name.length,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      onFilter: (value, record) => record.status.includes(String(value)),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => {
        const handleDetail = () => {
          const id = record.material_id
          navigate(`/material/detail-material/${id}`)
        }

        const handleEdit = () => {
          const id = record.material_id
          navigate(`/material/update-material/${id}`)
        }

        const handleDeleteId = () => {
          const id = record.material_id

          Swal.fire({
            title: `Apakah anda yakin akan menghapus data Material ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Cancel',
          })
            .then((willDelete) => {
              if (willDelete.value) {
                axios
                  .delete(`${apiUrl}/material/${id}`, {
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

            <a className='button-edit' onClick={handleEdit}>
              <FontAwesomeIcon icon={faPen} size='sm' />
            </a>

            <a className='button-delete' onClick={handleDeleteId}>
              <FontAwesomeIcon icon={faTrash} size='sm' />
            </a>
          </div>
        )
      },
      fixed: 'right',
      width: 80,
    },
  ]

  // Fetch Data Material
  const [materialData, setMaterialData] = useState<DataType[]>([])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchMaterialList = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/material?order_by=desc&search=${searchFilter}&take=0`,
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

  const ViewMaterial = async () => {
    try {
      const apiData = await fetchMaterialList()

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const materialData = apiData.map((item: any) => {
        let data

        data = {
          material_id: item.id,
          product_name: item.material_name,
          price: item.material_price,
          amount: item.amount,
          status: item.status.category,
        }

        return data
      })

      return materialData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await ViewMaterial()
      setMaterialData(data)
    }

    fetchData()
  }, [searchFilter])

  return (
    <section id='view-material'>
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
                    placeholder='Filter'
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
            dataSource={materialData}
            rowKey={(record) => record.material_id}
            // scroll={{x: 1800}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewMaterialVendor}
