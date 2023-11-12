import React, {FC, useState, useEffect} from 'react'

import {ChartBarOrderTukang} from './components/ChartBarOrderTukang'
import {ChartLineSurveyTukang} from './components/ChartLineSurveyTukang'
import {ChartLineComplaintTukang} from './components/ChartLineComplaintTukang'
import {ChartDonutWorkTukang} from './components/ChartDonutWorkTukang'
import {ChartDonutQuotationTukang} from './components/ChartDonutQuotationTukang'

import axios from 'axios'
import {Row, Col, Card} from 'react-bootstrap'

const initialStatusState = {
  orderIn: 0,
  quotationSent: 0,
  orderCancel: 0,
  orderSurvey: 0,
  workInProgress: 0,
  workDone: 0,
  complaint: 0,
  complaintResolve: 0,
  orderDone: 0,
}

type StatusToStateMap = {
  [statusName: string]: keyof typeof initialStatusState
}

const statusToStateMap: StatusToStateMap = {
  WORKREQ: 'orderIn',
  QUOTEIN: 'quotationSent',
  REJECT: 'orderCancel',
  SURVEYREQ: 'orderSurvey',
  WIP: 'workInProgress',
  WORKDONE: 'workDone',
  COMPLAINT: 'complaint',
  ACCEPTED: 'complaintResolve',
  DONE: 'orderDone',
}

const DashboardTukang: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const [orderData, setOrderData] = useState<any[]>([])

  const fetchOrderList = async () => {
    try {
      const response = await axios.get(`${apiUrl}/orders?take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      const data = response.data.data
      setOrderData(data)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchOrderList()
  }, [])

  // Catch Value From Response API by Status
  const [statusState, setStatusState] = useState(initialStatusState)

  useEffect(() => {
    if (orderData) {
      const storedStatus = sessionStorage.getItem('statusData')
      const statusData = storedStatus ? JSON.parse(storedStatus) : []

      for (const statusName in statusToStateMap) {
        const stateKey = statusToStateMap[statusName]
        const desiredStatus = statusData.find((status: any) => status.category === statusName)

        if (desiredStatus) {
          const statusValue = desiredStatus.value
          const orderCount = orderData.filter((item: any) => item.status.id === statusValue).length

          setStatusState((prevState) => ({
            ...prevState,
            [stateKey]: orderCount,
          }))
        }
      }
    }
  }, [orderData])

  const {
    orderIn,
    quotationSent,
    orderCancel,
    orderSurvey,
    workInProgress,
    workDone,
    complaint,
    complaintResolve,
    orderDone,
  } = statusState

  return (
    <>
      <section className='dashboard-tukang'>
        <Card className='mb-5'>
          <Card.Body className='mt-5 mb-5'>
            <Row className='justify-content-md-center'>
              <Col>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal'>{orderIn}</h1>
                  <p className='text-center'>Order in</p>
                </div>
              </Col>

              <Col>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal'>{quotationSent}</h1>
                  <p className='text-center'>Quotation sent</p>
                </div>
              </Col>

              <Col>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal'>{orderCancel}</h1>
                  <p className='text-center'>Order cancel</p>
                </div>
              </Col>

              <Col>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal'>{orderSurvey}</h1>
                  <p className='text-center'>Order survey</p>
                </div>
              </Col>

              <Col>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal'>{workInProgress}</h1>
                  <p className='text-center'>Work in Progress</p>
                </div>
              </Col>

              <Col>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal text-center'>{workDone}</h1>
                  <p className='fw-normal'>Work done</p>
                </div>
              </Col>

              <Col>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal text-center'>{complaint}</h1>
                  <p className='fw-normal text-danger'>Complaint</p>
                </div>
              </Col>

              <Col>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal text-center'>{complaintResolve}</h1>
                  <p className='fw-normal text-center'>Complaint resolve</p>
                </div>
              </Col>

              <Col>
                <div className='d-flex flex-column align-items-center gap-2'>
                  <h1 className='fw-normal text-center'>{orderDone}</h1>
                  <p className='fw-normal text-center'>Order Done</p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row className='row gy-5 g-xl-8'>
          <Col xl={4}>
            <ChartBarOrderTukang className='card-xl-stretch mb-xl-8' />
          </Col>
          <Col xl={4}>
            <ChartLineSurveyTukang className='card-xl-stretch mb-xl-8' />
          </Col>
          <Col xl={4}>
            <ChartLineComplaintTukang className='card-xl-stretch mb-5 mb-xl-8' />
          </Col>
        </Row>

        <Row className='row gy-5 g-xl-8'>
          <Col xl={4}>
            <ChartDonutQuotationTukang className='card-xl-stretch mb-xl-8' chartHeight='300px' />
          </Col>
          <Col xl={4}>
            <ChartDonutWorkTukang className='card-xl-stretch mb-xl-8' chartHeight='300px' />
          </Col>
        </Row>
      </section>
    </>
  )
}

export {DashboardTukang}
