/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ViewCSI.css'

import axios from 'axios'
import {Table, Tag, PaginationProps} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch, faFilter} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
}

const ViewCSIHO: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [orderData, setOrderData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    order_id: number
    store_name: string
    vendor_name: string
    member_id: number
    member_name: string
    member_email: string
    performance_rate: string
    delivery_rate: string
    invoicing_rate: string
    cs_rate: string
    knowledge_rate: string
    notes: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 90,
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.order_id - b.order_id,
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
      title: 'Nama Vendor',
      dataIndex: 'vendor_name',
      key: 'vendor_name',
      align: 'center',
      width: 120,
      onFilter: (value, record) => record.vendor_name.includes(String(value)),
      sorter: (a, b) => a.vendor_name.length - b.vendor_name.length,
    },
    {
      title: 'No Member',
      dataIndex: 'member_id',
      key: 'member_id',
      align: 'center',
      width: 110,
      sorter: (a, b) => a.member_id - b.member_id,
    },
    {
      title: 'Nama Member',
      dataIndex: 'member_name',
      key: 'member_name',
      align: 'left',
      width: 130,
      onFilter: (value, record) => record.member_name.includes(String(value)),
      sorter: (a, b) => a.member_name.length - b.member_name.length,
    },
    {
      title: 'Email Member',
      dataIndex: 'member_email',
      key: 'member_email',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.member_email.includes(String(value)),
      sorter: (a, b) => a.member_email.length - b.member_email.length,
    },
    {
      title: 'Performance Rate',
      dataIndex: 'performance_rate',
      key: 'performance_rate',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.performance_rate.includes(String(value)),
      sorter: (a, b) => a.performance_rate.length - b.performance_rate.length,
    },
    {
      title: 'Delivery Rate',
      dataIndex: 'delivery_rate',
      key: 'delivery_rate',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.delivery_rate.includes(String(value)),
      sorter: (a, b) => a.delivery_rate.length - b.delivery_rate.length,
    },
    {
      title: 'Invoicing Rate',
      dataIndex: 'invoicing_rate',
      key: 'invoicing_rate',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.invoicing_rate.includes(String(value)),
      sorter: (a, b) => a.invoicing_rate.length - b.invoicing_rate.length,
    },
    {
      title: 'Customer Service Rate',
      dataIndex: 'cs_rate',
      key: 'cs_rate',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.cs_rate.includes(String(value)),
      sorter: (a, b) => a.cs_rate.length - b.cs_rate.length,
    },
    {
      title: 'Knowledge Rate',
      dataIndex: 'knowledge_rate',
      key: 'knowledge_rate',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.knowledge_rate.includes(String(value)),
      sorter: (a, b) => a.knowledge_rate.length - b.knowledge_rate.length,
    },
    {
      title: 'Catatan Tambahan',
      dataIndex: 'notes',
      key: 'notes',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.notes.includes(String(value)),
      sorter: (a, b) => a.notes.length - b.notes.length,
    },
  ]

  const getCSI = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get(
        `${apiUrl}/csi/get/spreadsheet?search=${searchFilter}&date_from=${dateFrom}&date_to=${dateTo}&page=${page}&take=${pageSize}`,
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

  const ViewCSI = async (page: number, pageSize: number) => {
    try {
      const apiData = await getCSI(page, pageSize)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const csiData = apiData.map((item: any) => {
        let data

        data = {
          order_id: item['Member Id'],
          store_name: item['Nama Toko'],
          vendor_name: item['Nama Vendor'],
          member_id: item['Member Id'],
          member_name: item['Nama Member'],
          member_email: item['Email Adress Pemberi Jawaban'],
          performance_rate: item['Performance Rate'],
          delivery_rate: item['Delivery Rate'],
          invoicing_rate: item['Invoicing Rate'],
          cs_rate: item['Customer Service Rate'],
          knowledge_rate: item['Knowledge Rate'],
          notes: item['Catatan Tambahan'],
        }

        return data
      })

      return csiData
    } catch (error) {
      console.error('Error getting csi list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewCSI(page, pageSize)
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

  return (
    <section id='view-csi'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
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
            dataSource={orderData}
            rowKey={(record) => record.order_id}
            scroll={{x: 1600}}
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
                  Showing {range[0]} - {range[1]} of {total} List CSI
                </span>
              ),
            }}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewCSIHO}
