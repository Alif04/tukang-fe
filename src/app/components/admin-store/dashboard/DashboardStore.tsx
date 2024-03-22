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
import {Row, Col} from 'react-bootstrap'

const {RangePicker} = DatePicker

interface StoreItem {
  value: number | null
  label: string
  city_id: number | null
}

const DashboardStore: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const userRole = localStorage.getItem('userRole')
  const userStore = localStorage.getItem('storeId')

  const [orderData, setOrderData] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  const today = new Date()

  const [firstDayOfMonth, setFirstDayOfMonth] = useState<any>(
    new Date(today.getFullYear(), today.getMonth(), 2).toISOString().split('T')[0]
  )

  const [todays, setTodays] = useState<any>(new Date().toISOString().split('T')[0])

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')

  const [store, setStore] = useState<StoreItem[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [member, setMember] = useState<any[]>([])

  const [selectedStore, setSelectedStore] = useState<any>({
    value: null,
    label: '',
    city_id: null,
  })

  const fetchOrderData = async () => {
    try {
      let url =
        !dateFrom && !dateTo
          ? `${apiUrl}/orders?order_by=desc&date_from=${firstDayOfMonth}&date_to=${todays}&store_id=${userStore}&take=0`
          : `${apiUrl}/orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&store_id=${userStore}&take=0`

      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data
      const chartDatas = response.data.monthlyOrders

      setOrderData(data)
      setChartData(chartDatas)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    const getStore = async () => {
      try {
        const response = await axios.get(`${apiUrl}/stores?take=0`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data.data)) {
          const tempStore = response.data.data.data.map((item: any) => ({
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

    const getSales = async () => {
      try {
        const response = await axios.get(`${apiUrl}/sales?take=0&top_best=true&order_by=desc`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        const data = response.data.data
        setSales(data)
      } catch (err) {
        console.error(err)
      }
    }

    const getMember = async () => {
      try {
        const response = await axios.get(`${apiUrl}/member`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        if (Array.isArray(response.data.data)) {
          const tempMember = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.member_number,
            full_name: item.full_name,
            email: item.email,
            phone_number: item.phone_number,
            whatsapp_number: item.whatsapp_number,
            address_1: item.address_1,
          }))

          setMember(tempMember)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getStore()
    getSales()
    getMember()
  }, [])

  useEffect(() => {
    fetchOrderData()
  }, [dateFrom, dateTo])

  return (
    <>
      <Row>
        <Col xxl={4} xl={4} lg={12} className='mb-5'>
          {userRole === 'Store CS' ? (
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
          ) : (
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
                      setDateFrom('')
                      setDateTo('')
                    }
                  }}
                />
              </Col>
            </Row>
          )}
        </Col>

        <Col xxl={4} xl={4} lg={12} className='mb-5'>
          {userRole === 'Store CS' && (
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
          )}
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
          <TransactionWidget orderData={orderData} />
        </Col>

        <Col xxl={4} xl={4} lg={12}>
          <TopSalesWidget className='card-xl-stretch mb-xl-8' salesData={sales} />
        </Col>

        <Col xxl={4} xl={4} lg={12}>
          <Row>
            <Col xxl={6} xl={6} lg={12}>
              <TotalComplaint orderData={orderData} className='card-xxl-stretch-50  mb-xl-8' />
            </Col>

            <Col xxl={6} xl={6} lg={12}>
              <TotalReschedule orderData={orderData} className='card-xxl-stretch-50  mb-xl-8' />
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
