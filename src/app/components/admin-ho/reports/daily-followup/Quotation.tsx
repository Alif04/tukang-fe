import React, {useState, useEffect} from 'react'
import {DailyQuotation} from '../../../../interfaces/quotation'
import '../report/ReportHO.css'

import axios from 'axios'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import Select from 'react-select'
import type {ColumnsType} from 'antd/es/table'
import {LoadingOutlined} from '@ant-design/icons'
import {Table, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {
  Card,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Modal,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faNoteSticky} from '@fortawesome/free-solid-svg-icons'
import {formatDate} from '../../../../../_metronic/helpers'

const {RangePicker} = DatePicker

type Props = {
  endpoint: string
  headerColor: string
  title: string
  params: string
  statusName: string[]
}

interface Status {
  value: number
  category: string
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

interface TimeLeft {
  days: number
  hours: number
  minutes: number
}

interface DataType {
  order_id: number
  quotation_id: number
  store_name: string
  date_order: string
  costumer_name: string
  vendor_name: string
  grand_total: number
  countdown_to_expired: string
  follow_up_1: number
  follow_up_2: number
  follow_up_3: number
  description: string
}

const DailyFollowUpQuotation: React.FC<Props> = ({
  endpoint,
  statusName,
  headerColor,
  title,
  params,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL

  const storedStatus = sessionStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
  const desiredStatus = statusData.filter((status) => statusName.includes(status.category))
  const statuses = desiredStatus.map((x) => x.value)

  // Report Data
  const [reportData, setReportData] = useState<DataType[]>([])
  const [reportGrandTotal, setReportGrandTotal] = useState<any>(0)

  console.log('report grand total', reportGrandTotal)

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(50)
  const [totalOrder, setTotalOrder] = useState<number>(0)

  // Loader
  const [loadData, setLoadData] = useState<boolean>(true)
  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loadingExport, setLoadingExport] = useState<boolean>(false)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false)

  const [dateFrom, setDateFrom] = useState<any>(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  )
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])

  const [store, setStore] = useState<StoreItem[]>([])
  const [area, setArea] = useState<AreaItem[]>([])

  const [selectedStore, setSelectedStore] = useState<any>({
    value: null,
    label: 'All Store',
    city_id: null,
  })

  const [selectedZone, setSelectedZone] = useState<any>({
    value: null,
    label: 'All Zona',
    provice_id: null,
  })

  const storeOptions = [{value: null, label: 'All Store', city_id: null}, ...store]
  const zoneOptions = [{value: null, label: 'All Zona'}, ...area]

  // Daily Quotation
  const [dailyQuotation, setDailyQuotation] = useState<DailyQuotation>({
    quotation_follow_up: [
      {
        quotation_id: null,
        follow_up_1: 0,
        follow_up_2: 0,
        follow_up_3: 0,
        description: '',
      },
    ],
  })

  const fetchAllReportData = async (endpoint: string, queryparams: any) => {
    try {
      let url = `${apiUrl}/${endpoint}?order_by=desc&take=0${params}`

      if (statuses.length) {
        url += `&status=${statuses}`
      }

      if (queryparams) {
        url += queryparams
      }

      if (dateFrom && dateTo) {
        url += `&date_from=${dateFrom}&date_to=${dateTo}`
      }

      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response?.data) {
        setReportGrandTotal(parseInt(response?.data?.quotationGrandTotal ?? 0))
        return response?.data?.quotationGrandTotal ?? 0
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchReportData = async (
    endpoint: string,
    page: number,
    pageSize: number,
    queryparams: any
  ) => {
    try {
      let url = `${apiUrl}/${endpoint}?order_by=desc&page=${page}&take=${pageSize}${params}`

      if (statuses.length) {
        url += `&status=${statuses}`
      }

      if (queryparams) {
        url += queryparams
      }

      if (dateFrom && dateTo) {
        url += `&date_from=${dateFrom}&date_to=${dateTo}`
      }

      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response?.data?.data

      setLoadData(false)
      setCurrentPage(response?.data?.page ?? 1)
      setTotalOrder(response?.data?.total ?? 0)

      // if (data) {
      //   setDailyQuotation((prev: any) => ({
      //     ...prev,
      //     quotation_follow_up: data?.map((item: any) => ({
      //       quotation_id: item?.id ?? null,
      //       follow_up_1: item?.quotation_follow_up[0]?.follow_up_1 === true ? 1 : 0,
      //       follow_up_2: item?.quotation_follow_up[0]?.follow_up_2 === true ? 1 : 0,
      //       follow_up_3: item?.quotation_follow_up[0]?.follow_up_3 === true ? 1 : 0,
      //       description: item?.quotation_follow_up[0]?.description ?? '',
      //     })),
      //   }))
      // }

      if (data) {
        setDailyQuotation((prev: any) => ({
          ...prev,
          quotation_follow_up: data?.map((item: any) => {
            const lastFollowUp = item?.quotation_follow_up.slice(-1)[0] || {}

            return {
              quotation_id: item?.id ?? null,
              follow_up_1: lastFollowUp?.follow_up_1 === true ? 1 : 0,
              follow_up_2: lastFollowUp?.follow_up_2 === true ? 1 : 0,
              follow_up_3: lastFollowUp?.follow_up_3 === true ? 1 : 0,
              description: lastFollowUp?.description ?? '',
            }
          }),
        }))
      }

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewReportData = async (
    endpoint: string,
    page: number,
    pageSize: number,
    queryparams: any
  ) => {
    try {
      const apiData = await fetchReportData(endpoint, page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from getReportData')
        return []
      }

      const quotationData = apiData.map((item: any) => {
        let data

        const orderDate = formatDate(item?.order?.created_at)

        const createdAt = item?.quotation_validity ? new Date(item.quotation_validity) : null
        const createdAtMinus = createdAt
          ? new Date(createdAt.getTime() - 6 * 24 * 60 * 60 * 1000)
          : null

        let quotationEndDate = '-'
        let cooldownQuotation = 0

        if (createdAtMinus) {
          const quotationEnd = new Date(createdAtMinus.getTime() + 7 * 24 * 60 * 60 * 1000)
          quotationEndDate = quotationEnd.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
          cooldownQuotation = quotationEnd.getTime() - new Date().getTime()
        }

        const calculateTimeLeft = (timeLeft: number): TimeLeft => {
          let time: TimeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
          }

          if (timeLeft > 0) {
            time = {
              days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
              hours: Math.floor((timeLeft / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((timeLeft / 1000 / 60) % 60),
            }
          } else {
            time = {
              days: 0,
              hours: 0,
              minutes: 0,
            }
          }

          return time
        }

        const quotationCountdown = calculateTimeLeft(cooldownQuotation)
        const quotationCountdownText =
          item?.quotation_validity === null
            ? 'Quotation Belum Aktif'
            : quotationCountdown.days === 0 &&
              quotationCountdown.hours === 0 &&
              quotationCountdown.minutes === 0
            ? 'Quotation Expired'
            : `${quotationCountdown.days} Hari ${quotationCountdown.hours} Jam ${quotationCountdown.minutes} Menit`

        data = {
          quotation_id: item.id,
          store_name: item?.store?.store_name ?? '-',
          order_id: item?.order?.id,
          date_order: orderDate,
          costumer_name: item?.order?.members?.full_name ?? '',
          vendor_name: item?.order?.vendor?.company_name ?? '-',
          order_status: item?.status?.description ?? '',
          countdown_to_expired: quotationCountdownText,
          follow_up_1: item?.follow_up_1 ?? 0,
          follow_up_2: item?.follow_up_2 ?? 0,
          follow_up_3: item?.follow_up_3 ?? 0,
          description: item?.description ?? '',
          quotation_status: item?.status?.category ?? '',
          grand_total: `Rp. ${
            [parseInt(item?.quotation_grand_total).toLocaleString('id-ID')] ?? 0
          }`,
        }

        return data
      })

      return quotationData
    } catch (error) {
      console.error('Error getting report list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewReportData(endpoint, page, pageSize, queryparams)
    setReportData(data)
  }

  useEffect(() => {
    fetchData(currentPage, pageSize, '')
    fetchAllReportData(endpoint, '')
  }, [currentPage, pageSize])

  useEffect(() => {
    const selectedStoreCityId = selectedStore?.city_id
    const filteredZone = area.filter((item) => item.value === selectedStoreCityId)

    if (filteredZone.length === 1) {
      setSelectedZone(filteredZone[0])
    } else {
      setSelectedZone({value: null, label: 'All Zona', city_id: null})
    }
  }, [selectedStore])

  useEffect(() => {
    const getStore = async () => {
      try {
        const url = !selectedZone.value
          ? `${apiUrl}/stores?take=0`
          : `${apiUrl}/stores?city_id=${selectedZone.value}`

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

  // Table Column
  const renderTooltip = (title: string) => <Tooltip id='button-tooltip'>{title}</Tooltip>
  const columns: ColumnsType<DataType> = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'left',
      width: 80,
      className: 'col_order_id',
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Nama Toko',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'left',
      width: 110,
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'left',
      width: 110,
      onFilter: (value, record) => record.date_order.includes(String(value)),
      sorter: (a, b) => a.date_order.length - b.date_order.length,
    },
    {
      title: 'Nama Customer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 110,
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'Nama Vendor',
      dataIndex: 'vendor_name',
      key: 'vendor_name',
      align: 'left',
      width: 110,
      onFilter: (value, record) => record.vendor_name.includes(String(value)),
      sorter: (a, b) => a.vendor_name.length - b.vendor_name.length,
    },
    {
      title: 'Grand Total',
      dataIndex: 'grand_total',
      key: 'grand_total',
      align: 'left',
      width: 130,
      sorter: (a, b) => a.grand_total - b.grand_total,
    },
    {
      title: 'Umur Masa Quotation',
      dataIndex: 'countdown_to_expired',
      key: 'countdown_to_expired',
      align: 'left',
      width: 130,
      onFilter: (value, record) => record.countdown_to_expired.includes(String(value)),
      sorter: (a, b) => a.countdown_to_expired.length - b.countdown_to_expired.length,
    },
    {
      title: 'FU1',
      key: 'follow_up_1',
      align: 'center',
      width: 80,
      render: (record) => {
        const followUpItem = dailyQuotation.quotation_follow_up.find(
          (x) => x.quotation_id === record.quotation_id
        )
        const isChecked = followUpItem && followUpItem.follow_up_1 === 1 ? true : false

        return (
          <FormGroup>
            <Form.Check
              className='daily-follow-up-checkbox'
              type='checkbox'
              checked={isChecked}
              onChange={(e) =>
                checkboxHandler(record.quotation_id, 'follow_up_1', e.target.checked)
              }
            />
          </FormGroup>
        )
      },
    },
    {
      title: 'FU2',
      key: 'follow_up_2',
      align: 'center',
      width: 80,
      render: (record) => {
        const followUpItem = dailyQuotation.quotation_follow_up.find(
          (x) => x.quotation_id === record.quotation_id
        )
        const isChecked = followUpItem && followUpItem.follow_up_2 === 1 ? true : false

        return (
          <FormGroup>
            <Form.Check
              className='daily-follow-up-checkbox'
              type='checkbox'
              checked={isChecked}
              onChange={(e) =>
                checkboxHandler(record.quotation_id, 'follow_up_2', e.target.checked)
              }
            />
          </FormGroup>
        )
      },
    },
    {
      title: 'FU3',
      key: 'follow_up_3',
      align: 'center',
      width: 80,
      render: (record) => {
        const followUpItem = dailyQuotation.quotation_follow_up.find(
          (x) => x.quotation_id === record.quotation_id
        )
        const isChecked = followUpItem && followUpItem.follow_up_3 === 1 ? true : false

        return (
          <FormGroup>
            <Form.Check
              className='daily-follow-up-checkbox'
              type='checkbox'
              checked={isChecked}
              onChange={(e) =>
                checkboxHandler(record.quotation_id, 'follow_up_3', e.target.checked)
              }
            />
          </FormGroup>
        )
      },
    },
    {
      title: 'Catatan',
      key: 'description',
      align: 'center',
      width: 100,
      render: (record) => {
        const id = record.quotation_id

        const handleShowModal = (id: number) => {
          const selected = reportData.find((item: any) => item.quotation_id === id)

          if (selected) {
            setSelectedQuotationId(selected?.quotation_id)
            setShowModal(true)
          }
        }

        return (
          <div className='button-wrapper d-flex justify-content-center align-items-center gap-3'>
            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Catatan Follow Up')}
            >
              <Button
                variant='primary'
                className='button-verif'
                onClick={() => handleShowModal(id)}
              >
                <FontAwesomeIcon className='text-white' icon={faNoteSticky} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>
          </div>
        )
      },
    },
  ]

  // Render
  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

  // Export Excel
  const exportToExcel = () => {
    setLoadingExport(true)

    let url = `${apiUrl}/${endpoint}/export-excel-follow-up?take=0${params}`

    const valueCheck = (key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        url += `${key}${value}`
      }
    }

    valueCheck(`&date_from=`, dateFrom)
    valueCheck(`&date_to=`, dateTo)

    axios
      .get(url, {
        method: 'GET',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute(
          'download',
          `Report ${title} ${dateFrom && dateTo ? `Periode ${dateFrom} - ${dateTo}` : ''}.xlsx`
        )
        document.body.appendChild(link)
        link.click()

        setLoadingExport(false)
      })
  }

  // Export To PDF
  const exportToPDF = () => {
    setLoadingPdf(true)

    let url = `${apiUrl}/quotation/export-pdf-follow-up?order_by=desc`

    const valueCheck = (key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        url += `${key}${value}`
      }
    }

    valueCheck(`&date_from=`, dateFrom)
    valueCheck(`&date_to=`, dateTo)

    axios
      .get(url, {
        method: 'GET',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `Report Performance.pdf`)
          document.body.appendChild(link)
          link.click()

          setLoadingPdf(false)
        } else {
          Swal.fire({
            title: 'Warning',
            text: response.data.message,
            icon: 'warning',
          })

          setLoadingPdf(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setLoadingPdf(false)
      })
  }

  // Submit Filter
  const handleSubmitFilter = async (endpoint: string) => {
    setLoadingButton(true)

    let queryparams = ``

    const valueCheck = (key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        queryparams += `${key}${value}`
      }
    }

    valueCheck(`&store_id=`, selectedStore?.value)

    const reportGrandTotal = await fetchAllReportData(endpoint, queryparams)
    setReportGrandTotal(parseInt(reportGrandTotal))

    const data = await ViewReportData(endpoint, 1, pageSize, queryparams)
    setReportData(data)

    setLoadingButton(false)
  }

  // Daily Quotation Handler
  const [selectedQuotationId, setSelectedQuotationId] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const handleCloseModal = () => {
    setShowModal(false)
  }

  const dailyQuotationHandler = (e: any) => {
    setDailyQuotation((prev) => ({
      quotation_follow_up: prev.quotation_follow_up.map((item) =>
        item.quotation_id === selectedQuotationId ? {...item, description: e.target.value} : item
      ),
    }))
  }

  const checkboxHandler = (quotation_id: number, followUp: string, isChecked: boolean) => {
    setDailyQuotation((prev) => ({
      quotation_follow_up: prev.quotation_follow_up.map((item) =>
        item.quotation_id === quotation_id ? {...item, [followUp]: isChecked ? 1 : 0} : item
      ),
    }))
  }

  const handleSubmitFollowUp = async () => {
    setIsLoadingSubmit(true)

    await axios
      .post(`${apiUrl}/quotation/follow-up`, dailyQuotation, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          Swal.fire({
            title: 'Success',
            text: 'Berhasil menyimpan daily follow up quotation',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.reload()
          })

          setIsLoadingSubmit(false)
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })

          setIsLoadingSubmit(false)
        }
      })
      .catch((error) => {
        setIsLoadingSubmit(false)

        Swal.fire({
          title: 'Terjadi Kesalahan Pada Server',
          text: 'Tolong untuk mencoba hubungi administrator',
          icon: 'error',
        })
      })
  }

  return (
    <section id='view-report-ho'>
      <Row className='mb-5'>
        <Col xxl={4} xl={4} sm={12}>
          <Row>
            <Col xxl={4} xl={4} lg={4} className='d-flex align-items-center'>
              <h3 className='title-header fs-5 fw-normal'>Pilih rentang waktu</h3>
            </Col>

            <Col xxl={8} xl={8} lg={8}>
              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range w-100'
                defaultValue={[dayjs().subtract(30, 'day'), dayjs()]}
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

        <Col xxl={3} xl={3} sm={12}>
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

        <Col xxl={3} xl={3} sm={12}>
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

        <Col xxl={2} xl={2} sm={12}>
          <Button
            className='btn-dark-primary button-submit'
            disabled={loadingButton}
            onClick={() => handleSubmitFilter(endpoint)}
          >
            {loadingButton ? 'Filtering..' : 'Submit'}
          </Button>
        </Col>
      </Row>

      <Row className='mb-5'>
        <Col>
          <Card className={`border-top border-${headerColor} border-5`}>
            <Card.Body>
              <div className='d-flex justify-content-between align-items-center'>
                <h3 className='fs-3 fw-semibold text-uppercase mb-3'>{title}</h3>

                <div className='button-wrapper gap-3'>
                  <button className='button-export' onClick={exportToPDF}>
                    <h3 className='fs-5 fw-semibold'>
                      {loadingPdf ? 'Exporting..' : 'Export To PDF'}
                    </h3>
                  </button>

                  <button className='button-export' onClick={exportToExcel}>
                    <h3 className='fs-5 fw-semibold'>
                      {loadingExport ? 'Exporting..' : 'Export To Excel'}
                    </h3>
                  </button>
                </div>
              </div>

              <h1 className='fs-1 fw-bold'>{`Rp. ${reportGrandTotal.toLocaleString('id')}`}</h1>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className='mb-5'>
        <Col>
          <Spin
            tip='Loading...'
            spinning={loadData}
            size='large'
            indicator={<LoadingOutlined style={{fontSize: 24}} spin />}
          >
            <div className='table-custom-wrapper'>
              <Table
                bordered
                columns={columns}
                dataSource={reportData}
                rowKey={(record) => record.quotation_id}
                tableLayout='auto'
                scroll={{x: 'max-content'}}
                pagination={false}
                sticky={true}
              />
            </div>
          </Spin>

          <div className='pagination-container mt-5'>
            <span className='total-text'>
              Showing {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, totalOrder)} of {totalOrder} Quotation
            </span>

            <Pagination
              className='pagination'
              current={currentPage}
              total={totalOrder}
              showSizeChanger
              defaultPageSize={pageSize}
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
        </Col>
      </Row>

      <Row>
        <Col className='d-flex align-items-center justify-content-center mb-5'>
          <Button
            className='d-flex justify-content-center align-items-center w-100'
            variant='dark-primary'
            disabled={isLoadingSubmit}
            onClick={handleSubmitFollowUp}
          >
            {isLoadingSubmit ? 'Submitting..' : 'Submit Follow Up'}
          </Button>
        </Col>
      </Row>

      {/* Modal Input Catatan Follow Up */}
      <Modal
        dialogClassName='modal-upload-notes'
        centered
        show={showModal}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Catatan Follow Up Quotation</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className='notes mb-5'>
            <Form.Group>
              <Form.Label className='fs-5 fw-bold'>Catatan :</Form.Label>
              <Form.Control
                style={{minHeight: '140px'}}
                as='textarea'
                onChange={(e) => dailyQuotationHandler(e)}
                value={
                  dailyQuotation.quotation_follow_up.find(
                    (item) => item.quotation_id === selectedQuotationId
                  )?.description ?? ''
                }
              />
            </Form.Group>
          </Row>
        </Modal.Body>
      </Modal>
    </section>
  )
}

export {DailyFollowUpQuotation}
