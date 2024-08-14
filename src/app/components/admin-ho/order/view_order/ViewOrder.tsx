/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useEffect, useState, useRef} from 'react'
import axiosInstance from '../../../../../_metronic/layout/core/axiosInterceptor'
import {useNavigate} from 'react-router-dom'

import './ViewOrder.css'

import axios from 'axios'
import dayjs from 'dayjs'
import Select, {SingleValue} from 'react-select'
import type {ColumnsType} from 'antd/es/table'
import {Table, Tag, PaginationProps, Spin, Pagination, DatePicker} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
import {Image, Skeleton} from 'antd'
import Swal from 'sweetalert2'
import {
  Nav,
  Row,
  Col,
  Form,
  Button,
  FormGroup,
  Modal,
  Card,
  ListGroup,
  OverlayTrigger,
  Tooltip,
  Tab,
} from 'react-bootstrap'
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
  faPrint,
} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

interface DataType {
  order_id: number
  date_order: Date
  assign_from: string
  vendor_name: string
  no_member: number
  costumer_name: string
  phone_number: number
  payment_receipt: string
  payment_quotation: string
  order_status: string
  order_status_label: string
  work_order_status: string
  print_counter: number
}

interface StoreItem {
  value: number | null
  label: string
}

interface VendorItem {
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

interface CSI {
  value: number | null
  label: string
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
  quotation_promotion: number | null
  quotation_grand_total: number
  readiness: number
  receipt_quotation: string
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
  const userRole = localStorage.getItem('userRole') as string
  const userStore = localStorage.getItem('storeId')

  const storeId = !['Super User', 'Admin HO'].includes(userRole ?? '')
    ? `&store_id=${userStore}`
    : ''
  const userSales = userRole === 'Sales' ? `&sales_id=${salesId}` : ''

  const [loadingButton, setLoadingButton] = useState<boolean>(false)
  const [loadData, setLoadData] = useState<boolean>(true)

  const [mailLogs, setMailLogs] = useState<any>()
  const [orderDetail, setOrderDetail] = useState<any>()
  const [orderData, setOrderData] = useState<DataType[]>([])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(50)
  const [totalData, setTotalData] = useState<number>(0)
  const [queryParams, setQueryParams] = useState('')

  const [activeKey, setActiveKey] = useState<number>(1)

  const [dateFrom, setDateFrom] = useState<any>(
    ['Super User', 'Admin HO'].includes(userRole)
      ? new Date(new Date().setDate(new Date().getDate() - 14)).toISOString().split('T')[0]
      : new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
  )
  const [dateTo, setDateTo] = useState<any>(
    ['Super User', 'Admin HO'].includes(userRole)
      ? new Date().toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  )

  const [searchFilter, setSearchFilter] = useState<string>('')

  const [store, setStore] = useState<StoreItem[]>([])
  const storeOptions = [{value: null, label: 'All Store'}, ...store]
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreItem>>({
    value: null,
    label: 'All Store',
  })

  const [vendor, setVendor] = useState<VendorItem[]>([])
  const vendorOptions = [{value: null, label: 'All Vendor'}, ...vendor]
  const [selectedVendor, setSelectedVendor] = useState<SingleValue<VendorItem>>({
    value: null,
    label: 'All Vendor',
  })

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  // Status
  const storedStatus = sessionStorage.getItem('statusData')
  const statusData = storedStatus ? JSON.parse(storedStatus) : []
  const cancelOrder = statusData.find((status: any) => status.category === 'CANCEL')
  const verificationStatus = statusData.find((status: any) => status.category === 'QUOTATIONPAID')
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
          const data = response.data.data
          const emailLog = response.data.mailLogs

          setMailLogs(emailLog)
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
              quotation_promotion: data?.quotation[0]?.promotion?.id,
              quotation_grand_total: data?.quotation[0]?.quotation_grand_total,
              readiness: data?.quotation[0]?.readiness,
              receipt_quotation: data?.quotation[0]?.receipt_quotation,
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

