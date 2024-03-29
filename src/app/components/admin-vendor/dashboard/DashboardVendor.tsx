import React, {useState, useEffect, FC} from 'react'

import './DashboardVendor.css'

import {ChartBarPerformance} from './components/ChartBarPerformance'
import {ChartBarOrder} from './components/ChartBarOrder'
import {ChartBarSurvey} from './components/ChartBarSurvey'
import {MoreInformation} from './components/MoreInformation'
import {TableList} from './components/TableList'

import axios from 'axios'
import {DatePicker} from 'antd'
import {Row, Col, Card, Form} from 'react-bootstrap'

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

  const [currentPage, setCurrentPage] = useState<number>(1)

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

  const fetchOrderList = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&take=0&vendor_id=${vendorId}`,
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
      const chartDatas = response.data.monthlyOrders.slice(1, 7)

      setCurrentPage(response.data.page)
      setOrderData(data)
      setChartDataOrder(chartDatas)
      setOrderList(data)

      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewOrder = () => {
    try {
      const apiData = orderList.map((item: any) => {
        let data

        data = {
          order_id: item.id,
          store_name: item.store.store_name,
          costumer_name: item.members.full_name,
          service_name: item.m_order_details[0]?.item?.service_name ?? '-',
          total: `Rp. ${parseInt(item.grand_total).toLocaleString('id')}`,
        }

        return data
      })

      return apiData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const getWorkOrder = async () => {
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
      const chartDatas = response.data.monthlyWorkOrders.slice(1, 7)

      setWorkOrderData(data)
      setChartWorkOrder(chartDatas)
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

  useEffect(() => {
    fetchOrderList()
  }, [dateFrom, dateTo])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ViewOrder()
        setOrderData(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
    getWorkOrder()
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
          const orderCount = orderList.filter((item: any) => item.status.id === statusValue).length

          setStatusState((prevState) => ({
            ...prevState,
            [stateKey]: orderCount,
          }))
        }
      }
    }
  }, [orderList])

  const {survey, onProgress, complete, reschedule, waitingPayment} = statusState

  return (
    <section id='dashboard-vendor'>
      <Row>
        <Col className='mb-5'>
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
                    setDateFrom('')
                    setDateTo('')
                  }
                }}
              />
            </Col>
          </Row>
        </Col>

        <Col xxl={4} xl={4} lg={4} className='d-flex align-items-center'></Col>
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
          <TableList className='card-xl-stretch' orderData={orderData} currentPage={currentPage} />
        </Col>
      </Row>
    </section>
  )
}

export {DashboardVendor}
