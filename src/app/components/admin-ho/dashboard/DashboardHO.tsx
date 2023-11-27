import React, {useState, useEffect, FC} from 'react'

import './DashboardHO.css'

import {ChartBarPerformance} from './components/ChartBarPerformance'
import {ChartBarOrder} from './components/ChartBarOrder'
import {ChartBarSurvey} from './components/ChartBarSurvey'
import {MoreInformation} from './components/MoreInformation'
import {TableList} from './components/TableList'

import axios from 'axios'
import Select from 'react-select'
import {DatePicker} from 'antd'
import {Row, Col, Card, Form} from 'react-bootstrap'

const {RangePicker} = DatePicker

interface StoreItem {
  value: string
  label: string
}

const initialStatusState = {
  totalOrder: 0,
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
  BOOK: 'totalOrder',
  SURVEYREQ: 'survey',
  WIP: 'onProgress',
  SURVEYDONE: 'complete',
  RESCHEDULE: 'reschedule',
  WORKRELATED: 'waitingPayment',
}

const DashboardHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const [orderData, setOrderData] = useState<any[]>([])
  const [orderList, setOrderList] = useState<any[]>([])

  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2)
    .toISOString()
    .split('T')[0]

  const [dateFrom, setDateFrom] = useState<any>(firstDayOfMonth)
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])
  const [store, setStore] = useState<StoreItem[]>([])
  const [searchByStore, setSearchByStore] = useState<any>('')

  const handleChangeSelectStore = (element: any) => {
    const updatedStoreId = element.value
    setSearchByStore(updatedStoreId)
  }

  const fetchOrderList = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&take=0`,
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
          service_name: item.m_order_details[0].item.service_name,
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
  }, [orderList])

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

  const {totalOrder, survey, onProgress, complete, reschedule, waitingPayment} = statusState

  return (
    <section id='dashboard-ho'>
      <Row>
        <Col xxl={4} xl={4} lg={12} className='mb-5'>
          <Row>
            <Col xxl={4} xl={4} lg={4} className='d-flex align-items-center'>
              <h3 className='title-header fs-7 fw-normal'>Lihat Store Dashboard</h3>
            </Col>

            <Col xxl={8} xl={8} lg={8}>
              <Select
                name='store_id'
                className='form-control p-0'
                classNamePrefix='select'
                placeholder='Pilih Toko'
                isSearchable={true}
                options={store}
                onChange={(element) => handleChangeSelectStore(element)}
              />
            </Col>
          </Row>
        </Col>

        <Col xxl={4} xl={4} lg={12} className='mb-5'>
          <Row>
            <Col xxl={4} xl={4} lg={4} className='d-flex align-items-center'>
              <h3 className='title-header fs-7 fw-normal'>Pilih rentang waktu</h3>
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

        <Col xxl={4} xl={4} lg={12} className='mb-5'></Col>
      </Row>

      <Row className='g-5 g-xl-8 mb-5'>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Order</div>

              <Row className='justify-content-md-center'>
                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{totalOrder}</h1>
                    <p className='fs-6 text-center'>Total Order</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{survey}</h1>
                    <p className='fs-6 text-center'>Survey</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{onProgress}</h1>
                    <p className='fs-6 text-center'>On Progress</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{complete}</h1>
                    <p className='fs-6 text-center'>Complete</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{reschedule}</h1>
                    <p className='fs-6 text-danger text-center'>Reschedule</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{waitingPayment}</h1>
                    <p className='fs-6 text-brown fw-bold text-center'>Menunggu Bayar</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xxl={8}>
          <Row className='g-5 g-xl-8 mb-5'>
            <Col xl={6}>
              <MoreInformation className='card-xl-stretch mb-xl-8' orderData={orderData} />
            </Col>
            <Col xl={6}>
              <ChartBarSurvey className='card-xl-stretch mb-xl-8' />
            </Col>
          </Row>

          <Row className='g-5 g-xl-8 mb-5'>
            <Col xl={6}>
              <ChartBarOrder className='card-xl-stretch mb-xl-8' />
            </Col>
            <Col xl={6}>
              <ChartBarPerformance className='card-xl-stretch mb-xl-8' />
            </Col>
          </Row>
        </Col>

        <Col xxl={4}>
          <TableList className='card-xl-stretch mb-5 mb-xl-8' orderData={orderData} />
        </Col>
      </Row>
    </section>
  )
}

export {DashboardHO}
