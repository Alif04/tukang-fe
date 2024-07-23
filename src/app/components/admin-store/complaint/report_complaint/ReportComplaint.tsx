import React, {FC, useState, useEffect} from 'react'

import {TotalComplaint} from './components/TotalComplaint'
import {TotalResurvey} from './components/TotalResurvey'
import {TotalRework} from './components/TotalRework'
import {TableList} from './components/TableList'

import axios from 'axios'
import dayjs from 'dayjs'
import {DatePicker} from 'antd'
import {Card, Row, Col, Button} from 'react-bootstrap'

const {RangePicker} = DatePicker

const ReportComplaintPage: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const userRole = localStorage.getItem('userRole')
  const userStore = localStorage.getItem('storeId')
  const vendorId = localStorage.getItem('vendor_id')

  const [loadingButton, setLoadingButton] = useState(false)

  const [complaintData, setComplaintData] = useState<any[]>([])
  const [complaintList, setComplaintList] = useState<any>()

  const [chartDataOrder, setChartDataOrder] = useState<any[]>([])

  const today = new Date()
  const [dateFrom, setDateFrom] = useState<any>(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const fetchComplaintList = async () => {
    let apiUrlWithParams = `${apiUrl}/complaints?order_by=desc&take=0&date_from=${dateFrom}&date_to=${dateTo}`

    const url = (() => {
      switch (userRole) {
        case 'Store CS':
          apiUrlWithParams += `&store_id=${userStore}`
          break
        case 'Admin Vendor':
        case 'Owner Vendor':
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

        const complaintDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })

        const currentDate = new Date()
        const complaintDates = new Date(item?.created_at)

        const timeDifferenceInMilliseconds = Number(currentDate) - Number(complaintDates)
        const timeDifferenceInMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60))
        const timeDifferenceInHours = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60))
        const timeDifferenceInDays = Math.floor(
          timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
        )

        let complaintAge

        if (timeDifferenceInDays >= 1) {
          complaintAge = `${timeDifferenceInDays} Hari`
        } else if (timeDifferenceInHours >= 1) {
          complaintAge = `${timeDifferenceInHours} Jam`
        } else {
          complaintAge = `${timeDifferenceInMinutes} Menit`
        }

        data = {
          order_id: item?.orders?.id,
          complaint_date: complaintDate,
          customer_name: item?.orders?.members?.full_name,
          complaint_age: complaintAge,
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
          return `${apiUrl}/reports/orders?store_id=${userStore}&take=0&date_from=${dateFrom}&date_to=${dateTo}`
        case 'Admin Vendor':
        case 'Owner Vendor':
          return `${apiUrl}/reports/orders?vendor_id=${vendorId}&take=0&date_from=${dateFrom}&date_to=${dateTo}`
        default:
          return `${apiUrl}/reports/orders?take=0&date_from=${dateFrom}&date_to=${dateTo}`
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

      const chartDatas = response.data.data
      const periodNumber = chartDatas.some((item: any) => /^\d+$/.test(item.period))

      const fromDate = new Date(dateFrom)
      const toDate = new Date(dateTo)

      const fromMonth = fromDate.getMonth()
      const toMonth = toDate.getMonth()

      const startIndex = fromMonth
      const endIndex = toMonth + 1

      const slicedData = periodNumber ? chartDatas : chartDatas.slice(startIndex, endIndex)
      setChartDataOrder(slicedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchData = async () => {
    const data = await ViewComplaint()
    setComplaintData(data)
  }

  useEffect(() => {
    fetchComplaintList()
    getReportOrder()
  }, [])

  useEffect(() => {
    fetchData()
  }, [complaintList])

  const handleSubmitFilter = async () => {
    setLoadingButton(true)

    await fetchComplaintList()
    await getReportOrder()

    setLoadingButton(false)
  }

  const sumTotal = (data: any, key: string) =>
    data.map((item: any) => item[key] || 0).reduce((a: number, b: number) => a + b, 0)

  const totalComplaint = sumTotal(chartDataOrder, 'totalComplaint')
  const acceptedComplaint = sumTotal(chartDataOrder, 'totalComplaintApprovedByHo')
  const rejectComplaint = sumTotal(chartDataOrder, 'totalComplaintRejectedByHo')

  const resurvey = sumTotal(chartDataOrder, 'totalResurveyComplaint')
  const rework = sumTotal(chartDataOrder, 'totalReworkComplaint')

  const resurveyDone = sumTotal(chartDataOrder, 'totalResurveyComplaintDone')
  const reworkDone = sumTotal(chartDataOrder, 'totalReworkComplaintDone')

  const renderStat = (value: number, label: string, className = 'text-center') => (
    <div className={`${label} ${className}`}>
      <div className='d-flex flex-column align-items-center ms-5 gap-2'>
        <h1 className='fw-normal'>{value}</h1>
        <p>{label}</p>
      </div>
    </div>
  )

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
              <div className='fs-5 fw-normal mb-5'>Komplain bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                {renderStat(totalComplaint, 'Masuk')}
                {renderStat(acceptedComplaint, 'Diterima')}
                {renderStat(rejectComplaint, 'Ditolak')}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body style={{minHeight: '150px'}}>
              <div className='fs-5 fw-normal mb-5'>Survei Komplain bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                {renderStat(resurvey, 'Survei Ulang')}
                {renderStat(resurveyDone, 'Survei Ulang Selesai')}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body style={{minHeight: '150px'}}>
              <div className='fs-5 fw-normal mb-5'>Pekerjaan Komplain bulan ini</div>

              <div className='d-flex justify-content-between mb-5'>
                {renderStat(rework, 'Pengerjaan Ulang')}
                {renderStat(reworkDone, 'Pengerjaan Ulang Selesai')}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <Row className=' g-5 g-xl-8'>
        <Col className='col-xl-12'>
          <TotalComplaint className='card-xl-stretch mb-xl-8' chartComplaintData={chartDataOrder} />
        </Col>
      </Row>

      <Row className=' g-5 g-xl-8'>
        <Col className='col-xl-12'>
          <TotalResurvey
            className='card-xl-stretch mb-5 mb-xl-8'
            chartComplaintData={chartDataOrder}
          />
        </Col>
      </Row>

      <Row className=' g-5 g-xl-8'>
        <Col className='col-xl-12'>
          <TotalRework className='card-xl-stretch mb-xl-8' chartComplaintData={chartDataOrder} />
        </Col>
      </Row>

      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-12'>
          <TableList className='card-xl-stretch mb-5 mb-xl-8' complaintData={complaintData} />
        </div>
      </div>
      {/* end::Row */}
    </>
  )
}

export {ReportComplaintPage}
