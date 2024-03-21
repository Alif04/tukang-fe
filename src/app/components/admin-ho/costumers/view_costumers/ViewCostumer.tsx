/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ViewCostumer.css'

import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {Table, DatePicker, PaginationProps} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPrint, faFileExcel, faSearch, faPen} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

const ViewCostumerHO: React.FC<Props> = ({className}) => {
  const navigate = useNavigate()

  const [memberData, setMemberData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    number: number
    // store_name: string
    costumer_id: number
    member_number: number
    full_name: string
    phone_number: number
    email_address: string
    customer_since: Date
    total_order: number
    // total_spend: number
    // total_complaint: number
    // total_cis_score: number
    // status: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Nomor Urut',
      dataIndex: 'number',
      key: 'number',
      align: 'center',
      sorter: (a, b) => a.number - b.number,
    },
    // {
    //   title: 'Nama Toko',
    //   dataIndex: 'store_name',
    //   key: 'store_name',
    //   align: 'center',
    //   onFilter: (value, record) => record.store_name.includes(String(value)),
    //   sorter: (a, b) => a.store_name.length - b.store_name.length,
    // },
    {
      title: 'Nomor Member',
      dataIndex: 'member_number',
      key: 'member_number',
      align: 'center',
      sorter: (a, b) => a.member_number - b.member_number,
    },
    {
      title: 'Nama Customer',
      dataIndex: 'full_name',
      key: 'full_name',
      onFilter: (value, record) => record.full_name.includes(String(value)),
      sorter: (a, b) => a.full_name.length - b.full_name.length,
    },
    {
      title: 'Nomor HP/WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      sorter: (a, b) => a.phone_number - b.phone_number,
    },
    {
      title: 'Email Address',
      dataIndex: 'email_address',
      key: 'email_address',
      onFilter: (value, record) => record.email_address.includes(String(value)),
      sorter: (a, b) => a.email_address.length - b.email_address.length,
    },
    {
      title: 'Join Date',
      dataIndex: 'customer_since',
      key: 'customer_since',
      align: 'center',
      sorter: (a, b) => new Date(a.customer_since).getTime() - new Date(b.customer_since).getTime(),
    },
    {
      title: 'Total Order',
      dataIndex: 'total_order',
      key: 'total_order',
      align: 'center',
      sorter: (a, b) => a.total_order - b.total_order,
    },
    // {
    //   title: 'Total Value',
    //   dataIndex: 'total_spend',
    //   key: 'total_spend',
    //   sorter: (a, b) => a.total_spend - b.total_spend,
    // },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    // },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (record) => {
        const handleDetail = () => {
          const id = record.costumer_id
          navigate(`/costumers/detail-costumers/${id}`)
        }

        const handleUpdate = () => {
          const id = record.costumer_id
          navigate(`/costumers/update-costumers/${id}`)
        }

        return (
          <div className='d-flex justify-content-center'>
            <a className='button-detail me-2' onClick={handleDetail}>
              <FontAwesomeIcon icon={faBook} size='sm' />
            </a>

            <a className='button-update ms-2 text-dark' onClick={handleUpdate}>
              <FontAwesomeIcon icon={faPen} size='sm' />
            </a>
          </div>
        )
      },
    },
  ]

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchMemberList = async (page: number, pageSize: number) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL

      const response = await axios.get(
        `${apiUrl}/member?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&page=${page}&take=${pageSize}`,
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

  const ViewMember = async (page: number, pageSize: number) => {
    try {
      const apiData = await fetchMemberList(page, pageSize)

      if (!apiData) {
        console.error('No data received from fetch member')
        return []
      }

      const memberData = apiData.map((item: any, index: number) => {
        let data

        const joinDate = new Date(item?.join_date ?? '-')
        let phoneNumber = item.phone_number !== 'null' ? item.phone_number : item.whatsapp_number
        let totalOrder = item?.order.length ?? 0

        data = {
          number: index + 1,
          // store_name: item?.store?.store_name ?? '-',
          costumer_id: item.id,
          member_number: item.member_number,
          full_name: item.full_name,
          phone_number: phoneNumber,
          email_address: item?.email ?? '-',
          customer_since: formatDate(joinDate),
          total_order: totalOrder,
          // total_spend: item?.total_spend ?? '-',
          // total_complaint: item?.total_complaint ?? '-',
          // total_cis_score: item?.total_cis_score ?? '-',
          // status: item?.is_active === true ? 'ACTIVE' : '-',
        }

        return data
      })

      return memberData
    } catch (error) {
      console.error('Error getting member list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewMember(page, pageSize)
    setMemberData(data)
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

  return (
    <section id='view-costumer'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <div className='filter-search'>
            <InputGroup>
              <Form.Control
                placeholder='Find Customer'
                className='filter-rtl'
                onChange={handleChangeSearchFilter}
              />

              <InputGroup.Text className='filter-rtl'>
                <FontAwesomeIcon icon={faSearch} size='sm' />
              </InputGroup.Text>
            </InputGroup>
          </div>

          <div className='table-head-wrapper'>
            <div className='left'>
              <h3>Filter By :</h3>

              <Form.Group as={Row} className='date-filter mb-5'>
                <Form.Label column sm='4'>
                  Join Date :
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
            </div>

            <div className='right'>
              <button className='button-export'>
                <FontAwesomeIcon icon={faFileExcel} size='2xl' className='excel-icon' />
              </button>

              <button className='button-print'>
                <FontAwesomeIcon icon={faPrint} size='2xl' className='print-icon' />
              </button>
            </div>
          </div>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={memberData}
            rowKey={(record) => record.costumer_id}
            // scroll={{x: 1700}}
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
                  Showing {range[0]} - {range[1]} of {total} Total Member
                </span>
              ),
            }}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewCostumerHO}
