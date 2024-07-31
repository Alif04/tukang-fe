import React, {useState, useEffect, FC} from 'react'

import {OrderValueWidget} from './components/OrderValueWidget'
import {SalesReportWidget} from './components/SalesReportWidget'
import {TransactionWidget} from './components/TransactionWidget'
import {WaitingCostumerPay} from './components/WaitingCostumerPay'
import {WaitingPaymentQuotation} from './components/WaitingPaymentQuotation'
import {TopSalesWidget} from './components/TopSalesWidget'
import {TotalOrderStore} from './components/TotalOrderStore'
import {TotalComplaint} from './components/TotalComplaint'
import {TotalReschedule} from './components/TotalReschedule'

import axios from 'axios'
import dayjs from 'dayjs'
import {DatePicker} from 'antd'
import {Row, Col, Button, Tab, Nav} from 'react-bootstrap'

const {RangePicker} = DatePicker

const DashboardStore: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const userStore = localStorage.getItem('storeId')
  const userSales = localStorage.getItem('sales_id')

  const salesId = userSales ? `&sales_id=${userSales}` : ''
  const storeId = userStore ? `&store_id=${userStore}` : ''

  const today = new Date()
  const [dateFrom, setDateFrom] = useState<any>(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])

  const [loadingButton, setLoadingButton] = useState(false)
  const [isLoadingPage, setIsLoadingPage] = useState(true)

  const [orderData, setOrderData] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  const [sales, setSales] = useState<any[]>([])
  const [totalSales, setTotalSales] = useState<number>(0)

  const getOrder = async (queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/orders?order_by=desc${queryparams}&date_from=${dateFrom}&date_to=${dateTo}&take=0${salesId}${storeId}`

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
      setIsLoadingPage(false)
      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getReportOrder = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/reports/orders?store_id=${userStore}&date_from=${dateFrom}&date_to=${dateTo}${salesId}`,
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
      setChartData(slicedData)
      setIsLoadingPage(false)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getSales = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/sales?take=0&top_best=1&order_by=desc&store_id=${userStore}`,
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
      const totalSales = response.data.total

      setSales(data)
      setTotalSales(totalSales)
      setIsLoadingPage(false)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getOrder('')
  }, [])

  useEffect(() => {
    getSales()
    getReportOrder()
  }, [])

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubmitFilter()
    }
  }

  const handleSubmitFilter = async () => {
    setLoadingButton(true)
    let queryparams = ``

    const data = await getOrder(queryparams)
    setOrderData(data)

    await getSales()
    await getReportOrder()

    setLoadingButton(false)
  }

  const sumTotal = (data: any, key: string) =>
    data.map((item: any) => item[key] || 0).reduce((a: number, b: number) => a + b, 0)

  const totalOrders = sumTotal(chartData, 'totalOrder')
  const totalComplete = sumTotal(chartData, 'totalOrderDone')
  const totalProgress = sumTotal(chartData, 'totalProgressOrder')
  const totalCancel = sumTotal(chartData, 'totalCancel')
  const totalRefund = sumTotal(chartData, 'totalRefund')

  return (
    <section id='dashboard-store'>
      <Row className='mb-5'>
        <div
          className='d-flex flex-column flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row align-items-start align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center justify-content-start gap-3'
          onKeyDown={handleKeyPress}
        >
          <h3 className='d-flex align-items-center fs-3 fw-normal'>Pilih Periode :</h3>

          <RangePicker
            format={'DD-MM-YYYY'}
            className='date-range'
            defaultValue={[dayjs(dateFrom, 'YYYY-MM-DD'), dayjs(dateTo, 'YYYY-MM-DD')]}
            onChange={(values) => {
              if (values && values.length === 2) {
                const dateFromFormatted = values[0]?.format('YYYY-MM-DD')
                const dateToFormatted = values[1]?.format('YYYY-MM-DD')

                setDateFrom(dateFromFormatted)
                setDateTo(dateToFormatted)
              } else {
                setDateFrom(new Date(today.getFullYear(), 0, 2).toISOString().split('T')[0])
                setDateTo(new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0])
              }
            }}
          />

          <Button
            className='btn-dark-primary button-submit m-0'
            disabled={loadingButton}
            onClick={handleSubmitFilter}
          >
            {loadingButton ? 'Filtering..' : 'Submit'}
          </Button>
        </div>
      </Row>

      <Row className='mb-5'>
        <Col>
          <Tab.Container defaultActiveKey={1}>
            <Nav fill variant='tabs'>
              <Nav.Item style={{cursor: 'pointer'}}>
                <Nav.Link key={1} eventKey={1}>
                  Total Order
                </Nav.Link>
              </Nav.Item>

              <Nav.Item style={{cursor: 'pointer'}}>
                <Nav.Link key={2} eventKey={2}>
                  Grand Total Value
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey={1}>
                <SalesReportWidget chartHeight='250px' chartOrderData={chartData} />
              </Tab.Pane>

              <Tab.Pane eventKey={2}>
                <OrderValueWidget chartHeight='250px' chartOrderData={chartData} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>

      <Row>
        <Col xxl={4} xl={4} lg={12}>
          <TransactionWidget
            className='card-xl-stretch mb-xl-8 mb-5'
            orderData={orderData}
            loadingPage={isLoadingPage}
          />
        </Col>

        <Col xxl={4} xl={4} lg={12}>
          <TopSalesWidget
            className='card-xl-stretch mb-xl-8 mb-5'
            salesData={sales}
            totalSales={totalSales}
            loadingPage={isLoadingPage}
          />
        </Col>

        <Col xxl={4} xl={4} lg={12}>
          <Row>
            <Col xxl={6} xl={6} lg={12}>
              <TotalComplaint
                className='card-xxl-stretch-50  mb-xl-8 mb-5'
                loadingPage={isLoadingPage}
                chartOrder={chartData}
                orderData={orderData}
              />
            </Col>

            <Col xxl={6} xl={6} lg={12}>
              <TotalReschedule
                orderData={orderData}
                chartOrder={chartData}
                className='card-xxl-stretch-50  mb-xl-8 mb-5'
                loadingPage={isLoadingPage}
              />
            </Col>
          </Row>

          <Row>
            <Col xxl={6} xl={6} lg={12}>
              <WaitingCostumerPay
                chartOrder={chartData}
                className='card-xxl-stretch-50 mb-xl-8 mb-5'
                orderData={orderData}
                loadingPage={isLoadingPage}
              />
            </Col>

            <Col xxl={6} xl={6} lg={12}>
              <WaitingPaymentQuotation
                chartOrder={chartData}
                orderData={orderData}
                className='card-xxl-stretch-50  mb-xl-8 mb-5'
                loadingPage={isLoadingPage}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <TotalOrderStore
                className=''
                totalOrders={totalOrders}
                totalComplete={totalComplete}
                totalProgress={totalProgress}
                totalCancel={totalCancel}
                totalRefund={totalRefund}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </section>
  )
}

export {DashboardStore}
