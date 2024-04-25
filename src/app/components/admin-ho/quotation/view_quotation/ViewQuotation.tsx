/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ViewQuotation.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import {Table, Tag, DatePicker, PaginationProps} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, InputGroup, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faSearch} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface DataType {
  key: React.Key
  quotation_id: number
  store_name: string
  order_id: number
  date_order: Date
  costumer_name: string
  vendor_name: string
  payment_status: string
  order_status: string
  quotation_status: string
}

interface StoreItem {
  value: number | null
  label: string
}

const ViewQuotationHO: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [loadingButton, setLoadingButton] = useState(false)
  const [quotationData, setQuotationData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const [store, setStore] = useState<StoreItem[]>([])
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreItem>>({
    value: null,
    label: 'All Store',
  })

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const storeOptions = [{value: null, label: 'All Store'}, ...store]

  const columns: ColumnsType<DataType> = [
    {
      title: 'Quotation ID',
      dataIndex: 'quotation_id',
      key: 'quotation_id',
      align: 'center',
      width: 110,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.quotation_id - b.quotation_id,
    },
    {
      title: 'Nama Store',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      width: 130,
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 90,
      className: 'col_order_id',
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Date Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 110,
      sorter: (a, b) => new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
    },
    {
      title: 'Costumer Name',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 130,
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'Nama Vendor',
      dataIndex: 'vendor_name',
      key: 'vendor_name',
      align: 'left',
      width: 130,
      onFilter: (value, record) => record.vendor_name.includes(String(value)),
      sorter: (a, b) => a.vendor_name.length - b.vendor_name.length,
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.payment_status.includes(String(value)),
      sorter: (a, b) => a.payment_status.length - b.payment_status.length,
    },
    {
      title: 'Order Status',
      dataIndex: 'order_status',
      key: 'order_status',
      align: 'left',
      width: 120,
      render: (order_status) => {
        const orderStatus = order_status
        let color = ''

        switch (orderStatus) {
          case 'QUOTEIN':
            color = 'green'
            break
          case 'QUOTEOUT':
          default:
            color = 'blue'
            break
        }

        return <Tag color={color}>{orderStatus}</Tag>
      },
      filters: [{text: 'QUOTEOUT', value: 'QUOTEOUT'}],
      onFilter: (value, record) => record.order_status.includes(String(value)),
      sorter: (a, b) => a.order_status.length - b.order_status.length,
    },
    {
      title: 'Quotation Status',
      dataIndex: 'quotation_status',
      key: 'quotation_status',
      align: 'left',
      width: 140,
      render: (quotation_status) => {
        const orderStatus = quotation_status
        let color = ''

        switch (orderStatus) {
          case 'QUOTEOUT':
            color = 'green'
            break
          default:
            color = 'blue'
            break
        }

        return <Tag color={color}>{orderStatus}</Tag>
      },
      filters: [
        {text: 'QUOTEOUT', value: 'QUOTEOUT'},
        {text: 'QUOTEIN', value: 'QUOTEIN'},
      ],
      onFilter: (value, record) => record.quotation_status.includes(String(value)),
      sorter: (a, b) => a.quotation_status.length - b.quotation_status.length,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 50,
      render: (record) => {
        const handleDetail = () => {
          const id = record.quotation_id
          navigate(`/quotation/detail-quotation/${id}`)
        }

        const handleEdit = () => {
          const id = record.quotation_id
          navigate(`/quotation/update-quotation/${id}`)
        }

        return (
          <div className='button-wrapper'>
            <a className='button-detail' onClick={handleDetail}>
              <FontAwesomeIcon icon={faBook} size='sm' />
            </a>

            <a className='button-edit' onClick={handleEdit}>
              <FontAwesomeIcon icon={faPen} size='sm' />
            </a>
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

  const getQuotationList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/quotation?order_by=desc&page=${page}&take=${pageSize}${queryparams}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setCurrentPage(response.data.page)
      setTotalData(response?.data?.total ?? 0)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewQuotation = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await getQuotationList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from getQuotationList')
        return []
      }

      const quotationData = apiData.map((item: any) => {
        let data
        const orderDate = new Date(item.order.created_at)

        let paymentStatus = item.receipt_number === null ? 'UNPAID' : 'PAID'

        data = {
          quotation_id: item.id,
          store_name: item?.store?.store_name ?? '-',
          order_id: item.order.id,
          date_order: formatDate(orderDate),
          costumer_name: item?.order?.members?.full_name ?? '',
          vendor_name: item?.order?.vendor?.company_name ?? '-',
          payment_status: paymentStatus,
          order_status: item?.status?.category ?? '',
          quotation_status: item?.status?.category ?? '',
        }

        return data
      })

      return quotationData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewQuotation(page, pageSize, queryparams)
    setQuotationData(data)
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

  useEffect(() => {
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

        if (Array.isArray(response.data.data.data)) {
          const tempStore = response.data.data.data.map((item: any) => ({
            value: item.id,
            label: item.store_name,
            city_id: item.city_id,
          }))

          setStore(tempStore)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getStore()
  }, [])

  const handleSubmitFilter = async () => {
    setLoadingButton(true)

    const storeId = selectedStore && selectedStore.value ? `&store_id=${selectedStore.value}` : ''
    const queryparams = `&date_from=${dateFrom}&date_to=${dateTo}&search=${searchFilter}${storeId}`
    await getQuotationList(1, 10, queryparams)

    setLoadingButton(false)
  }

  return (
    <section id='view-quotation'>
      <div className={`card ${className}`}>
        <div className='card-body'>
          <Row className='table-head-wrapper'>
            <Col xxl={3} xl={3} lg={3} md={3} sm={12} className='d-flex mb-2'>
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

            <Col xxl={3} xl={3} lg={3} md={3} sm={12}>
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

            <Col xxl={3} xl={3} lg={3} md={3} sm={12}>
              <Select
                name='store_id'
                className='form-control p-0'
                classNamePrefix='select'
                placeholder='Pilih Toko'
                isSearchable={true}
                options={storeOptions}
                value={selectedStore}
                onChange={(newValue) => setSelectedStore(newValue)}
              />
            </Col>

            <Col xxl={3} xl={3} lg={3} md={3} sm={12}>
              <Button
                className='btn-dark-primary button-submit'
                disabled={loadingButton}
                onClick={handleSubmitFilter}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={quotationData}
            rowKey={(record) => record.quotation_id}
            // scroll={{x: 1800}}
            pagination={{
              position: ['bottomRight'],
              current: currentPage,
              total: totalData,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50, 100],
              onChange: (page, pageSize) => {
                fetchData(page, pageSize, '')
              },
              itemRender: itemRender,
              showTotal: (total, range) => (
                <span style={{left: 0, position: 'absolute'}}>
                  Showing {range[0]} - {range[1]} of {total} Quotation
                </span>
              ),
            }}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewQuotationHO}
