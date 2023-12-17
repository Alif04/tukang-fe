/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ViewRefund.css'

import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faBook, faTrash, faFilter, faSearch} from '@fortawesome/free-solid-svg-icons'

import {Table, DatePicker, Tag} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
}

const ViewRefundCS: React.FC<Props> = ({className}) => {
  const navigate = useNavigate()

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    refund_id: number
    order_id: number
    store_name: string
    date_order: string
    member_id: number
    member_name: string
    phone_number: number
    item_name: string
    nama_jasa: string
    payment_status: string
    order_status: string
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
      title: 'Refund Id',
      dataIndex: 'refund_id',
      key: 'refund_id',
      align: 'center',
      width: 100,
      sorter: (a, b) => a.refund_id - b.refund_id,
    },
    {
      title: 'Nama Toko',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.date_order.includes(String(value)),
      sorter: (a, b) => a.date_order.length - b.date_order.length,
    },
    {
      title: 'Nomor Member',
      dataIndex: 'member_id',
      key: 'member_id',
      align: 'left',
      width: 110,
      sorter: (a, b) => a.member_id - b.member_id,
    },
    {
      title: 'Nama Costumer',
      dataIndex: 'member_name',
      key: 'member_name',
      align: 'left',
      width: 110,
      onFilter: (value, record) => record.member_name.includes(String(value)),
      sorter: (a, b) => a.member_name.length - b.member_name.length,
    },
    {
      title: 'No Telp / WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'center',
      width: 110,
      sorter: (a, b) => a.phone_number - b.phone_number,
    },
    {
      title: 'Item Name',
      dataIndex: 'item_name',
      key: 'item_name',
      align: 'left',
      width: 130,
      onFilter: (value, record) => record.item_name.includes(String(value)),
      sorter: (a, b) => a.item_name.length - b.item_name.length,
    },
    {
      title: 'Nama Jasa Pemasangan',
      dataIndex: 'nama_jasa',
      key: 'nama_jasa',
      align: 'center',
      width: 180,
      onFilter: (value, record) => record.nama_jasa.includes(String(value)),
      sorter: (a, b) => a.nama_jasa.length - b.nama_jasa.length,
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
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 60,
      render: (record) => {
        const handleDetail = () => {
          const id = record.refund_id
          navigate(`/refund/detail-refund/${id}`)
        }

        const handleEdit = () => {
          const id = record.refund_id
          navigate(`/refund/update-refund/${id}`)
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
    },
  ]

  // Fetch Data Complaint
  const [refundData, setRefundData] = useState<DataType[]>([])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchRefundList = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL

      const response = await axios.get(
        `${apiUrl}/refund?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&take=-1`,
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

  const ViewRefund = async () => {
    try {
      const apiData = await fetchRefundList()

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const refundData = apiData.map((item: any) => {
        let data

        const orderDate = new Date(item.orders.created_at)

        let phoneNumber =
          item.orders.members.phone_number !== 'null'
            ? item.orders.members.phone_number
            : item.orders.members.whatsapp_number

        let paymentStatus = item.orders.receipt_path !== 'null' ? 'PAID' : 'UNPAID'

        data = {
          refund_id: item.id,
          order_id: item.order_id,
          store_name: item.orders.store.store_name,
          date_order: formatDate(orderDate),
          member_id: item.orders.members.id,
          member_name: item.orders.members.full_name,
          phone_number: phoneNumber,
          item_name: item.orders.m_order_details[0].item.item_name,
          nama_jasa: item.orders.m_order_details[0].item.category_name,
          payment_status: paymentStatus,
          order_status: item.orders.status.category,
        }

        return data
      })

      return refundData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await ViewRefund()
      setRefundData(data)
    }

    fetchData()
  }, [dateFrom, dateTo, searchFilter])

  return (
    <section id='view-refund'>
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
            dataSource={refundData}
            rowKey={(record) => record.order_id}
            scroll={{x: 2000}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewRefundCS}
