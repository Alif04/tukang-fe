import React, {FC, useState, useEffect, useRef} from 'react'

import './NewInvoice.css'

import axios from 'axios'
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
  store_name: string
  date_order: string
  member_id: number
  member_name: string
  phone_number: number
  service_name: string
  payment_status: string
  order_status: string
}

interface InvoiceData {
  vendor_id: number | null
  invoice_evidences: Array<any>
  invoice_details: Array<{
    quotation_id?: number | null
  }>
}

const NewInvoiceVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  // Table
  const [workOrder, setWorkOrder] = useState<DataType[]>([])
  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  // Filter Table
  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  // Create Invoice
  const [invoiceCode, setInvoiceCode] = useState<string | number>('NaN')
  const [invoices, setInvoices] = useState<InvoiceData>({
    vendor_id: null,
    invoice_evidences: [],
    invoice_details: [
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
      title: 'Nama Jasa Pemasangan',
      dataIndex: 'service_name',
      key: 'service_name',
      align: 'left',
      width: 160,
      onFilter: (value, record) => record.service_name.includes(String(value)),
      sorter: (a, b) => a.service_name.length - b.service_name.length,
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
      filters: [{text: 'DONE', value: 'DONE'}],
    },
  ]

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const getWorkOrder = async () => {
    try {
      const storedStatus = sessionStorage.getItem('statusData')
      const statusData = storedStatus ? JSON.parse(storedStatus) : []

      const desiredStatusName = 'WORKEND'
      const desiredStatus = statusData.find((status: any) => status.category === desiredStatusName)

      if (desiredStatus) {
        const statusId = desiredStatus.value

        const response = await axios.get(
          `${apiUrl}/work-orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&take=0&status=${statusId}`,
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
      } else {
        console.error('Desired status not found in statusData')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewWorkOrder = async () => {
    try {
      const apiData = await getWorkOrder()

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const orderData = apiData.map((item: any) => {
        let data

        const paymentStatus = item?.order?.receipt_number === null ? 'UNPAID' : 'PAID'
        const workOrderItems = item?.work_order_status[0]?.work_order_items
          .map((service: any) => service.name ?? '-')
          .join(', ')

        data = {
          order_id: item?.order_id,
          store_name: item?.order?.store?.store_name,
          date_order: formatDate(new Date(item?.order?.request_survey)),
          member_id: item?.order?.members?.member_number,
          member_name: item?.order?.members?.full_name,
          phone_number: item?.order?.project_number,
          service_name: workOrderItems,
          payment_status: paymentStatus,
          order_status: item?.work_order_status[0]?.status?.category,
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
      const data = await ViewWorkOrder()
      setWorkOrder(data)
    }

    fetchData()
  }, [dateFrom, dateTo, searchFilter])

  // Selected Row
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
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
                  // onClick={() => handleCreateInvoice()}
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
            dataSource={workOrder}
            rowSelection={rowSelection}
            rowKey={(record) => record.order_id}
            pagination={{position: ['bottomRight']}}
            // scroll={{x: 1500}}
          />

          <div className='d-flex justify-content-center align-items-center'>
            <Button
              className='d-flex justify-content-center align-items-center'
              variant='dark-success'
              type='submit'
              // onClick={() => handleCreateInvoice()}
            >
              Create Invoice
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewInvoiceVendor}
