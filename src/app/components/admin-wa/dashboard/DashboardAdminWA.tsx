import React, {useState, useEffect, FC} from 'react'

import './DashboardAdminWA.css'

import {ChartBarSurvey} from './components/ChartBarSurvey'
import {MoreInformation} from './components/MoreInformation'

import axios from 'axios'
import dayjs from 'dayjs'
import duration from "dayjs/plugin/duration";
import {Row, Col, Card, Button} from 'react-bootstrap'
import {Table, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'

const {RangePicker} = DatePicker
dayjs.extend(duration);

const apiChat = process.env.REACT_APP_API_CHAT_URL || process.env.REACT_APP_API_URL || ''
const DashboardAdminWA: FC = () => {
  const userRole = localStorage.getItem('userRole') as string;
  const [avgResponseTime, setAvgResponseTime] = useState<number>(0);
  const [avgFirstResponseTime, setAvgFirstResponseTime] = useState<number>(0);
  const [totalAssign, setTotalAssign] = useState<any>(0);
  const [totalResolve, setTotalResolved] = useState<any>(0);
  const [totalUnAssign, setTotalUnAssing] = useState<any>(0);
  const today = new Date()
  const [dateFrom, setDateFrom] = useState<any>(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])
  const userName = localStorage.getItem('username') as string
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }
  const fetchNewChatAssign = async () => {
    let query = `status=Assigned&user=${userRole}&userName=${userName}`
    try {
      const res = await axios.get(`${apiChat}/all-chat-assign?${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })

      if (res.data) {
        setTotalAssign(res.data.chats.length)
        //  console.log(res.data.chats);
      }
    } catch (err) {
      console.error('Failed to fetch new chats', err)
    }
  }
  const fetchNewChatUnAssign = async () => {
    let query = `status=Unassigned&user=${userRole}`
    try {
      const res = await axios.get(`${apiChat}/all-chat-assign?${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })

      if (res.data) {
        setTotalUnAssing(res.data.chats.length)
        //  console.log(res.data.chats);
      }
    } catch (err) {
      console.error('Failed to fetch new chats', err)
    }
  }
  const fetchNewChatResolve = async () => {
    let query = `status=Resolved&user=${userRole}&userName=${userName}`
    try {
      const res = await axios.get(`${apiChat}/all-chat-assign?${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })

      if (res.data) {
        setTotalResolved(res.data.chats.length)
        // console.log(res.data.chats);
        
        //  console.log(res.data.chats);
      }
    } catch (err) {
      console.error('Failed to fetch new chats', err)
    }
  }
  const fetchClosedChat = async () => {
    let query = `userName=${userName}`
    try {
      const res = await axios.get(`${apiChat}/all-closed-chat?${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })

      if (res.data) {
        // setTotalResolved(res.data.chats.length)
        const totalAvgResponseTime = res.data.closedChats.reduce(
          (acc: number, chat: { avgResponseTime: number }) => acc + chat.avgResponseTime,
          0
        );
        setAvgResponseTime(totalAvgResponseTime)
        // console.log("Total Average Response Time:", totalAvgResponseTime);
        
        //  console.log(res.data.chats);
      }
    } catch (err) {
      console.error('Failed to fetch new chats', err)
    }
  }
  const fetchFirstChat = async () => {
    let query = `userName=${userName}`
    try {
      const res = await axios.get(`${apiChat}/first-response-handling?${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })

      if (res.data) {
        console.log(res.data);
        const totalTime = Object.values(res.data.firstResponseTimes).reduce(
          (acc: number, chat: any) => acc + chat.responseTime,
          0
        );
        // setTotalResolved(res.data.chats.length)
        // const totalAvgResponseTime = res.data.closedChats.reduce(
        //   (acc: number, chat: { avgResponseTime: number }) => acc + chat.avgResponseTime,
        //   0
        // );
        setAvgFirstResponseTime(totalTime)
        // console.log("Total Average Response Time:", totalAvgResponseTime);
        
        //  console.log(res.data.chats);
      }
    } catch (err) {
      console.error('Failed to fetch new chats', err)
    }
  }
useEffect(() => {
  fetchNewChatAssign()
  fetchNewChatUnAssign()
  fetchNewChatResolve()
  fetchClosedChat()
  fetchFirstChat()
}, [])

  const formatTime = (ms: number) => {
    const duration = dayjs.duration(ms);
    const hours = String(duration.hours()).padStart(2, "0");
    const minutes = String(duration.minutes()).padStart(2, "0");
    const seconds = String(duration.seconds()).padStart(2, "0");
    const milliseconds = String(duration.milliseconds()).padStart(3, "0");
    return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
  };
  return (
    <section id='dashboard-tukang'>
      <Row>
        <Col xxl={6} xl={6} lg={12} className='mb-5'>
          <Row>
            <Col xxl={3} xl={3} lg={3} className='d-flex align-items-center'>
              <h3 className='title-header fs-5 fw-normal'>Rentang Waktu</h3>
            </Col>

            <Col xxl={5} xl={5} lg={5}>
              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range w-100 mb-3'
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
            </Col>

            <Col xxl={4} xl={4} lg={4}>
              <Button
                className='btn-dark-primary button-submit m-0'
                // disabled={loadingButton}
                // onClick={handleSubmitFilter}
              >
                Sumbit
              </Button>
            </Col>
          </Row>
        </Col>

        <Col xxl={6} xl={6} lg={12} className='mb-5'></Col>
      </Row>

      <Row className='g-5 g-xl-8 mb-5'>
    
        <Col xl={6}>
        <Card className="text-center p-4 shadow-sm">
      <h2 className="fw-bold">{formatTime(avgFirstResponseTime)}</h2>
      <p className="text-muted">Average First Response Time</p>
    </Card>
        </Col>
        <Col xl={6}>
        <Card className="text-center p-4 shadow-sm">
      <h2 className="fw-bold">{formatTime(avgResponseTime)}</h2>
      <p className="text-muted">Average Response Time</p>
    </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={5} md={12} className='mb-3'>
          <MoreInformation
            className='card-xl-stretch'
            totalAssign={totalAssign}
            totalResolve={totalResolve}
            totalUnAssign={totalUnAssign}
          />
        </Col>

        {/* <Col lg={7} md={12} className='mb-3'>
          <ChartBarSurvey className='card-xl-stretch' orderData={chartDataOrder} />
        </Col> */}
      </Row>
    </section>
  )
}

export {DashboardAdminWA}
