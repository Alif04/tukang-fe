/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import axiosInstance from '../../../../../_metronic/layout/core/axiosInterceptor'

import './ViewQuotation.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'
import type {ColumnsType} from 'antd/es/table'
import {LoadingOutlined} from '@ant-design/icons'
import {Table, Tag, DatePicker, PaginationProps, Spin, Pagination} from 'antd'
import {Row, Col, Form, FormGroup, Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faSearch, faPrint} from '@fortawesome/free-solid-svg-icons'
import {formatDateWithTime} from '../../../../../_metronic/helpers'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface Status {
  value: number | null
  category: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
}

interface DataType {
  key: React.Key
  quotation_id: number
  store_name: string
  order_id: number
  date_order: Date
  costumer_name: string
  vendor_name: string
  payment_status: string
  receipt_quotation: string
  order_status: string
  order_status_label: string
  quotation_status: string
  period_active: Date
  countdown_to_expired: Date
  period_expired: Date
  grand_total: string
}

interface VendorItem {
  value: number | null
  label: string
}

const ViewQuotationHO: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [loadingButton, setLoadingButton] = useState(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [quotationData, setQuotationData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const [vendor, setVendor] = useState<VendorItem[]>([])
  const [selectedVendor, setSelectedVendor] = useState<SingleValue<VendorItem>>({
    value: null,
    label: 'All Vendor',
  })

  // Status
  const storedStatus = sessionStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const vendorOptions = [{value: null, label: 'All Vendor'}, ...vendor]

  const renderTooltip = (title: string) => <Tooltip id='button-tooltip'>{title}</Tooltip>

  const columns: ColumnsType<DataType> = [
    {
      title: 'Quotation ID',
      dataIndex: 'quotation_id',
      key: 'quotation_id',
      align: 'center',
      defaultSortOrder: 'descend',
      width: 100,
      sorter: (a, b) => a.quotation_id - b.quotation_id,
    },
    {
      title: 'Nama Toko',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      className: 'col_order_id',
      width: 100,
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      sorter: (a, b) => new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
    },
    {
      title: 'Costumer Name',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'Nama Vendor',
      dataIndex: 'vendor_name',
      key: 'vendor_name',
      align: 'left',
      onFilter: (value, record) => record.vendor_name.includes(String(value)),
      sorter: (a, b) => a.vendor_name.length - b.vendor_name.length,
    },
    {
      title: 'Status Pembayaran Quotation',
      dataIndex: 'payment_status',
      key: 'payment_status',
      align: 'left',
      width: 100,
      onFilter: (value, record) => record.payment_status.includes(String(value)),
      sorter: (a, b) => a.payment_status.length - b.payment_status.length,
    },
    {
      title: 'Receipt Quotation',
      dataIndex: 'receipt_quotation',
      key: 'receipt_quotation',
      align: 'left',
      onFilter: (value, record) => record.receipt_quotation.includes(String(value)),
      sorter: (a, b) => a.receipt_quotation.length - b.receipt_quotation.length,
    },
    {
      title: 'Tanggal Aktif Quotation',
      dataIndex: 'period_active',
      key: 'period_active',
      align: 'left',
      sorter: (a: DataType, b: DataType) =>
        new Date(a.period_active).getTime() - new Date(b.period_active).getTime(),
    },
    {
      title: 'Umur Masa Quotation',
      dataIndex: 'countdown_to_expired',
      key: 'countdown_to_expired',
      align: 'left',
      sorter: (a: DataType, b: DataType) =>
        new Date(a.countdown_to_expired).getTime() - new Date(b.countdown_to_expired).getTime(),
    },
    {
      title: 'Tanggal Quotation Expired',
      dataIndex: 'period_expired',
      key: 'period_expired',
      align: 'left',
      sorter: (a: DataType, b: DataType) =>
        new Date(a.period_expired).getTime() - new Date(b.period_expired).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'quotation_status',
      key: 'quotation_status',
      align: 'left',
      sorter: (a, b) => a.quotation_status.length - b.quotation_status.length,
    },
    {
      title: 'Status Order',
      dataIndex: 'order_status_label',
      key: 'order_status_label',
      align: 'left',
      render: (order_status_label) => {
        const orderStatus = order_status_label
        let color = ''

        switch (orderStatus) {
          case 'QUOTEIN':
            color = 'green'
            break
          case 'QUOTEOUT':
            color = 'lime'
            break
          default:
            color = 'blue'
            break
        }

        return <Tag color={color}>{orderStatus}</Tag>
      },
      onFilter: (value, record) => record.order_status_label.includes(String(value)),
      sorter: (a, b) => a.order_status_label.length - b.order_status_label.length,
    },
    {
      title: 'Grand Total Quotation',
      dataIndex: 'grand_total',
      key: 'grand_total',
      align: 'left',
      onFilter: (value, record) => record.grand_total.includes(String(value)),
      sorter: (a, b) => a.grand_total.length - b.grand_total.length,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (record) => {
        const id = record.quotation_id

        const handleDetail = () => {
          navigate(`/quotation/detail-quotation/${id}`)
        }

        const handleEdit = () => {
          navigate(`/quotation/update-quotation/${id}`)
        }

        return (
          <div className='button-wrapper d-flex justify-content-center gap-3'>
            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Detail Quotation')}
            >
              {/* <Button variant='primary' className='button-detail' onClick={handleDetail}>
                <FontAwesomeIcon className='text-white' icon={faBook} fontSize={'13px'} />
              </Button> */}

              <a
                href={`/quotation/detail-quotation/${id}`}
                target='_blank'
                rel='noopener noreferrer'
                className='btn btn-primary button-detail'
                onClick={(e) => {
                  e.preventDefault()
                  handleDetail()
                }}
              >
                <FontAwesomeIcon className='text-white' icon={faBook} fontSize={'13px'} />
              </a>
            </OverlayTrigger>

            {['QUOTATIONDRAFT', 'QUOTEIN', 'QUOTEOUT', 'UNPAID', 'REJECTED', 'APPROVED'].includes(
              record.order_status
            ) && (
              <OverlayTrigger
                placement='bottom'
                delay={{show: 250, hide: 400}}
                overlay={renderTooltip('Edit Quotation')}
              >
                {/* <Button variant='primary' className='button-edit' onClick={handleEdit}>
                  <FontAwesomeIcon className='text-white' icon={faPen} fontSize={'13px'} />
                </Button> */}

                <a
                  href={`/quotation/update-quotation/${id}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn btn-primary button-edit'
                  onClick={(e) => {
                    e.preventDefault()
                    handleEdit()
                  }}
                >
                  <FontAwesomeIcon className='text-white' icon={faPen} fontSize={'13px'} />
                </a>
              </OverlayTrigger>
            )}

            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Cetak PDF Quotation')}
            >
              <Button
                className='button-request'
                variant='warning'
                onClick={() =>
                  exportToPDF(record.order_id, record.payment_status, record.costumer_name)
                }
              >
                <FontAwesomeIcon className='text-white' icon={faPrint} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>
          </div>
        )
      },
    },
  ]

  const getQuotationList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/quotation?order_by=desc&page=${page}&take=${pageSize}${queryparams}`

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

  const ViewQuotation = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await getQuotationList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from getQuotationList')
        return []
      }

      const quotationData = apiData.map((item: any) => {
        let data

        const orderDate = formatDateWithTime(item?.order?.created_at)

        const paymentStatus = (() => {
          if (item?.receipt_quotation !== null && item?.quotation_files.length) {
            return 'PAID'
          } else {
            return 'UNPAID'
          }
        })()

        const createdAt = item?.quotation_validity ? new Date(item.quotation_validity) : null
        const createdAtMinus = createdAt
          ? new Date(createdAt.getTime() - 6 * 24 * 60 * 60 * 1000)
          : null

        const quotationCreatedAt = createdAtMinus
          ? createdAtMinus.toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          : 'Quotation belum aktif'

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

        const quotationStatus =
          item?.quotation_validity === null
            ? 'Quotation Belum Aktif'
            : quotationCountdown.days === 0 &&
              quotationCountdown.hours === 0 &&
              quotationCountdown.minutes === 0
            ? 'Quotation Expired'
            : 'Quotation Aktif'

        data = {
          quotation_id: item.id,
          store_name: item?.store?.store_name ?? '-',
          order_id: item.order.id,
          date_order: orderDate,
          costumer_name: item?.order?.members?.full_name ?? '',
          vendor_name: item?.order?.vendor?.company_name ?? '-',
          payment_status: paymentStatus,
          order_status: item?.order?.status?.category,
          order_status_label: item?.order?.status?.description ?? '',
          period_active: quotationCreatedAt,
          period_expired: quotationEndDate,
          countdown_to_expired: quotationCountdownText,
          quotation_status: quotationStatus,
          grand_total: `Rp. ${
            [parseInt(item?.quotation_grand_total).toLocaleString('id-ID')] ?? 0
          }`,
          receipt_quotation: item.receipt_quotation
            ? item.receipt_quotation
            : 'Quotation belum dibayar',
        }

        return data
      })

      return quotationData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewQuotation(page, pageSize, queryparams)
    setQuotationData(data)
  }

  useEffect(() => {
    fetchData(1, 50, '')
  }, [])

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

  useEffect(() => {
    const getVendor = async () => {
      try {
        const response = await axios.get(`${apiUrl}/vendor?take=0`, {
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

          setVendor(tempVendor)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getVendor()
  }, [])

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubmitFilter()
    }
  }

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
    valueCheck(`&search=`, searchFilter)
    valueCheck(`&vendor_id=`, selectedVendor?.value)

    const data = await ViewQuotation(1, 50, queryparams)
    setQuotationData(data)

    setLoadingButton(false)
  }

  // Export PDF Quotation
  const exportToPDF = (order_id: number, receipt_quotation: string, customer_name: string) => {
    axios
      .get(`${apiUrl}/orders/quotation-pdf/${order_id}`, {
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
          `Quotation ${
            receipt_quotation === 'UNPAID' ? 'Belum Dibayar' : 'Sudah Dibayar'
          } - ${customer_name} - Order ID ${order_id}.pdf`
        )
        document.body.appendChild(link)
        link.click()
      })
      .catch((error: any) => {
        Swal.fire('Error', 'Terjadi kesalahan saat mengekspor data', 'error')
      })
  }

  return (
    <section id='view-quotation'>
      <div className={`card ${className}`}>
        <div className='card-body'>
          <Row className='table-head-wrapper'>
            <div
              className='d-flex flex-column flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row align-items-start align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center justify-content-start gap-3'
              onKeyDown={handleKeyPress}
            >
              <h3 className='d-flex align-items-center fs-5 fw-normal'>Date</h3>

              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range'
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

              <div className='filter-search'>
                <FormGroup>
                  <Form.Control
                    placeholder='Search'
                    className='filter-ltr'
                    onChange={handleChangeSearchFilter}
                  />

                  <span className='search-icon'>
                    <FontAwesomeIcon icon={faSearch} className='text-black' size='sm' />
                  </span>
                </FormGroup>
              </div>

              <Select
                name='vendor_id'
                className='form-control w-50 p-0'
                classNamePrefix='select'
                placeholder='Pilih Vendor'
                isSearchable={true}
                isClearable={true}
                options={vendorOptions}
                value={selectedVendor}
                onChange={(newValue) => setSelectedVendor(newValue)}
              />

              <Button
                className='btn-dark-primary button-submit m-0'
                disabled={loadingButton}
                onClick={handleSubmitFilter}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>
            </div>
          </Row>

          <Spin
            tip='Loading...'
            spinning={loadData}
            size='large'
            indicator={<LoadingOutlined style={{fontSize: 24}} spin />}
          >
            <div className='table-custom-wrapper'>
              <Table
                className='table-striped-rows'
                bordered
                columns={columns}
                dataSource={quotationData}
                rowKey={(record) => record.quotation_id}
                pagination={false}
                sticky={true}
                tableLayout='auto'
                scroll={{x: 'max-content'}}
              />
            </div>
          </Spin>

          <Pagination
            className='mt-5'
            style={{textAlign: 'right', position: 'relative'}}
            current={currentPage}
            total={totalData}
            showSizeChanger
            defaultPageSize={50}
            pageSizeOptions={[5, 10, 20, 50, 100, 250, 500]}
            itemRender={itemRender}
            onChange={(page, pageSize) => {
              fetchData(page, pageSize, '')
            }}
            showTotal={(total, range) => (
              <span style={{left: 0, position: 'absolute'}}>
                Showing {range[0]} - {range[1]} of {total} Total Quotation
              </span>
            )}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewQuotationHO}
