import React, {useState, useEffect, FC} from 'react'

import './DashboardTukang.css'

import {ChartBarSurvey} from './components/ChartBarSurvey'
import {MoreInformation} from './components/MoreInformation'

import axios from 'axios'
import dayjs from 'dayjs'
import {DatePicker} from 'antd'
import {Row, Col, Card, Button} from 'react-bootstrap'
import {Table, PaginationProps} from 'antd'
import type {ColumnsType} from 'antd/es/table'

const {RangePicker} = DatePicker

interface DataType {
  order_id: number
  store_name: string
  costumer_name: string
  service_name: string
  status: string
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    sorter: (a, b) => a.order_id - b.order_id,
  },
  {
    title: 'Nama Toko',
    dataIndex: 'store_name',
    key: 'store_name',
    align: 'left',
    className: 'col_order_id',
    onFilter: (value, record) => record.store_name.includes(String(value)),
    sorter: (a, b) => a.store_name.length - b.store_name.length,
  },
  {
    title: 'Nama Customer',
    dataIndex: 'costumer_name',
    key: 'costumer_name',
    align: 'left',
    onFilter: (value, record) => record.costumer_name.includes(String(value)),
    sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
  },
  {
    title: 'Nama Pemasangan',
    dataIndex: 'service_name',
    key: 'service_name',
    align: 'left',
    onFilter: (value, record) => record.service_name.includes(String(value)),
    sorter: (a, b) => a.service_name.length - b.service_name.length,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    align: 'left',
    onFilter: (value, record) => record.status.includes(String(value)),
    sorter: (a, b) => a.status.length - b.status.length,
  },
]

const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
  if (type === 'prev') {
    return <a>Prev</a>
  }
  if (type === 'next') {
    return <a>Next</a>
  }
  return originalElement
}

