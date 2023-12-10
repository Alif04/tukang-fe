/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './TotalOrderReport.css'

import axios from 'axios'
import {Table, Tag} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Button} from 'react-bootstrap'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
  statusName: string
}

const TotalOrderReportStore: React.FC<Props> = ({className, statusName}) => {
  const apiUrl = process.env.REACT_APP_API_URL

  const staffStoreId = localStorage.getItem('storeId') as any
  const staffStoreName = localStorage.getItem('storeName') as string

  const [totalOrder, setTotalOrder] = useState<number>(0)
  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')

  interface DataType {
    order_id: number
    date_order: string
    costumer_name: string
    phone_number: number
    email: string
    address: string
    service_name: string
    quantity: number
    harga: number
    grand_total: number
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 110,
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 130,
      onFilter: (value, record) => record.date_order.includes(String(value)),
      sorter: (a, b) => a.date_order.length - b.date_order.length,
    },
    {
      title: 'Nama Costumer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 150,
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'No Telepon',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'center',
      width: 110,
      sorter: (a, b) => a.phone_number - b.phone_number,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'left',
      width: 150,
      onFilter: (value, record) => record.email.includes(String(value)),
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: 'Alamat',
      dataIndex: 'address',
      key: 'address',
      align: 'left',
      width: 150,
      onFilter: (value, record) => record.address.includes(String(value)),
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: 'Nama Pemasangan',
      dataIndex: 'service_name',
      key: 'service_name',
      align: 'left',
      width: 160,
      onFilter: (value, record) => record.service_name.includes(String(value)),
      sorter: (a, b) => a.service_name.length - b.service_name.length,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 100,
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Harga',
      dataIndex: 'harga',
      key: 'harga',
      align: 'center',
      width: 135,
      sorter: (a, b) => a.harga - b.harga,
    },
    {
      title: 'Grand Total',
      dataIndex: 'grand_total',
      key: 'grand_total',
      align: 'center',
      width: 135,
      sorter: (a, b) => a.grand_total - b.grand_total,
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
      const statusData = storedStatus ? JSON.parse(storedStatus) : []

      const desiredStatus = statusData.find((status: any) => status.category === statusName)

      let statusId = ''

      if (desiredStatus) {
        statusId = desiredStatus.value
      }

      const url =
        statusName === ''
          ? `${apiUrl}/orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&take=0`
          : `${apiUrl}/orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&take=0&status=${statusId}`

      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response?.data?.total) {
        setTotalOrder(response.data.total)
      }

      return response.data.data
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

        const price = parseInt(item.m_order_details[0].unit_price, 10)
        const formattedUnitPrice = `Rp. ${price.toLocaleString('id')}`

        const quantity = parseInt(item.m_order_details[0].quantity, 10)

        const grandTotalPrice = price * quantity
        const formattedGrandTotal = `Rp. ${grandTotalPrice.toLocaleString('id')}`

        let phoneNumber =
          item.members.whatsapp_number === 'null'
            ? item.members.phone_number
            : item.members.whatsapp_number

        data = {
          order_id: item.id,
          date_order: formatDate(orderDate),
          costumer_name: item.members.full_name,
          phone_number: phoneNumber,
          email: item.members.email,
          address: item.project_address,
          service_name: item.m_order_details[0].item.service_name,
          quantity: quantity,
          harga: formattedUnitPrice,
          grand_total: formattedGrandTotal,
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
  }, [dateFrom, dateTo])

  return (
    <section id='total-order-report'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={8} xxl={8} className='d-flex align-items-center mb-2'>
              <div className='fw-bold mb-5'>
                Nama Toko
                <span className='fs-6 ms-2 pt-2 pb-2 fw-normal bg-secondary'>{staffStoreName}</span>
              </div>

              <div className='d-flex align-items-center ms-5 me-3 mb-2'>
                <h3 className='fs-6 fw-normal'>Periode : </h3>
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
              </div>
            </Col>

            <Col
              xs={12}
              md={12}
              lg={12}
              xl={4}
              xxl={4}
              className='d-flex align-items-center justify-content-end'
            >
              <div className='fs-1 fw-bolder text-uppercase'>Total Order : {totalOrder}</div>
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={orderData}
            rowKey={(record) => record.order_id}
            // scroll={{x: 1800}}
            pagination={{position: ['bottomRight']}}
          />

          <div className='d-flex justify-content-center align-items-center mt-5'>
            <Button
              variant='dark-gray'
              className='d-flex justify-content-center align-items-center'
              type='submit'
            >
              Print Report
            </Button>

            <Button
              variant='dark-success'
              className='d-flex justify-content-center align-items-center'
              type='submit'
            >
              Email Report
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {TotalOrderReportStore}
