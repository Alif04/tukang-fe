import React, {FC, useState, useEffect} from 'react'

import './DashboardOrder.css'

import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {MoreInformation} from './components/MoreInformation'
import {TableList} from './components/TableList'

import axios from 'axios'
import {DatePicker} from 'antd'
import {Card, Row, Col, Button} from 'react-bootstrap'

const {RangePicker} = DatePicker

const initialStatusState = {
  totalOrder: 0,
  survey: 0,
  onProgress: 0,
  complete: 0,
  reschedule: 0,
  cancel: 0,
  refund: 0,
  waitingSurvey: 0,
  waitingPayment: 0,
  waitingQuotation: 0,
}

type StatusToStateMap = {
  [statusName: string]: keyof typeof initialStatusState
}

const statusToStateMap: StatusToStateMap = {
  PICKLIST: 'totalOrder',
  SURVEYREQ: 'survey',
  WIP: 'onProgress',
  SURVEYDONE: 'complete',
  RESCHEDULE: 'reschedule',
  REJECT: 'cancel',
  REFUND: 'refund',
  WAITINGSURVEY: 'waitingSurvey',
  UNPAID: 'waitingPayment',
  QUOTEIN: 'waitingQuotation',
}

const DashboardOrderStore: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const userStore = localStorage.getItem('storeId')
  const [loadingButton, setLoadingButton] = useState(false)

  const [orderData, setOrderData] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [orderList, setOrderList] = useState<any[]>([])

  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2)
    .toISOString()
    .split('T')[0]

  const [dateFrom, setDateFrom] = useState<any>(firstDayOfMonth)
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])

  const fetchOrderList = async (queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/orders?order_by=desc&take=0${queryparams}`

    if (userStore) {
      apiUrlWithParams += `&store_id=${userStore}`
    }

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data
      setOrderList(data)

      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getReportOrder = async () => {
    try {
      const response = await axios.get(`${apiUrl}/reports/orders`, {
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
          costumer_name: item?.members?.full_name ?? '-',
          service_name:
            item?.payment_type === 'survey'
              ? item?.m_order_details[0]?.item_notes ?? '-'
              : item?.m_order_details[0]?.item?.service_name ?? '-',
          total: `Rp. ${parseInt(item?.grand_total || 0).toLocaleString('id')}`,
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
    fetchOrderList('')
    getReportOrder()
  }, [])

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

  const {
    totalOrder,
    survey,
    onProgress,
    complete,
    reschedule,
    cancel,
    refund,
    waitingSurvey,
    waitingPayment,
    waitingQuotation,
  } = statusState

  const handleSubmitFilter = async () => {
    setLoadingButton(true)
    let queryparams = ``

    const valueCheck = (key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        queryparams += `${key}${value}`
      }
    }

    valueCheck(`&date_from=`, dateFrom)
    valueCheck(`&date_to=`, dateTo)

    await fetchOrderList(queryparams)
    await getReportOrder()

    setLoadingButton(false)
  }

  return (
    <section id='dashboard-order'>
      <Row className='g-5 g-xl-8'>
        <Col xxl={5} xl={5} lg={12} className='mb-5'>
          <Row>
            <Col
              xxl={12}
              xl={12}
              lg={12}
              md={12}
              className='d-flex justify-content-between align-items-center'
            >
              <h3 className='fs-3 fw-normal mb-3 w-50'>Pilih Periode</h3>

              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range ms-3 me-3 w-100'
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

              <Button
                className='btn-dark-primary button-submit'
                disabled={loadingButton}
                onClick={handleSubmitFilter}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* begin::Row */}
      <div className='row g-5 g-xl-8 mb-5'>
        <div className='col-xl-12'>
          <Card>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Order bulan ini</div>

              <Row className='justify-content-md-center'>
                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{totalOrder}</h1>
                    <p className='text-center'>Total Order</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{survey}</h1>
                    <p className='text-center'>Order Survey</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{onProgress}</h1>
                    <p className='text-center'>Order sedang dalam pengerjaan</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{complete}</h1>
                    <p className='text-center'>Order Selesai</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{reschedule}</h1>
                    <p className='text-danger text-center'>Order yang dijadwalkan ulang</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{cancel}</h1>
                    <p className='text-danger text-center'>Order yang dibatalkan</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{refund}</h1>
                    <p className='text-danger text-center'>Order yang dikembalikan dana</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{waitingSurvey}</h1>
                    <p className='text-brown fw-bold text-center'>Menunggu Survey</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{waitingQuotation}</h1>
                    <p className='text-brown fw-bold text-center'>Menunggu Quotation</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{waitingPayment}</h1>
                    <p className='text-brown fw-bold text-center'>Menunggu Bayar</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8 mb-5'>
        <div className='col-xl-4'>
          <MoreInformation className='card-xl-stretch mb-xl-8' orderData={orderList} />
        </div>
        <div className='col-xl-4'>
          <ChartBar className='card-xl-stretch mb-xl-8' chartOrderData={chartData} />
        </div>
        <div className='col-xl-4'>
          <ChartLine className='card-xl-stretch mb-xl-8' orderData={chartData} />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-12'>
          <TableList className='card-xl-stretch mb-5 mb-xl-8' orderData={orderData} />
        </div>
      </div>
      {/* end::Row */}
    </section>
  )
}

export {DashboardOrderStore}
