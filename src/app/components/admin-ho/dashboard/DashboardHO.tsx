import React, {useState, useEffect, FC} from 'react'

import './DashboardHO.css'

import {ChartBarPerformance} from './components/ChartBarPerformance'
import {ChartBarOrder} from './components/ChartBarOrder'
import {ChartBarSurvey} from './components/ChartBarSurvey'
import {MoreInformation} from './components/MoreInformation'

import axios from 'axios'
import dayjs from 'dayjs'
import Select from 'react-select'
import {DatePicker} from 'antd'
import {Row, Col, Card, Button} from 'react-bootstrap'
import {Table, PaginationProps} from 'antd'
import type {ColumnsType} from 'antd/es/table'

const {RangePicker} = DatePicker

interface DataType {
  order_id: number
  store_name: string
  costumer_name: string
  service_name: string
  order_date: Date
  total: string
}

interface StoreItem {
  value: number | null
  label: string
  city_id: number | null
}

interface AreaItem {
  value: number | null
  label: string
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    sorter: (a, b) => a.order_id - b.order_id,
  },
  {
    title: 'Nama Toko',
    dataIndex: 'store_name',
    key: 'store_name',
    align: 'left',
    className: 'col_order_id',
    onFilter: (value, record) => record.store_name.includes(String(value)),
    sorter: (a, b) => a.store_name.length - b.store_name.length,
  },
  {
    title: 'Nama Customer',
    dataIndex: 'costumer_name',
    key: 'costumer_name',
    align: 'left',
    onFilter: (value, record) => record.costumer_name.includes(String(value)),
    sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
  },
  {
    title: 'Nama Pemasangan',
    dataIndex: 'service_name',
    key: 'service_name',
    align: 'left',
    onFilter: (value, record) => record.service_name.includes(String(value)),
    sorter: (a, b) => a.service_name.length - b.service_name.length,
  },
  {
    title: 'Tanggal Order',
    dataIndex: 'order_date',
    key: 'order_date',
    align: 'left',
    sorter: (a: DataType, b: DataType) =>
      new Date(a.order_date).getTime() - new Date(b.order_date).getTime(),
  },
  {
    title: 'Grand Total',
    dataIndex: 'total',
    key: 'total',
    align: 'center',
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

const DashboardHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const [loadingButton, setLoadingButton] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [orderList, setOrderList] = useState<DataType[]>([])
  const [chartDataOrder, setChartDataOrder] = useState<any[]>([])

  const today = new Date()
  const [dateFrom, setDateFrom] = useState<any>(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])

  const [store, setStore] = useState<StoreItem[]>([])
  const [area, setArea] = useState<AreaItem[]>([])

  const [selectedStore, setSelectedStore] = useState<any>({
    value: null,
    label: 'All Store',
    area_id: null,
  })

  const [selectedZone, setSelectedZone] = useState<any>({
    value: null,
    label: 'All Zona',
  })

  const store_id = store ? `${store.map((item) => item.value).join(',')}` : `${selectedStore.value}`

  const storeOptions = [{value: null, label: 'All Store', area_id: null}, ...store]
  const zoneOptions = [{value: null, label: 'All Zona'}, ...area]

  useEffect(() => {
    const selectedStoreCityId = selectedStore?.area_id
    const filteredZone = area.filter((item) => item.value === selectedStoreCityId)

    if (filteredZone.length === 1) {
      setSelectedZone(filteredZone[0])
    } else {
      setSelectedZone({value: null, label: 'All Zona', area_id: null})
    }
  }, [selectedStore])

  const fetchOrderList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/orders?order_by=desc&page=${page}&take=${pageSize}${queryparams}&date_from=${dateFrom}&date_to=${dateTo}`
    if (store_id) {
      apiUrlWithParams += `&store_id=${store_id}`
    }

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

      setCurrentPage(response?.data?.page)
      setTotalData(response?.data?.total ?? 0)

      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getReportOrder = async () => {
    let url = `${apiUrl}/reports/orders?date_from=${dateFrom}&date_to=${dateTo}`

    if (store_id) {
      url += `&store_id=${store_id}`
    }

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

  useEffect(() => {
    getReportOrder()
  }, [])

  const ViewOrder = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchOrderList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const orderData = apiData.map((item: any) => {
        let data
        let totalAmount = 0

        if (item.quotation.length > 0 && item.payment_type === 'survey') {
          totalAmount = item?.quotation[0]?.quotation_grand_total
        } else {
          totalAmount = item?.grand_total
        }

        data = {
          order_id: item.id,
          store_name: item?.store?.store_name ?? '-',
          costumer_name: item?.members?.full_name ?? '-',
          service_name:
            item?.payment_type === 'survey'
              ? item?.m_order_details[0]?.item_notes ?? '-'
              : item?.m_order_details[0]?.item?.service_name ?? '-',
          order_date: new Date(item?.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }),
          total: `Rp. ${Number(totalAmount).toLocaleString('id')}`,
        }

        return data
      })

      return orderData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewOrder(page, pageSize, queryparams)
    setOrderList(data)
  }

  useEffect(() => {
    fetchData(1, 10, '')
  }, [])

  useEffect(() => {
    const getStore = async () => {
      try {
        let url = `${apiUrl}/stores?take=0`

        if (selectedZone.label === 'Jawa') {
          const jawaAreas = area.filter(
            (item) =>
              item.label === 'Jawa Barat' ||
              item.label === 'Jawa Timur' ||
              item.label === 'Jawa Tengah'
          )

          const areaIds = jawaAreas.map((item) => item.value).join(',')
          url = `${apiUrl}/stores?area_id=${areaIds}`
        } else if (selectedZone.value) {
          url = `${apiUrl}/stores?area_id=${selectedZone.value}`
        }

        const response = await axios.get(url, {
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
            area_id: item.area_id,
          }))

          setStore(tempStore)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const getArea = async () => {
      try {
        const response = await axios.get(`${apiUrl}/area?take=0`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempCity = response.data.data.map((item: any) => ({
            value: item?.id ?? null,
            label: item?.area ?? '',
          }))

          setArea(tempCity)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getStore()
    getArea()
  }, [selectedZone])

  const handleSubmitFilter = async () => {
    setLoadingButton(true)
    let queryparams = ''

    const data = await ViewOrder(1, 10, queryparams)
    setOrderList(data)

    await getReportOrder()

    setLoadingButton(false)
  }

  const sumTotal = (data: any, key: string) =>
    data.map((item: any) => item[key] || 0).reduce((a: number, b: number) => a + b, 0)

  const totalOrders = sumTotal(chartDataOrder, 'totalOrder')
  const picklistOrder = sumTotal(chartDataOrder, 'totalPicklist')
  const newOrder = sumTotal(chartDataOrder, 'totalNewOrder')

  const waitingSurvey = sumTotal(chartDataOrder, 'totalWaitingSurvey')
  const surveyOrder = sumTotal(chartDataOrder, 'totalSurveyStart')
  const surveyOrderDone = sumTotal(chartDataOrder, 'totalSurveyDone')

  const waitingQuotations = sumTotal(chartDataOrder, 'totalWaitingQuotationVendor')
  const unpaidQuotation = sumTotal(chartDataOrder, 'totalWaitingQuotationCustomer')

  const waitingWork = sumTotal(chartDataOrder, 'totalWaitingWork')
  const workInProgress = sumTotal(chartDataOrder, 'totalWorkStart')
  const orderDone = sumTotal(chartDataOrder, 'totalOrderDone')

  const totalComplaint = sumTotal(chartDataOrder, 'totalComplaint')
  const totalRework = sumTotal(chartDataOrder, 'totalRework')
  const totalResurvey = sumTotal(chartDataOrder, 'totalResurvey')

  const totalReschedule = sumTotal(chartDataOrder, 'totalReschedule')
  const totalCancel = sumTotal(chartDataOrder, 'totalCancel')
  const totalRefund = sumTotal(chartDataOrder, 'totalRefund')

  const activeWarranty = sumTotal(chartDataOrder, 'totalActiveWarranty')
  const usedWarranty = sumTotal(chartDataOrder, 'totalUsedWarranty')
  const expiredWarranty = sumTotal(chartDataOrder, 'totalExpiredWarranty')

  const renderStat = (value: number, label: string, className = 'text-center') => (
    <Col className='mb-5'>
      <div className='d-flex flex-column align-items-center gap-2'>
        <h1 className='fw-normal'>{value}</h1>
        <p className={`fs-6 ${className}`}>{label}</p>
      </div>
    </Col>
  )

  return (
    <section id='dashboard-ho'>
      <Row>
        <Col xxl={3} xl={3} lg={12} className='mb-5'>
          <Row>
            <Col xxl={4} xl={4} lg={12} className='d-flex align-items-center'>
              <h3 className='title-header fs-5 fw-normal'>Lihat Store Dashboard</h3>
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
        </Col>

        <Col xxl={3} xl={3} lg={12} className='mb-5'>
          <Row>
            <Col xxl={4} xl={4} lg={12} className='d-flex align-items-center'>
              <h3 className='title-header fs-5 fw-normal'>Pilih Zona</h3>
            </Col>

            <Col xxl={8} xl={8} lg={12}>
              <div className='d-flex'>
                <Select
                  name='province_id'
                  className='form-control p-0'
                  classNamePrefix='select'
                  placeholder='Pilih Zona'
                  isSearchable={true}
                  options={zoneOptions}
                  value={selectedZone}
                  onChange={(newValue) => setSelectedZone(newValue)}
                />
              </div>
            </Col>
          </Row>
        </Col>

        <Col xxl={4} xl={4} lg={12} className='mb-5'>
          <Row>
            <Col xxl={4} xl={4} lg={4} className='d-flex align-items-center'>
              <h3 className='title-header fs-5 fw-normal'>Pilih rentang waktu</h3>
            </Col>

            <Col xxl={8} xl={8} lg={8}>
              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range w-100'
                defaultValue={[dayjs(dateFrom, 'YYYY-MM-DD'), dayjs(dateTo, 'YYYY-MM-DD')]}
                onChange={(values) => {
                  if (values && values.length === 2) {
                    const dateFromFormatted = values[0]?.format('YYYY-MM-DD')
                    const dateToFormatted = values[1]?.format('YYYY-MM-DD')

                    setDateFrom(dateFromFormatted)
                    setDateTo(dateToFormatted)
                  } else {
                    setDateFrom(new Date(today.getFullYear(), 0, 2).toISOString().split('T')[0])
                    setDateTo(new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0])
                  }
                }}
              />
            </Col>
          </Row>
        </Col>

        <Col xxl={2} xl={2} lg={12} className='mb-5'>
          <Button
            className='btn-dark-primary button-submit'
            disabled={loadingButton}
            onClick={handleSubmitFilter}
          >
            {loadingButton ? 'Filtering..' : 'Submit'}
          </Button>
        </Col>
      </Row>

      <Row className='g-5 g-xl-8 mb-5'>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Order</div>

              <Row className='justify-content-md-center'>
                {renderStat(totalOrders, 'Total Order')}
                {renderStat(picklistOrder, 'Picklist')}
                {renderStat(newOrder, 'Order Baru')}
                {renderStat(waitingSurvey, 'Menunggu Survey', 'text-center')}
                {renderStat(surveyOrder, 'Order sedang dalam survey')}
                {renderStat(surveyOrderDone, 'Survei Selesai')}
                {renderStat(waitingQuotations, 'Quotation Dikirim Vendor', 'text-center')}
                {renderStat(unpaidQuotation, 'Menunggu Bayar Quotation', 'text-center')}
                {renderStat(waitingWork, 'Menunggu Pengerjaan')}
                {renderStat(workInProgress, 'Order sedang dalam pengerjaan')}
                {renderStat(orderDone, 'Order Selesai')}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={4} md={4} className='mb-5'>
          <MoreInformation
            className='card-xl-stretch'
            totalComplaint={totalComplaint}
            totalResurvey={totalResurvey}
            totalRework={totalRework}
            totalReschedule={totalReschedule}
            totalRefund={totalRefund}
            totalCancel={totalCancel}
            totalActiveWarranty={activeWarranty}
            totalUsedWarranty={usedWarranty}
            totalExpiredWarranty={expiredWarranty}
          />
        </Col>

        <Col lg={8} md={8} className='mb-5'>
          <ChartBarSurvey className='card-xl-stretch' orderData={chartDataOrder} />
        </Col>
      </Row>

      <Row>
        <Col lg={12} md={12} className='mb-5'>
          <ChartBarOrder className='card-xl-stretch' orderData={chartDataOrder} />
        </Col>
      </Row>

      <Row className='mb-5'>
        <Col md={12}>
          <ChartBarPerformance className='card-xl-stretch' orderData={chartDataOrder} />
        </Col>
      </Row>

      <Row className='mb-5'>
        <Col md={12}>
          <div className={`card`}>
            <div className='card-body p-5'>
              <div className='d-flex flex-column'>
                <h1 className='fs-1 text-black mb-3'>List Order</h1>

                <Table
                  bordered
                  columns={columns}
                  dataSource={orderList}
                  rowKey={(record) => record.order_id}
                  scroll={{x: 1200}}
                  pagination={{
                    position: ['bottomRight'],
                    current: currentPage,
                    total: totalData,
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    defaultPageSize: 5,
                    onChange: (page, pageSize) => {
                      fetchData(page, pageSize, '')
                    },
                    itemRender: itemRender,
                    showTotal: (total, range) => (
                      <span style={{left: 0, position: 'absolute'}}>
                        Showing {range[0]} - {range[1]} of {total} List Order
                      </span>
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </section>
  )
}

export {DashboardHO}
