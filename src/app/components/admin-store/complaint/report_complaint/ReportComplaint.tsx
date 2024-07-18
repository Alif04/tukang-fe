import React, {FC, useState, useEffect} from 'react'

import {ChartBar} from './components/ChartBar'
import {ChartLine} from './components/ChartLine'
import {ChartLine2} from './components/ChartLine2'
import {TableList} from './components/TableList'

import axios from 'axios'
import dayjs from 'dayjs'
import {DatePicker} from 'antd'
import {Card, Row, Col, Button} from 'react-bootstrap'

const {RangePicker} = DatePicker

const ReportComplaintStore: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const userRole = localStorage.getItem('userRole')
  const userStore = localStorage.getItem('storeId')
  const vendorId = localStorage.getItem('vendor_id')

  const [loadingButton, setLoadingButton] = useState(false)

  const [complaintData, setComplaintData] = useState<any[]>([])
  const [complaintList, setComplaintList] = useState<any>()

  const [chartDataComplaint, setChartDataComplaint] = useState<any[]>([])

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

  const getReportComplaint = async () => {
    const url = (() => {
      switch (userRole) {
        case 'Store CS':
          return `${apiUrl}/reports/complaints?store_id=${userStore}&take=0&date_from=${dateFrom}&date_to=${dateTo}`
        case 'Admin Vendor':
          return `${apiUrl}/reports/complaints?vendor_id=${vendorId}&take=0&date_from=${dateFrom}&date_to=${dateTo}`
        default:
          return `${apiUrl}/reports/complaints?take=0&date_from=${dateFrom}&date_to=${dateTo}`
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

      setChartDataComplaint(slicedData)
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
    fetchComplaintList()
    getReportComplaint()
  }, [])

  useEffect(() => {
    fetchData()
  }, [complaintList])

  const handleSubmitFilter = async () => {
    setLoadingButton(true)

    await fetchComplaintList()
    await getReportComplaint()

    setLoadingButton(false)
  }

  const sumTotal = (data: any, key: string) =>
    data.map((item: any) => item[key] || 0).reduce((a: number, b: number) => a + b, 0)

  const totalComplaint = sumTotal(chartDataComplaint, 'totalOrder')
  const rejectComplaint = sumTotal(chartDataComplaint, 'totalRejectByHo')
  const acceptedComplaint = sumTotal(chartDataComplaint, 'totalApprovedByHO')

  const resurvey = sumTotal(chartDataComplaint, 'totalReworkStart')
  const rework = sumTotal(chartDataComplaint, 'totalReworkStart')

  const resurveyDone = sumTotal(chartDataComplaint, 'totalReworkEnd')
  const reworkDone = sumTotal(chartDataComplaint, 'totalReworkEnd')

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
              <div className='fs-5 fw-normal mb-5'>Complaint bulan ini</div>

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
              <div className='fs-5 fw-normal mb-5'>Pekerjaan Complaint bulan ini</div>

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
              <div className='fs-5 fw-normal mb-5'>Result Complaint bulan ini</div>

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
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-4'>
          <ChartBar className='card-xl-stretch mb-xl-8' chartComplaintData={chartDataComplaint} />
        </div>

        <div className='col-xl-4'>
          <ChartLine
            className='card-xl-stretch mb-5 mb-xl-8'
            chartComplaintData={chartDataComplaint}
          />
        </div>

        <div className='col-xl-4'>
          <ChartLine2 className='card-xl-stretch mb-xl-8' chartComplaintData={chartDataComplaint} />
        </div>
      </div>
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

export {ReportComplaintStore}