  const getVendor = async () => {
    try {
      const response = await axios.get(`${apiUrl}/vendor?take=0`, {
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

  const getCSI = async () => {
    try {
      const response = await axios.get(`${apiUrl}/csi?take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempCSI = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        }))

        setCsiData(tempCSI)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchOrderData(null)
    getStore()
    getVendor()
    getCSI()
  }, [])

  // Modal
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [loadingModal, setLoadingModal] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<number | null>(null)
  const handleCloseModal = () => {
    setShowModal(false)
  }

  // CSI
  const [csiData, setCsiData] = useState<CSI[]>([])
  const [selectedCSI, setSelectedCSI] = useState<SingleValue<CSI>>({
    value: null,
    label: 'Pilih Format CSI',
  })

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
    quotation_promotion: null,
    quotation_grand_total: 0,
    readiness: 1,
    receipt_quotation: '',
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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [quotation.receipt_quotation])

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
    let apiUrlWithParams = `${apiUrl}/orders?order_by=desc&page=${page}&take=${pageSize}${queryparams}${storeId}${userSales}`
    if (dateFrom && dateTo) {
      apiUrlWithParams += `&date_from=${dateFrom}&date_to=${dateTo}`
    }

    try {
      const response = await axiosInstance.get(apiUrlWithParams, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      setCurrentPage(response.data.page)
      setTotalData(response.data?.total ?? 0)
      setLoadData(false)

      return response.data.data
    } catch (error: any) {
      console.log('error when fetching data', error)
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

        const phoneNumber = item?.project_number.startsWith('0')
          ? item.project_number
          : `+62${item.project_number}`

        const orderDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })

        const paymentReceipt = (() => {
          if (item?.payment_type === 'survey') {
            return item.receipt_number === null ? 'UNPAID' : 'PAID'
          } else if (item?.payment_type === 'pemasangan_tanpa_survey') {
            return item.receipt_number === null ? 'UNPAID' : 'PAID'
          } else if (item?.payment_type === 'gratis') {
            return 'FREE'
          } else {
            return ''
          }
        })()

        const paymentQuotation = (() => {
          if (item?.quotation?.length) {
            if (
              item?.quotation[0]?.receipt_quotation !== null &&
              item?.quotation[0]?.quotation_files.length
            ) {
              return 'PAID'
            } else {
              return 'UNPAID'
            }
          } else {
            return ''
          }
        })()

        // const orderStatus = (() => {
        //   if (item?.work_orders?.work_order_status?.length >= 0) {
        //     if (
        //       [
        //         'QUOTEIN',
        //         'QUOTEOUT',
        //         'CANCEL',
        //         'WARRANTYCLAIM',
        //         'INVESTIGATED',
        //         'COMPLAINTAPPROVEDBYHO',
        //         'COMPLAINTREJECTEDBYHO',
        //         'RESCHEDULE',
        //         'RESURVEYREQ',
        //         'REWORKREQ',
        //       ].includes(item?.status?.category)
        //     ) {
        //       return item?.status?.category
        //     } else if (
        //       ['WORKREQ'].includes(item?.status?.category) &&
        //       item?.payment_type === 'survey' &&
        //       !['WORKSTART', 'WORKEND'].includes(
        //         item?.work_orders?.work_order_status[0]?.status?.category
        //       )
        //     ) {
        //       return item?.status?.category
        //     } else {
        //       return item?.work_orders?.work_order_status[0]?.status?.category
        //     }
        //   } else {
        //     return item?.status?.category
        //   }
        // })()

        // const orderStatusLabel = (() => {
        //   if (item?.work_orders?.work_order_status?.length >= 0) {
        //     if (
        //       [
        //         'QUOTEIN',
        //         'QUOTEOUT',
        //         'CANCEL',
        //         'WARRANTYCLAIM',
        //         'INVESTIGATED',
        //         'RESCHEDULE',
        //         'RESURVEYREQ',
        //         'REWORKREQ',
        //       ].includes(item?.status?.category)
        //     ) {
        //       return item?.status?.description
        //     } else if (
        //       ['WORKREQ'].includes(item?.status?.category) &&
        //       item?.payment_type === 'survey' &&
        //       !['WORKSTART', 'WORKEND'].includes(
        //         item?.work_orders?.work_order_status[0]?.status?.category
        //       )
        //     ) {
        //       return item?.status?.description
        //     } else {
        //       return item?.work_orders?.work_order_status[0]?.status?.description
        //     }
        //   } else {
        //     return item?.status?.description
        //   }
        // })()

        data = {
          order_id: item.id,
          assign_from: item?.store?.store_name,
          date_order: orderDate,
          vendor_name: item?.vendor?.company_name ?? 'Vendor Belum Ditugaskan',
          no_member: item?.members?.member_number,
          costumer_name: item?.members?.full_name,
          phone_number: phoneNumber,
          payment_receipt: paymentReceipt,
          payment_quotation: paymentQuotation,
          order_status: item?.status?.category,
          order_status_label: item?.status?.description,
          print_counter: item?.print_counter ?? 0,
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
    fetchData(currentPage, pageSize, queryParams)
  }, [queryParams])

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
    valueCheck(`&vendor_id=`, selectedVendor?.value)

    setQueryParams(queryparams)
    const data = await ViewOrder(currentPage, pageSize, queryparams)
    setOrderData(data)

    setLoadingButton(false)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSubmitFilter()
    }
  }

  // Modal Handler
  const handleCancelRefund = async (type: number) => {
    setLoadingButton(true)
    const formData = new FormData()

    const appendIfNotDefault = (key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        formData.append(key, String(value))
      }
    }

    formData.append('order_id', String(orderForm?.id))
    formData.append('project_status_id', cancelOrder?.value)

    orderForm.order_details.forEach((item, index) => {
      if (item) {
        appendIfNotDefault(`order_details[${index}][id]`, item.id)
        appendIfNotDefault(`order_details[${index}][item_id]`, item.item_id)
        appendIfNotDefault(`order_details[${index}][item_code]`, item.item_code)
        appendIfNotDefault(`order_details[${index}][item_name]`, item.item_name)
        appendIfNotDefault(`order_details[${index}][item_notes]`, item.item_notes)
        appendIfNotDefault(`order_details[${index}][quantity]`, item.quantity)
      }
    })

    try {
      const response = await axios.post(`${apiUrl}/orders/${orderForm?.id}`, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Orderan berhasil dibatalkan.',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setLoadingButton(false)
          if (type === 1) {
            navigate(`/refund/new-refund/${orderForm?.id}`)
          } else if (type === 2) {
            window.location.reload()
          }
        })
      } else {
        setLoadingButton(false)
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

  // Quotation Validation
  const QuotationValidation = () => {
    let valid = true

    if (quotation.receipt_quotation === '') {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill receipt quotation form',
        icon: 'warning',
      })
      valid = false
    } else if (receiptQuotation.length === 0) {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong isi bukti receipt quotation',
        icon: 'warning',
      })
      valid = false
    } else if (quotationFiles.length === 0) {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong isi bukti transfer quotation',
        icon: 'warning',
      })
      valid = false
    }
    return valid
  }

  const handleUpdateQuotation = async () => {
    if (!QuotationValidation()) {
      setLoadingUpdate(false)
      return false
    }

    setLoadingUpdate(true)
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
    formData.append('readiness', String(4))
    formData.append('receipt_quotation', quotation.receipt_quotation)
    // formData.append('quotation_promotion', String(quotation.quotation_promotion))

    if (quotation.quotation_promotion !== null) {
      formData.append('promotion_id', String(quotation.quotation_promotion))
    }

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
          formData.append(`preserve_files[${index}]`, item.id)
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
            text: 'Berhasil Verifikasi Pembayaran',
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

        setTimeout(() => {
          window.location.reload()
        }, 2000)
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

  const handleTriggerEmail = async () => {
    if (orderDetail?.members?.email === '') {
      Swal.fire({
        title: 'Member ini tidak mempunyai email sehingga tidak dapat mengirimkan email',
        icon: 'warning',
        showConfirmButton: true,
        showDenyButton: false,
        confirmButtonColor: '#6b9230',
        confirmButtonText: 'Ok',
      })

      return false
    }

    Swal.fire({
      title: 'Apakah anda yakin ingin mengirim email berisi formulir csi kepada customer?',
      icon: 'question',
      showConfirmButton: true,
      confirmButtonColor: '#6b9230',
      cancelButtonColor: '#d33',
      showDenyButton: true,
      confirmButtonText: 'Ya',
      denyButtonText: 'Tidak',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${apiUrl}/csi/${selectedCSI?.value}/send/${orderDetail?.id}`,
            null,
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Access-Control-Allow-Origin': '*',
                'ngrok-skip-browser-warning': 'true',
              },
            }
          )

          if (response.data.status === 200 || response.data.status === 201) {
            Swal.fire({
              title: 'Success',
              text: 'Success Send Email',
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
        } catch (error: any) {
          setLoadingUpdate(false)
          Swal.fire({
            title: 'Error',
            text: error.response.data.message,
            icon: 'error',
          })
        }
      }
    })
  }

  // CSI Modal
  const CustomerIndexModal = ({orderDetail, loadingModal, mailLogs}: any) => {
    return (
      <>
        <Modal.Header closeButton>
          <Skeleton active loading={loadingModal} paragraph={{rows: 0}}>
            <Modal.Title>History Aktivitas Email - Order ID {orderDetail?.id}</Modal.Title>
          </Skeleton>
        </Modal.Header>

        <Modal.Body>
          <Tab.Container activeKey={activeKey} onSelect={(key) => setActiveKey(Number(key))}>
            <Nav fill variant='tabs' className='mt-2 mb-5'>
              <Nav.Item style={{cursor: 'pointer'}}>
                <Nav.Link eventKey={1}>Log Aktivitas Email</Nav.Link>
              </Nav.Item>

              {!['Sales', 'Store CS'].includes(userRole) && (
                <Nav.Item style={{cursor: 'pointer'}}>
                  <Nav.Link eventKey={2}>Kirim Email CSI</Nav.Link>
                </Nav.Item>
              )}
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey={1}>
                <div className='fs-6 mb-3'>
                  *Informasi yang tertera pada tabel dibawah ini adalah informasi mengenai aktivitas
                  email yang telah dikirimkan oleh sistem
                </div>

                <table className='table hover responsive'>
                  <thead className='table-warranty-head'>
                    <tr>
                      <th>Judul Email</th>
                      <th>Waktu dan Tanggal Email Dikirimkan</th>
                    </tr>
                  </thead>

                  <tbody>
                    {mailLogs?.map((item: any, index: any) => (
                      <>
                        <tr key={`${index} - email_log`}>
                          <td>{item?.emailMessages?.title}</td>
                          <td>
                            {new Date(item?.createdAt).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                            })}
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </Tab.Pane>

              <Tab.Pane eventKey={2}>
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
                      {orderDetail?.quotation[0]?.receipt_quotation && (
                        <>
                          <Form.Label className='fs-6 fw-bold'>
                            Receipt Transaksi :
                            <span className='fs-6 ms-2 fw-normal'>
                              {orderDetail?.quotation[0]?.receipt_quotation}
                            </span>
                          </Form.Label>
                          <br></br>
                        </>
                      )}
                      <Form.Label className='fs-6 fw-bold'>
                        Order Status :
                        <span className='fs-6 ms-2 fw-bold text-success'>
                          {orderDetail?.status?.description}
                        </span>
                      </Form.Label>
                    </Skeleton>
                  </Col>
                </Row>

                <Row className='mb-5'>
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
                        <span className='fs-6 ms-2 fw-normal'>
                          {orderDetail?.members?.full_name}{' '}
                        </span>
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
                  {(() => {
                    if (
                      (orderDetail?.payment_type === 'survey' &&
                        orderDetail?.work_orders === null) ||
                      (orderDetail?.work_orders?.work_order_status.length === 1 &&
                        orderDetail?.payment_type === 'survey')
                    ) {
                      return (
                        <div className='table-warranty-content'>
                          {orderDetail?.is_overdistance === 1 && (
                            <>
                              <Form.Text className='fs-8 text-dark'>
                                *Order ini lebih dari{' '}
                                <span className='fw-bolder text-decoration-underline'>10 KM</span>{' '}
                                dari toko sehingga dikenakan biaya tambahan
                              </Form.Text>
                            </>
                          )}

                          <table className='table hover responsive'>
                            <thead className='table-warranty-head'>
                              <tr>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th>Nama Pemasangan</th>
                                <th>QTY Pemasangan</th>
                              </tr>
                            </thead>

                            <tbody>
                              {orderDetail?.order_details.map((item: any, index: any) => (
                                <>
                                  <tr key={`${index} - order_detail`}>
                                    <td>{item?.item_code}</td>
                                    <td>{item?.item_name}</td>
                                    <td>{item?.item_notes}</td>
                                    <td>{item?.quantity ?? 0}</td>
                                  </tr>
                                </>
                              ))}

                              <tr>
                                <td colSpan={3} className='text-end fw-bolder'>
                                  Biaya Survey
                                </td>

                                <td className=' fw-bolder'>Rp. 99.000</td>
                              </tr>

                              {orderDetail?.is_overdistance === 1 && (
                                <>
                                  <tr>
                                    <td colSpan={3} className='text-end fw-bolder align-middle'>
                                      Biaya Tambahan
                                    </td>

                                    <td className=' fw-bolder'>{`Rp. ${Number(
                                      orderDetail?.additional_fee
                                    ).toLocaleString('id')}`}</td>
                                  </tr>

                                  <tr>
                                    <td colSpan={3} className='text-end fw-bolder'>
                                      Grand Total
                                    </td>

                                    <td className=' fw-bolder'>{`Rp. ${Number(
                                      orderDetail?.grand_total
                                    ).toLocaleString('id')}`}</td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )
                    } else if (
                      ['SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE'].includes(
                        orderDetail?.work_orders?.work_order_status[0]?.status?.category
                      ) &&
                      orderDetail?.payment_type === 'survey' &&
                      orderDetail?.work_orders?.work_order_status.length >= 1 &&
                      orderDetail?.quotation?.length === 0
                    ) {
                      return (
                        <div className='table-warranty-content'>
                          <table className='table hover responsive'>
                            <thead className='table-warranty-head'>
                              <tr>
                                <th>Nama Pemasangan</th>
                                <th>QTY Pemasangan</th>
                                <th>Satuan</th>
                              </tr>
                            </thead>

                            <tbody>
                              {orderDetail?.work_orders?.work_order_status[0]?.work_order_items
                                .length ? (
                                orderDetail.work_orders.work_order_status[0].work_order_items.map(
                                  (item: any, index: any) => (
                                    <tr key={`${index}-work_order_detail`}>
                                      <td>
                                        {item.name ?? ''}{' '}
                                        {item.is_customer ? '( Disediakan oleh customer )' : ''}
                                      </td>
                                      <td>{item.quantity ?? 0}</td>
                                      <td>{item.unit ?? ''}</td>
                                    </tr>
                                  )
                                )
                              ) : (
                                <tr>
                                  <td>Item belum diset oleh Tukang/Vendor</td>
                                  <td>Quantity belum diset oleh Tukang/Vendor</td>
                                  <td>Satuan belum diset oleh Tukang/Vendor</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )
                    } else if (
                      orderDetail?.work_orders?.work_order_status.length >= 1 &&
                      orderDetail?.quotation?.length >= 1 &&
                      orderDetail?.payment_type === 'survey'
                    ) {
                      return (
                        <div className='table-warranty-content'>
                          <table className='table hover responsive'>
                            <thead className='table-warranty-head'>
                              <tr>
                                <th className='text-center' style={{width: '355px'}}>
                                  Jenis Jasa
                                </th>

                                <th className='text-center' style={{width: '100px'}}>
                                  QTY
                                </th>

                                <th className='text-center' style={{width: '250px'}}>
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
                                      {item?.is_customer === true
                                        ? '( Disediakan oleh customer )'
                                        : ''}
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

                                <th className='text-center' style={{width: '100px'}}>
                                  QTY
                                </th>

                                <th className='text-center' style={{width: '250px'}}>
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
                                      {item?.is_customer === true
                                        ? '( Disediakan oleh customer )'
                                        : ''}
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
                                      (total: any, item: any) =>
                                        total + parseInt(item.final_price || 0),
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
                                      (total: any, item: any) =>
                                        total + parseInt(item.final_price || 0),
                                      0
                                    )
                                ).toLocaleString('id')}`}</td>
                              </tr>

                              <tr>
                                <td colSpan={3} className='text-end fw-bolder'>
                                  Promosi
                                </td>
                                <td className=' fw-bolder'>
                                  {`Rp. ${parseInt(
                                    orderDetail?.quotation[0]?.quotation_disc ?? 0
                                  ).toLocaleString('id')}`}
                                </td>
                              </tr>

                              <tr>
                                <td colSpan={3} className='text-end fw-bolder'>
                                  {`${
                                    orderDetail?.quotation[0]?.promotion
                                      ? `Additional Promotion (${orderDetail?.quotation[0]?.promotion?.name})`
                                      : `Additional Promotion`
                                  }`}
                                </td>

                                <td className=' fw-bolder'>
                                  {orderDetail?.quotation[0]?.promotion?.promotion_type === 1
                                    ? `${orderDetail?.quotation[0]?.promotion?.promotion} %`
                                    : `Rp. ${parseInt(
                                        orderDetail?.quotation[0]?.promotion?.promotion ?? 0
                                      ).toLocaleString('id')}`}
                                </td>
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
                      )
                    } else if (
                      orderDetail?.payment_type === 'gratis' ||
                      orderDetail?.payment_type === 'pemasangan_tanpa_survey'
                    ) {
                      return (
                        <div className='table-warranty-content'>
                          {orderDetail?.is_overdistance === 1 && (
                            <>
                              <Form.Text className='fs-8 text-dark'>
                                *Order ini lebih dari{' '}
                                <span className='fw-bolder text-decoration-underline'>10 KM</span>{' '}
                                dari toko sehingga dikenakan biaya tambahan
                              </Form.Text>
                            </>
                          )}

                          <table className='table hover responsive'>
                            <thead className='table-warranty-head'>
                              <tr>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th>Nama Pemasangan</th>
                                <th>QTY Pemasangan</th>
                                {!(orderDetail?.payment_type === 'gratis') && (
                                  <>
                                    <th>Harga Jasa</th>
                                    <th>Jumlah</th>
                                  </>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {orderDetail?.order_details.map((item: any, index: any) => (
                                <>
                                  <tr key={`${index} - order_detail`}>
                                    <td>{item?.item_code}</td>
                                    <td>{item?.item_name}</td>
                                    <td>{item?.item?.service_name}</td>
                                    <td>{item?.quantity ?? 0}</td>
                                    {!(orderDetail?.payment_type === 'gratis') && (
                                      <>
                                        <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString(
                                          'id'
                                        )}`}</td>
                                        <td>{`Rp. ${parseInt(item?.total || 0).toLocaleString(
                                          'id'
                                        )}`}</td>
                                      </>
                                    )}
                                  </tr>
                                </>
                              ))}

                              {orderDetail?.is_overdistance === 1 && (
                                <>
                                  <tr>
                                    <td
                                      colSpan={orderDetail?.payment_type !== 'gratis' ? 5 : 3}
                                      className='text-end fw-bolder align-middle'
                                    >
                                      Biaya Tambahan
                                    </td>

                                    <td className=' fw-bolder'>{`Rp. ${Number(
                                      orderDetail?.additional_fee
                                    ).toLocaleString('id')}`}</td>
                                  </tr>
                                </>
                              )}

                              <tr>
                                <td
                                  colSpan={orderDetail?.payment_type !== 'gratis' ? 5 : 3}
                                  className='text-end fw-bolder'
                                >
                                  Grand Total
                                </td>

                                <td className=' fw-bolder'>{`Rp. ${Number(
                                  orderDetail?.grand_total
                                ).toLocaleString('id')}`}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )
                    }
                  })()}
                </Skeleton>

