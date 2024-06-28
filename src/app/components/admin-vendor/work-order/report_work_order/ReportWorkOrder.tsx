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

      const data = response.data.data
      const chartDatas = response.data.data.slice(1, 7)
      setChartData(chartDatas)

      return data
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

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <TotalOrder
            className='card-xl-stretch mb-xl-8'
            chartHeight='250px'
            orderData={orderData}
          />
        </div>

        <div className='col-xl-4'>
          <TotalWork
            className='card-xl-stretch mb-5 mb-xl-8'
            chartHeight='250px'
            chartOrder={chartData}
          />
        </div>

        <div className='col-xl-4'>
          <TotalComplaint
            className='card-xl-stretch mb-xl-8'
            chartHeight='250px'
            complaintData={complaintData}
          />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <ChartBar className='card-xl-stretch mb-xl-8' chartOrderData={chartData} />
        </div>

        <div className='col-xl-4'>
          <ChartLine className='card-xl-stretch mb-5 mb-xl-8' chartWorkOrder={chartData} />
        </div>

        <div className='col-xl-4'>
          <ChartLine2 className='card-xl-stretch mb-xl-8' chartComplaintData={chartDataComplaint} />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
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
      </div>
      {/* end::Row */}
    </>
  )
}

export {ReportWorkVendor}
