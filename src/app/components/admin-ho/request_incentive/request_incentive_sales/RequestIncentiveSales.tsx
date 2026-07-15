/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, FC, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {formatDateWithTime} from '../../../../../_metronic/helpers'

import axios from 'axios'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import type {ColumnsType} from 'antd/es/table'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {LoadingOutlined} from '@ant-design/icons'
import {Table, DatePicker, PaginationProps, Spin, Pagination} from 'antd'
import {Form, Row, Button, OverlayTrigger, Tooltip, FormGroup} from 'react-bootstrap'
import {faSearch, faCheckCircle} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

interface DataType {
  incentive_id: number
  incentive_type: string
  order_id: number
  store_name: string
  status_order: string
  costumer_name: string
  sales_name: string
  brands: string
  bank_name: string
  account_name: string
  account_number: number
  receipt_number: string
  sales_comission: number
  quotation_grand_total: number
  status: string
}

const RequestIncentiveSales: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const userRole = localStorage.getItem('userRole') as string
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [incentiveData, setIncentiveData] = useState<DataType[]>([])
  const [selectedRows, setSelectedRows] = useState<DataType[]>([])

  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  )
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const renderTooltip = (title: string) => <Tooltip id='button-tooltip'>{title}</Tooltip>
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
      title: 'Nama Toko',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'left',
      width: 140,
      onFilter: (value: string, record: DataType) => record.store_name.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Nama Sales',
      dataIndex: 'sales_name',
      key: 'sales_name',
      align: 'left',
      width: 140,
      onFilter: (value: string, record: DataType) => record.sales_name.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.sales_name.length - b.sales_name.length,
    },
    {
      title: 'Brands',
      dataIndex: 'brands',
      key: 'brands',
      align: 'left',
      width: 140,
      onFilter: (value: string, record: DataType) => record.brands.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.brands.length - b.brands.length,
    },
    {
      title: 'Nama Bank',
      dataIndex: 'bank_name',
      key: 'bank_name',
      align: 'left',
      width: 140,
      onFilter: (value: string, record: DataType) => record.bank_name.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.bank_name.length - b.bank_name.length,
    },
    {
      title: 'Nama Akun',
      dataIndex: 'account_name',
      key: 'account_name',
      align: 'left',
      width: 140,
      onFilter: (value: string, record: DataType) => record.account_name.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.account_name.length - b.account_name.length,
    },
    {
      title: 'Nomor Rekening',
      dataIndex: 'account_number',
      key: 'account_number',
      align: 'left',
      width: 140,
      sorter: (a: DataType, b: DataType) => a.account_number - b.account_number,
    },
    {
      title: 'Nama Customer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 140,
      onFilter: (value: string, record: DataType) => record.costumer_name.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'No. Receipt',
      dataIndex: 'receipt_number',
      key: 'receipt_number',
      align: 'left',
      width: 140,
      onFilter: (value: string, record: DataType) => record.receipt_number.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.receipt_number.length - b.receipt_number.length,
    },
    {
      title: 'Status Order',
      dataIndex: 'status_order',
      key: 'status_order',
      align: 'left',
      width: 140,
      onFilter: (value: string, record: DataType) => record.status_order.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.status_order.length - b.status_order.length,
    },
    {
      title: 'Grand Total Quotation',
      dataIndex: 'quotation_grand_total',
      key: 'quotation_grand_total',
      align: 'center',
      width: 135,
      sorter: (a: DataType, b: DataType) => a.quotation_grand_total - b.quotation_grand_total,
    },
    {
      title: 'Komisi Sales',
      dataIndex: 'sales_comission',
      key: 'sales_comission',
      align: 'center',
      width: 135,
      sorter: (a: DataType, b: DataType) => a.sales_comission - b.sales_comission,
    },
    {
      title: 'Tipe Insentif',
      dataIndex: 'incentive_type',
      key: 'incentive_type',
      align: 'center',
      width: 135,
      onFilter: (value: string, record: DataType) => record.incentive_type.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.incentive_type.length - b.incentive_type.length,
    },
    {
      title: 'Status Insentif',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 135,
      onFilter: (value: string, record: DataType) => record.status.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.status.length - b.status.length,
    },
    ['Payroll'].includes(userRole) && {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 70,
      align: 'center',
      render: (record: any) => {
        const id = record.incentive_id

        return (
          <div className='button-wrapper d-flex justify-content-center gap-3'>
            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Sudah dibayarkan')}
            >
              <Button
                variant='primary'
                className='button-verif'
                onClick={() => handleUpdateIncentive(id, 6, 'Insentif Sudah Dibayarkan')}
              >
                <FontAwesomeIcon className='text-white' icon={faCheckCircle} fontSize='13px' />
              </Button>
            </OverlayTrigger>
          </div>
        )
      },
    },
  ].filter(Boolean) as ColumnsType<DataType>

  const getIncentive = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/reports/sales-comission?order_by=desc&status=2&date_from=${dateFrom}&date_to=${dateTo}&page=${page}&take=${pageSize}${queryparams}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        //  // 'Access-Control-Allow-Origin': '*',
        // // 'ngrok-skip-browser-warning':  'true',
        },
      })

      setTotalData(response?.data?.total ?? 0)
      setCurrentPage(response?.data?.page ?? 1)
      setLoadData(false)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
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

  const ViewIncentive = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await getIncentive(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from getIncentive')
        return []
      }

      const incentiveDatas = apiData.map((item: any) => {
        let data

        const statusIncentive = (status: number) => {
          switch (status) {
            case 1:
              return 'Potensial Insentif'
            case 2:
              return 'Pengajuan Insentif'
            case 3:
              return 'Insentif dibayarkan'
            case 4:
              return 'Ditolak'
            case 5:
              return 'Lost Insentif'
            default:
              return ''
          }
        }

        data = {
          incentive_id: item?.id,
          incentive_type:
            item?.quotation?.quotation_special === 0 ? 'Insentif Biasa' : 'Insentif Tahapan',
          order_id: item?.quotation?.order_id,
          store_name: item?.quotation?.order?.store?.store_name,
          status_order: item?.quotation?.order?.status?.description,
          costumer_name: item?.quotation?.order?.members?.full_name,
          sales_name: item?.sales?.full_name,
          brands: item?.sales?.sales_brand,
          bank_name: item?.sales?.bank?.bank_name,
          account_name: item?.sales?.account_name,
          account_number: item?.sales?.account_number,
          receipt_number: item?.quotation?.order.receipt_number,
          sales_comission: `Rp. ${parseInt(item?.nominal ?? 0).toLocaleString('id')}`,
          quotation_grand_total: `Rp. ${parseInt(
            item?.quotation?.quotation_grand_total ?? 0
          ).toLocaleString('id')}`,
          status: statusIncentive(item?.status),
        }

        return data
      })

      return incentiveDatas
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewIncentive(page, pageSize, queryparams)
    setIncentiveData(data)
  }

  useEffect(() => {
    fetchData(1, 10, '')
  }, [])

  // Selected Row
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRows(selectedRows)
    },
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

    valueCheck(`&search=`, searchFilter)
    const data = await ViewIncentive(1, 10, queryparams)
    setIncentiveData(data)

    setLoadingButton(false)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubmitFilter()
    }
  }

  // Handle Request New Incentive Group
  const handleRequest = async () => {
    setIsLoading(true)
    const formData = new FormData()

    formData.append('status', String(2))
    if (selectedRows.length > 0) {
      selectedRows.forEach((item: any, index: number) => {
        formData.append(`sales_incentive[${index}][sales_incentive_id]`, item.incentive_id)
      })
    }

    try {
      const response = await axios.post(`${apiUrl}/comission-sales-incentive`, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        //  // 'Access-Control-Allow-Origin': '*',
        // // 'ngrok-skip-browser-warning':  'true',
        },
      })

      if (response.data.status === 201) {
        Swal.fire({
          title: 'Success',
          text: 'Sucess Request Incentive',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate(`/reports/report-insentif`)
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

  // Handle Update Status Incentive
  const handleUpdateIncentive = async (id: number, status: number, statusName: string) => {
    const formData = new FormData()
    formData.append('status', String(status))

    const textConfirmation = `Apakah Anda yakin ingin mengubah status insentif ini menjadi ${statusName} ?`

    Swal.fire({
      title: textConfirmation,
      icon: 'question',
      showConfirmButton: true,
      confirmButtonColor: '#6b9230',
      showDenyButton: true,
      confirmButtonText: 'Ya',
      denyButtonText: 'Tidak',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true)
        try {
          const response = await axios.post(`${apiUrl}/incentive-sales/${id}`, formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              // 'Access-Control-Allow-Origin': '*',
             // 'ngrok-skip-browser-warning':  'true',
            },
          })
          if (response.data.status === 201) {
            Swal.fire({
              title: 'Success',
              text: 'Berhasil mengubah status insentif',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
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

          window.location.reload()
        } catch (error: any) {
          console.error(error)
          setIsLoading(false)
          Swal.fire({
            title: 'Error',
            text: error.response?.data?.message || 'Something went wrong',
            icon: 'error',
          })
        }
      } else {
        setIsLoading(false)
      }
    })
  }

  return (
    <section id='new-invoice'>
      <div className='card'>
        <div className='card-body table-view-order'>
          <Row className='table-head-wrapper'>
            <div
              className='d-flex flex-column flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row align-items-start align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center justify-content-start gap-3'
              onKeyDown={handleKeyPress}
            >
              <h3 className='d-flex align-items-center fs-5 fw-normal'>Date</h3>

              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range'
                defaultValue={[dayjs().subtract(30, 'day'), dayjs()]}
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

              {/* <Button
                className='btn-dark-primary button-submit m-0'
                disabled={loadingButton}
                onClick={handleSubmitFilter}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button> */}

              <Button className='btn-dark-primary button-submit m-0' onClick={handleSubmitFilter}>
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>
            </div>
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
                dataSource={incentiveData}
                pagination={false}
                sticky={true}
                tableLayout='auto'
                scroll={{x: 'max-content'}}
                rowKey={(record) => record.incentive_id}
                rowSelection={{
                  preserveSelectedRowKeys: true,
                  ...rowSelection,
                }}
              />
            </div>
          </Spin>

          <div className='pagination-container mt-5'>
            <span className='total-text'>
              Showing {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, totalData)} of {totalData} Total Insentif Sales
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

          {['Admin HO', 'Super User'].includes(userRole) && (
            <div className='d-flex justify-content-center align-items-center mt-5'>
              <Button
                className='d-flex justify-content-center align-items-center m-0'
                variant='dark-success'
                type='submit'
                disabled={isLoading}
                onClick={handleRequest}
              >
                {isLoading ? 'Mengajukan..' : 'Ajukan Insentif Sales'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export {RequestIncentiveSales}
