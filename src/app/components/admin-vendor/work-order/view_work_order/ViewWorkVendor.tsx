/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {RootState} from '../../../../../store'
import {
  setQueryParams,
  setCurrentPage,
  setPageSize,
  setDateFrom,
  setDateTo,
  setSearchFilter,
  setSelectedOrderStatus,
  setSelectedPaymentQuotationStatus,
} from '../../../../../store/workOrderSlice'

import './ViewWorkOrder.css'

import axios from 'axios'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'

import {LoadingOutlined} from '@ant-design/icons'
import {Table, Tag, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {Row, Form, FormGroup, Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faSearch, faPrint} from '@fortawesome/free-solid-svg-icons'
import {formatDateWithTimeZone} from '../../../../../_metronic/helpers'

import type {ColumnsType} from 'antd/es/table'
import type {FilterValue, SorterResult, TableCurrentDataSource} from 'antd/es/table/interface'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface DataType {
  work_order_id: number
  order_id: number
  existing_tukang: Array<any>
  store_name: string
  date_order: string
  costumer_id: number
  costumer_name: string
  phone_number: number
  payment_quotation: string
  order_status: string
  order_status_label: string
}

const ViewWorkVendor: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Session Storage
  const vendorId = localStorage.getItem('vendor_id')

  // Loader
  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  // Table State
  const [orderData, setOrderData] = useState<DataType[]>([])
  const [totalData, setTotalData] = useState<number>(0)
  const {
    queryParams,
    searchFilter,
    currentPage,
    pageSize,
    dateFrom,
    dateTo,
    selectedOrderStatus,
    selectedPaymentQuotationStatus,
  } = useSelector((state: RootState) => state.workOrder)

  // Status
  const storedStatus = localStorage.getItem('statusData')
  const statusData = storedStatus ? JSON.parse(storedStatus) : []
  const statusFilters = statusData.map((item: any) => ({
    text: item.description,
    value: item.value,
  }))

  // Columns Table
  const renderTooltip = (title: string) => <Tooltip id='button-tooltip'>{title}</Tooltip>
  const columns: ColumnsType<DataType> = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      width: 100,
      sorter: (a, b) => a.order_id - b.order_id,
    },

    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 'fit-content',
      sorter: (a, b) => new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
    },
    {
      title: 'Nama Toko',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      width: 'fit-content',
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'No Member',
      dataIndex: 'costumer_id',
      key: 'costumer_id',
      align: 'center',
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      width: 'fit-content',
      sorter: (a, b) => a.costumer_id - b.costumer_id,
    },
    {
      title: 'Nama Customer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'center',
      width: 'fit-content',
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'No. Telp/WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'center',
      width: 'fit-content',
      sorter: (a, b) => a.phone_number - b.phone_number,
    },

    {
      title: 'Status Order',
      dataIndex: 'order_status_label',
      key: 'order_status_label',
      align: 'left',
      width: 'fit-content',
      filters: statusFilters,
      filterMultiple: true,
      filteredValue: selectedOrderStatus.length > 0 ? selectedOrderStatus : null,
      sorter: (a, b) => a.order_status_label.length - b.order_status_label.length,
      render: (order_status) => {
        const orderStatus = order_status
        let color = ''

        switch (orderStatus) {
          case 'UNPAID':
            color = 'red'
            break
          case 'PAID':
            color = 'green'
            break
          default:
            color = 'blue'
            break
        }

        return <Tag color={color}>{orderStatus}</Tag>
      },
    },
    {
      title: 'Status Pembayaran Quotation',
      dataIndex: 'payment_quotation',
      key: 'payment_quotation',
      align: 'left',
      width: 120,
      filters: [
        {text: 'UNPAID', value: '0'},
        {text: 'PAID', value: '1'},
      ],
      filteredValue:
        selectedPaymentQuotationStatus.length > 0 ? selectedPaymentQuotationStatus : null,
      sorter: (a: DataType, b: DataType) => a.payment_quotation.length - b.payment_quotation.length,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 'fit-content',
      render: (record) => {
        const id = record.order_id

        const handleDetailId = () => {
          navigate(`/work-order/detail-work-order/${id}`)
        }

        const handleUpdateId = () => {
          navigate(`/work-order/update-work-order/${id}`)
        }

        return (
          <div className='button-wrapper d-flex justify-content-center gap-3'>
            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Detail Work Order')}
            >
              <Button variant='primary' className='button-detail' onClick={handleDetailId}>
                <FontAwesomeIcon className='text-white' icon={faBook} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>

            {![
              'QUOTEIN',
              'QUOTATIONPAID',
              'QUOTATIONPAIDSTEPONE',
              'QUOTATIONPAIDSTEPTWO',
              'QUOTATIONPAIDSTEPTHREE',
              'QUOTEOUT',
              'CANCEL',
              'WARRANTYCLAIM',
              'INVESTIGATED',
              'COMPLAINTAPPROVEDBYHO',
              'COMPLAINTREJECTEDBYHO',
              'SURVEYDONE',
              'WORKEND',
              'WORKENDSTEPONE',
              'WORKENDSTEPTWO',
              'WORKENDSTEPTHREE',
            ].includes(record.order_status) ? (
              <OverlayTrigger
                placement='bottom'
                delay={{show: 250, hide: 400}}
                overlay={renderTooltip('Update Work Order')}
              >
                <Button variant='primary' className='button-edit' onClick={handleUpdateId}>
                  <FontAwesomeIcon className='text-white' icon={faPen} fontSize={'13px'} />
                </Button>
              </OverlayTrigger>
            ) : (
              <></>
            )}

            {[
              'QUOTEIN',
              'QUOTEOUT',
              'QUOTATIONPAID',
              'QUOTATIONPAIDSTEPONE',
              'QUOTATIONPAIDSTEPTWO',
              'QUOTATIONPAIDSTEPTHREE',
            ].includes(record.order_status) && (
              <OverlayTrigger
                placement='bottom'
                delay={{show: 250, hide: 400}}
                overlay={renderTooltip('Cetak PDF Quotation')}
              >
                <Button
                  className='button-request'
                  variant='warning'
                  onClick={() =>
                    exportToPDF(record.order_id, record.payment_quotation, record.costumer_name)
                  }
                >
                  <FontAwesomeIcon className='text-white' icon={faPrint} fontSize={'13px'} />
                </Button>
              </OverlayTrigger>
            )}
          </div>
        )
      },
    },
  ]

  const fetchOrderList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/orders?order_by=desc${queryparams}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
        params: {
          search: searchFilter || null,
          page: page,
          take: pageSize,
          dateFrom: dateFrom || null,
          dateTo: dateTo || null,
          vendor_id: vendorId || null,
        },
      })

      setCurrentPage(response?.data?.page ?? 1)
      setTotalData(response?.data?.total ?? 0)

      return response.data.data
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          title: 'Sesi Anda Telah Berakhir',
          text: 'Silahkan Logout dan Login Ulang Kembali',
          icon: 'warning',
          confirmButtonText: 'Ok',
        })
      } else {
        console.log('error when fetching data', error)
      }
    } finally {
      setLoadData(false)
    }
  }

  const ViewOrder = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchOrderList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const orderData = apiData.map((item: any) => {
        let data

        const phoneNumber = item?.project_number.startsWith('0')
          ? item.project_number
          : `+62${item.project_number}`

        const orderDate = formatDateWithTimeZone(item?.created_at)

        const paymentQuotation = (() => {
          if (item?.quotation?.length) {
            if (
              item?.quotation[0]?.receipt_quotation !== null &&
              item?.quotation[0]?.quotation_files.length
            ) {
              return 'PAID'
            } else {
              return 'UNPAID'
            }
          } else {
            return ''
          }
        })()

        data = {
          order_id: item?.id,
          work_order_id: item?.work_orders?.id,
          store_name: item?.store?.store_name,
          date_order: orderDate,
          costumer_id: item?.members?.member_number,
          costumer_name: item?.members?.full_name,
          phone_number: phoneNumber,
          item_name: item?.m_order_details[0]?.item_name ?? '-',
          payment_quotation: paymentQuotation,
          order_status: item?.status?.category,
          order_status_label: item?.status?.description,
          existing_tukang: item?.work_orders?.request_tukang ?? [],
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
    setOrderData(data)
  }

  useEffect(() => {
    fetchData(currentPage, pageSize, queryParams)
    // eslint-disable-next-line
  }, [currentPage, pageSize, queryParams])

  // Table Handler
  const handleChangeSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value))
  }

  const handlePageChange = (page: number, size?: number) => {
    dispatch(setCurrentPage(page))
    if (size) {
      dispatch(setPageSize(size))
    }
  }

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

  const handleFilterTable = (
    pagination: PaginationProps,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[],
    extra: TableCurrentDataSource<DataType>
  ) => {
    const newQueryParams: string[] = []

    if (filters.order_status_label) {
      const statusValues = filters.order_status_label as string[]

      dispatch(setSelectedOrderStatus(statusValues))

      if (statusValues.length > 0) {
        newQueryParams.push(`&status=${statusValues.join(',')}`)
      }
    } else {
      dispatch(setSelectedOrderStatus([]))
    }

    if (filters.payment_quotation) {
      const paymentQuotationValues = filters.payment_quotation as string[]

      dispatch(setSelectedPaymentQuotationStatus(paymentQuotationValues))

      if (paymentQuotationValues.length > 0) {
        newQueryParams.push(`&is_receipt_quotation=${paymentQuotationValues.join(',')}`)
      }
    } else {
      dispatch(setSelectedPaymentQuotationStatus([]))
    }

    const finalQueryParams = newQueryParams.join('')

    dispatch(setQueryParams(finalQueryParams))
    dispatch(setCurrentPage(1))

    fetchData(currentPage, pageSize, finalQueryParams)
  }

  const handleSubmitFilter = async () => {
    setLoadingButton(true)
    dispatch(setCurrentPage(1))

    try {
      const data = await ViewOrder(currentPage, pageSize, queryParams)
      setOrderData(data)
    } catch (error) {
      console.error('Error getting order list data:', error)
    } finally {
      setLoadingButton(false)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubmitFilter()
    }
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
    <section id='view-work-order-vendor'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <Row className='table-head-wrapper'>
            <div
              className='d-flex flex-column flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row align-items-start align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center justify-content-start gap-3'
              onKeyDown={handleKeyPress}
            >
              <h3 className='d-flex align-items-center fs-5 fw-normal'>Date</h3>

              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range'
                value={[
                  dateFrom ? dayjs(dateFrom, 'YYYY-MM-DD') : null,
                  dateTo ? dayjs(dateTo, 'YYYY-MM-DD') : null,
                ]}
                onChange={(values) => {
                  if (values && values.length === 2) {
                    const dateFromFormatted = values[0]?.format('YYYY-MM-DD') || ''
                    const dateToFormatted = values[1]?.format('YYYY-MM-DD') || ''

                    dispatch(setDateFrom(dateFromFormatted))
                    dispatch(setDateTo(dateToFormatted))
                  } else {
                    dispatch(setDateFrom(''))
                    dispatch(setDateTo(''))
                  }
                }}
              />

              <div className='filter-search'>
                <FormGroup>
                  <Form.Control
                    placeholder='Search'
                    className='filter-ltr'
                    value={searchFilter ?? ''}
                    onChange={handleChangeSearchFilter}
                  />

                  <span className='search-icon'>
                    <FontAwesomeIcon icon={faSearch} className='text-black' size='sm' />
                  </span>
                </FormGroup>
              </div>

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
                dataSource={orderData}
                rowKey={(record) => record.order_id}
                pagination={false}
                sticky={true}
                tableLayout='auto'
                scroll={{x: 1700}}
                onChange={handleFilterTable}
              />
            </div>
          </Spin>

          <div className='pagination-container mt-5'>
            <span className='total-text'>
              Showing {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, totalData)} of {totalData} Order
            </span>

            <Pagination
              className='pagination'
              pageSize={pageSize}
              current={currentPage}
              total={totalData}
              showSizeChanger
              pageSizeOptions={[5, 10, 20, 50, 100, 250, 500]}
              itemRender={itemRender}
              onChange={(page, pageSize) => {
                handlePageChange(page, pageSize)
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export {ViewWorkVendor}
