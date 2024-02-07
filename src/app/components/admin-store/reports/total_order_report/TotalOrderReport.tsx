/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './TotalOrderReport.css'

import axios from 'axios'
import {Table, PaginationProps} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Button} from 'react-bootstrap'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
  statusName: string
}

interface DataType {
  order_id: number
  date_order: Date
  costumer_name: string
  phone_number: number
  email: string
  address: string
  service_name: string
  quantity: number
  harga: number
  grand_total: number
}

const TotalOrderReportStore: React.FC<Props> = ({className, statusName}) => {
  const apiUrl = process.env.REACT_APP_API_URL

  const staffStoreId = localStorage.getItem('storeId') as any
  const staffStoreName = localStorage.getItem('storeName') as string

  const [orderData, setOrderData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalOrder, setTotalOrder] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')

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
      align: 'left',
      width: 110,
      sorter: (a, b) => new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
    },
    {
      title: 'Nama Costumer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'No Telepon',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'left',
      width: 130,
      sorter: (a, b) => a.phone_number - b.phone_number,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'left',
      width: 170,
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
      width: 170,
      onFilter: (value, record) => record.service_name.includes(String(value)),
      sorter: (a, b) => a.service_name.length - b.service_name.length,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 90,
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

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchOrderList = async (page: number, pageSize: number) => {
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
          ? `${apiUrl}/orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&store_id=${staffStoreId}&page=${page}&take=${pageSize}`
          : `${apiUrl}/orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&store_id=${staffStoreId}&page=${page}&take=${pageSize}&status=${statusId}`

      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response?.data?.takeTotal) {
        setTotalOrder(response.data.takeTotal)
      }

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewOrder = async (page: number, pageSize: number) => {
    try {
      const apiData = await fetchOrderList(page, pageSize)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const orderData = apiData.map((item: any) => {
        let data

        const orderDate = new Date(item.request_survey)

        const price = parseInt(item.m_order_details[0]?.unit_price ?? 0, 10)
        const formattedUnitPrice = `Rp. ${price.toLocaleString('id')}`

        const quantity = parseInt(item.m_order_details[0]?.quantity ?? 0, 10)

        const grandTotalPrice = parseInt(item.grand_total)
        const formattedGrandTotal = `Rp. ${grandTotalPrice.toLocaleString('id')}`

        data = {
          order_id: item.id,
          date_order: formatDate(orderDate),
          costumer_name: item.members.full_name,
          phone_number: item.project_number,
          email: item.members.email,
          address: item.project_address,
          service_name: item.m_order_details[0]?.item?.service_name ?? '-',
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

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewOrder(page, pageSize)
    setOrderData(data)
  }

  useEffect(() => {
    fetchData(1, 10)
  }, [dateFrom, dateTo])

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
                  format={'DD-MM-YYYY'}
                  className='date-range ms-3'
                  onChange={(values) => {
                    if (values && values.length === 2) {
                      const dateFromFormatted = values[0]?.format('DD-MM-YYYY')
                      const dateToFormatted = values[1]?.format('DD-MM-YYYY')

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
            pagination={{
              position: ['bottomRight'],
              current: currentPage,
              total: totalOrder,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50, 100],
              onChange: (page, pageSize) => {
                fetchData(page, pageSize)
              },
              itemRender: itemRender,
              showTotal: (total, range) => (
                <span style={{left: 0, position: 'absolute'}}>
                  Showing {range[0]} - {range[1]} of {total} Order
                </span>
              ),
            }}
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
