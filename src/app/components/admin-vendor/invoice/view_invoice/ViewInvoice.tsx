/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, FC} from 'react'

import './ViewInvoice.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Table, Tag, PaginationProps} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate} from 'react-router-dom'
import {Form, InputGroup, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faTrash, faSearch, faPlus, faFilter} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

interface DataType {
  invoice_id: number
  order_id: number
  date_order: string
  quotation_id: number
  member_id: number
  vendor_name: string
  order_status: string
}

const ViewInvoiceVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [invoiceData, setInvoiceData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Invoice ID',
      dataIndex: 'invoice_id',
      key: 'invoice_id',
      align: 'center',
      width: 100,
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.invoice_id - b.invoice_id,
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 100,
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Date Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.date_order.includes(String(value)),
      sorter: (a, b) => a.date_order.length - b.date_order.length,
    },
    {
      title: 'Quotation ID',
      dataIndex: 'quotation_id',
      key: 'quotation_id',
      align: 'center',
      width: 110,
      sorter: (a, b) => a.quotation_id - b.quotation_id,
    },
    {
      title: 'Member ID',
      dataIndex: 'member_id',
      key: 'member_id',
      align: 'center',
      width: 140,
      sorter: (a, b) => a.member_id - b.member_id,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendor_name',
      key: 'vendor_name',
      align: 'center',
      width: 140,
      onFilter: (value, record) => record.vendor_name.includes(String(value)),
      sorter: (a, b) => a.vendor_name.length - b.vendor_name.length,
    },
    {
      title: 'Order Status',
      dataIndex: 'order_status',
      key: 'order_status',
      align: 'center',
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
      filters: [
        {text: 'WORKEND', value: 'WORKEND'},
        {text: 'INVOICED', value: 'INVOICED'},
      ],
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 70,
      align: 'center',
      render: (record) => {
        const handleUpdateInvoice = () => {
          const id = record.invoice_id
          navigate(`/invoice/update-invoice/${id}`)
        }

        const handleDetailInvoice = () => {
          const id = record.invoice_id
          navigate(`/invoice/detail-invoice/${id}`)
        }

        const handleDelete = () => {
          const id = record.invoice_id

          Swal.fire({
            title: `Apakah anda yakin akan menghapus data Invoice ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Cancel',
          })
            .then((willDelete) => {
              if (willDelete.value) {
                axios
                  .delete(`${apiUrl}/invoices/${id}`, {
                    headers: {
                      Accept: 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                      'Access-Control-Allow-Origin': '*',
                      'ngrok-skip-browser-warning': 'true',
                    },
                  })
                  .then((response) => {
                    Swal.fire({
                      title: 'Success',
                      text: response.data.message,
                      icon: 'success',
                    }).then(() => {
                      window.location.reload()
                    })
                  })
                  .catch((error) => {
                    Swal.fire({
                      title: 'Error',
                      text: error.response.data.message,
                      icon: 'error',
                    })
                  })
              }
            })
            .catch((error) => {
              Swal.fire({
                title: 'Error',
                text: error.response.data.message,
                icon: 'error',
              })
            })
        }

        return (
          <div className='button-wrapper d-flex justify-content-center'>
            <a className='button-detail ' onClick={handleDetailInvoice}>
              <FontAwesomeIcon icon={faBook} size='sm' />
            </a>

            {/* 
            <a className='button-edit' onClick={handleUpdateInvoice}>
              <FontAwesomeIcon icon={faPen} size='sm' />
            </a> */}

            {/* <a className='button-delete' onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} size='sm' />
            </a> */}
          </div>
        )
      },
    },
  ]

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchInvoiceList = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get(
        `${apiUrl}/invoices?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&page=${page}&take=${pageSize}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      setCurrentPage(response.data.page)
      setTotalData(response?.data?.total ?? 0)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewInvoice = async (page: number, pageSize: number) => {
    try {
      const apiData = await fetchInvoiceList(page, pageSize)

      if (!apiData) {
        console.error('No data received from fetchInvoiceList')
        return []
      }

      const invoiceData = apiData.map((item: any) => {
        let data

        data = {
          invoice_id: item?.invoice_details.length ? item.invoice_details[0].invoice_id : item.id,

          order_id: item?.invoice_details.length
            ? item.invoice_details[0]?.quotation?.order_id
            : item.invoice_orders[0]?.orders?.id,

          date_order: formatDate(
            new Date(
              item?.invoice_details.length
                ? item?.invoice_details[0]?.quotation?.order?.request_survey
                : item?.invoice_orders[0]?.orders?.request_survey
            )
          ),

          quotation_id: item?.invoice_details[0]?.quotation_id ?? '-',

          member_id: item?.invoice_details.length
            ? item?.invoice_details[0]?.quotation?.order?.members?.member_number
            : item?.invoice_orders[0]?.orders?.members?.member_number,

          vendor_name: item?.vendor?.company_name,
          order_status: item?.status?.category,
        }

        return data
      })

      return invoiceData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewInvoice(page, pageSize)
    setInvoiceData(data)
  }

  useEffect(() => {
    fetchData(1, 10)
  }, [dateFrom, dateTo, searchFilter])

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

  return (
    <section id='view-invoice'>
      <div className='card'>
        <div className='card-body table-view-order'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
              <div className='d-flex align-items-center me-3'>
                <h3 className='fs-3 fw-normal'>Date : </h3>
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

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={invoiceData}
            rowKey={(record) => record.invoice_id}
            pagination={{
              position: ['bottomRight'],
              current: currentPage,
              total: totalData,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50, 100],
              onChange: (page, pageSize) => {
                fetchData(page, pageSize)
              },
              itemRender: itemRender,
              showTotal: (total, range) => (
                <span style={{left: 0, position: 'absolute'}}>
                  Showing {range[0]} - {range[1]} of {total} Invoice
                </span>
              ),
            }}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewInvoiceVendor}
