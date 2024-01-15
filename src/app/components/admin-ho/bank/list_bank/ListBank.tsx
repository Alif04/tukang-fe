/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import './ListBank.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import type {ColumnsType} from 'antd/es/table'
import {Form, InputGroup, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faPen, faSearch} from '@fortawesome/free-solid-svg-icons'

import {Table, PaginationProps} from 'antd'

const ListBankHO: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [bankData, setBankData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    bank_id: number
    bank_name: string
    join_date: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'bank_id',
      key: 'bank_id',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.bank_id - b.bank_id,
      width: 50,
    },
    {
      title: 'Nama Bank',
      dataIndex: 'bank_name',
      key: 'bank_name',
      align: 'center',
      className: 'text-start',
      onFilter: (value, record) => record.bank_name.includes(String(value)),
      sorter: (a, b) => a.bank_name.length - b.bank_name.length,
      width: 120,
    },
    {
      title: 'Join Date',
      dataIndex: 'join_date',
      key: 'join_date',
      align: 'center',
      onFilter: (value, record) => record.join_date.includes(String(value)),
      sorter: (a, b) => a.join_date.length - b.join_date.length,
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => {
        const handleUpdate = () => {
          const id = record.bank_id
          navigate(`/bank/update-bank/${id}`)
        }

        // const handleDetail = () => {
        //   const id = record.bank_id
        //   navigate(`/bank/detail-bank/${id}`)
        // }

        const handleDeleteId = () => {
          const id = record.bank_id

          Swal.fire({
            title: `Apakah anda yakin akan menghapus data Bank ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Cancel',
          })
            .then((willDelete) => {
              if (willDelete.value) {
                axios
                  .delete(`${apiUrl}/bank/${id}`, {
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
      width: 20,
    },
  ]

  const getBanksList = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get(
        `${apiUrl}/bank?page=${page}&take=${pageSize}&search=${searchFilter}`,
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
      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewBanks = async (page: number, pageSize: number) => {
    try {
      const apiData = await getBanksList(page, pageSize)

      if (!apiData) {
        console.error('No data received from fetchBankList')
        return []
      }

      const bankData = apiData.map((item: any) => {
        let data

        data = {
          bank_id: item?.id ?? '',
          bank_name: item?.bank_name ?? '',
          join_date: formatDate(new Date(item?.created_at)) ?? '',
        }

        return data
      })

      return bankData
    } catch (error) {
      console.error('Error getting bank list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewBanks(page, pageSize)
    setBankData(data)
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

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
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
            dataSource={bankData}
            rowKey={(record) => record.bank_id}
            scroll={{x: 1000}}
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
                  Showing {range[0]} - {range[1]} of {total} Total Bank
                </span>
              ),
            }}
          />
        </div>
      </div>
    </section>
  )
}

export {ListBankHO}
