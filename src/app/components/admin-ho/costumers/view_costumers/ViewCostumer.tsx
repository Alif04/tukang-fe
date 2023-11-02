/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ViewCostumer.css'

import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {Table, DatePicker} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faFilter, faSearch} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

const ViewCostumerHO: React.FC<Props> = ({className}) => {
  const navigate = useNavigate()

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    // nama_toko: string
    costumer_id: number
    full_name: string
    phone_number: number
    email_address: string
    customer_since: string
    // total_services: number
    // total_spend: number
    // total_complaint: number
    // total_cis_score: number
    // status: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'No Member',
      dataIndex: 'costumer_id',
      key: 'costumer_id',
      align: 'center',
      sorter: (a, b) => a.costumer_id - b.costumer_id,
    },
    {
      title: 'Nama Costumer',
      dataIndex: 'full_name',
      key: 'full_name',
      onFilter: (value, record) => record.full_name.includes(String(value)),
      sorter: (a, b) => a.full_name.length - b.full_name.length,
    },
    {
      title: 'Nomor HP/WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      sorter: (a, b) => a.phone_number - b.phone_number,
    },
    {
      title: 'Email Address',
      dataIndex: 'email_address',
      key: 'email_address',
      onFilter: (value, record) => record.email_address.includes(String(value)),
      sorter: (a, b) => a.email_address.length - b.email_address.length,
    },
    {
      title: 'Join Date',
      dataIndex: 'customer_since',
      key: 'customer_since',
      align: 'center',
      onFilter: (value, record) => record.customer_since.includes(String(value)),
      sorter: (a, b) => a.customer_since.length - b.customer_since.length,
    },
    // {
    //   title: 'Total Invoice',
    //   dataIndex: 'total_services',
    //   key: 'total_services',
    //   align: 'center',
    //   width: 140,
    //   sorter: (a, b) => a.total_services - b.total_services,
    // },
    // {
    //   title: 'Total Value',
    //   dataIndex: 'total_spend',
    //   key: 'total_spend',
    //   width: 160,
    //   sorter: (a, b) => a.total_spend - b.total_spend,
    // },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: 140,
    // },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (record) => {
        const handleDetail = () => {
          const id = record.costumer_id
          navigate(`/costumers/detail-costumers/${id}`)
        }

        return (
          <div className='d-flex justify-content-center '>
            <a className='button-detail' onClick={handleDetail}>
              <FontAwesomeIcon icon={faBook} size='sm' />
            </a>
          </div>
        )
      },
    },
  ]

  // Fetch Data Complaint
  const [memberData, setMemberData] = useState<DataType[]>([])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchMemberList = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL

      const response = await axios.get(
        `${apiUrl}/member?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )
      return response.data.data.member
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewMember = async () => {
    try {
      const apiData = await fetchMemberList()

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const memberData = apiData.map((item: any) => {
        let data

        const joinDate = new Date(item.join_date)

        let phoneNumber = item.phone_number !== 'null' ? item.phone_number : item.whatsapp_number

        data = {
          costumer_id: item.id,
          full_name: item.full_name,
          phone_number: phoneNumber,
          email_address: item.email,
          customer_since: formatDate(joinDate),
        }

        return data
      })

      return memberData
    } catch (error) {
      console.error('Error getting member list data:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await ViewMember()
      setMemberData(data)
    }

    fetchData()
  }, [dateFrom, dateTo, searchFilter])

  return (
    <section id='view-costumer'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-member'>
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
            dataSource={memberData}
            rowKey={(record) => record.costumer_id}
            // scroll={{x: 1700}}
            pagination={{position: ['bottomCenter']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewCostumerHO}
