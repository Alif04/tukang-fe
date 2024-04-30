import React, {useState, useEffect, FC} from 'react'

import {SalesReportWidget} from './components/SalesReportWidget'
import {TransactionWidget} from './components/TransactionWidget'
import {WaitingCostumerPay} from './components/WaitingCostumerPay'
import {TopSalesWidget} from './components/TopSalesWidget'
import {TotalOrderStore} from './components/TotalOrderStore'
import {TotalComplaint} from './components/TotalComplaint'
import {TotalReschedule} from './components/TotalReschedule'

import axios from 'axios'
import {DatePicker, Skeleton} from 'antd'
import {Row, Col, Button} from 'react-bootstrap'

const {RangePicker} = DatePicker

const DashboardStore: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const userRole = localStorage.getItem('userRole')
  const userStore = localStorage.getItem('storeId')

  const today = new Date()
  const [dateFrom, setDateFrom] = useState<any>(new Date(today.getFullYear(), 0, 1))
  const [dateTo, setDateTo] = useState<any>(new Date(today.getFullYear(), 11, 31))

  const [loadingButton, setLoadingButton] = useState(false)
  const [isLoadingPage, setIsLoadingPage] = useState(true)

  const [orderData, setOrderData] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  const [sales, setSales] = useState<any[]>([])

  const getOrder = async (queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/orders?order_by=desc&store_id=${userStore}${queryparams}`

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
      const response = await axios.get(`${apiUrl}/reports/orders?store_id=${userStore}`, {
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
      setChartData(slicedData)
      setIsLoadingPage(false)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getSales = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/sales?take=0&top_best=true&order_by=desc&store_id=${userStore}`,
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
      setSales(data)
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

  const handleSubmitFilter = async () => {
    setLoadingButton(true)
    let queryparams = ``

    if (dateFrom) {
      queryparams += `&date_from=${dateFrom}`
    }

    if (dateTo) {
      queryparams += `&date_to=${dateTo}`
    }

    const data = await getOrder(queryparams)
    setOrderData(data)

    await getReportOrder()

    setLoadingButton(false)
  }

  return (
    <>
      <Row>
        <Col xxl={4} xl={4} lg={12} className='mb-5'>
          <Row>
            <Col xxl={4} xl={4} lg={4} className='d-flex align-items-center'>
              <h3 className='d-flex align-items-center fs-3 fw-normal mb-3'>Pilih Periode :</h3>
            </Col>

            <Col xxl={8} xl={8} lg={12}>
              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range w-100'
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
            </Col>
          </Row>
        </Col>

        <Col xxl={4} xl={4} lg={12} className='mb-5'>
          <Button
            className='btn-dark-primary button-submit'
            disabled={loadingButton}
            onClick={handleSubmitFilter}
          >
            {loadingButton ? 'Filtering..' : 'Submit'}
          </Button>
        </Col>
      </Row>

      <Row className='gy-5 g-xl-8'>
        <Col>
          <SalesReportWidget
            className='card-xl-stretch mb-xl-8'
            backGroundColor='white'
            chartHeight='250px'
            chartOrderData={chartData}
          />
        </Col>
      </Row>

      <Row className='gy-5 g-xl-8'>
        <Col xxl={4} xl={4} lg={12}>
          <TransactionWidget orderData={orderData} loadingPage={isLoadingPage} />
        </Col>

        <Col xxl={4} xl={4} lg={12}>
          <TopSalesWidget
            className='card-xl-stretch mb-xl-8'
            salesData={sales}
            loadingPage={isLoadingPage}
          />
        </Col>

        <Col xxl={4} xl={4} lg={12}>
          <Row>
            <Col xxl={6} xl={6} lg={12}>
              <TotalComplaint
                orderData={orderData}
                className='card-xxl-stretch-50  mb-xl-8'
                loadingPage={isLoadingPage}
              />
            </Col>

            <Col xxl={6} xl={6} lg={12}>
              <TotalReschedule
                orderData={orderData}
                className='card-xxl-stretch-50  mb-xl-8'
                loadingPage={isLoadingPage}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <WaitingCostumerPay
                orderData={orderData}
                className='card-xxl-stretch-50 mb-xl-8 mb-5'
                chartColor='success'
                chartHeight='150px'
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <TotalOrderStore
                orderData={orderData}
                className='card-xxl-stretch-50 card-xl-stretch-50 mb-xl-8 mb-5'
                chartHeight='220px'
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export {DashboardStore}
