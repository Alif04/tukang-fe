/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useEffect, useState} from 'react'

import './FormatEmailList.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import type {ColumnsType} from 'antd/es/table'
import {Form, InputGroup, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faPen, faSearch, faCheck} from '@fortawesome/free-solid-svg-icons'

import {Table, PaginationProps} from 'antd'

interface DataType {
  numbering: number
  id: number
  email_type: string
  created_at: string
  is_active: string
}

const FormatEmailList: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [formatEmail, setFormatEmail] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'No.',
      dataIndex: 'numbering',
      key: 'numbering',
      align: 'center',
      sorter: (a, b) => a.numbering - b.numbering,
      width: 50,
    },
    {
      title: 'Email Type',
      dataIndex: 'email_type',
      key: 'email_type',
      align: 'center',
      className: 'text-start',
      onFilter: (value, record) => record.email_type.includes(String(value)),
      sorter: (a, b) => a.email_type.length - b.email_type.length,
      width: 120,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      onFilter: (value, record) => record.created_at.includes(String(value)),
      sorter: (a, b) => a.created_at.length - b.created_at.length,
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      onFilter: (value, record) => record.is_active.includes(String(value)),
      sorter: (a, b) => a.is_active.length - b.is_active.length,
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => {
        const handleUpdate = () => {
          const id = record.id
          navigate(`/email/update-format-email/${id}`)
        }

        const handleActive = () => {
          const id = record.id

          Swal.fire({
            title: `Apakah anda yakin akan mengaktifkan template email ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Cancel',
          })
            .then((willDelete) => {
              if (willDelete.value) {
                axios
                  .patch(
                    `${apiUrl}/email-messages/${id}`,
                    {
                      is_active: true,
                    },
                    {
                      headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                        'Access-Control-Allow-Origin': '*',
                        'ngrok-skip-browser-warning': 'true',
                      },
                    }
                  )
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

        const handleNonActive = () => {
          const id = record.id

          Swal.fire({
            title: `Apakah anda yakin akan mengaktifkan template email ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Cancel',
          })
            .then((willDelete) => {
              if (willDelete.value) {
                axios
                  .patch(
                    `${apiUrl}/email-messages/${id}`,
                    {
                      is_active: false,
                    },
                    {
                      headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                        'Access-Control-Allow-Origin': '*',
                        'ngrok-skip-browser-warning': 'true',
                      },
                    }
                  )
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
            <a className='button-detail' onClick={handleUpdate}>
              <FontAwesomeIcon icon={faPen} className='text-black' size='sm' />
            </a>

            {record.is_active !== 'Active' && (
              <a className='button-detail' onClick={handleActive}>
                <FontAwesomeIcon icon={faCheck} className='text-black' size='sm' />
              </a>
            )}

            <a className='button-delete' onClick={handleNonActive}>
              <FontAwesomeIcon icon={faTrash} size='sm' />
            </a>
          </div>
        )
      },
      fixed: 'right',
      width: 30,
    },
  ]

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const getFormatEmailList = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get(
        `${apiUrl}/email-messages?page=${page}&take=${pageSize}&search=${searchFilter}&order_by=desc`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      setCurrentPage(response?.data?.page)
      setTotalData(response?.data?.total ?? 0)

      return response.data.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewFormatEmail = async (page: number, pageSize: number) => {
    try {
      const apiData = await getFormatEmailList(page, pageSize)

      if (!apiData) {
        console.error('No data received from getFormatEmailList')
        return []
      }

      const formatEmailData = apiData.map((item: any, index: number) => {
        let data

        const CreatedAt = new Date(item?.created_at ?? '-')
        const emailTypes: any = {
          1: 'ORDERS NOTIFICATION',
          2: 'CREDENTIAL MAIL',
          3: 'RESET PASSWORD',
          4: 'QUOTATION',
          5: 'OTHERS',
        }

        const EmailType = emailTypes[item?.email_type] || ''

        data = {
          numbering: index + 1,
          id: item?.id,
          email_type: EmailType,
          created_at: formatDate(CreatedAt),
          is_active: item?.is_active === true ? 'Active' : 'Non Active',
        }

        return data
      })

      return formatEmailData
    } catch (error) {
      console.error('Error getting format email list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewFormatEmail(page, pageSize)
    setFormatEmail(data)
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
            dataSource={formatEmail}
            rowKey={(record) => record.id}
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
                  Showing {range[0]} - {range[1]} of {total} Total Format Email
                </span>
              ),
            }}
          />
        </div>
      </div>
    </section>
  )
}

export {FormatEmailList}
