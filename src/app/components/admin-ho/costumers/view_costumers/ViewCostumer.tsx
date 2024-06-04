/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './ViewCostumer.css'

import * as XLSX from 'xlsx'
import axios from 'axios'
import Swal from 'sweetalert2'
import type {ColumnsType} from 'antd/es/table'
import {Table, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
import {Row, Col, Form, InputGroup, Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faFileExcel, faSearch, faPen} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface DataType {
  number: number
  store_name: string
  costumer_id: number
  member_number: number
  full_name: string
  phone_number: number
  email_address: string
  customer_since: Date
  total_order: number
  // total_spend: number
  // total_complaint: number
  // total_cis_score: number
  // status: string
}

const ViewCostumerHO: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loadingExport, setLoadingExport] = useState<boolean>(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [memberData, setMemberData] = useState<DataType[]>([])
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
      title: 'Nomor Urut',
      dataIndex: 'number',
      key: 'number',
      align: 'center',
      sorter: (a, b) => a.number - b.number,
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
      title: 'Nomor Member',
      dataIndex: 'member_number',
      key: 'member_number',
      align: 'center',
      sorter: (a, b) => a.member_number - b.member_number,
    },
    {
      title: 'Nama Customer',
      dataIndex: 'full_name',
      key: 'full_name',
      onFilter: (value, record) => record.full_name.includes(String(value)),
      sorter: (a, b) => a.full_name.length - b.full_name.length,
    },
    {
      title: 'Nomor HP/WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      sorter: (a, b) => a.phone_number - b.phone_number,
    },
    {
      title: 'Email Address',
      dataIndex: 'email_address',
      key: 'email_address',
      onFilter: (value, record) => record.email_address.includes(String(value)),
      sorter: (a, b) => a.email_address.length - b.email_address.length,
    },
    {
      title: 'Join Date',
      dataIndex: 'customer_since',
      key: 'customer_since',
      align: 'center',
      sorter: (a, b) => new Date(a.customer_since).getTime() - new Date(b.customer_since).getTime(),
    },
    {
      title: 'Total Order',
      dataIndex: 'total_order',
      key: 'total_order',
      align: 'center',
      sorter: (a, b) => a.total_order - b.total_order,
    },
    // {
    //   title: 'Total Value',
    //   dataIndex: 'total_spend',
    //   key: 'total_spend',
    //   sorter: (a, b) => a.total_spend - b.total_spend,
    // },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    // },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (record) => {
        const handleDetail = () => {
          const id = record.costumer_id
          navigate(`/costumers/detail-costumers/${id}`)
        }

        const handleUpdate = () => {
          const id = record.costumer_id
          navigate(`/costumers/update-costumers/${id}`)
        }

        return (
          <div className='d-flex justify-content-center gap-4'>
            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Detail Member')}
            >
              <Button variant='primary' className='button-detail' onClick={handleDetail}>
                <FontAwesomeIcon className='text-white' icon={faBook} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Edit Member')}
            >
              <Button variant='primary' className='button-edit' onClick={handleUpdate}>
                <FontAwesomeIcon className='text-white' icon={faPen} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>
          </div>
        )
      },
    },
  ]

  const fetchMemberList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/member?order_by=desc&page=${page}&take=${pageSize}${queryparams}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = response.data.data

      setCurrentPage(response?.data?.page ?? 1)
      setTotalData(data.length)
      setLoadData(false)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewMember = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await fetchMemberList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from fetch member')
        return []
      }

      const memberData = apiData.map((item: any, index: number) => {
        let data

        const joinDate = new Date(item?.join_date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        const phoneNumber = item.phone_number !== 'null' ? item.phone_number : item.whatsapp_number
        const totalOrder = item?.order.length ?? 0

        data = {
          number: index + 1,
          store_name: item?.join_location_store?.store_name ?? '-',
          costumer_id: item.id,
          member_number: item.member_number,
          full_name: item.full_name,
          phone_number: phoneNumber,
          email_address: item?.email ?? '-',
          customer_since: joinDate,
          total_order: totalOrder,
          // total_spend: item?.total_spend ?? '-',
          // total_complaint: item?.total_complaint ?? '-',
          // total_cis_score: item?.total_cis_score ?? '-',
          // status: item?.is_active === true ? 'ACTIVE' : '-',
        }

        return data
      })

      return memberData
    } catch (error) {
      console.error('Error getting member list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewMember(page, pageSize, queryparams)
    setMemberData(data)
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

    const data = await ViewMember(1, 10, queryparams)
    setMemberData(data)

    setLoadingButton(false)
  }

  // Export To Excel
  const exportToExcel = () => {
    if (memberData.length === 0) {
      Swal.fire('Warning', 'Belum ada data yang dapat di export', 'warning')
      return
    }

    setLoadingExport(true)

    axios
      .get(`${apiUrl}/members/export-excel?take=0`, {
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
        link.setAttribute('download', `Data Member.xlsx`)
        document.body.appendChild(link)
        link.click()

        setLoadingExport(false)
      })
  }

  return (
    <section id='view-costumer'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <Row>
            <div className='d-flex justify-content-end'>
              <button className='button-export' onClick={exportToExcel}>
                <h3 className='fs-5 fw-semibold'>
                  {loadingExport ? 'Exporting..' : 'Export To Excel'}
                </h3>
              </button>
            </div>
          </Row>

          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
              <div className='d-flex align-items-center me-3'>
                <h3 className='fs-5 fw-normal'>Join Date</h3>
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

            <Col xs={12} md={12} lg={12} xl={4} xxl={4}>
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

            <Col xs={12} md={12} lg={12} xl={4} xxl={4}>
              <div className='d-flex justify-content-between'>
                <Button
                  className='btn-dark-primary button-submit'
                  disabled={loadingButton}
                  onClick={handleSubmitFilter}
                >
                  {loadingButton ? 'Filtering..' : 'Submit'}
                </Button>
              </div>
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
              dataSource={memberData}
              rowKey={(record) => record.costumer_id}
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
                Showing {range[0]} - {range[1]} of {total} Total Member
              </span>
            )}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewCostumerHO}
