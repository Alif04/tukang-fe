import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './ViewReportTukang.css'

import axios from 'axios'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import type {ColumnsType} from 'antd/es/table'
import {Table, Tag, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faNoteSticky, faSearch} from '@fortawesome/free-solid-svg-icons'
import {Row, Card, Form, FormGroup, OverlayTrigger, Tooltip, Button, Modal} from 'react-bootstrap'

interface Status {
  value: number | null
  category: string
}

interface DataType {
  order_id: number
  work_order_id: number
  date_order: Date
  store_name: string
  costumer_name: string
  service_name: string
  order_status: string
  notes: string
}

interface TukangNotes {
  work_order_id: number | null
  tukang_id: any
  notes: string
}

const {RangePicker} = DatePicker

const ViewReportTukang = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const userTukang = localStorage.getItem('tukang_id') as any
  const tukangId = userTukang ? `&tukang_id=${userTukang}` : ''

  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loadingExport, setLoadingExport] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [workOrderData, setWorkOrderData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>(new Date().toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState<any>(new Date().toISOString().split('T')[0])
  const [searchFilter, setSearchFilter] = useState<string>('')

  const today = new Date()
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }
  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  // Status
  const storedStatus = sessionStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
  const desiredStatus = statusData.filter((status: any) => ['WORKEND'].includes(status.category))
  const statuses = desiredStatus.map((x) => x.value)

  const getWorkOrder = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/work-orders?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}${tukangId}&status=${statuses}&page=${page}&take=${pageSize}${queryparams}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setCurrentPage(response?.data?.page ?? 1)
      setTotalData(response?.data?.total ?? 0)
      setLoadData(false)

      return response.data.data
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          title: 'Sesi Anda Telah Berakhir',
          text: 'Silahkan Logout dan Login Ulang Kembali',
          icon: 'warning',
          confirmButtonText: 'Ok',
        })
      } else {
        console.log('error when fetching data', error)
      }
    }
  }

  const ViewWorkOrder = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await getWorkOrder(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from getWorkOrder')
        return []
      }

      const workOrderData = apiData.map((item: any) => {
        let data

        const orderDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })

        data = {
          order_id: item?.order?.id,
          work_order_id: item.id,
          store_name: item?.order?.store?.store_name ?? '-',
          date_order: orderDate,
          costumer_name: item?.order?.members.full_name,
          order_status: item?.order?.status?.description,
          notes:
            item?.work_order_tukang.find((item: any) => item.tukang_id === parseInt(userTukang))
              .notes ?? '',
          service_name:
            item?.order?.payment_type === 'survey' &&
            item?.work_order_status[0]?.work_order_items.length === 0
              ? item?.order?.m_order_details[0]?.item_notes
              : item?.order?.payment_type === 'survey' &&
                item?.work_order_status[0]?.work_order_items.length >= 1
              ? item?.work_order_status[0]?.work_order_items
                  .map((item: any) => item?.name)
                  .join(', ')
              : item?.order?.m_order_details?.map((item: any) => item?.item?.item_name).join(', '),
        }

        return data
      })

      return workOrderData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewWorkOrder(page, pageSize, queryparams)
    setWorkOrderData(data)
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

  const handleSubmitFilter = async () => {
    setLoadingButton(true)
    let queryparams = ``

    const valueCheck = (key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        queryparams += `${key}${value}`
      }
    }

    valueCheck(`&search=`, searchFilter)

    const data = await ViewWorkOrder(1, 10, queryparams)
    setWorkOrderData(data)

    setLoadingButton(false)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubmitFilter()
    }
  }

  const renderTooltip = (title: string) => <Tooltip id='button-tooltip'>{title}</Tooltip>
  const columns: ColumnsType<DataType> = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      className: 'col_order_id',
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      sorter: (a, b) => new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
    },
    {
      title: 'Nama Toko',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Nama Customer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'center',
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'Nama Pemasangan',
      dataIndex: 'service_name',
      key: 'service_name',
      align: 'center',
      onFilter: (value, record) => record.service_name.includes(String(value)),
      sorter: (a, b) => a.service_name.length - b.service_name.length,
    },
    {
      title: 'Status Order',
      dataIndex: 'order_status',
      key: 'order_status',
      align: 'left',
      render: (order_status) => {
        const orderStatus = order_status
        return <Tag color='blue'>{orderStatus}</Tag>
      },
      onFilter: (value, record) => record.order_status.includes(String(value)),
      sorter: (a, b) => a.order_status.length - b.order_status.length,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      align: 'center',
      render: (record) => {
        const id = record.work_order_id

        const handleDetailId = () => {
          navigate(`/work-order/detail-work-order/${id}`)
        }

        const handleShowModal = (id: number, type: number) => {
          const selected = workOrderData.find((work_order) => work_order.work_order_id === id)

          if (selected) {
            setModal(true)
            setModalType(type)
            setTukangNotes({
              work_order_id: selected?.work_order_id ?? null,
              tukang_id: userTukang,
              notes: selected?.notes ?? '',
            })
          }
        }

        return (
          <div className='button-wrapper d-flex justify-content-center align-items-center gap-3'>
            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Detail Work Order')}
            >
              <Button variant='primary' className='button-detail' onClick={handleDetailId}>
                <FontAwesomeIcon className='text-white' icon={faBook} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Catatan Tukang')}
            >
              <Button
                variant='primary'
                className='button-verif'
                onClick={() => handleShowModal(id, 1)}
              >
                <FontAwesomeIcon className='text-white' icon={faNoteSticky} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>
          </div>
        )
      },
    },
  ]

  // Export To Excel
  const exportToExcel = () => {
    setLoadingExport(true)

    let url = `${apiUrl}/tukang/export-excel-order?order_by=desc${tukangId}`

    const valueCheck = (key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        url += `${key}${value}`
      }
    }

    valueCheck(`&date_from=`, dateFrom)
    valueCheck(`&date_to=`, dateTo)

    axios
      .get(url, {
        method: 'GET',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `Report Performance.xlsx`)
          document.body.appendChild(link)
          link.click()

          setLoadingExport(false)
        } else {
          Swal.fire({
            title: 'Warning',
            text: response.data.message,
            icon: 'warning',
          })

          setLoadingExport(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setLoadingExport(false)
      })
  }

  // Export PDF
  const exportToPDF = () => {
    setLoadingPdf(true)

    let url = `${apiUrl}/tukang/export-pdf-order?order_by=desc${tukangId}`

    const valueCheck = (key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        url += `${key}${value}`
      }
    }

    valueCheck(`&date_from=`, dateFrom)
    valueCheck(`&date_to=`, dateTo)

    axios
      .get(url, {
        method: 'GET',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `Report Performance.pdf`)
          document.body.appendChild(link)
          link.click()

          setLoadingPdf(false)
        } else {
          Swal.fire({
            title: 'Warning',
            text: response.data.message,
            icon: 'warning',
          })

          setLoadingPdf(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setLoadingPdf(false)
      })
  }

  // Modal Catatan
  const [showModal, setModal] = useState(false)
  const [modalType, setModalType] = useState<number | null>(null)
  const [tukangNotes, setTukangNotes] = useState<TukangNotes>({
    work_order_id: null,
    tukang_id: null,
    notes: '',
  })
  const handleCloseModal = () => {
    setModal(false)
  }

  const handleSubmitNotes = async () => {
    await axios
      .post(`${apiUrl}/work-orders/update-notes/${tukangNotes.work_order_id}`, tukangNotes, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        if (response.data.status === 201 || response.data.status === 200) {
          Swal.fire({
            title: 'Success',
            text: 'Berhasil menyimpan catatan',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          })
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })
        }

        window.location.reload()
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
    <section id='view-report-tukang'>
      <Card>
        <Card.Body>
          <div className='d-flex justify-content-end mb-4 gap-3'>
            <button className='button-export' onClick={exportToPDF}>
              <h3 className='fs-5 fw-semibold'>{loadingPdf ? 'Exporting..' : 'Export To PDF'}</h3>
            </button>

            <button className='button-export' onClick={exportToExcel}>
              <h3 className='fs-5 fw-semibold'>
                {loadingExport ? 'Exporting..' : 'Export To Excel'}
              </h3>
            </button>
          </div>

          <Row className='table-head-wrapper'>
            <div
              className='d-flex flex-column flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row align-items-start align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center justify-content-start gap-3'
              onKeyDown={handleKeyPress}
            >
              <h3 className='d-flex align-items-center fs-5 fw-normal'>Date</h3>

              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range'
                defaultValue={[
                  dayjs(`${formatDate(today)}`, 'DD-MM-YYYY'),
                  dayjs(`${formatDate(today)}`, 'DD-MM-YYYY'),
                ]}
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

              <Button
                className='btn-dark-primary button-submit m-0'
                disabled={loadingButton}
                onClick={handleSubmitFilter}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>
            </div>
          </Row>

          <Spin
            tip='Loading...'
            spinning={loadData}
            size='large'
            indicator={<LoadingOutlined style={{fontSize: 24}} spin rev />}
          >
            <div className='table-custom-wrapper'>
              <Table
                className='table-striped-rows'
                bordered
                columns={columns}
                dataSource={workOrderData}
                rowKey={(record) => record.order_id}
                tableLayout='auto'
                sticky={true}
                scroll={{x: 'max-content'}}
                pagination={false}
              />
            </div>
          </Spin>

          <div className='pagination-container mt-5'>
            <span className='total-text'>
              Showing {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, totalData)} of {totalData} Work Order
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
        </Card.Body>
      </Card>

      {/* Modal Input Catatan Tukang */}
      <Modal
        dialogClassName='modal-upload-notes'
        centered
        show={showModal}
        onHide={handleCloseModal}
      >
        {modalType === 1 && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Catatan Tukang</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Row className='notes mb-5'>
                <Form.Group>
                  <Form.Label className='fs-5 fw-bold'>Catatan :</Form.Label>
                  <Form.Control
                    style={{minHeight: '140px'}}
                    as='textarea'
                    value={tukangNotes.notes}
                    onChange={(e) => setTukangNotes({...tukangNotes, notes: e.target.value})}
                  />
                </Form.Group>
              </Row>

              <Button
                className='d-flex justify-content-center align-items-center w-100 mt-5'
                variant='primary'
                onClick={handleSubmitNotes}
              >
                Submit
              </Button>
            </Modal.Body>
          </>
        )}
      </Modal>
    </section>
  )
}

export {ViewReportTukang}
