/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './WarrantyClaimList.css'

import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {Table} from 'antd'
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
  const navigate = useNavigate()

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
    date_order: string
    no_member: number
    costumer_name: string
    phone_number: number
    installer_name: string
    payment_status: string
    tanggal_aktif_garansi: string
  }

  const columns: ColumnsType<DataType> = [
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
      title: 'Order Date',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.date_order.includes(String(value)),
      sorter: (a, b) => a.date_order.length - b.date_order.length,
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
      title: 'Costumer Name',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'No Telp / WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'left',
      width: 140,
      sorter: (a, b) => a.phone_number - b.phone_number,
    },
    // {
    //   title: 'Nama Jasa Pemasangan',
    //   dataIndex: 'installer_name',
    //   key: 'installer_name',
    //   align: 'left',
    //   width: 180,
    // },
    {
      title: 'Status Pembayaran',
      dataIndex: 'payment_status',
      key: 'payment_status',
      align: 'left',
      width: 150,
    },
    {
      title: 'Tanggal Aktif Garansi',
      dataIndex: 'tanggal_aktif_garansi',
      key: 'tanggal_aktif_garansi',
      align: 'left',
      width: 140,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => {
        const handleDetailId = () => {
          const id = record.order_id
          navigate(`/warranty/claim-warranty-form/${id}`)
        }

        return (
          <div className='button-wrapper'>
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

  const [claimWarrantyData, setclaimWarrantyData] = useState<DataType[]>([])

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

      const desiredStatusName = 'BOOK'
      const desiredStatus = statusData.find((status: any) => status.category === desiredStatusName)

      if (desiredStatus) {
        const statusId = desiredStatus.value

        const response = await axios.get(
          `${apiUrl}/orders?date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&take=50&status=${statusId}`,
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
          no_member: item.members.id,
          costumer_name: item.members.full_name,
          phone_number: phoneNumber,
          order_status: item.status.description,
        }

        return data
      })

      return claimWarrantyData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await ViewOrder()
      setclaimWarrantyData(data)
    }

    fetchData()
  }, [dateFrom, dateTo, searchFilter])

  return (
    <section id='warranty-claim-list'>
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
              />{' '}
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
            dataSource={claimWarrantyData}
            rowKey={(record) => record.key}
            scroll={{x: 1500}}
            pagination={{position: ['bottomCenter']}}
          />
        </div>
      </div>
    </section>
  )
}

export {WarrantyClaimList}
