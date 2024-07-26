import React, {FC, useState, useEffect} from 'react'

import {TotalOrder} from './components/TotalOrder'
import {TotalWork} from './components/TotalWork'
import {TotalComplaint} from './components/TotalComplaint'
import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {ChartLine2} from './components/ChartLine2'
import {ChartDonut} from './components/ChartDonut'
import {ChartDonut2} from './components/ChartDonut2'

import axios from 'axios'
import dayjs from 'dayjs'
import {DatePicker} from 'antd'
import {Card, Row, Col, Button} from 'react-bootstrap'

const {RangePicker} = DatePicker

const ReportWorkVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const vendorId = localStorage.getItem('vendor_id')

  const [loadingButton, setLoadingButton] = useState(false)

  const [orderData, setOrderData] = useState<any[]>([])
  const [workOrderData, setWorkOrderData] = useState<any[]>([])
  const [complaintData, setComplaintData] = useState<any[]>([])

  const [chartData, setChartData] = useState<any[]>([])
  const [chartWorkOrder, setChartWorkOrder] = useState<any[]>([])
  const [chartDataComplaint, setChartDataComplaint] = useState<any[]>([])

  const today = new Date()
  const [dateFrom, setDateFrom] = useState<any>(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const fetchOrderList = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/orders?order_by=desc&take=0&vendor_id=${vendorId}`,
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
      setOrderData(data)

      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getReportOrder = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/reports/orders?vendor_id=${vendorId}&date_from=${dateFrom}&date_to=${dateTo}`,
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
    } catch (error) {
      console.error(error)
    }
  }

  const getWorkOrder = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/reports/work-orders?vendor_id=${vendorId}&date_from=${dateFrom}&date_to=${dateTo}`,
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
      const chartDatas = response.data.monthlyWorkOrders.slice(1, 7)

      setWorkOrderData(data)
      setChartWorkOrder(chartDatas)
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const getComplaint = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/reports/complaints?order_by=desc&vendor_id=${vendorId}&date_from=${dateFrom}&date_to=${dateTo}`,
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
      const chartDatas = response.data.monthlyComplaint.slice(1, 7)

      setComplaintData(data)
      setChartDataComplaint(chartDatas)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchOrderList()
    getReportOrder()
    getWorkOrder()
    getComplaint()
  }, [])

  const handleSubmitFilter = async () => {
    setLoadingButton(true)

    await getReportOrder()
    await getWorkOrder()
    await getComplaint()

    setLoadingButton(false)
  }

  const renderStat = (value: number, label: string, className = 'text-center') => (
    <Col className='mb-5'>
      <div className='d-flex flex-column align-items-center gap-2'>
        <h1 className='fw-normal'>{value}</h1>
        <p className={`fs-6 ${className}`}>{label}</p>
      </div>
    </Col>
  )

  const sumTotal = (data: any, key: string) =>
    data.map((item: any) => item[key] || 0).reduce((a: number, b: number) => a + b, 0)

  const totalOrders = sumTotal(chartData, 'totalOrder')
  const paidQuotation = sumTotal(chartData, 'totalWaitingQuotationCustomer')
  const totalCancel = sumTotal(chartData, 'totalCancel')

  const waitingSurvey = sumTotal(chartData, 'totalWaitingSurvey')
  const surveyOrder = sumTotal(chartData, 'totalSurveyStart')
  const surveyOrderDone = sumTotal(chartData, 'totalSurveyDone')

  const waitingWork = sumTotal(chartData, 'totalWaitingWork')
  const workInProgress = sumTotal(chartData, 'totalWorkStart')
  const orderDone = sumTotal(chartData, 'totalOrderDone')

  return (
    <>
      <Row className='mb-5'>
        <div className='d-flex flex-column flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row align-items-start align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center justify-content-start gap-3'>
          <h3 className='d-flex align-items-center fs-3 fw-normal'>Pilih Periode :</h3>

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

          <Button
            className='btn-dark-primary button-submit m-0'
            disabled={loadingButton}
            onClick={handleSubmitFilter}
          >
            {loadingButton ? 'Filtering..' : 'Submit'}
          </Button>
        </div>
      </Row>

      <Row className='g-5 g-xl-8'>
        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body style={{minHeight: '150px'}}>
              <div className='fs-5 fw-normal mb-3'>Order</div>

              <div className='d-flex justify-content-between'>
                {renderStat(totalOrders, 'Masuk')}
                {renderStat(paidQuotation, 'Dibayar')}
                {renderStat(totalCancel, 'Dibatalkan')}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body style={{minHeight: '150px'}}>
              <div className='fs-5 fw-normal mb-3'>Survei bulan ini</div>

              <div className='d-flex justify-content-between'>
                {renderStat(waitingSurvey, 'Permintaan survei')}
                {renderStat(surveyOrder, 'Survei dimulai')}
                {renderStat(surveyOrderDone, 'Survei selesai')}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body style={{minHeight: '150px'}}>
              <div className='fs-5 fw-normal mb-3'>Pengerjaan bulan ini</div>

              <div className='d-flex justify-content-between'>
                {renderStat(waitingWork, 'Permintaan pengerjaan')}
                {renderStat(workInProgress, 'Pengerjaan dimulai')}
                {renderStat(orderDone, 'Pengerjaan Selesai')}
              </div>
            </Card.Body>
          </Card>
        </div>
      </Row>
      {/* end::Row */}

      {/* begin::Row */}
      <Row className='g-5 g-xl-8'>
        <div className='col-xl-12'>
          <ChartBar className='card-xl-stretch mb-xl-8' chartOrderData={chartData} />
        </div>
      </Row>

      <Row className='g-5 g-xl-8'>
        <div className='col-xl-12'>
          <ChartLine className='card-xl-stretch mb-5 mb-xl-8' chartWorkOrder={chartData} />
        </div>
      </Row>

      <Row className='g-5 g-xl-8'>
        <div className='col-xl-12'>
          <ChartLine2 className='card-xl-stretch mb-xl-8' chartWorkOrder={chartData} />
        </div>
      </Row>
      {/* end::Row */}

      {/* begin::Row */}
      {/* <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <ChartDonut
            className='card-xl-stretch mb-xl-8'
            chartHeight='300px'
            chartComplaint={chartDataComplaint}
          />
        </div>

        <div className='col-xl-4'>
          <ChartDonut2
            className='card-xl-stretch mb-5 mb-xl-8'
            chartHeight='300px'
            chartWorkOrder={chartWorkOrder}
          />
        </div>
      </div> */}
      {/* end::Row */}
    </>
  )
}

export {ReportWorkVendor}
