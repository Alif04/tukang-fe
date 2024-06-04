/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ReportInsentif.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import {Table, PaginationProps, Spin, Pagination} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
}

const ReportInsentifStore: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL

  const userRole = localStorage.getItem('userRole')
  const userStore = localStorage.getItem('storeId')
  const salesId = localStorage.getItem('sales_id') as any

  const [orderData, setOrderData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalOrder, setTotalOrder] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const [loadData, setLoadData] = useState<boolean>(true)
  const [loadingButton, setLoadingButton] = useState(false)

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    order_id: number
    date_order: Date
    sales_name: string
    costumer_name: string
    phone_number: number
    email: string
    address: string
    service_name: string
    quantity: number
    harga: number
    grand_total: number
    sales_comission: number
  }

  const columns: ColumnsType<DataType> = [
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
      title: 'Nama Costumer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 140,
      onFilter: (value: string, record: DataType) => record.costumer_name.includes(value),
      sorter: (a: DataType, b: DataType) => a.costumer_name.localeCompare(b.costumer_name),
    },
    {
      title: 'No Telepon',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'center',
      width: 130,
      sorter: (a: DataType, b: DataType) => a.phone_number - b.phone_number,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'left',
      width: 170,
      onFilter: (value: string, record: DataType) => record.email.includes(value),
      sorter: (a: DataType, b: DataType) => a.email.localeCompare(b.email),
    },
    {
      title: 'Alamat',
      dataIndex: 'address',
      key: 'address',
      align: 'left',
      width: 150,
      onFilter: (value: string, record: DataType) => record.address.includes(value),
      sorter: (a: DataType, b: DataType) => a.address.localeCompare(b.address),
    },
    {
      title: 'Grand Total',
      dataIndex: 'grand_total',
      key: 'grand_total',
      align: 'center',
      width: 135,
      sorter: (a: DataType, b: DataType) => a.grand_total - b.grand_total,
    },
    {
      title: 'Sales Comission',
      dataIndex: 'sales_comission',
      key: 'sales_comission',
      align: 'center',
      width: 135,
      sorter: (a: DataType, b: DataType) => a.sales_comission - b.sales_comission,
    },
  ].filter(Boolean) as ColumnsType<DataType>

  const fetchOrderList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/reports/sales-comission?order_by=desc&page=${page}&take=${pageSize}${queryparams}`

    if (salesId) {
      apiUrlWithParams += `&sales_id=${salesId}`
    } else if (userStore) {
      apiUrlWithParams += `&store_id=${userStore}`
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

      if (response?.data) {
        setLoadData(false)
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
        let totalAmount = 0

        const orderDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        if (item?.payment_type === 'gratis') {
          totalAmount =
            item?.is_overdistance === 1
              ? Number(item?.grand_total) + Number(item?.additional_fee)
              : 0
        } else if (item?.payment_type === 'pemasangan_tanpa_survey') {
          totalAmount =
            item?.is_overdistance === 1
              ? Number(item?.grand_total) + Number(item?.additional_fee)
              : item?.grand_total ?? 0
        } else if (item?.payment_type === 'survey') {
          totalAmount =
            item?.is_overdistance === 1
              ? Number(item?.grand_total) + Number(item?.additional_fee)
              : 99000 ?? 0
        }

        const salesComission = parseInt(item.grand_total_comission)
        const formattedSalesComission = `Rp. ${salesComission.toLocaleString('id')}`

        data = {
          order_id: item.id,
          date_order: orderDate,
          sales_name: item?.sales?.full_name ?? '-',
          costumer_name: item?.members?.full_name ?? '-',
          email: item?.members?.email ?? '-',
          address: item?.project_address ?? '-',
          phone_number: item?.project_number ?? '-',
          grand_total: `Rp. ${Number(totalAmount).toLocaleString('id')}`,
          sales_comission: formattedSalesComission,
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
    fetchData(1, 10, '')
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

  // Export To Excel
  const exportToExcel = () => {
    if (orderData.length === 0) {
      Swal.fire('Warning', 'Belum ada data yang dapat di export', 'warning')
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(orderData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, 'report_intensif_data.xlsx')
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

    const data = await ViewOrder(1, 10, queryparams)
    setOrderData(data)

    setLoadingButton(false)
  }

  return (
    <section id='report-insentif'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-report'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
              <div className='d-flex align-items-center me-3'>
                <h3 className='fs-5 fw-normal'>Date : </h3>
              </div>

              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range ms-3'
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

            <Col xs={12} md={12} lg={12} xl={4} xxl={4}>
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
            </Col>

            <Col xs={12} md={12} lg={12} xl={4} xxl={4}>
              <div className='d-flex justify-content-between'>
                <Button
                  className='btn-dark-primary button-submit'
                  disabled={loadingButton}
                  onClick={handleSubmitFilter}
                >
                  {loadingButton ? 'Filtering..' : 'Submit'}
                </Button>

                <Button
                  variant='outline-primary'
                  className='d-flex justify-content-center align-items-center'
                  onClick={exportToExcel}
                >
                  Download Report
                </Button>
              </div>
            </Col>
          </Row>

          <div className='total-order'>
            <p className='fs-5'>Total order : {totalOrder}</p>
          </div>

          <Spin
            tip='Loading...'
            spinning={loadData}
            size='large'
            indicator={<LoadingOutlined style={{fontSize: 24}} spin rev />}
          >
            <Table
              className='table-striped-rows'
              bordered
              columns={columns}
              dataSource={orderData}
              rowKey={(record) => record.order_id}
              pagination={{
                position: ['bottomRight'],
                current: currentPage,
                total: totalOrder,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50, 100],
                onChange: (page, pageSize) => {
                  fetchData(page, pageSize, '')
                },
                itemRender: itemRender,
                showTotal: (total, range) => (
                  <span style={{left: 0, position: 'absolute'}}>
                    Showing {range[0]} - {range[1]} of {total} Order
                  </span>
                ),
              }}
            />
          </Spin>
        </div>
      </div>
    </section>
  )
}

export {ReportInsentifStore}
