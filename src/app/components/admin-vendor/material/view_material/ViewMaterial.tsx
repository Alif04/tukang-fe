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

import {Table, PaginationProps} from 'antd'

const ViewMaterialVendor: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [materialData, setMaterialData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

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
        const handleDetail = () => {
          const id = record.material_id
          navigate(`/material/detail-material/${id}`)
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

  const fetchMaterialList = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get(
        `${apiUrl}/items?page=${page}&take=${pageSize}&search=${searchFilter}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      setCurrentPage(response.data.page)
      setTotalData(response?.data?.total ?? 0)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewMaterial = async (page: number, pageSize: number) => {
    try {
      const apiData = await fetchMaterialList(page, pageSize)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const materialData = apiData.map((item: any) => {
        let data

        data = {
          material_id: item?.id,
          store_name: item?.prices[0]?.store?.store_name ?? '-',
          product_name: item?.item_name ?? '-',
          service_name: item?.service_name ?? '-',
          default_price: `Rp. ${parseInt(item?.default_price ?? 0).toLocaleString('id')}`,
          min_order: item?.prices[0]?.min_order ?? '-',
        }

        return data
      })

      return materialData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewMaterial(page, pageSize)
    setMaterialData(data)
  }

  useEffect(() => {
    fetchData(1, 10)
  }, [searchFilter])

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

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
            dataSource={materialData}
            rowKey={(record) => record.material_id}
            // scroll={{x: 1800}}
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
                  Showing {range[0]} - {range[1]} of {total} Material
                </span>
              ),
            }}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewMaterialVendor}
