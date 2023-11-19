/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, FC} from 'react'

import './ViewInvoice.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select from 'react-select'
import {Table, Tag} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate} from 'react-router-dom'
import {Form, InputGroup, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faPen,
  faTrash,
  faFileExcel,
  faSearch,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'

interface Status {
  value: any
  category: string
  label: string
}

const ViewInvoiceVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [status, setStatus] = useState<Status[]>([])
  const [searchByOrderStatus, setSearchByOrderStatus] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  // Handle Change Start Date
  const handleChangeJoinDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchJoinDate = event.target.value
    setDateFrom(updatedSearchJoinDate)
  }

  // Handle Change End Date
  const handleChangeEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchEndDate = event.target.value
    setDateTo(updatedSearchEndDate)
  }

  // Handle Change Search Filter
  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  // Handle Change Filter By Tukang Service
  const handleChangeSelectTukangService = (element: any) => {
    const {value: updatedStoreId} = element
    setSearchByOrderStatus(updatedStoreId)
  }

  // Filter Work Order Status
  useEffect(() => {
    const orderStatusOption = () => {
      const storedStatus = sessionStorage.getItem('statusData')
      const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
      const desiredStatus = statusData.filter((status: Status) =>
        ['WORKEND', 'INVOICED'].includes(status.category)
      )

      const selectedStatus = desiredStatus.map((status: Status) => ({
        value: status.value,
        category: status.category,
        label: status.category,
      }))

      setStatus(selectedStatus)
    }

    orderStatusOption()
  }, [])

  interface DataType {
    order_id: number
    invoice_id: number
    date_order: string
    // product_name: string
    // installation_type: string
    quotation_id: number
    payment_status: string
    member_id: number
    vendor_name: string
    order_status: string
  }

  const columns: ColumnsType<DataType> = [
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
    // {
    //   title: 'Product Name',
    //   dataIndex: 'product_name',
    //   key: 'product_name',
    //   align: 'center',
    //   width: 110,
    //   onFilter: (value, record) => record.product_name.includes(String(value)),
    //   sorter: (a, b) => a.product_name.length - b.product_name.length,
    // },
    // {
    //   title: 'Installation Type',
    //   dataIndex: 'installation_type',
    //   key: 'installation_type',
    //   align: 'center',
    //   width: 110,
    //   onFilter: (value, record) => record.installation_type.includes(String(value)),
    //   sorter: (a, b) => a.installation_type.length - b.installation_type.length,
    // },
    {
      title: 'Quotation ID',
      dataIndex: 'quotation_id',
      key: 'quotation_id',
      align: 'left',
      width: 110,
      sorter: (a, b) => a.quotation_id - b.quotation_id,
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
      title: 'Costumer ID',
      dataIndex: 'member_id',
      key: 'member_id',
      align: 'left',
      width: 140,
      sorter: (a, b) => a.member_id - b.member_id,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendor_name',
      key: 'vendor_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.vendor_name.includes(String(value)),
      sorter: (a, b) => a.vendor_name.length - b.vendor_name.length,
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
      filters: [
        {text: 'WORKEND', value: 'WORKEND'},
        {text: 'INVOICED', value: 'INVOICED'},
      ],
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (record) => {
        const handleAddInvoice = () => {
          navigate('/invoice/new-invoice')
        }

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
          <div className='button-wrapper'>
            <a className='button-add' onClick={handleAddInvoice}>
              <FontAwesomeIcon icon={faPlus} size='sm' />
            </a>

            <a className='button-edit' onClick={handleUpdateInvoice}>
              <FontAwesomeIcon icon={faPen} size='sm' />
            </a>

            <a className='button-detail' onClick={handleDetailInvoice}>
              <FontAwesomeIcon icon={faBook} size='sm' />
            </a>

            <a className='button-delete' onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} size='sm' />
            </a>
          </div>
        )
      },
    },
  ]

  const [invoiceData, setInvoiceData] = useState<DataType[]>([])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchInvoiceList = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL

      const response = await axios.get(
        `${apiUrl}/invoices?date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}&status=${searchByOrderStatus}&take=0`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      return response.data.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewInvoice = async () => {
    try {
      const apiData = await fetchInvoiceList()

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const invoiceData = apiData.map((item: any) => {
        let data

        data = {
          order_id: item.order_id,
          invoice_id: item.id,
          date_order: formatDate(new Date(item.survey_date)),
          // product_name: string
          // installation_type: string
          // quotation_id: number
          payment_status: item.order.status.category,
          member_id: item.order.member_id,
          // vendor_name: item.vendor.company_name,
          order_status: item.order.status.category,
        }

        return data
      })

      return invoiceData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await ViewInvoice()
      setInvoiceData(data)
    }

    fetchData()
  }, [dateFrom, dateTo, searchFilter, searchByOrderStatus])

  return (
    <section id='view-invoice'>
      <div className='card'>
        <div className='card-body table-view-order'>
          <div className='filter-search'>
            <InputGroup>
              <Form.Control
                placeholder='Filter'
                className='filter-rtl'
                onChange={handleChangeSearchFilter}
              />

              <InputGroup.Text className='filter-rtl'>
                <FontAwesomeIcon icon={faSearch} size='sm' />
              </InputGroup.Text>
            </InputGroup>
          </div>

          <div className='table-head-wrapper'>
            <div className='left'>
              <h3>Filter By :</h3>
            </div>

            <div className='middle'>
              <div className='date-filter'>
                <div className='start-date'>
                  <h3 className='fs-7'>Start Date : </h3>
                  <Form.Control type='date' onChange={handleChangeJoinDate} />
                </div>

                <div className='end-date'>
                  <h3 className='fs-7 '>End Date : </h3>
                  <Form.Control type='date' onChange={handleChangeEndDate} />
                </div>
              </div>

              <Form.Group as={Row}>
                <Form.Label className='fs-7 d-flex align-items-center' column sm='6'>
                  Sort Order Status
                </Form.Label>

                <Col sm='6'>
                  <Select
                    name='tukang_service'
                    className='form-control p-0'
                    classNamePrefix='select'
                    placeholder='Status'
                    isSearchable={true}
                    options={status}
                    onChange={(element: any) => handleChangeSelectTukangService(element)}
                  />
                </Col>
              </Form.Group>
            </div>

            <div className='right'>
              <button className='button-export'>
                <FontAwesomeIcon icon={faFileExcel} size='2xl' className='excel-icon' />
              </button>
            </div>
          </div>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={invoiceData}
            rowKey={(record) => record.invoice_id}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewInvoiceVendor}
