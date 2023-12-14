import React, {useState, useEffect, FC} from 'react'

import './DashboardHO.css'

import {ChartBarPerformance} from './components/ChartBarPerformance'
import {ChartBarOrder} from './components/ChartBarOrder'
import {ChartBarSurvey} from './components/ChartBarSurvey'
import {MoreInformation} from './components/MoreInformation'
import {TableList} from './components/TableList'

import axios from 'axios'
import Select from 'react-select'
import {DatePicker} from 'antd'
import {Row, Col, Card, Form} from 'react-bootstrap'

const {RangePicker} = DatePicker

interface StoreItem {
  value: number | null
  label: string
  city_id: number | null
}

interface ProvinceItem {
  value: number | null
  label: string
  city_id: number | null
}

const initialStatusState = {
  totalOrder: 0,
  survey: 0,
  onProgress: 0,
  complete: 0,
  waitingSurvey: 0,
  waitingQuotation: 0,
  waitingPayment: 0,
}

type StatusToStateMap = {
  [statusName: string]: keyof typeof initialStatusState
}

const statusToStateMap: StatusToStateMap = {
  PICKLIST: 'totalOrder',
  SURVEYSTART: 'survey',
  WIP: 'onProgress',
  SURVEYDONE: 'complete',
  SURVEYREQ: 'waitingSurvey',
  QUOTEIN: 'waitingQuotation',
  WORKRELATED: 'waitingPayment',
}

const DashboardHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const [orderData, setOrderData] = useState<any[]>([])
  const [orderList, setOrderList] = useState<any[]>([])

  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2)
    .toISOString()
    .split('T')[0]

  const [dateFrom, setDateFrom] = useState<any>(firstDayOfMonth)
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])

  const [store, setStore] = useState<StoreItem[]>([])
  const [province, setProvince] = useState<ProvinceItem[]>([])

  const [selectedStore, setSelectedStore] = useState<any>({
    value: null,
    label: 'All Store',
    city_id: null,
  })

  const [selectedZone, setSelectedZone] = useState<any>({
    value: null,
    label: 'All Zona',
    city_id: null,
  })

  const storeOptions = [{value: null, label: 'All Store', city_id: null}, ...store]

  useEffect(() => {
    const selectedStoreCityId = selectedStore?.city_id
    const filteredProvinces = provinces.filter((item) => item.city_id === selectedStoreCityId)

    if (filteredProvinces.length === 1) {
      setSelectedZone(filteredProvinces[0])
    } else {
      setSelectedZone({value: null, label: 'All Zona', city_id: null})
    }
  }, [selectedStore])

  const fetchOrderList = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&take=0`,
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
      setOrderList(data)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewOrder = () => {
    try {
      const apiData = orderList.map((item: any) => {
        let data

        data = {
          order_id: item.id,
          store_name: item.store.store_name,
          costumer_name: item.members.full_name,
          service_name: item.m_order_details[0]?.item?.service_name ?? '-',
          total: `Rp. ${parseInt(item.grand_total).toLocaleString('id')}`,
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
    fetchOrderList()
  }, [dateFrom, dateTo])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ViewOrder()
        setOrderData(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [orderList])

  useEffect(() => {
    const getStore = async () => {
      try {
        const url = !selectedZone.value
          ? `${apiUrl}/stores`
          : `${apiUrl}/stores?city_id=${selectedZone.value}`

        const response = await axios.get(`${apiUrl}/stores`, {
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
            city_id: item.city_id,
          }))

          setStore(tempStore)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getStore()
  }, [])

  // Province Data
  const provinces = [
    {value: 1, label: 'Aceh', city_id: 1},
    {value: 2, label: 'Bali', city_id: 2},
    {value: 3, label: 'Bangka Belitung', city_id: 3},
    {value: 4, label: 'Banten', city_id: 4},
    {value: 5, label: 'Bengkulu', city_id: 5},
    {value: 6, label: 'DI Yogyakarta', city_id: 6},
    {value: 7, label: 'DKI Jakarta', city_id: 7},
    {value: 8, label: 'Gorontalo', city_id: 8},
    {value: 9, label: 'Jambi', city_id: 9},
    {value: 10, label: 'Jawa Barat', city_id: 10},
    {value: 11, label: 'Jawa Tengah', city_id: 11},
    {value: 12, label: 'Jawa Timur', city_id: 12},
    {value: 13, label: 'Kalimantan Barat', city_id: 13},
    {value: 14, label: 'Kalimantan Selatan', city_id: 14},
    {value: 15, label: 'Kalimantan Tengah', city_id: 15},
    {value: 16, label: 'Kalimantan Timur', city_id: 16},
    {value: 17, label: 'Kalimantan Utara', city_id: 17},
    {value: 18, label: 'Kepulauan Bangka Belitung', city_id: 18},
    {value: 19, label: 'Kepulauan Riau', city_id: 19},
    {value: 20, label: 'Lampung', city_id: 20},
    {value: 21, label: 'Maluku', city_id: 21},
    {value: 22, label: 'Maluku Utara', city_id: 22},
    {value: 23, label: 'Nusa Tenggara Barat', city_id: 23},
    {value: 24, label: 'Nusa Tenggara Timur', city_id: 24},
    {value: 25, label: 'Papua', city_id: 25},
    {value: 26, label: 'Papua Barat', city_id: 26},
    {value: 27, label: 'Riau', city_id: 27},
    {value: 28, label: 'Sulawesi Barat', city_id: 28},
    {value: 29, label: 'Sulawesi Selatan', city_id: 29},
    {value: 30, label: 'Sulawesi Tengah', city_id: 30},
    {value: 31, label: 'Sulawesi Tenggara', city_id: 31},
    {value: 32, label: 'Sulawesi Utara', city_id: 32},
    {value: 33, label: 'Sumatera Barat', city_id: 33},
    {value: 34, label: 'Sumatera Selatan', city_id: 34},
    {value: 35, label: 'Sumatera Utara', city_id: 35},
  ]

  const provinceOptions = [{value: null, label: 'All Zona', city_id: null}, ...provinces]

  // Catch Value From Response API by Status
  const [statusState, setStatusState] = useState(initialStatusState)

  useEffect(() => {
    if (orderList) {
      const storedStatus = sessionStorage.getItem('statusData')
      const statusData = storedStatus ? JSON.parse(storedStatus) : []

      for (const statusName in statusToStateMap) {
        const stateKey = statusToStateMap[statusName]
        const desiredStatus = statusData.find((status: any) => status.category === statusName)

        if (desiredStatus) {
          const statusValue = desiredStatus.value
          const orderCount = orderList.filter((item: any) => item.status.id === statusValue).length

          setStatusState((prevState) => ({
            ...prevState,
            [stateKey]: orderCount,
          }))
        }
      }
    }
  }, [orderList])

  const {
    totalOrder,
    survey,
    onProgress,
    complete,
    waitingSurvey,
    waitingQuotation,
    waitingPayment,
  } = statusState

  return (
    <section id='dashboard-ho'>
      <Row>
        <Col xxl={4} xl={4} lg={12} className='mb-5'>
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

        <Col xxl={4} xl={4} lg={12} className='mb-5'>
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
                  options={provinceOptions}
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
                className='date-range'
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
        </Col>
      </Row>

      <Row className='g-5 g-xl-8 mb-5'>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <div className='fs-5 fw-normal mb-5'>Order</div>

              <Row className='justify-content-md-center'>
                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{totalOrder}</h1>
                    <p className='fs-6 text-center'>Total Order</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{survey}</h1>
                    <p className='fs-6 text-center'>Survey</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{onProgress}</h1>
                    <p className='fs-6 text-center'>On Progress</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{complete}</h1>
                    <p className='fs-6 text-center'>Complete</p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{waitingSurvey}</h1>
                    <p className='fs-6 text-brown  fw-bold  text-center'>
                      Menunggu <br></br> Survey
                    </p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{waitingQuotation}</h1>
                    <p className='fs-6 text-brown  fw-bold  text-center'>
                      Menunggu <br></br> Quotation
                    </p>
                  </div>
                </Col>

                <Col className='mb-5'>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <h1 className='fw-normal'>{waitingPayment}</h1>
                    <p className='fs-6 text-brown fw-bold text-center'>
                      Menunggu <br></br> Bayar
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={4} md={12} className='mb-5'>
          <MoreInformation className='card-xl-stretch' orderData={orderData} />
        </Col>

        <Col lg={4} md={12} className='mb-5'>
          <ChartBarSurvey className='card-xl-stretch' />
        </Col>

        <Col lg={4} md={12} className='mb-5'>
          <ChartBarOrder className='card-xl-stretch' />
        </Col>
      </Row>

      <Row className='mb-5'>
        <Col md={12}>
          <ChartBarPerformance className='card-xl-stretch' />
        </Col>
      </Row>

      <Row className='mb-5'>
        <Col md={12}>
          <TableList className='card-xl-stretch' orderData={orderData} />
        </Col>
      </Row>
    </section>
  )
}

export {DashboardHO}
