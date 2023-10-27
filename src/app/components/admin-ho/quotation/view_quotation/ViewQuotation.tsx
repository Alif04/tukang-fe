/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ViewQuotation.css'

import axios from 'axios'
import {Table, Tag, DatePicker} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faTrash, faFilter, faSearch, faPlus} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

// const data: DataType[] = [
//   {
//     key: '1',
//     order_id: '78453992',
//     date_order: '10/2/2023',
//     product_name: 'Water Heater',
//     installation_type: 'New set up',
//     costumer_id: '8986747',
//     costumer_name: 'Alia',
//     quotation_id: '12877450',
//     vendor_name: 'PT.ABC',
//     amount: '500.000',
//     payment_status: 'NONE',
//     order_status: 'QUOTEIN',
//   },
//   {
//     key: '2',
//     order_id: '78453993',
//     date_order: '10/2/2023',
//     product_name: 'Water Heater',
//     installation_type: 'New set up',
//     costumer_id: '8986747',
//     costumer_name: 'Alia',
//     quotation_id: '12877450',
//     vendor_name: 'PT.ABC',
//     amount: '500.000',
//     payment_status: 'NONE',
//     order_status: 'QUOTEIN',
//   },
//   {
//     key: '3',
//     order_id: '78453994',
//     date_order: '10/2/2023',
//     product_name: 'Water Heater',
//     installation_type: 'New set up',
//     costumer_id: '8986747',
//     costumer_name: 'Alia',
//     quotation_id: '12877450',
//     vendor_name: 'PT.ABC',
//     amount: '500.000',
//     payment_status: 'NONE',
//     order_status: 'QUOTEIN',
//   },
//   {
//     key: '4',
//     order_id: '78453995',
//     date_order: '10/2/2023',
//     product_name: 'Water Heater',
//     installation_type: 'New set up',
//     costumer_id: '8986747',
//     costumer_name: 'Alia',
//     quotation_id: '12877450',
//     vendor_name: 'PT.ABC',
//     amount: '500.000',
//     payment_status: 'NONE',
//     order_status: 'QUOTEIN',
//   },
//   {
//     key: '5',
//     order_id: '78453996',
//     date_order: '10/2/2023',
//     product_name: 'Water Heater',
//     installation_type: 'New set up',
//     costumer_id: '8986747',
//     costumer_name: 'Alia',
//     quotation_id: '12877450',
//     vendor_name: 'PT.ABC',
//     amount: '500.000',
//     payment_status: 'NONE',
//     order_status: 'QUOTEIN',
//   },
//   {
//     key: '6',
//     order_id: '78453997',
//     date_order: '10/2/2023',
//     product_name: 'Water Heater',
//     installation_type: 'New set up',
//     costumer_id: '8986747',
//     costumer_name: 'Alia',
//     quotation_id: '12877450',
//     vendor_name: 'PT.ABC',
//     amount: '500.000',
//     payment_status: 'NONE',
//     order_status: 'QUOTEIN',
//   },
//   {
//     key: '7',
//     order_id: '78453998',
//     date_order: '10/2/2023',
//     product_name: 'Water Heater',
//     installation_type: 'New set up',
//     costumer_id: '8986747',
//     costumer_name: 'Alia',
//     quotation_id: '12877450',
//     vendor_name: 'PT.ABC',
//     amount: '500.000',
//     payment_status: 'NONE',
//     order_status: 'QUOTEIN',
//   },
// ]

const ViewQuotationHO: React.FC<Props> = ({className}) => {
  const navigate = useNavigate()

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    key: React.Key
    quotation_id: number
    store_name: string
    order_id: number
    date_order: string
    costumer_name: string
    vendor_name: string
    payment_status: string
    order_status: string
    quotation_status: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Quotation ID',
      dataIndex: 'quotation_id',
      key: 'quotation_id',
      align: 'center',
      width: 100,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.quotation_id - b.quotation_id,
    },
    {
      title: 'Nama Store',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      width: 100,
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 100,
      className: 'col_order_id',
      sorter: (a, b) => a.order_id - b.order_id,
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
      title: 'Costumer Name',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'Nama Vendor',
      dataIndex: 'vendor_name',
      key: 'vendor_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.vendor_name.includes(String(value)),
      sorter: (a, b) => a.vendor_name.length - b.vendor_name.length,
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      align: 'left',
      width: 140,
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
          case 'SURVEYDONE':
            color = 'green'
            break
          case 'RESURVEYDONE':
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
    {
      title: 'Quotation Status',
      dataIndex: 'quotation_status',
      key: 'quotation_status',
      align: 'left',
      width: 140,
      render: (quotation_status) => {
        const orderStatus = quotation_status
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
      onFilter: (value, record) => record.quotation_status.includes(String(value)),
      sorter: (a, b) => a.quotation_status.length - b.quotation_status.length,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 90,
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
      const apiUrl = process.env.REACT_APP_API_URL

      const storedStatus = sessionStorage.getItem('statusData')
      const statusData = storedStatus ? JSON.parse(storedStatus) : []

      const desiredStatusName = 'SURVEYDONE'
      const desiredStatus = statusData.find((status: any) => status.category === desiredStatusName)

      if (desiredStatus) {
        const statusId = desiredStatus.value

        const response = await axios.get(
          `${apiUrl}/orders?date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&take=0&status=${statusId}`,
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

        let paymentStatus = item.receipt_path === 'null' ? 'UNPAID' : 'PAID'

        data = {
          quotation_id: item.id,
          store_name: item.store.store_name,
          order_id: item.id,
          date_order: formatDate(orderDate),
          costumer_name: item.members.full_name,
          vendor_name: item.vendor.vendor_name,
          payment_status: paymentStatus,
          order_status: item.status.category,
          quotation_status: item.status.category,
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
    <section id='view-quotation'>
      <div className={`card ${className}`}>
        <div className='card-body'>
          <Row className='table-head-wrapper'>
            <Col xxl={4} xl={4} lg={4} md={4} sm={12} className='d-flex mb-2'>
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

            <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control placeholder='Filter' className='filter-ltr' />
                </InputGroup>
              </div>
            </Col>

            <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
              <div className='select-filter'>
                <select className='form-select filter filter-one'>
                  <option selected>All Store</option>
                  <option value='1'>Mitra 10 - BSD</option>
                  <option value='2'>Mitra 10 - Depok</option>
                  <option value='3'>Mitra 10 - Fatmawati</option>
                </select>

                <select className='form-select filter filter-two'>
                  <option selected>All Vendor</option>
                  <option value='1'>Vendor A</option>
                  <option value='2'>Vendor B</option>
                  <option value='3'>Vendor C</option>
                </select>

                <select className='form-select filter filter-four'>
                  <option selected>All Quotation Status</option>
                  <option value='1'>PENDING</option>
                  <option value='2'>PAID</option>
                </select>
              </div>
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={orderData}
            rowKey={(record) => record.key}
            scroll={{x: 1800}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewQuotationHO}
