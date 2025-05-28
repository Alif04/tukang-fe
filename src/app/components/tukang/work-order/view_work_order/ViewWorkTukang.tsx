/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {RootState} from '../../../../../store'
import {
  setQueryParams,
  setCurrentPage,
  setPageSize,
  setDateFrom,
  setDateTo,
  setSearchFilter,
} from '../../../../../store/workOrderSlice'

import './ViewWorkOrder.css'

import axios from 'axios'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'

import {LoadingOutlined} from '@ant-design/icons'
import {Table, Tag, PaginationProps, Spin, Pagination, DatePicker, Image} from 'antd'
import {
  Row,
  Col,
  Form,
  FormGroup,
  OverlayTrigger,
  Tooltip,
  Button,
  Modal,
  ListGroup,
} from 'react-bootstrap'
import {
  faBook,
  faPen,
  faSearch,
  faImage,
  faFileImage,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {formatDateWithTimeZone} from '../../../../../_metronic/helpers'

import type {ColumnsType} from 'antd/es/table'
import type {FilterValue, SorterResult, TableCurrentDataSource} from 'antd/es/table/interface'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface DataType {
  order_id: number
  work_order_id: number
  store_name: string
  date_order: string
  costumer_name: string
  order_status: string
  order_status_label: string
}

const ViewWorkOrderTukang: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Session Storage
  const tukangId = localStorage.getItem('tukang_id') as number | null

  // Loading
  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [totalData, setTotalData] = useState<number>(0)
  const [loadData, setLoadData] = useState<boolean>(true)

  // Table State
  const [workOrderData, setWorkOrderData] = useState<DataType[]>([])
  const {queryParams, searchFilter, currentPage, pageSize, dateFrom, dateTo} = useSelector(
    (state: RootState) => state.workOrder
  )

  // Status
  const storedStatus = localStorage.getItem('statusData')
  const statusData = storedStatus ? JSON.parse(storedStatus) : []
  const statusFilters = statusData.map((item: any) => ({
    text: item.description,
    value: item.value,
  }))

  // Columns Table
  const renderTooltip = (title: string) => <Tooltip id='button-tooltip'>{title}</Tooltip>
  const columns: ColumnsType<DataType> = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      className: 'col_order_id',
      width: 90,
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.date_order.includes(String(value)),
      sorter: (a, b) => a.date_order.length - b.date_order.length,
    },
    {
      title: 'Nama Toko',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      width: 100,
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Nama Customer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'Status Order',
      dataIndex: 'order_status_label',
      key: 'order_status_label',
      align: 'left',
      filters: statusFilters,
      filterMultiple: true,
      width: 120,
      render: (order_status) => {
        const orderStatus = order_status
        let color = ''

        switch (orderStatus) {
          case 'UNPAID':
            color = 'red'
            break
          case 'PAID':
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
      title: 'Action',
      key: 'action',
      fixed: 'right',
      align: 'center',
      width: 110,
      render: (record) => {
        const id = record.work_order_id

        const handleDetailId = () => {
          navigate(`/work-order/detail-work-order/${id}`)
        }

        const handleUpdateId = () => {
          navigate(`/work-order/update-work-order/${id}`)
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

            {[
              'TUKANGSURVEY',
              'SURVEYSTART',
              'RESURVEYREQ',
              'RETUKANGSURVEY',
              'RESURVEYSTART',
              'TUKANGWORK',
              'TUKANGWORKSTEPONE',
              'TUKANGWORKSTEPTWO',
              'TUKANGWORKSTEPTHREE',
              'WORKSTART',
              'WORKSTARTSTEPONE',
              'WORKSTARTSTEPTWO',
              'WORKSTARTSTEPTHREE',
              'REWORKREQ',
              'RETUKANGWORK',
              'REWORKSTART',
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
          </div>
        )
      },
    },
  ]

  const fetchWorkOrder = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/work-orders?order_by=desc${queryparams}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
        params: {
          page: page,
          take: pageSize,
          tukang_id: tukangId || null,
          date_from: dateFrom || null,
          date_to: dateTo || null,
        },
      })

      setCurrentPage(response?.data?.page ?? 1)
      setTotalData(response?.data?.total ?? 0)

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
    } finally {
      setLoadData(false)
    }
  }

  const ViewWorkOrder = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchWorkOrder(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchWorkOrder')
        return []
      }

      const workOrderData = apiData.map((item: any) => {
        let data

        const orderDate = formatDateWithTimeZone(item?.order?.created_at)

        const phoneNumber = item?.order?.project_number.startsWith('0')
          ? item?.order?.project_number
          : `+62${item?.order?.project_number}`

        data = {
          order_id: item?.order.id,
          work_order_id: item.id,
          store_name: item?.order?.store?.store_name ?? '-',
          date_order: orderDate,
          costumer_id: item?.order?.members.member_number,
          costumer_name: item?.order?.members.full_name,
          phone_number: phoneNumber,
          order_status: item?.order?.status?.category,
          order_status_label: item?.order?.status?.description,
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
    fetchData(currentPage, pageSize, queryParams)
  }, [currentPage, pageSize, queryParams])

  // Table Handler
  const handleChangeSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value))
  }

  const handlePageChange = (page: number, size?: number) => {
    dispatch(setCurrentPage(page))
    if (size) {
      dispatch(setPageSize(size))
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

  const handleFilterTable = (
    pagination: PaginationProps,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[],
    extra: TableCurrentDataSource<DataType>
  ) => {
    const newQueryParams: string[] = []

    if (filters.order_status_label && filters.order_status_label.length > 0) {
      const statusFilters = filters.order_status_label.join(',')
      newQueryParams.push(`&status=${statusFilters}`)
    }

    if (filters.payment_quotation) {
      const quotationStatus = filters.payment_quotation[0]
      if (quotationStatus) {
        newQueryParams.push(`&is_receipt_quotation=${quotationStatus}`)
      }
    }

    const finalQueryParams = newQueryParams.join('')

    dispatch(setQueryParams(finalQueryParams))
    dispatch(setCurrentPage(1))

    fetchData(currentPage, pageSize, finalQueryParams)
  }

  const handleSubmitFilter = async () => {
    setLoadingButton(true)
    dispatch(setCurrentPage(1))

    try {
      const data = await ViewWorkOrder(1, 10, queryParams)
      setWorkOrderData(data)
    } catch (error) {
      console.error('Error getting order list data:', error)
    } finally {
      setLoadingButton(false)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubmitFilter()
    }
  }

  // Modal Tukang Request Change
  const [modalRequest, setModalRequest] = useState(false)
  const handleModalRequest = () => {
    setModalRequest(false)
  }

  const [tukangRequest, setTukangRequest] = useState<any>({
    work_order_id: null,
    status_id: 1,
    existing_tukang_id: Number(tukangId),
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
    formData.append(`replace_tukang[0][id]`, tukangRequest.existing_tukang_id)

    if (files?.length) {
      files.forEach((item) => {
        if (item instanceof Blob) {
          formData.append(`file`, item, item.name)
        }
      })
    }

    await axios
      .post(`${apiUrl}/tukang/${tukangRequest.work_order_id}/replace-tukang`, formData, {
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

  return (
    <section id='view-work-order-tukang'>
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
                value={[
                  dateFrom ? dayjs(dateFrom, 'YYYY-MM-DD') : null,
                  dateTo ? dayjs(dateTo, 'YYYY-MM-DD') : null,
                ]}
                onChange={(values) => {
                  if (values && values.length === 2) {
                    const dateFromFormatted = values[0]?.format('YYYY-MM-DD') || ''
                    const dateToFormatted = values[1]?.format('YYYY-MM-DD') || ''

                    dispatch(setDateFrom(dateFromFormatted))
                    dispatch(setDateTo(dateToFormatted))
                  } else {
                    dispatch(setDateFrom(''))
                    dispatch(setDateTo(''))
                  }
                }}
              />

              <div className='filter-search'>
                <FormGroup>
                  <Form.Control
                    placeholder='Search'
                    className='filter-ltr'
                    value={searchFilter ?? ''}
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
                dataSource={workOrderData}
                rowKey={(record) => record.work_order_id}
                pagination={false}
                sticky={true}
                tableLayout='auto'
                onChange={handleFilterTable}
              />
            </div>
          </Spin>

          <div className='pagination-container mt-5'>
            <span className='total-text'>
              Showing {(currentPage - 1) * pageSize + 1} -
              {Math.min(currentPage * pageSize, totalData)} of {totalData} Work Order
            </span>

            <Pagination
              className='pagination'
              pageSize={pageSize}
              current={currentPage}
              total={totalData}
              showSizeChanger
              pageSizeOptions={[5, 10, 20, 50, 100, 250, 500]}
              itemRender={itemRender}
              onChange={(page, pageSize) => {
                handlePageChange(page, pageSize)
              }}
            />
          </div>
        </div>
      </div>

      <Modal
        dialogClassName='modal-tukang-request'
        centered
        show={modalRequest}
        onHide={handleModalRequest}
      >
        <Modal.Header closeButton>
          <Modal.Title>Formulir Alasan Pergantian Tukang</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className='notes mb-5'>
            <Form.Group>
              <Form.Label className='fs-5 fw-bold'>Alasan :</Form.Label>
              <Form.Control
                style={{minHeight: '140px'}}
                as='textarea'
                onChange={(e) =>
                  setTukangRequest((prev: any) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
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
        dialogClassName='modal-tukang-change'
        centered
        show={modalNotification}
        onHide={handleCloseNotification}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pemberitahuan Pergantian Tukang dari Vendor</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className='notes mb-5'>
            <Form.Group>
              <Form.Label className='fs-5 fw-bold'>Alasan dari Vendor :</Form.Label>
              <Form.Control
                readOnly
                style={{minHeight: '140px'}}
                as='textarea'
                value={'Karena tukang sakit'}
              />
            </Form.Group>
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

export {ViewWorkOrderTukang}
