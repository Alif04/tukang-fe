/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import axiosInstance from '../../../../../_metronic/layout/core/axiosInterceptor'
import {useNavigate} from 'react-router-dom'

import './WarrantyClaimList.css'

import axios from 'axios'
import dayjs from 'dayjs'
import type {ColumnsType} from 'antd/es/table'
import {FilterValue} from 'antd/es/table/interface'
import {TableProps} from 'antd/es/table'
import {Table, Tag, PaginationProps, Spin, Pagination, DatePicker, List} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
import {Card, FormGroup, Row, Col, Form, Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTicket, faSearch} from '@fortawesome/free-solid-svg-icons'
import {formatDateWithTime, formatDateWithTimeZone} from '../../../../../_metronic/helpers'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface Status {
  value: number
  category: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
}

interface DataType {
  key: string
  order_id: number
  date_order: Date
  store_name: string
  no_member: number
  receipt_number: string
  costumer_name: string
  email_customer: string
  project_address: string
  phone_number: number
  services_name: string
  status_order: string
  period_active: Date
  countdown_to_expired: Date
  period_expired: Date
  warranty_status: string
  payment_type: string
  order_details: any[]
  work_order_detail: any[]
}

const WarrantyClaimListHO: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const [loadingButton, setLoadingButton] = useState(false)

  const userRole = localStorage.getItem('userRole') as string
  const userStore = localStorage.getItem('storeId')
  const userVendor = localStorage.getItem('vendor_id')
  const userTukang = localStorage.getItem('tukang_id')

  const storeId = ['Store Staff', 'Store CS'].includes(userRole) ? `&store_id=${userStore}` : ''
  const vendorId = ['Owner Vendor', 'Admin Vendor'].includes(userRole)
    ? `&vendor_id=${userVendor}`
    : ''
  const tukangId = ['Tukang'].includes(userRole) ? `&tukang_id=${userTukang}` : ''

  const [claimWarrantyData, setClaimWarrantyData] = useState<DataType[]>([])

  const [loadData, setLoadData] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [filters, setFilters] = useState<Record<string, FilterValue | null>>({})

  const today = new Date()
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Filters
  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }
  const handleFilterChange = (
    pagination: TableProps<DataType>['pagination'],
    filters: Record<string, FilterValue | null>
  ) => {
    setFilters(filters)
  }

  // Status
  const storedStatus = localStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
  const desiredStatus = statusData.filter((status: any) =>
    ['WORKEND', 'DONE'].includes(status.category)
  )
  const statuses = desiredStatus.map((x) => x.value)

  const renderTooltip = (title: string) => <Tooltip id='button-tooltip'>{title}</Tooltip>
  const columns: ColumnsType<DataType> = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      width: 100,
      sorter: (a: DataType, b: DataType) => a.order_id - b.order_id,
    },
    {
      title: 'Nama Toko',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      width: 110,
      sorter: (a: DataType, b: DataType) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 120,
      sorter: (a: DataType, b: DataType) =>
        new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
    },
    {
      title: 'No Member',
      dataIndex: 'no_member',
      key: 'no_member',
      align: 'center',
      width: 120,
      sorter: (a: DataType, b: DataType) => a.no_member - b.no_member,
    },
    {
      title: 'Nama Customer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 120,
      sorter: (a: DataType, b: DataType) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'No. Telp / WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'left',
      width: 120,
      sorter: (a: DataType, b: DataType) => a.phone_number - b.phone_number,
    },
    {
      title: 'Status Order',
      dataIndex: 'status_order',
      key: 'status_order',
      align: 'left',
      width: 120,
      render: (status_order: string) => {
        const orderStatus = status_order
        let color = ''

        switch (orderStatus) {
          case 'WARRANTYCLAIM':
            color = 'red'
            break
          default:
            color = 'blue'
            break
        }

        return <Tag color={color}>{orderStatus}</Tag>
      },
    },
    {
      title: 'Tanggal Aktif Garansi',
      dataIndex: 'period_active',
      key: 'period_active',
      align: 'left',
      width: 120,
      sorter: (a: DataType, b: DataType) =>
        new Date(a.period_active).getTime() - new Date(b.period_active).getTime(),
    },
    {
      title: 'Umur Masa Garansi',
      dataIndex: 'countdown_to_expired',
      key: 'countdown_to_expired',
      align: 'left',
      width: 120,
      sorter: (a: DataType, b: DataType) =>
        new Date(a.countdown_to_expired).getTime() - new Date(b.countdown_to_expired).getTime(),
    },
    {
      title: 'Tanggal Berakhir Garansi',
      dataIndex: 'period_expired',
      key: 'period_expired',
      align: 'left',
      width: 120,
      sorter: (a: DataType, b: DataType) =>
        new Date(a.period_expired).getTime() - new Date(b.period_expired).getTime(),
    },
    {
      title: 'Status Garansi',
      dataIndex: 'warranty_status',
      key: 'warranty_status',
      align: 'left',
      width: 120,
      filters: [
        {text: 'Garansi Aktif', value: 'is_active_warranty=1'},
        {text: 'Garansi Terpakai', value: 'is_used_warranty=1'},
        {text: 'Garansi Expired', value: 'is_expired_warranty=1'},
      ],
    },
    !['Tukang', 'Owner Vendor', 'Admin Vendor'].includes(userRole) && {
      title: 'Action',
      key: 'action',
      align: 'center',
      width: 110,
      render: (record: DataType) => {
        const id = record.order_id

        const handleDetailId = () => {
          navigate(`/warranty/claim-warranty-form/${id}`)
        }

        return (
          <>
            {!['Garansi Expired'].includes(record.warranty_status) && (
              <div className='button-wrapper d-flex justify-content-center gap-3'>
                <OverlayTrigger
                  placement='bottom'
                  delay={{show: 250, hide: 400}}
                  overlay={renderTooltip('Claim Garansi')}
                >
                  <Button variant='primary' className='button-detail' onClick={handleDetailId}>
                    <FontAwesomeIcon className='text-white' icon={faTicket} fontSize={'13px'} />
                  </Button>
                </OverlayTrigger>
              </div>
            )}
          </>
        )
      },
      fixed: 'right',
    },
  ].filter(Boolean) as ColumnsType<DataType>

  const fetchWorkOrderList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/orders?order_by=desc&work_order_status=${statuses}&date_from=${dateFrom}&date_to=${dateTo}&page=${page}&take=${pageSize}${queryparams}${storeId}${vendorId}${tukangId}`

    if (tukangId) {
      apiUrlWithParams += `&is_active_warranty=1`
    }

    try {
      const response = await axiosInstance.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setLoadData(false)
      setCurrentPage(response.data.page)
      setTotalData(response?.data?.total ?? 0)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewWorkOrder = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchWorkOrderList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const claimWarrantyData = apiData.map((item: any) => {
        let data

        const orderDate = formatDateWithTimeZone(item?.created_at)

        const phoneNumber = item?.project_number.startsWith('0')
          ? item.project_number
          : `+62${item.project_number}`

        const createdAt = item?.work_orders?.work_order_status[0]?.created_at
          ? new Date(item.work_orders.work_order_status[0].created_at)
          : null

        const workEndDate = createdAt
          ? createdAt.toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          : '-'

        let warrantyEndDate = '-'
        let cooldownWarranty = 0

        if (createdAt) {
          const warrantyEnd = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)
          warrantyEndDate = warrantyEnd.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
          cooldownWarranty = warrantyEnd.getTime() - new Date().getTime()
        }

        const calculateTimeLeft = (timeLeft: number): TimeLeft => {
          let time: TimeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
          }

          if (timeLeft > 0) {
            time = {
              days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
              hours: Math.floor((timeLeft / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((timeLeft / 1000 / 60) % 60),
            }
          } else {
            time = {
              days: 0,
              hours: 0,
              minutes: 0,
            }
          }

          return time
        }

        const warrantyCountdown = calculateTimeLeft(cooldownWarranty)
        const warrantyCountdownText =
          warrantyCountdown.days === 0 &&
          warrantyCountdown.hours === 0 &&
          warrantyCountdown.minutes === 0
            ? 'Garansi Expired'
            : `${warrantyCountdown.days} Hari ${warrantyCountdown.hours} Jam ${warrantyCountdown.minutes} Menit`

        const warrantyStatus =
          warrantyCountdown.days === 0 &&
          warrantyCountdown.hours === 0 &&
          warrantyCountdown.minutes === 0
            ? 'Garansi Expired'
            : item?.complaints.length >= 1
            ? 'Garansi Terpakai'
            : 'Garansi Aktif'

        data = {
          order_id: item?.id,
          store_name: item?.store?.store_name ?? '-',
          date_order: orderDate,
          payment_type: item?.payment_type,
          receipt_number: item?.receipt_number,
          no_member: item?.members?.member_number ?? '-',
          costumer_name: item?.members?.full_name ?? '-',
          project_address: item?.project_address ?? '-',
          email_customer: item?.members?.email ?? '-',
          phone_number: phoneNumber,
          status_order: item?.status?.description ?? '-',
          period_active: workEndDate,
          period_expired: warrantyEndDate,
          countdown_to_expired: warrantyCountdownText,
          warranty_status: warrantyStatus,
          order_detail: item?.order_details,
          work_order_detail: item?.work_order_detail,
        }

        return data
      })

      return claimWarrantyData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewWorkOrder(page, pageSize, queryparams)
    setClaimWarrantyData(data)
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
    let queryparams = ''

    const valueCheck = (key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        queryparams += `${key}${value}`
      }
    }

    valueCheck(`&search=`, searchFilter)

    if (filters.warranty_status) {
      queryparams += filters.warranty_status.map((filter) => `&${filter}`).join('')
    }

    const data = await ViewWorkOrder(1, 10, queryparams)
    setClaimWarrantyData(data)

    setLoadingButton(false)
  }

  return (
    <section id='warranty-claim-list'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
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
                dataSource={claimWarrantyData}
                rowKey={(record) => record.order_id}
                pagination={false}
                sticky={true}
                tableLayout='auto'
                scroll={{x: 1500}}
                onChange={handleFilterChange}
              />
            </div>

            {/* <List
              dataSource={claimWarrantyData}
              rowKey={(record) => record.order_id}
              pagination={false}
              renderItem={(item) => (
                <Card className='mb-5'>
                  <Card.Body>
                    <div className='header-warranty d-flex flex-column flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row align-items-start align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center justify-content-between mb-5'>
                      <div className='header-title'>
                        <div className='title fs-6 fw-bold'>ORDER ID #{item.order_id}</div>
                        <div className='title fs-6 fw-bold'>
                          Tanggal Order {item.date_order.toString()}
                        </div>
                      </div>

                      <div className='header-status'>
                        <Tag className='fs-6 fw-semibold' color='green'>
                          {item.status_order}
                        </Tag>
                      </div>
                    </div>

                    <Row>
                      <Col md={7} sm={12}>
                        <Card className='card-info'>
                          <Card.Header>
                            <Card.Title className='fs-6 fw-semibold'>Informasi Order</Card.Title>
                          </Card.Header>

                          <Card.Body className='order-data'>
                            <div className='d-flex fs-6'>
                              <span className='label-text'>Nama Toko</span>: {item.store_name}
                            </div>

                            <div className='d-flex fs-6'>
                              <span className='label-text'>Nomor Receipt</span>:{' '}
                              {item.receipt_number}
                            </div>

                            <div className='d-flex fs-6'>
                              <span className='label-text'>Tipe Pembayaran</span>:{' '}
                              {item.payment_type}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={5} sm={12}>
                        <Card className='card-info mb-5'>
                          <Card.Header>
                            <Card.Title className='fs-6 fw-semibold'>Informasi Konsumen</Card.Title>
                          </Card.Header>

                          <Card.Body className='customer-data'>
                            <div className='d-flex fs-6'>
                              <span className='label-text'>No Member</span>: {item.no_member}
                            </div>

                            <div className='d-flex fs-6'>
                              <span className='label-text'>Nama Customer</span>:{' '}
                              {item.costumer_name}
                            </div>

                            <div className='d-flex fs-6'>
                              <span className='label-text'>Email</span>: {item.email_customer}
                            </div>

                            <div className='d-flex fs-6'>
                              <span className='label-text'>No. Telp</span>: {item.phone_number}
                            </div>

                            <div className='d-flex fs-6'>
                              <span className='label-text'>Alamat</span>: {item.project_address}
                            </div>
                          </Card.Body>
                        </Card>

                        <Card className='card-info'>
                          <Card.Header>
                            <Card.Title className='fs-6 fw-semibold'>Informasi Garansi</Card.Title>
                          </Card.Header>

                          <Card.Body className='warranty-data'>
                            <div className='d-flex fs-6'>
                              <span className='label-text'>Tanggal Aktif Garansi</span>:{' '}
                              {item.period_active.toString()}
                            </div>

                            <div className='d-flex fs-6'>
                              <span className='label-text'>Umur Masa Garansi</span>:{' '}
                              {item.countdown_to_expired.toString()}
                            </div>

                            <div className='d-flex fs-6'>
                              <span className='label-text'>Tanggal Berakhir Garansi</span>:{' '}
                              {item.period_expired.toString()}
                            </div>

                            <div className='d-flex fs-6'>
                              <span className='label-text'>Status Garansi</span>:{' '}
                              {item.warranty_status}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}
            /> */}
          </Spin>

          <div className='pagination-container mt-5'>
            <span className='total-text'>
              Showing {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, totalData)} of {totalData} Claim Garansi
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

export {WarrantyClaimListHO}
