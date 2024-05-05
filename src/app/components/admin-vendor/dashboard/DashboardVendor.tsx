import React, {useState, useEffect, FC} from 'react'

import './DashboardVendor.css'

import {ChartBarPerformance} from './components/ChartBarPerformance'
import {ChartBarOrder} from './components/ChartBarOrder'
import {ChartBarSurvey} from './components/ChartBarSurvey'
import {MoreInformation} from './components/MoreInformation'
import {TableList} from './components/TableList'

import axios from 'axios'
import {DatePicker} from 'antd'
import {Row, Col, Card, Button} from 'react-bootstrap'

const {RangePicker} = DatePicker

const initialStatusState = {
  survey: 0,
  onProgress: 0,
  complete: 0,
  reschedule: 0,
  waitingPayment: 0,
}

type StatusToStateMap = {
  [statusName: string]: keyof typeof initialStatusState
}

const statusToStateMap: StatusToStateMap = {
  SURVEYREQ: 'survey',
  WIP: 'onProgress',
  WORKEND: 'complete',
  RESCHEDULE: 'reschedule',
  UNPAID: 'waitingPayment',
}

const DashboardVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const vendorId = localStorage.getItem('vendor_id')

  const [loadingButton, setLoadingButton] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [orderData, setOrderData] = useState<any[]>([])
  const [orderList, setOrderList] = useState<any[]>([])
  const [workOrderData, setWorkOrderData] = useState<any[]>([])

  const [chartDataOrder, setChartDataOrder] = useState<any[]>([])
  const [chartWorkOrder, setChartWorkOrder] = useState<any[]>([])
  const [chartReportTukang, setChartReportTukang] = useState<any[]>([])

  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2)
    .toISOString()
    .split('T')[0]

  const [dateFrom, setDateFrom] = useState<any>(firstDayOfMonth)
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])

  const fetchOrderList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/orders?order_by=desc&vendor_id=${vendorId}&page=${page}&take=${pageSize}${queryparams}`

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
      setCurrentPage(response?.data?.page ?? 1)
      setTotalData(response?.data?.total ?? 0)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getReportOrder = async () => {
    try {
      const response = await axios.get(`${apiUrl}/reports/orders`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

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

  const ViewOrder = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchOrderList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const orderData = apiData.map((item: any) => {
        let data

        data = {
          order_id: item.id,
          store_name: item?.store?.store_name ?? '-',
          costumer_name: item?.members?.full_name ?? '-',
          service_name:
            item?.payment_type === 'survey'
              ? item?.m_order_details[0]?.item_notes ?? '-'
              : item?.m_order_details[0]?.item?.service_name ?? '-',
          total: `Rp. ${parseInt(item?.grand_total || 0).toLocaleString('id')}`,
        }

        return data
      })

      return orderData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const getReportWorkOrder = async () => {
    try {
      const response = await axios.get(`${apiUrl}/reports/work-orders?vendor_id=${vendorId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

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
      setWorkOrderData(data)
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const getReportTukang = async () => {
    try {
      const response = await axios.get(`${apiUrl}/reports/tukang?vendor_id=${vendorId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data
      setChartReportTukang(data)
      return data
    } catch (error) {
      console.error(error)
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
    getReportWorkOrder()
    getReportTukang()
  }, [orderList])

  // Catch Value From Response API by Status
  const [statusState, setStatusState] = useState(initialStatusState)

  useEffect(() => {
    if (orderList) {
      const storedStatus = sessionStorage.getItem('statusData')
      const statusData = storedStatus ? JSON.parse(storedStatus) : []

      for (const statusName in statusToStateMap) {
        const stateKey = statusToStateMap[statusName]
        const desiredStatus = statusData.find((status: any) => status.category === statusName)

        if (desiredStatus) {
          const statusValue = desiredStatus.value
          const orderCount = orderList.filter(
            (item: any) => item?.status?.id === statusValue
          ).length

          setStatusState((prevState) => ({
            ...prevState,
            [stateKey]: orderCount,
          }))
        }
      }
    }
  }, [orderList])

  const {survey, onProgress, complete, reschedule, waitingPayment} = statusState

  const handleSubmitFilter = async () => {
    setLoadingButton(true)

    const queryparams = `&date_from=${dateFrom}&date_to=${dateTo}&vendor_id=${vendorId}`

    const data = await ViewOrder(1, 10, queryparams)
    setOrderList(data)

    await getReportOrder()
    await getReportWorkOrder()
    await getReportTukang()

    setLoadingButton(false)
  }

  return (
    <section id='dashboard-vendor'>
      <Row className='mb-5'>
        <Col xxl={4} xl={4} lg={4} className='d-flex align-items-center'>
          <Row>
            <Col xxl={4} xl={4} lg={4} className='d-flex align-items-center'>
              <h3 className='title-header fs-5 fw-normal'>Pilih rentang waktu</h3>
            </Col>

            <Col xxl={8} xl={8} lg={8}>
              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range w-100'
                onChange={(values) => {
                  if (values && values.length === 2) {
                    const dateFromFormatted = values[0]?.format('DD-MM-YYYY')
                    const dateToFormatted = values[1]?.format('DD-MM-YYYY')

                    setDateFrom(dateFromFormatted)
                    setDateTo(dateToFormatted)
                  } else {
                    setDateFrom(new Date(today.getFullYear(), 0, 2).toISOString().split('T')[0])
                    setDateTo(new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0])
                  }
                }}
              />
            </Col>
          </Row>
        </Col>

        <Col xxl={4} xl={4} lg={4} className='d-flex align-items-center'>
          <Button
            className='btn-dark-primary button-submit'
            disabled={loadingButton}
            onClick={handleSubmitFilter}
          >
            {loadingButton ? 'Filtering..' : 'Submit'}
          </Button>
        </Col>

        <Col xxl={4} xl={4} lg={4} className='d-flex align-items-center'></Col>
      </Row>

      <Row className='g-5 g-xl-8 mb-5'>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Order</div>

              <Row className='justify-content-md-center'>
                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{orderData.length}</h1>
                    <p className='fs-6 text-center'>Total Order</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{survey}</h1>
                    <p className='fs-6 text-center'>Order Survey</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{onProgress}</h1>
                    <p className='fs-6 text-center'>Order sedang dalam pengerjaan</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{complete}</h1>
                    <p className='fs-6 text-center'>Order Selesai</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{waitingPayment}</h1>
                    <p className='fs-6 text-brown fw-bold text-center'>
                      Menunggu <br></br> Bayar
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={4} md={12} className='mb-5'>
          <MoreInformation className='card-xl-stretch' orderData={orderData} />
        </Col>

        <Col lg={4} md={12} className='mb-5'>
          <ChartBarSurvey className='card-xl-stretch' workOrderData={chartWorkOrder} />
        </Col>

        <Col lg={4} md={12} className='mb-5'>
          <ChartBarOrder className='card-xl-stretch' orderData={chartDataOrder} />
        </Col>
      </Row>

      <Row className='mb-5'>
        <Col md={12}>
          <ChartBarPerformance className='card-xl-stretch' tukangData={chartReportTukang} />
        </Col>
      </Row>

      <Row className='mb-5'>
        <Col md={12}>
          <TableList className='card-xl-stretch' orderData={orderList} currentPage={currentPage} />
        </Col>
      </Row>
    </section>
  )
}

export {DashboardVendor}
