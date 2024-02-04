/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import './ListStore.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import type {ColumnsType} from 'antd/es/table'
import {Form, InputGroup, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faPen, faSearch} from '@fortawesome/free-solid-svg-icons'

import {Table, PaginationProps} from 'antd'

const ListStoreHO: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [storeData, setStoreData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    store_id: number
    store_name: string
    phone_number: number
    email: string
    address: string
    city: string
    bank_name: string
    account_number: number
    account_name: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'No.',
      dataIndex: 'store_id',
      key: 'store_id',
      align: 'center',
      sorter: (a, b) => a.store_id - b.store_id,
      width: 50,
    },
    {
      title: 'Nama Toko',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      className: 'text-start',
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
      width: 120,
    },
    {
      title: 'Nomor Telp',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'center',
      sorter: (a, b) => a.phone_number - b.phone_number,
      width: 120,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      onFilter: (value, record) => record.email.includes(String(value)),
      sorter: (a, b) => a.email.length - b.email.length,
      width: 130,
    },
    {
      title: 'Alamat',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
      onFilter: (value, record) => record.address.includes(String(value)),
      sorter: (a, b) => a.address.length - b.address.length,
      width: 130,
    },
    {
      title: 'Kota',
      dataIndex: 'city',
      key: 'city',
      align: 'center',
      onFilter: (value, record) => record.city.includes(String(value)),
      sorter: (a, b) => a.city.length - b.city.length,
      width: 130,
    },
    {
      title: 'Nama Bank',
      dataIndex: 'bank_name',
      key: 'bank_name',
      align: 'center',
      onFilter: (value, record) => record.bank_name.includes(String(value)),
      sorter: (a, b) => a.bank_name.length - b.bank_name.length,
      width: 130,
    },
    {
      title: 'Nomor Akun',
      dataIndex: 'account_number',
      key: 'account_number',
      align: 'center',
      sorter: (a, b) => a.account_number - b.account_number,
      width: 130,
    },
    {
      title: 'Nama Akun',
      dataIndex: 'account_name',
      key: 'account_name',
      align: 'center',
      onFilter: (value, record) => record.account_name.includes(String(value)),
      sorter: (a, b) => a.account_name.length - b.account_name.length,
      width: 130,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => {
        const handleUpdate = () => {
          const id = record.store_id
          navigate(`/store/update-store/${id}`)
        }

        // const handleDetail = () => {
        //   const id = record.store_id
        //   navigate(`/store/detail-store/${id}`)
        // }

        const handleDeleteId = () => {
          const id = record.store_id

          Swal.fire({
            title: `Apakah anda yakin akan menghapus data Store ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Cancel',
          })
            .then((willDelete) => {
              if (willDelete.value) {
                axios
                  .delete(`${apiUrl}/stores/${id}`, {
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
            {/* <a className='button-detail' onClick={handleDetail}>
              <FontAwesomeIcon icon={faBook} size='sm' />
            </a> */}

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
      width: 60,
    },
  ]

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const getStoresList = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get(
        `${apiUrl}/stores?page=${page}&take=${pageSize}&search=${searchFilter}&order_by=desc`,
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
      setTotalData(response.data.total)
      return response.data.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewStores = async (page: number, pageSize: number) => {
    try {
      const apiData = await getStoresList(page, pageSize)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const storeData = apiData.map((item: any, index: number) => {
        let data

        const phoneNumber =
          item?.phone_number_1 !== null ? item?.phone_number_1 : item?.phone_number_2

        data = {
          store_id: index + 1,
          store_name: item?.store_name ?? '',
          phone_number: phoneNumber,
          email: item?.email ?? '',
          address: item?.address ?? '',
          city: item?.city?.city_name ?? '',
          bank_name: item?.bank_name ?? '-',
          account_number: item?.bank_account ?? '-',
          account_name: item?.bank_number ?? '-',
        }

        return data
      })

      return storeData
    } catch (error) {
      console.error('Error getting store list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewStores(page, pageSize)
    setStoreData(data)
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
            dataSource={storeData}
            rowKey={(record) => record.store_id}
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
                  Showing {range[0]} - {range[1]} of {total} Total Store
                </span>
              ),
            }}
          />
        </div>
      </div>
    </section>
  )
}

export {ListStoreHO}
