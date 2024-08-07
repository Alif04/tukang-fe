/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './ViewTukang.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import type {ColumnsType} from 'antd/es/table'
import {Table, PaginationProps, Pagination, Spin, DatePicker} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
import {Form, InputGroup, Row, Col, Button, OverlayTrigger, Tooltip, Card} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faPen,
  faSearch,
  faTrash,
  faCircleXmark,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

interface DataType {
  no: number
  tukang_id: number
  full_name: string
  email: string
  phone_number: number
  keahlian: string
  area: string
  status: string
  is_active: boolean
  is_active_label: string
  deleted_at: string
}

const ViewTukangVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const userRole = localStorage.getItem('userRole')
  const vendorId = localStorage.getItem('vendor_id')

  const [loadingButton, setLoadingButton] = useState(false)
  const [loadData, setLoadData] = useState<boolean>(true)
  const [loadingExport, setLoadingExport] = useState<boolean>(false)

  const [tukangData, setTukangData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [searchFilter, setSearchFilter] = useState<string>('')
  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')

  // Handle Change Search Filter
  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  // Fetch Data
  const fetchTukangList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/tukang?order_by=desc&page=${page}&take=${pageSize}&vendor_id=${vendorId}${queryparams}`

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
      setTotalData(response?.data?.countTotal ?? 0)
      setLoadData(false)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewTukang = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchTukangList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetchTukangList')
        return []
      }

      const tukangData = apiData.map((item: any, index: number) => {
        let data

        const BirthOfDay = new Date(item?.bod).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        const tukangService =
          item?.tukang_service && item.tukang_service.length > 0
            ? Array.from(
                new Set(
                  item.tukang_service.map(
                    (tukang_service: any) => tukang_service?.service_type?.service_type
                  )
                )
              ).join(', ')
            : 'Keahlian belum didaftarkan'

        const tukangArea =
          item?.tukang_area && item.tukang_area.length > 0
            ? Array.from(
                new Set(item.tukang_area.map((tukang_area: any) => tukang_area?.area?.area))
              ).join(', ')
            : 'Area belum didaftarkan'

        data = {
          no: index + 1,
          tukang_id: item?.id ?? '-',
          full_name: item?.full_name ?? '-',
          email: item?.email ?? '-',
          phone_number: item?.phone_number ?? '-',
          address: item?.address ?? '-',
          birth_day: BirthOfDay,
          ktp: item?.ktp_number ?? '-',
          keahlian: tukangService,
          area: tukangArea,
          status: item.deleted_at === null ? 'ACTIVE' : 'NON ACTIVE',
          is_active: item.is_acive === true ? 1 : 0,
          is_active_label: item.is_active === true ? 'AVAILABLE' : 'NON AVAILABLE',
          deleted_at: item.deleted_at,
        }

        return data
      })

      return tukangData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewTukang(page, pageSize, queryparams)
    setTukangData(data)
  }

  useEffect(() => {
    fetchData(1, 10, '')
  }, [])

  const renderTooltip = (title: string) => <Tooltip id='button-tooltip'>{title}</Tooltip>

  const columns: ColumnsType<DataType> = [
    {
      title: 'No. ',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
      sorter: (a, b) => a.no - b.no,
    },
    {
      title: 'Nama Tukang',
      dataIndex: 'full_name',
      key: 'full_name',
      align: 'left',
      onFilter: (value, record) => record.full_name.includes(String(value)),
      sorter: (a, b) => a.full_name.length - b.full_name.length,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'left',
      onFilter: (value, record) => record.email.includes(String(value)),
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: 'No. Handphone',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'left',
      sorter: (a, b) => a.phone_number - b.phone_number,
    },
    {
      title: 'Keahlian',
      dataIndex: 'keahlian',
      key: 'keahlian',
      align: 'left',
      width: 150,
    },
    {
      title: 'Area',
      dataIndex: 'area',
      key: 'area',
      align: 'left',
      width: 150,
    },
    {
      title: 'Availbility',
      dataIndex: 'is_active_label',
      key: 'is_active_label',
      align: 'left',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'left',
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      align: 'center',
      render: (record) => {
        const id = record.tukang_id
        const isAvailable = record.is_active
        const isActive = record.deleted_at

        const handleDetailId = () => {
          navigate(`/tukang/detail-tukang/${id}`)
        }

        const handleUpdateId = () => {
          navigate(`/tukang/update-tukang/${id}`)
        }

        const handleActive = () => {
          Swal.fire({
            title: `Apakah anda yakin akan mengaktifkan tukang ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Tidak',
          })
            .then((willActive) => {
              const formData = new FormData()

              formData.append('is_delete', String(0))
              formData.append('is_active', isAvailable)

              if (willActive.value) {
                axios
                  .post(`${apiUrl}/tukang/${id}`, formData, {
                    headers: {
                      Accept: 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                      'Access-Control-Allow-Origin': '*',
                      'ngrok-skip-browser-warning': 'true',
                    },
                  })
                  .then((response) => {
                    Swal.fire({
                      title: 'Success',
                      text: 'Berhasil mengaktifkan tukang',
                      icon: 'success',
                      showConfirmButton: false,
                    }).then(() => {
                      window.location.reload()
                    })
                  })
                  .catch((error) => {
                    Swal.fire({
                      title: 'Error',
                      text: error.response.data.message,
                      icon: 'error',
                    })
                  })
              }
            })
            .catch((error) => {
              Swal.fire({
                title: 'Error',
                text: error.response.data.message,
                icon: 'error',
              })
            })
        }

        const handleNonActive = () => {
          Swal.fire({
            title: `Apakah anda yakin akan menonaktifkan tukang ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Tidak',
          })
            .then((willNonActive) => {
              const formData = new FormData()

              formData.append('is_delete', String(1))
              formData.append('is_active', isAvailable)

              if (willNonActive.value) {
                axios
                  .post(`${apiUrl}/tukang/${id}`, formData, {
                    headers: {
                      Accept: 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                      'Access-Control-Allow-Origin': '*',
                      'ngrok-skip-browser-warning': 'true',
                    },
                  })
                  .then((response) => {
                    Swal.fire({
                      title: 'Success',
                      text: 'Berhasil menonaktifkan tukang',
                      icon: 'success',
                      showConfirmButton: false,
                    }).then(() => {
                      window.location.reload()
                    })
                  })
                  .catch((error) => {
                    Swal.fire({
                      title: 'Error',
                      text: error.response.data.message,
                      icon: 'error',
                    })
                  })
              }
            })
            .catch((error) => {
              Swal.fire({
                title: 'Error',
                text: error.response.data.message,
                icon: 'error',
              })
            })
        }

        const handleDeleteId = () => {
          Swal.fire({
            title: `Apakah anda yakin akan menghapus data Tukang ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Cancel',
          })
            .then((willDelete) => {
              if (willDelete.value) {
                axios
                  .post(`${apiUrl}/tukang/${id}`, {
                    headers: {
                      Accept: 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                      'Access-Control-Allow-Origin': '*',
                      'ngrok-skip-browser-warning': 'true',
                    },
                  })
                  .then((response) => {
                    Swal.fire({
                      title: 'Success',
                      text: 'Berhasil menghapus data tukang',
                      icon: 'success',
                      showConfirmButton: false,
                    }).then(() => {
                      window.location.reload()
                    })
                  })
                  .catch((error) => {
                    Swal.fire({
                      title: 'Error',
                      text: error.response.data.message,
                      icon: 'error',
                    })
                  })
              }
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
          <div
            className={
              userRole === 'Admin HO' || userRole === 'Super User'
                ? 'button-wrapper justify-content-center gap-1'
                : 'button-wrapper justify-content-between gap-1'
            }
          >
            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Detail Tukang')}
            >
              <Button variant='primary' className='button-detail' onClick={handleDetailId}>
                <FontAwesomeIcon className='text-white' icon={faBook} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>

            {!['Super User', 'Admin HO'].includes(userRole ?? '') && (
              <>
                <OverlayTrigger
                  placement='bottom'
                  delay={{show: 250, hide: 400}}
                  overlay={renderTooltip('Edit Tukang')}
                >
                  <Button variant='primary' className='button-edit' onClick={handleUpdateId}>
                    <FontAwesomeIcon className='text-white' icon={faPen} fontSize={'13px'} />
                  </Button>
                </OverlayTrigger>

                {isActive !== null && (
                  <OverlayTrigger
                    placement='bottom'
                    delay={{show: 250, hide: 400}}
                    overlay={renderTooltip('Aktifkan Tukang')}
                  >
                    <Button className='button-active' variant='success' onClick={handleActive}>
                      <FontAwesomeIcon
                        className='text-white'
                        icon={faCircleCheck}
                        fontSize={'13px'}
                      />
                    </Button>
                  </OverlayTrigger>
                )}

                {isActive === null && (
                  <OverlayTrigger
                    placement='bottom'
                    delay={{show: 250, hide: 400}}
                    overlay={renderTooltip('Non Aktif Tukang')}
                  >
                    <Button className='button-disable' variant='danger' onClick={handleNonActive}>
                      <FontAwesomeIcon
                        className='text-white'
                        icon={faCircleXmark}
                        fontSize={'13px'}
                      />
                    </Button>
                  </OverlayTrigger>
                )}

                <OverlayTrigger
                  placement='bottom'
                  delay={{show: 250, hide: 400}}
                  overlay={renderTooltip('Delete Tukang')}
                >
                  <Button className='button-delete' variant='danger' onClick={handleDeleteId}>
                    <FontAwesomeIcon className='text-white' icon={faTrash} fontSize={'13px'} />
                  </Button>
                </OverlayTrigger>
              </>
            )}
          </div>
        )
      },
    },
  ]

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
    setLoadingExport(true)

    axios
      .get(`${apiUrl}/tukang/export-excel?take=0`, {
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
        link.setAttribute('download', `Data Tukang.xlsx`)
        document.body.appendChild(link)
        link.click()
        setLoadingExport(false)
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

    const data = await ViewTukang(1, 10, queryparams)
    setTukangData(data)

    setLoadingButton(false)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubmitFilter()
    }
  }

  return (
    <section id='view-tukang'>
      <Card>
        <Card.Body className='table-view-order'>
          <div className='d-flex justify-content-end'>
            <button className='button-export' onClick={exportToExcel}>
              <h3 className='fs-5 fw-semibold'>{loadingExport ? 'Exporting..' : 'Export Excel'}</h3>
            </button>
          </div>

          <Row className='table-head-wrapper' onKeyDown={handleKeyPress}>
            <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
              <Form.Group as={Row}>
                <Form.Label className='fs-6' column sm='3'>
                  Join Date :
                </Form.Label>

                <Col sm='9'>
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
              </Form.Group>
            </Col>

            <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
              <div className='filter-search w-100'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control
                    placeholder='Cari Nama Tukang atau Email'
                    className='filter-ltr'
                    onChange={handleChangeSearchFilter}
                  />
                </InputGroup>
              </div>
            </Col>

            <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
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
              dataSource={tukangData}
              rowKey={(record) => record.tukang_id}
              pagination={false}
              tableLayout='auto'
              scroll={{x: 'max-content'}}
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
                Showing {range[0]} - {range[1]} of {total} Total Tukang
              </span>
            )}
          />
        </Card.Body>
      </Card>
    </section>
  )
}

export {ViewTukangVendor}
