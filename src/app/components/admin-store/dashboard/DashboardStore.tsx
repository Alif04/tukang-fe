import React, {useState, useEffect, FC} from 'react'

import {SalesReportWidget} from './components/SalesReportWidget'
import {TransactionWidget} from './components/TransactionWidget'
import {WaitingCostumerPay} from './components/WaitingCostumerPay'
import {TopSalesWidget} from './components/TopSalesWidget'
import {TotalOrderStore} from './components/TotalOrderStore'
import {TotalComplaint} from './components/TotalComplaint'
import {TotalReschedule} from './components/TotalReschedule'

import axios from 'axios'
import {DatePicker} from 'antd'
import {Row, Col, Card, Form} from 'react-bootstrap'

const {RangePicker} = DatePicker

const DashboardStore: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const today = new Date()

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2)
    .toISOString()
    .split('T')[0]

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const [orderData, setOrderData] = useState<any[]>([])
  const [dateFrom, setDateFrom] = useState<any>(firstDayOfMonth)
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])

  const fetchOrderData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/orders?date_from=${dateFrom}&date_to=${dateTo}&take=0`,
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

  return (
    <>
      <Row>
        <Col xxl={4} xl={6} lg={12} className='mb-5'>
          <Row>
            <Col xxl={4} xl={4} lg={4} className='d-flex align-items-center'>
              <h3 className='d-flex align-items-center fs-3 fw-normal mb-3'>Pilih Periode :</h3>
            </Col>

            <Col xxl={8} xl={8} lg={8}>
              <RangePicker
                className='date-range'
                onChange={(values) => {
                  if (values && values.length === 2) {
                    const dateFromFormatted = values[0]?.format('YYYY-MM-DD')
                    const dateToFormatted = values[1]?.format('YYYY-MM-DD')

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
      </Row>

      <Row className='gy-5 g-xl-8'>
        <Col xxl={4} xl={4} lg={12}>
          <SalesReportWidget
            className='card-xl-stretch mb-xl-8'
            backGroundColor='white'
            chartHeight='250px'
          />
        </Col>

        <Col xxl={4} xl={4} lg={12}>
          <TotalOrderStore
            className='card-xxl-stretch-50 card-xl-stretch-50 mb-xl-8 mb-5'
            chartHeight='220px'
          />
          <TotalComplaint className='card-xxl-stretch-50 card-xl-stretch-50 mb-xl-8 mb-5' />
        </Col>

        <Col xxl={4} xl={4} lg={12}>
          <WaitingCostumerPay
            className='card-xxl-stretch-50 mb-xl-8 mb-5'
            chartColor='success'
            chartHeight='150px'
          />
          <TotalReschedule className='card-xxl-stretch-50 card-xl-stretch-50 mb-xl-8 mb-5' />
        </Col>
      </Row>

      <Row className='gy-5 g-xl-8'>
        <Col xxl={4} xl={4} lg={12}>
          <TransactionWidget className='card-xl-stretch mb-xl-8' />
        </Col>

        <Col xxl={4} xl={4} lg={12}>
          <TopSalesWidget className='card-xl-stretch mb-xl-8' />
        </Col>

        <Col xxl={4} xl={4} lg={12}></Col>
      </Row>
    </>
  )
}

export {DashboardStore}
