/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import axiosInstance from '../../../../../_metronic/layout/core/axiosInterceptor'
import {useNavigate} from 'react-router-dom'

import './ViewComplaint.css'

import axios from 'axios'
import dayjs from 'dayjs'
import {Table, Tag, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
import type {ColumnsType} from 'antd/es/table'
import {Form, FormGroup, Row, Col, Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faSearch} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface DataType {
  complaint_id: number
  assign_from: string
  order_id: number
  date_order: Date
  no_member: number
  costumer_name: string
  phone_number: number
  service_name: string
  order_status: string
  work_status: string
  complaint_date: Date
  complaint_age: string
  complaint_status: string
}

const ViewComplaintStore: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const userRole = localStorage.getItem('userRole') as string
  const userStore = localStorage.getItem('storeId') as number | null
  const userVendor = localStorage.getItem('vendor_id') as number | null
  const userTukang = localStorage.getItem('tukang_id') as number | null

  const storeId = userStore !== null ? `&store_id=${userStore}` : ''
  const vendorId = userVendor !== null ? `&vendor_id=${userVendor}` : ''
  const tukangId = userTukang !== null ? `&tukang_id=${userTukang}` : ''

  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [dateFrom, setDateFrom] = useState<any>(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])
  const [searchFilter, setSearchFilter] = useState<string>('')

  const [complaintData, setComplaintData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalData, setTotalData] = useState<number>(1)

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const today = new Date()
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const renderTooltip = (title: string) => <Tooltip id='button-tooltip'>{title}</Tooltip>

  const columns: ColumnsType<DataType> = [
    {
      title: 'Complaint ID',
      dataIndex: 'complaint_id',
      key: 'complaint_id',
      align: 'center',
      className: 'text-start',
      width: 'fit-content',
      sorter: (a, b) => a.complaint_id - b.complaint_id,
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      className: 'text-start',
      width: 'fit-content',
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Nama Toko',
      dataIndex: 'assign_from',
      key: 'assign_from',
      align: 'center',
      className: 'text-start',
      width: 'fit-content',
      onFilter: (value, record) => record.assign_from.includes(String(value)),
      sorter: (a, b) => a.assign_from.length - b.assign_from.length,
    },
    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      className: 'text-start',
      width: 'fit-content',
      sorter: (a, b) => new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
    },
    {
      title: 'Nama Customer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      className: 'text-start',
      width: 'fit-content',
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'No. Telp/WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      className: 'text-start',
      width: 'fit-content',
      sorter: (a, b) => a.phone_number - b.phone_number,
    },
    {
      title: 'Nama Jasa Pemasangan',
      dataIndex: 'service_name',
      key: 'service_name',
      className: 'text-start',
      width: 'fit-content',
    },
    {
      title: 'Status Order',
      dataIndex: 'order_status',
      key: 'order_status',
      width: 'fit-content',
      render: (order_status) => {
        const orderStatus = order_status
        let color = ''

        switch (orderStatus) {
          case 'UNPAID':
            color = 'red'
            break
          default:
            color = 'blue'
            break
        }

        return <Tag color={color}>{orderStatus}</Tag>
      },
      onFilter: (value, record) => record.order_status.includes(String(value)),
      sorter: (a, b) => a.order_status.length - b.order_status.length,
      className: 'text-start',
    },
    {
      title: 'Status Pengerjaan',
      dataIndex: 'work_status',
      key: 'work_status',
      className: 'col-complaint-date text-start',
      width: 'fit-content',
      onFilter: (value, record) => record.work_status.includes(String(value)),
      sorter: (a, b) => a.work_status.length - b.work_status.length,
      render: (complaint_status) => {
        const complaintStatus = complaint_status
        let color = ''

        switch (complaintStatus) {
          case 'INVESTIGATED':
            color = 'volcano'
            break
          case 'ACCEPTED':
            color = 'green'
            break
          default:
            color = 'blue'
            break
        }

        return <Tag color={color}>{complaintStatus}</Tag>
      },
    },
    {
      title: 'Tanggal Komplain',
      dataIndex: 'complaint_date',
      key: 'complaint_date',
      width: 'fit-content',
      className: 'col-complaint-date text-start',
      sorter: (a, b) => new Date(a.complaint_date).getTime() - new Date(b.complaint_date).getTime(),
    },
    {
      title: 'Umur Komplain',
      dataIndex: 'complaint_age',
      key: 'complaint_age',
      className: 'col-complaint-date text-start',
      width: 'fit-content',
      onFilter: (value, record) => record.complaint_age.includes(String(value)),
      sorter: (a, b) => a.complaint_age.length - b.complaint_age.length,
    },
    {
      title: 'Status Komplain',
      dataIndex: 'complaint_status',
      key: 'complaint_status',
      className: 'col-complaint-status text-start',
      width: 'fit-content',
      render: (complaint_status) => {
        const complaintStatus = complaint_status
        let color = ''

        switch (complaintStatus) {
          case 'INVESTIGATED':
            color = 'volcano'
            break
          case 'ACCEPTED':
            color = 'green'
            break
          default:
            color = 'blue'
            break
        }

        return <Tag color={color}>{complaintStatus}</Tag>
      },
      onFilter: (value, record) => record.complaint_status.includes(String(value)),
      sorter: (a, b) => a.complaint_status.length - b.complaint_status.length,
    },
    {
      title: 'Action',
      key: 'action',
      width: 'fit-content',
      fixed: 'right',
      render: (record) => {
        const handleDetail = () => {
          const id = record.complaint_id
          navigate(`/complaint/detail-complaint/${id}`)
        }

        const handleEdit = () => {
          const id = record.complaint_id
          navigate(`/complaint/update-complaint/${id}`)
        }

        return (
          <div className='button-wrapper d-flex justify-content-center gap-3'>
            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Detail Komplain')}
            >
              <Button variant='primary' className='button-detail' onClick={handleDetail}>
                <FontAwesomeIcon
                  className='text-white'
                  icon={userRole === 'Tukang' ? faBook : faPen}
                  fontSize={'13px'}
                />
              </Button>
            </OverlayTrigger>

            {/* {!['Tukang'].includes(userRole) && (
              <OverlayTrigger
                placement='bottom'
                delay={{show: 250, hide: 400}}
                overlay={renderTooltip('Edit Komplain')}
              >
                <Button variant='primary' className='button-edit' onClick={handleEdit}>
                  <FontAwesomeIcon className='text-white' icon={faPen} fontSize={'13px'} />
                </Button>
              </OverlayTrigger>
            )} */}
          </div>
        )
      },
    },
  ]

  const fetchComplaintList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/complaints?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&page=${page}&take=${pageSize}${storeId}${vendorId}${tukangId}${queryparams}`

    try {
      const response = await axiosInstance.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setCurrentPage(response.data.page)
      setTotalData(response?.data?.total ?? 0)
      setLoadData(false)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewComplaint = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchComplaintList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const complaintData = apiData.map((item: any) => {
        let data

        const orderDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })

        const complaintDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })

        const phoneNumber = item?.orders?.project_number.startsWith('0')
          ? item?.orders?.project_number
          : `+62${item?.orders?.project_number}`

        const currentDate = new Date()
        const complaintDates = new Date(item?.created_at)

        const timeDifferenceInMilliseconds = Number(currentDate) - Number(complaintDates)
        const timeDifferenceInMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60))
        const timeDifferenceInHours = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60))
        const timeDifferenceInDays = Math.floor(
          timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
        )

        let complaintAge

        if (timeDifferenceInDays >= 1) {
          complaintAge = `${timeDifferenceInDays} Hari`
        } else if (timeDifferenceInHours >= 1) {
          complaintAge = `${timeDifferenceInHours} Jam`
        } else {
          complaintAge = `${timeDifferenceInMinutes} Menit`
        }

        data = {
          complaint_id: item?.id,
          assign_from: item?.orders.store?.store_name,
          order_id: item?.orders?.id,
          date_order: orderDate,
          no_member: item?.orders?.members?.member_number,
          costumer_name: item?.orders?.members?.full_name,
          phone_number: phoneNumber,
          service_name: item.orders?.m_order_details[0]?.item_name ?? '-',
          order_status: item.orders?.status?.description,
          work_status: item?.orders?.work_orders?.work_order_status[0]?.status?.description,
          complaint_date: complaintDate,
          complaint_age: complaintAge,
          complaint_status: item?.status?.description,
        }

        return data
      })

      return complaintData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewComplaint(page, pageSize, queryparams)
    setComplaintData(data)
  }

  useEffect(() => {
    fetchData(1, 10, '')
  }, [])

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubmitFilter()
    }
  }

  const handleSubmitFilter = async () => {
    setLoadingButton(true)
    let queryparams = ``

    const valueCheck = (key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        queryparams += `${key}${value}`
      }
    }

    valueCheck(`&search=`, searchFilter)

    const data = await ViewComplaint(1, 10, queryparams)
    setComplaintData(data)

    setLoadingButton(false)
  }

  return (
    <section id='view-complaint'>
      <div className={`card ${className}`}>
        <div className='card-body'>
          <Row className='table-head-wrapper'>
            <div
              className='d-flex flex-column flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row align-items-start align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center justify-content-start gap-3'
              onKeyDown={handleKeyPress}
            >
              <h3 className='d-flex align-items-center fs-5 fw-normal'>Date</h3>

              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range'
                defaultValue={[
                  dayjs(`${formatDate(today)}`, 'DD-MM-YYYY'),
                  dayjs(`${formatDate(today)}`, 'DD-MM-YYYY'),
                ]}
                onChange={(values) => {
                  if (values && values.length === 2) {
                    const dateFromFormatted = values[0]?.format('YYYY-MM-DD')
                    const dateToFormatted = values[1]?.format('YYYY-MM-DD')

                    setDateFrom(dateFromFormatted)
                    setDateTo(dateToFormatted)
                  } else {
                    setDateFrom(new Date().toISOString().split('T')[0])
                    setDateTo(new Date().toISOString().split('T')[0])
                  }
                }}
              />

              <div className='filter-search'>
                <FormGroup>
                  <Form.Control
                    placeholder='Search'
                    className='filter-ltr'
                    onChange={handleChangeSearchFilter}
                  />

                  <span className='search-icon'>
                    <FontAwesomeIcon icon={faSearch} className='text-black' size='sm' />
                  </span>
                </FormGroup>
              </div>

              <Button
                className='btn-dark-primary button-submit m-0'
                disabled={loadingButton}
                onClick={handleSubmitFilter}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>
            </div>
          </Row>

          <Spin
            tip='Loading...'
            spinning={loadData}
            size='large'
            indicator={<LoadingOutlined style={{fontSize: 24}} spin />}
          >
            <div className='table-custom-wrapper'>
              <Table
                className='table-striped-rows'
                bordered
                columns={columns}
                dataSource={complaintData}
                rowKey={(record) => record.complaint_id}
                pagination={false}
                sticky={true}
                tableLayout='auto'
                scroll={{x: 2000}}
              />
            </div>
          </Spin>

          <div className='pagination-container mt-5'>
            <span className='total-text'>
              Showing {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, totalData)} of {totalData} Pengaduan
            </span>

            <Pagination
              className='pagination'
              current={currentPage}
              total={totalData}
              showSizeChanger
              pageSizeOptions={[5, 10, 20, 50, 100]}
              itemRender={itemRender}
              onShowSizeChange={(current, size) => {
                setPageSize(size)
              }}
              onChange={(page, pageSize) => {
                fetchData(page, pageSize, '')
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export {ViewComplaintStore}
