/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { vendorRegistrationService } from '../../../services/vendorRegistrationService'
import Select, {SingleValue} from 'react-select'
import Swal from 'sweetalert2'
import {Table, Spin, Pagination, PaginationProps} from 'antd'
import {Row, Form, OverlayTrigger, Tooltip, FormGroup, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {LoadingOutlined} from '@ant-design/icons'
import {faSearch, faFileAlt, faCheckCircle, faTimes, faHistory} from '@fortawesome/free-solid-svg-icons'
import './ViewVendorRegistration.css'

import type {ColumnsType} from 'antd/es/table'

interface VendorRegistration {
  id: number
  company_name: string
  address: string
  phone_number: string
  email_address: string
  pic_name: string
  pic_email: string
  pic_phone: string
  ktp_number: string | null
  npwp_number: string | null
  bank_id: number | null
  service_types: number[]
  areas: number[]
  status: number
  rejection_reason: string | null
  notes: string | null
  created_at: string
  bank?: {
    id: number
    bank_name: string
  }
}

const ViewVendorRegistration: React.FC = () => {
  const navigate = useNavigate()

  const statusConfig: Record<number, {label: string; className: string}> = {
    1: {label: 'Menunggu Approve', className: 'status-badge-pending'},
    2: {label: 'Proses Pitching', className: 'status-badge-pitching'},
    3: {label: 'Disetujui', className: 'status-badge-approved'},
    4: {label: 'Ditolak', className: 'status-badge-rejected'},
  }

  const statusTabs = [
    {value: undefined, label: 'Semua', countKey: 'total'},
    {value: 1, label: 'Menunggu Approve', countKey: 'menunggu_approve'},
    {value: 2, label: 'Proses Pitching', countKey: 'proses_pitching'},
    {value: 3, label: 'Disetujui', countKey: 'disetujui'},
    {value: 4, label: 'Ditolak', countKey: 'ditolak'},
  ]

  // Loading state
  const [loadData, setLoadData] = useState<boolean>(true)

  // Table State
  const [vendorData, setVendorData] = useState<VendorRegistration[]>([])
  const [totalData, setTotalData] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [stats, setStats] = useState<Record<string, number>>({})

  // Filter State
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined)

  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay)
      return () => clearTimeout(handler)
    }, [value, delay])
    return debouncedValue
  }

  const debouncedSearch = useDebounce(searchFilter, 500)

  // Pagination
  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page)
    if (size) {
      setPageSize(size)
    }
  }

  // Table columns
  const columns: ColumnsType<VendorRegistration> = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
      width: 60,
      render: (text: any, record: any, index: number) => {
        return (currentPage - 1) * pageSize + index + 1
      },
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 70,
    },
    {
      title: 'Nama Perusahaan',
      dataIndex: 'company_name',
      key: 'company_name',
      align: 'left',
      width: 180,
    },
    {
      title: 'Nama PIC',
      dataIndex: 'pic_name',
      key: 'pic_name',
      align: 'left',
      width: 130,
    },
    {
      title: 'Email PIC',
      dataIndex: 'pic_email',
      key: 'pic_email',
      align: 'left',
      width: 180,
    },
    {
      title: 'Telepon',
      dataIndex: 'pic_phone',
      key: 'pic_phone',
      align: 'left',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 110,
      render: (status: number) => {
        const currentStatus = statusConfig[status] || {
          label: 'Unknown',
          className: 'status-badge-unknown',
        }

        return (
          <span className={`status-badge fw-semibold ${currentStatus.className}`}>
            {currentStatus.label}
          </span>
        )
      },
    },
    {
      title: 'Tanggal Daftar',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      width: 150,
      render: (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      },
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      align: 'center',
      width: 150,
      render: (record) => {
        const id = record.id

        return (
          <div className='button-wrapper d-flex justify-content-center align-items-center gap-2'>
            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={<Tooltip id={`tooltip-detail-${id}`}>Detail</Tooltip>}
            >
              <a
                href='#'
                className='btn btn-icon btn-sm btn-light-primary rounded action-button shadow-none'
                onClick={(e) => {
                  e.preventDefault()
                  navigate(`/vendor-registration/approval/${id}`)
                }}
              >
                <FontAwesomeIcon icon={faFileAlt} fontSize={'13px'} />
              </a>
            </OverlayTrigger>

            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={<Tooltip id={`tooltip-history-${id}`}>Histori</Tooltip>}
            >
              <a
                href='#'
                className='btn btn-icon btn-sm btn-light-primary rounded action-button shadow-none'
                onClick={(e) => {
                  e.preventDefault()
                  navigate(`/vendor-registration/history/${id}`)
                }}
              >
                <FontAwesomeIcon icon={faHistory} fontSize={'13px'} />
              </a>
            </OverlayTrigger>

            {(record.status === 1 || record.status === 2) && (
              <>
                <OverlayTrigger
                  placement='bottom'
                  delay={{show: 250, hide: 400}}
                  overlay={<Tooltip id={`tooltip-reject-${id}`}>Tolak</Tooltip>}
                >
                  <a
                    href='#'
                    className='btn btn-icon btn-sm btn-danger rounded action-button shadow-none'
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(`/vendor-registration/approval/${id}?action=reject`)
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} fontSize={'13px'} />
                  </a>
                </OverlayTrigger>

                <OverlayTrigger
                  placement='bottom'
                  delay={{show: 250, hide: 400}}
                  overlay={
                    <Tooltip id={`tooltip-approve-${id}`}>
                      {record.status === 1 ? 'Proses Pitching' : 'Setujui Final'}
                    </Tooltip>
                  }
                >
                  <a
                    href='#'
                    rel='noopener noreferrer'
                    className='btn btn-icon btn-sm btn-primary rounded action-button shadow-none'
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(`/vendor-registration/approval/${id}?action=approve`)
                    }}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} fontSize={'13px'} />
                  </a>
                </OverlayTrigger>
              </>
            )}
          </div>
        )
      },
    },
  ]

  // Fetch data
  const fetchData = async (page: number, pageSize: number, search: string) => {
    setLoadData(true)
    try {
      const params: any = {
        page: page,
        take: pageSize,
      }

      if (search) {
        params.search = search
      }
      if (statusFilter !== undefined) {
        params.status = statusFilter
      }

      const response = await vendorRegistrationService.getAll(params)

      setVendorData(response.data?.data || [])
      setTotalData(response.data?.meta?.total || 0)
    } catch (error) {
      console.error('Error fetching data:', error)
      Swal.fire({
        title: 'Error',
        text: 'Gagal mengambil data',
        icon: 'error',
      })
    } finally {
      setLoadData(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await vendorRegistrationService.getStats()
      const data = response.data?.data ?? response.data ?? {}
      setStats({
        ...data,
        total:
          (data.menunggu_approve || 0) +
          (data.proses_pitching || 0) +
          (data.disetujui || 0) +
          (data.ditolak || 0),
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Initial fetch and debounce search
  useEffect(() => {
    fetchData(currentPage, pageSize, debouncedSearch)
  }, [currentPage, pageSize, debouncedSearch, statusFilter])

  useEffect(() => {
    fetchStats()
  }, [])

  // Handle filter submit
  const handleSubmitFilter = () => {
    setLoadingButton(true)
    fetchData(1, pageSize, debouncedSearch)
    setCurrentPage(1)
    setLoadingButton(false)
  }

  const handleChangeSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(e.target.value)
  }

  const handleStatusChange = (newValue: SingleValue<{value: number; label: string}>) => {
    setStatusFilter(newValue?.value)
    setCurrentPage(1)
  }

  const statusOptions = [
    {value: 1, label: 'Menunggu Approve'},
    {value: 2, label: 'Proses Pitching'},
    {value: 3, label: 'Disetujui'},
    {value: 4, label: 'Ditolak'},
  ]

  return (
    <section id='view-vendor-registration'>
      <div className='card'>
        <div className='card-body'>
          <div className='vendor-registration-status-tabs'>
            {statusTabs.map((tab) => {
              const isActive = statusFilter === tab.value
              return (
                <button
                  key={tab.label}
                  type='button'
                  className={`status-tab ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setStatusFilter(tab.value)
                    setCurrentPage(1)
                  }}
                >
                  <span>{tab.label}</span>
                  <strong>{stats[tab.countKey] ?? 0}</strong>
                </button>
              )
            })}
          </div>

          <Row className='table-head-wrapper'>
            <div className='d-flex flex-column flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row align-items-start align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center justify-content-start gap-3'>
              <div className='filter-search'>
                <FormGroup>
                  <Form.Control
                    placeholder='Search'
                    className='filter-ltr'
                    onChange={handleChangeSearchFilter}
                    value={searchFilter}
                  />
                  <span className='search-icon'>
                    <FontAwesomeIcon icon={faSearch} className='text-black' size='sm' />
                  </span>
                </FormGroup>
              </div>

              <Select
                name='status'
                className='form-control p-0'
                classNamePrefix='select'
                placeholder='Pilih Status'
                options={statusOptions}
                isSearchable={false}
                isClearable={true}
                onChange={handleStatusChange}
              />

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
                className='table-striped-rows vendor-registration-table'
                bordered
                columns={columns}
                dataSource={vendorData}
                rowKey={(record) => record.id}
                pagination={false}
                sticky={true}
                tableLayout='auto'
                scroll={{x: 'max-content'}}
              />
            </div>
          </Spin>

          <div className='pagination-container mt-5'>
            <span className='total-text'>
              Showing {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, totalData)} of {totalData} Pendaftaran
            </span>

            <Pagination
              className='pagination'
              pageSize={pageSize}
              current={currentPage}
              total={totalData}
              showSizeChanger
              pageSizeOptions={[5, 10, 20, 50, 100]}
              itemRender={itemRender}
              onChange={(page, pageSize) => {
                handlePageChange(page, pageSize)
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export {ViewVendorRegistration}
