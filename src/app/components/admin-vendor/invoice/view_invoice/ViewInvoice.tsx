/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ViewInvoice.css'

import axios from 'axios'
import {Table, Tag, DatePicker} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faPen,
  faTrash,
  faFileExcel,
  faSearch,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

const ViewInvoiceVendor: React.FC<Props> = ({className}) => {
  const navigate = useNavigate()

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    order_id: number
    invoice_id: number
    date_order: string
    // product_name: string
    // installation_type: string
    quotation_id: number
    payment_status: string
    member_id: number
    vendor_name: string
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
      title: 'Date Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.date_order.includes(String(value)),
      sorter: (a, b) => a.date_order.length - b.date_order.length,
    },
    // {
    //   title: 'Product Name',
    //   dataIndex: 'product_name',
    //   key: 'product_name',
    //   align: 'center',
    //   width: 110,
    //   onFilter: (value, record) => record.product_name.includes(String(value)),
    //   sorter: (a, b) => a.product_name.length - b.product_name.length,
    // },
    // {
    //   title: 'Installation Type',
    //   dataIndex: 'installation_type',
    //   key: 'installation_type',
    //   align: 'center',
    //   width: 110,
    //   onFilter: (value, record) => record.installation_type.includes(String(value)),
    //   sorter: (a, b) => a.installation_type.length - b.installation_type.length,
    // },
    {
      title: 'Quotation ID',
      dataIndex: 'quotation_id',
      key: 'quotation_id',
      align: 'left',
      width: 110,
      sorter: (a, b) => a.quotation_id - b.quotation_id,
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
      title: 'Costumer ID',
      dataIndex: 'member_id',
      key: 'member_id',
      align: 'left',
      width: 140,
      sorter: (a, b) => a.member_id - b.member_id,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendor_name',
      key: 'vendor_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.vendor_name.includes(String(value)),
      sorter: (a, b) => a.vendor_name.length - b.vendor_name.length,
    },
    {
      title: 'Order Status',
      dataIndex: 'order_status',
      key: 'order_status',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.order_status.includes(String(value)),
      sorter: (a, b) => a.order_status.length - b.order_status.length,
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
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 70,
      render: (record) => {
        const handleDelete = () => {}

        const handleDetailId = () => {
          const id = record.invoice_id
          navigate(`/invoice/detail-invoice/${id}`)
        }

        const handleUpdateId = () => {
          const id = record.invoice_id
          navigate(`/invoice/update-invoice/${id}`)
        }

        const handleAddInvoice = () => {
          navigate('/invoice/new-invoice')
        }

        return (
          <div className='button-wrapper'>
            <a className='button-delete' onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} size='sm' />
            </a>

            <a className='button-detail' onClick={handleDetailId}>
              <FontAwesomeIcon icon={faBook} size='sm' />
            </a>

            <a className='button-edit' onClick={handleUpdateId}>
              <FontAwesomeIcon icon={faPen} size='sm' />
            </a>

            <a className='button-add' onClick={handleUpdateId}>
              <FontAwesomeIcon icon={faPlus} size='sm' />
            </a>
          </div>
        )
      },
    },
  ]

  const [invoiceData, setInvoiceData] = useState<DataType[]>([])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchInvoiceList = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL

      const response = await axios.get(`${apiUrl}/invoices`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewInvoice = async () => {
    try {
      const apiData = await fetchInvoiceList()

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const invoiceData = apiData.map((item: any) => {
        let data

        const orderDate = new Date(item.order.created_at)
        let paymentStatus = item.receipt_path === 'null' ? 'UNPAID' : 'PAID'

        data = {
          order_id: item.order_id,
          invoice_id: item.id,
          date_order: orderDate,
          // product_name: string
          // installation_type: string
          // quotation_id: number
          payment_status: paymentStatus,
          member_id: item.order.member_id,
          vendor_name: item.vendor.company_name,
          order_status: item.status.category,
        }

        return data
      })

      return invoiceData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await ViewInvoice()
      setInvoiceData(data)
    }

    fetchData()
  }, [dateFrom, dateTo, searchFilter])

  return (
    <section id='view-invoice'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <Row className='mb-5'>
            <Col xxl={4}></Col>

            <Col xxl={4}>
              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control placeholder='Filter' className='filter-ltr' />
                </InputGroup>
              </div>
            </Col>

            <Col xxl={4} className='d-flex justify-content-end'>
              <button className='button-export '>
                Export To Excel
                <FontAwesomeIcon icon={faFileExcel} size='lg' className='excel-icon' />
              </button>
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={invoiceData}
            rowKey={(record) => record.invoice_id}
            scroll={{x: 1500}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewInvoiceVendor}
