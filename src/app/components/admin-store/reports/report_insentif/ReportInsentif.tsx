/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import axiosInstance from '../../../../../_metronic/layout/core/axiosInterceptor'

import './ReportInsentif.css'

import axios from 'axios'
import dayjs from 'dayjs'
import type {ColumnsType} from 'antd/es/table'
import {Table, PaginationProps, Spin, Pagination} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
import {Row, Form, InputGroup, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface DataType {
  id: number
  order_id: number
  date_order: Date
  costumer_name: string
  order_status: string
  sales_name: string
  incentive_name: string
  incentive_nominal: string
  quotation_grand_total: number
  sales_comission: number
  status: string
}

const ReportInsentifStore: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL

  const userRole = localStorage.getItem('userRole') as string
  const userStore = localStorage.getItem('storeId')
  const userStoreName = localStorage.getItem('storeName')
  const userSales = localStorage.getItem('sales_id') as any

  const salesId = userSales ? `&sales_id=${userSales}` : ''
  const storeId = userStore ? `&store_id=${userStore}` : ''

  const [orderData, setOrderData] = useState<DataType[]>([])
  const [queryParams, setQueryParams] = useState('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalOrder, setTotalOrder] = useState<number>(0)
  const [totalInsentive, setTotalInsentive] = useState<any>()

  const today = new Date()
  const [dateFrom, setDateFrom] = useState<any>(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])
  const [searchFilter, setSearchFilter] = useState<string>('')
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const [loadData, setLoadData] = useState<boolean>(true)
  const [loadingButton, setLoadingButton] = useState(false)
  const [loadingExport, setLoadingExport] = useState(false)

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 110,
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      sorter: (a: DataType, b: DataType) => a.id - b.id,
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 110,
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      sorter: (a: DataType, b: DataType) => a.order_id - b.order_id,
    },
    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'left',
      width: 130,
      sorter: (a: DataType, b: DataType) =>
        new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
    },
    {
      title: 'Nama Customer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 140,
      onFilter: (value: string, record: DataType) => record.costumer_name.includes(value),
      sorter: (a: DataType, b: DataType) => a.costumer_name.localeCompare(b.costumer_name),
    },
    {
      title: 'Status Order',
      dataIndex: 'order_status',
      key: 'order_status',
      align: 'left',
      width: 140,
      onFilter: (value: string, record: DataType) => record.order_status.includes(value),
      sorter: (a: DataType, b: DataType) => a.order_status.localeCompare(b.order_status),
    },
    (userRole === 'Store Staff' || userRole === 'Store CS') && {
      title: 'Nama Sales',
      dataIndex: 'sales_name',
      key: 'sales_name',
      align: 'left',
      width: 140,
      onFilter: (value: string, record: DataType) => record.sales_name.includes(value),
      sorter: (a: DataType, b: DataType) => a.sales_name.length - b.sales_name.length,
    },
    {
      title: 'Grand Total Quotation',
      dataIndex: 'quotation_grand_total',
      key: 'quotation_grand_total',
      align: 'center',
      width: 135,
      sorter: (a: DataType, b: DataType) => a.quotation_grand_total - b.quotation_grand_total,
    },
    {
      title: 'Komisi Sales',
      dataIndex: 'sales_comission',
      key: 'sales_comission',
      align: 'center',
      width: 135,
      sorter: (a: DataType, b: DataType) => a.sales_comission - b.sales_comission,
    },
    {
      title: 'Status Pembayaran',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 135,
      onFilter: (value: string, record: DataType) => record.status.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.status.length - b.status.length,
    },
  ].filter(Boolean) as ColumnsType<DataType>

  const fetchOrderList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/reports/sales-comission?order_by=desc&page=${page}&take=${pageSize}${queryparams}${salesId}${storeId}`
    if (dateFrom && dateTo) {
      apiUrlWithParams += `&date_from=${dateFrom}&date_to=${dateTo}`
    }

    try {
      const response = await axiosInstance.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response?.data) {
        setLoadData(false)
        setTotalInsentive(response?.data?.totalIncentive?._sum?.nominal ?? 0)
        setTotalOrder(response?.data?.total ?? 0)
        setCurrentPage(response?.data?.page ?? 1)
      }

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
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

        const orderDate = new Date(item?.quotation?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })

        const statusIncentive = (status: number) => {
          switch (status) {
            case 1:
              return 'Potensial Insentif'
            case 2:
              return 'Pengajuan Insentif'
            case 3:
              return 'Sudah dibayarkan'
            case 4:
              return 'Ditolak'
            case 5:
              return 'Lost Insentif'
            default:
              return ''
          }
        }

        data = {
          id: item?.id,
          order_id: item?.quotation?.order_id,
          date_order: orderDate,
          costumer_name: item?.quotation?.order?.members?.full_name,
          order_status: item?.quotation?.order?.status?.description,
          sales_name: item?.sales?.full_name,
          incentive_name: item?.incentive?.name,
          incentive_nominal:
            item.type === 1
              ? `${item?.incentive?.incentive ?? 0} %`
              : `Rp. ${parseInt(item?.incentive?.incentive ?? 0).toLocaleString('id')}`,
          status: statusIncentive(item?.status),
          quotation_grand_total: `Rp. ${parseInt(
            item?.quotation?.quotation_grand_total ?? 0
          ).toLocaleString('id')}`,
          sales_comission: `Rp. ${parseInt(item?.nominal ?? 0).toLocaleString('id')}`,
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
    fetchData(1, 10, queryParams)
  }, [queryParams])

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

  // Export To Excel
  const exportToExcel = () => {
    setLoadingExport(true)
    let url = `${apiUrl}/sales/export-excel-template?take=0${storeId}${salesId}`

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
        link.setAttribute('download', `Report Insentif Sales ${userStoreName}.xlsx`)
        document.body.appendChild(link)
        link.click()

        setLoadingExport(false)
      })
  }

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

    valueCheck(`&search=`, searchFilter)

    setQueryParams(queryparams)
    const data = await ViewOrder(1, 10, queryparams)
    setOrderData(data)

    setLoadingButton(false)
  }

  return (
    <section id='report-insentif'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-report'>
          <Row className='table-head-wrapper'>
            <div
              className='d-flex flex-column flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row align-items-start align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center justify-content-start gap-3'
              onKeyDown={handleKeyPress}
            >
              <h3 className='d-flex align-items-center fs-5 fw-normal'>Date</h3>

              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range'
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
                    setDateFrom('')
                    setDateTo('')
                  }
                }}
              />

              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control
                    placeholder='Search'
                    className='filter-ltr'
                    onChange={handleChangeSearchFilter}
                  />
                </InputGroup>
              </div>

              <Button
                className='btn-dark-primary button-submit m-0'
                disabled={loadingButton}
                onClick={handleSubmitFilter}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>

              {!['Sales'].includes(userRole) && (
                <Button
                  variant='success m-0'
                  className='d-flex justify-content-center align-items-center'
                  onClick={exportToExcel}
                  disabled={loadingExport}
                >
                  {loadingExport ? 'Exporting..' : 'Export To Excel'}
                </Button>
              )}
            </div>
          </Row>

          <Row className='total-order'>
            <p className='fs-5'>Total order : {totalOrder}</p>
            <p className='fs-5'>
              Total Insentif : {`Rp. ${parseInt(totalInsentive).toLocaleString('id')}`}
            </p>
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
                pagination={false}
                tableLayout='auto'
                sticky={true}
                scroll={{x: 'max-content'}}
                rowKey={(record) => record.id}
              />
            </div>
          </Spin>

          <div className='pagination-container mt-5'>
            <span className='total-text'>
              Showing {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, totalOrder)} of {totalOrder} Orders
            </span>

            <Pagination
              className='pagination'
              current={currentPage}
              total={totalOrder}
              showSizeChanger
              pageSizeOptions={[5, 10, 20, 50, 100]}
              itemRender={itemRender}
              onShowSizeChange={(current, size) => {
                setPageSize(size)
              }}
              onChange={(page, pageSize) => {
                fetchData(page, pageSize, queryParams)
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export {ReportInsentifStore}
