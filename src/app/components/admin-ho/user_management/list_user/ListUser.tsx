/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Table, PaginationProps} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch, faBook, faPen, faTrash} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface DataType {
  index: number
  id: number
  username: string
  role: string
}

const ListUserHO: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [userData, setCsiData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  // Handle Change Search Filter
  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: 90,
      className: 'col_order_id',
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      align: 'start',
      width: 110,
      onFilter: (value, record) => record.username.includes(String(value)),
      sorter: (a, b) => a.username.length - b.username.length,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      align: 'start',
      width: 110,
      onFilter: (value, record) => record.role.includes(String(value)),
      sorter: (a, b) => a.role.length - b.role.length,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      align: 'center',
      width: 80,
      render: (record) => {
        const id = record.id
        const role = record.role

        const handleUpdateId = () => {
          navigate(`/user/update-user/${id}`)
        }

        const handleDeleteId = () => {
          Swal.fire({
            title: `Apakah anda yakin akan menghapus User ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Cancel',
          })
            .then((willDelete) => {
              if (willDelete.value) {
                axios
                  .delete(`${apiUrl}/auth/delete-user/${id}`, {
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
          <div className='button-wrapper d-flex justify-content-center'>
            {!['Admin HO', 'Tukang', 'Employee', 'Member'].includes(role) && (
              <>
                <a className='button-edit' onClick={handleUpdateId}>
                  <FontAwesomeIcon className='me-2' icon={faPen} size='sm' />
                </a>

                <a className='button-delete ms-2' onClick={handleDeleteId}>
                  <FontAwesomeIcon icon={faTrash} size='sm' />
                </a>
              </>
            )}
          </div>
        )
      },
    },
  ]

  const getUser = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get(
        `${apiUrl}/auth/get?search=${searchFilter}&date_from=${dateFrom}&date_to=${dateTo}&take=0`,
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
      setTotalData(response?.data?.length)

      return response.data.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewUser = async (page: number, pageSize: number) => {
    try {
      const apiData = await getUser(page, pageSize)

      if (!apiData) {
        console.error('No data received from user data')
        return []
      }

      const userData = apiData.map((item: any, index: number) => {
        let data

        data = {
          index: index + 1,
          id: item.id,
          username: item?.username ?? '-',
          role: item?.roles.name ?? '-',
        }

        return data
      })

      return userData
    } catch (error) {
      console.error('Error getting user list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewUser(page, pageSize)
    setCsiData(data)
  }

  useEffect(() => {
    fetchData(1, 10)
  }, [dateFrom, dateTo, searchFilter])

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
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
              <div className='d-flex align-items-center me-3'>
                <h3 className='fs-3 fw-normal'>Date : </h3>
              </div>

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

            <Col xs={12} md={12} lg={12} xl={8} xxl={8}>
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
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={userData}
            rowKey={(record) => record.id}
            pagination={{
              position: ['bottomRight'],
              // current: currentPage,
              total: totalData,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50, 100],
              onChange: (page, pageSize) => {
                fetchData(page, pageSize)
              },
              itemRender: itemRender,
              showTotal: (total, range) => (
                <span style={{left: 0, position: 'absolute'}}>
                  Showing {range[0]} - {range[1]} of {total} List User
                </span>
              ),
            }}
          />
        </div>
      </div>
    </section>
  )
}

export {ListUserHO}
