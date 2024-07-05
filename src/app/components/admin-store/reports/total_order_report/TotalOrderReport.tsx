/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './TotalOrderReport.css'

import axios from 'axios'
import {Table, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Button} from 'react-bootstrap'

const {RangePicker} = DatePicker

type Props = {
  endpoint: string
  isWorkOrder: boolean
  className: string
  statusName: string[]
}

interface Status {
  value: number
  category: string
}

interface DataType {
  order_id: number
  date_order: Date
  costumer_name: string
  phone_number: number
  email: string
  address: string
  grand_total: number
}

const TotalOrderReportStore: React.FC<Props> = ({endpoint, className, statusName, isWorkOrder}) => {
  const apiUrl = process.env.REACT_APP_API_URL

  const storedStatus = sessionStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
  const desiredStatus = statusData.filter((status) => statusName.includes(status.category))
  const statuses = desiredStatus.map((x) => x.value)
  const queryStatus = statuses.length
    ? isWorkOrder
      ? `&work_order_status=${statuses.join(',')}`
      : `&status=${statuses.join(',')}`
    : ''

  const userStore = localStorage.getItem('storeId') as any
  const userStoreName = localStorage.getItem('storeName') as string
  const storeId = userStore ? `&store_id=${userStore}` : ''

  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [reportData, setReportData] = useState<DataType[]>([])
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
      title: 'Grand Total',
      dataIndex: 'grand_total',
      key: 'grand_total',
      align: 'center',
      width: 135,
      sorter: (a, b) => a.grand_total - b.grand_total,
    },
  ]

  const fetchReportData = async (
    endpoint: string,
    page: number,
    pageSize: number,
    queryparams: any
  ) => {
    let url = `${apiUrl}/${endpoint}?order_by=desc&page=${page}&take=${pageSize}${storeId}${queryStatus}${queryparams}`

    try {
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response?.data) {
        switch (endpoint) {
          case 'orders':
            setCurrentPage(response?.data?.page ?? 1)
            setTotalOrder(response?.data?.total ?? 0)
            setLoadData(false)
            break

          case 'reschedule':
            setCurrentPage(response?.data?.page ?? 1)
            setTotalOrder(response?.data?.total ?? 0)
            setLoadData(false)
            break

          case 'refund':
            setCurrentPage(response?.data?.page ?? 1)
            setTotalOrder(response?.data?.takeTotal ?? 0)
            setLoadData(false)
            break

          default:
            setCurrentPage(response?.data?.page ?? 1)
            setTotalOrder(response?.data?.total ?? 0)
            setLoadData(false)
            break
        }
      }

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewReportData = async (
    endpoint: string,
    page: number,
    pageSize: number,
    queryparams: any
  ) => {
    try {
      const apiData = await fetchReportData(endpoint, page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      let orderData
      let rescheduleData
      let refundData

      switch (endpoint) {
        case 'orders':
          orderData = apiData.map((item: any) => {
            let data

            const orderDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })

            data = {
              order_id: item.id,
              date_order: orderDate,
              costumer_name: item?.members?.full_name ?? '-',
              phone_number: item?.project_number ?? '-',
              email: item?.members?.email ?? '-',
              address: item?.project_address ?? '-',
              grand_total: `Rp. ${Number(item?.grand_total).toLocaleString('id')}`,
            }

            return data
          })
          break

        case 'refund':
          refundData = apiData.map((item: any) => {
            let data

            const orderDate = new Date(item?.orders?.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })

            data = {
              order_id: item?.order_id,
              date_order: orderDate,
              costumer_name: item?.orders?.members?.full_name,
              phone_number: item?.orders?.project_number,
              email: item?.orders?.members?.email ?? '-',
              address: item?.orders?.project_address ?? '-',
              grand_total: `Rp. ${Number(item?.orders?.grand_total).toLocaleString('id')}`,
            }

            return data
          })
          break

        case 'reschedule':
          rescheduleData = apiData.map((item: any) => {
            let data

            const orderDate = new Date(item?.orders?.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })

            data = {
              order_id: item?.order_id,
              date_order: orderDate,
              costumer_name: item?.order?.members?.full_name,
              phone_number: item?.order?.project_number,
              email: item?.order?.members?.email ?? '-',
              address: item?.order?.project_address ?? '-',
              grand_total: `Rp. ${Number(item?.order?.grand_total).toLocaleString('id')}`,
            }

            return data
          })
          break

        default:
          break
      }

      return endpoint === 'orders'
        ? orderData
        : endpoint === 'refund'
        ? refundData
        : endpoint === 'reschedule'
        ? rescheduleData
        : []
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewReportData(endpoint, page, pageSize, queryparams)
    setReportData(data)
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

    const data = await ViewReportData('orders', 1, 10, queryparams)
    setReportData(data)

    setLoadingButton(false)
  }

  return (
    <section id='total-order-report'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex align-items-center mb-2'>
              <div className='fw-bold mb-5'>
                Nama Toko
                <span className='fs-6 ms-2 pt-2 pb-2 fw-normal bg-secondary'>{userStoreName}</span>
              </div>
            </Col>

            <Col xs={12} md={12} lg={12} xl={4} xxl={4}>
              <div className='d-flex align-items-center me-3'>
                <h3 className='fs-5 fw-normal'>Date</h3>

                <RangePicker
                  format={'DD-MM-YYYY'}
                  className='date-range ms-3 w-100'
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
              </div>
            </Col>

            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex justify-content-between'>
              <Button
                className='btn-dark-primary button-submit'
                disabled={loadingButton}
                onClick={handleSubmitFilter}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>

              <div className='ms-1 fs-1 fw-bolder text-uppercase'>Total Order : {totalOrder}</div>
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
              dataSource={reportData}
              rowKey={(record) => record.order_id}
              pagination={false}
            />
          </Spin>

          <Pagination
            className='mt-5'
            style={{textAlign: 'right', position: 'relative'}}
            current={currentPage}
            total={totalOrder}
            showSizeChanger
            pageSizeOptions={[5, 10, 20, 50, 100]}
            itemRender={itemRender}
            onChange={(page, pageSize) => {
              fetchData(page, pageSize, '')
            }}
            showTotal={(total, range) => (
              <span style={{left: 0, position: 'absolute'}}>
                Showing {range[0]} - {range[1]} of {total} Order
              </span>
            )}
          />
        </div>
      </div>
    </section>
  )
}

export {TotalOrderReportStore}
