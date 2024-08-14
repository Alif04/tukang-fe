import React, {FC, useState, useEffect} from 'react'
import axiosInstance from '../../../../../_metronic/layout/core/axiosInterceptor'

import {TotalComplaint} from './components/TotalComplaint'
import {TotalResurvey} from './components/TotalResurvey'
import {TotalRework} from './components/TotalRework'

import axios from 'axios'
import dayjs from 'dayjs'
import {Card, Row, Col, Button} from 'react-bootstrap'
import type {ColumnsType} from 'antd/es/table'
import {Table, Tag, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'

const {RangePicker} = DatePicker

interface DataType {
  order_id: number
  complaint_date: Date
  customer_name: string
  complaint_age: string
  status: string
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    sorter: (a, b) => a.order_id - b.order_id,
    width: 100,
  },
  {
    title: 'Tanggal Komplain',
    dataIndex: 'complaint_date',
    key: 'complaint_date',
    align: 'left',
  },
  {
    title: 'Nama Customer',
    dataIndex: 'customer_name',
    key: 'customer_name',
    align: 'left',
  },
  {
    title: 'Umur Komplain',
    dataIndex: 'complaint_age',
    key: 'complaint_age',
    align: 'left',
  },
  {
    title: 'Status Komplain',
    dataIndex: 'complaint_status',
    key: 'complaint_status',
    align: 'left',
    width: 130,
    render: (complaint_status) => {
      const complaintStatus = complaint_status
      let color = ''

      switch (complaintStatus) {
        case 'INVESTIGATED':
          color = 'volcano'
          break
        case 'ACCEPTED':
          color = 'green'
          break
        default:
          color = 'blue'
          break
      }

      return <Tag color={color}>{complaintStatus}</Tag>
    },
  },
]

const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
  if (type === 'prev') {
    return <a>Prev</a>
  }
  if (type === 'next') {
    return <a>Next</a>
  }
  return originalElement
}

const ReportComplaintPage: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const userRole = localStorage.getItem('userRole') as string
  const userStore = localStorage.getItem('storeId')
  const userVendor = localStorage.getItem('vendor_id')
  const userTukang = localStorage.getItem('tukang_id')

  const storeId = userStore ? `&store_id=${userStore}` : ''
  const vendorId = userVendor ? `&vendor_id=${userVendor}` : ''
  const tukangId = userTukang ? `&tukang_id=${userTukang}` : ''

  const [loadingButton, setLoadingButton] = useState(false)

  const [loadData, setLoadData] = useState<boolean>(true)
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [complaintData, setComplaintData] = useState<any[]>([])
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

  const fetchComplaintList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/complaints?order_by=desc&page=${page}&take=${pageSize}&date_from=${dateFrom}&date_to=${dateTo}${storeId}${vendorId}${tukangId}${queryparams}`

    try {
      const response = await axiosInstance.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setCurrentPage(response.data.page)
      setTotalData(response?.data?.total ?? 0)
      setLoadData(false)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewComplaint = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchComplaintList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const complaintData = apiData.map((item: any) => {
        let data

        const orderDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })

        const complaintDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })

        const phoneNumber = item?.orders?.project_number.startsWith('0')
          ? item?.orders?.project_number
          : `+62${item?.orders?.project_number}`

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
          complaint_id: item?.id,
          assign_from: item?.orders.store?.store_name,
          order_id: item?.orders?.id,
          date_order: orderDate,
          no_member: item?.orders?.members?.member_number,
          customer_name: item?.orders?.members?.full_name,
          phone_number: phoneNumber,
          service_name: item.orders?.m_order_details[0]?.item_name ?? '-',
          order_status: item.orders?.status?.description,
          work_status: item?.orders?.work_orders?.work_order_status[0]?.status?.description,
          complaint_date: complaintDate,
          complaint_age: complaintAge,
          complaint_status: item?.status?.description,
        }

        return data
      })

      return complaintData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const getReportOrder = async () => {
    const url = (() => {
      switch (userRole) {
        case 'Store CS':
          return `${apiUrl}/reports/orders?take=0&${storeId}&date_from=${dateFrom}&date_to=${dateTo}`
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

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewComplaint(page, pageSize, queryparams)
    setComplaintData(data)
  }

  useEffect(() => {
    fetchData(1, 10, '')
  }, [])

  useEffect(() => {
    getReportOrder()
  }, [])

  const handleSubmitFilter = async () => {
    setLoadingButton(true)

    let queryparams = ''
    const data = await ViewComplaint(1, 10, queryparams)
    setComplaintData(data)

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
      {!['Admin Vendor', 'Owner Vendor', 'Tukang'].includes(userRole) && (
        <>
          <Row className=' g-5 g-xl-8'>
            <Col className='col-xl-12'>
              <TotalComplaint
                className='card-xl-stretch mb-xl-8'
                chartComplaintData={chartDataOrder}
              />
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
              <TotalRework
                className='card-xl-stretch mb-xl-8'
                chartComplaintData={chartDataOrder}
              />
            </Col>
          </Row>
        </>
      )}

      <Row className='g-5 g-xl-8 mb-5'>
        <Col md={12}>
          <div className={`card`}>
            <div className='card-body p-5'>
              <div className='d-flex flex-column'>
                <h1 className='fs-1 text-black mb-3'>List Pengaduan</h1>

                <Spin
                  tip='Loading...'
                  spinning={loadData}
                  size='large'
                  indicator={<LoadingOutlined style={{fontSize: 24}} spin rev />}
                >
                  <div className='table-custom-wrapper'>
                    <Table
                      className='table-striped-rows'
                      bordered
                      columns={columns}
                      dataSource={complaintData}
                      rowKey={(record) => record.order_id}
                      pagination={false}
                      sticky={true}
                      tableLayout='auto'
                      scroll={{x: 'max-content'}}
                    />
                  </div>
                </Spin>

                <div className='pagination-container mt-5'>
                  <span className='total-text'>
                    Showing {(currentPage - 1) * pageSize + 1} -{' '}
                    {Math.min(currentPage * pageSize, totalData)} of {totalData} Komplain
                  </span>

                  <Pagination
                    className='pagination'
                    current={currentPage}
                    total={totalData}
                    showSizeChanger
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    itemRender={itemRender}
                    onShowSizeChange={(current, size) => {
                      setPageSize(size)
                    }}
                    onChange={(page, pageSize) => {
                      fetchData(page, pageSize, '')
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}

export {ReportComplaintPage}
