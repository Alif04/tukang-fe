/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './WarrantyClaimList.css'

import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {Table, Tag, PaginationProps} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTicket, faSearch, faFilter} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
}

const WarrantyClaimList: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const userStore = localStorage.getItem('storeId')
  const userRole = localStorage.getItem('userRole')
  const navigate = useNavigate()

  const [claimWarrantyData, setclaimWarrantyData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(1)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    key: string
    order_id: number
    date_order: Date
    no_member: number
    costumer_name: string
    phone_number: number
    services_name: string
    status_order: string
    tanggal_aktif_garansi: string
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
      title: 'Order Date',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 100,
      sorter: (a, b) => new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
    },
    {
      title: 'No Member',
      dataIndex: 'no_member',
      key: 'no_member',
      align: 'center',
      width: 110,
      sorter: (a, b) => a.no_member - b.no_member,
    },
    {
      title: 'Nama Customer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'No. Telp / WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'left',
      width: 120,
      sorter: (a, b) => a.phone_number - b.phone_number,
    },
    {
      title: 'Nama Jasa Pemasangan',
      dataIndex: 'services_name',
      key: 'services_name',
      align: 'left',
      width: 180,
      onFilter: (value, record) => record.services_name.includes(String(value)),
      sorter: (a, b) => a.services_name.length - b.services_name.length,
    },
    {
      title: 'Status Order',
      dataIndex: 'status_order',
      key: 'status_order',
      align: 'left',
      width: 110,
      render: (status_order) => {
        const orderStatus = status_order
        let color = ''

        switch (orderStatus) {
          case 'UNPAID':
            color = 'red'
            break
          case 'PAID':
            color = 'green'
            break
          case 'PICKLIST':
            color = 'green'
            break
          case 'BOOKED':
            color = 'lime'
            break
          case 'SURVEYREQ':
            color = 'blue'
            break
          case 'SURVEYSTART':
            color = 'blue'
            break
          case 'SURVEYDONE':
            color = 'blue'
            break
          case 'RESURVEYREQ':
            color = 'blue'
            break
          case 'RESURVEYSTART':
            color = 'blue'
            break
          case 'RESURVEYDONE':
            color = 'blue'
            break
          case 'QUOTE IN':
            color = 'blue'
            break
          case 'QUOTE OUT':
            color = 'blue'
            break
          case 'WORKREQ':
            color = 'blue'
            break
          case 'WORKSTART':
            color = 'blue'
            break
          case 'WIP':
            color = 'blue'
            break
          case 'WORKEND':
            color = 'blue'
            break
          case 'INVOICED':
            color = 'blue'
            break
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
        {text: 'PICKLIST', value: 'PICKLIST'},
        {text: 'BOOKED', value: 'BOOKED'},
        {text: 'SURVEYREQ', value: 'SURVEYREQ'},
        {text: 'SURVEYSTART', value: 'SURVEYSTART'},
        {text: 'SURVEYDONE', value: 'SURVEYDONE'},
        {text: 'RESURVEYREQ', value: 'RESURVEYREQ'},
        {text: 'RESURVEYSTART', value: 'RESURVEYSTART'},
        {text: 'RESURVEYDONE', value: 'RESURVEYDONE'},
        {text: 'WORKREQ', value: 'WORKREQ'},
        {text: 'WORKSTART', value: 'WORKSTART'},
        {text: 'WIP', value: 'WIP'},
        {text: 'WORKEND', value: 'WORKEND'},
        {text: 'QUOTEIN', value: 'QUOTEIN'},
        {text: 'QUOTEOUT', value: 'QUOTEOUT'},
        {text: 'CISOUT', value: 'CISOUT'},
        {text: 'INVOICED', value: 'INVOICED'},
      ],
      onFilter: (value, record) => record.status_order.includes(String(value)),
      sorter: (a, b) => a.status_order.length - b.status_order.length,
    },
    {
      title: 'Tanggal Aktif Garansi',
      dataIndex: 'tanggal_aktif_garansi',
      key: 'tanggal_aktif_garansi',
      align: 'left',
      width: 140,
      sorter: (a, b) => a.tanggal_aktif_garansi.length - b.tanggal_aktif_garansi.length,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (record) => {
        const handleDetailId = () => {
          const id = record.order_id
          navigate(`/warranty/claim-warranty-form/${id}`)
        }

        return (
          <div className='button-wrapper d-flex justify-content-center'>
            <a className='button-new-claim-garansi-form' onClick={handleDetailId}>
              <FontAwesomeIcon icon={faTicket} size='sm' />
            </a>
          </div>
        )
      },
      fixed: 'right',
      width: 50,
    },
  ]

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchOrderList = async (page: number, pageSize: number) => {
    const url =
      userRole !== 'Tukang'
        ? `${apiUrl}/orders?date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&store_id=${userStore}&page=${page}&take=${pageSize}`
        : `${apiUrl}/orders?date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&page=${page}&take=${pageSize}`

    try {
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setCurrentPage(response.data.page)
      setTotalData(response?.data?.data.length ?? 0)

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

      const claimWarrantyData = apiData.map((item: any) => {
        let data
        const orderDate = new Date(item.created_at)

        let phoneNumber =
          item.members.phone_number !== 'null'
            ? item.members.phone_number
            : item.members.whatsapp_number

        data = {
          order_id: item.id,
          date_order: formatDate(orderDate),
          no_member: item.members.member_number,
          costumer_name: item.members.full_name,
          phone_number: phoneNumber,
          services_name: item?.m_order_details[0]?.item?.service_name ?? '-',
          status_order: item.status.category,
        }

        return data
      })

      return claimWarrantyData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewOrder(page, pageSize)
    setclaimWarrantyData(data)
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
    <section id='warranty-claim-list'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
              <div className='d-flex align-items-center me-3'>
                <FontAwesomeIcon icon={faFilter} size='2xl' className='me-2' />
                <h3 className='date-text'>Date : </h3>
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
              />{' '}
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
            dataSource={claimWarrantyData}
            rowKey={(record) => record.key}
            // scroll={{x: 1800}}
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
                  Showing {range[0]} - {range[1]} of {total} Claim Garansi
                </span>
              ),
            }}
          />
        </div>
      </div>
    </section>
  )
}

export {WarrantyClaimList}
