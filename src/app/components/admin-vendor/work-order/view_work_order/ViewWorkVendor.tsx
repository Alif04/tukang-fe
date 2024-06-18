/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, useRef} from 'react'
import {useNavigate} from 'react-router-dom'

import './ViewWorkOrder.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import type {ColumnsType} from 'antd/es/table'
import {LoadingOutlined} from '@ant-design/icons'
import {Table, Tag, PaginationProps, Spin, Pagination, DatePicker, Image} from 'antd'
import {
  Row,
  Col,
  Form,
  InputGroup,
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
  faPeopleArrowsLeftRight,
  faFileImage,
  faTrash,
  faImage,
  faShuffle,
} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface DataType {
  order_id: number
  store_name: string
  date_order: string
  costumer_id: number
  costumer_name: string
  phone_number: number
  payment_status: string
  order_status: string
  order_status_label: string
}

const ViewWorkVendor: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const vendorId = localStorage.getItem('vendor_id')

  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [orderData, setOrderData] = useState<DataType[]>([])
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
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 80,
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Nama Store',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      width: 120,
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
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
      title: 'Customer ID',
      dataIndex: 'costumer_id',
      key: 'costumer_id',
      align: 'center',
      width: 110,
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.costumer_id - b.costumer_id,
    },
    {
      title: 'Customer Name',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'center',
      width: 120,
      sorter: (a, b) => a.phone_number - b.phone_number,
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      align: 'left',
      width: 110,
      onFilter: (value, record) => record.payment_status.includes(String(value)),
      sorter: (a, b) => a.payment_status.length - b.payment_status.length,
    },
    {
      title: 'Order Status',
      dataIndex: 'order_status_label',
      key: 'order_status_label',
      align: 'left',
      width: 120,
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
          case 'WIP':
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
      filters: [
        {text: 'SURVEYSTART', value: 'SURVEYSTART'},
        {text: 'SURVEYREQ', value: 'SURVEYREQ'},
      ],
      onFilter: (value, record) => record.order_status_label.includes(String(value)),
      sorter: (a, b) => a.order_status_label.length - b.order_status_label.length,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 50,
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

            {!['QUOTEIN', 'QUOTEOUT'].includes(record.order_status) ? (
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
            </OverlayTrigger>

            <OverlayTrigger
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
    let apiUrlWithParams = `${apiUrl}/orders?order_by=desc&vendor_id=${vendorId}&page=${page}&take=${pageSize}${queryparams}`

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

        const orderDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        const paymentStatus = (() => {
          if (item?.payment_type === 'survey') {
            return item?.quotation?.length === 0
              ? 'UNPAID'
              : item?.quotation[0]?.quotation_files?.length === 0
              ? 'UNPAID'
              : 'PAID'
          } else if (item?.payment_type === 'gratis') {
            return 'FREE'
          } else if (item?.payment_type === 'pemasangan_tanpa_survey') {
            return item?.receipt_number === null ? 'UNPAID' : 'PAID'
          } else {
            return ''
          }
        })()

        const orderStatus = (() => {
          if (item?.work_orders?.work_order_status?.length >= 0) {
            if (['QUOTEIN', 'QUOTEOUT'].includes(item?.status?.category)) {
              return item?.status?.category
            } else if (
              ['WORKREQ'].includes(item?.status?.category) &&
              item?.payment_type === 'survey' &&
              !['WORKSTART', 'WIP', 'WORKEND'].includes(
                item?.work_orders?.work_order_status[0]?.status?.category
              )
            ) {
              return item?.status?.category
            } else {
              return item?.work_orders?.work_order_status[0]?.status?.category
            }
          } else {
            return item?.status?.category
          }
        })()

        const orderStatusLabel = (() => {
          if (item?.work_orders?.work_order_status?.length >= 0) {
            if (['QUOTEIN', 'QUOTEOUT'].includes(item?.status?.category)) {
              return item?.status?.description
            } else if (
              ['WORKREQ'].includes(item?.status?.category) &&
              item?.payment_type === 'survey' &&
              !['WORKSTART', 'WIP', 'WORKEND'].includes(
                item?.work_orders?.work_order_status[0]?.status?.category
              )
            ) {
              return item?.status?.description
            } else {
              return item?.work_orders?.work_order_status[0]?.status?.description
            }
          } else {
            return item?.status?.description
          }
        })()

        data = {
          order_id: item?.id,
          store_name: item?.store?.store_name,
          date_order: orderDate,
          costumer_id: item?.members?.member_number,
          costumer_name: item?.members?.full_name,
          phone_number: item?.project_number,
          item_name: item?.m_order_details[0]?.item_name ?? '-',
          payment_status: paymentStatus,
          order_status: orderStatus,
          order_status_label: orderStatusLabel,
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

    valueCheck(`&date_from=`, dateFrom)
    valueCheck(`&date_to=`, dateTo)
    valueCheck(`&search=`, searchFilter)

    const data = await ViewOrder(1, 10, queryparams)
    setOrderData(data)

    setLoadingButton(false)
  }

  const [modalRequest, setModalRequest] = useState(false)
  const handleModalRequest = () => {
    setModalRequest(false)
  }

  const [tukangRequest, setTukangRequest] = useState<any>({
    work_order_id: null,
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

    formData.append(`work_order_id`, tukangRequest.work_order_id)
    formData.append(`notes`, tukangRequest.notes)

    if (files?.length) {
      files.forEach((item) => {
        if (item instanceof Blob) {
          formData.append(`files`, item, item.name)
        }
      })
    }

    await axios
      .post(`${apiUrl}/tukang/${tukangRequest.work_order_id}`, formData, {
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

  return (
    <section id='view-work-order-vendor'>
      <div className={`card ${className}`}>
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
              dataSource={orderData}
              rowKey={(record) => record.order_id}
              pagination={false}
            />
          </Spin>

          <Pagination
            className='mt-5'
            style={{textAlign: 'right', position: 'relative'}}
            current={currentPage}
            total={totalData}
            showSizeChanger
            pageSizeOptions={[5, 10, 20, 50, 100]}
            itemRender={itemRender}
            onChange={(page, pageSize) => {
              fetchData(page, pageSize, '')
            }}
            showTotal={(total, range) => (
              <span style={{left: 0, position: 'absolute'}}>
                Showing {range[0]} - {range[1]} of {total} Work Order
              </span>
            )}
          />
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
