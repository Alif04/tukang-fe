/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, FC, useRef} from 'react'
import {useNavigate} from 'react-router-dom'

import './ViewInvoice.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import type {ColumnsType} from 'antd/es/table'
import {Table, Tag, DatePicker, PaginationProps, Spin, Pagination, Upload, Image} from 'antd'
import {InboxOutlined} from '@ant-design/icons'
import {
  Form,
  InputGroup,
  Row,
  Col,
  Button,
  OverlayTrigger,
  Tooltip,
  Modal,
  ListGroup,
} from 'react-bootstrap'
import {LoadingOutlined} from '@ant-design/icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faSearch,
  faXmarkCircle,
  faImage,
  faFileImage,
  faTrash,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker
const {Dragger} = Upload

interface DataType {
  invoice_id: number
  status: number
  invoice_date: string
  vendor_name: string
  amount: number
  invoice_status: string
}

interface Invoices {
  status: number | null
  invoice_id: any[]
}

interface Status {
  value: any
  category: string
  label: string
}

const ViewInvoiceHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [loadingTemplate, setLoadingTemplate] = useState<boolean>(false)
  const [loadingUploadExcel, setLoadingUploadExcel] = useState<boolean>(false)
  const [loadingExport, setLoadingExport] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [invoiceData, setInvoiceData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  // Status
  const storedStatus = sessionStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []

  // Update Invoice
  const [invoiceId, setInvoiceId] = useState<any>()
  console.log('invoice', invoiceId)
  const [invoiceNotes, setInvoiceNotes] = useState<any>()
  const [invoices, setInvoices] = useState<Invoices>({
    status: 2,
    invoice_id: [],
  })

  // Update Status Invoice
  // useEffect(() => {
  //   const updatedStatusId = statusData.find((status: any) => status?.category === 'UNPAID')
  //   const statusId = updatedStatusId?.value

  //   setInvoices((prev) => ({
  //     ...prev,
  //     status_id: statusId,
  //   }))
  // }, [invoices])

  // Filter Table
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
      title: 'Tanggal Invoice Terbit',
      dataIndex: 'invoice_date',
      key: 'invoice_date',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.invoice_date.includes(String(value)),
      sorter: (a, b) => a.invoice_date.length - b.invoice_date.length,
    },
    {
      title: 'Nama Vendor',
      dataIndex: 'vendor_name',
      key: 'vendor_name',
      align: 'center',
      width: 140,
      onFilter: (value, record) => record.vendor_name.includes(String(value)),
      sorter: (a, b) => a.vendor_name.length - b.vendor_name.length,
    },
    {
      title: 'Total Tagihan',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      width: 100,
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Status Invoice',
      dataIndex: 'invoice_status',
      key: 'invoice_status',
      align: 'center',
      width: 140,
      onFilter: (value, record) => record.invoice_status.includes(String(value)),
      sorter: (a, b) => a.invoice_status.length - b.invoice_status.length,
      render: (invoice_status) => {
        const orderStatus = invoice_status
        let color = ''

        switch (orderStatus) {
          case 'UNPAID':
            color = 'red'
            break
          default:
            color = 'blue'
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
        const id = record.invoice_id

        const handleDetailInvoice = () => {
          navigate(`/invoice/detail-invoice/${id}`)
        }

        const handleShowModal = (id: number) => {
          const selected = invoiceData.find((invoice) => invoice.invoice_id === id)

          console.log('selected', selected)

          if (selected) {
            setInvoiceId(selected.invoice_id)
            setModalInvoice(true)
          }
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

            {[1].includes(record.status) ? (
              <OverlayTrigger
                placement='bottom'
                delay={{show: 250, hide: 400}}
                overlay={renderTooltip('Tolak Invoice')}
              >
                <Button
                  className='button-cancel'
                  variant='danger'
                  onClick={() => handleShowModal(id)}
                >
                  <FontAwesomeIcon className='text-white' icon={faXmarkCircle} fontSize={'13px'} />
                </Button>
              </OverlayTrigger>
            ) : (
              <></>
            )}

            {[2, 4].includes(record.status) ? (
              <OverlayTrigger
                placement='bottom'
                delay={{show: 250, hide: 400}}
                overlay={renderTooltip('Kirim Invoice ke Finance')}
              >
                <Button
                  variant='primary'
                  className='button-verif'
                  onClick={() => handleUpdateInvoice(id, 5, 'Invoice diberikan kepada Finance')}
                >
                  <FontAwesomeIcon className='text-white' icon={faCheckCircle} fontSize={'13px'} />
                </Button>
              </OverlayTrigger>
            ) : (
              <></>
            )}

            {[5].includes(record.status) ? (
              <OverlayTrigger
                placement='bottom'
                delay={{show: 250, hide: 400}}
                overlay={renderTooltip('Sudah dibayarkan')}
              >
                <Button
                  variant='primary'
                  className='button-verif'
                  onClick={() => handleUpdateInvoice(id, 6, 'Invoice sudah dibayarkan')}
                >
                  <FontAwesomeIcon className='text-white' icon={faCheckCircle} fontSize={'13px'} />
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

  const getInvoiceList = async (page: number, pageSize: number, queryparams: any) => {
    const response = await axios.get(
      `${apiUrl}/invoices?order_by=desc&page=${page}&take=${pageSize}${queryparams}`,
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
    setCurrentPage(response?.data?.page ?? 1)
    setTotalData(response?.data?.total ?? 0)

    return response.data.data
  }

  const ViewInvoice = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await getInvoiceList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from getInvoiceList')
        return []
      }

      const invoiceData = apiData.map((item: any) => {
        let data

        const invoiceDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        const invoiceStatus = (status: number) => {
          switch (status) {
            case 1:
              return 'Pengecekan Invoice'
            case 2:
              return 'Invoice Disetujui'
            case 3:
              return 'Invoice Ditolak'
            case 4:
              return 'Menunggu Dokumen Tagihan'
            case 5:
              return 'Invoice Diberikan Kepada Finance'
            case 6:
              return 'Invoice Sudah Dibayarkan'
            default:
              return ''
          }
        }

        data = {
          invoice_id: item?.id,
          invoice_date: invoiceDate,
          vendor_name: item?.vendor?.company_name ?? '-',
          amount: `Rp. ${parseInt(item?.total_amount).toLocaleString('id')}`,
          status: item?.status,
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

  // Selected Row
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setInvoices((prevInvoices) => ({
        ...prevInvoices,
        invoice_id: selectedRowKeys.map((key) => Number(key)),
      }))

      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
  }

  console.log('invoices', invoices)

  // Handle Approve Invoice
  const handleApproveInvoice = async () => {
    setIsLoading(true)
    const formData = new FormData()

    // invoices.invoice_id.forEach((invoice) => {
    //   if (invoice.id !== null) {
    //     formData.append('status', String(2))
    //     formData.append(`invoice_id`, String(invoice.id))
    //   }
    // })

    Swal.fire({
      title: 'Apakah anda yakin akan menyetujui daftar invoice ini?',
      icon: 'question',
      showConfirmButton: true,
      confirmButtonColor: '#6b9230',
      showDenyButton: true,
      confirmButtonText: 'Ya',
      denyButtonText: 'Tidak',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${apiUrl}/invoices/payment`, formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          })
          if (response.data.status === 200 || response.data.status === 201) {
            setIsLoading(false)
            Swal.fire({
              title: 'Success',
              text: 'Success Update Invoice',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            })
          } else {
            setIsLoading(false)
            Swal.fire({
              title: 'Error',
              text: response.data.message,
              icon: 'error',
            })
          }

          window.location.reload()
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
    })
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

  // Decline Invoice
  const [invoiceEvidence, setInvoiceEvidence] = useState<Array<File | null>>([])
  const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState<number | null>(null)
  const [previewInvoice, setPreviewInvoice] = useState<any>()
  const [visibleInvoice, setVisibleInvoice] = useState(false)
  const evidenceRef = useRef<HTMLInputElement>(null)

  const [showModalInvoice, setModalInvoice] = useState(false)
  const handleCloseModalInvoice = () => {
    setModalInvoice(false)
  }

  // Upload Order File Handler
  const handleInvoiceEvidenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files

    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const existingFiles = [...invoiceEvidence]
      const mergedFiles = existingFiles.concat(file)

      const {length: existingFilesLength} = existingFiles
      const {length: fileListLength} = fileList

      for (let i = 0; i < fileListLength; i++) {
        mergedFiles[existingFilesLength + i] = fileList.item(i)
      }

      setInvoiceEvidence(mergedFiles)
    }
  }

  // Click Image
  const handleInvoiceClick = () => {
    const inputField = document.querySelector('.input-field-invoice') as HTMLInputElement
    inputField.click()
  }

  // Handle Remove File
  const handleRemoveFiles = (index: number) => {
    const newEvidances = [...invoiceEvidence]
    newEvidances.splice(index, 1)
    setInvoiceEvidence(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  // File Click
  const handleFileInvoice = (index: number) => {
    setPreviewInvoice(invoiceEvidence[index]?.name)
    setVisibleInvoice(true)
    setSelectedInvoiceIndex(index)
  }

  // Upload Excel
  const [excel, setExcel] = useState<File | null>(null)
  const [showModalUpload, setModalUpload] = useState(false)
  const handleCloseModalUpload = () => {
    setModalUpload(false)
  }

  const handleFileChange = (event: any) => {
    const files = event.fileList
    if (files && files[0]) {
      setExcel(files[0].originFileObj)
    }
  }

  const handleFileRemove = () => {
    setExcel(null)
  }

  const handleDeclineInvoice = async () => {
    const formData = new FormData()

    formData.append(`invoice_id`, invoiceId)
    formData.append(`notes`, invoiceNotes)
    formData.append(`status`, String(3))

    if (invoiceEvidence?.length) {
      invoiceEvidence.forEach((item) => {
        if (item instanceof Blob) {
          formData.append(`invoice_evidences`, item, item.name)
        }
      })
    }

    await axios
      .post(`${apiUrl}/invoices/${invoiceId}`, formData, {
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
            text: 'Berhasil Membatalkan Pembayaran',
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

  const handleUpload = async () => {
    setLoadingUploadExcel(true)

    const formData = new FormData()
    if (excel !== null) {
      formData.append('excel_file', excel)
    }

    await axios
      .post(`${apiUrl}/invoices/upload-excel-invoice`, formData, {
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
            text: 'Berhasil Upload Excel',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          })

          setLoadingUploadExcel(false)
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })

          setLoadingUploadExcel(false)
        }

        window.location.reload()
      })
      .catch((error) => {
        setLoadingUploadExcel(false)
        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
        })
      })
  }

  const handleUploadExcel = () => {
    setModalUpload(true)
  }

  // Export Template Excel
  const exportTemplate = () => {
    setLoadingTemplate(true)

    axios
      .get(`${apiUrl}/invoices/export-excel`, {
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
        link.setAttribute('download', `Invoice.xlsx`)
        document.body.appendChild(link)
        link.click()

        setLoadingTemplate(false)
      })
  }

  // Handle Update Status
  const handleUpdateInvoice = async (id: number, status: number, statusName: string) => {
    const formData = new FormData()
    formData.append('status', String(status))

    const textConfirmation = `Apakah Anda yakin ingin mengubah status invoice ini menjadi ${statusName} ?`

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
        try {
          const response = await axios.post(`${apiUrl}/invoices/${id}`, formData, {
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
              text: 'Berhasil mengubah status Invoice',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            })
            setIsLoading(false)
            navigate('/invoice/view-invoice')
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
            text: error.response?.data?.message || 'Something went wrong',
            icon: 'error',
          })
        }
      }
    })
  }

  return (
    <section id='view-invoice'>
      <div className='card'>
        <div className='card-body table-view-order'>
          <div className='d-flex justify-content-end align-items-center gap-3 mb-5'>
            {/* <button className='button-export' onClick={handleUploadExcel}>
              <h3 className='fs-5 fw-semibold'>
                {loadingUploadExcel ? 'Uploading..' : 'Import Excel'}
              </h3>
            </button> */}

            <button className='button-export' onClick={exportTemplate}>
              <h3 className='fs-5 fw-semibold'>
                {loadingTemplate ? 'Exporting..' : 'Export Excel'}
              </h3>
            </button>
          </div>

          <Row className='table-head-wrapper'>
            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='d-flex mb-2'>
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
              rowSelection={rowSelection}
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

          <div className='d-flex justify-content-center align-items-center mt-3'>
            <Button
              className='d-flex justify-content-center align-items-center'
              variant='dark-success'
              type='submit'
              disabled={isLoading}
              onClick={() => handleApproveInvoice()}
            >
              {isLoading ? 'Approve..' : 'Approve'}
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Upload Excel */}
      <Modal
        dialogClassName='modal-upload-excel'
        centered
        show={showModalUpload}
        onHide={handleCloseModalUpload}
      >
        <Modal.Header closeButton>
          <Modal.Title>Import Excel Invoice</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Dragger
            className='input-excel'
            accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
            multiple={false}
            maxCount={1}
            beforeUpload={() => false}
            onChange={(e) => handleFileChange(e)}
            onRemove={handleFileRemove}
          >
            <p className='ant-upload-drag-icon'>
              <InboxOutlined style={{fontSize: 32}} rev />
            </p>

            <p className='ant-upload-text'>Klik atau seret file ke area ini untuk mengunggah</p>
            <p className='ant-upload-hint text-danger'>Maksimal upload file excel adalah satu</p>
          </Dragger>

          <Button
            className='d-flex justify-content-center align-items-center w-100 mt-5'
            disabled={excel === null}
            onClick={handleUpload}
            variant='primary'
          >
            {loadingUploadExcel ? 'Uploading..' : 'Upload Excel'}
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal Tolak Invoice */}
      <Modal
        dialogClassName='modal-upload-excel'
        centered
        show={showModalInvoice}
        onHide={handleCloseModalInvoice}
      >
        <Modal.Header closeButton>
          <Modal.Title>Formulir Alasan Penolakan Invoice</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className='notes mb-5'>
            <Form.Group>
              <Form.Label className='fs-5 fw-bold'>Alasan Ditolak :</Form.Label>
              <Form.Control
                style={{minHeight: '140px'}}
                as='textarea'
                onChange={(e) => setInvoiceNotes(e.target.value)}
                value={invoiceNotes}
              />
            </Form.Group>
          </Row>

          <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
            <Form.Group>
              <Form.Label>Upload File</Form.Label>

              <Form className='form-input-image' onClick={handleInvoiceClick}>
                <Form.Control
                  type='file'
                  accept='image/jpeg, image/png'
                  className='input-field-invoice'
                  multiple
                  hidden
                  id='file-input'
                  ref={evidenceRef}
                  onChange={handleInvoiceEvidenceChange}
                />

                <div className='input-image-text'>
                  <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                  <p>Add File</p>
                </div>
              </Form>

              <ListGroup className='pt-3'>
                {invoiceEvidence.length ? (
                  invoiceEvidence.map((item: any, index: number) => (
                    <ListGroup>
                      <ListGroup.Item
                        className='d-flex justify-content-between align-items-center'
                        key={`${item?.name}-${index}-${item?.type}`}
                      >
                        <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                        <span
                          className='upload-content'
                          style={{cursor: 'pointer'}}
                          onClick={() => handleFileInvoice(index)}
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

                      {selectedInvoiceIndex === index && item && (
                        <Image
                          key={`${previewInvoice} - ${index}`}
                          width={200}
                          style={{display: 'none'}}
                          src={
                            item instanceof File
                              ? URL.createObjectURL(item)
                              : `${apiUrl}/public/invoices/${previewInvoice}`
                          }
                          preview={{
                            visible: visibleInvoice,
                            src:
                              item instanceof File
                                ? URL.createObjectURL(item)
                                : `${apiUrl}/public/invoices/${previewInvoice}`,
                            onVisibleChange: (value) => {
                              setVisibleInvoice(value)
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
            onClick={handleDeclineInvoice}
            variant='primary'
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal>
    </section>
  )
}

export {ViewInvoiceHO}
