import React, {FC, useState, useEffect} from 'react'

import {BestCostumers} from './components/BestCostumers'

import axios from 'axios'
import dayjs from 'dayjs'
import Select from 'react-select'
import {Card, Row, Col, Button} from 'react-bootstrap'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

const ReportCostumerHO: FC = () => {
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
  const [chartOrder, setChartOrder] = useState<any[]>([])
  const [member, setMember] = useState<any[]>([])
  const [totalMember, setTotalMember] = useState(0)
  const [singleOrder, setSingleOrder] = useState<number>(0)
  const [multiOrder, setMultiOrder] = useState<number>(0)

  const [storeOption, setStoreOption] = useState<any[]>([])
  const storeOptions = [{value: null, label: 'All Toko'}, ...storeOption]
  const [selectedStore, setSelectedStore] = useState<any>({
    value: null,
    label: 'All Toko',
  })

  const storeId = selectedStore.value ? `&store_id=${selectedStore.value}` : ''

  const getStore = async () => {
    try {
      const response = await axios.get(`${apiUrl}/stores?take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      if (Array.isArray(response.data.data)) {
        const tempStore = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.store_name,
        }))

        setStoreOption(tempStore)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getMember = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/member?take=0&top_best=1${storeId}&order_date_from=${dateFrom}&order_date_to=${dateTo}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )
      if (Array.isArray(response.data.data)) {
        setSingleOrder(response.data.totalOrderOne)
        setMultiOrder(response.data.totalOrderMany)
        setMember(response.data.data)
        setTotalMember(response.data.total)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getReportOrder = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/reports/orders?date_from=${dateFrom}&date_to=${dateTo}${storeId}`,
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
      const periodNumber = chartDatas.some((item: any) => /^\d+$/.test(item.period))

      const fromDate = new Date(dateFrom)
      const toDate = new Date(dateTo)

      const fromMonth = fromDate.getMonth()
      const toMonth = toDate.getMonth()

      const startIndex = fromMonth
      const endIndex = toMonth + 1

      const slicedData = periodNumber ? chartDatas : chartDatas.slice(startIndex, endIndex)
      setChartOrder(slicedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    getStore()
    getMember()
    getReportOrder()
  }, [])

  const handleSubmitFilter = async () => {
    setLoadingButton(true)

    await getMember()
    await getReportOrder()

    setLoadingButton(false)
  }

  const renderStat = (value: number, label: string, className = 'text-center') => (
    <Col className='mb-5'>
      <div className='d-flex flex-column align-items-center gap-2'>
        <h1 className='fw-normal'>{value}</h1>
        <p className={`fs-7 ${className}`}>{label}</p>
      </div>
    </Col>
  )

  const sumTotal = (data: any, key: string) =>
    data.map((item: any) => item[key] || 0).reduce((a: number, b: number) => a + b, 0)

  const totalComplaint = sumTotal(chartOrder, 'totalComplaint')
  const totalRework = sumTotal(chartOrder, 'totalRework')
  const totalResurvey = sumTotal(chartOrder, 'totalResurvey')

  const totalReschedule = sumTotal(chartOrder, 'totalReschedule')
  const totalCancel = sumTotal(chartOrder, 'totalCancel')
  const totalRefund = sumTotal(chartOrder, 'totalRefund')

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
                  placeholder='Pilih Toko'
                  isSearchable={true}
                  options={storeOptions}
                  value={selectedStore}
                  onChange={(newValue) => setSelectedStore(newValue)}
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
      <Row className='g-5 g-xl-8'>
        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body style={{minHeight: '170px'}}>
              <div className='fs-5 fw-normal mb-5'>Order</div>

              <div className='d-flex justify-content-between'>
                {renderStat(singleOrder, 'Order Satu')}
                {renderStat(multiOrder, 'Order Banyak')}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body style={{minHeight: '170px'}}>
              <div className='fs-5 fw-normal mb-5'>Komplain</div>

              <div className='d-flex justify-content-between'>
                {renderStat(totalComplaint, 'Komplain masuk')}
                {renderStat(totalResurvey, 'Survei Ulang')}
                {renderStat(totalRework, 'Pengerjaan Ulang')}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-xl-4'>
          <Card className='mb-5'>
            <Card.Body style={{minHeight: '170px'}}>
              <div className='fs-5 fw-normal mb-5'>Informasi Lainnya</div>

              <div className='d-flex justify-content-between'>
                {renderStat(totalCancel, 'Cancel')}
                {renderStat(totalRefund, 'Refund')}
                {renderStat(totalReschedule, 'Reschedule')}
              </div>
            </Card.Body>
          </Card>
        </div>
      </Row>
      {/* end::Row */}

      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-12'>
          <BestCostumers
            className='card-xl-stretch mb-5 mb-xl-8'
            memberData={member}
            totalMember={totalMember}
            storeId={selectedStore?.value ?? null}
            storeName={selectedStore?.label ?? 'All Store'}
            dateFrom={dateFrom}
            dateTo={dateTo}
          />
        </div>
      </div>
      {/* end::Row */}
    </>
  )
}

export {ReportCostumerHO}
