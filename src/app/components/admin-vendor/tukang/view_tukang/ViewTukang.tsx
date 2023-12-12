/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'

import './ViewTukang.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select from 'react-select'
import {Table} from 'antd'
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
    tanggal_join: string
    nama_lengkap: string
    tanggal_lahir: string
    keahlian: string
    ktp: number
    no_telp: number
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
      title: 'Tanggal Join',
      dataIndex: 'tanggal_join',
      key: 'tanggal_join',
      align: 'center',
      onFilter: (value, record) => record.tanggal_join.includes(String(value)),
      sorter: (a, b) => a.tanggal_join.length - b.tanggal_join.length,
    },
    {
      title: 'Nama Lengkap',
      dataIndex: 'nama_lengkap',
      key: 'nama_lengkap',
      align: 'left',
      onFilter: (value, record) => record.nama_lengkap.includes(String(value)),
      sorter: (a, b) => a.nama_lengkap.length - b.nama_lengkap.length,
    },
    {
      title: 'Tanggal Lahir ',
      dataIndex: 'tanggal_lahir',
      key: 'tanggal_lahir',
      align: 'center',
      onFilter: (value, record) => record.tanggal_lahir.includes(String(value)),
      sorter: (a, b) => a.tanggal_lahir.length - b.tanggal_lahir.length,
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
      title: 'KTP',
      dataIndex: 'ktp',
      key: 'ktp',
      align: 'center',
      sorter: (a, b) => a.ktp - b.ktp,
    },
    {
      title: 'No. Telp/WA',
      dataIndex: 'no_telp',
      key: 'no_telp',
      align: 'left',
      sorter: (a, b) => a.no_telp - b.no_telp,
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

        const handleDeleteId = () => {
          const id = record.tukang_id

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
                  .delete(`${apiUrl}/tukang/${id}`, {
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
                      text: response.data.message,
                      icon: 'success',
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

                <a className='button-delete' onClick={handleDeleteId}>
                  <FontAwesomeIcon icon={faTrash} size='sm' />
                </a>
              </>
            )}
          </div>
        )
      },
    },
  ]

  const [tukangData, setTukangData] = useState<DataType[]>([])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchTukangList = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/tukang?date_from=${joinDate}&date_to=${endDate}&search=${searchFilter}&take=0`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )
      return response.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewTukang = async () => {
    try {
      const apiData = await fetchTukangList()

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const tukangData = apiData.map((item: any) => {
        let data

        const joinDate = new Date(item.join_date)
        const tanggalLahir = new Date(item.bod)

        const tukangService = item?.tukang_service
          .map((tukang_service: any) => tukang_service?.service_type_id ?? '-')
          .join(', ')

        data = {
          tukang_id: item.id,
          tanggal_join: formatDate(joinDate),
          nama_lengkap: item.full_name,
          tanggal_lahir: formatDate(tanggalLahir),
          keahlian: tukangService,
          ktp: item.ktp_number,
          no_telp: item.phone_number,
        }

        return data
      })

      return tukangData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await ViewTukang()
      setTukangData(data)
    }

    fetchData()
  }, [joinDate, endDate, searchFilter])

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
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewTukangVendor}
