import React, {useState, useEffect, FC} from 'react'

import './DashboardTukang.css'

import {ChartBarSurvey} from './components/ChartBarSurvey'
import {MoreInformation} from './components/MoreInformation'
import {TableList} from './components/TableList'

import axios from 'axios'
import {DatePicker} from 'antd'
import {Row, Col, Card, Button} from 'react-bootstrap'

const {RangePicker} = DatePicker

const initialStatusState = {
  survey: 0,
  onProgress: 0,
  complete: 0,
  reschedule: 0,
  cancel: 0,
  refund: 0,
  waitingSurvey: 0,
  waitingQuotation: 0,
  waitingPayment: 0,
}

type StatusToStateMap = {
  [statusName: string]: keyof typeof initialStatusState
}

const statusToStateMap: StatusToStateMap = {
  SURVEYREQ: 'survey',
  WIP: 'onProgress',
  WORKEND: 'complete',
  RESCHEDULE: 'reschedule',
  CANCELED: 'cancel',
  REFUND: 'refund',
  WORKREQ: 'waitingSurvey',
  QUOTEIN: 'waitingQuotation',
  WORKRELATED: 'waitingPayment',
}

const DashboardTukang: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const tukangId = localStorage.getItem('tukang_id')

  const [loadingButton, setLoadingButton] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [orderData, setOrderData] = useState<any[]>([])
  const [orderList, setOrderList] = useState<any[]>([])
  const [chartDataOrder, setChartDataOrder] = useState<any[]>([])

  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2)
    .toISOString()
    .split('T')[0]

  const [dateFrom, setDateFrom] = useState<any>(firstDayOfMonth)
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])

  const getWorkOrderList = async (queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/work-orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&tukang_id=${tukangId}${queryparams}`

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
      setCurrentPage(response.data.page)
      setTotalData(response?.data?.total ?? 0)

      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const reportWorkOrder = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/reports/work-orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&take=0&tukang_id=${tukangId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      const chartDatas = response.data.data.monthlyWorkOrders

      const fromDate = new Date(dateFrom)
      const toDate = new Date(dateTo)

      const fromMonth = fromDate.getMonth()
      const toMonth = toDate.getMonth()

      const startIndex = fromMonth
      const endIndex = toMonth + 1

      const slicedData = chartDatas.slice(startIndex, endIndex)
      setChartDataOrder(slicedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewOrder = async (queryparams: any) => {
    const apiData = await getWorkOrderList(queryparams)

    if (!apiData) {
      console.error('No data received from getWorkOrderList')
      return []
    }

    try {
      const workOrderData = apiData.map((item: any) => {
        let data

        data = {
          order_id: item.id,
          costumer_name: item?.order?.members?.full_name ?? '-',
          service_name:
            item.order?.payment_type === 'survey'
              ? item.order?.m_order_details[0]?.item_notes ?? '-'
              : item.order?.m_order_details[0]?.item?.service_name ?? '-',
        }

        return data
      })

      return workOrderData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (queryparams: any) => {
    const data = await ViewOrder(queryparams)
    setOrderData(data)
  }

  useEffect(() => {
    fetchData('')
  }, [])

  useEffect(() => {
    reportWorkOrder()
  }, [])

  // Catch Value From Response API by Status
  const [statusState, setStatusState] = useState(initialStatusState)

  useEffect(() => {
    if (orderList) {
      const storedStatus = sessionStorage.getItem('statusData')
      const statusData = storedStatus ? JSON.parse(storedStatus) : []

      for (const statusName in statusToStateMap) {
        const stateKey = statusToStateMap[statusName]
        const desiredStatus = statusData?.find((status: any) => status?.category === statusName)

        if (desiredStatus) {
          const statusValue = desiredStatus.value
          const orderCount = orderList.filter(
            (item: any) => item?.status?.id === statusValue
          )?.length

          setStatusState((prevState) => ({
            ...prevState,
            [stateKey]: orderCount,
          }))
        }
      }
    }
  }, [orderList])

  const {
    survey,
    onProgress,
    complete,
    reschedule,
    cancel,
    refund,
    waitingSurvey,
    waitingQuotation,
    waitingPayment,
  } = statusState

  const handleSubmitFilter = async () => {
    setLoadingButton(true)

    const queryparams = `&date_from=${dateFrom}&date_to=${dateTo}`

    const data = await ViewOrder(queryparams)
    setOrderList(data)

    await reportWorkOrder()

    setLoadingButton(false)
  }

  return (
    <section id='dashboard-ho'>
      <Row>
        <Col xxl={6} xl={6} lg={12} className='mb-5'>
          <Row>
            <Col xxl={4} xl={4} lg={4} className='d-flex align-items-center'>
              <h3 className='title-header fs-5 fw-normal'>Pilih rentang waktu</h3>
            </Col>

            <Col xxl={4} xl={4} lg={4}>
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

            <Col xxl={4} xl={4} lg={4}>
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

        <Col xxl={6} xl={6} lg={12} className='mb-5'></Col>
      </Row>

      <Row className='g-5 g-xl-8 mb-5'>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Order</div>

              <Row className='justify-content-md-center'>
                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{totalData}</h1>
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
                    <h1 className='fw-normal'>{cancel}</h1>
                    <p className='fs-6 text-danger text-center'>Cancel</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{refund}</h1>
                    <p className='fs-6 text-danger text-center'>Refund</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{waitingSurvey}</h1>
                    <p className='fs-6 text-brown text-center'>Menunggu Survey</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{waitingQuotation}</h1>
                    <p className='fs-6 text-brown text-center'>Menunggu Quotation</p>
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
        <Col lg={5} md={12} className='mb-3'>
          <MoreInformation className='card-xl-stretch' orderData={orderData} />
        </Col>

        <Col lg={7} md={12} className='mb-3'>
          <ChartBarSurvey className='card-xl-stretch' orderData={chartDataOrder} />
        </Col>
      </Row>

      <Row className='g-5 g-xl-8 mb-5'>
        <Col md={12}>
          <TableList
            className='card-xl-stretch mb-5 mb-xl-8'
            orderData={orderData}
            currentPage={currentPage}
          />
        </Col>
      </Row>
    </section>
  )
}

export {DashboardTukang}
