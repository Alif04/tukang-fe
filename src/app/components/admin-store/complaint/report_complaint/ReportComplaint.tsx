import React, {FC, useState, useEffect} from 'react'

import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {ChartLine2} from './components/ChartLine2'
import {ChartDonut} from './components/ChartDonut'
import {ChartDonut2} from './components/ChartDonut2'
import {TableList} from './components/TableList'

import axios from 'axios'
import {DatePicker} from 'antd'
import Card from 'react-bootstrap/Card'

const {RangePicker} = DatePicker

const initialStatusState = {
  newComplaint: 0,
  rejectComplaint: 0,
  acceptedComplaint: 0,
  resurveyComplaint: 0,
  reworkComplaint: 0,
  rescheduleComplaint: 0,
  refundComplaint: 0,
  nonWorkRelated: 0,
  workRelated: 0,
  notResolved: 0,
  resolved: 0,
}

type StatusToStateMap = {
  [statusName: string]: keyof typeof initialStatusState
}

const statusToStateMap: StatusToStateMap = {
  INVESTIGATE: 'newComplaint',
  REJECT: 'rejectComplaint',
  ACCEPTED: 'acceptedComplaint',
  RESURVEY: 'resurveyComplaint',
  REWORK: 'reworkComplaint',
  RESCHEDULE: 'rescheduleComplaint',
  REFUND: 'refundComplaint',
  NONWORKRELATED: 'nonWorkRelated',
  WORKRELATED: 'workRelated',
  NOTRESOLVED: 'notResolved',
  RESOLVED: 'resolved',
}

const ReportComplaintStore: FC = () => {
  const [complaintData, setComplaintData] = useState<any[]>([])
  const [complaintList, setComplaintList] = useState<any>()

  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2)
    .toISOString()
    .split('T')[0]

  const [dateFrom, setDateFrom] = useState<any>(firstDayOfMonth)
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchComplaintList = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL

      const response = await axios.get(
        `${apiUrl}/complaints?date_from=${dateFrom}&date_to=${dateTo}&take=0`,
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
      setComplaintList(data)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewComplaint = () => {
    try {
      const apiData = complaintList.map((item: any) => {
        let data

        const complaintDate = new Date(item.complaint_date)

        data = {
          order_id: item.orders.id,
          complaint_date: formatDate(complaintDate),
          complaint_status: item.status.category,
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
    fetchComplaintList()
  }, [dateFrom, dateTo])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ViewComplaint()
        setComplaintData(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [complaintList])

  // Catch Value From Response API by Status
  const [statusState, setStatusState] = useState(initialStatusState)

  useEffect(() => {
    if (complaintList) {
      const storedStatus = sessionStorage.getItem('statusData')
      const statusData = storedStatus ? JSON.parse(storedStatus) : []

      for (const statusName in statusToStateMap) {
        const stateKey = statusToStateMap[statusName]
        const desiredStatus = statusData.find((status: any) => status.category === statusName)

        if (desiredStatus) {
          const statusValue = desiredStatus.value
          const complaintsCount = complaintList.filter(
            (item: any) => item.complaint_status === statusValue
          ).length

          setStatusState((prevState) => ({
            ...prevState,
            [stateKey]: complaintsCount,
          }))
        }
      }
    }
  }, [complaintList])

  const {
    newComplaint,
    rejectComplaint,
    acceptedComplaint,
    resurveyComplaint,
    reworkComplaint,
    rescheduleComplaint,
    refundComplaint,
    nonWorkRelated,
    workRelated,
    notResolved,
    resolved,
  } = statusState

  return (
    <>
      {/* begin::Row */}
      <div className='row'>
        <div className='col-xxl-4 col-xl-6 col-lg-12 mb-5'>
          <div className='row'>
            <div className='col-xxl-4 col-xl-4 col-lg-4 d-flex align-items-center '>
              <h3 className='d-flex align-items-center fs-3 fw-normal mb-3'>Pilih Periode :</h3>
            </div>

            <div className='col-xxl-8 col-xl-8 col-lg-8'>
              <RangePicker
                className='date-range ms-3'
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
            </div>
          </div>
        </div>
      </div>

      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body style={{minHeight: '150px'}}>
              <div className='fs-5 fw-normal mb-5'>Complaint bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                <div className='order-in'>
                  <div className='d-flex flex-column align-items-center ms-5 gap-2'>
                    <h1 className='fw-normal'>{newComplaint}</h1>
                    <p>NEW</p>
                  </div>
                </div>

                <div className='order-pending'>
                  <div className='d-flex flex-column align-items-center ms-5 me-5 gap-2'>
                    <h1 className='fw-normal'>{rejectComplaint}</h1>
                    <p>REJECTED</p>
                  </div>
                </div>

                <div className='order-cancel'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>{acceptedComplaint}</h1>
                    <p className='text-danger'>ACCEPTED</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body style={{minHeight: '150px'}}>
              <div className='fs-5 fw-normal mb-5'>Pekerjaan Complaint bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                <div className='survey'>
                  <div className='d-flex flex-column align-items-center ms-5 gap-2'>
                    <h1 className='fw-normal'>{resurveyComplaint}</h1>
                    <p>RESURVEY</p>
                  </div>
                </div>

                <div className='wip'>
                  <div className='d-flex flex-column align-items-center ms-5 me-5 gap-2'>
                    <h1 className='fw-normal'>{reworkComplaint}</h1>
                    <p>REWORK</p>
                  </div>
                </div>

                <div className='done'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>{rescheduleComplaint}</h1>
                    <p className='text-success'>RESECHEDULE</p>
                  </div>
                </div>

                <div className='complaint'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>{refundComplaint}</h1>
                    <p className='text-danger'>REFUND</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body style={{minHeight: '150px'}}>
              <div className='fs-5 fw-normal mb-5'>Result Complaint bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                <div className='reschedule'>
                  <div className='d-flex flex-column align-items-center pe-1 gap-2'>
                    <h1 className='fw-normal'>{nonWorkRelated}</h1>
                    <p className='text-center'>NON WORK RELATED</p>
                  </div>
                </div>

                <div className='refund'>
                  <div className='d-flex flex-column align-items-center ps-1 pe-1 gap-2'>
                    <h1 className='fw-normal'>{workRelated}</h1>
                    <p className='text-center'>WORK RELATED</p>
                  </div>
                </div>

                <div className='resolve'>
                  <div className='d-flex flex-column align-items-center  ps-1 pe-1 gap-2'>
                    <h1 className='fw-normal'>{notResolved}</h1>
                    <p className='text-danger text-center'>NOT RESOLVED</p>
                  </div>
                </div>

                <div className='resolve'>
                  <div className='d-flex flex-column align-items-center ps-1 gap-2'>
                    <h1 className='fw-normal'>{resolved}</h1>
                    <p className='text-success  text-center'>RESOLVED</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <ChartBar className='card-xl-stretch mb-xl-8' />
        </div>
        <div className='col-xl-4'>
          <ChartLine className='card-xl-stretch mb-5 mb-xl-8' />
        </div>
        <div className='col-xl-4'>
          <ChartLine2 className='card-xl-stretch mb-xl-8' />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <ChartDonut className='card-xl-stretch mb-xl-8' chartHeight='300px' />
        </div>
        <div className='col-xl-4'>
          <ChartDonut2 className='card-xl-stretch mb-5 mb-xl-8' chartHeight='300px' />
        </div>
        <div className='col-xl-4'>
          <TableList className='card-xl-stretch mb-5 mb-xl-8' complaintData={complaintData} />
        </div>
      </div>
      {/* end::Row */}
    </>
  )
}

export {ReportComplaintStore}
