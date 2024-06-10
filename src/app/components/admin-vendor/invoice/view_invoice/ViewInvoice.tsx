/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, FC} from 'react'
import {useNavigate} from 'react-router-dom'

import './ViewInvoice.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import type {ColumnsType} from 'antd/es/table'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {LoadingOutlined} from '@ant-design/icons'
import {Table, Tag, DatePicker, PaginationProps, Spin, Pagination} from 'antd'
import {Form, InputGroup, Row, Col, Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import {faBook, faPen, faSearch} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

interface DataType {
  invoice_id: number
  order_id: number
  invoice_date: string
  store_name: string
  invoice_status: string
}

interface Store {
  store_id: number
  store_name: string
}

const ViewInvoiceVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const userVendor = localStorage.getItem('vendor_id') as any

  const [loadingButton, setLoadingButton] = useState(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [store, setStore] = useState<Store[]>([])
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

  const renderTooltip = (title: string) => <Tooltip id='button-tooltip'>{title}</Tooltip>
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
      title: 'Nama Store',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      width: 150,
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Tanggal Invoice',
      dataIndex: 'invoice_date',
      key: 'invoice_date',
      align: 'left',
      width: 110,
      onFilter: (value, record) => record.invoice_date.includes(String(value)),
      sorter: (a, b) => a.invoice_date.length - b.invoice_date.length,
    },
    {
      title: 'Invoice Status',
      dataIndex: 'invoice_status',
      key: 'invoice_status',
      align: 'center',
      width: 140,
      onFilter: (value, record) => record.invoice_status.includes(String(value)),
      sorter: (a, b) => a.invoice_status.length - b.invoice_status.length,
      filters: [
        {text: 'Waiting for Payment', value: 'Waiting for Payment'},
        {text: 'Approve', value: 'Approve'},
        {text: 'Decline', value: 'Decline'},
      ],
      render: (invoice_status) => {
        const orderStatus = invoice_status
        let color = ''

        switch (orderStatus) {
          case 'Waiting for Payment':
            color = 'green'
            break
          case 'Paid':
            color = 'blue'
            break
          case 'Invoice Declined':
            color = 'red'
            break
          default:
            color = 'gray'
            break
        }

        return <Tag color={color}>{orderStatus}</Tag>
      },
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
          <div className='button-wrapper d-flex justify-content-center gap-3'>
            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Detail Invoice')}
            >
              <Button variant='primary' className='button-detail' onClick={handleDetailInvoice}>
                <FontAwesomeIcon className='text-white' icon={faBook} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Edit Invoice')}
            >
              <Button variant='primary' className='button-edit' onClick={handleUpdateInvoice}>
                <FontAwesomeIcon className='text-white' icon={faPen} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>

            {/* <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Hapus Invoice')}
            >
              <Button className='button-delete' variant='danger' onClick={handleDelete}>
                <FontAwesomeIcon className='text-white' icon={faTrash} fontSize={'13px'} />
              </Button>
            </OverlayTrigger> */}
          </div>
        )
      },
    },
  ]

  const getStore = async () => {
    try {
      const response = await axios.get(`${apiUrl}/stores?take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempStore = response.data.data.map((item: any) => ({
          store_id: item.id,
          store_name: item.store_name,
        }))

        setStore(tempStore)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchInvoiceList = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const response = await axios.get(
        `${apiUrl}/invoices?order_by=desc&page=${page}&vendor_id=${userVendor}&take=${pageSize}${queryparams}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      setLoadData(false)
      setCurrentPage(response.data.page)
      setTotalData(response?.data?.total ?? 0)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewInvoice = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchInvoiceList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchInvoiceList')
        return []
      }

      const invoiceData = apiData.map((item: any) => {
        let data

        const orderIds = item?.invoice_details?.map((item: any) => `#${item?.order_id}`).join(', ')
        const storesId = item?.invoice_details?.map((detail: any) => detail?.order?.store_id)
        const uniqueStoreIds = Array.from(new Set(storesId))
        const storeName = uniqueStoreIds
          .map((storeId: any) => {
            return store.find((x: Store) => x.store_id === storeId)?.store_name
          })
          .join(', ')

        const invoiceDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        const invoiceStatus = (status: number) => {
          switch (status) {
            case 1:
              return 'Waiting for Payment'
            case 2:
              return 'Paid'
            case 3:
              return 'Invoice Declined'
            default:
              return ''
          }
        }

        data = {
          invoice_id: item?.id,
          order_id: orderIds,
          invoice_date: invoiceDate,
          store_name: storeName,
          invoice_status: invoiceStatus(item?.status),
        }

        return data
      })

      return invoiceData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewInvoice(page, pageSize, queryparams)
    setInvoiceData(data)
  }

  useEffect(() => {
    fetchData(1, 10, '')
  }, [store])

  useEffect(() => {
    getStore()
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

  // Filter
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

    const data = await ViewInvoice(1, 10, queryparams)
    setInvoiceData(data)

    setLoadingButton(false)
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

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <Button
                className='btn-dark-primary button-submit'
                disabled={loadingButton}
                onClick={handleSubmitFilter}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>
            </Col>
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
              dataSource={invoiceData}
              rowKey={(record) => record.invoice_id}
              pagination={false}
            />
          </Spin>

          <Pagination
            className='mt-5'
            style={{textAlign: 'right', position: 'relative'}}
            current={currentPage}
            total={totalData}
            showSizeChanger
            pageSizeOptions={[5, 10, 20, 50, 100, 250, 500]}
            itemRender={itemRender}
            onChange={(page, pageSize) => {
              fetchData(page, pageSize, '')
            }}
            showTotal={(total, range) => (
              <span style={{left: 0, position: 'absolute'}}>
                Showing {range[0]} - {range[1]} of {total} Total Invoice
              </span>
            )}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewInvoiceVendor}
