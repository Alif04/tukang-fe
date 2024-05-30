import React, {FC, useState, useEffect, useRef} from 'react'

import './NewInvoice.css'

import axios from 'axios'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'
import {Table, Tag} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate} from 'react-router-dom'
import {Form, InputGroup, Row, Col, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faTrash, faSearch, faPlus, faFilter} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

interface DataType {
  order_id: number
  quotation_id: number
  store_name: string
  date_order: string
  member_id: number
  member_name: string
  phone_number: number
  payment_status: string
  order_status: string
}

interface InvoiceData {
  vendor_id: number | null
  invoice_evidences: Array<any>
  invoice_details: Array<{
    order_id?: number | null
    quotation_id?: number | null
  }>
}

const NewInvoiceVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // User Vendor
  const vendorId = localStorage.getItem('vendor_id')

  // Table
  const [order, setOrder] = useState<DataType[]>([])
  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  // Filter Table
  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

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

  // Invoice File
  const [invoiceFiles, setInvoiceFiles] = useState<Array<File | null>>([])
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)
  const evidenceRef = useRef<HTMLInputElement>(null)

  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)

  // Upload Invoice Files
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const {length} = fileList

      for (let i = 0; i < length; i++) {
        file[i] = fileList.item(i)
      }

      setInvoiceFiles(file)
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = (index: number) => {
    const newEvidances = [...invoiceFiles]
    newEvidances.splice(index, 1)
    setInvoiceFiles(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  const handleFileClick = (index: number) => {
    setPreviewImage(invoiceFiles[index]?.name)
    setVisible(true)
    setSelectedFileIndex(index)
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
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Quotation ID',
      dataIndex: 'quotation_id',
      key: 'quotation_id',
      align: 'center',
      width: 110,
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.quotation_id - b.quotation_id,
    },
    {
      title: 'Nama Store',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      width: 150,
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
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
      title: 'Member ID',
      dataIndex: 'member_id',
      key: 'member_id',
      align: 'left',
      width: 140,
      sorter: (a, b) => a.member_id - b.member_id,
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
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'left',
      width: 160,
      sorter: (a, b) => a.phone_number - b.phone_number,
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
      filters: [
        {text: 'WORKEND', value: 'WORKEND'},
        {text: 'INVOICED', value: 'INVOICED'},
      ],
      render: (order_status) => {
        const orderStatus = order_status
        let color = ''

        switch (orderStatus) {
          case 'WORKEND':
            color = 'green'
            break
          case 'INVOICED':
          default:
            color = 'blue'
            break
        }

        return <Tag color={color}>{orderStatus}</Tag>
      },
    },
  ]

  const getOrder = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/orders?order_by=desc&vendor_id=${vendorId}&take=0`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )
      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewOrder = async () => {
    try {
      const apiData = await getOrder()

      if (!apiData) {
        console.error('No data received from getOrder')
        return []
      }

      const filteredOrders = apiData.filter((item: any) => {
        return (
          item?.work_orders?.work_order_status[0]?.status?.category === 'WORKEND' &&
          !item?.invoice_orders.length
        )
      })

      const orderData = filteredOrders.map((item: any) => {
        let data

        const paymentStatus = (() => {
          if (item?.payment_type === 'survey') {
            return item.receipt_number === null ? 'UNPAID' : 'PAID'
          } else if (item?.payment_type === 'gratis') {
            return 'FREE'
          } else if (item?.payment_type === 'pemasangan_tanpa_survey') {
            return item.receipt_number === null ? 'UNPAID' : 'PAID'
          } else {
            return ''
          }
        })()

        const orderDate = new Date(item?.request_survey).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        const workOrderItems = item?.work_orders?.work_order_status[0]?.work_order_items
          .map((service: any) => service.name ?? '-')
          .join(', ')

        data = {
          order_id: item?.id,
          quotation_id: item?.quotation[0]?.id ?? null,
          store_name: item?.store?.store_name,
          date_order: orderDate,
          member_id: item?.members?.member_number,
          member_name: item?.members?.full_name,
          phone_number: item?.project_number,
          service_name: workOrderItems,
          payment_status: paymentStatus,
          order_status: item?.work_orders?.work_order_status[0]?.status?.category,
        }

        return data
      })

      return orderData
    } catch (error) {
      console.error('Error getting work order list data:', error)
      return []
    }
  }

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

  useEffect(() => {
    getCode()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const data = await ViewOrder()
      setOrder(data)
    }

    fetchData()
  }, [])

  // Selected Row
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      const updatedSelectedRowKeys = selectedRows.map((row) =>
        row.quotation_id !== null ? row.quotation_id : row.order_id
      )
      setSelectedRows(selectedRows)

      setInvoices((prevInvoices) => ({
        ...prevInvoices,
        invoice_details: selectedRows.map((row) => ({
          quotation_id: row.quotation_id !== null ? row.quotation_id : null,
          order_id: row.quotation_id === null ? row.order_id : null,
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
      return false
    }

    setIsLoading(true)
    const formData = new FormData()

    formData.append('vendor_id', String(invoices.vendor_id))
    invoices.invoice_details.forEach((invoice, index) => {
      if (invoice.order_id !== null) {
        if (invoice.quotation_id !== null) {
          formData.append(`invoice_details[${index}][quotation_id]`, String(invoice.quotation_id))
        } else {
          formData.append(`invoice_orders[${index}][order_id]`, String(invoice.order_id))
        }
      }
    })

    await axios
      .post(`${apiUrl}/invoices`, formData, {
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
      })
      .catch((error) => {
        setIsLoading(false)

        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
        })
      })
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
      <div className='card'>
        <div className='card-body'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
              <div className='d-flex align-items-center me-3'>
                <h3 className='fs-3 fw-normal'>Invoice ID : </h3>
              </div>

              <Form.Control type='number' className='w-50' readOnly value={invoiceCode} />

              {/* <RangePicker
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
              /> */}
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              {/* <div className='filter-search'>
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
              </div> */}
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <div className='d-flex justify-content-end align-items-end'>
                <Button
                  className='d-flex justify-content-center align-items-center'
                  variant='outline-success'
                  type='submit'
                  onClick={exportToExcel}
                >
                  Download
                </Button>
              </div>
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={order}
            rowSelection={rowSelection}
            rowKey={(record) => record.order_id}
            pagination={{position: ['bottomRight']}}
            // scroll={{x: 1500}}
          />

          <div className='d-flex justify-content-center align-items-center mt-3'>
            <Button
              className='d-flex justify-content-center align-items-center'
              variant='dark-success'
              type='submit'
              disabled={isLoading}
              onClick={() => handleCreateInvoice()}
            >
              {isLoading ? 'Submitting..' : 'Create Invoice'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewInvoiceVendor}
