/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ViewWorkOrder.css'

import axios from 'axios'
import {Table, Tag} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faFilter, faSearch} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface Status {
  value: number
  category: string
}

interface DataType {
  order_id: number
  store_name: string
  date_order: string
  costumer_id: number
  costumer_name: string
  phone_number: number
  item_name: string
  installation_type: string
  payment_status: string
  order_status: string
}

const ViewWorkVendor: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 100,
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Nama Store',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Date Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.date_order.includes(String(value)),
      sorter: (a, b) => a.date_order.length - b.date_order.length,
    },
    {
      title: 'Customer ID',
      dataIndex: 'costumer_id',
      key: 'costumer_id',
      align: 'center',
      width: 120,
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.costumer_id - b.costumer_id,
    },
    {
      title: 'Customer Name',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.phone_number - b.phone_number,
    },
    {
      title: 'Item Name',
      dataIndex: 'item_name',
      key: 'item_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.item_name.includes(String(value)),
      sorter: (a, b) => a.item_name.length - b.item_name.length,
    },
    {
      title: 'Nama Jasa Pemasangan',
      dataIndex: 'installation_type',
      key: 'installation_type',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.installation_type.includes(String(value)),
      sorter: (a, b) => a.installation_type.length - b.installation_type.length,
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      align: 'left',
      width: 150,
      onFilter: (value, record) => record.payment_status.includes(String(value)),
      sorter: (a, b) => a.payment_status.length - b.payment_status.length,
    },
    {
      title: 'Order Status',
      dataIndex: 'order_status',
      key: 'order_status',
      align: 'left',
      width: 140,
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
        {text: 'SURVEYSTART', value: 'SURVEYSTART'},
        {text: 'SURVEYREQ', value: 'SURVEYREQ'},
      ],
      onFilter: (value, record) => record.order_status.includes(String(value)),
      sorter: (a, b) => a.order_status.length - b.order_status.length,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (record) => {
        const handleDetailId = () => {
          const id = record.order_id
          navigate(`/work-order/detail-work-order/${id}`)
        }

        const handleUpdateId = () => {
          const id = record.order_id
          navigate(`/work-order/update-work-order/${id}`)
        }

        return (
          <div className='button-wrapper'>
            <a className='button-detail' onClick={handleDetailId}>
              <FontAwesomeIcon icon={faBook} size='sm' />
            </a>

            <a className='button-edit' onClick={handleUpdateId}>
              <FontAwesomeIcon icon={faPen} size='sm' />
            </a>
          </div>
        )
      },
    },
  ]

  const [orderData, setOrderData] = useState<DataType[]>([])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchOrderList = async () => {
    try {
      const storedStatus = sessionStorage.getItem('statusData')
      const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
      const desiredStatus = statusData.filter((status: any) => status.category.includes('SURVEY'))

      if (desiredStatus) {
        const statuses = desiredStatus.map((x) => x.value)

        const response = await axios.get(
          `${apiUrl}/orders?date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&take=0&status=${statuses}`,
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
      } else {
        console.error('Desired status not found in statusData')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewOrder = async () => {
    try {
      const apiData = await fetchOrderList()

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const orderData = apiData.map((item: any) => {
        let data
        const orderDate = new Date(item.created_at)

        let phoneNumber =
          item.members.whatsapp_number === 'null'
            ? item.members.phone_number
            : item.members.whatsapp_number

        let paymentStatus = item.receipt_path !== 'null' ? 'PAID' : 'UNPAID'

        data = {
          order_id: item.id,
          store_name: item.store.store_name,
          date_order: formatDate(orderDate),
          costumer_id: item.members.id,
          costumer_name: item.members.full_name,
          phone_number: phoneNumber,
          item_name: item.m_order_details[0].item.item_name,
          installation_type: item.m_order_details[0].item.category_name,
          payment_status: paymentStatus,
          order_status: item.status.category,
        }

        return data
      })

      return orderData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await ViewOrder()
      setOrderData(data)
    }

    fetchData()
  }, [dateFrom, dateTo, searchFilter])

  return (
    <section id='view-work-order-vendor'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
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
            dataSource={orderData}
            rowKey={(record) => record.order_id}
            scroll={{x: 1800}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewWorkVendor}
