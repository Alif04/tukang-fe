import React, {FC, useState, useEffect} from 'react'

import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {ChartLine2} from './components/ChartLine2'
import {ChartDonut} from './components/ChartDonut'
import {ChartDonut2} from './components/ChartDonut2'
import {TableList} from './components/TableList'

import axios from 'axios'
import {DatePicker} from 'antd'
import {Card, Row, Col, Button} from 'react-bootstrap'

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
  const apiUrl = process.env.REACT_APP_API_URL
  const userRole = localStorage.getItem('userRole')
  const userStore = localStorage.getItem('storeId')
  const vendorId = localStorage.getItem('vendor_id')
  const [loadingButton, setLoadingButton] = useState(false)

  const [orderData, setOrderData] = useState<any[]>([])
  const [workOrderData, setWorkOrderData] = useState<any[]>([])
  const [complaintData, setComplaintData] = useState<any[]>([])
  const [complaintList, setComplaintList] = useState<any>()

  const [chartDataOrder, setChartDataOrder] = useState<any[]>([])
  const [chartWorkOrder, setChartWorkOrder] = useState<any[]>([])
  const [chartDataComplaint, setChartDataComplaint] = useState<any[]>([])

  const today = new Date()
  const [dateFrom, setDateFrom] = useState<any>(
    new Date(today.getFullYear(), today.getMonth(), 2).toISOString().split('T')[0]
  )
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])

  const fetchOrder = async () => {
    const url = (() => {
      switch (userRole) {
        case 'Store CS':
          return `${apiUrl}/orders?order_by=desc&store_id=${userStore}&take=0`
        case 'Admin Vendor':
          return `${apiUrl}/orders?order_by=desc&vendor_id=${vendorId}&take=0`
        default:
          return `${apiUrl}/orders?order_by=desc&take=0`
      }
    })()

    try {
      const response = await axios.get(url, {
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

  const fetchComplaintList = async (queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/complaints?order_by=desc&take=0${queryparams}`

    const url = (() => {
      switch (userRole) {
        case 'Store CS':
          apiUrlWithParams += `&store_id=${userStore}`
          break
        case 'Admin Vendor':
          apiUrlWithParams += `&vendor_id=${vendorId}`
          break
        default:
          break
      }

      return apiUrlWithParams
    })()

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

        const complaintDate = new Date(item?.complaint_date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        data = {
          order_id: item?.orders?.id,
          complaint_date: complaintDate,
          complaint_status: item?.status?.description,
        }

        return data
      })

      return apiData
    } catch (error) {
      console.error('Error getting complaint list data:', error)
      return []
    }
  }

  const getReportOrder = async () => {
    const url = (() => {
      switch (userRole) {
        case 'Store CS':
          return `${apiUrl}/reports/orders?store_id=${userStore}&take=0`
        case 'Admin Vendor':
          return `${apiUrl}/reports/orders?vendor_id=${vendorId}&take=0`
        default:
          return `${apiUrl}/reports/orders?take=0`
      }
    })()

    try {
      const response = await axios.get(url, {
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
      setChartDataOrder(slicedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getReportComplaint = async () => {
    const url = (() => {
      switch (userRole) {
        case 'Store CS':
          return `${apiUrl}/reports/complaints?store_id=${userStore}&take=0`
        case 'Admin Vendor':
          return `${apiUrl}/reports/complaints?vendor_id=${vendorId}&take=0`
        default:
          return `${apiUrl}/reports/complaints?take=0`
      }
    })()

    try {
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data

      const chartDatas = response.data.monthlyComplaint

      const fromDate = new Date(dateFrom)
      const toDate = new Date(dateTo)

      const fromMonth = fromDate.getMonth()
      const toMonth = toDate.getMonth()

      const startIndex = fromMonth
      const endIndex = toMonth + 1

      const slicedData = chartDatas.slice(startIndex, endIndex)

      setWorkOrderData(data)
      setChartDataComplaint(slicedData)
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const getReportWorkOrder = async () => {
    const url = (() => {
      switch (userRole) {
        case 'Store CS':
          return `${apiUrl}/reports/work-orders?store_id=${userStore}&take=0`
        case 'Admin Vendor':
          return `${apiUrl}/reports/work-orders?vendor_id=${vendorId}&take=0`
        default:
          return `${apiUrl}/reports/work-orders?take=0`
      }
    })()

    try {
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data
      const chartDatas = response.data.monthlyWorkOrders

      const fromDate = new Date(dateFrom)
      const toDate = new Date(dateTo)

      const fromMonth = fromDate.getMonth()
      const toMonth = toDate.getMonth()

      const startIndex = fromMonth
      const endIndex = toMonth + 1

      const slicedData = chartDatas.slice(startIndex, endIndex)

      setWorkOrderData(data)
      setChartWorkOrder(slicedData)
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const fetchData = async () => {
    const data = await ViewComplaint()
    setComplaintData(data)
  }

  useEffect(() => {
    fetchComplaintList('')
    getReportOrder()
    getReportWorkOrder()
    getReportComplaint()
  }, [])

  useEffect(() => {
    fetchData()
    fetchOrder()
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

    await fetchComplaintList(queryparams)
    await getReportOrder()
    await getReportWorkOrder()
    await getReportComplaint()

    setLoadingButton(false)
  }

  return (
    <>
      <Row>
        <Col
          xxl={4}
          xl={4}
          lg={4}
          md={4}
          sm={12}
          className='d-flex justify-content-between align-items-center mb-5'
        >
          <h3 className='fs-3 fw-normal mb-3 w-50'>Pilih Periode :</h3>

          <RangePicker
            format={'DD-MM-YYYY'}
            className='date-range ms-3 w-100'
            onChange={(values) => {
              if (values && values.length === 2) {
                const dateFromFormatted = values[0]?.format('YYYY-MM-DD')
                const dateToFormatted = values[1]?.format('YYYY-MM-DD')

                setDateFrom(dateFromFormatted)
                setDateTo(dateToFormatted)
              } else {
                setDateFrom(
                  new Date(today.getFullYear(), today.getMonth(), 2).toISOString().split('T')[0]
                )
                setDateTo(new Date().toISOString().split('T')[0])
              }
            }}
          />
        </Col>

        <Col
          xxl={4}
          xl={4}
          lg={4}
          md={4}
          sm={12}
          className='d-flex justify-content-between align-items-center mb-5'
        >
          <Button
            className='btn-dark-primary button-submit m-0'
            disabled={loadingButton}
            onClick={handleSubmitFilter}
          >
            {loadingButton ? 'Filtering..' : 'Submit'}
          </Button>
        </Col>
      </Row>

      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body style={{minHeight: '150px'}}>
              <div className='fs-5 fw-normal mb-5'>Complaint bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                <div className='order-in'>
                  <div className='d-flex flex-column align-items-center ms-5 gap-2'>
                    <h1 className='fw-normal'>{newComplaint}</h1>
                    <p>BARU</p>
                  </div>
                </div>

                <div className='order-pending'>
                  <div className='d-flex flex-column align-items-center ms-5 me-5 gap-2'>
                    <h1 className='fw-normal'>{rejectComplaint}</h1>
                    <p>DITOLAK</p>
                  </div>
                </div>

                <div className='order-cancel'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>{acceptedComplaint}</h1>
                    <p className='text-danger'>DITERIMA</p>
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
                    <h1 className='fw-normal text-center'>{resurveyComplaint}</h1>
                    <p className='text-center'>SURVEY ULANG</p>
                  </div>
                </div>

                <div className='wip'>
                  <div className='d-flex flex-column align-items-center ms-5 me-5 gap-2'>
                    <h1 className='fw-normal text-center'>{reworkComplaint}</h1>
                    <p className='text-center'>PENGERJAAN ULANG</p>
                  </div>
                </div>

                <div className='done'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>{rescheduleComplaint}</h1>
                    <p className='text-success text-center'>RESCHEDULE</p>
                  </div>
                </div>

                <div className='complaint'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>{refundComplaint}</h1>
                    <p className='text-danger text-center'>REFUND</p>
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
          <ChartBar className='card-xl-stretch mb-xl-8' chartOrderData={chartDataOrder} />
        </div>

        <div className='col-xl-4'>
          <ChartLine className='card-xl-stretch mb-5 mb-xl-8' chartWorkOrder={chartWorkOrder} />
        </div>

        <div className='col-xl-4'>
          <ChartLine2 className='card-xl-stretch mb-xl-8' chartComplaintData={chartDataComplaint} />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <ChartDonut
            className='card-xl-stretch mb-xl-8'
            chartHeight='300px'
            chartComplaint={chartDataComplaint}
          />
        </div>

        <div className='col-xl-4'>
          <ChartDonut2
            className='card-xl-stretch mb-5 mb-xl-8'
            chartHeight='300px'
            chartWorkOrder={chartWorkOrder}
          />
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
