import React, {useState, useEffect, FC} from 'react'

import {SalesReportWidget} from './components/SalesReportWidget'
import {TransactionWidget} from './components/TransactionWidget'
import {WaitingCostumerPay} from './components/WaitingCostumerPay'
import {TopSalesWidget} from './components/TopSalesWidget'
import {TotalOrderStore} from './components/TotalOrderStore'
import {TotalComplaint} from './components/TotalComplaint'
import {TotalReschedule} from './components/TotalReschedule'

import axios from 'axios'
import Select from 'react-select'
import {DatePicker} from 'antd'
import {Row, Col, Card, Form} from 'react-bootstrap'

const {RangePicker} = DatePicker

interface StoreItem {
  value: number | null
  label: string
  city_id: number | null
}

const DashboardStore: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const [orderData, setOrderData] = useState<any[]>([])

  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2)
    .toISOString()
    .split('T')[0]

  const [dateFrom, setDateFrom] = useState<any>(firstDayOfMonth)
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])

  const [store, setStore] = useState<StoreItem[]>([])
  const [selectedStore, setSelectedStore] = useState<any>({
    value: null,
    label: '',
    city_id: null,
  })

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

  useEffect(() => {
    const getStore = async () => {
      try {
        const response = await axios.get(`${apiUrl}/stores`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempStore = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.store_name,
            city_id: item.city_id,
          }))

          setStore(tempStore)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getStore()
  }, [])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <>
      <Row>
        <Col xxl={4} xl={4} lg={12} className='mb-5'>
          <Row>
            <Col xxl={4} xl={4} lg={6} className='d-flex align-items-center'>
              <h3 className='title-header fs-5 fw-normal'>Lihat Store Dashboard</h3>
            </Col>

            <Col xxl={8} xl={8} lg={12}>
              <div className='d-flex'>
                <Select
                  name='store_id'
                  className='form-control p-0'
                  classNamePrefix='select'
                  placeholder='Pilih Toko'
                  isSearchable={true}
                  options={store}
                  onChange={(newValue) => setSelectedStore(newValue)}
                />
              </div>
            </Col>
          </Row>
        </Col>

        <Col xxl={4} xl={4} lg={12} className='mb-5'>
          <Row>
            <Col xxl={4} xl={4} lg={4} className='d-flex align-items-center'>
              <h3 className='d-flex align-items-center fs-3 fw-normal mb-3'>Pilih Periode :</h3>
            </Col>

            <Col xxl={8} xl={8} lg={12}>
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
