import React, {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './NewInvoice.css'

import axios from 'axios'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'
import type {ColumnsType} from 'antd/es/table'
import {LoadingOutlined} from '@ant-design/icons'
import {Table, Tag, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {Form, FormGroup, Row, Col, Button, Card} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

interface Status {
  value: number | null
  category: string
}

interface DataType {
  _key: number
  order_id: number
  store_name: string
  date_order: string
  member_name: string
  order_type: string
  order_status: string
  order_status_label: string
}

interface InvoiceData {
  vendor_id: number | null
  invoice_evidences: Array<any>
  invoice_details: Array<{
    order_id?: number | null
    type?: number | null
  }>
}

// Table Column
const columns: ColumnsType<DataType> = [
  {
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    width: 110,
    className: 'col_order_id',
    sorter: (a, b) => a.order_id - b.order_id,
  },
  {
    title: 'Tanggal Order',
    dataIndex: 'date_order',
    key: 'date_order',
    align: 'center',
    width: 200,
    onFilter: (value, record) => record.date_order.includes(String(value)),
    sorter: (a, b) => a.date_order.length - b.date_order.length,
  },
  {
    title: 'Nama Konsumen',
    dataIndex: 'member_name',
    key: 'member_name',
    align: 'center',
    width: 180,
    onFilter: (value, record) => record.member_name.includes(String(value)),
    sorter: (a, b) => a.member_name.length - b.member_name.length,
  },
  {
    title: 'Tipe Pengerjaan',
    dataIndex: 'order_type',
    key: 'order_type',
    align: 'left',
    width: 180,
    onFilter: (value, record) => record.order_type.includes(String(value)),
    sorter: (a, b) => a.order_type.length - b.order_type.length,
  },
  {
    title: 'Status Order',
    dataIndex: 'order_status_label',
    key: 'order_status_label',
    align: 'left',
    onFilter: (value, record) => record.order_status_label.includes(String(value)),
    sorter: (a, b) => a.order_status_label.length - b.order_status_label.length,
    render: (order_status_label) => {
      const orderStatus = order_status_label
      return <Tag color='green'>{orderStatus}</Tag>
    },
  },
]

const NewInvoiceVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const vendorId = localStorage.getItem('vendor_id')

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [order, setOrder] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>(
    new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
  )
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  // Status
  const storedStatus = sessionStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
  const workend = statusData.filter((status: any) => ['WORKEND'].includes(status.category))
  const surveyend = statusData.filter((status: any) => ['SURVEYDONE'].includes(status.category))
  const workStatuses = workend.map((x) => x.value)
  const surveyStatuses = surveyend.map((x) => x.value)

  // Create Invoice
  const [selectedRows, setSelectedRows] = useState<DataType[]>([])
  const [invoiceCode, setInvoiceCode] = useState<string | number>('NaN')
  const [invoices, setInvoices] = useState<InvoiceData>({
    vendor_id: Number(vendorId),
    invoice_evidences: [],
    invoice_details: [
      {
        order_id: null,
        type: null,
      },
    ],
  })

  // Fetch Data
  const getCode = async () => {
    try {
      const response = await axios.get(`${apiUrl}/invoices/next-code`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response.status === 200) {
        const {data} = response
        setInvoiceCode(data.data.code)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getAllData = async (url: string, headers: any) => {
    let allData: any[] = []
    let page = 1
    const pageSize = 50

    while (true) {
      const response = await axios.get(`${url}&page=${page}&take=${pageSize}`, {headers})
      const data = response.data.data || []
      allData = [...allData, ...data]

      if (data.length < pageSize) break
      page += 1
    }

    return allData
  }

  const getOrders = async (queryparams: any) => {
    const urlWork = `${apiUrl}/orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&vendor_id=${vendorId}&status=${workStatuses}${queryparams}`
    const urlSurvey = `${apiUrl}/orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&vendor_id=${vendorId}&history_status=${surveyStatuses}${queryparams}`

    try {
      const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': 'true',
      }

      const [workOrders, surveyOrders] = await Promise.all([
        getAllData(urlWork, headers),
        getAllData(urlSurvey, headers),
      ])

      setLoadData(false)

      return {workOrders, surveyOrders}
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  }

  const ViewWorkOrder = async (queryparams: any) => {
    try {
      const {workOrders, surveyOrders} = await getOrders(queryparams)

      if (!workOrders && !surveyOrders) {
        console.error('No data received from getOrders')
        return []
      }

      const workOrderData = workOrders
        .filter(
          (x) =>
            x.invoice_details.length === 0 ||
            x.invoice_details.find((x: any) => x.type === 2)?.length === 0
        )
        .map((item: any, index: number) => {
          const orderDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })

          return {
            _key: index + 1,
            order_id: item?.id,
            store_name: item?.store?.store_name,
            date_order: orderDate,
            member_name: item?.members?.full_name,
            order_type: 'Pengerjaan',
            order_status: item?.work_orders?.work_order_status[0]?.status?.category,
            order_status_label: item?.work_orders?.work_order_status[0]?.status?.description,
          }
        })

      const surveyOrderData = surveyOrders
        .filter(
          (x) =>
            x.invoice_details.length === 0 ||
            x.invoice_details.find((x: any) => x.type === 1)?.length === 0
        )
        .map((item: any, index: number) => {
          const orderDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })

          const surveyDoneHistory = item?.order_history?.find(
            (x: any) => x.status.category === 'SURVEYDONE'
          )

          return {
            _key: index + workOrders.length + 1,
            order_id: item?.id,
            store_name: item?.store?.store_name,
            date_order: orderDate,
            member_name: item?.members?.full_name,
            order_type: 'Survei',
            order_status: surveyDoneHistory ? surveyDoneHistory.status.category : null,
            order_status_label: surveyDoneHistory ? surveyDoneHistory.status.description : null,
          }
        })

      const data = [...workOrderData, ...surveyOrderData]
      return data
    } catch (error) {
      console.error('Error getting work order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewWorkOrder(queryparams)
    const paginatedData = data.slice((page - 1) * pageSize, page * pageSize)
    setOrder(paginatedData)
    setCurrentPage(page)
    setTotalData(data.length)
  }

  useEffect(() => {
    getCode()
    fetchData(1, 10, '')
  }, [])

  // Selected Row
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      const updatedSelectedRowKeys = selectedRows.map((row) => row.order_id)
      const invoiceType = selectedRows.map((row) => ({
        order_id: row.order_id,
        type: row.order_status === 'SURVEYDONE' ? 1 : row.order_status === 'WORKEND' ? 2 : 0,
      }))

      setSelectedRows(selectedRows)
      setInvoices((prevInvoices) => ({
        ...prevInvoices,
        invoice_details: invoiceType,
      }))

      console.log(`selectedRowKeys: ${updatedSelectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
  }

  // Invoice Validation
  const InvoiceValidation = () => {
    let valid = true

    if (!invoices.invoice_details.some((item: any) => item.order_id !== null)) {
      Swal.fire({
        title: 'Warning',
        text: 'Pilih Order yang ingin diberi Invoice ',
        icon: 'warning',
      })
      valid = false
    }

    return valid
  }

  console.log('invoices', invoices)

  // Handle Submit
  const handleCreateInvoice = async () => {
    if (!InvoiceValidation()) {
      setIsLoading(false)
      return false
    }

    setIsLoading(true)
    const formData = new FormData()

    formData.append('vendor_id', String(invoices.vendor_id))
    formData.append('status', String(1))
    invoices.invoice_details.forEach((invoice, index) => {
      if (invoice.order_id !== null) {
        formData.append(`invoice_details[${index}][order_id]`, String(invoice.order_id))
        formData.append(`invoice_details[${index}][type]`, String(invoice.type))
      }
    })

    try {
      const response = await axios.post(`${apiUrl}/invoices`, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response.data.status === 201) {
        Swal.fire({
          title: 'Success',
          text: 'Success Add Invoice',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate(`/invoice/view-invoice`)
        })

        setIsLoading(false)
      } else {
        Swal.fire({
          title: 'Error',
          text: response.data.message,
          icon: 'error',
        })

        setIsLoading(false)
      }
    } catch (error: any) {
      console.error(error)
      setIsLoading(false)

      Swal.fire({
        title: 'Error',
        text: error.response.data.message,
        icon: 'error',
      })
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

  // Handle Submit Filter
  const handleSubmitFilter = async () => {
    setLoadingButton(true)
    let queryparams = ``

    const valueCheck = (key: string, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        queryparams += `${key}${value}`
      }
    }

    valueCheck(`&search=`, searchFilter)

    const page = 1
    const pageSize = 10
    await fetchData(page, pageSize, queryparams)

    setLoadingButton(false)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubmitFilter()
    }
  }

  return (
    <section id='new-invoice'>
      <Card>
        <Card.Body>
          <Row className='table-head-wrapper'>
            <div
              className='d-flex flex-column flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row align-items-start align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center justify-content-start gap-3'
              onKeyDown={handleKeyPress}
            >
              <h3 className='d-flex align-items-center fs-5 fw-normal'>Date</h3>

              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range'
                defaultValue={[dayjs().subtract(7, 'day'), dayjs()]}
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

              <Button
                className='btn-dark-primary button-submit m-0'
                disabled={loadingButton}
                onClick={handleSubmitFilter}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>
            </div>
          </Row>

          <Row>
            <Form.Text className='text-danger fs-7'>
              * Pilih order yang ingin dijadikan invoice, lalu klik tombol "Create Invoice Draft"
              untuk mengirim ke Admin HO
            </Form.Text>
          </Row>

          <Row>
            <Form.Text className='text-danger fs-7'>
              {
                '* Untuk melihat daftar invoice yang sudah dikirim, buka menu Invoice > List Invoice'
              }
            </Form.Text>
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
                dataSource={order}
                rowSelection={{
                  preserveSelectedRowKeys: true,
                  ...rowSelection,
                }}
                rowKey={(record) => record._key}
                pagination={false}
                sticky={true}
                tableLayout='auto'
                scroll={{x: 1000}}
              />
            </div>
          </Spin>

          <div className='pagination-container mt-5'>
            <span className='total-text'>
              Showing {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, totalData)} of {totalData} Invoice Pending
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

          <div className='d-flex justify-content-center align-items-center mt-5'>
            <Button
              className='d-flex justify-content-center align-items-center m-0'
              variant='dark-success'
              type='submit'
              disabled={isLoading}
              onClick={() => handleCreateInvoice()}
            >
              {isLoading ? 'Creating..' : 'Create Invoice Draft'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {NewInvoiceVendor}
