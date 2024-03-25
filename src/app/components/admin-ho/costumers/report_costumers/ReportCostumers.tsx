import React, {FC, useState, useEffect} from 'react'

import {ChartPie} from './components/ChartPie'
import {ChartPie2} from './components/ChartPie2'
import {ChartPie3} from './components/ChartPie3'
import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {ChartLine2} from './components/ChartLine2'
import {ChartDonut} from './components/ChartDonut'
import {ChartDonut2} from './components/ChartDonut2'
import {BestCostumers} from './components/BestCostumers'

import axios from 'axios'
import Select from 'react-select'
import {Card, Row, Col} from 'react-bootstrap'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

const ReportCostumerHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const today = new Date()
  const todays = new Date().toISOString().split('T')[0]
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2)
    .toISOString()
    .split('T')[0]

  const [orderData, setOrderData] = useState<any[]>([])
  const [workOrderData, setWorkOrderData] = useState<any[]>([])
  const [complaintData, setComplaintData] = useState<any[]>([])
  const [csiData, setCsiData] = useState<any[]>([])

  const [chartOrder, setChartOrder] = useState<any[]>([])
  const [chartWorkOrder, setChartWorkOrder] = useState<any[]>([])
  const [chartComplaint, setChartComplaint] = useState<any[]>([])

  const [member, setMember] = useState<any[]>([])
  const [memberOption, setMemberOption] = useState<any[]>([])
  const memberOptions = [{value: null, label: 'All Member'}, ...memberOption]
  const [selectedMember, setSelectedMember] = useState<any>({
    value: null,
    label: 'All Member',
  })

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')

  const date =
    dateFrom && dateTo
      ? `&date_from=${dateFrom}&date_to=${dateTo}`
      : `&date_from=${firstDayOfMonth}&date_to=${todays}`

  const memberId = selectedMember.value ? `&member_id=${selectedMember.value}` : ''

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
          label: item.full_name,
        }))

        setMember(response.data.data)
        setMemberOption(tempMember)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getOrder = async () => {
    try {
      const response = await axios.get(`${apiUrl}/orders?order_by=desc&take=0${date}${memberId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data
      const chartDatas = response.data.monthlyOrders.slice(1, 7)

      setOrderData(data)
      setChartOrder(chartDatas)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getWorkOrder = async () => {
    try {
      const response = await axios.get(`${apiUrl}/reports/work-orders?take=0${memberId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

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
      const response = await axios.get(`${apiUrl}/complaints?order_by=desc${memberId}`, {
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
      setChartComplaint(chartDatas)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getCSI = async () => {
    try {
      const response = await axios.get(`${apiUrl}/csi?take=0${memberId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data
      setCsiData(data)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    getMember()
    getOrder()
    getWorkOrder()
    getComplaint()
    getCSI()
  }, [dateFrom, dateTo, selectedMember?.value])

  return (
    <>
      {/* begin::Row */}
      <div className='row g-5 g-xl-8 mb-5'>
        <div className='col-xl-4'>
          <Row>
            <Col xxl={4} xl={4} lg={6} className='d-flex align-items-center'>
              <h3 className='title-header fs-5 fw-normal'>Lihat Member Dashboard</h3>
            </Col>

            <Col xxl={8} xl={8} lg={12}>
              <div className='d-flex'>
                <Select
                  name='store_id'
                  className='form-control p-0'
                  classNamePrefix='select'
                  placeholder='Pilih Member'
                  isSearchable={true}
                  options={memberOptions}
                  onChange={(newValue) => setSelectedMember(newValue)}
                />
              </div>
            </Col>
          </Row>
        </div>

        <div className='col-xl-4'>
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
        </div>

        <div className='col-xl-4'></div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <ChartPie className='card-xl-stretch mb-5' chartHeight='240px' memberData={member} />
        </div>

        <div className='col-xl-4'>
          <ChartPie2 className='card-xl-stretch mb-5' chartHeight='200px' csiData={csiData} />
        </div>

        <div className='col-xl-4'>
          <ChartPie3
            className='card-xl-stretch mb-5'
            chartHeight='230px'
            complaintData={complaintData}
          />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <ChartBar className='card-xl-stretch mb-xl-8' chartOrderData={chartOrder} />
        </div>

        <div className='col-xl-4'>
          <ChartLine className='card-xl-stretch mb-5 mb-xl-8' chartWorkOrderData={chartWorkOrder} />
        </div>

        <div className='col-xl-4'>
          <ChartLine2 className='card-xl-stretch mb-xl-8' chartComplaintData={chartComplaint} />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <ChartDonut
            className='card-xl-stretch mb-xl-8'
            chartHeight='300px'
            complaintData={complaintData}
          />
        </div>

        <div className='col-xl-4'>
          <ChartDonut2
            className='card-xl-stretch mb-5 mb-xl-8'
            chartHeight='300px'
            workOrderData={workOrderData}
          />
        </div>

        <div className='col-xl-4'>
          <BestCostumers className='card-xl-stretch mb-5 mb-xl-8' memberData={member} />
        </div>
      </div>
      {/* end::Row */}
    </>
  )
}

export {ReportCostumerHO}
