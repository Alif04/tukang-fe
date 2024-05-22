/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useEffect, useState, useRef} from 'react'
import {useNavigate} from 'react-router-dom'

import './ViewOrder.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import type {ColumnsType} from 'antd/es/table'
import {Table, Tag, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
import {Image, Skeleton} from 'antd'
import Swal from 'sweetalert2'
import {Row, Col, Form, Button, Stack, FormGroup, Modal, Card, ListGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faSearch,
  faPen,
  faCheckCircle,
  faImage,
  faTrash,
  faFileImage,
  faXmarkCircle,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

interface DataType {
  order_id: number
  assign_from: string
  date_order: Date
  no_member: number
  costumer_name: string
  phone_number: number
  service_name: string
  payment_status: string
  order_status: string
  order_status_label: string
}

interface StoreItem {
  value: number | null
  label: string
}

interface Order {
  id: number | null
  project_status_id: number | null
  order_details: Array<{
    id: number | null
    item_id: number | null
    item_code: string
    item_name: string
    quantity: number
    unit_price: string
    total: string
    item_notes: string
  }>
}

interface Quotation {
  id: number | null
  order_id: number | null
  store_id: number | null
  quotation_status: number | null
  description: string
  quotation_number: string
  quotation_date: string
  quotation_validity: string
  quotation_disc: number
  quotation_promotion: number
  quotation_grand_total: number
  readiness: number
  quotation_details: Array<{
    id: number | null
    index: string
    item_id: number | null
    work_order_item_id: number | null
    category_id: number | null
    type: number
    item_name: string
    unit_price: number
    unit: string
    description: string
    total: number
    final_price: number
    margin: number
    margin_type: number
    quantity: number
    is_user: number
  }>
}

const ViewOrders: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  const salesId = localStorage.getItem('sales_id')
  const userRole = localStorage.getItem('userRole')
  const userStore = localStorage.getItem('storeId')

  const storeId = userRole !== 'Admin HO' ? `&store_id=${userStore}` : ''
  const userSales = userRole === 'Sales' ? `&sales_id=${salesId}` : ''

  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [orderDetail, setOrderDetail] = useState<any>()
  const [orderData, setOrderData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalData, setTotalData] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const [store, setStore] = useState<StoreItem[]>([])
  const storeOptions = [{value: null, label: 'All Store'}, ...store]
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreItem>>({
    value: null,
    label: 'All Store',
  })

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  // Status
  const storedStatus = sessionStorage.getItem('statusData')
  const statusData = storedStatus ? JSON.parse(storedStatus) : []
  const cancelOrder = statusData.find((status: any) => status.category === 'CANCEL')
  const verificationStatus = statusData.find((status: any) => status.category === 'QUOTEOUT')
  const statusFilters = statusData.map((item: any) => ({
    text: item.description,
    value: item.description,
  }))

  // Order Detail
  const [orderForm, setOrderForm] = useState<Order>({
    id: null,
    project_status_id: null,
    order_details: [
      {
        id: null,
        item_id: null,
        item_code: '',
        item_name: '',
        quantity: 1,
        unit_price: '',
        total: '',
        item_notes: '',
      },
    ],
  })

  const fetchOrderData = async (order_id: number | null) => {
    if (order_id === null) return

    try {
      await axios
        .get(`${apiUrl}/orders/${order_id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data.data
          setOrderDetail(data)
          setTimeout(() => {
            setLoadingModal(false)
          }, 2000)

          if (data) {
            setOrderForm((prev) => ({
              ...prev,
              id: data?.id ?? null,
              project_status_id: data?.project_status_id ?? null,
            }))
          }

          if (data?.order_details) {
            setOrderForm((prev) => {
              const previousDetailValues = data?.order_details?.map((item: any) => {
                const previousItem = {
                  value: item.id,
                  label: item?.item?.service_name,
                  item_code: item?.item_code ?? '',
                  item_name: item?.item_name ?? '',
                  category_id: item?.item?.category.id,
                  default_price: item?.item?.default_price,
                  prices: [
                    {
                      id: item?.item?.prices[0].id,
                      item_id: item?.item?.prices[0]?.item_id,
                      store_id: item?.item?.prices[0]?.store_id,
                      periodic_start: item?.item?.prices[0]?.periodic_start,
                      periodic_end: item?.item?.prices[0]?.periodic_end,
                      price: item?.item?.prices[0]?.price,
                      min_order: item?.item?.prices[0]?.min_order,
                    },
                  ],
                }

                return {
                  item: previousItem,
                  id: item.id,
                  item_id: item.item_id,
                  item_code: item?.item_code === 'null' ? '' : item.item_code,
                  item_name: item?.item_name === 'null' ? '' : item.item_name,
                  item_notes: item?.item_notes === 'null' ? '' : item.item_notes,
                  quantity: item.quantity,
                  unit_price: item.unit_price,
                  total: item.total,
                }
              })

              return {
                ...prev,
                order_details: previousDetailValues,
              }
            })
          }

          if (data?.quotation?.length) {
            const quotationDetails = data.quotation[0].quotation_details.map(
              (item: any, index: number) => ({
                id: item?.id ?? null,
                index: (Date.now() + index).toString(),
                item_id: item?.item_id ?? null,
                work_order_item_id: item?.work_order_items_id ?? null,
                category_id: item?.category_id ?? null,
                type: item?.item_type ?? 2,
                item_name: item?.name ?? '',
                unit_price: item?.price ?? 0,
                unit: item?.unit ?? '',
                description: item?.description ?? '',
                final_price: item?.final_price ?? '',
                margin: item?.margin ?? 0,
                margin_type: item?.margin_type ?? 1,
                quantity: item?.quantity ?? 0,
                is_user: item?.is_customer === true ? 1 : 0,
              })
            )

            setQuotation((prev) => ({
              ...prev,
              id: data?.quotation[0]?.id,
              order_id: data?.quotation[0]?.order_id,
              store_id: data?.quotation[0]?.store_id,
              quotation_status: data?.quotation[0]?.quotation_status,
              description: data?.quotation[0]?.description,
              quotation_number: data?.quotation[0]?.quotation_number,
              quotation_date: data?.quotation[0]?.quotation_date,
              quotation_validity: data?.quotation[0]?.quotation_validity,
              quotation_disc: data?.quotation[0]?.quotation_disc,
              quotation_promotion: data?.quotation[0]?.quotation_promotion,
              quotation_grand_total: data?.quotation[0]?.quotation_grand_total,
              readiness: data?.quotation[0]?.readiness,
              quotation_details: quotationDetails,
            }))
          }

          if (data?.quotation?.length) {
            const quotationFiles = data.quotation[0]?.quotation_files
              .filter((x: any) => x.type === 1)
              .map((item: any) => ({
                id: item.id,
                name: item.path,
              }))

            const receiptFiles = data.quotation[0]?.quotation_files
              .filter((x: any) => x.type === 2)
              .map((item: any) => ({
                id: item.id,
                name: item.path,
              }))

            setQuotationFiles(quotationFiles)
            setReceiptQuotation(receiptFiles)
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchOrderData(null)
  }, [])

  const cancelOrderHandler = async (id: number) => {
    await fetchOrderData(id)

    const formData = new FormData()
    const appendIfNotDefault = (formData: any, key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        formData.append(key, String(value))
      }
    }

    formData.append('order_id', String(orderForm?.id))
    formData.append('project_status_id', cancelOrder?.value)

    orderForm.order_details.forEach((item, index) => {
      if (item) {
        appendIfNotDefault(formData, `order_details[${index}][id]`, item.id)
        appendIfNotDefault(formData, `order_details[${index}][item_id]`, item.item_id)
        appendIfNotDefault(formData, `order_details[${index}][item_code]`, item.item_code)
        appendIfNotDefault(formData, `order_details[${index}][item_name]`, item.item_name)
        appendIfNotDefault(formData, `order_details[${index}][item_notes]`, item.item_notes)
        appendIfNotDefault(formData, `order_details[${index}][quantity]`, item.quantity)
      }
    })

    Swal.fire({
      title: 'Apakah anda yakin akan membatalkan orderan ini dan melakukan refund?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Tidak',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoadingButton(true)
          const response = await axios.post(`${apiUrl}/orders/${orderForm?.id}`, formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          })

          setLoadingButton(false)
          setLoadData(true)

          if (response.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Orderan berhasil dibatalkan.',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              navigate(`/refund/new-refund/${id}`)
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: response.data.message,
              showConfirmButton: false,
              timer: 1500,
            })
          }
        } catch (error) {
          console.error(error)
        }
      }
    })
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 90,
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.order_id - b.order_id,
      responsive: ['md'],
    },
    {
      title: 'Nama Toko',
      dataIndex: 'assign_from',
      key: 'assign_from',
      align: 'center',
      width: 110,
      className: 'col_order_id',
      onFilter: (value, record) => record.assign_from.includes(String(value)),
      sorter: (a, b) => a.assign_from.length - b.assign_from.length,
      responsive: ['md'],
    },
    {
      title: 'Order Dibuat',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 120,
      sorter: (a, b) => new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
      responsive: ['md'],
    },
    {
      title: 'No Member',
      dataIndex: 'no_member',
      key: 'no_member',
      align: 'center',
      width: 110,
      sorter: (a, b) => a.no_member - b.no_member,
      responsive: ['md'],
    },
    {
      title: 'Nama Customer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 130,
      onFilter: (value, record) => record.costumer_name.includes(String(value)),
      sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
      responsive: ['md'],
    },
    {
      title: 'No. Telp / WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'left',
      width: 140,
      sorter: (a, b) => a.phone_number - b.phone_number,
      responsive: ['md'],
    },
    {
      title: 'Nama Jasa Pemasangan',
      dataIndex: 'service_name',
      key: 'service_name',
      align: 'left',
      width: 120,
      onFilter: (value, record) => record.service_name.includes(String(value)),
      sorter: (a, b) => a.service_name.length - b.service_name.length,
      responsive: ['md'],
    },
    {
      title: 'Status Pembayaran',
      dataIndex: 'payment_status',
      key: 'payment_status',
      align: 'left',
      // width: 140,
      onFilter: (value, record) => record.payment_status.includes(String(value)),
      sorter: (a, b) => a.payment_status.length - b.payment_status.length,
      filters: [
        {text: 'FREE', value: 'FREE'},
        {text: 'UNPAID', value: 'UNPAID'},
        {text: 'PAID', value: 'PAID'},
      ],
      responsive: ['md'],
    },
    {
      title: 'Status Order',
      dataIndex: 'order_status_label',
      key: 'order_status_label',
      filters: statusFilters,
      render: (order_status_label) => {
        const orderStatus = order_status_label
        let color = ''

        switch (orderStatus) {
          case 'UNPAID':
            color = 'red'
            break
          case 'PAID':
            color = 'green'
            break
          default:
            color = 'blue'
            break
        }

        return <Tag color={color}>{orderStatus}</Tag>
      },
      onFilter: (value, record) => record.order_status_label.includes(String(value)),
      sorter: (a, b) => a.order_status_label.length - b.order_status_label.length,
      align: 'left',
      width: 140,
      responsive: ['md'],
    },
    {
      title: 'Action',
      key: 'action',
      responsive: ['md'],
      render: (record) => {
        const id = record.order_id

        const handleDetailId = () => {
          navigate(`/order/detail-order/${id}`)
        }

        const handleUpdateId = () => {
          navigate(`/order/update-order/${id}`)
        }

        const handleShowModal = (id: number, type: number) => {
          const selected = orderData.find((order) => order.order_id === id)

          if (selected) {
            fetchOrderData(selected.order_id)
            setShowModal(true)
            setModalType(type)
          }
        }

        return (
          <div className='d-flex justify-content-center gap-4'>
            {['PICKLIST', 'BOOK', 'BOOKED', 'WORKREQ', 'SURVEYREQ'].includes(
              record.order_status
            ) && (
              <a className='button-edit' onClick={() => cancelOrderHandler(record.order_id)}>
                <FontAwesomeIcon className='text-danger' icon={faXmarkCircle} size='sm' />
              </a>
            )}

            <a className='button-detail' onClick={handleDetailId}>
              <FontAwesomeIcon icon={faBook} size='sm' />
            </a>

            {['PICKLIST', 'BOOK', 'BOOKED', 'WORKREQ', 'SURVEYREQ'].includes(
              record.order_status
            ) && (
              <a className='button-edit' onClick={handleUpdateId}>
                <FontAwesomeIcon icon={faPen} size='sm' />
              </a>
            )}

            {['QUOTEOUT'].includes(record.order_status) && userRole === 'Admin HO' ? (
              <a className='button-edit' onClick={handleUpdateId}>
                <FontAwesomeIcon icon={faPen} size='sm' />
              </a>
            ) : (
              <></>
            )}
            {/* 
            {['WORKEND', 'SURVEYDONE'].includes(record.order_status) ? (
              <a className='button-edit' onClick={() => handleShowModal(id, 1)}>
                <FontAwesomeIcon icon={faEnvelope} size='sm' />
              </a>
            ) : (
              <></>
            )} */}

            {['QUOTEOUT'].includes(record.order_status) && userRole === 'Store CS' ? (
              <a className='button-verif' onClick={() => handleShowModal(id, 2)}>
                <FontAwesomeIcon icon={faCheckCircle} size='sm' />
              </a>
            ) : (
              <></>
            )}
          </div>
        )
      },
      fixed: 'right',
      width: 50,
    },
  ]

  // Modal
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [loadingModal, setLoadingModal] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<number | null>(null)
  const handleCloseModal = () => {
    setShowModal(false)
  }

  // Quotation Detail
  const [quotation, setQuotation] = useState<Quotation>({
    id: null,
    order_id: null,
    store_id: null,
    quotation_status: null,
    description: '',
    quotation_number: '',
    quotation_date: '',
    quotation_validity: '',
    quotation_disc: 0,
    quotation_promotion: 0,
    quotation_grand_total: 0,
    readiness: 1,
    quotation_details: [
      {
        id: null,
        index: (Date.now() + 1).toString(),
        item_id: null,
        work_order_item_id: null,
        category_id: null,
        type: 1,
        item_name: '',
        unit: '',
        description: '',
        unit_price: 0,
        total: 0,
        final_price: 0,
        margin: 0,
        margin_type: 1,
        quantity: 0,
        is_user: 0,
      },
      {
        id: null,
        index: (Date.now() + 2).toString(),
        item_id: null,
        category_id: null,
        work_order_item_id: null,
        type: 2,
        item_name: '',
        unit: '',
        description: '',
        unit_price: 0,
        total: 0,
        final_price: 0,
        margin: 0,
        margin_type: 1,
        quantity: 0,
        is_user: 0,
      },
    ],
  })

  // Quotation Files
  const [receiptQuotation, setReceiptQuotation] = useState<Array<File | null>>([])
  const [quotationFiles, setQuotationFiles] = useState<Array<File | null>>([])

  const [selectedReceiptIndex, setSelectedReceiptIndex] = useState<number | null>(null)
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)
  const evidenceRef = useRef<HTMLInputElement>(null)

  const [previewReceipt, setPreviewReceipt] = useState<any>()
  const [previewImage, setPreviewImage] = useState<any>()

  const [visibleReceipt, setVisibleReceipt] = useState(false)
  const [visible, setVisible] = useState(false)

  // Upload Order File Handler
  const handleReceiptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files

    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const existingFiles = [...receiptQuotation]
      const mergedFiles = existingFiles.concat(file)

      const {length: existingFilesLength} = existingFiles
      const {length: fileListLength} = fileList

      for (let i = 0; i < fileListLength; i++) {
        mergedFiles[existingFilesLength + i] = fileList.item(i)
      }

      setReceiptQuotation(mergedFiles)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files

    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const existingFiles = [...quotationFiles]
      const mergedFiles = existingFiles.concat(file)

      const {length: existingFilesLength} = existingFiles
      const {length: fileListLength} = fileList

      for (let i = 0; i < fileListLength; i++) {
        mergedFiles[existingFilesLength + i] = fileList.item(i)
      }

      setQuotationFiles(mergedFiles)
    }
  }

  // Click Image
  const handleReceiptClick = () => {
    const inputField = document.querySelector('.input-field-receipt') as HTMLInputElement
    inputField.click()
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  // Remove File
  const handleRemoveReceipt = (index: number) => {
    const newEvidances = [...receiptQuotation]
    newEvidances.splice(index, 1)
    setReceiptQuotation(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  const handleRemoveFile = (index: number) => {
    const newEvidances = [...quotationFiles]
    newEvidances.splice(index, 1)
    setQuotationFiles(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  // File Click
  const handleFileReceipt = (index: number) => {
    setPreviewReceipt(receiptQuotation[index]?.name)
    setVisibleReceipt(true)
    setSelectedReceiptIndex(index)
  }

  const handleFileClick = (index: number) => {
    setPreviewImage(quotationFiles[index]?.name)
    setVisible(true)
    setSelectedFileIndex(index)
  }

  const fetchOrderList = async (page: number, pageSize: number, queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/orders?order_by=desc&page=${page}${storeId}${userSales}&take=${pageSize}${queryparams}`

    try {
      const response = await axios.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setCurrentPage(response.data.data.page)
      setTotalData(response?.data?.data?.total ?? 0)
      setLoadData(false)

      return response.data.data.data
    } catch (error) {
      console.error('Error fetching data:', error)
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
            return item.receipt_number === null ? 'UNPAID' : 'PAID'
          } else if (item?.payment_type === 'gratis') {
            return 'FREE'
          } else if (item?.payment_type === 'pemasangan_tanpa_survey') {
            return item.receipt_number === null ? 'UNPAID' : 'PAID'
          } else {
            return ''
          }
        })()

        data = {
          order_id: item.id,
          assign_from: item?.store?.store_name,
          date_order: orderDate,
          no_member: item?.members?.member_number,
          costumer_name: item?.members?.full_name,
          phone_number: item?.project_number,
          service_name:
            item.payment_type === 'survey' && item.quotation.length === 0
              ? item.m_order_details[0]?.item_notes
              : item.payment_type === 'survey' && item.quotation.length >= 0
              ? item.quotation[0]?.quotation_details[0]?.name ?? '-'
              : item.m_order_details[0]?.item?.service_name ?? '-',
          payment_status: paymentStatus,
          order_status:
            item?.work_orders?.work_order_status.length > 0 && item?.status?.category !== 'QUOTEOUT'
              ? item?.work_orders?.work_order_status[0]?.status?.category
              : item?.work_orders?.work_order_status.length > 0 &&
                item?.status?.category === 'QUOTEOUT'
              ? item?.status?.category
              : item?.status?.category,
          order_status_label:
            item?.work_orders?.work_order_status.length > 0 &&
            !['QOUTEOUT', 'WORKREQ'].includes(item?.status?.category)
              ? item?.work_orders?.work_order_status[0]?.status?.description
              : item?.work_orders?.work_order_status.length > 0 &&
                item?.status?.category === 'QUOTEOUT'
              ? item?.status?.description
              : item?.status?.description,
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
    fetchData(1, 10, '')
  }, [])

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
    valueCheck(`&store_id=`, selectedStore?.value)

    const data = await ViewOrder(1, 10, queryparams)
    setOrderData(data)

    setLoadingButton(false)
  }

  const handleUpdateQuotation = async () => {
    const formData = new FormData()
    const appendIfNotDefault = (formData: any, key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        formData.append(key, String(value))
      }
    }

    formData.append('order_id', String(quotation.order_id))
    formData.append('store_id', String(quotation.store_id))
    formData.append('description', quotation.description)
    formData.append('quotation_status', verificationStatus?.value)
    formData.append('quotation_number', String(quotation.quotation_number))
    formData.append('quotation_date', quotation.quotation_date)
    formData.append('quotation_validity', quotation.quotation_validity)
    formData.append('quotation_disc', String(quotation.quotation_disc))
    formData.append('quotation_promotion', String(quotation.quotation_promotion))
    formData.append('readiness', String(4))

    quotation.quotation_details.forEach((quotation, index) => {
      appendIfNotDefault(formData, `quotation_details[${index}][id]`, quotation.id)
      appendIfNotDefault(formData, `quotation_details[${index}][item_id]`, quotation.item_id)
      appendIfNotDefault(formData, `quotation_details[${index}][type]`, quotation.type)
      appendIfNotDefault(formData, `quotation_details[${index}][name]`, quotation.item_name)
      appendIfNotDefault(formData, `quotation_details[${index}][price]`, quotation.unit_price)
      appendIfNotDefault(formData, `quotation_details[${index}][unit]`, quotation.unit)
      appendIfNotDefault(formData, `quotation_details[${index}][quantity]`, quotation.quantity)
      formData.append(`quotation_details[${index}][margin]`, String(quotation.margin))
      formData.append(`quotation_details[${index}][margin_type]`, String(quotation.margin_type))
      formData.append(`quotation_details[${index}][is_customer]`, String(quotation.is_user))
      appendIfNotDefault(
        formData,
        `quotation_details[${index}][work_order_item_id]`,
        quotation.work_order_item_id
      )
      appendIfNotDefault(
        formData,
        `quotation_details[${index}][category_id]`,
        quotation.category_id
      )
    })

    if (receiptQuotation?.length) {
      receiptQuotation.forEach((item) => {
        if (item instanceof Blob) {
          formData.append(`quotation_receipts`, item, item.name)
        }
      })
    }

    if (quotationFiles?.length) {
      quotationFiles.forEach((item) => {
        if (item instanceof Blob) {
          formData.append(`quotation_files`, item, item.name)
        }
      })
    }

    if (quotationFiles?.length) {
      quotationFiles.forEach((item: any, index: number) => {
        if (item.id) {
          formData.append(`preserve_files[${index}`, item.id)
        }
      })
    }

    await axios
      .post(`${apiUrl}/quotation/${quotation.id}`, formData, {
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
            text: response.data.message,
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          })

          setLoadingUpdate(false)
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })

          setLoadingUpdate(false)
        }

        window.location.reload()
      })
      .catch((error) => {
        setLoadingUpdate(false)

        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
        })
      })
  }

  // CSI Modal
  const CustomerIndexModal = ({orderDetail, loadingModal}: any) => {
    return (
      <>
        <Modal.Header closeButton>
          <Skeleton active loading={loadingModal} paragraph={{rows: 0}}>
            <Modal.Title>
              Pengiriman Survey Kepada Customer - Order ID {orderDetail?.id}
            </Modal.Title>
          </Skeleton>
        </Modal.Header>

        <Modal.Body>
          <Row className='mb-5'>
            <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
              <Skeleton active loading={loadingModal} paragraph={{rows: 1}}>
                <Form.Label className='fs-6 fw-bold'>
                  Nama Toko :{' '}
                  <span className='fs-6 ms-2 fw-normal'>
                    {orderDetail?.store?.store_name ?? ''}
                  </span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-6 fw-bold'>
                  Quotation ID :{' '}
                  <span className='fs-6 ms-2 fw-normal'>
                    {orderDetail?.quotation?.length ? orderDetail?.quotation[0]?.id : ''}
                  </span>
                </Form.Label>
              </Skeleton>
            </Col>

            <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
              <Skeleton active loading={loadingModal} paragraph={{rows: 1}}>
                <Form.Label className='fs-6 fw-bold'>
                  Receipt Number :
                  <span className='fs-6 ms-2 fw-normal'>{orderDetail?.receipt_number ?? '-'}</span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-6 fw-bold'>
                  Order Status :
                  <span className='fs-6 ms-2 fw-bold text-success'>
                    {orderDetail?.status?.description}
                  </span>
                </Form.Label>
              </Skeleton>
            </Col>
          </Row>
        </Modal.Body>
      </>
    )
  }

  // Quotation Modal
  const QuotationModal = ({
    orderDetail,
    loadingModal,
    handleReceiptClick,
    handleReceiptChange,
    handleUpdateQuotation,
    loadingUpdate,
    receiptQuotation,
    quotationFiles,
    handleFileReceipt,
    handleRemoveReceipt,
    handleImageClick,
    handleFileChange,
    handleFileClick,
    handleRemoveFile,
  }: any) => {
    return (
      <>
        <Modal.Header closeButton>
          <Skeleton active loading={loadingModal} paragraph={{rows: 0}}>
            <Modal.Title>Verifikasi Pembayaran Quotation - Order ID {orderDetail?.id}</Modal.Title>
          </Skeleton>
        </Modal.Header>

        <Modal.Body>
          <Row className='mb-5'>
            <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
              <Skeleton active loading={loadingModal} paragraph={{rows: 1}}>
                <Form.Label className='fs-6 fw-bold'>
                  Nama Toko :{' '}
                  <span className='fs-6 ms-2 fw-normal'>
                    {orderDetail?.store?.store_name ?? ''}
                  </span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-6 fw-bold'>
                  Quotation ID :{' '}
                  <span className='fs-6 ms-2 fw-normal'>
                    {orderDetail?.quotation?.length ? orderDetail?.quotation[0]?.id : ''}
                  </span>
                </Form.Label>
              </Skeleton>
            </Col>

            <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
              <Skeleton active loading={loadingModal} paragraph={{rows: 1}}>
                <Form.Label className='fs-6 fw-bold'>
                  Receipt Number :
                  <span className='fs-6 ms-2 fw-normal'>{orderDetail?.receipt_number ?? '-'}</span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-6 fw-bold'>
                  Order Status :
                  <span className='fs-6 ms-2 fw-bold text-success'>
                    {(() => {
                      if (
                        orderDetail?.status?.category === 'QUOTEIN' ||
                        orderDetail?.status?.category === 'QUOTEOUT'
                      ) {
                        return orderDetail?.status?.description
                      } else if (orderDetail?.work_orders?.work_order_status?.length > 0) {
                        return orderDetail?.work_orders?.work_order_status[0]?.status?.description
                      } else {
                        return orderDetail?.status?.description
                      }
                    })()}
                  </span>
                </Form.Label>
              </Skeleton>
            </Col>
          </Row>

          <Row>
            <Skeleton active loading={loadingModal} paragraph={{rows: 0}}>
              <div className='fs-4 fw-bold mb-1'>Informasi Pembeli</div>
            </Skeleton>

            <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
              <Skeleton active loading={loadingModal} paragraph={{rows: 2}}>
                <Form.Label className='fs-6 fw-semibold'>
                  No Member :{' '}
                  <span className='fs-6 ms-2 fw-normal'>{orderDetail?.members?.member_number}</span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-6 fw-semibold'>
                  Customer Name :
                  <span className='fs-6 ms-2 fw-normal'>{orderDetail?.members?.full_name} </span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-6 fw-semibold'>
                  Alamat Pemasangan :
                  <span className='fs-6 ms-2 fw-normal'>{orderDetail?.project_address} </span>
                </Form.Label>
              </Skeleton>
            </Col>

            <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
              <Skeleton active loading={loadingModal} paragraph={{rows: 1}}>
                <Form.Label className='fs-6 fw-semibold'>
                  Nomor Telp/WA :
                  <span className='fs-6 ms-2 fw-normal'>{orderDetail?.project_number}</span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-6 fw-semibold'>
                  Alamat Email :
                  <span className='fs-6 ms-2 fw-normal'>{orderDetail?.members?.email} </span>
                </Form.Label>
              </Skeleton>
            </Col>
          </Row>

          <Skeleton active loading={loadingModal} paragraph={{rows: 3}}>
            {orderDetail?.quotation?.length && (
              <Row className='information-detail'>
                <div className='table-warranty-content'>
                  <table className='table hover responsive'>
                    <thead className='table-warranty-head'>
                      <tr>
                        <th className='text-center' style={{width: '355px'}}>
                          Jenis Jasa
                        </th>

                        <th className='text-center' style={{width: '80px'}}>
                          QTY
                        </th>

                        <th className='text-center' style={{width: '150px'}}>
                          Satuan
                        </th>

                        <th className='text-center' style={{width: '250px'}}>
                          Final Price
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {orderDetail?.quotation[0]?.quotation_details
                        .filter((x: any) => x.item_type === 2)
                        .map((item: any, index: any) => (
                          <tr key={`${index}-quotation`}>
                            <td>
                              {item?.name ?? '-'}{' '}
                              {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                            </td>
                            <td>{item?.quantity ?? 0}</td>
                            <td>{item?.unit}</td>
                            <td>{`Rp. ${parseInt(item?.final_price ?? 0).toLocaleString(
                              'id'
                            )}`}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  <table className='table hover responsive'>
                    <thead className='table-warranty-head'>
                      <tr>
                        <th className='text-center' style={{width: '355px'}}>
                          Material Yang Dibutuhkan
                        </th>

                        <th className='text-center' style={{width: '80px'}}>
                          QTY
                        </th>

                        <th className='text-center' style={{width: '150px'}}>
                          Satuan
                        </th>

                        <th className='text-center' style={{width: '250px'}}>
                          Final Price
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {orderDetail?.quotation[0]?.quotation_details
                        .filter((x: any) => x.item_type === 1)
                        .map((item: any, index: any) => (
                          <tr key={`${index}-quotation`}>
                            <td>
                              {item?.name ?? '-'}{' '}
                              {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                            </td>
                            <td>{item?.quantity ?? 0}</td>
                            <td>{item?.unit ?? '-'}</td>
                            <td>{`Rp. ${parseInt(item?.final_price ?? 0).toLocaleString(
                              'id'
                            )}`}</td>
                          </tr>
                        ))}

                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Total Jasa
                        </td>
                        <td className='fw-bolder'>{`Rp. ${parseInt(
                          orderDetail?.quotation[0]?.quotation_details
                            .filter((x: any) => x.item_type === 2)
                            .reduce(
                              (total: any, item: any) => total + parseInt(item.final_price || 0),
                              0
                            )
                        ).toLocaleString('id')}`}</td>
                      </tr>

                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Total Material
                        </td>
                        <td className='fw-bolder'>{`Rp. ${parseInt(
                          orderDetail?.quotation[0]?.quotation_details
                            .filter((x: any) => x.item_type === 1)
                            .reduce(
                              (total: any, item: any) => total + parseInt(item.final_price || 0),
                              0
                            )
                        ).toLocaleString('id')}`}</td>
                      </tr>

                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Promosi ( Free Survey )
                        </td>
                        <td className=' fw-bolder'>
                          {`Rp. ${parseInt(
                            orderDetail?.quotation[0]?.quotation_disc ?? 0
                          ).toLocaleString('id')}`}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Additional Promosi
                        </td>
                        <td className=' fw-bolder'>{`Rp. ${parseInt(
                          orderDetail?.quotation[0]?.quotation_promotion ?? 0
                        ).toLocaleString('id')}`}</td>
                      </tr>

                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Grand Total
                        </td>

                        <td className=' fw-bolder'>
                          {`Rp. ${parseInt(
                            orderDetail?.quotation[0]?.quotation_grand_total ?? 0
                          ).toLocaleString('id')}`}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Row>
            )}
          </Skeleton>

          <Skeleton active loading={loadingModal} paragraph={{rows: 1}}>
            <Row>
              <Col md={6}>
                <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
                  <Form.Group>
                    <Form.Label>Upload Bukti Receipt Transaksi</Form.Label>

                    <Form className='form-input-image' onClick={handleReceiptClick}>
                      <Form.Control
                        type='file'
                        accept='image/jpeg, image/png'
                        className='input-field-receipt'
                        multiple
                        hidden
                        id='file-input'
                        ref={evidenceRef}
                        onChange={handleReceiptChange}
                      />

                      <div className='input-image-text'>
                        <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                        <p>Add File</p>
                      </div>
                    </Form>

                    <ListGroup className='pt-3'>
                      {receiptQuotation.length ? (
                        receiptQuotation.map((item: any, index: number) => (
                          <ListGroup>
                            <ListGroup.Item
                              className='d-flex justify-content-between align-items-center'
                              key={`${item?.name}-${index}-${item?.type}`}
                            >
                              <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                              <span
                                className='upload-content'
                                style={{cursor: 'pointer'}}
                                onClick={() => handleFileReceipt(index)}
                              >
                                {item?.name}
                              </span>

                              <FontAwesomeIcon
                                icon={faTrash}
                                size='sm'
                                color='#ed2b2a'
                                style={{cursor: 'pointer'}}
                                onClick={(e) => handleRemoveReceipt(index)}
                              />
                            </ListGroup.Item>

                            {selectedReceiptIndex === index && item && (
                              <Image
                                key={`${previewReceipt} - ${index}`}
                                width={200}
                                style={{display: 'none'}}
                                src={
                                  item instanceof File
                                    ? URL.createObjectURL(item)
                                    : `${apiUrl}/public/quotation/${previewReceipt}`
                                }
                                preview={{
                                  visible: visibleReceipt,
                                  src:
                                    item instanceof File
                                      ? URL.createObjectURL(item)
                                      : `${apiUrl}/public/quotation/${previewReceipt}`,
                                  onVisibleChange: (value) => {
                                    setVisibleReceipt(value)
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
              </Col>

              <Col md={6}>
                <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
                  <Form.Group>
                    <Form.Label>Upload Bukti Transfer</Form.Label>

                    <Form className='form-input-image' onClick={handleImageClick}>
                      <Form.Control
                        type='file'
                        accept='image/jpeg, image/png'
                        className='input-field-image'
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
                      {quotationFiles.length ? (
                        quotationFiles.map((item: any, index: number) => (
                          <ListGroup>
                            <ListGroup.Item
                              className='d-flex justify-content-between align-items-center'
                              key={`${item?.name}-${index}-${item?.type}`}
                            >
                              <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                              <span
                                className='upload-content'
                                style={{cursor: 'pointer'}}
                                onClick={() => handleFileClick(index)}
                              >
                                {item?.name}
                              </span>

                              <FontAwesomeIcon
                                icon={faTrash}
                                size='sm'
                                color='#ed2b2a'
                                style={{cursor: 'pointer'}}
                                onClick={(e) => handleRemoveFile(index)}
                              />
                            </ListGroup.Item>

                            {selectedFileIndex === index && item && (
                              <Image
                                key={`${previewImage} - ${index}`}
                                width={200}
                                style={{display: 'none'}}
                                src={
                                  item instanceof File
                                    ? URL.createObjectURL(item)
                                    : `${apiUrl}/public/quotation/${previewImage}`
                                }
                                preview={{
                                  visible: visible,
                                  src:
                                    item instanceof File
                                      ? URL.createObjectURL(item)
                                      : `${apiUrl}/public/quotation/${previewImage}`,
                                  onVisibleChange: (value) => {
                                    setVisible(value)
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
              </Col>
            </Row>

            <div className='button-submit d-flex justify-content-center align-items-center'>
              <Button
                className='d-flex justify-content-center align-items-center'
                onClick={handleUpdateQuotation}
                disabled={loadingUpdate}
                variant='dark-primary'
              >
                {loadingUpdate ? 'Submitting..' : 'Submit'}
              </Button>
            </div>
          </Skeleton>
        </Modal.Body>
      </>
    )
  }

  return (
    <section id='view-order'>
      <Card>
        <Card.Body className='table-view-order'>
          <Row className='table-head-wrapper'>
            <Stack direction='horizontal' gap={3}>
              <div className='d-flex align-items-center me-3'>
                <h3 className='fs-5 fw-normal'>Date</h3>
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

              <div className='filter-search'>
                <FormGroup>
                  <Form.Control
                    placeholder='Search'
                    className='filter-ltr'
                    onChange={handleChangeSearchFilter}
                  />

                  <span className='search-icon'>
                    <FontAwesomeIcon icon={faSearch} className='text-black' size='sm' />
                  </span>
                </FormGroup>
              </div>

              {userRole === 'Admin HO' && (
                <Select
                  name='store_id'
                  className='form-control p-0 w-50'
                  classNamePrefix='select'
                  placeholder='Pilih Toko'
                  isSearchable={true}
                  options={storeOptions}
                  value={selectedStore}
                  onChange={(newValue) => setSelectedStore(newValue)}
                />
              )}

              <Button
                className='btn-dark-primary button-submit'
                disabled={loadingButton}
                onClick={handleSubmitFilter}
              >
                {loadingButton ? 'Filtering..' : 'Submit'}
              </Button>
            </Stack>
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
                Showing {range[0]} - {range[1]} of {total} Order
              </span>
            )}
          />
        </Card.Body>
      </Card>

      {orderDetail && (
        <Modal
          dialogClassName='modal-verification'
          centered
          show={showModal}
          onHide={handleCloseModal}
        >
          {modalType === 1 && (
            <CustomerIndexModal orderDetail={orderDetail} loadingModal={loadingModal} />
          )}

          {modalType === 2 && (
            <QuotationModal
              show={showModal}
              handleClose={handleCloseModal}
              orderDetail={orderDetail}
              loadingModal={loadingModal}
              handleReceiptClick={handleReceiptClick}
              handleReceiptChange={handleReceiptChange}
              handleUpdateQuotation={handleUpdateQuotation}
              loadingUpdate={loadingUpdate}
              receiptQuotation={receiptQuotation}
              quotationFiles={quotationFiles}
              handleFileReceipt={handleFileReceipt}
              handleRemoveReceipt={handleRemoveReceipt}
              handleImageClick={handleImageClick}
              handleFileChange={handleFileChange}
              handleFileClick={handleFileClick}
              handleRemoveFile={handleRemoveFile}
            />
          )}

          {/* <Modal.Header closeButton>
            <Skeleton active loading={loadingModal} paragraph={{rows: 0}}>
              <Modal.Title>
                Verifikasi Pembayaran Quotation - Order ID {orderDetail?.id}
              </Modal.Title>
            </Skeleton>
          </Modal.Header>

          <Modal.Body>
            <Row className='mb-5'>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Skeleton active loading={loadingModal} paragraph={{rows: 1}}>
                  <Form.Label className='fs-6 fw-bold'>
                    Nama Toko :{' '}
                    <span className='fs-6 ms-2 fw-normal'>
                      {orderDetail?.store?.store_name ?? ''}
                    </span>
                  </Form.Label>
                  <br></br>
                  <Form.Label className='fs-6 fw-bold'>
                    Quotation ID :{' '}
                    <span className='fs-6 ms-2 fw-normal'>
                      {orderDetail?.quotation?.length ? orderDetail?.quotation[0]?.id : ''}
                    </span>
                  </Form.Label>
                </Skeleton>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Skeleton active loading={loadingModal} paragraph={{rows: 1}}>
                  <Form.Label className='fs-6 fw-bold'>
                    Receipt Number :
                    <span className='fs-6 ms-2 fw-normal'>
                      {orderDetail?.receipt_number ?? '-'}
                    </span>
                  </Form.Label>
                  <br></br>
                  <Form.Label className='fs-6 fw-bold'>
                    Order Status :
                    <span className='fs-6 ms-2 fw-bold text-success'>
                      {(() => {
                        if (
                          orderDetail?.status?.category === 'QUOTEIN' ||
                          orderDetail?.status?.category === 'QUOTEOUT'
                        ) {
                          return orderDetail?.status?.description
                        } else if (orderDetail?.work_orders?.work_order_status?.length > 0) {
                          return orderDetail?.work_orders?.work_order_status[0]?.status?.description
                        } else {
                          return orderDetail?.status?.description
                        }
                      })()}
                    </span>
                  </Form.Label>
                </Skeleton>
              </Col>
            </Row>

            <Row>
              <Skeleton active loading={loadingModal} paragraph={{rows: 0}}>
                <div className='fs-4 fw-bold mb-1'>Informasi Pembeli</div>
              </Skeleton>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Skeleton active loading={loadingModal} paragraph={{rows: 2}}>
                  <Form.Label className='fs-6 fw-semibold'>
                    No Member :{' '}
                    <span className='fs-6 ms-2 fw-normal'>
                      {orderDetail?.members?.member_number}
                    </span>
                  </Form.Label>
                  <br></br>
                  <Form.Label className='fs-6 fw-semibold'>
                    Customer Name :
                    <span className='fs-6 ms-2 fw-normal'>{orderDetail?.members?.full_name} </span>
                  </Form.Label>
                  <br></br>
                  <Form.Label className='fs-6 fw-semibold'>
                    Alamat Pemasangan :
                    <span className='fs-6 ms-2 fw-normal'>{orderDetail?.project_address} </span>
                  </Form.Label>
                </Skeleton>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Skeleton active loading={loadingModal} paragraph={{rows: 1}}>
                  <Form.Label className='fs-6 fw-semibold'>
                    Nomor Telp/WA :
                    <span className='fs-6 ms-2 fw-normal'>{orderDetail?.project_number}</span>
                  </Form.Label>
                  <br></br>
                  <Form.Label className='fs-6 fw-semibold'>
                    Alamat Email :
                    <span className='fs-6 ms-2 fw-normal'>{orderDetail?.members?.email} </span>
                  </Form.Label>
                </Skeleton>
              </Col>
            </Row>

            <Skeleton active loading={loadingModal} paragraph={{rows: 3}}>
              {orderDetail?.quotation?.length && (
                <Row className='information-detail'>
                  <div className='table-warranty-content'>
                    {orderDetail?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari
                          <span className='fw-bolder text-decoration-underline'> 10 KM</span> dari
                          toko sehingga dikenakan biaya tambahan
                        </Form.Text>
                      </>
                    )}

                    <table className='table hover responsive'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th className='text-center' style={{width: '355px'}}>
                            Jenis Jasa
                          </th>

                          <th className='text-center' style={{width: '80px'}}>
                            QTY
                          </th>

                          <th className='text-center' style={{width: '150px'}}>
                            Satuan
                          </th>

                          <th className='text-center' style={{width: '250px'}}>
                            Price
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {orderDetail?.quotation[0]?.quotation_details
                          .filter((x: any) => x.item_type === 2)
                          .map((item: any, index: any) => (
                            <tr key={`${index}-quotation`}>
                              <td>
                                {item?.name ?? '-'}{' '}
                                {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                              </td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>{item?.unit}</td>
                              <td>{`Rp. ${parseInt(item?.price ?? 0).toLocaleString('id')}`}</td>
                            </tr>
                          ))}

                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            Total
                          </td>

                          <td className='fw-bolder'>
                            {`Rp. ${orderDetail?.quotation[0]?.quotation_details
                              .filter((x: any) => x.item_type === 2)
                              .map((item: any) => parseInt(item?.price ?? 0))
                              .reduce((total: number, price: number) => total + price, 0)
                              .toLocaleString('id')}`}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {orderDetail?.quotation[0]?.quotation_details.filter(
                      (x: any) => x.item_type === 1
                    ).length ? (
                      <table className='table hover responsive'>
                        <thead className='table-warranty-head'>
                          <tr>
                            <th className='text-center' style={{width: '355px'}}>
                              Material Yang Dibutuhkan
                            </th>

                            <th className='text-center' style={{width: '80px'}}>
                              QTY
                            </th>

                            <th className='text-center' style={{width: '150px'}}>
                              Satuan
                            </th>

                            <th className='text-center' style={{width: '250px'}}>
                              Price
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {orderDetail?.quotation[0]?.quotation_details
                            .filter((x: any) => x.item_type === 1)
                            .map((item: any, index: any) => (
                              <tr key={`${index}-quotation`}>
                                <td>
                                  {item?.name ?? '-'}{' '}
                                  {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                                </td>
                                <td>{item?.quantity ?? 0}</td>
                                <td>{item?.unit ?? '-'}</td>
                                <td>{`Rp. ${parseInt(item?.price ?? 0).toLocaleString('id')}`}</td>
                              </tr>
                            ))}

                          <tr>
                            <td colSpan={3} className='text-end fw-bolder'>
                              Promosi ( Free Survey )
                            </td>
                            <td className=' fw-bolder'>
                              {`Rp. ${parseInt(
                                orderDetail?.quotation[0]?.quotation_disc ?? 0
                              ).toLocaleString('id')}`}
                            </td>
                          </tr>

                          {orderDetail?.is_overdistance === 1 && (
                            <>
                              <tr>
                                <td colSpan={3} className='text-end fw-bolder align-middle'>
                                  Biaya Tambahan
                                </td>

                                <td className=' fw-bolder'>{`Rp. ${Number(
                                  orderDetail?.additional_fee
                                ).toLocaleString('id')}.`}</td>
                              </tr>
                            </>
                          )}

                          <tr>
                            <td colSpan={3} className='text-end fw-bolder'>
                              Grand Total
                            </td>
                            <td className=' fw-bolder'>
                              {`Rp. ${parseInt(
                                orderDetail?.quotation[0]?.quotation_grand_total ?? 0
                              ).toLocaleString('id')}`}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <></>
                    )}
                  </div>
                </Row>
              )}
            </Skeleton>

            <Skeleton active loading={loadingModal} paragraph={{rows: 1}}>
              <Row>
                <Col md={6}>
                  <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
                    <Form.Group>
                      <Form.Label>Upload Bukti Receipt Transaksi</Form.Label>

                      <Form className='form-input-image' onClick={handleReceiptClick}>
                        <Form.Control
                          type='file'
                          accept='image/jpeg, image/png'
                          className='input-field-receipt'
                          multiple
                          hidden
                          id='file-input'
                          ref={evidenceRef}
                          onChange={handleReceiptChange}
                        />

                        <div className='input-image-text'>
                          <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                          <p>Add File</p>
                        </div>
                      </Form>

                      <ListGroup className='pt-3'>
                        {receiptQuotation.length ? (
                          receiptQuotation.map((item, index) => (
                            <ListGroup>
                              <ListGroup.Item
                                className='d-flex justify-content-between align-items-center'
                                key={`${item?.name}-${index}-${item?.type}`}
                              >
                                <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                                <span
                                  className='upload-content'
                                  style={{cursor: 'pointer'}}
                                  onClick={() => handleFileReceipt(index)}
                                >
                                  {item?.name}
                                </span>

                                <FontAwesomeIcon
                                  icon={faTrash}
                                  size='sm'
                                  color='#ed2b2a'
                                  style={{cursor: 'pointer'}}
                                  onClick={(e) => handleRemoveReceipt(index)}
                                />
                              </ListGroup.Item>

                              {selectedReceiptIndex === index && item && (
                                <Image
                                  key={`${previewReceipt} - ${index}`}
                                  width={200}
                                  style={{display: 'none'}}
                                  src={
                                    item instanceof File
                                      ? URL.createObjectURL(item)
                                      : `${apiUrl}/public/quotation/${previewReceipt}`
                                  }
                                  preview={{
                                    visible: visibleReceipt,
                                    src:
                                      item instanceof File
                                        ? URL.createObjectURL(item)
                                        : `${apiUrl}/public/quotation/${previewReceipt}`,
                                    onVisibleChange: (value) => {
                                      setVisibleReceipt(value)
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
                </Col>

                <Col md={6}>
                  <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
                    <Form.Group>
                      <Form.Label>Upload Bukti Transfer</Form.Label>

                      <Form className='form-input-image' onClick={handleImageClick}>
                        <Form.Control
                          type='file'
                          accept='image/jpeg, image/png'
                          className='input-field-image'
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
                        {quotationFiles.length ? (
                          quotationFiles.map((item, index) => (
                            <ListGroup>
                              <ListGroup.Item
                                className='d-flex justify-content-between align-items-center'
                                key={`${item?.name}-${index}-${item?.type}`}
                              >
                                <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                                <span
                                  className='upload-content'
                                  style={{cursor: 'pointer'}}
                                  onClick={() => handleFileClick(index)}
                                >
                                  {item?.name}
                                </span>

                                <FontAwesomeIcon
                                  icon={faTrash}
                                  size='sm'
                                  color='#ed2b2a'
                                  style={{cursor: 'pointer'}}
                                  onClick={(e) => handleRemoveFile(index)}
                                />
                              </ListGroup.Item>

                              {selectedFileIndex === index && item && (
                                <Image
                                  key={`${previewImage} - ${index}`}
                                  width={200}
                                  style={{display: 'none'}}
                                  src={
                                    item instanceof File
                                      ? URL.createObjectURL(item)
                                      : `${apiUrl}/public/quotation/${previewImage}`
                                  }
                                  preview={{
                                    visible: visible,
                                    src:
                                      item instanceof File
                                        ? URL.createObjectURL(item)
                                        : `${apiUrl}/public/quotation/${previewImage}`,
                                    onVisibleChange: (value) => {
                                      setVisible(value)
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
                </Col>
              </Row>

              <div className='button-submit d-flex justify-content-center align-items-center'>
                <Button
                  onClick={handleUpdateQuotation}
                  disabled={loadingUpdate}
                  variant='dark-primary'
                >
                  {loadingUpdate ? 'Submitting..' : 'Submit'}
                </Button>
              </div>
            </Skeleton>
          </Modal.Body> */}
        </Modal>
      )}
    </section>
  )
}

export {ViewOrders}
