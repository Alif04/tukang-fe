import React, {useState, useEffect, FC} from 'react'

import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {ChartLine2} from './components/ChartLine2'
import {ChartDonut} from './components/ChartDonut'
import {ChartDonut2} from './components/ChartDonut2'
import {TopVendorWidget} from './components/TopVendor'

import axios from 'axios'
import dayjs from 'dayjs'
import Select from 'react-select'
import {Card, Row, Col, Button} from 'react-bootstrap'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

interface VendorItem {
  value: number | null
  label: string
}

const ReportVendorHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const today = new Date()
  const [dateFrom, setDateFrom] = useState<any>(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

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

  const vendorId = selectedVendor.value ? `&vendor_id=${selectedVendor.value}` : ''

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
      const response = await axios.get(
        `${apiUrl}/orders?order_by=desc&take=0&date_from=${dateFrom}&date_to=${dateTo}${vendorId}`,
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

      setOrderData(data)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getReportOrder = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/reports/orders?date_from=${dateFrom}&date_to=${dateTo}${vendorId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      const chartDatas = response.data.data

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
      const response = await axios.get(
        `${apiUrl}/reports/work-orders?take=0&date_from=${dateFrom}&date_to=${dateTo}${vendorId}`,
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

  const getComplaint = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/reports/complaints?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}${vendorId}`,
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
      const response = await axios.get(
        `${apiUrl}/invoices?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}${vendorId}`,
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

  const sumTotal = (data: any, key: string) =>
    data.map((item: any) => item[key] || 0).reduce((a: number, b: number) => a + b, 0)

  const totalOrder = sumTotal(chartOrder, 'totalOrder')
  const surveyOrder = sumTotal(chartWorkOrder, 'totalSurveyOrder')
  const rejectedOrder = sumTotal(chartComplaint, 'totalRejectByVendor')
  const totalInvoices = sumTotal(chartComplaint, 'totalApprovedByVendor')
  const totalComplaint = sumTotal(chartComplaint, 'totalOrder')

  const renderStat = (value: number, label: string, className = 'text-center') => (
    <Col className='mb-2'>
      <div className='d-flex flex-column align-items-center gap-2'>
        <h1 className='fw-normal'>{value}</h1>
        <p className={`fs-6 ${className}`}>{label}</p>
      </div>
    </Col>
  )

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
                {renderStat(totalOrder, 'MASUK')}
                {renderStat(surveyOrder, 'SURVEY')}
                {renderStat(rejectedOrder, 'DITOLAK')}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Invoice bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                {renderStat(totalInvoices, 'MASUK')}
                {renderStat(surveyOrder, 'DIBAYAR')}
                {renderStat(rejectedOrder, 'BELUM DIBAYAR')}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Complaint bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                {renderStat(totalComplaint, 'MASUK')}
                {renderStat(surveyOrder, 'DITOLAK')}
                {renderStat(rejectedOrder, 'SELESAI')}
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