const DashboardTukang: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const tukangId = localStorage.getItem('tukang_id')

  const [loadingButton, setLoadingButton] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [orderData, setOrderData] = useState<any>([])
  const [orderList, setOrderList] = useState<any[]>([])
  const [chartDataOrder, setChartDataOrder] = useState<any[]>([])

  const today = new Date()
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const [dateFrom, setDateFrom] = useState<any>(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])

  const fetchOrderList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/work-orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&tukang_id=${tukangId}&page${page}&take${pageSize}${queryparams}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setOrderData(response.data.data)
      setOrderList(response.data.data)
      setCurrentPage(response.data.page)
      setTotalData(response?.data?.total ?? 0)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getReportOrder = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/reports/orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&tukang_id=${tukangId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      const chartDatas = response.data.data
      const periodNumber = chartDatas.some((item: any) => /^\d+$/.test(item.period))

      const fromDate = new Date(dateFrom)
      const toDate = new Date(dateTo)

      const fromMonth = fromDate.getMonth()
      const toMonth = toDate.getMonth()

      const startIndex = fromMonth
      const endIndex = toMonth + 1

      const slicedData = periodNumber ? chartDatas : chartDatas.slice(startIndex, endIndex)
      setChartDataOrder(slicedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewOrder = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchOrderList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const orderData = apiData.map((item: any) => {
        let data

        const orderStatus = (() => {
          if (item?.work_order_status?.length >= 0) {
            if (
              [
                'QUOTEIN',
                'QUOTEOUT',
                'CANCEL',
                'WARRANTYCLAIM',
                'INVESTIGATED',
                'COMPLAINTAPPROVEDBYHO',
                'COMPLAINTREJECTEDBYHO',
                'RESCHEDULE',
              ].includes(item?.order?.status?.category)
            ) {
              return item?.order?.status?.description
            } else if (
              ['WORKREQ'].includes(item?.order?.status?.category) &&
              item?.order?.payment_type === 'survey' &&
              !['WORKSTART', 'WORKEND'].includes(item?.work_order_status[0]?.status?.category)
            ) {
              return item?.order?.status?.description
            } else {
              return item?.work_order_status[0]?.status?.description
            }
          } else {
            return item?.order?.status?.description
          }
        })()

        data = {
          order_id: item?.order?.id,
          store_name: item?.order?.store?.store_name ?? '-',
          costumer_name: item?.order?.members?.full_name ?? '-',
          service_name:
            item?.order?.payment_type === 'survey'
              ? item?.order?.m_order_details[0]?.item_notes
              : item?.work_order_status[0]?.work_order_items
                  .map((item: any) => item?.name)
                  .join(', '),
          status: orderStatus,
        }

        return data
      })

      return orderData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewOrder(page, pageSize, queryparams)
    setOrderList(data)
  }

  useEffect(() => {
    fetchData(1, 10, '')
  }, [])

  useEffect(() => {
    getReportOrder()
  }, [orderList])

  const handleSubmitFilter = async () => {
    setLoadingButton(true)
    let queryparams = ''

    const data = await ViewOrder(1, 10, queryparams)
    setOrderList(data)

    await getReportOrder()

    setLoadingButton(false)
  }

  const sumTotal = (data: any, key: string) =>
    data.map((item: any) => item[key] || 0).reduce((a: number, b: number) => a + b, 0)

  const totalOrders = sumTotal(chartDataOrder, 'totalOrder')
  const waitingSurvey = sumTotal(chartDataOrder, 'totalWaitingSurvey')
  const surveyed = sumTotal(chartDataOrder, 'totalSurveyStart')
  const surveyEnd = sumTotal(chartDataOrder, 'totalSurveyEnd')

  const waitingQuotations = sumTotal(chartDataOrder, 'totalWaitingQuotationVendor')
  const waitingWork = sumTotal(chartDataOrder, 'totalWaitingWork')
  const workInProgress = sumTotal(chartDataOrder, 'totalWIP')
  const orderDone = sumTotal(chartDataOrder, 'totalOrderDone')

  const renderStat = (value: number, label: string, className = 'text-center') => (
    <Col className='mb-5'>
      <div className='d-flex flex-column align-items-center gap-2'>
        <h1 className='fw-normal'>{value}</h1>
        <p className={`fs-6 ${className}`}>{label}</p>
      </div>
    </Col>
  )

  return (
    <section id='dashboard-tukang'>
      <Row>
        <Col xxl={6} xl={6} lg={12} className='mb-5'>
          <Row>
            <Col xxl={3} xl={3} lg={3} className='d-flex align-items-center'>
              <h3 className='title-header fs-5 fw-normal'>Rentang Waktu</h3>
            </Col>

            <Col xxl={5} xl={5} lg={5}>
              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range w-100'
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
            </Col>

            <Col xxl={4} xl={4} lg={4}>
              <Button
                className='btn-dark-primary button-submit'
                disabled={loadingButton}
                onClick={handleSubmitFilter}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>
            </Col>
          </Row>
        </Col>

        <Col xxl={6} xl={6} lg={12} className='mb-5'></Col>
      </Row>

      <Row className='g-5 g-xl-8 mb-5'>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Order</div>

              <Row className='justify-content-md-center'>
                {renderStat(totalOrders, 'Total Order')}
                {renderStat(waitingSurvey, 'Permintaan Survei')}
                {renderStat(surveyed, 'Survei Dimulai')}
                {renderStat(surveyEnd, 'Survei Selesai')}
                {renderStat(waitingQuotations, 'Menunggu Quotation')}
                {renderStat(waitingWork, 'Permintaan Pengerjaan')}
                {renderStat(workInProgress, 'Pengerjaan Dimulai')}
                {renderStat(orderDone, 'Pengerjaan Selesai')}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={5} md={12} className='mb-3'>
          <MoreInformation className='card-xl-stretch' orderData={orderData} />
        </Col>

        <Col lg={7} md={12} className='mb-3'>
          <ChartBarSurvey className='card-xl-stretch' orderData={chartDataOrder} />
        </Col>
      </Row>

      <Row className='g-5 g-xl-8 mb-5'>
        <Col md={12}>
          <div className={`card`}>
            <div className='card-body p-5'>
              <div className='d-flex flex-column'>
                <h1 className='fs-1 text-black mb-3'>List Order</h1>

                <Table
                  bordered
                  columns={columns}
                  dataSource={orderList}
                  rowKey={(record) => record.order_id}
                  pagination={{
                    position: ['bottomRight'],
                    current: currentPage,
                    total: totalData,
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    defaultPageSize: 5,
                    onChange: (page, pageSize) => {
                      fetchData(page, pageSize, '')
                    },
                    itemRender: itemRender,
                    showTotal: (total, range) => (
                      <span style={{left: 0, position: 'absolute'}}>
                        Showing {range[0]} - {range[1]} of {total} List Order
                      </span>
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </section>
  )
}

export {DashboardTukang}
