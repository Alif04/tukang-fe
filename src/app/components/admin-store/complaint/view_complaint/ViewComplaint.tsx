/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import './ViewComplaint.css'

import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import type {ColumnsType} from 'antd/es/table'
import {Form, InputGroup, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faFilter, faPen, faSearch} from '@fortawesome/free-solid-svg-icons'

import {Table, DatePicker} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
}

const ViewComplaintStore: React.FC<Props> = ({className}) => {
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
    no_member: string
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
    },
    {
      title: 'Assign From',
      dataIndex: 'assign_from',
      key: 'assign_from',
      align: 'center',
      width: 120,
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 120,
    },
    {
      title: 'Order Date',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 130,
    },
    {
      title: 'No Member',
      dataIndex: 'no_member',
      key: 'no_member',
      align: 'center',
      width: 130,
    },
    {
      title: 'Customer Name',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      width: 150,
    },
    {
      title: 'No Telp / WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: 160,
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
    },
    {
      title: 'Complaint Description',
      dataIndex: 'complaint_desc',
      key: 'complaint_desc',
      className: 'col-complaint-date',
      width: 180,
    },
    {
      title: 'Complaint Status',
      dataIndex: 'complaint_status',
      key: 'complaint_status',
      className: 'col-complaint-status',
      width: 180,
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
        `${apiUrl}/complaints?date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&take=50`,
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
          item.complaint_status === 1
            ? 'COMPLAINT'
            : item.complaint_status === 2
            ? 'INVESTIGATED'
            : item.complaint_status === 3
            ? 'ACCEPTED'
            : ''

        let orderStatus =
          item.orders.project_status_id === 2
            ? 'BOOK'
            : item.orders.project_status_id === 3
            ? 'BOOKED'
            : item.orders.project_status_id === 4
            ? 'SURVEY REQ'
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
          order_status: orderStatus,
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

export {ViewComplaintStore}
