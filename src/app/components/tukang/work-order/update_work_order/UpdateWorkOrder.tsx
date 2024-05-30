import React, {FC, useState, useEffect, useRef} from 'react'
import {WorkOrder} from '../../../../interfaces/work-order'

import './UpdateWorkOrder.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import dayjs from 'dayjs'
import {Image, DatePicker} from 'antd'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Button, Card, Row, Col, ListGroup, Table} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faFileArrowUp, faPlus} from '@fortawesome/free-solid-svg-icons'
const {RangePicker} = DatePicker

interface StatusStorage {
  value: number
  category: string
  description: string
}

interface Tukang {
  value: number | null
  label: string
  type: number
}

interface WorkOrders {
  id: number | null
  work_order_status: number | null
  description: string
  tukang_id: Array<any>
  survey_date_time: string
  work_date_time: string
  work_start_date: string
  work_end_date: string
  work_order_before: Array<any>
  work_order_after: Array<any>
}

interface WorkOrderItem {
  id: number | null
  index: string
  item_name: string
  tukang_id: number | null
  tukang_name: string
  is_user: number
  type: number
  quantity: number | null
  unit: string
}

interface WorkOrderHistory {
  work_order_id: number
  work_order_status: string
  work_order_status_label: string
  time_range: string
  created_at: string
  updated_at: string
  work_date_time: string
  updated_by: string
}

