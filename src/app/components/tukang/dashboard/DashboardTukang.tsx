import React, {useState, useEffect, FC} from 'react'

import './DashboardTukang.css'

import {ChartBarSurvey} from './components/ChartBarSurvey'
import {MoreInformation} from './components/MoreInformation'

import axios from 'axios'
import dayjs from 'dayjs'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Card, Button} from 'react-bootstrap'
import {Table, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'

const {RangePicker} = DatePicker

interface DataType {
  order_id: number
  store_name: string
  costumer_name: string
  service_name: string
  order_date: Date
  status: string
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    width: 'fit-content',
    sorter: (a, b) => a.order_id - b.order_id,
  },
  {
    title: 'Tanggal Order',
    dataIndex: 'order_date',
    key: 'order_date',
    align: 'left',
    sorter: (a: DataType, b: DataType) =>
      new Date(a.order_date).getTime() - new Date(b.order_date).getTime(),
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
    title: 'Status Order',
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
  const userTukang = localStorage.getItem('tukang_id')
  const tukangId = userTukang ? `&tukang_id=${userTukang}` : ''

  const [loadData, setLoadData] = useState<boolean>(true)
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [loadingButton, setLoadingButton] = useState(false)

  const [orderList, setOrderList] = useState<any[]>([])
  const [chartDataOrder, setChartDataOrder] = useState<any[]>([])

  const today = new Date()
  const [dateFrom, setDateFrom] = useState<any>(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const getWorkOrder = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/work-orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}${tukangId}&page=${page}&take=${pageSize}${queryparams}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setOrderList(response.data.data)
      setCurrentPage(response.data.page)
      setTotalData(response?.data?.total ?? 0)
      setLoadData(false)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getReportOrder = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/reports/orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}${tukangId}`,
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
      const apiData = await getWorkOrder(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from getWorkOrder')
        return []
      }

      const orderData = apiData.map((item: any) => {
        let data

        data = {
          order_id: item?.order?.id,
          store_name: item?.order?.store?.store_name ?? '-',
          costumer_name: item?.order?.members?.full_name ?? '-',
          status: item?.order?.status?.description,
          order_date: new Date(item?.created_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }),
          service_name:
            item?.order?.payment_type === 'survey' &&
            item?.work_order_status[0]?.work_order_items.length === 0
              ? item?.order?.m_order_details[0]?.item_notes
              : item?.order?.payment_type === 'survey' &&
                item?.work_order_status[0]?.work_order_items.length >= 1
              ? item?.work_order_status[0]?.work_order_items
                  .map((item: any) => item?.name)
                  .join(', ')
              : item?.order?.m_order_details?.map((item: any) => item?.item?.item_name).join(', '),
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
  const surveyOrder = sumTotal(chartDataOrder, 'totalSurveyStart')
  const surveyOrderDone = sumTotal(chartDataOrder, 'totalSurveyDone')

  const waitingQuotations = sumTotal(chartDataOrder, 'totalWaitingQuotationVendor')
  const unpaidQuotation = sumTotal(chartDataOrder, 'totalWaitingQuotationCustomer')

  const waitingWork = sumTotal(chartDataOrder, 'totalWaitingWork')
  const workInProgress = sumTotal(chartDataOrder, 'totalWorkStart')
  const orderDone = sumTotal(chartDataOrder, 'totalOrderDone')

  const totalComplaint = sumTotal(chartDataOrder, 'totalComplaint')
  const totalRework = sumTotal(chartDataOrder, 'totalRework')
  const totalResurvey = sumTotal(chartDataOrder, 'totalResurvey')

  const totalReschedule = sumTotal(chartDataOrder, 'totalReschedule')
  const totalRefund = sumTotal(chartDataOrder, 'totalRefund')
  const totalCancel = sumTotal(chartDataOrder, 'totalCancel')

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
                className='date-range w-100 mb-3'
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
                className='btn-dark-primary button-submit m-0'
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
                {renderStat(waitingSurvey, 'Menunggu Survey', 'text-center')}
                {renderStat(surveyOrder, 'Order sedang dalam survey')}
                {renderStat(surveyOrderDone, 'Survei Selesai')}
                {renderStat(waitingQuotations, 'Quotation Dikirim Vendor', 'text-center')}
                {renderStat(unpaidQuotation, 'Menunggu Bayar Quotation', 'text-center')}
                {renderStat(waitingWork, 'Menunggu Pengerjaan')}
                {renderStat(workInProgress, 'Order sedang dalam pengerjaan')}
                {renderStat(orderDone, 'Order Selesai')}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={5} md={12} className='mb-3'>
          <MoreInformation
            className='card-xl-stretch'
            totalComplaint={totalComplaint}
            totalResurvey={totalResurvey}
            totalRework={totalRework}
            totalReschedule={totalReschedule}
            totalRefund={totalRefund}
            totalCancel={totalCancel}
          />
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
                    dataSource={orderList}
                    rowKey={(record) => record.order_id}
                    pagination={false}
                    tableLayout='auto'
                    scroll={{x: 'max-content'}}
                  />
                </Spin>

                <div className='pagination-container mt-5'>
                  <span className='total-text'>
                    Showing {(currentPage - 1) * pageSize + 1} -{' '}
                    {Math.min(currentPage * pageSize, totalData)} of {totalData} Orders
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
          </div>
        </Col>
      </Row>
    </section>
  )
}

export {DashboardTukang}
