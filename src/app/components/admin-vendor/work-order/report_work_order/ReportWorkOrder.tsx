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

const ReportWorkVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const vendorId = localStorage.getItem('vendor_id')

  const [orderData, setOrderData] = useState<any[]>([])
  const [workOrderData, setWorkOrderData] = useState<any[]>([])
  const [complaintData, setComplaintData] = useState<any[]>([])

  const [chartData, setChartData] = useState<any[]>([])
  const [chartWorkOrder, setChartWorkOrder] = useState<any[]>([])
  const [chartDataComplaint, setChartDataComplaint] = useState<any[]>([])

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
      const response = await axios.get(`${apiUrl}/reports/orders?vendor_id=${vendorId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data
      const chartDatas = response.data.monthlyOrders.slice(1, 7)

      setChartData(chartDatas)
      return data
    } catch (error) {
      console.error(error)
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

      console.log(chartDatas)

      setWorkOrderData(data)
      setChartWorkOrder(chartDatas)
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const getComplaint = async () => {
    try {
      const response = await axios.get(`${apiUrl}/complaints?order_by=desc&vendor_id=${vendorId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

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

  return (
    <>
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
            workOrderData={workOrderData}
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
          <ChartLine className='card-xl-stretch mb-5 mb-xl-8' chartWorkOrder={chartWorkOrder} />
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