                <Row className='mt-5 mb-5'>
                  <Skeleton active loading={loadingModal} paragraph={{rows: 1}}>
                    <Form.Group className='header-template mb-4'>
                      <Form.Label className='fs-5'>Pilih Format Formulir CSI :</Form.Label>
                      <Select
                        className='form-control p-0'
                        isSearchable={true}
                        placeholder='Pilih Judul Format'
                        options={csiData}
                        value={{
                          label: selectedCSI?.label ?? '',
                          value: selectedCSI?.value ?? null,
                        }}
                        onChange={(newValue) => setSelectedCSI(newValue)}
                      />
                    </Form.Group>
                  </Skeleton>
                </Row>

                <Skeleton active loading={loadingModal} paragraph={{rows: 1}}>
                  <div className='button-submit d-flex justify-content-center align-items-center'>
                    <Button
                      className='d-flex justify-content-center align-items-center'
                      onClick={handleTriggerEmail}
                      disabled={
                        orderDetail?.members?.email === '' ? true : loadingUpdate ? true : false
                      }
                      variant='dark-primary'
                    >
                      {orderDetail?.members?.email === ''
                        ? 'Tidak dapat mengirim email karena user tidak mempunyai email'
                        : loadingUpdate
                        ? 'Submitting..'
                        : 'Submit'}
                    </Button>
                  </div>
                </Skeleton>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
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
                {orderDetail?.quotation[0]?.receipt_quotation && (
                  <>
                    <Form.Label className='fs-6 fw-bold'>
                      Receipt Quotation :
                      <span className='fs-6 ms-2 fw-normal'>
                        {orderDetail?.quotation[0]?.receipt_quotation}
                      </span>
                    </Form.Label>
                    <br></br>
                  </>
                )}
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
                          Promosi
                        </td>
                        <td className=' fw-bolder'>
                          {`Rp. ${parseInt(
                            orderDetail?.quotation[0]?.quotation_disc ?? 0
                          ).toLocaleString('id')}`}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          {`${
                            orderDetail?.quotation[0]?.promotion
                              ? `Additional Promotion (${orderDetail?.quotation[0]?.promotion?.name})`
                              : `Additional Promotion`
                          }`}
                        </td>

