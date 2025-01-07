/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import './ViewItem.css'

import {useSelector, useDispatch} from 'react-redux'
import {RootState} from '../../../../../store'
import {
  setQueryParams,
  setCurrentPage,
  setPageSize,
  setDateFrom,
  setDateTo,
  setSearchFilter,
  setSelectedStore,
} from '../../../../../store/itemSlice'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'
import {useNavigate} from 'react-router-dom'
import type {ColumnsType} from 'antd/es/table'
import {LoadingOutlined} from '@ant-design/icons'
import {Table, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {Form, Row, Button, OverlayTrigger, Tooltip, FormGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faTrash, faSearch} from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'

const {RangePicker} = DatePicker

interface DataType {
  no: number
  material_id: number
  store_name: string
  item_code: number
  product_name: string
  category_name: string
  service_name: string
  default_price: number
  min_order: number
  is_active: boolean
}

interface StoreItem {
  value: number | null
  label: string
}

export interface ItemType {
  key: string
  value: string
  query: string
}

const ViewItemHO: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [itemData, setItemData] = useState<DataType[]>([])
  const [totalData, setTotalData] = useState<number>(0)
  const {queryParams, searchFilter, currentPage, pageSize, dateFrom, dateTo, selectedStore} =
    useSelector((state: RootState) => state.item)

  const [store, setStore] = useState<StoreItem[]>([])
  const storeOptions = [{value: null, label: 'All Store'}, ...store]

  const getQueryParams = (params: ItemType[]) => {
    const queryParams = new URLSearchParams(window.location.search)

    return params
      .filter(({key, value}) => queryParams.get(key) === value)
      .map(({query}) => query)
      .join('')
  }

  const QUERY_PARAMS_CONFIG: ItemType[] = [
    {key: 'type', value: 'item_promotion', query: '&item_type=1,2'},
    {key: 'type', value: 'item_survei', query: '&item_type=3'},
  ]

  const renderTooltip = (title: string) => <Tooltip id='button-tooltip'>{title}</Tooltip>

  const columns: ColumnsType<DataType> = [
    {
      title: 'No. ',
      dataIndex: 'no',
      key: 'no',
      width: 90,
      align: 'center',
      sorter: (a: DataType, b: DataType) => a.no - b.no,
      render: (text: any, record: any, index: number) => {
        return (currentPage - 1) * pageSize + index + 1
      },
    },
    {
      title: 'Item Code',
      dataIndex: 'item_code',
      key: 'item_code',
      width: 110,
      align: 'center',
      sorter: (a: DataType, b: DataType) => a.item_code - b.item_code,
    },
    {
      title: 'Nama Item',
      dataIndex: 'product_name',
      key: 'product_name',
      align: 'left',
      width: 150,
      onFilter: (value: string, record: DataType) => record.product_name.includes(value),
      sorter: (a: DataType, b: DataType) => a.product_name.localeCompare(b.product_name),
    },
    {
      title: 'Nama Jasa Pemasangan',
      dataIndex: 'service_name',
      key: 'service_name',
      align: 'left',
      width: 170,
      onFilter: (value: string, record: DataType) => record.service_name.includes(value),
      sorter: (a: DataType, b: DataType) => a.service_name.localeCompare(b.service_name),
    },
    {
      title: 'Kategori',
      dataIndex: 'category_name',
      key: 'category_name',
      align: 'left',
      width: 170,
      onFilter: (value: string, record: DataType) => record.category_name.includes(value),
      sorter: (a: DataType, b: DataType) => a.category_name.localeCompare(b.category_name),
    },
    getQueryParams(QUERY_PARAMS_CONFIG).includes('&is_promotion=1') && {
      title: 'Assign To Store',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'left',
      width: 100,
      onFilter: (value: string, record: DataType) => record.store_name.includes(value),
      sorter: (a: DataType, b: DataType) => a.store_name.localeCompare(b.store_name),
    },
    getQueryParams(QUERY_PARAMS_CONFIG).includes('&is_promotion=1') && {
      title: 'Price',
      dataIndex: 'default_price',
      key: 'default_price',
      align: 'center',
      width: 150,
      sorter: (a: DataType, b: DataType) => a.default_price - b.default_price,
    },
    getQueryParams(QUERY_PARAMS_CONFIG).includes('&is_promotion=1') && {
      title: 'Min Order',
      dataIndex: 'min_order',
      key: 'min_order',
      align: 'center',
      width: 100,
      sorter: (a: DataType, b: DataType) => a.min_order - b.min_order,
    },
    {
      title: 'Status Item',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      width: 100,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'left',
      fixed: 'right',
      width: 80,
      render: (record: DataType) => {
        const id = record.material_id

        const handleUpdate = () => {
          navigate(`/item/update-item/${id}`)
        }

        const handleDetail = () => {
          navigate(`/item/detail-item/${id}`)
        }

        const handleDeleteId = () => {
          Swal.fire({
            title: `Apakah anda yakin akan menonaktifkan Item ini ?`,
            icon: 'warning',
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ya',
            denyButtonText: 'Cancel',
          })
            .then((willDelete) => {
              if (willDelete.value) {
                axios
                  .delete(`${apiUrl}/items/${id}`, {
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
                      text: 'Item berhasil dinonaktifkan',
                      icon: 'success',
                      showConfirmButton: false,
                      timer: 1500,
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
          <div className='d-flex gap-3'>
            {getQueryParams(QUERY_PARAMS_CONFIG).includes('&item_type=1,2') && (
              <>
                <OverlayTrigger
                  placement='bottom'
                  delay={{show: 250, hide: 400}}
                  overlay={renderTooltip('Detail Item')}
                >
                  <Button variant='primary' className='button-detail' onClick={handleDetail}>
                    <FontAwesomeIcon className='text-white' icon={faBook} fontSize={'13px'} />
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement='bottom'
                  delay={{show: 250, hide: 400}}
                  overlay={renderTooltip('Edit Item')}
                >
                  <Button variant='primary' className='button-edit' onClick={handleUpdate}>
                    <FontAwesomeIcon className='text-white' icon={faPen} fontSize={'13px'} />
                  </Button>
                </OverlayTrigger>
              </>
            )}

            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Hapus Item')}
            >
              <Button className='button-delete' variant='danger' onClick={handleDeleteId}>
                <FontAwesomeIcon className='text-white' icon={faTrash} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>
          </div>
        )
      },
    },
  ].filter(Boolean) as ColumnsType<DataType>

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

        if (Array.isArray(response.data.data)) {
          const tempStore = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.store_name,
            city_id: item.city_id,
          }))

          setStore(tempStore)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getStore()
  }, [])

  const getItemList = async (page: number, pageSize: number, queryparams: any) => {
    const dynamicQuery = getQueryParams(QUERY_PARAMS_CONFIG)

    let apiUrlWithParams = `${apiUrl}/items?order_by=desc${dynamicQuery}${queryparams}&page=${page}&take=${pageSize}`

    if (dateFrom && dateTo) {
      apiUrlWithParams += `&date_from=${dateFrom}&date_to=${dateTo}`
    }

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
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewItem = async (page: number, pageSize: number, queryparams: any) => {
    try {
      const apiData = await getItemList(page, pageSize, queryparams)

      if (!apiData) {
        console.error('No data received from getItemList')
        return []
      }

      const itemData = apiData.map((item: any, index: number) => {
        let data

        const storeIds = item.prices.flatMap((detail: any) =>
          detail.price_stores.map((priceStore: any) => priceStore.store.id)
        )
        const uniqueStoreIds = Array.from(new Set(storeIds))

        data = {
          no: index + 1,
          item_code: item?.item_code,
          material_id: item?.id,
          store_name: `${uniqueStoreIds.length} Toko`,
          product_name: item?.item_name ?? '-',
          category_name: item?.category?.category_name ?? '-',
          service_name: item?.service_name ?? '-',
          default_price: `Rp. ${parseInt(item?.default_price).toLocaleString('id')}`,
          min_order: item?.prices[0]?.min_order ?? '-',
          is_active: item?.is_active === true ? 'Aktif' : 'Tidak Aktif',
        }

        return data
      })

      return itemData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number, queryparams: any) => {
    const data = await ViewItem(page, pageSize, queryparams)
    setItemData(data)
  }

  useEffect(() => {
    fetchData(currentPage, pageSize, queryParams)
  }, [currentPage, queryParams, getQueryParams(QUERY_PARAMS_CONFIG)])

  // Table Handler
  const handleChangeSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value))
  }

  const handleStoreChange = (newValue: SingleValue<StoreItem>) => {
    const selectedStore: StoreItem = newValue || {value: null, label: 'All Store'}
    dispatch(setSelectedStore(selectedStore))
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubmitFilter()
    }
  }

  const handleSubmitFilter = async () => {
    setLoadingButton(true)
    let queryparams = ``

    const valueCheck = (key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        queryparams += `${key}${value}`
      }
    }

    valueCheck(`&search=`, searchFilter)
    valueCheck(`&store_id=`, selectedStore?.value)
    dispatch(setQueryParams(queryparams))

    const data = await ViewItem(1, 10, queryparams)
    setItemData(data)

    setLoadingButton(false)
  }

  return (
    <section id='view-item'>
      <div className='card'>
        <div className='card-body'>
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

              <Select
                name='store_id'
                className='form-control p-0 w-25'
                classNamePrefix='select'
                placeholder='Pilih Toko'
                isSearchable={true}
                options={storeOptions}
                value={selectedStore}
                onChange={handleStoreChange}
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
                className='table-striped-rows'
                bordered
                columns={columns}
                dataSource={itemData}
                rowKey={(record) => record.material_id}
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
              {Math.min(currentPage * pageSize, totalData)} of {totalData} Item
            </span>

            <Pagination
              style={{textAlign: 'right', position: 'relative'}}
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
    </section>
  )
}

export {ViewItemHO}
