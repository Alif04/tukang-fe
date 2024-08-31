/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, useRef} from 'react'
import {WorkOrderTukang} from '../../../../interfaces/work-order'
import {useNavigate} from 'react-router-dom'

import './ViewWorkOrder.css'

import axios from 'axios'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import Select from 'react-select'
import type {ColumnsType} from 'antd/es/table'
import {LoadingOutlined} from '@ant-design/icons'
import makeAnimated from 'react-select/animated'
import {Table, Tag, PaginationProps, Spin, Pagination, DatePicker, Image} from 'antd'
import {
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  OverlayTrigger,
  Tooltip,
  Modal,
  ListGroup,
} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faPen,
  faSearch,
  faFileImage,
  faTrash,
  faImage,
  faPrint,
} from '@fortawesome/free-solid-svg-icons'
import {formatDateWithTime} from '../../../../../_metronic/helpers'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface DataType {
  work_order_id: number
  order_id: number
  existing_tukang: Array<any>
  store_name: string
  date_order: string
  costumer_id: number
  costumer_name: string
  phone_number: number
  payment_quotation: string
  order_status: string
  order_status_label: string
}

const ViewWorkVendor: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const animatedComponents = makeAnimated()

  const vendorId = localStorage.getItem('vendor_id')

  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [orderData, setOrderData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(50)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>(
    new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
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
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      width: 100,
      sorter: (a, b) => a.order_id - b.order_id,
    },

    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 'fit-content',
      onFilter: (value, record) => record.date_order.includes(String(value)),
      sorter: (a, b) => a.date_order.length - b.date_order.length,
    },
    {
      title: 'Nama Toko',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      width: 'fit-content',
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'No Member',
      dataIndex: 'costumer_id',
      key: 'costumer_id',
      align: 'center',
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      width: 'fit-content',
      sorter: (a, b) => a.costumer_id - b.costumer_id,
    },
    {
      title: 'Nama Customer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'center',
      width: 'fit-content',
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'No. Telp/WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'center',
      width: 'fit-content',
      sorter: (a, b) => a.phone_number - b.phone_number,
    },

    {
      title: 'Status Order',
      dataIndex: 'order_status_label',
      key: 'order_status_label',
      align: 'left',
      width: 'fit-content',
      render: (order_status) => {
        const orderStatus = order_status
        let color = ''

        switch (orderStatus) {
          case 'BOOK':
            color = 'green'
            break
          case 'BOOKED':
            color = 'lime'
            break
          case 'SURVEYREQ':
            color = 'blue'
            break
          case 'SURVEYSTART':
          case 'SURVEYDONE':
          case 'QUOTE IN':
          case 'QUOTE OUT':
          case 'WORKREQ':
          case 'WORKSTART':
          case 'WORKEND':
          case 'CISOUT':
            color = 'green'
            break
          default:
            color = 'blue'
            break
        }

        return <Tag color={color}>{orderStatus}</Tag>
      },
      onFilter: (value, record) => record.order_status_label.includes(String(value)),
      sorter: (a, b) => a.order_status_label.length - b.order_status_label.length,
    },
    {
      title: 'Status Pembayaran Quotation',
      dataIndex: 'payment_quotation',
      key: 'payment_quotation',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.payment_quotation.includes(String(value)),
      sorter: (a, b) => a.payment_quotation.length - b.payment_quotation.length,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 'fit-content',
      render: (record) => {
        const id = record.order_id

        const handleDetailId = () => {
          navigate(`/work-order/detail-work-order/${id}`)
        }

        const handleUpdateId = () => {
          navigate(`/work-order/update-work-order/${id}`)
        }

        const handleModalRequest = (id: number) => {
          const selected = orderData.find((item) => item.order_id === id)

          if (selected) {
            setModalRequest(true)
            setTukangRequest((prev: any) => ({
              ...prev,
              work_order_id: selected.work_order_id,
              existing_tukang_id: selected.existing_tukang.map((item: any) => ({
                id: item.request_tukang,
              })),
            }))
          }
        }

        const handleModalNotification = (id: number) => {
          const selected = orderData.find((item) => item.order_id === id)

          if (selected) {
            setModalNotification(true)
          }
        }

        return (
          <div className='button-wrapper d-flex justify-content-center gap-3'>
            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Detail Work Order')}
            >
              <Button variant='primary' className='button-detail' onClick={handleDetailId}>
                <FontAwesomeIcon className='text-white' icon={faBook} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>

            {![
              'QUOTEIN',
              'QUOTATIONPAID',
              'QUOTATIONPAIDSTEPONE',
              'QUOTATIONPAIDSTEPTWO',
              'QUOTATIONPAIDSTEPTHREE',
              'QUOTEOUT',
              'CANCEL',
              'WARRANTYCLAIM',
              'INVESTIGATED',
              'COMPLAINTAPPROVEDBYHO',
              'COMPLAINTREJECTEDBYHO',
              'SURVEYDONE',
              'WORKEND',
              'WORKENDSTEPONE',
              'WORKENDSTEPTWO',
              'WORKENDSTEPTHREE',
            ].includes(record.order_status) ? (
              <OverlayTrigger
                placement='bottom'
                delay={{show: 250, hide: 400}}
                overlay={renderTooltip('Update Work Order')}
              >
                <Button variant='primary' className='button-edit' onClick={handleUpdateId}>
                  <FontAwesomeIcon className='text-white' icon={faPen} fontSize={'13px'} />
                </Button>
              </OverlayTrigger>
            ) : (
              <></>
            )}

            {[
              'QUOTEIN',
              'QUOTEOUT',
              'QUOTATIONPAID',
              'QUOTATIONPAIDSTEPONE',
              'QUOTATIONPAIDSTEPTWO',
              'QUOTATIONPAIDSTEPTHREE',
            ].includes(record.order_status) && (
              <OverlayTrigger
                placement='bottom'
                delay={{show: 250, hide: 400}}
                overlay={renderTooltip('Cetak PDF Quotation')}
              >
                <Button
                  className='button-request'
                  variant='warning'
                  onClick={() =>
                    exportToPDF(record.order_id, record.payment_quotation, record.costumer_name)
                  }
                >
                  <FontAwesomeIcon className='text-white' icon={faPrint} fontSize={'13px'} />
                </Button>
              </OverlayTrigger>
            )}

            {/* <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Permintaan Pergantian Tukang')}
            >
              <Button
                variant='warning'
                className='button-request'
                onClick={() => handleModalRequest(id)}
              >
                <FontAwesomeIcon className='text-white' icon={faShuffle} fontSize={'13px'} />
              </Button>
            </OverlayTrigger> */}

            {/* <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Notifikasi Permintaan Pergantian Tukang')}
            >
              <Button
                variant='danger'
                className='button-cancel'
                onClick={() => handleModalNotification(id)}
              >
                <FontAwesomeIcon
                  className='text-white'
                  icon={faPeopleArrowsLeftRight}
                  fontSize={'13px'}
                />
              </Button>
            </OverlayTrigger> */}
          </div>
        )
      },
    },
  ]

  const fetchOrderList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/orders?order_by=desc&vendor_id=${vendorId}&date_from=${dateFrom}&date_to=${dateTo}&page=${page}&take=${pageSize}${queryparams}`

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

  const ViewOrder = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchOrderList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const orderData = apiData.map((item: any) => {
        let data

        const phoneNumber = item?.project_number.startsWith('0')
          ? item.project_number
          : `+62${item.project_number}`

        const orderDate = formatDateWithTime(item?.created_at)

        const paymentQuotation = (() => {
          if (item?.quotation?.length) {
            if (
              item?.quotation[0]?.receipt_quotation !== null &&
              item?.quotation[0]?.quotation_files.length
            ) {
              return 'PAID'
            } else {
              return 'UNPAID'
            }
          } else {
            return ''
          }
        })()

        data = {
          order_id: item?.id,
          work_order_id: item?.work_orders?.id,
          store_name: item?.store?.store_name,
          date_order: orderDate,
          costumer_id: item?.members?.member_number,
          costumer_name: item?.members?.full_name,
          phone_number: phoneNumber,
          item_name: item?.m_order_details[0]?.item_name ?? '-',
          payment_quotation: paymentQuotation,
          order_status: item?.status?.category,
          order_status_label: item?.status?.description,
          existing_tukang: item?.work_orders?.request_tukang ?? [],
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

  const getTukang = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tukang?vendor_id=${vendorId}&take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempTukang = response.data.data.map((item: any) => ({
          tukang_id: item.id ?? 0,
          tukang_name: item.full_name,
          is_active: item.is_active,
        }))
        const filteredTukang = tempTukang.filter((x: any) => x.is_active !== false)
        setTukang(filteredTukang)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData(1, 10, '')
  }, [])

  useEffect(() => {
    getTukang()
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

    const data = await ViewOrder(1, pageSize, queryparams)
    setOrderData(data)

    setLoadingButton(false)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubmitFilter()
    }
  }

  const [modalRequest, setModalRequest] = useState(false)
  const handleModalRequest = () => {
    setModalRequest(false)
  }

  // Replace Tukang
  const [tukang, setTukang] = useState<WorkOrderTukang[]>([])
  const [tukangRequest, setTukangRequest] = useState<any>({
    work_order_id: null,
    status_id: 2,
    existing_tukang_id: null,
    tukang_id: null,
    notes: '',
  })

  // File
  const [files, setFiles] = useState<Array<File | null>>([])
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)
  const [previewFile, setPreviewFile] = useState<any>()
  const [visibleFile, setVisibleFile] = useState(false)
  const evidenceRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files

    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const existingFiles = [...files]
      const mergedFiles = existingFiles.concat(file)

      const {length: existingFilesLength} = existingFiles
      const {length: fileListLength} = fileList

      for (let i = 0; i < fileListLength; i++) {
        mergedFiles[existingFilesLength + i] = fileList.item(i)
      }

      setFiles(mergedFiles)
    }
  }

  // Click Image
  const handleFileClick = () => {
    const inputField = document.querySelector('.input-field-file') as HTMLInputElement
    inputField.click()
  }

  // Handle Remove File
  const handleRemoveFiles = (index: number) => {
    const newEvidances = [...files]
    newEvidances.splice(index, 1)
    setFiles(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  // File Click
  const handleFileIndex = (index: number) => {
    setPreviewFile(files[index]?.name)
    setVisibleFile(true)
    setSelectedFileIndex(index)
  }

  const handleTukangChanges = async () => {
    const formData = new FormData()

    formData.append(`replace_tukang[0][status]`, tukangRequest.status_id)
    formData.append(`replace_tukang[0][notes]`, tukangRequest.notes)

    if (tukangRequest.existing_tukang_id?.length) {
      tukangRequest.existing_tukang_id.forEach((item: any, index: number) => {
        if (item) {
          formData.append(`replace_tukang[${index}][id]`, item.id)
        }
      })
    }

    if (tukangRequest.tukang_id?.length) {
      tukangRequest.tukang_id.forEach((item: any, index: number) => {
        if (item) {
          formData.append(`replace_tukang[${index}][tukang_id]`, item.id)
        }
      })
    }

    if (files?.length) {
      files.forEach((item) => {
        if (item instanceof Blob) {
          formData.append(`file`, item, item.name)
        }
      })
    }

    await axios
      .post(`${apiUrl}/work-orders/${tukangRequest.work_order_id}/replace-tukang`, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        if (response.data.status === 201) {
          Swal.fire({
            title: 'Success',
            text: 'Berhasil Melakukan Permintaan Pergantian Tukang',
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

  // Modal Notification Tukang Change
  const [modalNotification, setModalNotification] = useState(false)
  const handleCloseNotification = () => {
    setModalNotification(false)
  }

  // Preview Image
  const [visible, setVisible] = useState(false)

  // Tukang Request Handler
  const tukangRequestHandler = (e: any) => {
    setTukangRequest((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const tukangHandler = (selectedOptions: any) => {
    const updatedTukang = selectedOptions.map((option: any) => ({
      id: option.tukang_id,
    }))

    setTukangRequest((prev: any) => ({
      ...prev,
      tukang_id: updatedTukang,
    }))
  }

  // Export PDF Quotation
  const exportToPDF = (order_id: number, receipt_quotation: string, customer_name: string) => {
    axios
      .get(`${apiUrl}/orders/quotation-pdf/${order_id}`, {
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
        link.setAttribute(
          'download',
          `Quotation ${
            receipt_quotation === 'UNPAID' ? 'Belum Dibayar' : 'Sudah Dibayar'
          } - ${customer_name} - Order ID ${order_id}.pdf`
        )
        document.body.appendChild(link)
        link.click()
      })
      .catch((error: any) => {
        Swal.fire('Error', 'Terjadi kesalahan saat mengekspor data', 'error')
      })
  }

  return (
    <section id='view-work-order-vendor'>
      <div className={`card ${className}`}>
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
                defaultValue={[dayjs().subtract(7, 'day'), dayjs()]}
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
            indicator={<LoadingOutlined style={{fontSize: 24}} spin />}
          >
            <div className='table-custom-wrapper'>
              <Table
                className='table-striped-rows'
                bordered
                columns={columns}
                dataSource={orderData}
                rowKey={(record) => record.order_id}
                pagination={false}
                sticky={true}
                tableLayout='auto'
                scroll={{x: 1700}}
              />
            </div>
          </Spin>

          <div className='pagination-container mt-5'>
            <span className='total-text'>
              Showing {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, totalData)} of {totalData} Order
            </span>

            <Pagination
              className='pagination'
              current={currentPage}
              total={totalData}
              showSizeChanger
              defaultPageSize={pageSize}
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
        </div>
      </div>

      <Modal
        dialogClassName='modal-vendor-request'
        centered
        show={modalRequest}
        onHide={handleModalRequest}
      >
        <Modal.Header closeButton>
          <Modal.Title>Formulir Alasan Pergantian Tukang</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className='mb-5'>
            <Form.Group className='tukang-info'>
              <Form.Label>Tukang</Form.Label>

              <Select
                classNamePrefix='select'
                placeholder='Pilih Tukang'
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={tukang}
                getOptionValue={(option: WorkOrderTukang) => `${option.tukang_id}`}
                getOptionLabel={(option: WorkOrderTukang) =>
                  tukang.find((item) => item.tukang_id === option.tukang_id)?.tukang_name ||
                  'Pilih Tukang'
                }
                onChange={(e) => tukangHandler(e)}
              />
            </Form.Group>
          </Row>

          <Row className='notes mb-5'>
            <Form.Group>
              <Form.Label className='fs-5 fw-bold'>Alasan :</Form.Label>
              <Form.Control
                name='notes'
                style={{minHeight: '140px'}}
                as='textarea'
                onChange={(e) => tukangRequestHandler(e)}
              />
            </Form.Group>
          </Row>

          <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
            <Form.Group>
              <Form.Label>Upload File</Form.Label>

              <Form className='form-input-image' onClick={handleFileClick}>
                <Form.Control
                  type='file'
                  accept='image/jpeg, image/png'
                  className='input-field-file'
                  multiple
                  hidden
                  id='file-input'
                  ref={evidenceRef}
                  onChange={handleFileChange}
                />

                <div className='input-image-text'>
                  <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                  <p>Add File</p>
                </div>
              </Form>

              <ListGroup className='pt-3'>
                {files.length ? (
                  files.map((item: any, index: number) => (
                    <ListGroup>
                      <ListGroup.Item
                        className='d-flex justify-content-between align-items-center'
                        key={`${item?.name}-${index}-${item?.type}`}
                      >
                        <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                        <span
                          className='upload-content'
                          style={{cursor: 'pointer'}}
                          onClick={() => handleFileIndex(index)}
                        >
                          {item?.name}
                        </span>

                        <FontAwesomeIcon
                          icon={faTrash}
                          size='sm'
                          color='#ed2b2a'
                          style={{cursor: 'pointer'}}
                          onClick={(e) => handleRemoveFiles(index)}
                        />
                      </ListGroup.Item>

                      {selectedFileIndex === index && item && (
                        <Image
                          key={`${previewFile} - ${index}`}
                          width={200}
                          style={{display: 'none'}}
                          src={
                            item instanceof File
                              ? URL.createObjectURL(item)
                              : `${apiUrl}/public/invoices/${previewFile}`
                          }
                          preview={{
                            visible: visibleFile,
                            src:
                              item instanceof File
                                ? URL.createObjectURL(item)
                                : `${apiUrl}/public/invoices/${previewFile}`,
                            onVisibleChange: (value) => {
                              setVisibleFile(value)
                            },
                          }}
                        />
                      )}
                    </ListGroup>
                  ))
                ) : (
                  <ListGroup.Item className='d-flex justify-content-center'>
                    Tidak ada file yang dipilih
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Form.Group>
          </Row>

          <Button
            className='d-flex justify-content-center align-items-center w-100 mt-5'
            onClick={handleTukangChanges}
            variant='primary'
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal>

      <Modal
        dialogClassName='modal-vendor-change'
        centered
        show={modalNotification}
        onHide={handleCloseNotification}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pemberitahuan Permintaan Pergantian Tukang</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className='notes mb-5'>
            <Form.Group>
              <Form.Label className='fs-5 fw-bold'>Alasan dari Tukang :</Form.Label>
              <Form.Control
                readOnly
                style={{minHeight: '140px'}}
                as='textarea'
                value={'Jadwal saya sudah padat dan tidak bisa mengerjakan pekerjaan ini.'}
              />
            </Form.Group>
          </Row>

          <Row className='mb-5'>
            <Form.Label className='mt-3'>Bukti Foto :</Form.Label>
            <ListGroup>
              <ListGroup.Item
                action
                style={{cursor: 'pointer'}}
                onClick={() => {
                  setVisible(true)
                }}
              >
                foto-jadwal.png
              </ListGroup.Item>
            </ListGroup>

            <div>
              <Image
                width={200}
                style={{display: 'none'}}
                src='https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
                preview={{
                  visible,
                  src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
                  onVisibleChange: (value) => {
                    setVisible(value)
                  },
                }}
              />
            </div>
          </Row>

          <Row className='button-wrapper d-flex justify-content-center'>
            <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
              <Button type='submit' variant='success' className='button-approve w-100'>
                Setujui
              </Button>
            </Col>

            <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
              <Button type='submit' variant='danger' className='button-decline w-100'>
                Tolak
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </section>
  )
}

export {ViewWorkVendor}
