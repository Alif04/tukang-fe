/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'

import './ViewTukang.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select from 'react-select'
import {Table, PaginationProps} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate} from 'react-router-dom'
import {Form, InputGroup, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faPen,
  faTrash,
  faFileExcel,
  faSearch,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'

interface TukangService {
  value: string
  label: string
}

const ViewTukangVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const userRole = localStorage.getItem('userRole')

  const [tukangData, setTukangData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [joinDate, setJoinDate] = useState<any>('')
  const [endDate, setEndDate] = useState<any>('')
  const [tukangService, setTukangService] = useState<TukangService[]>([])
  const [searchByTukangService, setSearchByTukangService] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  // Handle Change Join Date
  const handleChangeJoinDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchJoinDate = event.target.value
    setJoinDate(updatedSearchJoinDate)
  }

  // Handle Change End Date
  const handleChangeEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchEndDate = event.target.value
    setJoinDate(updatedSearchEndDate)
  }

  // Handle Change Search Filter
  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  // Handle Change Filter By Tukang Service
  const handleChangeSelectTukangService = (element: any) => {
    const {value: updatedStoreId} = element
    setSearchByTukangService(updatedStoreId)
  }

  interface DataType {
    tukang_id: number
    full_name: string
    email: string
    phone_number: number
    address: string
    birth_day: string
    keahlian: string
    ktp: number
    status: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Tukang ID',
      dataIndex: 'tukang_id',
      key: 'tukang_id',
      align: 'center',
      sorter: (a, b) => a.tukang_id - b.tukang_id,
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
      title: 'Alamat',
      dataIndex: 'address',
      key: 'address',
      align: 'left',
      onFilter: (value, record) => record.address.includes(String(value)),
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: 'Tanggal Lahir ',
      dataIndex: 'birth_day',
      key: 'birth_day',
      align: 'center',
      onFilter: (value, record) => record.birth_day.includes(String(value)),
      sorter: (a, b) => a.birth_day.length - b.birth_day.length,
    },
    {
      title: 'No. KTP',
      dataIndex: 'ktp',
      key: 'ktp',
      align: 'center',
      sorter: (a, b) => a.ktp - b.ktp,
    },
    {
      title: 'Keahlian',
      dataIndex: 'keahlian',
      key: 'keahlian',
      align: 'left',
      onFilter: (value, record) => record.keahlian.includes(String(value)),
      sorter: (a, b) => a.keahlian.length - b.keahlian.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'left',
      onFilter: (value, record) => record.status.includes(String(value)),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      align: 'center',
      render: (record) => {
        const handleDetailId = () => {
          const id = record.tukang_id
          navigate(`/tukang/detail-tukang/${id}`)
        }

        const handleUpdateId = () => {
          const id = record.tukang_id
          navigate(`/tukang/update-tukang/${id}`)
        }

        // const handleDeleteId = () => {
        //   const id = record.tukang_id

        //   Swal.fire({
        //     title: `Apakah anda yakin akan menghapus data Tukang ini ?`,
        //     icon: 'warning',
        //     showConfirmButton: true,
        //     showDenyButton: true,
        //     confirmButtonText: 'Ya',
        //     denyButtonText: 'Cancel',
        //   })
        //     .then((willDelete) => {
        //       if (willDelete.value) {
        //         axios
        //           .delete(`${apiUrl}/tukang/${id}`, {
        //             headers: {
        //               Accept: 'application/json',
        //               Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        //               'Access-Control-Allow-Origin': '*',
        //               'ngrok-skip-browser-warning': 'true',
        //             },
        //           })
        //           .then((response) => {
        //             Swal.fire({
        //               title: 'Success',
        //               text: response.data.message,
        //               icon: 'success',
        //             }).then(() => {
        //               window.location.reload()
        //             })
        //           })
        //           .catch((error) => {
        //             Swal.fire({
        //               title: 'Error',
        //               text: error.response.data.message,
        //               icon: 'error',
        //             })
        //           })
        //       }
        //     })
        //     .catch((error) => {
        //       Swal.fire({
        //         title: 'Error',
        //         text: error.response.data.message,
        //         icon: 'error',
        //       })
        //     })
        // }

        return (
          <div
            className={
              userRole === 'Admin HO'
                ? 'button-wrapper justify-content-center'
                : 'button-wrapper justify-content-between'
            }
          >
            <a className='button-detail' onClick={handleDetailId}>
              <FontAwesomeIcon icon={faBook} size='sm' />
            </a>

            {userRole !== 'Admin HO' && (
              <>
                <a className='button-edit' onClick={handleUpdateId}>
                  <FontAwesomeIcon icon={faPen} size='sm' />
                </a>

                {/* <a className='button-delete' onClick={handleDeleteId}>
                  <FontAwesomeIcon icon={faTrash} size='sm' />
                </a> */}
              </>
            )}
          </div>
        )
      },
    },
  ]

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchTukangList = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get(
        `${apiUrl}/tukang?date_from=${joinDate}&date_to=${endDate}&search=${searchFilter}&page=${page}&take=${pageSize}`,
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
      setTotalData(response.data.total)
      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewTukang = async (page: number, pageSize: number) => {
    try {
      const apiData = await fetchTukangList(page, pageSize)

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const tukangData = apiData.map((item: any) => {
        let data

        const BirthOfDay = new Date(item?.bod ?? '-')
        const tukangService = item?.tukang_service
          .map((tukang_service: any) => tukang_service?.service_type_id ?? '-')
          .join(', ')

        data = {
          tukang_id: item?.id ?? '-',
          full_name: item?.full_name ?? '-',
          email: item?.email ?? '-',
          phone_number: item?.phone_number ?? '-',
          address: item?.address ?? '-',
          birth_day: formatDate(BirthOfDay),
          ktp: item?.ktp_number ?? '-',
          keahlian: tukangService ?? '-',
          status: item.is_active === true ? 'ACTIVE' : 'NON ACTIVE',
        }

        return data
      })

      return tukangData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewTukang(page, pageSize)
    setTukangData(data)
  }

  useEffect(() => {
    fetchData(1, 10)
  }, [joinDate, endDate, searchFilter])

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
    const getTukangService = async () => {
      try {
        const response = await axios.get(`${apiUrl}/tukang-service/data`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data.tukang_service)) {
          const tempTukangService = response.data.data.tukang_service.map((item: any) => ({
            value: item.id,
            label: item.service_type_id,
          }))

          setTukangService(tempTukangService)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getTukangService()
  }, [])

  return (
    <section id='view-tukang'>
      <div className='card'>
        <div className='card-body table-view-order'>
          <div className='filter-search'>
            <InputGroup>
              <Form.Control
                placeholder='Filter'
                className='filter-rtl'
                onChange={handleChangeSearchFilter}
              />

              <InputGroup.Text className='filter-rtl'>
                <FontAwesomeIcon icon={faSearch} size='sm' />
              </InputGroup.Text>
            </InputGroup>
          </div>

          <div className='table-head-wrapper'>
            <div className='left'>
              <h3>Filter By :</h3>
            </div>

            <div className='middle'>
              <div className='date-filter'>
                <div className='start-date'>
                  <h3>Start Date : </h3>
                  <Form.Control type='date' onChange={handleChangeJoinDate} />
                </div>

                <div className='end-date'>
                  <h3>End Date : </h3>
                  <Form.Control type='date' onChange={handleChangeEndDate} />
                </div>
              </div>

              <Form.Group as={Row}>
                <Form.Label className='d-flex align-items-center' column sm='4'>
                  Keahlian
                </Form.Label>

                <Col sm='8'>
                  <Select
                    name='tukang_service'
                    className='form-control p-0'
                    classNamePrefix='select'
                    placeholder='Keahlian'
                    isSearchable={true}
                    options={tukangService}
                    onChange={(element: any) => handleChangeSelectTukangService(element)}
                  />
                </Col>
              </Form.Group>
            </div>

            <div className='right'>
              <button className='button-export'>
                <FontAwesomeIcon icon={faFileExcel} size='2xl' className='excel-icon' />
              </button>
            </div>
          </div>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={tukangData}
            rowKey={(record) => record.tukang_id}
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
                  Showing {range[0]} - {range[1]} of {total} Total Tukang
                </span>
              ),
            }}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewTukangVendor}
