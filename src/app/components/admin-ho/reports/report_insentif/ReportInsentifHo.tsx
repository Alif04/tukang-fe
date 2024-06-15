/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ReportInsentif.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select from 'react-select'
import * as XLSX from 'xlsx'
import {Table, Tag, DatePicker, PaginationProps, Spin, Pagination} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup, Button} from 'react-bootstrap'
import {LoadingOutlined} from '@ant-design/icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch, faFilter, faFileExcel, faPrint} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface SalesItem {
  value: number | null
  label: string
}

interface DataType {
  order_id: number
  date_order: Date
  costumer_name: string
  sales_name: string
  incentive_name: string
  status: string
  sales_comission: number
}

const ReportInsentifHO: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL

  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [orderData, setOrderData] = useState<DataType[]>([])
  const [totalOrder, setTotalOrder] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const [sales, setSales] = useState<SalesItem[]>([])
  const [selectedSales, setSelectedSales] = useState<any>({
    value: null,
    label: 'All Sales',
  })
  const salesOptions = [{value: null, label: 'All Sales'}, ...sales]

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
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
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'left',
      width: 110,
      sorter: (a, b) => new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
    },
    {
      title: 'Nama Konsumen',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'Jenis Insentif',
      dataIndex: 'incentive_name',
      key: 'incentive_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.incentive_name.includes(String(value)),
      sorter: (a, b) => a.incentive_name.length - b.incentive_name.length,
    },
    {
      title: 'Nama Sales',
      dataIndex: 'sales_name',
      key: 'sales_name',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.sales_name.includes(String(value)),
      sorter: (a, b) => a.sales_name.length - b.sales_name.length,
    },
    {
      title: 'Komisi Sales',
      dataIndex: 'sales_comission',
      key: 'sales_comission',
      align: 'center',
      width: 135,
      sorter: (a, b) => a.sales_comission - b.sales_comission,
    },
  ]

  const fetchOrderList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/reports/sales-comission?order_by=desc&page=${page}&take=${pageSize}${queryparams}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setTotalOrder(response?.data?.total ?? 0)
      setCurrentPage(response?.data?.page ?? 1)
      setLoadData(false)

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
        })

        const statusIncentive = (status: number) => {
          switch (status) {
            case 1:
              return 'Draft'
            case 2:
              return 'Waiting For Payment'
            case 3:
              return 'Paid'
            case 4:
              return 'Decline'
            default:
              return ''
          }
        }

        data = {
          order_id: item?.quotation?.order_id,
          date_order: orderDate,
          costumer_name: item?.quotation?.order?.members?.full_name,
          sales_name: item?.sales?.full_name,
          incentive_name: item?.incentive?.name,
          status: statusIncentive(item?.status),
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
    fetchData(1, 10, '')
  }, [])

  useEffect(() => {
    const getSales = async () => {
      try {
        const response = await axios.get(`${apiUrl}/sales?take=0`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempSales = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.full_name,
          }))

          setSales(tempSales)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getSales()
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
    axios
      .get(`${apiUrl}/sales/export-excel?take=0`, {
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
        link.setAttribute('download', `Report Insentif Sales.xlsx`)
        document.body.appendChild(link)
        link.click()
      })
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
    valueCheck(`&sales_id=`, selectedSales.value)

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

            <Col>
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

            <Col>
              <Button
                className='btn-dark-primary button-submit'
                onClick={handleSubmitFilter}
                disabled={loadingButton}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>
            </Col>

            <Col>
              <div className='d-flex justify-content-end'>
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

          <Row className='table-head-wrapper-bottom mb-4'>
            <Col xs={12} md={12} lg={12} xl={2} xxl={2} className='d-flex align-items-center'>
              <h3 className='fs-3 fw-bold w-100'>Filter By : </h3>
            </Col>

            <Col xs={12} md={12} lg={12} xl={10} xxl={10} className='d-flex align-items-center'>
              <h3 className='fs-5 fw-normal'>Sales Person : </h3>

              <Select
                name='sales_id'
                className='form-control p-0 w-100'
                classNamePrefix='select'
                placeholder='Pilih Sales'
                isSearchable={true}
                options={salesOptions}
                value={selectedSales}
                onChange={(newValue) => setSelectedSales(newValue)}
              />
            </Col>
          </Row>

          <div className='total-order'>
            <p className='fs-5'>Total order : {orderData.length}</p>
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
              pagination={false}
            />
          </Spin>

          <Pagination
            className='mt-5'
            style={{textAlign: 'right', position: 'relative'}}
            current={currentPage}
            total={totalOrder}
            showSizeChanger
            pageSizeOptions={[5, 10, 20, 50, 100, 250, 500]}
            itemRender={itemRender}
            onChange={(page, pageSize) => {
              fetchData(page, pageSize, '')
            }}
            showTotal={(total, range) => (
              <span style={{left: 0, position: 'absolute'}}>
                Showing {range[0]} - {range[1]} of {total} Total Order
              </span>
            )}
          />
        </div>
      </div>
    </section>
  )
}

export {ReportInsentifHO}
