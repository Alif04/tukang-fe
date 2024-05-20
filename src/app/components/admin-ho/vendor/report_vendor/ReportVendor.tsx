import React, {useState, useEffect, FC} from 'react'

import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {ChartLine2} from './components/ChartLine2'
import {ChartDonut} from './components/ChartDonut'
import {ChartDonut2} from './components/ChartDonut2'
import {TopVendorWidget} from './components/TopVendor'

import axios from 'axios'
import Select from 'react-select'
import {Card, Row, Col, Button} from 'react-bootstrap'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

interface VendorItem {
  value: number | null
  label: string
}

const reportWorkOrder = {
  survey: 0,
  cancel: 0,
}

const reportInvoice = {
  waitingPayment: 0,
  paid: 0,
}

const reportComplaint = {
  complaintReject: 0,
  complaintDone: 0,
}

type StatusWorkOrderMap = {
  [statusName: string]: keyof typeof reportWorkOrder
}

type StatusInvoiceMap = {
  [statusName: string]: keyof typeof reportInvoice
}

type StatusComplaintMap = {
  [statusName: string]: keyof typeof reportComplaint
}

const StatusWorkOrderMap: StatusWorkOrderMap = {
  SURVEYREQ: 'survey',
  CANCEL: 'cancel',
}

const StatusInvoiceMap: StatusInvoiceMap = {
  UNPAID: 'waitingPayment',
  PAID: 'paid',
}

const StatusComplaintMap: StatusComplaintMap = {
  COMPLAINTREJECTEDBYVENDOR: 'complaintReject',
  DONE: 'complaintDone',
}

const ReportVendorHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const today = new Date()
  const todays = new Date().toISOString().split('T')[0]
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2)
    .toISOString()
    .split('T')[0]

  const [loadingButton, setLoadingButton] = useState(false)
  const [orderData, setOrderData] = useState<any[]>([])
  const [workOrderData, setWorkOrderData] = useState<any[]>([])
  const [invoiceData, setInvoiceData] = useState<any[]>([])
  const [complaintData, setComplaintData] = useState<any[]>([])

  const [chartOrder, setChartOrder] = useState<any[]>([])
  const [chartWorkOrder, setChartWorkOrder] = useState<any[]>([])
  const [chartComplaint, setChartComplaint] = useState<any[]>([])

  const [vendor, setVendor] = useState<VendorItem[]>([])
  const [vendorOption, setVendorOption] = useState<VendorItem[]>([])
  const vendorOptions = [{value: null, label: 'All Vendor'}, ...vendorOption]
  const [selectedVendor, setSelectedVendor] = useState<any>({
    value: null,
    label: 'All Vendor',
  })

  const [dateFrom, setDateFrom] = useState<any>(firstDayOfMonth)
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])

  const date =
    dateFrom && dateTo
      ? `&date_from=${dateFrom}&date_to=${dateTo}`
      : `&date_from=${firstDayOfMonth}&date_to=${todays}`

  const vendorId = selectedVendor.value ? `&vendor_id=${selectedVendor.value}` : ''

  // Catch Value From Response API by Status
  const [workOrderStatus, setWorkOrderStatus] = useState(reportWorkOrder)
  const [invoiceStatus, setInvoiceStatus] = useState(reportInvoice)
  const [complaintStatus, setComplaintStatus] = useState(reportComplaint)

  const storedStatus = sessionStorage.getItem('statusData')
  const statusData = storedStatus ? JSON.parse(storedStatus) : []

  const updateStatus = (statusMap: any, data: any, setStatus: any) => {
    for (const statusName in statusMap) {
      const stateKey = statusMap[statusName]
      const desiredStatus = statusData.find((status: any) => status.category === statusName)

      if (desiredStatus) {
        const statusValue = desiredStatus.value
        const count = data.filter((item: any) => item?.status?.id === statusValue).length

        setStatus((prevState: any) => ({
          ...prevState,
          [stateKey]: count,
        }))
      }
    }
  }

  useEffect(() => {
    updateStatus(StatusWorkOrderMap, workOrderData, setWorkOrderStatus)
  }, [workOrderData])

  useEffect(() => {
    updateStatus(StatusInvoiceMap, invoiceData, setInvoiceStatus)
  }, [invoiceData])

  useEffect(() => {
    updateStatus(StatusComplaintMap, complaintData, setComplaintStatus)
  }, [complaintData])

  const {survey, cancel} = workOrderStatus
  const {waitingPayment, paid} = invoiceStatus
  const {complaintReject, complaintDone} = complaintStatus

  const getVendor = async () => {
    try {
      const response = await axios.get(`${apiUrl}/vendor?take=0&top_best=true`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempVendor = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.company_name,
        }))

        setVendor(response.data.data)
        setVendorOption(tempVendor)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getOrder = async () => {
    try {
      const response = await axios.get(`${apiUrl}/orders?order_by=desc&take=0${date}${vendorId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data.data
      setOrderData(data)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getReportOrder = async () => {
    try {
      const response = await axios.get(`${apiUrl}/reports/orders${date}${vendorId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const chartDatas = response.data.data.monthlyOrders

      const fromDate = new Date(dateFrom)
      const toDate = new Date(dateTo)

      const fromMonth = fromDate.getMonth()
      const toMonth = toDate.getMonth()

      const startIndex = fromMonth
      const endIndex = toMonth + 1

      const slicedData = chartDatas.slice(startIndex, endIndex)
      setChartOrder(slicedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getWorkOrder = async () => {
    try {
      const response = await axios.get(`${apiUrl}/reports/work-orders?take=0${date}${vendorId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data.data
      const chartDatas = response.data.data.monthlyWorkOrders

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

  const getComplaint = async () => {
    try {
      const response = await axios.get(`${apiUrl}/complaints?order_by=desc${date}${vendorId}`, {
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

      setComplaintData(data)
      setChartComplaint(slicedData)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getInvoices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/invoices?order_by=desc${date}${vendorId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data

      setInvoiceData(data)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    getVendor()
    getOrder()
    getReportOrder()
    getWorkOrder()
    getComplaint()
    getInvoices()
  }, [])

  const handleSubmitFilter = async () => {
    setLoadingButton(true)

    await getOrder()
    await getReportOrder()
    await getWorkOrder()
    await getComplaint()

    setLoadingButton(false)
  }

  return (
    <>
      {/* begin::Row */}
      <div className='row g-5 g-xl-8 mb-5'>
        <div className='col-md-4'>
          <Row>
            <Col xxl={4} xl={4} lg={6} className='d-flex align-items-center'>
              <h3 className='title-header fs-5 fw-normal'>Lihat Vendor Dashboard</h3>
            </Col>

            <Col xxl={8} xl={8} lg={12}>
              <div className='d-flex'>
                <Select
                  name='store_id'
                  className='form-control p-0'
                  classNamePrefix='select'
                  placeholder='Pilih Vendor'
                  isSearchable={true}
                  options={vendorOptions}
                  value={selectedVendor}
                  onChange={(newValue) => setSelectedVendor(newValue)}
                />
              </div>
            </Col>
          </Row>
        </div>

        <div className='col-md-4'>
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

        <div className='col-md-4'>
          <Button
            className='btn-dark-primary button-submit m-0'
            disabled={loadingButton}
            onClick={handleSubmitFilter}
          >
            {loadingButton ? 'Filtering..' : 'Submit'}
          </Button>
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Pekerjaan bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                <div className='order-in'>
                  <div className='d-flex flex-column align-items-center ms-5 gap-2'>
                    <h1 className='fw-normal'>{workOrderData.length}</h1>
                    <p>MASUK</p>
                  </div>
                </div>

                <div className='order-pending'>
                  <div className='d-flex flex-column align-items-center ms-5 me-5 gap-2'>
                    <h1 className='fw-normal'>{survey}</h1>
                    <p>SURVEY</p>
                  </div>
                </div>

                <div className='order-cancel'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>{cancel}</h1>
                    <p className='text-danger'>DITOLAK</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Invoice bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                <div className='order-in'>
                  <div className='d-flex flex-column align-items-center ms-5 gap-2'>
                    <h1 className='fw-normal'>{invoiceData.length}</h1>
                    <p>MASUK</p>
                  </div>
                </div>

                <div className='order-pending'>
                  <div className='d-flex flex-column align-items-center ms-5 me-5 gap-2'>
                    <h1 className='fw-normal'>{paid}</h1>
                    <p>DIBAYAR</p>
                  </div>
                </div>

                <div className='order-cancel'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>{waitingPayment}</h1>
                    <p className='text-danger'>BELUM DIBAYAR</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Complaint bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                <div className='order-in'>
                  <div className='d-flex flex-column align-items-center ms-5 gap-2'>
                    <h1 className='fw-normal'>{complaintData.length}</h1>
                    <p className=' text-danger'>MASUK</p>
                  </div>
                </div>

                <div className='order-pending'>
                  <div className='d-flex flex-column align-items-center ms-5 me-5 gap-2'>
                    <h1 className='fw-normal'>{complaintReject}</h1>
                    <p>DITOLAK</p>
                  </div>
                </div>

                <div className='order-cancel'>
                  <div className='d-flex flex-column align-items-center me-5 gap-2'>
                    <h1 className='fw-normal'>{complaintDone}</h1>
                    <p className='text-success'>SELESAI</p>
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
          <TopVendorWidget className='card-xl-stretch mb-5 mb-xl-8' vendorData={vendor} />
        </div>
      </div>
      {/* end::Row */}
    </>
  )
}

export {ReportVendorHO}
