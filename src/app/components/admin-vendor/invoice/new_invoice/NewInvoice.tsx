import React, {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './NewInvoice.css'

import axios from 'axios'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'
import type {ColumnsType} from 'antd/es/table'
import {LoadingOutlined} from '@ant-design/icons'
import {Table, Tag, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {Form, InputGroup, Row, Col, Button, Card} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

interface Status {
  value: number | null
  category: string
}

interface DataType {
  order_id: number
  // quotation_id: number
  // quotation_id_label: string
  store_name: string
  date_order: string
  member_name: string
  payment_status: string
  order_status: string
  order_status_label: string
}

interface InvoiceData {
  vendor_id: number | null
  invoice_evidences: Array<any>
  invoice_details: Array<{
    order_id?: number | null
    quotation_id?: number | null
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
  // {
  //   title: 'Quotation ID',
  //   dataIndex: 'quotation_id_label',
  //   key: 'quotation_id_label',
  //   align: 'center',
  //   width: 110,
  //   className: 'col_order_id',
  //   onFilter: (value, record) => record.quotation_id_label.includes(String(value)),
  //   sorter: (a, b) => a.quotation_id_label.length - b.quotation_id_label.length,
  // },
  {
    title: 'Date Order',
    dataIndex: 'date_order',
    key: 'date_order',
    align: 'center',
    width: 130,
    onFilter: (value, record) => record.date_order.includes(String(value)),
    sorter: (a, b) => a.date_order.length - b.date_order.length,
  },
  {
    title: 'Member Name',
    dataIndex: 'member_name',
    key: 'member_name',
    align: 'center',
    width: 150,
    onFilter: (value, record) => record.member_name.includes(String(value)),
    sorter: (a, b) => a.member_name.length - b.member_name.length,
  },
  {
    title: 'Payment Status',
    dataIndex: 'payment_status',
    key: 'payment_status',
    align: 'left',
    width: 140,
    onFilter: (value, record) => record.payment_status.includes(String(value)),
    sorter: (a, b) => a.payment_status.length - b.payment_status.length,
  },
  {
    title: 'Order Status',
    dataIndex: 'order_status',
    key: 'order_status',
    align: 'left',
    width: 140,
    onFilter: (value, record) => record.order_status.includes(String(value)),
    sorter: (a, b) => a.order_status.length - b.order_status.length,
    render: (order_status) => {
      const orderStatus = order_status
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
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  // Status
  const storedStatus = sessionStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
  const desiredStatus = statusData.filter((status: any) => ['WORKEND'].includes(status.category))

  // Create Invoice
  const [selectedRows, setSelectedRows] = useState<DataType[]>([])
  const [invoiceCode, setInvoiceCode] = useState<string | number>('NaN')
  const [invoices, setInvoices] = useState<InvoiceData>({
    vendor_id: Number(vendorId),
    invoice_evidences: [],
    invoice_details: [
      {
        order_id: null,
      },
      {
        quotation_id: null,
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

  const getOrders = async (page: number, pageSize: number, queryparams: any) => {
    if (desiredStatus) {
      const statuses = desiredStatus.map((x) => x.value)
      let apiUrlWithParams = `${apiUrl}/orders?order_by=desc&vendor_id=${vendorId}&page=${page}&work_order_status=${statuses}&take=${pageSize}${queryparams}`

      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data
      const filteredData = data.filter(
        (x: any) => x.payment_type !== 'gratis' && x.invoice_details.length === 0
      )

      setCurrentPage(response.data.page)
      setTotalData(filteredData.length)
      setLoadData(false)

      return filteredData
    } else {
      console.error('Desired status not found in statusData')
    }
  }

  const ViewWorkOrder = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await getOrders(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from getOrders')
        return []
      }

      const workOrderData = apiData.map((item: any) => {
        let data

        const orderDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        const paymentStatus = (() => {
          if (item?.payment_type === 'survey') {
            return item?.receipt_number === null ? 'UNPAID' : 'PAID'
          } else if (item?.payment_type === 'gratis') {
            return 'FREE'
          } else if (item?.payment_type === 'pemasangan_tanpa_survey') {
            return item?.receipt_number === null ? 'UNPAID' : 'PAID'
          } else {
            return ''
          }
        })()

        const orderStatus = (() => {
          if (item?.work_order_status?.length >= 0) {
            if (['QUOTEIN', 'QUOTEOUT'].includes(item?.status?.category)) {
              return item?.status?.description
            } else if (
              ['WORKREQ'].includes(item?.status?.category) &&
              item?.payment_type === 'survey' &&
              !['WORKSTART', 'WORKEND'].includes(item?.work_order_status[0]?.status?.description)
            ) {
              return item?.status?.description
            } else {
              return item?.work_order_status[0]?.status?.description
            }
          } else {
            return item?.status?.description
          }
        })()

        data = {
          order_id: item?.id,
          quotation_id: item?.quotation[0]?.id ?? null,
          quotation_id_label: item?.quotation[0]?.id ?? 'Tidak Rilis Quotation',
          store_name: item?.store?.store_name,
          date_order: orderDate,
          member_name: item?.members?.full_name,
          payment_status: paymentStatus,
          order_status: item?.work_orders?.work_order_status[0]?.status?.description,
        }

        return data
      })

      return workOrderData
    } catch (error) {
      console.error('Error getting work order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewWorkOrder(page, pageSize, queryparams)
    setOrder(data)
  }

  useEffect(() => {
    getCode()
    fetchData(1, 10, '')
  }, [])

  // Selected Row
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      const updatedSelectedRowKeys = selectedRows.map((row) => row.order_id)

      setSelectedRows(selectedRows)
      setInvoices((prevInvoices) => ({
        ...prevInvoices,
        invoice_details: selectedRows.map((row) => ({
          order_id: row.order_id,
        })),
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

    // let textConfirmation = ''
    // switch (status) {
    //   case 1:
    //     formData.append('status', String(1))
    //     textConfirmation = 'Apakah Anda yakin membuat invoice ini ?'
    //     break

    //   case 2:
    //     formData.append('status', String(2))
    //     textConfirmation = 'Apakah Anda yakin invoice ini dibuat menjadi Draft ?'
    //     break
    //   default:
    //     break
    // }

    // Swal.fire({
    //   title: textConfirmation,
    //   icon: 'question',
    //   showConfirmButton: true,
    //   confirmButtonColor: '#6b9230',
    //   showDenyButton: true,
    //   confirmButtonText: 'Ya',
    //   denyButtonText: 'Tidak',
    // }).then(async (result) => {
    //   if (result.isConfirmed) {
    //     try {
    //       const response = await axios.post(`${apiUrl}/invoices`, formData, {
    //         headers: {
    //           Accept: 'application/json',
    //           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    //           'Access-Control-Allow-Origin': '*',
    //           'ngrok-skip-browser-warning': 'true',
    //         },
    //       })

    //       if (response.data.status === 201) {
    //         Swal.fire({
    //           title: 'Success',
    //           text: 'Success Add Invoice',
    //           icon: 'success',
    //           showConfirmButton: false,
    //           timer: 1500,
    //         }).then(() => {
    //           navigate(`/invoice/view-invoice`)
    //         })

    //         setIsLoading(false)
    //       } else {
    //         Swal.fire({
    //           title: 'Error',
    //           text: response.data.message,
    //           icon: 'error',
    //         })

    //         setIsLoading(false)
    //       }
    //     } catch (error: any) {
    //       console.error(error)
    //       setIsLoading(false)

    //       Swal.fire({
    //         title: 'Error',
    //         text: error.response.data.message,
    //         icon: 'error',
    //       })
    //     }
    //   }
    // })
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

    const valueCheck = (key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        queryparams += `${key}${value}`
      }
    }

    valueCheck(`&date_from=`, dateFrom)
    valueCheck(`&date_to=`, dateTo)
    valueCheck(`&search=`, searchFilter)

    const data = await ViewWorkOrder(1, 10, queryparams)
    setOrder(data)

    setLoadingButton(false)
  }

  // Export To Excel
  const exportToExcel = () => {
    if (selectedRows.length === 0) {
      Swal.fire('Warning', 'Please select at least one row to export', 'warning')
      return
    }

    const headers = Object.keys(selectedRows[0]) as (keyof DataType)[]
    const data = selectedRows.map((row) => headers.map((header) => row[header]))

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1')

    XLSX.writeFile(workbook, 'exported_data.xlsx')
  }

  return (
    <section id='new-invoice'>
      <Card>
        <Card.Body>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
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

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
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

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <Button
                className='btn-dark-primary button-submit'
                disabled={loadingButton}
                onClick={handleSubmitFilter}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>

              {/* <Form.Group as={Row}>
                <Form.Label className='fs-5' column sm='4'>
                  Invoice ID :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control type='number' readOnly value={invoiceCode} />
                </Col>
              </Form.Group> */}

              {/* <div className='d-flex justify-content-end align-items-end'>
                <Button
                  className='d-flex justify-content-center align-items-center'
                  variant='outline-success'
                  type='submit'
                  onClick={exportToExcel}
                >
                  Download
                </Button>
              </div> */}
            </Col>
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
            indicator={<LoadingOutlined style={{fontSize: 24}} spin rev />}
          >
            <Table
              className='table-striped-rows'
              bordered
              columns={columns}
              dataSource={order}
              rowSelection={{
                preserveSelectedRowKeys: true,
                ...rowSelection,
              }}
              rowKey={(record) => record.order_id}
              pagination={false}
            />
          </Spin>

          <Pagination
            className='mt-5'
            style={{textAlign: 'right', position: 'relative'}}
            current={currentPage}
            total={totalData}
            showSizeChanger
            pageSizeOptions={[5, 10, 20, 50, 100]}
            itemRender={itemRender}
            onChange={(page, pageSize) => {
              fetchData(page, pageSize, '')
            }}
            showTotal={(total, range) => (
              <span style={{left: 0, position: 'absolute'}}>
                Showing {range[0]} - {range[1]} of {total} Invoice Pending
              </span>
            )}
          />

          <div className='d-flex justify-content-center align-items-center gap-3'>
            <Button
              className='d-flex justify-content-center align-items-center'
              variant='dark-success'
              type='submit'
              disabled={isLoading}
              onClick={() => handleCreateInvoice()}
            >
              {isLoading ? 'Creating..' : 'Create Invoice Draft'}
            </Button>

            {/* <Button
              className='d-flex justify-content-center align-items-center'
              variant='dark-success'
              type='submit'
              onClick={() => handleCreateInvoice(1)}
            >
              Create Invoice
            </Button> */}
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {NewInvoiceVendor}
