/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import './ViewComplaint.css'

import axios from 'axios'
import {Table, DatePicker, Tag, PaginationProps} from 'antd'
import {useNavigate} from 'react-router-dom'
import type {ColumnsType} from 'antd/es/table'
import {Form, InputGroup, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faFilter, faPen, faSearch} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

const ViewComplaintStore: React.FC<Props> = ({className}) => {
  const userStore = localStorage.getItem('storeId')
  const navigate = useNavigate()

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const [complaintData, setComplaintData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(1)

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    complaint_id: number
    assign_from: string
    order_id: number
    date_order: Date
    no_member: number
    costumer_name: string
    phone_number: number
    service_name: string
    order_status: string
    work_status: string
    complaint_date: Date
    complaint_age: string
    complaint_status: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Complaint ID',
      dataIndex: 'complaint_id',
      key: 'complaint_id',
      align: 'center',
      width: 120,
      className: 'text-start',
      sorter: (a, b) => a.complaint_id - b.complaint_id,
    },
    {
      title: 'Store Name',
      dataIndex: 'assign_from',
      key: 'assign_from',
      align: 'center',
      width: 120,
      className: 'text-start',
      onFilter: (value, record) => record.assign_from.includes(String(value)),
      sorter: (a, b) => a.assign_from.length - b.assign_from.length,
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 110,
      className: 'text-start',
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Order Date',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 120,
      className: 'text-start',
      sorter: (a, b) => new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
    },
    {
      title: 'No Member',
      dataIndex: 'no_member',
      key: 'no_member',
      align: 'center',
      width: 140,
      className: 'text-start',
      sorter: (a, b) => a.no_member - b.no_member,
    },
    {
      title: 'Customer Name',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      width: 150,
      className: 'text-start',
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: 160,
      className: 'text-start',
      sorter: (a, b) => a.phone_number - b.phone_number,
    },
    {
      title: 'Nama Jasa Pemasangan',
      dataIndex: 'service_name',
      key: 'service_name',
      width: 180,
      className: 'text-start',
    },
    {
      title: 'Order Status',
      dataIndex: 'order_status',
      key: 'order_status',
      render: (order_status) => {
        const orderStatus = order_status
        let color = ''

        switch (orderStatus) {
          case 'UNPAID':
            color = 'red'
            break
          case 'PAID':
            color = 'green'
            break
          case 'PICKLIST':
            color = 'green'
            break
          case 'BOOKED':
            color = 'lime'
            break
          case 'SURVEYREQ':
            color = 'blue'
            break
          case 'SURVEYSTART':
            color = 'blue'
            break
          case 'SURVEYDONE':
            color = 'blue'
            break
          case 'RESURVEYREQ':
            color = 'blue'
            break
          case 'RESURVEYSTART':
            color = 'blue'
            break
          case 'RESURVEYDONE':
            color = 'blue'
            break
          case 'QUOTE IN':
            color = 'blue'
            break
          case 'QUOTE OUT':
            color = 'blue'
            break
          case 'WORKREQ':
            color = 'blue'
            break
          case 'WORKSTART':
            color = 'blue'
            break
          case 'WIP':
            color = 'blue'
            break
          case 'WORKEND':
            color = 'blue'
            break
          case 'INVOICED':
            color = 'blue'
            break
          case 'CISOUT':
            color = 'green'
            break
          default:
            color = 'blue'
            break
        }

        return <Tag color={color}>{orderStatus}</Tag>
      },
      filters: [
        {text: 'PICKLIST', value: 'PICKLIST'},
        {text: 'BOOKED', value: 'BOOKED'},
        {text: 'SURVEYREQ', value: 'SURVEYREQ'},
        {text: 'SURVEYSTART', value: 'SURVEYSTART'},
        {text: 'SURVEYDONE', value: 'SURVEYDONE'},
        {text: 'RESURVEYREQ', value: 'RESURVEYREQ'},
        {text: 'RESURVEYSTART', value: 'RESURVEYSTART'},
        {text: 'RESURVEYDONE', value: 'RESURVEYDONE'},
        {text: 'WORKREQ', value: 'WORKREQ'},
        {text: 'WORKSTART', value: 'WORKSTART'},
        {text: 'WIP', value: 'WIP'},
        {text: 'WORKEND', value: 'WORKEND'},
        {text: 'QUOTEIN', value: 'QUOTEIN'},
        {text: 'QUOTEOUT', value: 'QUOTEOUT'},
        {text: 'CISOUT', value: 'CISOUT'},
        {text: 'INVOICED', value: 'INVOICED'},
      ],
      onFilter: (value, record) => record.order_status.includes(String(value)),
      sorter: (a, b) => a.order_status.length - b.order_status.length,
      width: 150,
      className: 'text-start',
    },
    {
      title: 'Work Status',
      dataIndex: 'work_status',
      key: 'work_status',
      className: 'col-complaint-date text-start',
      width: 180,
      onFilter: (value, record) => record.work_status.includes(String(value)),
      sorter: (a, b) => a.work_status.length - b.work_status.length,
      render: (complaint_status) => {
        const complaintStatus = complaint_status
        let color = ''

        switch (complaintStatus) {
          case 'INVESTIGATED':
            color = 'volcano'
            break
          case 'ACCEPTED':
            color = 'green'
            break
          default:
            color = 'blue'
            break
        }

        return <Tag color={color}>{complaintStatus}</Tag>
      },
      filters: [
        {text: 'INVESTIGATED', value: 'INVESTIGATED'},
        {text: 'ACCEPTED', value: 'ACCEPTED'},
      ],
    },
    {
      title: 'Complaint Date',
      dataIndex: 'complaint_date',
      key: 'complaint_date',
      className: 'col-complaint-date text-start',
      width: 150,
      sorter: (a, b) => new Date(a.complaint_date).getTime() - new Date(b.complaint_date).getTime(),
    },
    {
      title: 'Umur Complaint',
      dataIndex: 'complaint_age',
      key: 'complaint_age',
      className: 'col-complaint-date text-start',
      width: 150,
      onFilter: (value, record) => record.complaint_age.includes(String(value)),
      sorter: (a, b) => a.complaint_age.length - b.complaint_age.length,
    },
    {
      title: 'Complaint Status',
      dataIndex: 'complaint_status',
      key: 'complaint_status',
      className: 'col-complaint-status text-start',
      width: 180,
      render: (complaint_status) => {
        const complaintStatus = complaint_status
        let color = ''

        switch (complaintStatus) {
          case 'INVESTIGATED':
            color = 'volcano'
            break
          case 'ACCEPTED':
            color = 'green'
            break
          default:
            color = 'blue'
            break
        }

        return <Tag color={color}>{complaintStatus}</Tag>
      },
      filters: [
        {text: 'INVESTIGATED', value: 'INVESTIGATED'},
        {text: 'ACCEPTED', value: 'ACCEPTED'},
      ],
      onFilter: (value, record) => record.complaint_status.includes(String(value)),
      sorter: (a, b) => a.complaint_status.length - b.complaint_status.length,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => {
        const handleDetail = () => {
          const id = record.complaint_id
          navigate(`/complaint/detail-complaint/${id}`)
        }

        const handleEdit = () => {
          const id = record.complaint_id
          navigate(`/complaint/update-complaint/${id}`)
        }

        return (
          <div className='button-wrapper'>
            <a className='button-detail' onClick={handleDetail}>
              <FontAwesomeIcon icon={faBook} size='sm' />
            </a>

            <a className='button-edit' onClick={handleEdit}>
              <FontAwesomeIcon icon={faPen} size='sm' />
            </a>
          </div>
        )
      },
      fixed: 'right',
      width: 80,
    },
  ]

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchComplaintList = async (page: number, pageSize: number) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL

      const response = await axios.get(
        `${apiUrl}/complaints?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&store_id=${userStore}&page=${page}&take=${pageSize}`,
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

  const ViewComplaint = async (page: number, pageSize: number) => {
    try {
      const apiData = await fetchComplaintList(page, pageSize)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const complaintData = apiData.map((item: any) => {
        let data

        const orderDate = new Date(item.orders.created_at)
        const complaintDate = new Date(item.complaint_date)
        const currentDate = new Date()

        const timeDifferenceInMilliseconds = Number(currentDate) - Number(complaintDate)
        const timeDifferenceInMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60))
        const timeDifferenceInHours = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60))
        const timeDifferenceInDays = Math.floor(
          timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
        )

        let complaintAge

        if (timeDifferenceInDays >= 1) {
          complaintAge = `${timeDifferenceInDays} Hari`
        } else if (timeDifferenceInHours >= 1) {
          complaintAge = `${timeDifferenceInHours} Jam`
        } else {
          complaintAge = `${timeDifferenceInMinutes} Menit`
        }

        let phoneNumber =
          item.orders.members.phone_number !== 'null'
            ? item.orders?.members?.phone_number
            : item.orders?.members?.whatsapp_number

        data = {
          complaint_id: item?.id,
          assign_from: item?.orders.store?.store_name,
          order_id: item?.orders?.id,
          date_order: formatDate(orderDate),
          no_member: item?.orders?.members?.member_number,
          costumer_name: item?.orders?.members?.full_name,
          phone_number: phoneNumber,
          service_name: item.orders?.m_order_details[0]?.item_name ?? '-',
          order_status: item.orders?.status?.category,
          work_status: item.orders?.status?.category,
          complaint_date: formatDate(complaintDate),
          complaint_age: complaintAge,
          complaint_status: item.status?.category,
        }

        return data
      })

      return complaintData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewComplaint(page, pageSize)
    setComplaintData(data)
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
    <section id='view-complaint'>
      <div className={`card ${className}`}>
        <div className='card-body'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
              <div className='d-flex align-items-center me-3'>
                <FontAwesomeIcon icon={faFilter} size='2xl' className='me-2' />
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
            dataSource={complaintData}
            rowKey={(record) => record.complaint_id}
            scroll={{x: 2000}}
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
                  Showing {range[0]} - {range[1]} of {total} Pengaduan
                </span>
              ),
            }}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewComplaintStore}
