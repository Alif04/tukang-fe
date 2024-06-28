/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './ViewReschedule.css'

import axios from 'axios'
import {Table, Tag, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {LoadingOutlined} from '@ant-design/icons'
import {Row, Col, Form, InputGroup, Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faSearch} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface DataType {
  reschedule_id: number
  order_id: number
  store_name: string
  date_order: string
  member_id: number
  member_name: string
  phone_number: number
  payment_status: string
  order_status: string
}

const ViewRescheduleCS: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const userStore = localStorage.getItem('storeId') as number | null
  const userVendor = localStorage.getItem('vendor_id') as number | null
  const userTukang = localStorage.getItem('tukang_id') as number | null

  const storeId = userStore !== null ? `&store_id=${userStore}` : ''
  const vendorId = userVendor !== null ? `&vendor_id=${userVendor}` : ''
  const tukangId = userTukang !== null ? `&tukang_id=${userTukang}` : ''

  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [rescheduleData, setRescheduleData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const renderTooltip = (title: string) => <Tooltip id='button-tooltip'>{title}</Tooltip>

  const columns: ColumnsType<DataType> = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 80,
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Reschedule Id',
      dataIndex: 'reschedule_id',
      key: 'reschedule_id',
      align: 'center',
      width: 100,
      sorter: (a, b) => a.reschedule_id - b.reschedule_id,
    },
    {
      title: 'Nama Toko',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      width: 150,
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.date_order.includes(String(value)),
      sorter: (a, b) => a.date_order.length - b.date_order.length,
    },
    {
      title: 'Nomor Member',
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
      width: 110,
      onFilter: (value, record) => record.member_name.includes(String(value)),
      sorter: (a, b) => a.member_name.length - b.member_name.length,
    },
    {
      title: 'No Telp / WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'center',
      width: 110,
      sorter: (a, b) => a.phone_number - b.phone_number,
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
      title: 'Order Status',
      dataIndex: 'order_status',
      key: 'order_status',
      align: 'left',
      width: 140,
      render: (order_status) => {
        const orderStatus = order_status
        let color = ''

        switch (orderStatus) {
          case 'BOOK':
            color = 'green'
            break
          case 'BOOKED':
            color = 'lime'
            break
          case 'SURVEYREQ':
            color = 'blue'
            break
          case 'SURVEYSTART':
          case 'SURVEYDONE':
          case 'QUOTE IN':
          case 'QUOTE OUT':
          case 'WORKREQ':
          case 'WORKSTART':
          case 'WORKEND':
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
        {text: 'BOOK', value: 'BOOK'},
        {text: 'BOOKED', value: 'BOOKED'},
      ],
      onFilter: (value, record) => record.order_status.includes(String(value)),
      sorter: (a, b) => a.order_status.length - b.order_status.length,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 60,
      render: (record) => {
        const handleEdit = () => {
          const id = record.reschedule_id
          navigate(`/reschedule/update-reschedule/${id}`)
        }

        return (
          <div className='button-wrapper d-flex justify-content-center align-items-center'>
            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Update Reschedule')}
            >
              <Button variant='primary' className='button-edit' onClick={handleEdit}>
                <FontAwesomeIcon className='text-white' icon={faPen} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>
          </div>
        )
      },
    },
  ]

  const fetchRescheduleList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/reschedule?order_by=desc&page=${page}&take=${pageSize}${storeId}${vendorId}${tukangId}${queryparams}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setCurrentPage(response.data.page)
      setTotalData(response.data.takeTotal ?? 0)
      setLoadData(false)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewReschedule = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchRescheduleList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchRescheduleList')
        return []
      }

      const rescheduleData = apiData.map((item: any) => {
        let data

        const orderDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        const paymentStatus = (() => {
          if (item.order?.payment_type === 'survey') {
            return item.order.receipt_number === null ? 'UNPAID' : 'PAID'
          } else if (item.order?.payment_type === 'gratis') {
            return 'FREE'
          } else if (item.order?.payment_type === 'pemasangan_tanpa_survey') {
            return item.order.receipt_number === null ? 'UNPAID' : 'PAID'
          } else {
            return ''
          }
        })()

        data = {
          reschedule_id: item?.id,
          order_id: item?.order_id,
          store_name: item?.order?.store.store_name,
          date_order: orderDate,
          member_id: item?.order?.members.member_number,
          member_name: item?.order?.members.full_name,
          phone_number: item?.order?.project_number,
          payment_status: paymentStatus,
          order_status: item?.order?.status?.description,
        }

        return data
      })

      return rescheduleData
    } catch (error) {
      console.error('Error getting reschedule list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewReschedule(page, pageSize, queryparams)
    setRescheduleData(data)
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

  const handleSubmitFilter = async () => {
    setLoadingButton(true)
    let queryparams = ``

    const valueCheck = (key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        queryparams += `${key}${value}`
      }
    }

    valueCheck(`&date_from=`, dateFrom)
    valueCheck(`&date_to=`, dateTo)
    valueCheck(`&search=`, searchFilter)

    const data = await ViewReschedule(1, 10, queryparams)
    setRescheduleData(data)

    setLoadingButton(false)
  }

  return (
    <section id='view-refund'>
      <div className={`card ${className}`}>
        <div className='card-body'>
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
              <Button
                className='btn-dark-primary button-submit'
                disabled={loadingButton}
                onClick={handleSubmitFilter}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>
            </Col>
          </Row>

          <Spin
            tip='Loading...'
            spinning={loadData}
            size='large'
            indicator={<LoadingOutlined style={{fontSize: 24}} spin rev />}
          >
            <Table
              className='table-striped-rows'
              bordered
              columns={columns}
              dataSource={rescheduleData}
              rowKey={(record) => record.reschedule_id}
              pagination={false}
            />
          </Spin>

          <Pagination
            className='mt-5'
            style={{textAlign: 'right', position: 'relative'}}
            current={currentPage}
            total={totalData}
            showSizeChanger
            pageSizeOptions={[5, 10, 20, 50, 100]}
            itemRender={itemRender}
            onChange={(page, pageSize) => {
              fetchData(page, pageSize, '')
            }}
            showTotal={(total, range) => (
              <span style={{left: 0, position: 'absolute'}}>
                Showing {range[0]} - {range[1]} of {total} Reschedule
              </span>
            )}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewRescheduleCS}
