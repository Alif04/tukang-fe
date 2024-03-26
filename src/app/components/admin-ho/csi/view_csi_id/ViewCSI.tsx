/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './ViewCSI.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import {Table, PaginationProps} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch, faFilter} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
}

interface DataType {
  index: number
  id: number
  store_name: string
  vendor_name: string
  member_id: number
  member_name: string
  member_email: string
  performance_rate: string
  delivery_rate: string
  invoicing_rate: string
  cs_rate: string
  knowledge_rate: string
  notes: string
}

interface StoreSelect {
  value: number | null
  label: string
}

interface VendorSelect {
  value: number | null
  label: string
}

interface MemberSelect {
  value: number | null
  label: string
}

const ViewCSIHO: React.FC<Props> = ({className}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()

  const [csiData, setCsiData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const [store, setStore] = useState<StoreSelect[]>([])
  const [vendor, setVendor] = useState<VendorSelect[]>([])
  const [member, setMember] = useState<MemberSelect[]>([])

  const storeOptions = [{value: null, label: 'All Store'}, ...store]
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreSelect>>({
    value: null,
    label: 'All Store',
  })

  const vendorOptions = [{value: null, label: 'All Vendor'}, ...vendor]
  const [selectedVendor, setSelectedVendor] = useState<SingleValue<VendorSelect>>({
    value: null,
    label: 'All Vendor',
  })

  const memberOptions = [{value: null, label: 'All Member'}, ...member]
  const [selectedMember, setSelectedMember] = useState<SingleValue<MemberSelect>>({
    value: null,
    label: 'All Member',
  })

  // Handle Change Search Filter
  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: 90,
      className: 'col_order_id',
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: 'Nama Toko',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.store_name.includes(String(value)),
      sorter: (a, b) => a.store_name.length - b.store_name.length,
    },
    {
      title: 'Nama Vendor',
      dataIndex: 'vendor_name',
      key: 'vendor_name',
      align: 'center',
      width: 120,
      onFilter: (value, record) => record.vendor_name.includes(String(value)),
      sorter: (a, b) => a.vendor_name.length - b.vendor_name.length,
    },
    {
      title: 'No Member',
      dataIndex: 'member_id',
      key: 'member_id',
      align: 'center',
      width: 110,
      sorter: (a, b) => a.member_id - b.member_id,
    },
    {
      title: 'Nama Member',
      dataIndex: 'member_name',
      key: 'member_name',
      align: 'left',
      width: 130,
      onFilter: (value, record) => record.member_name.includes(String(value)),
      sorter: (a, b) => a.member_name.length - b.member_name.length,
    },
    {
      title: 'Email Member',
      dataIndex: 'member_email',
      key: 'member_email',
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.member_email.includes(String(value)),
      sorter: (a, b) => a.member_email.length - b.member_email.length,
    },
    {
      title: 'Performance Rate',
      dataIndex: 'performance_rate',
      key: 'performance_rate',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.performance_rate.includes(String(value)),
      sorter: (a, b) => a.performance_rate.length - b.performance_rate.length,
    },
    {
      title: 'Delivery Rate',
      dataIndex: 'delivery_rate',
      key: 'delivery_rate',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.delivery_rate.includes(String(value)),
      sorter: (a, b) => a.delivery_rate.length - b.delivery_rate.length,
    },
    {
      title: 'Invoicing Rate',
      dataIndex: 'invoicing_rate',
      key: 'invoicing_rate',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.invoicing_rate.includes(String(value)),
      sorter: (a, b) => a.invoicing_rate.length - b.invoicing_rate.length,
    },
    {
      title: 'Customer Service Rate',
      dataIndex: 'cs_rate',
      key: 'cs_rate',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.cs_rate.includes(String(value)),
      sorter: (a, b) => a.cs_rate.length - b.cs_rate.length,
    },
    {
      title: 'Knowledge Rate',
      dataIndex: 'knowledge_rate',
      key: 'knowledge_rate',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.knowledge_rate.includes(String(value)),
      sorter: (a, b) => a.knowledge_rate.length - b.knowledge_rate.length,
    },
    {
      title: 'Catatan Tambahan',
      dataIndex: 'notes',
      key: 'notes',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.notes.includes(String(value)),
      sorter: (a, b) => a.notes.length - b.notes.length,
    },
  ]

  const getCSI = async (page: number, pageSize: number) => {
    try {
      const memberId =
        selectedMember && selectedMember.value ? `&member_id=${selectedMember.value}` : ''

      const storeId = selectedStore && selectedStore.value ? `&storeId=${selectedStore.value}` : ''

      const vendorId =
        selectedVendor && selectedVendor.value ? `&vendor_id=${selectedVendor.value}` : ''

      const response = await axios.get(
        `${apiUrl}/csi/${params.id}?search=${searchFilter}&date_from=${dateFrom}&date_to=${dateTo}&page=${page}&take=${pageSize}${storeId}${vendorId}${memberId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      setCurrentPage(response.data.page)
      setTotalData(response.data.takeTotal)

      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewCSI = async (page: number, pageSize: number) => {
    try {
      const apiData = await getCSI(page, pageSize)

      if (!apiData) {
        console.error('No data received from csi data')
        return []
      }

      const csiData = apiData?.csi_answers.map((item: any, index: number) => {
        let data

        const jsonData = JSON.parse(item.data)

        data = {
          index: index + 1,
          id: item.id,
          store_name: jsonData['Nama Toko'],
          vendor_name: jsonData['Nama Vendor yang menangani'],
          member_id: jsonData['Member ID'],
          member_name: jsonData['Nama Member'],
          member_email: jsonData['Email Address'],
          performance_rate:
            jsonData[
              'Performance : Apakah tehnisi/tukang melakukan pekerjaan sesuai dengan spesifikasi yang diharuskan ?'
            ],
          delivery_rate: jsonData['Delivery : Apakah pengiriman barang tepat waktu ?'],
          invoicing_rate:
            jsonData['Invoicing : Bagaimana harga final dibandingan dengan budget? apakah sesuai?'],
          cs_rate:
            jsonData['Customer Service : Bagaimana tehnisi/tukang kami menjawab pertanyaan?'],
          knowledge_rate:
            jsonData['Knowledge : Seberapa dalamkan pengetahuan tehnisi/Tukang kami?'],
          notes: jsonData['Catatan Tambahan'],
        }
        return data
      })

      return csiData
    } catch (error) {
      console.error('Error getting csi list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewCSI(page, pageSize)
    setCsiData(data)
  }

  useEffect(() => {
    fetchData(1, 10)
  }, [
    dateFrom,
    dateTo,
    searchFilter,
    selectedStore?.label,
    selectedVendor?.label,
    selectedMember?.label,
  ])

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

  useEffect(() => {
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

        if (Array.isArray(response.data.data.data)) {
          const tempStore = response.data.data.data.map((item: any) => ({
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

    const getVendor = async () => {
      try {
        const response = await axios.get(`${apiUrl}/vendor`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempVendor = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.company_name,
          }))

          setVendor(tempVendor)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const getMember = async () => {
      try {
        const response = await axios.get(`${apiUrl}/member`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        if (Array.isArray(response.data.data)) {
          const tempMember = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.full_name,
          }))

          setMember(tempMember)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getStore()
    getVendor()
    getMember()
  }, [])

  return (
    <section id='view-csi'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
              <div className='d-flex align-items-center me-3'>
                <FontAwesomeIcon icon={faFilter} size='2xl' className='me-2' />
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

            <Col xs={12} md={12} lg={12} xl={8} xxl={8}>
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
          </Row>

          <Row className='mb-3'>
            <Col>
              <Row>
                <Col md={4}>
                  <Form.Label>Filter By Store :</Form.Label>
                </Col>

                <Col md={8}>
                  <Select
                    name='store'
                    className='form-control p-0'
                    placeholder='Pilih/Ketik Nama Store'
                    isSearchable={true}
                    isClearable={true}
                    options={storeOptions}
                    onChange={(newValue) => setSelectedStore(newValue)}
                  />
                </Col>
              </Row>
            </Col>

            <Col>
              <Row>
                <Col md={4}>
                  <Form.Label>Filter By Vendor :</Form.Label>
                </Col>

                <Col md={8}>
                  <Select
                    name='vendor'
                    className='form-control p-0'
                    placeholder='Pilih/Ketik Nama Vendor'
                    isSearchable={true}
                    isClearable={true}
                    options={vendorOptions}
                    onChange={(newValue) => setSelectedVendor(newValue)}
                  />
                </Col>
              </Row>
            </Col>

            <Col>
              <Row>
                <Col md={4}>
                  <Form.Label>Filter By Members :</Form.Label>
                </Col>

                <Col md={8}>
                  <Select
                    name='member'
                    className='form-control p-0'
                    placeholder='Pilih/Ketik Nama Member'
                    isSearchable={true}
                    isClearable={true}
                    options={memberOptions}
                    onChange={(newValue) => setSelectedMember(newValue)}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={csiData}
            rowKey={(record) => record.id}
            scroll={{x: 1600}}
            pagination={{
              position: ['bottomRight'],
              current: currentPage,
              total: totalData,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50, 100],
              onChange: (page, pageSize) => {
                fetchData(page, pageSize)
              },
              itemRender: itemRender,
              showTotal: (total, range) => (
                <span style={{left: 0, position: 'absolute'}}>
                  Showing {range[0]} - {range[1]} of {total} List Respons
                </span>
              ),
            }}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewCSIHO}
