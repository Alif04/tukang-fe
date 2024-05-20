/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './ViewCSI.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import {List, Space, PaginationProps} from 'antd'
import {Card, Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch, faFilter, faClock} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  className: string
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

  const [csiAnswer, setCsiAnswer] = useState<any[]>([])
  console.log('csi_answer', csiAnswer)
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

  // Format Date
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

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

      setCurrentPage(response.data.data.page)
      setTotalData(response?.data?.data?.total ?? 0)

      return response.data.data.data
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

      const csiData = apiData?.csi_answers.map((item: any) => {
        const jsonData = JSON.parse(item.data)
        return jsonData
      })

      return csiData
    } catch (error) {
      console.error('Error getting csi list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewCSI(page, pageSize)
    setCsiAnswer(data)
  }

  useEffect(() => {
    fetchData(1, 10)
  }, [dateFrom, dateTo, searchFilter])

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
      <div className='table-view-order'>
        {/* <Row className='table-head-wrapper'>
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
        </Row> */}

        <Row>
          <List
            itemLayout='vertical'
            size='small'
            dataSource={csiAnswer}
            pagination={{
              current: currentPage,
              total: totalData,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50, 100],
              defaultPageSize: 5,
              onChange: (page, pageSize) => {
                getCSI(page, pageSize)
              },
              itemRender: itemRender,
              showTotal: (total, range) => (
                <span style={{left: 0, position: 'absolute'}}>
                  Showing {range[0]} - {range[1]} of {total} List Respons CSI
                </span>
              ),
            }}
            renderItem={(item) => (
              <Card className='mb-5'>
                <List.Item key={item?.wewe}>
                  <List.Item.Meta
                    title={
                      <div className='fs-3 text-dark fw-semibold'>
                        <FontAwesomeIcon icon={faClock} /> Tanggal : {item?.Timestamp}
                      </div>
                    }
                  />

                  {Object.entries(item)
                    .splice(2)
                    .map(([key, value]) => (
                      <div>
                        <div className='fs-5'>{`Pertanyaan : ${key}`}</div>
                        <div className='fs-5'>{`Jawaban : ${value}`}</div>
                      </div>
                    ))}
                </List.Item>
              </Card>
            )}
          />
        </Row>
      </div>
    </section>
  )
}

export {ViewCSIHO}