                        <td className=' fw-bolder'>
                          {orderDetail?.quotation[0]?.promotion?.promotion_type === 1
                            ? `${orderDetail?.quotation[0]?.promotion?.promotion ?? 0} %`
                            : `Rp. ${parseInt(
                                orderDetail?.quotation[0]?.promotion?.promotion ?? 0
                              ).toLocaleString('id')}`}
                        </td>
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
              <Form.Group className='mb-5'>
                <Form.Label className='title'>Receipt Quotation</Form.Label>
                <Form.Control
                  ref={inputRef}
                  type='text'
                  placeholder='Isi nomor receipt transaksi..'
                  value={quotation.receipt_quotation}
                  onChange={(e) =>
                    setQuotation((prev) => ({
                      ...prev,
                      receipt_quotation: e.target.value,
                    }))
                  }
                />
              </Form.Group>
            </Row>

            <Row>
              <Col md={6}>
                <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
                  <Form.Group>
                    <Form.Label>Upload Bukti Receipt Quotation</Form.Label>

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
                    <Form.Label>Upload Bukti Transfer Quotation</Form.Label>

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

  // Refund Modal
  const RefundModal = ({orderDetail, loadingModal}: any) => {
    return (
      <>
        <Modal.Header closeButton>
          <Skeleton active loading={loadingModal} paragraph={{rows: 0}}>
            <Modal.Title>Permintaan Refund - Order ID {orderDetail?.id}</Modal.Title>
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

          <Row className='mb-5'>
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
            {(() => {
              if (
                (orderDetail?.payment_type === 'survey' && orderDetail?.work_orders === null) ||
                (orderDetail?.work_orders?.work_order_status.length === 1 &&
                  orderDetail?.payment_type === 'survey')
              ) {
                return (
                  <div className='table-warranty-content'>
                    {orderDetail?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari{' '}
                          <span className='fw-bolder text-decoration-underline'>10 KM</span> dari
                          toko sehingga dikenakan biaya tambahan
                        </Form.Text>
                      </>
                    )}

                    <table className='table hover responsive'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Nama Pemasangan</th>
                          <th>QTY Pemasangan</th>
                        </tr>
                      </thead>

                      <tbody>
                        {orderDetail?.order_details.map((item: any, index: any) => (
                          <>
                            <tr key={`${index} - order_detail`}>
                              <td>{item?.item_code}</td>
                              <td>{item?.item_name}</td>
                              <td>{item?.item_notes}</td>
                              <td>{item?.quantity ?? 0}</td>
                            </tr>
                          </>
                        ))}

                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            Biaya Survey
                          </td>

                          <td className=' fw-bolder'>Rp. 99.000</td>
                        </tr>

                        {orderDetail?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td colSpan={3} className='text-end fw-bolder align-middle'>
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                orderDetail?.additional_fee
                              ).toLocaleString('id')}`}</td>
                            </tr>

                            <tr>
                              <td colSpan={3} className='text-end fw-bolder'>
                                Grand Total
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                orderDetail?.grand_total
                              ).toLocaleString('id')}`}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                )
              } else if (
                ['QUOTEIN', 'QUOTEOUT'].includes(orderDetail?.status?.category ?? '') &&
                orderDetail?.payment_type === 'survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    <table className='table hover responsive'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th className='text-center' style={{width: '355px'}}>
                            Jenis Jasa
                          </th>

                          <th className='text-center' style={{width: '100px'}}>
                            QTY
                          </th>

                          <th className='text-center' style={{width: '250px'}}>
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

                    {orderDetail?.quotation[0]?.quotation_details.filter(
                      (x: any) => x.item_type === 1
                    ).length ? (
                      <table className='table hover responsive'>
                        <thead className='table-warranty-head'>
                          <tr>
                            <th className='text-center' style={{width: '355px'}}>
                              Material Yang Dibutuhkan
                            </th>

                            <th className='text-center' style={{width: '100px'}}>
                              QTY
                            </th>

                            <th className='text-center' style={{width: '250px'}}>
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
                                  (total: any, item: any) =>
                                    total + parseInt(item.final_price || 0),
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
                                  (total: any, item: any) =>
                                    total + parseInt(item.final_price || 0),
                                  0
                                )
                            ).toLocaleString('id')}`}</td>
                          </tr>

                          <tr>
                            <td colSpan={3} className='text-end fw-bolder'>
                              Promosi
                            </td>
                            <td className=' fw-bolder'>
                              {`Rp. ${parseInt(
                                orderDetail?.quotation[0]?.quotation_disc ?? 0
                              ).toLocaleString('id')}`}
                            </td>
                          </tr>

                          <tr>
                            <td colSpan={3} className='text-end fw-bolder'>
                              {`${
                                orderDetail?.quotation[0]?.promotion
                                  ? `Additional Promotion (${orderDetail?.quotation[0]?.promotion?.name})`
                                  : `Additional Promotion`
                              }`}
                            </td>

                            <td className=' fw-bolder'>
                              {orderDetail?.quotation[0]?.promotion?.promotion_type === 1
                                ? `${orderDetail?.quotation[0]?.promotion?.promotion} %`
                                : `Rp. ${parseInt(
                                    orderDetail?.quotation[0]?.promotion?.promotion
                                  ).toLocaleString('id')}`}
                            </td>
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
                    ) : (
                      <></>
                    )}
                  </div>
                )
              } else if (
                ['SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE', 'WORKEND', 'DONE'].includes(
                  orderDetail?.work_orders?.work_order_status[0]?.status?.category
                ) &&
                orderDetail?.payment_type === 'survey' &&
                orderDetail?.work_orders?.work_order_status.length >= 1
              ) {
                return (
                  <div className='table-warranty-content'>
                    <table className='table hover responsive'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th>Nama Pemasangan</th>
                          <th>QTY Pemasangan</th>
                          <th>Satuan</th>
                        </tr>
                      </thead>

                      <tbody>
                        {orderDetail?.work_orders?.work_order_status[0]?.work_order_items.length ? (
                          orderDetail.work_orders.work_order_status[0].work_order_items.map(
                            (item: any, index: any) => (
                              <tr key={`${index}-work_order_detail`}>
                                <td>
                                  {item.name ?? ''}{' '}
                                  {item.is_customer ? '( Disediakan oleh customer )' : ''}
                                </td>
                                <td>{item.quantity ?? 0}</td>
                                <td>{item.unit ?? ''}</td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td>Item belum diset oleh Tukang/Vendor</td>
                            <td>Quantity belum diset oleh Tukang/Vendor</td>
                            <td>Satuan belum diset oleh Tukang/Vendor</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )
              } else if (
                orderDetail?.payment_type === 'gratis' ||
                orderDetail?.payment_type === 'pemasangan_tanpa_survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    {orderDetail?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari{' '}
                          <span className='fw-bolder text-decoration-underline'>10 KM</span> dari
                          toko sehingga dikenakan biaya tambahan
                        </Form.Text>
                      </>
                    )}

                    <table className='table hover responsive'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Nama Pemasangan</th>
                          <th>QTY Pemasangan</th>
                          {!(orderDetail?.payment_type === 'gratis') && (
                            <>
                              <th>Harga Jasa</th>
                              <th>Jumlah</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetail?.order_details.map((item: any, index: any) => (
                          <>
                            <tr key={`${index} - order_detail`}>
                              <td>{item?.item_code}</td>
                              <td>{item?.item_name}</td>
                              <td>{item?.item?.service_name}</td>
                              <td>{item?.quantity ?? 0}</td>
                              {!(orderDetail?.payment_type === 'gratis') && (
                                <>
                                  <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString(
                                    'id'
                                  )}`}</td>
                                  <td>{`Rp. ${parseInt(item?.total || 0).toLocaleString(
                                    'id'
                                  )}`}</td>
                                </>
                              )}
                            </tr>
                          </>
                        ))}

                        {orderDetail?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td
                                colSpan={orderDetail?.payment_type !== 'gratis' ? 5 : 3}
                                className='text-end fw-bolder align-middle'
                              >
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                orderDetail?.additional_fee
                              ).toLocaleString('id')}`}</td>
                            </tr>
                          </>
                        )}

                        <tr>
                          <td
                            colSpan={orderDetail?.payment_type !== 'gratis' ? 5 : 3}
                            className='text-end fw-bolder'
                          >
                            Grand Total
                          </td>

                          <td className=' fw-bolder'>{`Rp. ${Number(
                            orderDetail?.grand_total
                          ).toLocaleString('id')}`}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )
              }
            })()}
          </Skeleton>

          <Skeleton active loading={loadingModal} paragraph={{rows: 1}}>
            <div className='button-submit d-flex justify-content-center align-items-center'>
              <Button
                className='d-flex justify-content-center align-items-center'
                onClick={() => handleCancelRefund(1)}
                variant='dark-primary'
              >
                Cancel & Refund
              </Button>

              <Button
                className='d-flex justify-content-center align-items-center'
                onClick={() => handleCancelRefund(2)}
                variant='dark-primary'
              >
                Cancel & Not Refund
              </Button>
            </div>
          </Skeleton>
        </Modal.Body>
      </>
    )
  }

  // Export PDF Quotation
  const exportToPDF = (order_id: number, receipt_quotation: string, customer_name: string) => {
    axios
      .get(`${apiUrl}/orders/quotation-pdf/${order_id}`, {
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
        link.setAttribute(
          'download',
          `Quotation ${
            receipt_quotation === 'UNPAID' ? 'Belum Dibayar' : 'Sudah Dibayar'
          } - ${customer_name} - Order ID ${order_id}.pdf`
        )
        document.body.appendChild(link)
        link.click()
      })
      .catch((error: any) => {
        Swal.fire('Error', 'Terjadi kesalahan saat mengekspor data', 'error')
      })
  }

  const renderTooltip = (title: string) => <Tooltip id='button-tooltip'>{title}</Tooltip>

  const columns: ColumnsType<DataType> = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      className: 'col_order_id',
      defaultSortOrder: 'descend',
      width: 100,
      sorter: (a: DataType, b: DataType) => a.order_id - b.order_id,
    },
    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'left',
      sorter: (a: DataType, b: DataType) =>
        new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
    },
    !['Store Staff', 'Store CS'].includes(userRole) && {
      title: 'Nama Toko',
      dataIndex: 'assign_from',
      key: 'assign_from',
      align: 'left',
      className: 'col_order_id',
      width: 120,
      onFilter: (value: DataType, record: DataType) => record.assign_from.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.assign_from.length - b.assign_from.length,
    },
    {
      title: 'Nama Vendor',
      dataIndex: 'vendor_name',
      key: 'vendor_name',
      align: 'center',
      className: 'col_order_id',
      onFilter: (value: DataType, record: DataType) => record.vendor_name.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.vendor_name.length - b.vendor_name.length,
    },
    {
      title: 'Nama Customer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 140,
      onFilter: (value: DataType, record: DataType) => record.costumer_name.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.costumer_name.length - b.costumer_name.length,
    },
    {
      title: 'No. Telp / WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'left',
      width: 120,
      sorter: (a: DataType, b: DataType) => a.phone_number - b.phone_number,
    },
    {
      title: 'Status Pembayaran Receipt',
      dataIndex: 'payment_receipt',
      key: 'payment_receipt',
      align: 'left',
      width: 200,
      onFilter: (value: DataType, record: DataType) =>
        record.payment_receipt.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.payment_receipt.length - b.payment_receipt.length,
      filters: [
        {text: 'FREE', value: 'FREE'},
        {text: 'UNPAID', value: 'UNPAID'},
        {text: 'PAID', value: 'PAID'},
      ],
    },
    {
      title: 'Status Order',
      dataIndex: 'order_status_label',
      key: 'order_status_label',
      align: 'left',
      filters: statusFilters,
      render: (order_status_label: any) => {
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
      onFilter: (value: DataType, record: DataType) =>
        record.order_status_label.includes(String(value)),
      sorter: (a: DataType, b: DataType) =>
        a.order_status_label.length - b.order_status_label.length,
    },
    {
      title: 'Status Pembayaran Quotation',
      dataIndex: 'payment_quotation',
      key: 'payment_quotation',
      align: 'left',
      width: 230,
      onFilter: (value: DataType, record: DataType) =>
        record.payment_quotation.includes(String(value)),
      sorter: (a: DataType, b: DataType) => a.payment_quotation.length - b.payment_quotation.length,
      filters: [
        {text: 'UNPAID', value: 'UNPAID'},
        {text: 'PAID', value: 'PAID'},
      ],
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      fixed: 'right',
      render: (record: any) => {
        const id = record.order_id
        const handlePrintout = (status: string) => {
          if (['PICKLIST'].includes(status)) {
            navigate(`/order/printout-order-picklist/${id}`)
          } else if (
            ['BOOK', 'BOOKED', 'SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE'].includes(status)
          ) {
            navigate(`/order/printout-order-dipesan/${id}`)
          }
        }

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
            {['PICKLIST', 'BOOK', 'BOOKED', 'SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE'].includes(
              record.order_status
            ) &&
              !['Admin HO', 'Super User'].includes(userRole) && (
                <OverlayTrigger
                  placement='bottom'
                  delay={{show: 250, hide: 400}}
                  overlay={renderTooltip(
                    `${record.print_counter === 0 ? 'Print Order' : 'Reprint Order'}`
                  )}
                >
                  <Button
                    className='button-request'
                    variant='warning'
                    onClick={() => handlePrintout(record.order_status)}
                  >
                    <FontAwesomeIcon className='text-white' icon={faPrint} fontSize={'13px'} />
                  </Button>
                </OverlayTrigger>
              )}

            {!['Sales', 'Admin HO', 'Super User'].includes(userRole) && (
              <>
                {['BOOK', 'BOOKED'].includes(record.order_status) && (
                  <OverlayTrigger
                    placement='bottom'
                    delay={{show: 250, hide: 400}}
                    overlay={renderTooltip('Cancel Order')}
                  >
                    <Button
                      className='button-cancel'
                      variant='danger'
                      onClick={() => handleShowModal(id, 3)}
                    >
                      <FontAwesomeIcon
                        className='text-white'
                        icon={faXmarkCircle}
                        fontSize={'13px'}
                      />
                    </Button>
                  </OverlayTrigger>
                )}
              </>
            )}

            {['Super User', 'Admin HO'].includes(userRole) ? (
              <OverlayTrigger
                placement='bottom'
                delay={{show: 250, hide: 400}}
                overlay={renderTooltip('Cancel Order')}
              >
                <Button
                  className='button-cancel'
                  variant='danger'
                  onClick={() => handleShowModal(id, 3)}
                >
                  <FontAwesomeIcon className='text-white' icon={faXmarkCircle} fontSize={'13px'} />
                </Button>
              </OverlayTrigger>
            ) : (
              <></>
            )}

            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Detail Order')}
            >
              <Button variant='primary' className='button-detail' onClick={handleDetailId}>
                <FontAwesomeIcon className='text-white' icon={faBook} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>

            {!['Sales'].includes(userRole) && (
              <>
                {['PICKLIST', 'BOOK', 'BOOKED'].includes(record.order_status) && (
                  <OverlayTrigger
                    placement='bottom'
                    delay={{show: 250, hide: 400}}
                    overlay={renderTooltip('Update Order')}
                  >
                    <Button variant='primary' className='button-edit' onClick={handleUpdateId}>
                      <FontAwesomeIcon className='text-white' icon={faPen} fontSize={'13px'} />
                    </Button>
                  </OverlayTrigger>
                )}
              </>
            )}

            {['WORKREQ', 'SURVEYREQ', 'QUOTEOUT', 'QUOTATIONPAID'].includes(record.order_status) &&
            ['Super User', 'Admin HO'].includes(userRole) ? (
              <OverlayTrigger
                placement='bottom'
                delay={{show: 250, hide: 400}}
                overlay={renderTooltip('Update Order')}
              >
                <Button variant='primary' className='button-edit' onClick={handleUpdateId}>
                  <FontAwesomeIcon className='text-white' icon={faPen} fontSize={'13px'} />
                </Button>
              </OverlayTrigger>
            ) : (
              <></>
            )}

            <OverlayTrigger
              placement='bottom'
              delay={{show: 250, hide: 400}}
              overlay={renderTooltip('Aktivitas Email')}
            >
              <Button
                variant='success'
                className='button-email'
                onClick={() => {
                  handleShowModal(id, 1)
                  setActiveKey(1)
                  setSelectedCSI({
                    value: null,
                    label: 'Pilih Format CSI',
                  })
                }}
              >
                <FontAwesomeIcon className='text-white' icon={faEnvelope} fontSize={'13px'} />
              </Button>
            </OverlayTrigger>

            {['QUOTEOUT'].includes(record.order_status) && userRole === 'Store CS' ? (
              <OverlayTrigger
                placement='bottom'
                delay={{show: 250, hide: 400}}
                overlay={renderTooltip('Verifikasi Pembayaran Quotation')}
              >
                <Button
                  variant='primary'
                  className='button-verif'
                  onClick={() => handleShowModal(id, 2)}
                >
                  <FontAwesomeIcon className='text-white' icon={faCheckCircle} fontSize={'13px'} />
                </Button>
              </OverlayTrigger>
            ) : (
              <></>
            )}

            {['QUOTEIN', 'UNPAID', 'PAID', 'QUOTEOUT', 'QUOTATIONPAID'].includes(
              record.order_status
            ) && (
              <OverlayTrigger
                placement='bottom'
                delay={{show: 250, hide: 400}}
                overlay={renderTooltip('Cetak PDF Quotation')}
              >
                <Button
                  className='button-request'
                  variant='warning'
                  onClick={() =>
                    exportToPDF(record.order_id, record.payment_quotation, record.costumer_name)
                  }
                >
                  <FontAwesomeIcon className='text-white' icon={faPrint} fontSize={'13px'} />
                </Button>
              </OverlayTrigger>
            )}
          </div>
        )
      },
    },
  ].filter(Boolean) as ColumnsType<DataType>

  return (
    <section id='view-order'>
      <Card>
        <Card.Body className='table-view-order'>
          <Row className='table-head-wrapper'>
            <div
              className='d-flex flex-column flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row align-items-start align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center justify-content-start gap-3'
              onKeyDown={handleKeyPress}
            >
              <h3 className='d-flex align-items-center fs-5 fw-normal'>Date</h3>

              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range'
                defaultValue={
                  ['Super User', 'Admin HO'].includes(userRole)
                    ? [dayjs().subtract(14, 'day'), dayjs()]
                    : [dayjs().subtract(7, 'day'), dayjs()]
                }
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

              {['Super User', 'Admin HO'].includes(userRole ?? '') && (
                <Select
                  name='store_id'
                  className='form-control p-0 w-25'
                  classNamePrefix='select'
                  placeholder='Pilih Toko'
                  isSearchable={true}
                  options={storeOptions}
                  value={selectedStore}
                  onChange={(newValue) => setSelectedStore(newValue)}
                />
              )}

              {['Super User', 'Admin HO'].includes(userRole ?? '') && (
                <Select
                  name='store_id'
                  className='form-control p-0 w-25'
                  classNamePrefix='select'
                  placeholder='Pilih Vendor'
                  isSearchable={true}
                  options={vendorOptions}
                  value={selectedVendor}
                  onChange={(newValue) => setSelectedVendor(newValue)}
                />
              )}

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
            indicator={<LoadingOutlined style={{fontSize: 24}} spin rev />}
          >
            <div className='table-custom-wrapper'>
              <Table
                className='table-striped-rows'
                bordered
                columns={columns}
                dataSource={orderData}
                rowKey={(record) => record.order_id}
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
              {Math.min(currentPage * pageSize, totalData)} of {totalData} Orders
            </span>

            <Pagination
              className='pagination'
              current={currentPage}
              total={totalData}
              showSizeChanger
              pageSizeOptions={[5, 10, 20, 50, 100]}
              itemRender={itemRender}
              defaultPageSize={pageSize}
              onShowSizeChange={(current, size) => {
                setPageSize(size)
              }}
              onChange={(page, pageSize) => {
                setCurrentPage(page)
                fetchData(page, pageSize, queryParams)
              }}
            />
          </div>
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
            <CustomerIndexModal
              mailLogs={mailLogs}
              orderDetail={orderDetail}
              loadingModal={loadingModal}
            />
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

          {modalType === 3 && <RefundModal orderDetail={orderDetail} loadingModal={loadingModal} />}
        </Modal>
      )}
    </section>
  )
}

export {ViewOrders}
