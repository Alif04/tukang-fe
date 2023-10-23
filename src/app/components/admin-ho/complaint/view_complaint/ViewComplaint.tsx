/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import './ViewComplaint.css'

import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import type {ColumnsType} from 'antd/es/table'
import {Form, InputGroup, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faFilter, faPen, faSearch} from '@fortawesome/free-solid-svg-icons'

import {Table, DatePicker, Tag} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
}

const ViewComplaintHO: React.FC<Props> = ({className}) => {
  const navigate = useNavigate()

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    complaint_id: number
    assign_from: string
    order_id: number
    date_order: string
    no_member: number
    costumer_name: string
    phone_number: number
    // installer_name: string
    order_status: string
    // work_status: string
    complaint_date: string
    complaint_desc: string
    complaint_status: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Complaint ID',
      dataIndex: 'complaint_id',
      key: 'complaint_id',
      align: 'center',
      width: 130,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.complaint_id - b.complaint_id,
    },
    {
      title: 'Assign From',
      dataIndex: 'assign_from',
      key: 'assign_from',
      align: 'center',
      width: 120,
      onFilter: (value, record) => record.assign_from.includes(String(value)),
      sorter: (a, b) => a.assign_from.length - b.assign_from.length,
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 120,
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Order Date',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 130,
      onFilter: (value, record) => record.date_order.includes(String(value)),
      sorter: (a, b) => a.date_order.length - b.date_order.length,
    },
    {
      title: 'No Member',
      dataIndex: 'no_member',
      key: 'no_member',
      align: 'center',
      width: 130,
      sorter: (a, b) => a.no_member - b.no_member,
    },
    {
      title: 'Customer Name',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      width: 150,
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'No Telp / WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: 160,
      sorter: (a, b) => a.phone_number - b.phone_number,
    },
    // {
    //   title: 'Installer Name',
    //   dataIndex: 'installer_name',
    //   key: 'installer_name',
    //   width: 180,
    // },
    {
      title: 'Order Status',
      dataIndex: 'order_status',
      key: 'order_status',
      width: 180,
      render: (order_status) => {
        const orderStatus = order_status
        let color = ''

        switch (orderStatus) {
          case 'BOOK':
            color = 'green'
            break
          case 'BOOKED':
            color = 'lime'
            break
          case 'SURVEYREQ':
            color = 'blue'
            break
          case 'SURVEYSTART':
          case 'SURVEYDONE':
          case 'QUOTE IN':
          case 'QUOTE OUT':
          case 'WORKREQ':
          case 'WORKSTART':
          case 'WIP':
          case 'WORKEND':
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
        {text: 'BOOK', value: 'BOOK'},
        {text: 'BOOKED', value: 'BOOKED'},
      ],
      onFilter: (value, record) => record.order_status.includes(String(value)),
      sorter: (a, b) => a.order_status.length - b.order_status.length,
    },
    // {
    //   title: 'Work Status',
    //   dataIndex: 'work_status',
    //   key: 'work_status',
    //   className: 'col-work-status',
    //   width: 180,
    // },
    {
      title: 'Complaint Date',
      dataIndex: 'complaint_date',
      key: 'complaint_date',
      className: 'col-complaint-date',
      width: 150,
      onFilter: (value, record) => record.complaint_date.includes(String(value)),
      sorter: (a, b) => a.complaint_date.length - b.complaint_date.length,
    },
    {
      title: 'Complaint Description',
      dataIndex: 'complaint_desc',
      key: 'complaint_desc',
      className: 'col-complaint-date',
      width: 180,
      onFilter: (value, record) => record.complaint_desc.includes(String(value)),
      sorter: (a, b) => a.complaint_desc.length - b.complaint_desc.length,
    },
    {
      title: 'Complaint Status',
      dataIndex: 'complaint_status',
      key: 'complaint_status',
      className: 'col-complaint-status',
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

  // Fetch Data Complaint
  const [complaintData, setComplaintData] = useState<DataType[]>([])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchComplaintList = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL

      const response = await axios.get(
        `${apiUrl}/complaints?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&take=-1`,
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

  const ViewComplaint = async () => {
    try {
      const apiData = await fetchComplaintList()

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const complaintData = apiData.map((item: any) => {
        let data

        const orderDate = new Date(item.orders.created_at)
        const complaintDate = new Date(item.complaint_date)

        let complaintStatus =
          item.complaint_status === 3
            ? 'INVESTIGATED'
            : item.complaint_status === 19
            ? 'ACCEPTED'
            : item.complaint_status === 21
            ? 'REJECT'
            : ''

        let phoneNumber =
          item.orders.members.phone_number !== 'null'
            ? item.orders.members.phone_number
            : item.orders.members.whatsapp_number

        data = {
          complaint_id: item.id,
          assign_from: item.orders.store.store_name,
          order_id: item.orders.id,
          date_order: formatDate(orderDate),
          no_member: item.orders.members.id,
          costumer_name: item.orders.members.full_name,
          phone_number: phoneNumber,
          // installer_name: item.orders.tukang.full_name,
          order_status: item.orders.status.category,
          // work_status: item,
          complaint_date: formatDate(complaintDate),
          complaint_desc: item.description,
          complaint_status: complaintStatus,
        }

        return data
      })

      return complaintData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await ViewComplaint()
      setComplaintData(data)
    }

    fetchData()
  }, [dateFrom, dateTo, searchFilter])

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
                    placeholder='Filter'
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
            scroll={{x: 1700}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewComplaintHO}
