import React, {FC, useState, useEffect} from 'react'

import './DashboardOrder.css'

import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {MoreInformation} from './components/MoreInformation'

import axios from 'axios'
import dayjs from 'dayjs'
import type {ColumnsType} from 'antd/es/table'
import {Table, PaginationProps, DatePicker} from 'antd'
import {Card, Row, Col, Button} from 'react-bootstrap'

const {RangePicker} = DatePicker

interface DataType {
  order_id: number
  store_name: string
  costumer_name: string
  service_name: string
  order_date: Date
  total: string
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
    title: 'Nama Konsumen',
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
    title: 'Order Dibuat',
    dataIndex: 'order_date',
    key: 'order_date',
    align: 'left',
    sorter: (a: DataType, b: DataType) =>
      new Date(a.order_date).getTime() - new Date(b.order_date).getTime(),
  },
  {
    title: 'Grand Total',
    dataIndex: 'total',
    key: 'total',
    align: 'center',
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

const DashboardOrderStore: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const userStore = localStorage.getItem('storeId')

  const [loadingButton, setLoadingButton] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [orderList, setOrderList] = useState<any[]>([])

  const [chartDataOrder, setChartDataOrder] = useState<any[]>([])
  const [chartWorkOrder, setChartWorkOrder] = useState<any[]>([])

  const today = new Date()
  const [dateFrom, setDateFrom] = useState<any>(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const fetchOrderList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/orders?order_by=desc&page=${page}&take=${pageSize}&date_from=${dateFrom}&date_to=${dateTo}${queryparams}`

    if (userStore) {
      apiUrlWithParams += `&store_id=${userStore}`
    }

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data

      setCurrentPage(response?.data?.page)
      setTotalData(response?.data?.total ?? 0)

      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getReportOrder = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/reports/orders?date_from=${dateFrom}&date_to=${dateTo}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      const chartDatas = response.data.monthlyOrders
      const fromDate = new Date(dateFrom)
      const toDate = new Date(dateTo)

      const fromMonth = fromDate.getMonth()
      const toMonth = toDate.getMonth()

      const startIndex = fromMonth
      const endIndex = toMonth + 1

      const slicedData = chartDatas.slice(startIndex, endIndex)
      setChartDataOrder(slicedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getReportWorkOrder = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/reports/work-orders?date_from=${dateFrom}&date_to=${dateTo}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      const data = response.data.data

      const chartDatas = response.data.monthlyWorkOrders

      const fromDate = new Date(dateFrom)
      const toDate = new Date(dateTo)

      const fromMonth = fromDate.getMonth()
      const toMonth = toDate.getMonth()

      const startIndex = fromMonth
      const endIndex = toMonth + 1

      const slicedData = chartDatas.slice(startIndex, endIndex)
      setChartWorkOrder(slicedData)
      return data
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getReportOrder()
    getReportWorkOrder()
  }, [])

  const ViewOrder = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchOrderList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const orderData = apiData.map((item: any) => {
        let data
        let totalAmount = 0

        if (item?.payment_type === 'gratis') {
          totalAmount =
            item?.is_overdistance === 1
              ? Number(item?.grand_total) + Number(item?.additional_fee)
              : 0
        } else if (item?.payment_type === 'pemasangan_tanpa_survey') {
          totalAmount =
            item?.is_overdistance === 1
              ? Number(item?.grand_total) + Number(item?.additional_fee)
              : item?.grand_total ?? 0
        } else if (item?.payment_type === 'survey') {
          totalAmount =
            item?.is_overdistance === 1
              ? Number(item?.grand_total) + Number(item?.additional_fee)
              : 99000 ?? 0
        }

        data = {
          order_id: item.id,
          store_name: item?.store?.store_name ?? '-',
          costumer_name: item?.members?.full_name ?? '-',
          service_name:
            item?.payment_type === 'survey'
              ? item?.m_order_details[0]?.item_notes ?? '-'
              : item?.m_order_details[0]?.item?.service_name ?? '-',
          order_date: new Date(item?.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          total: `Rp. ${Number(totalAmount).toLocaleString('id')}`,
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

  const handleSubmitFilter = async () => {
    setLoadingButton(true)
    let queryparams = ``

    const data = await ViewOrder(1, 10, queryparams)
    setOrderList(data)

    await getReportOrder()
    await getReportWorkOrder()

    setLoadingButton(false)
  }

  const sumTotal = (data: any, key: string) =>
    data.map((item: any) => item[key] || 0).reduce((a: number, b: number) => a + b, 0)

  const totalOrders = sumTotal(chartDataOrder, 'totalOrder')
  const surveyOrder = sumTotal(chartWorkOrder, 'totalSurveyOrder')
  const workInProgress = sumTotal(chartWorkOrder, 'totalWIPOrder')
  const orderDone = sumTotal(chartDataOrder, 'totalCompleteOrder')
  const rescheduleOrder = sumTotal(chartDataOrder, 'totalRescheduleOrder')
  const cancelOrder = sumTotal(chartDataOrder, 'totalCancelOrder')
  const refundOrder = sumTotal(chartDataOrder, 'totalRefundOrder')
  const waitingSurvey = sumTotal(chartDataOrder, 'totalSurveyReqOrder')
  const waitingQuotations = sumTotal(chartDataOrder, 'totalCompleteOrder')
  const unpaidOrder = sumTotal(chartWorkOrder, 'totalUnpaidOrder')

  const renderStat = (value: number, label: string, className = 'text-center') => (
    <Col className='mb-2'>
      <div className='d-flex flex-column align-items-center gap-2'>
        <h1 className='fw-normal'>{value}</h1>
        <p className={`fs-6 ${className}`}>{label}</p>
      </div>
    </Col>
  )

  return (
    <section id='dashboard-order'>
      <Row className='g-5 g-xl-8'>
        <Col xxl={5} xl={5} lg={12} className='mb-5'>
          <Row>
            <Col
              xxl={12}
              xl={12}
              lg={12}
              md={12}
              className='d-flex justify-content-between align-items-center'
            >
              <h3 className='fs-3 fw-normal mb-3 w-50'>Pilih Periode</h3>

              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range ms-3 me-3 w-100'
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
      </Row>

      <div className='row g-5 g-xl-8 mb-5'>
        <div className='col-xl-12'>
          <Card>
            <Card.Body>
              <Row className='justify-content-md-center mt-2'>
                {renderStat(totalOrders, 'Total Order')}
                {renderStat(surveyOrder, 'Order Survey')}
                {renderStat(workInProgress, 'Order sedang dalam pengerjaan')}
                {renderStat(orderDone, 'Order Selesai')}
                {renderStat(
                  rescheduleOrder,
                  'Order yang dijadwalkan ulang',
                  'text-danger text-center'
                )}
                {renderStat(cancelOrder, 'Order yang dibatalkan', 'text-danger text-center')}
                {renderStat(refundOrder, 'Order yang dikembalikan dana', 'text-danger text-center')}
                {renderStat(waitingSurvey, 'Menunggu Survey', 'text-brown fw-bold text-center')}
                {renderStat(
                  waitingQuotations,
                  'Menunggu Quotation',
                  'text-brown fw-bold text-center'
                )}
                {renderStat(unpaidOrder, 'Menunggu Bayar', 'text-brown fw-bold text-center')}
              </Row>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Row className='g-5 g-xl-8 mb-5'>
        <div className='col-xl-4'>
          <MoreInformation className='card-xl-stretch mb-xl-8' orderData={orderList} />
        </div>
        <div className='col-xl-4'>
          <ChartBar className='card-xl-stretch mb-xl-8' chartOrderData={chartDataOrder} />
        </div>
        <div className='col-xl-4'>
          <ChartLine className='card-xl-stretch mb-xl-8' orderData={chartDataOrder} />
        </div>
      </Row>

      <Row className='g-5 g-xl-8'>
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

export {DashboardOrderStore}
