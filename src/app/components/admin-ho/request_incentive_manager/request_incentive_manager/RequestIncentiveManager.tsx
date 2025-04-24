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
import Select, {SingleValue} from 'react-select'
import {C} from '@fullcalendar/core/internal-common'

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

const RequestIncentiveManager: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const userRole = localStorage.getItem('userRole') as string
  const navigate = useNavigate()
  const [currentQueryParams, setCurrentQueryParams] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [incentiveData, setIncentiveData] = useState<DataType[]>([])
  const [incentiveData2, setIncentiveData2] = useState<any[]>([])
  const [selectedRows, setSelectedRows] = useState<DataType[]>([])
  const [manager, setSManager] = useState<any[]>([])
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
      title: 'Nama Toko',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'left',
      width: 140,
      onFilter: (value: string, record: DataType) => record.store_name.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Grand Total Quotation',
      dataIndex: 'quotation_grand_total',
      key: 'quotation_grand_total',
      align: 'center',
      width: 135,
      sorter: (a: DataType, b: DataType) => a.quotation_grand_total - b.quotation_grand_total,
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
  const getIncentive2 = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/incentive?is_manager=${true}&page=${page}&take=${pageSize}${queryparams}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      // setCurrentPage(response?.data?.data?.page ?? 1)
      // setTotalData(response?.data?.total ?? 0)
      setIncentiveData2(response.data.data)
      setLoadData(false)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  const getIncentive = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&page=${page}&take=${pageSize}${queryparams}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
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
      const apiData2 = await getIncentive2(page, pageSize, queryparams)
      // console.log(apiData2);
      let totalKomisi = 0
      let dataIincentive = 0
      if (apiData2.length > 0 && apiData) {
        dataIincentive = apiData2[0]?.incentive
      }
      if (!apiData) {
        console.error('No data received from getIncentive')
        return []
      }

      const incentiveDatas = apiData.map((item: any) => {
        let data

        let totalQuotationGrandTotal = 0

        if (item?.quotation && Array.isArray(item.quotation)) {
          totalQuotationGrandTotal = item.quotation.reduce(
            (total: number, q: any) => total + (parseInt(q.quotation_grand_total) || 0),
            0
          )
        }
        if (apiData2.length > 0) {
          const totalNulai = item?.store?.quotation?.reduce(
            (total: any, q: any) => total + (parseInt(q.quotation_grand_total) || 0),
            0
          )

          totalKomisi = (totalNulai * dataIincentive) / 100
        }
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
          store_name: item?.store?.store_name,
          bank_name: item?.store?.bank_name,
          account_name: item?.store?.bank_account,
          account_number: item?.store?.bank_number,
          sales_comission: `Rp. ${totalKomisi.toLocaleString('id')}`,
          quotation_grand_total: `Rp. ${totalQuotationGrandTotal.toLocaleString('id')}`,

          // status: statusIncentive(item?.status),
        }

        return data
      })

      return incentiveDatas
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }
  const getManager = async () => {
    let apiUrlWithParams = `${apiUrl}/manager/managerUser/${selectedStore.value}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      console.log(response);
      setSManager(response.data.data)
      // setCurrentPage(response?.data?.data?.page ?? 1)
      // setTotalData(response?.data?.total ?? 0)
      // setIncentiveData2(response.data.data)
      // setLoadData(false)

    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewIncentive(page, pageSize, queryparams)
    setIncentiveData(data)
  }
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
          value: item.id,
          label: item.store_name,
        }))

        setStore(tempStore)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getStore()
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
    valueCheck(`&managers=`, true)
    if (selectedStore) {
      valueCheck(`&store_id=`, selectedStore.value)
    }
    setCurrentQueryParams(queryparams)
    const data = await ViewIncentive(1, 10, queryparams)
    getManager()
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
    // setIsLoading(true)
    // const formData = new FormData()
    let totalNominal = selectedRows.reduce((sum: number, item: any) => {
      const nominalNumber = Number(
        item.quotation_grand_total.replace('Rp. ', '').replace(/\./g, '').replace(',', '.')
      )
      return sum + nominalNumber
    }, 0)

    if (totalNominal > Number(incentiveData2[0].min_order) && (selectedRows.length >= Number(incentiveData2[0].min_invoice))) {
      try {
        const payload ={
          manager_id:manager[0].id,
          nominal: Number(incentiveData2[0].incentive),
          status:1,
          incentive_id: Number(incentiveData2[0].id),


        }
      const response = await axios.post(`${apiUrl}/manager/insentive-manager`, payload, {
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
          text: 'Sucess Request Incentive',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          // navigate(`/reports/report-insentif`)
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
    } else{
        Swal.fire({
              title: 'Danger',
              text: 'Mohon Maaf Tidak Bisa mengajukan insetif manager karena tidak sesuai dengan kondisi yang ada',
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
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
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
  const [store, setStore] = useState<any[]>([])
  const [selectedStore, setSelectedStore] = useState<any>(null)
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

              <DatePicker
                format={'MM-YYYY'}
                className='date-picker'
                picker='month' // Mode bulan & tahun
                defaultValue={dayjs().subtract(1, 'month')} // Default ke bulan lalu
                onChange={(value) => {
                  if (value) {
                    const year = value.year()
                    const month = value.month() + 1 // month() dimulai dari 0, jadi tambah 1

                    // Get the last day of the selected month
                    const lastDay = new Date(year, month, 0).getDate()

                    const dateFromFormatted = `${year}-${month.toString().padStart(2, '0')}-01`
                    const dateToFormatted = `${year}-${month
                      .toString()
                      .padStart(2, '0')}-${lastDay}`

                    setDateFrom(dateFromFormatted)
                    setDateTo(dateToFormatted)

                    // Immediately submit the filter with the new dates
                    setTimeout(() => {
                      handleSubmitFilter()
                    }, 100)
                  } else {
                    // Default to current month if cleared
                    const currentDate = new Date()
                    const currentYear = currentDate.getFullYear()
                    const currentMonth = currentDate.getMonth() + 1
                    const lastDay = new Date(currentYear, currentMonth, 0).getDate()

                    setDateFrom(`${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
                    setDateTo(
                      `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDay}`
                    )
                  }
                }}
              />
              <h3 className='d-flex align-items-center fs-5 fw-normal'>Toko</h3>
              <Select
                name='store_id'
                id='store_id'
                className='form-control p-0 form-item-name z'
                classNamePrefix='select'
                placeholder='Pilih/Ketik Toko'
                isSearchable={true}
                isClearable={true}
                options={store}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 99999,
                  }),
                }}
                onChange={(newValue) => setSelectedStore(newValue)}
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
              {Math.min(currentPage * pageSize, totalData)} of {totalData} Total Insentif Manager
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
                fetchData(page, pageSize, currentQueryParams)
              }}
            />
          </div>
          {['Admin HO', 'Super User'].includes(userRole) && (
            <div className='d-flex justify-content-center align-items-center mt-5'>
              <Button
                className='d-flex justify-content-center align-items-center m-0'
                variant='dark-success'
                type='submit'
                disabled={selectedStore?false:true}
                onClick={handleRequest}
              >
                {isLoading ? 'Mengajukan..' : 'Ajukan Insentif Manager'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export {RequestIncentiveManager}