const UpdateWorkTukang: FC<{updatePageTitle: (work_order: WorkOrder) => void}> = ({
  updatePageTitle,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const animatedComponents = makeAnimated()
  const tukangId = localStorage.getItem('tukang_id')
  const tukangName = localStorage.getItem('tukangName') as string

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Work Order Detail
  const [workOrderDetail, setWorkOrderDetail] = useState<any>(null)

  // Work Order History
  const [workOrderHistory, setWorkOrderHistory] = useState<WorkOrderHistory[]>([])

  // Work Order Tukang
  const [tukang, setTukang] = useState<Tukang[]>([])

  // Update Work Order
  const [workOrder, setWorkOrder] = useState<WorkOrders>({
    id: null,
    work_order_status: null,
    description: '',
    tukang_id: [],
    survey_date_time: '',
    work_date_time: '',
    work_start_date: '',
    work_end_date: '',
    work_order_before: [],
    work_order_after: [],
  })

  // Update Work Order File ( Before And After )
  const [workOrderBefore, setWorkOrderBefore] = useState<Array<File | null>>([])
  const [workOrderAfter, setWorkOrderAfter] = useState<Array<File | null>>([])

  const [selectedWorkBeforeFile, setSelectedWorkBeforeFile] = useState<number | null>(null)
  const [selectedWorkAfterFile, setSelectedWorkAfterFile] = useState<number | null>(null)

  const [previewWorkBeforeImage, setPreviewWorkBeforeImage] = useState<any>()
  const [previewWorkAfterImage, setPreviewWorkAfterImage] = useState<any>()

  const evidenceRef = useRef<HTMLInputElement>(null)

  const [visibleWorkBefore, setVisibleWorkBefore] = useState(false)
  const [visibleWorkAfter, setVisibleWorkAfter] = useState(false)

  // Add Work Order Item
  const [workOrderItem, setWorkOrderItem] = useState<WorkOrderItem[]>([
    {
      id: null,
      index: Date.now().toString(),
      item_name: '',
      tukang_id: null,
      tukang_name: '',
      is_user: 0,
      type: 1,
      quantity: null,
      unit: '',
    },
    {
      id: null,
      index: (Date.now() + 1).toString(),
      item_name: '',
      tukang_id: null,
      tukang_name: '',
      is_user: 0,
      type: 2,
      quantity: null,
      unit: '',
    },
  ])

  // Fetch Data
  const getWorkOrderData = async () => {
    try {
      await axios
        .get(`${apiUrl}/work-orders/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          setWorkOrderDetail(data)

          if (data) {
            const tukang = data.work_order_tukang.map((item: any) => ({
              value: item.tukang_id,
              label: item.tukang.full_name,
              type: item.type,
            }))

            setWorkOrder((prev) => ({
              ...prev,
              id: data.id,
              description: data.work_order_status[0].description,
              survey_date_time: data.survey_date ? formatDateTime(new Date(data.survey_date)) : '',
              work_date_time: '',
              work_start_date: data.work_start_date,
              work_end_date: data.work_end_date,
              tukang_id: tukang,
              work_order_status: data.work_order_status[0].status.id,
            }))
          }

          if (data?.work_order_evidences) {
            const initialWorkOrderFiles = data.work_order_evidences
              .filter((x: any) => x.type === 2)
              .map((item: any) => ({
                id: item.id,
                name: item.evidence_location,
              }))

            setWorkOrderBefore(initialWorkOrderFiles)
          }

          if (data?.work_order_evidences) {
            const initialWorkOrderFiles = data.work_order_evidences
              .filter((x: any) => x.type === 3)
              .map((item: any) => ({
                id: item.id,
                name: item.evidence_location,
              }))

            setWorkOrderAfter(initialWorkOrderFiles)
          }

          // GLOBAL
          if (data?.work_order_status.length >= 3 && data?.order?.payment_type === 'survey') {
            const workOrderItem = data?.work_order_status[0]?.work_order_items.map(
              (item: any, index: number) => ({
                id: item.id,
                index: (Date.now() + index).toString(),
                item_name: item?.name,
                tukang_id: item?.tukang_id ?? null,
                tukang_name: item?.tukang_name ?? null,
                unit: item?.unit,
                is_user: item?.is_customer === true ? 1 : 0,
                type: item?.type,
                quantity: item?.quantity,
              })
            )

            setWorkOrderItem(workOrderItem)
          } else if (
            data?.work_order_status.length > 2 &&
            ['gratis', 'pemasangan_tanpa_survey'].includes(data?.order?.payment_type)
          ) {
            const workOrderItem = data?.work_order_status[0]?.work_order_items.map(
              (item: any, index: number) => ({
                id: item.id,
                index: (Date.now() + index).toString(),
                item_name: item?.name,
                tukang_id: item?.tukang_id ?? null,
                tukang_name: item?.tukang_name ?? null,
                unit: item?.unit,
                is_user: item?.is_customer === true ? 1 : 0,
                type: item?.type,
                quantity: item?.quantity,
              })
            )

            setWorkOrderItem(workOrderItem)
          } else if (
            data?.work_order_status?.length >= 1 &&
            data?.order?.payment_type === 'survey'
          ) {
            const workOrderItem = data?.order?.m_order_details.map((item: any, index: number) => ({
              id: item.id,
              index: (Date.now() + index).toString(),
              item_name: item.item_name ?? '',
              unit: item?.unit ?? '',
              is_user: item.is_customer ? 1 : 0,
              type: 2,
              quantity: item?.quantity ?? 0,
            }))

            const workOrderItemMaterial = [
              {
                id: null,
                index: (Date.now() + workOrderItem.length).toString(),
                item_name: '',
                tukang_id: null,
                tukang_name: '',
                is_user: 0,
                type: 1,
                quantity: null,
                unit: '',
              },
            ]

            const mergedWorkOrderItem = workOrderItem.concat(workOrderItemMaterial)
            setWorkOrderItem(mergedWorkOrderItem)
          } else if (
            (data?.work_order_status?.length >= 1 || data?.work_order_status?.length <= 2) &&
            ['gratis', 'pemasangan_tanpa_survey'].includes(data?.order?.payment_type)
          ) {
            const workOrderItem = data?.order?.m_order_details.map((item: any, index: number) => ({
              id: item.id,
              index: (Date.now() + index).toString(),
              item_name: item.item_name ?? '',
              unit: item?.unit ?? '',
              is_user: item.is_customer ? 1 : 0,
              type: 2,
              quantity: item?.quantity ?? 0,
            }))

            const workOrderItemMaterial = [
              {
                id: null,
                index: (Date.now() + workOrderItem.length).toString(),
                item_name: '',
                tukang_id: null,
                tukang_name: '',
                is_user: 0,
                type: 1,
                quantity: null,
                unit: '',
              },
            ]

            const mergedWorkOrderItem = workOrderItem.concat(workOrderItemMaterial)
            setWorkOrderItem(mergedWorkOrderItem)
          }

          // TANPA SURVEY
          // if (data?.work_order_status.length > 2) {
          //   const workOrderItem = data?.work_order_status[0]?.work_order_items.map(
          //     (item: any, index: number) => ({
          //       id: item.id,
          //       index: (Date.now() + index).toString(),
          //       item_name: item?.name,
          //       tukang_id: item?.tukang_id ?? null,
          //       tukang_name: item?.tukang_name ?? null,
          //       unit: item?.unit,
          //       is_user: item?.is_customer === true ? 1 : 0,
          //       type: item?.type,
          //       quantity: item?.quantity,
          //     })
          //   )

          //   setWorkOrderItem(workOrderItem)
          // } else if (data?.work_order_status?.length >= 1 || data?.work_order_status?.length <= 2) {
          //   const workOrderItem = data?.order?.m_order_details.map((item: any, index: number) => ({
          //     id: item.id,
          //     index: (Date.now() + index).toString(),
          //     item_name: item.item_name ?? '',
          //     unit: item?.unit ?? '',
          //     is_user: item.is_customer ? 1 : 0,
          //     type: 2,
          //     quantity: item?.quantity ?? 0,
          //   }))

          //   const workOrderItemMaterial = [
          //     {
          //       id: null,
          //       index: (Date.now() + workOrderItem.length).toString(),
          //       item_name: '',
          //       tukang_id: null,
          //       tukang_name: '',
          //       is_user: 0,
          //       type: 1,
          //       quantity: null,
          //       unit: '',
          //     },
          //   ]

          //   const mergedWorkOrderItem = workOrderItem.concat(workOrderItemMaterial)
          //   setWorkOrderItem(mergedWorkOrderItem)
          // }

          // SURVEY
          // if (data?.work_order_status.length > 1) {
          //   const workOrderItem = data?.work_order_status[0]?.work_order_items.map(
          //     (item: any, index: number) => ({
          //       id: item.id,
          //       index: (Date.now() + index).toString(),
          //       item_name: item?.name,
          //       tukang_id: item?.tukang_id ?? null,
          //       tukang_name: item?.tukang_name ?? null,
          //       unit: item?.unit,
          //       is_user: item?.is_customer === true ? 1 : 0,
          //       type: item?.type,
          //       quantity: item?.quantity,
          //     })
          //   )

          //   setWorkOrderItem(workOrderItem)
          // } else if (data?.work_order_status?.length === 1) {
          //   const workOrderItem = data?.order?.m_order_details.map((item: any, index: number) => ({
          //     id: item.id,
          //     index: (Date.now() + index).toString(),
          //     item_name: item.item_name ?? '',
          //     unit: item?.unit ?? '',
          //     is_user: item.is_customer ? 1 : 0,
          //     type: 2,
          //     quantity: item?.quantity ?? 0,
          //   }))

          //   const workOrderItemMaterial = [
          //     {
          //       id: null,
          //       index: (Date.now() + workOrderItem.length).toString(),
          //       item_name: '',
          //       tukang_id: null,
          //       tukang_name: '',
          //       is_user: 0,
          //       type: 1,
          //       quantity: null,
          //       unit: '',
          //     },
          //   ]

          //   const mergedWorkOrderItem = workOrderItem.concat(workOrderItemMaterial)
          //   setWorkOrderItem(mergedWorkOrderItem)
          // }

          if (data?.work_order_status) {
            const workStartDate = new Date(data?.work_start_date).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })

            const workEndDate = new Date(data?.work_end_date).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })

            const workDateTime =
              data?.work_end_date !== null
                ? `${workStartDate} - ${workEndDate}`
                : 'Belum dijadwalkan oleh vendor'

            const surveyDate = data.survey_date
              ? new Date(data.survey_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'Order ini tanpa survey'

            const workOrderHistoryData = data.work_order_status.map(
              (item: any, index: number, array: any[]) => {
                let workTime = '-'

                if (index > 0) {
                  const date_1 = new Date(array[index - 1].created_at).getTime()
                  const date_2 = new Date(item.created_at).getTime()

                  const timeDifferenceInMilliseconds = Math.abs(date_2 - date_1)

                  const timeDifferenceInMinutes = Math.floor(
                    timeDifferenceInMilliseconds / (1000 * 60)
                  )

                  const timeDifferenceInHours = Math.floor(
                    timeDifferenceInMilliseconds / (1000 * 60 * 60)
                  )

                  const timeDifferenceInDays = Math.floor(
                    timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
                  )

                  if (timeDifferenceInDays >= 1) {
                    workTime = `${timeDifferenceInDays} Hari`
                  } else if (timeDifferenceInHours >= 1) {
                    workTime = `${timeDifferenceInHours} Jam`
                  } else {
                    workTime = `${timeDifferenceInMinutes} Menit`
                  }
                }

                return {
                  work_order_id: item?.work_order_id,
                  work_order_status: item?.status?.category,
                  work_order_status_label: item?.status?.description,
                  // created_at: surveyDate,
                  time_range: workTime,
                  updated_at: item?.created_at
                    ? new Date(item?.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })
                    : '-',
                  work_date_time: workDateTime,
                  updated_by: item?.updated_by,
                }
              }
            )

            setWorkOrderHistory(workOrderHistoryData)
          }

          updatePageTitle(data)
        })
    } catch (error) {
      console.error(error)
    }
  }

  const getTukang = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tukang`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempTukang = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.full_name,
        }))

        setTukang(tempTukang)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getWorkOrderData()
    getTukang()
  }, [])

  // Format Date
  const formatDateTime = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  }

  // Hashing key
  const stringToHash = (string: string) => {
    let hash = 0

    if (string.length == 0) return hash

    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }

    return hash
  }

  // Work Order Form Handler
  const workOrderHandler = (
    value: number | string | Array<number | string | null> | any | null,
    target: string
  ) => {
    setWorkOrder((prev) => {
      const cache = {...prev, [target]: value}
      return cache
    })
  }

  const tukangHandler = (selectedOptions: any, field: any) => {
    const type = field === 'survey_tukang_id' ? 1 : 2

    setWorkOrder((prevWorkOrder) => {
      const updatedTukang = selectedOptions.map((option: any) => ({
        ...option,
        type: type,
      }))

      const filteredTukang = prevWorkOrder.tukang_id.filter((x: any) => x.type !== type)
      const mergedTukang = [...filteredTukang, ...updatedTukang]

      return {
        ...prevWorkOrder,
        tukang_id: mergedTukang,
      }
    })
  }

  // Work Order Item Form Handler
  const handleAddForm = (type: number) => {
    const newForm = {
      id: null,
      index: Date.now().toString(),
      item_name: '',
      tukang_id: null,
      tukang_name: '',
      is_user: 0,
      type: type,
      quantity: null,
      unit: '',
    }

    setWorkOrderItem((prev) => [...prev, newForm])
  }

  const handleRemoveForm = (index: any) => {
    setWorkOrderItem((prev) => {
      const updatedValues = [...prev]
      const typeIndex = updatedValues.findIndex((item) => item.index === index)

      if (typeIndex !== -1) {
        updatedValues.splice(typeIndex, 1)
      }

      return updatedValues
    })
  }

  // Handle Checkbox Change
  const handleCheckboxChange = (index: any, isChecked: boolean) => {
    const updatedMaterialValues = [...workOrderItem]
    const elementIndex = updatedMaterialValues.findIndex((item) => item.index === index)
    if (elementIndex !== -1) {
      updatedMaterialValues[elementIndex].is_user = isChecked ? 1 : 0
    }

    setWorkOrderItem(updatedMaterialValues)
  }

  // Handle Item Name Change
  const handleItemNameChange = (index: any, value: any, type: number) => {
    const updatedMaterialValues = [...workOrderItem]
    const filteredMaterialValues = updatedMaterialValues.filter((x) => x.type === type)

    if (filteredMaterialValues[index]) {
      filteredMaterialValues[index] = {
        ...filteredMaterialValues[index],
        item_name: value,
      }

      setWorkOrderItem((prev) =>
        prev.map((element) => (element.type === type ? filteredMaterialValues.shift()! : element))
      )
    }
  }

  // Handle Quantity Change
  const handleQuantityChange = (index: any, value: any, type: number) => {
    const updatedMaterialValues = [...workOrderItem]
    const elementIndex = updatedMaterialValues.findIndex((item) => item.index === index)

    if (elementIndex !== -1) {
      updatedMaterialValues[elementIndex] = {
        ...updatedMaterialValues[elementIndex],
        quantity: value,
      }
    }

    setWorkOrderItem(updatedMaterialValues)
  }

  // Handle Unit Change
  const handleSatuanChange = (index: any, value: any, type: number) => {
    const updatedMaterialValues = [...workOrderItem]
    const elementIndex = updatedMaterialValues.findIndex((item) => item.index === index)

    if (elementIndex !== -1) {
      updatedMaterialValues[elementIndex] = {
        ...updatedMaterialValues[elementIndex],
        unit: value,
      }
    }

    setWorkOrderItem(updatedMaterialValues)
  }

  // Handle File ( Before ) Change
  const handleFileWorkBefore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const existingFiles = [...workOrderBefore]
      const mergedFiles = existingFiles.concat(file)

      const {length: existingFilesLength} = existingFiles
      const {length: fileListLength} = fileList

      for (let i = 0; i < fileListLength; i++) {
        mergedFiles[existingFilesLength + i] = fileList.item(i)
      }

      setWorkOrderBefore(mergedFiles)
    }
  }

  const handleImageWorkBeforeClick = () => {
    const inputField = document.querySelector('.work-before-image') as HTMLInputElement
    inputField.click()
  }

  const handleFileWorkBeforeClick = (index: number) => {
    setPreviewWorkBeforeImage(workOrderBefore[index]?.name)
    setVisibleWorkBefore(true)
    setSelectedWorkBeforeFile(index)
  }

  const handleRemoveWorkBeforeFile = (index: number) => {
    const newEvidances = [...workOrderBefore]
    newEvidances.splice(index, 1)
    setWorkOrderBefore(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  // Handle File ( After ) Change
  const handleFileWorkAfter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const existingFiles = [...workOrderAfter]
      const mergedFiles = existingFiles.concat(file)

      const {length: existingFilesLength} = existingFiles
      const {length: fileListLength} = fileList

      for (let i = 0; i < fileListLength; i++) {
        mergedFiles[existingFilesLength + i] = fileList.item(i)
      }

      setWorkOrderAfter(mergedFiles)
    }
  }

  const handleImageWorkAfterClick = () => {
    const inputField = document.querySelector('.work-after-image') as HTMLInputElement
    inputField.click()
  }

  const handleFileWorkAfterClick = (index: number) => {
    setPreviewWorkAfterImage(workOrderAfter[index]?.name)
    setVisibleWorkAfter(true)
    setSelectedWorkAfterFile(index)
  }

  const handleRemoveWorkAfterFile = (index: number) => {
    const newEvidances = [...workOrderAfter]
    newEvidances.splice(index, 1)
    setWorkOrderAfter(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData: Array<StatusStorage> = storedStatus ? JSON.parse(storedStatus) : []

    const getStatusNameByCategory = (category: string) => {
      switch (category) {
        case 'SURVEYREQ':
          return 'SURVEYSTART'
        case 'SURVEYSTART':
          return 'SURVEYDONE'
        case 'SURVEYDONE':
          return 'SURVEYDONE'
        case 'WORKREQ':
          return 'WORKSTART'
        case 'WORKSTART':
          return 'WIP'
        case 'WIP':
          return 'WORKEND'
        default:
          return null
      }
    }

    const status = getStatusNameByCategory(workOrderDetail?.work_order_status[0]?.status?.category)
    const desiredStatus =
      statusData.find((statuses: StatusStorage) => statuses.category === status)?.value ?? null

    setWorkOrder({
      ...workOrder,
      work_order_status: desiredStatus,
    })
  }, [workOrderDetail?.work_order_status[0]?.status?.category, workOrder.work_order_status])

  // Validasi Upload Foto Sebelum
  const WorkOrderValidation = () => {
    let valid = true

    if (workOrderBefore.length === 0) {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong Isi Upload Foto Sebelum',
        icon: 'warning',
      })
      valid = false
    } else if (
      workOrderAfter.length === 0 &&
      [
        'SURVEYSTART',
        'SURVEYDONE',
        'WIP',
        'WORKEND',
        'REWORKSTART',
        'RIP',
        'REWORKEND',
        'WORKDONE',
        'DONE',
      ].includes(workOrderDetail?.work_order_status[0]?.status?.category)
    ) {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong Isi Upload Foto Sesudah',
        icon: 'warning',
      })
      valid = false
    } else if (
      workOrderItem.filter((x) => x.type === 2).some((x) => x.item_name === '') &&
      ['SURVEYSTART', 'SURVEYDONE'].includes(
        workOrderDetail?.work_order_status[0]?.status?.category
      )
    ) {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong Isi Item Jasa Pemasangan',
        icon: 'warning',
      })
      valid = false
    } else if (
      workOrderItem.filter((x) => x.type === 2).some((x) => x.quantity === null) &&
      ['SURVEYSTART', 'SURVEYDONE'].includes(
        workOrderDetail?.work_order_status[0]?.status?.category
      )
    ) {
      Swal.fire({
        title: 'Warning',
        text: 'Tolong Isi Quantity',
        icon: 'warning',
      })
      valid = false
    }

    return valid
  }

  // Update Work Order
  const handleUpdateWorkOrder = async () => {
    if (!WorkOrderValidation()) {
      setIsLoading(false)
      return false
    }

    const formData = new FormData()
    setIsLoading(true)

    // Work Order Detail
    formData.append('status_id', String(workOrder?.work_order_status))
    formData.append('description', workOrder.description)

    if (workOrder.work_date_time !== '') {
      formData.append('work_date_time', workOrder.survey_date_time)
    }

    if (workOrder.work_start_date) {
      formData.append('work_start_date', workOrder.work_start_date)
    }

    if (workOrder.work_end_date) {
      formData.append('work_end_date', workOrder.work_end_date)
    }

    // if (workOrder.tukang_id) {
    //   workOrder.tukang_id.map((item) => {
    //     formData.append(`tukang_id`, item?.value)
    //     formData.append(`tukang_type`, item?.type)
    //   })
    // }

    if (workOrderBefore?.length) {
      workOrderBefore.forEach((item, index) => {
        if (item instanceof Blob) {
          formData.append(`work_order_before`, item, item?.name)
        }
      })
    }

    if (workOrderAfter?.length) {
      workOrderAfter.forEach((item, index) => {
        if (item instanceof Blob) {
          formData.append(`work_order_after`, item, item?.name)
        }
      })
    }

    // Work Order Item
    if (workOrderItem) {
      workOrderItem.forEach((order, index) => {
        if (order.id && order.item_name !== '') {
          formData.append(`work_order_items[${index}][id]`, order.id.toString())
        }

        if (order.item_name !== '') {
          formData.append(`work_order_items[${index}][type]`, order.type.toString())
          formData.append(`work_order_items[${index}][item_name]`, order.item_name)
          formData.append(`work_order_items[${index}][is_customer]`, order.is_user.toString())

          if (tukangId !== null) {
            formData.append(`work_order_items[${index}][tukang_id]`, tukangId)
          }

          if (tukangName !== '') {
            formData.append(`work_order_items[${index}][tukang_name]`, tukangName)
          }
        }

        if (order.unit !== '') {
          formData.append(`work_order_items[${index}][unit]`, order.unit)
        }

        if (order.quantity && order.item_name !== '') {
          formData.append(`work_order_items[${index}][quantity]`, order.quantity.toString())
        }
      })
    }

    await axios
      .post(`${apiUrl}/work-orders/${workOrder.id}/set-materials`, formData, {
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
            text: 'Work Order Updated',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          })

          setIsLoading(false)
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })

          setIsLoading(false)
        }

        navigate('/work-order/view-work-order')
      })
      .catch((error) => {
        setIsLoading(false)

        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
        })
      })
  }

  return (
    <section id='update-work-order-tukang'>
      <Card className='mb-5'>
        <Card.Body>
          <Row>
            <Col xxl={8} xl={8} md={8} sm={12}>
              <Row>
                <Col xxl={6} xl={6} md={6} sm={12}>
                  <Form.Group className='detail-info' as={Row}>
                    <Form.Label className='fs-7' column md='4'>
                      Nama Toko
                    </Form.Label>

                    <Col md='8' className='d-flex align-items-center'>
                      <p className='fs-7 fw-semibold'>
                        {workOrderDetail?.order?.store?.store_name ?? ''}
                      </p>
                    </Col>
                  </Form.Group>
                </Col>

                <Col xxl={6} xl={6} md={6} sm={12}>
                  <Form.Group className='detail-info' as={Row}>
                    <Form.Label className='fs-7' column md='4'>
                      Nama Vendor
                    </Form.Label>

                    <Col md='8' className='d-flex align-items-center'>
                      <p className='fs-7 fw-semibold'>
                        {workOrderDetail?.vendor?.company_name ?? ''}
                      </p>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xxl={6} xl={6} md={6} sm={12}>
                  <Form.Group className='detail-info' as={Row}>
                    <Form.Label className='fs-7' column md='4'>
                      Order ID
                    </Form.Label>

                    <Col md='8'>
                      <Form.Control readOnly value={workOrderDetail?.order_id ?? ''} />
                    </Col>
                  </Form.Group>

                  <Row className='detail-info'>
                    <Col md={4}>
                      <div className='title'>
                        <h1 className='fs-6'>Costumer Info</h1>
                      </div>
                    </Col>

                    <Col md={8} className='mt-5'>
                      <div className='detail-info'>
                        <p className='fs-7 fw-bold '>
                          {workOrderDetail?.order?.members?.full_name ?? ''}
                        </p>
                        <p className='fs-7'> {workOrderDetail?.order?.project_number ?? ''}</p>
                        <p className='fs-7'>{workOrderDetail?.order?.members?.email ?? ''}</p>
                        <p className='fs-7'>{workOrderDetail?.order?.project_address ?? ''}</p>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col xxl={6} xl={6} md={6} sm={12}>
                  <Form.Group className='detail-info' as={Row}>
                    <Form.Label className='fs-7' column sm='4'>
                      Work Order ID
                    </Form.Label>

                    <Col sm='8'>
                      <Form.Control readOnly value={workOrderDetail?.id ?? '-'} />
                    </Col>
                  </Form.Group>

                  <Row className='detail-info'>
                    <Col md={4}>
                      <div className='title'>
                        <h1 className='fs-6'>Work Order Info</h1>
                      </div>
                    </Col>

                    <Col md={8} className='mt-5'>
                      <div className='detail-info'>
                        {['SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE'].includes(
                          workOrderDetail?.work_order_status[0]?.status?.category
                        ) && (
                          <>
                            {workOrderDetail?.order?.m_order_details?.map(
                              (item: any, index: number) => (
                                <p key={`${index}-work_order_tukang`} className='fs-7'>
                                  {item?.item_notes ?? '-'}
                                </p>
                              )
                            )}
                          </>
                        )}

                        {[
                          'WORKREQ',
                          'WORKSTART',
                          'WIP',
                          'WORKEND',
                          'REWORKSTART',
                          'RIP',
                          'REWORKEND',
                          'WORKDONE',
                          'DONE',
                        ].includes(workOrderDetail?.work_order_status[0]?.status?.category) && (
                          <>
                            {workOrderDetail?.work_order_status[0]?.work_order_items.map(
                              (item: any, index: number) => (
                                <p key={`${index}-work_order_tukang`} className='fs-7'>
                                  {item?.name ?? '-'}
                                </p>
                              )
                            )}
                          </>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Row className='detail-info'>
                    <Form.Group className='detail-info' as={Row}>
                      <Form.Label
                        className='fs-9 text-decoration-underline pt-0 pb-0'
                        column
                        md='4'
                      >
                        Upload Foto Sebelum
                      </Form.Label>

                      <Col md='8'>
                        <Form.Group>
                          <Form className='form-input-image' onClick={handleImageWorkBeforeClick}>
                            <Form.Control
                              type='file'
                              accept='image/*'
                              className='work-before-image'
                              multiple
                              hidden
                              id='work-before-file-input'
                              ref={evidenceRef}
                              onChange={handleFileWorkBefore}
                            />

                            <div className='input-image-text'>
                              <FontAwesomeIcon icon={faFileArrowUp} color='#858585' size='2xl' />
                            </div>
                          </Form>

                          <ListGroup className='pt-3'>
                            {workOrderBefore?.length ? (
                              workOrderBefore.map((item, index) => (
                                <ListGroup key={`${stringToHash(item?.name ?? 'randomImageHash')}`}>
                                  <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                                    <FontAwesomeIcon
                                      className='me-3'
                                      icon={faFileArrowUp}
                                      color='#858585'
                                      size='sm'
                                    />

                                    <span
                                      className='upload-content'
                                      style={{cursor: 'pointer'}}
                                      onClick={() => handleFileWorkBeforeClick(index)}
                                    >
                                      {item?.name}
                                    </span>

                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      size='sm'
                                      color='#ed2b2a'
                                      style={{cursor: 'pointer'}}
                                      onClick={(e) => handleRemoveWorkBeforeFile(index)}
                                    />
                                  </ListGroup.Item>

                                  {selectedWorkBeforeFile === index && item && (
                                    <Image
                                      key={`${stringToHash(previewWorkBeforeImage)} - ${index} - ${
                                        item?.name
                                      }`}
                                      width={200}
                                      style={{display: 'none'}}
                                      src={
                                        item instanceof File
                                          ? URL.createObjectURL(item)
                                          : `${apiUrl}/public/work-orders/${previewWorkBeforeImage}`
                                      }
                                      preview={{
                                        visible: visibleWorkBefore,
                                        src:
                                          item instanceof File
                                            ? URL.createObjectURL(item)
                                            : `${apiUrl}/public/work-orders/${previewWorkBeforeImage}`,
                                        onVisibleChange: (value) => {
                                          setVisibleWorkBefore(value)
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
                      </Col>
                    </Form.Group>

                    {[
                      'SURVEYSTART',
                      'SURVEYDONE',
                      'WIP',
                      'WORKEND',
                      'REWORKSTART',
                      'RIP',
                      'REWORKEND',
                      'WORKDONE',
                      'DONE',
                    ].includes(workOrderDetail?.work_order_status[0]?.status?.category) && (
                      <Form.Group className='detail-info' as={Row}>
                        <Form.Label
                          className='fs-9 text-decoration-underline pt-0 pb-0 '
                          column
                          md='4'
                        >
                          Upload Foto Sesudah
                        </Form.Label>

                        <Col md='8'>
                          <Form.Group>
                            <Form className='form-input-image' onClick={handleImageWorkAfterClick}>
                              <Form.Control
                                type='file'
                                accept='image/*'
                                className='work-after-image'
                                multiple
                                hidden
                                id='work-after-file-input'
                                ref={evidenceRef}
                                onChange={handleFileWorkAfter}
                              />

                              <div className='input-image-text'>
                                <FontAwesomeIcon icon={faFileArrowUp} color='#858585' size='2xl' />
                              </div>
                            </Form>

                            <ListGroup className='pt-3'>
                              {workOrderAfter?.length ? (
                                workOrderAfter.map((item, index) => (
                                  <ListGroup
                                    key={`${stringToHash(item?.name ?? 'randomImageHash')}`}
                                  >
                                    <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                                      <FontAwesomeIcon
                                        className='me-3'
                                        icon={faFileArrowUp}
                                        color='#858585'
                                        size='sm'
                                      />

                                      <span
                                        style={{cursor: 'pointer'}}
                                        className='upload-content'
                                        onClick={() => handleFileWorkAfterClick(index)}
                                      >
                                        {item?.name}
                                      </span>

                                      <FontAwesomeIcon
                                        icon={faTrash}
                                        size='sm'
                                        color='#ed2b2a'
                                        style={{cursor: 'pointer'}}
                                        onClick={(e) => handleRemoveWorkAfterFile(index)}
                                      />
                                    </ListGroup.Item>

                                    {selectedWorkAfterFile === index && item && (
                                      <Image
                                        key={`${stringToHash(previewWorkAfterImage)} - ${index} - ${
                                          item?.name
                                        }`}
                                        width={200}
                                        style={{display: 'none'}}
                                        src={
                                          item instanceof File
                                            ? URL.createObjectURL(item)
                                            : `${apiUrl}/public/work-orders/${previewWorkAfterImage}`
                                        }
                                        preview={{
                                          visible: visibleWorkAfter,
                                          src:
                                            item instanceof File
                                              ? URL.createObjectURL(item)
                                              : `${apiUrl}/public/work-orders/${previewWorkAfterImage}`,
                                          onVisibleChange: (value) => {
                                            setVisibleWorkAfter(value)
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
                        </Col>
                      </Form.Group>
                    )}
                  </Row>
                </Col>
              </Row>

              <Row>
                <Form.Group className='detail-info'>
                  <Form.Label className='fs-7'>Catatan Tambahan</Form.Label>

                  <Form.Control
                    name='description'
                    style={{minHeight: '170px'}}
                    as='textarea'
                    value={workOrder.description}
                    onChange={(e) => workOrderHandler(e.target.value, 'description')}
                  />
                </Form.Group>
              </Row>
            </Col>

            <Col xxl={4} xl={4} md={4} sm={12}>
              <Form.Group as={Row} className='detail-info'>
                <Form.Label className='pt-3 fs-5 fw-semibold'>
                  WORK ORDER STATUS :
                  <span className='fw-bold'>
                    {' '}
                    {workOrderDetail?.work_order_status[0].status?.description}
                  </span>
                </Form.Label>
              </Form.Group>

              {['SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE'].includes(
                workOrderDetail?.work_order_status[0]?.status?.category
              ) && (
                <Row className='detail-info'>
                  <div className='title'>
                    <h1 className='fs-6'>Survey</h1>
                  </div>

                  <Form.Group className='detail-info'>
                    <Form.Label className='fs-6'>Tanggal Survey</Form.Label>

                    <Col sm='8'>
                      <Form.Control
                        type='datetime-local'
                        disabled
                        value={workOrder.survey_date_time}
                        onChange={(e) => workOrderHandler(e.target.value, 'survey_date_time')}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group className='detail-info'>
                    <Form.Label className='fs-6'>Tehnisi Survey</Form.Label>

                    <Col sm='8'>
                      <Select
                        classNamePrefix='select'
                        closeMenuOnSelect={false}
                        isClearable={false}
                        menuIsOpen={false}
                        isMulti
                        components={animatedComponents}
                        options={tukang}
                        getOptionLabel={(option) => `${option.label}`}
                        getOptionValue={(option) => `${option.value}`}
                        value={workOrder.tukang_id.filter((x) => x.type === 1)}
                      />
                    </Col>
                  </Form.Group>
                </Row>
              )}

              {[
                'WORKREQ',
                'WORKSTART',
                'WIP',
                'WORKEND',
                'REWORK',
                'REWORKSTART',
                'RIP',
                'REWORKEND',
                'RESCHEDULE',
                'DONE',
              ].includes(workOrderDetail?.work_order_status[0]?.status?.category) && (
                <Row className='detail-info'>
                  <div className='title'>
                    <h1 className='fs-6'>Pengerjaan</h1>
                  </div>

                  <Form.Group className='detail-info'>
                    <Form.Label className='fs-6'>Tanggal Mulai dan Selesai Pekerjaan</Form.Label>

                    <Col sm='8'>
                      <RangePicker
                        disabled={[true, true]}
                        allowClear={false}
                        className='date-range w-100'
                        format='DD-MM-YYYY'
                        onChange={(values) => {
                          if (values && values.length === 2) {
                            const dateFromFormatted = values[0]?.format('YYYY-MM-DD') || ''
                            const dateToFormatted = values[1]?.format('YYYY-MM-DD') || ''

                            setWorkOrder((prev) => ({
                              ...prev,
                              work_start_date: dateFromFormatted,
                              work_end_date: dateToFormatted,
                            }))
                          } else {
                            setWorkOrder({
                              id: null,
                              work_order_status: null,
                              description: '',
                              tukang_id: [],
                              survey_date_time: '',
                              work_date_time: '',
                              work_start_date: '',
                              work_end_date: '',
                              work_order_before: [],
                              work_order_after: [],
                            })
                          }
                        }}
                        value={
                          (workOrder.work_start_date &&
                            workOrder.work_end_date && [
                              dayjs(workOrder.work_start_date, 'YYYY-MM-DD'),
                              dayjs(workOrder.work_end_date, 'YYYY-MM-DD'),
                            ]) ||
                          undefined
                        }
                      />{' '}
                    </Col>
                  </Form.Group>

                  <Form.Group className='detail-info'>
                    <Form.Label className='fs-6'>Tehnisi Pengerjaan</Form.Label>

                    <Col sm='8'>
                      <Select
                        placeholder='Tukang belum diset oleh Vendor'
                        classNamePrefix='select'
                        closeMenuOnSelect={false}
                        isClearable={false}
                        menuIsOpen={false}
                        isMulti
                        components={animatedComponents}
                        options={tukang}
                        getOptionLabel={(option) => `${option.label}`}
                        getOptionValue={(option) => `${option.value}`}
                        value={workOrder.tukang_id.filter((x) => x.type === 2)}
                      />
                    </Col>
                  </Form.Group>
                </Row>
              )}
            </Col>
          </Row>

          {(() => {
            if (
              workOrderDetail?.order?.payment_type === 'survey' &&
              ['SURVEYSTART', 'SURVEYDONE'].includes(
                workOrderDetail?.work_order_status[0]?.status?.category
              )
            ) {
              return (
                <>
                  <Row>
                    <Col>
                      <div className='fs-5 text-dark fw-bold mb-2'>Jasa Pemasangan</div>

                      <Table responsive>
                        <thead className='table-item-head'>
                          <tr>
                            <th></th>
                            <th className='content'>Jenis Jasa</th>
                            <th className='content'>QTY</th>
                            <th className='content'>Satuan</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {workOrderItem
                            .filter((x) => x.type === 2)
                            .map((element, index) => (
                              <tr
                                key={`${stringToHash(element.index)}-service`}
                                id={`${element.index}-service`}
                              >
                                <td align='center' width={70}>
                                  <Button
                                    variant='btn-jasa button-dark-primary'
                                    onClick={() => handleAddForm(2)}
                                  >
                                    <FontAwesomeIcon icon={faPlus} />
                                  </Button>
                                </td>

                                <td>
                                  <Form.Control
                                    id={`service-name-${index}`}
                                    type='text'
                                    value={element.item_name}
                                    onChange={(e) => handleItemNameChange(index, e.target.value, 2)}
                                  />
                                </td>

                                <td>
                                  <Form.Control
                                    id={`quantity-${index}`}
                                    type='number'
                                    value={element.quantity?.toString()}
                                    onChange={(e) =>
                                      handleQuantityChange(element.index, e.target.value, 2)
                                    }
                                  />{' '}
                                </td>

                                <td>
                                  <Form.Control
                                    id={`unit-${index}`}
                                    value={element.unit?.toString()}
                                    onChange={(e) =>
                                      handleSatuanChange(element.index, e.target.value, 2)
                                    }
                                  />
                                </td>

                                <td align='center' width={70}>
                                  <Button
                                    variant='danger'
                                    onClick={() => handleRemoveForm(element.index)}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Table responsive>
                        <thead className='table-item-head'>
                          <tr>
                            <th></th>
                            <th>Disediakan Customer</th>
                            <th className='content'>Material Yang Dibutuhkan</th>
                            <th className='content'>QTY</th>
                            <th className='content'>Satuan</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {workOrderItem
                            .filter((x) => x.type === 1)
                            .map((element, index) => (
                              <tr
                                key={`${stringToHash(element.index)}-material`}
                                id={`${element.index}-material`}
                              >
                                <td align='center' width={70}>
                                  <Button
                                    variant='btn-material button-dark-primary'
                                    onClick={() => handleAddForm(1)}
                                  >
                                    <FontAwesomeIcon icon={faPlus} />
                                  </Button>
                                </td>

                                <td align='center' style={{verticalAlign: 'middle'}}>
                                  <Form.Check
                                    id={`is-user-${index}`}
                                    type='checkbox'
                                    checked={element.is_user === 1}
                                    onChange={(e) =>
                                      handleCheckboxChange(element.index, e.target.checked)
                                    }
                                  />
                                </td>

                                <td>
                                  <Form.Control
                                    id={`item-name-${index}`}
                                    value={element.item_name}
                                    onChange={(e) => handleItemNameChange(index, e.target.value, 1)}
                                  />
                                </td>

                                <td>
                                  <Form.Control
                                    id={`quantity-${index}`}
                                    value={element.quantity?.toString()}
                                    onChange={(e) =>
                                      handleQuantityChange(element.index, e.target.value, 1)
                                    }
                                  />
                                </td>

                                <td>
                                  <Form.Control
                                    id={`unit-${index}`}
                                    value={element.unit?.toString()}
                                    onChange={(e) =>
                                      handleSatuanChange(element.index, e.target.value, 1)
                                    }
                                  />
                                </td>

                                <td align='center' width={70}>
                                  <Button
                                    variant='danger'
                                    onClick={() => handleRemoveForm(element.index)}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </>
              )
            } else if (
              ['QUOTEIN', 'QUOTEOUT'].includes(workOrderDetail?.order?.status?.category ?? '') &&
              workOrderDetail?.order?.payment_type === 'survey'
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
                      </tr>
                    </thead>

                    <tbody>
                      {workOrderDetail?.order?.quotation[0]?.quotation_details
                        ?.filter((x: any) => x.item_type === 2)
                        ?.map((item: any, index: any) => (
                          <tr key={`${index}-quotation`}>
                            <td>
                              {item?.name ?? '-'}{' '}
                              {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                            </td>
                            <td>{item?.quantity ?? 0}</td>
                            <td>{item?.unit}</td>
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
                      </tr>
                    </thead>

                    <tbody>
                      {workOrderDetail?.order?.quotation[0]?.quotation_details
                        ?.filter((x: any) => x.item_type === 1)
                        ?.map((item: any, index: any) => (
                          <tr key={`${index}-quotation`}>
                            <td>
                              {item?.name ?? '-'}{' '}
                              {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                            </td>
                            <td>{item?.quantity ?? 0}</td>
                            <td>{item?.unit}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )
            } else if (
              ['WORKREQ', 'WORKSTART', 'WIP', 'WORKEND', 'DONE'].includes(
                workOrderDetail?.work_order_status[0]?.status?.category
              ) &&
              workOrderDetail?.work_order_status.length >= 2 &&
              workOrderDetail?.order?.payment_type === 'survey'
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
                      </tr>
                    </thead>

                    <tbody>
                      {workOrderDetail?.order?.quotation[0]?.quotation_details
                        ?.filter((x: any) => x.item_type === 2)
                        ?.map((item: any, index: any) => (
                          <tr key={`${index}-quotation`}>
                            <td>
                              {item?.name ?? '-'}{' '}
                              {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                            </td>
                            <td>{item?.quantity ?? 0}</td>
                            <td>{item?.unit}</td>
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
                      </tr>
                    </thead>

                    <tbody>
                      {workOrderDetail?.order?.quotation[0]?.quotation_details
                        ?.filter((x: any) => x.item_type === 1)
                        ?.map((item: any, index: any) => (
                          <tr key={`${index}-quotation`}>
                            <td>
                              {item?.name ?? '-'}{' '}
                              {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                            </td>
                            <td>{item?.quantity ?? 0}</td>
                            <td>{item?.unit}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )
            } else if (
              workOrderDetail?.order?.payment_type === 'gratis' ||
              workOrderDetail?.order?.payment_type === 'pemasangan_tanpa_survey'
            ) {
              return (
                <>
                  <div className='table-title-warranty mt-5'>
                    <div className='fs-3 fw-bold'>Informasi Pemasangan</div>
                    <Row>
                      <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                        <Form.Label column>
                          {workOrderDetail?.order?.payment_type !== 'survey'
                            ? 'Tanggal request pemasangan'
                            : 'Tanggal request survey'}
                        </Form.Label>
                        <Col>
                          <p className='fs-7 p-0'>
                            {new Date(workOrderDetail?.order?.request_survey).toLocaleDateString(
                              'id-ID',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              }
                            )}
                          </p>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                        <Form.Label column>Informasi Vendor Pemasangan :</Form.Label>
                        <Col>
                          <p className='fs-7 p-0'>{workOrderDetail?.vendor?.company_name ?? '-'}</p>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                        <Form.Label column>Payment Type:</Form.Label>
                        <Col>
                          <p className='fs-7 p-0'>
                            {(() => {
                              if (workOrderDetail?.order?.payment_type === 'survey') {
                                return `Berbayar & Survey`
                              } else if (workOrderDetail?.order?.payment_type === 'gratis') {
                                return `Gratis`
                              } else if (
                                workOrderDetail?.order?.payment_type === 'pemasangan_tanpa_survey'
                              ) {
                                return `Berbayar & Pemasangan Tanpa Survey`
                              } else {
                                return ``
                              }
                            })()}
                          </p>
                        </Col>
                      </Form.Group>
                    </Row>
                  </div>

                  <div className='table-warranty-content'>
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
                        {workOrderDetail?.order?.m_order_details?.map((item: any, index: any) => (
                          <>
                            <tr key={`${index} - order_detail`}>
                              <td>{item?.item_code}</td>
                              <td>{item?.item_name}</td>
                              <td>{item?.item?.service_name}</td>
                              <td>{item?.quantity ?? 0}</td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )
            }
          })()}

          <Row>
            {workOrderDetail?.work_order_status?.length > 1 &&
            workOrderDetail?.work_order_status[0]?.status?.category === 'WORKEND' ? (
              <div className='d-flex justify-content-center align-items-center'>
                <Button
                  className='btn-done d-flex justify-content-center align-items-center'
                  type='submit'
                  disabled
                >
                  Order Ini Pengerjaannya Telah Selesai
                </Button>
              </div>
            ) : (
              <div className='d-flex justify-content-center align-items-center'>
                <Button
                  className='d-flex justify-content-center align-items-center'
                  variant='dark-primary'
                  type='submit'
                  disabled={isLoading}
                  onClick={handleUpdateWorkOrder}
                >
                  {isLoading ? 'Submitting Order...' : 'Save'}
                </Button>
              </div>
            )}
          </Row>
        </Card.Body>
      </Card>

      {workOrderDetail?.work_order_status?.length && (
        <Card className='mb-5'>
          <Card.Body>
            <div className='work-order-history'>
              <h1 className='title text-decoration-underline mb-5'>Work Order History</h1>

              <Table responsive>
                <thead className='table-item-head'>
                  <tr>
                    <th className='content-history'>Work Order ID</th>
                    <th className='content-history'>Work Order Status</th>
                    <th className='content-history'>Terakhir Update Survey/Pengerjaan</th>
                    <th className='content-history'>Tanggal Pengerjaan</th>
                  </tr>
                </thead>

                <tbody>
                  {workOrderHistory.map((item, index) => (
                    <tr key={`${index}-history`} id={`${index}-history`}>
                      <td>{item?.work_order_id}</td>
                      <td>{item?.work_order_status_label}</td>
                      <td>{item?.updated_at}</td>
                      <td>{item?.work_date_time}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </section>
  )
}

export {UpdateWorkTukang}
