/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ReportInsentif.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import {Table, PaginationProps} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch, faFilter} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
}

const ReportInsentifStore: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL

  const userStore = localStorage.getItem('storeId')
  const userRole = localStorage.getItem('userRole') as any
  const userId = localStorage.getItem('user_id') as any
  const salesId = localStorage.getItem('sales_id') as any

  const [orderData, setOrderData] = useState<DataType[]>([])
  const [totalOrder, setTotalOrder] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
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
    sales_comission: number
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
      align: 'center',
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
    {
      title: 'Sales Comission',
      dataIndex: 'sales_comission',
      key: 'sales_comission',
      align: 'center',
      width: 135,
      sorter: (a, b) => a.sales_comission - b.sales_comission,
    },
  ]

  const formatDate = (date: any) => {
    if (isNaN(date.getTime())) {
      return '-'
    }

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchOrderList = async (page: number, pageSize: number) => {
    try {
      const url =
        userRole === 'Store CS' || userRole === 'Admin HO'
          ? `${apiUrl}/reports/sales-comission?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&store_id=${userStore}&page=${page}&take=${pageSize}`
          : `${apiUrl}/reports/sales-comission?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&sales_id=${salesId}&store_id=${userStore}&page=${page}&take=${pageSize}`

      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response?.data) {
        setTotalOrder(response?.data?.total ?? 0)
        setCurrentPage(response?.data?.page ?? 1)
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

        const orderDate = new Date(item?.created_at)

        const price = parseInt(item.m_order_details[0]?.unit_price ?? 0, 10)
        const formattedUnitPrice = `Rp. ${price.toLocaleString('id')}`

        const quantity = parseInt(item.m_order_details[0]?.quantity ?? 0, 10)

        const grandTotalPrice = parseInt(item.grand_total)
        const formattedGrandTotal = `Rp. ${grandTotalPrice.toLocaleString('id')}`

        const salesComission = parseInt(item.grand_total_comission)
        const formattedSalesComission = `Rp. ${salesComission.toLocaleString('id')}`

        data = {
          order_id: item.id,
          date_order: formatDate(orderDate),
          costumer_name: item?.members?.full_name,
          email: item?.members?.email,
          address: item?.project_address,
          service_name:
            item.payment_type === 'survey'
              ? item.m_order_details[0]?.item_notes
              : item.m_order_details[0]?.item?.service_name ?? '-',
          phone_number: item?.project_number,
          quantity: quantity,
          harga: formattedUnitPrice,
          grand_total: formattedGrandTotal,
          sales_comission: formattedSalesComission,
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

  // Export To Excel
  const exportToExcel = () => {
    if (orderData.length === 0) {
      Swal.fire('Warning', 'Belum ada data yang dapat di export', 'warning')
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(orderData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, 'report_intensif_data.xlsx')
  }

  return (
    <section id='report-insentif'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-report'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
              <div className='d-flex align-items-center me-3'>
                <h3 className='fs-5 fw-normal'>Date : </h3>
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

            <Col xs={12} md={12} lg={12} xl={4} xxl={4}>
              <div className='d-flex justify-content-end'>
                <Button
                  variant='outline-primary'
                  className='d-flex justify-content-center align-items-center'
                  onClick={exportToExcel}
                >
                  Download Report
                </Button>
              </div>
            </Col>
          </Row>

          <div className='total-order'>
            <p className='fs-5'>Total order : {orderData.length}</p>
          </div>

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
        </div>
      </div>
    </section>
  )
}

export {ReportInsentifStore}
