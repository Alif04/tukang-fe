import React, {FC, useState, useEffect, useRef, SetStateAction} from 'react'
import {WorkOrder} from '../../../../interfaces/work-order'

import './UpdateWorkOrder.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import Swal from 'sweetalert2'
import makeAnimated from 'react-select/animated'
import dayjs from 'dayjs'
import {Table, Image, DatePicker} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Button, Card, Row, Col, ListGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faFileArrowUp, faPlus} from '@fortawesome/free-solid-svg-icons'
const {RangePicker} = DatePicker

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
  created_at: string
  updated_at: string
  work_date_time: string
  updated_by: string
}

interface Status {
  value: number | null
  category: string
  label: string
}

interface Tukang {
  value: number | null
  label: string
  type: number
}

const UpdateWorkTukang: FC<{updatePageTitle: (work_order: WorkOrder) => void}> = ({
  updatePageTitle,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const animatedComponents = makeAnimated()

  // Order Detail
  const [orderDetail, setOrderDetail] = useState<any>(null)

  // Work Order History
  const [workOrderHistory, setWorkOrderHistory] = useState<WorkOrderHistory[]>([])

  // Work Order Status
  const [workOrderStatus, setWorkOrderStatus] = useState<Status[]>([])
  const [selectedWorkOrderStatus, setSelectedWorkOrderStatus] = useState<SingleValue<Status>>({
    value: null,
    label: '',
    category: '',
  })

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

  const [visible, setVisible] = useState(false)

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
  const fetchOrderData = async () => {
    try {
      await axios
        .get(`${apiUrl}/orders/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data
          setOrderDetail(data)

          if (data?.work_orders) {
            const tukang = data.work_orders.work_order_tukang.map((item: any) => ({
              value: item.tukang_id,
              label: item.tukang.full_name,
              type: item.type,
            }))

            setWorkOrder((prev) => ({
              ...prev,
              id: data.work_orders.id,
              description: data.work_orders.work_order_status[0].description,
              survey_date_time: formatDateTime(new Date(data.work_orders.survey_date)),
              work_date_time: '',
              work_start_date: data.work_orders.work_start_date,
              work_end_date: data.work_orders.work_end_date,
              tukang_id: tukang,
            }))
          }

          if (data?.work_orders?.work_order_status[0]?.status_id) {
            setSelectedWorkOrderStatus((prev) => ({
              ...prev,
              value: data.work_orders?.work_order_status[0]?.status_id,
              label: data.work_orders?.work_order_status[0]?.status.category,
              category: data.work_orders?.work_order_status[0]?.status.category,
            }))
          }

          if (data?.work_orders?.work_order_evidences) {
            const initialWorkOrderFiles = data.work_orders.work_order_evidences
              .filter((x: any) => x.type === 2)
              .map((item: any) => ({
                id: item.id,
                name: item.evidence_location,
              }))

            setWorkOrderBefore(initialWorkOrderFiles)
          }

          if (data?.work_orders?.work_order_evidences) {
            const initialWorkOrderFiles = data.work_orders.work_order_evidences
              .filter((x: any) => x.type === 3)
              .map((item: any) => ({
                id: item.id,
                name: item.evidence_location,
              }))

            setWorkOrderAfter(initialWorkOrderFiles)
          }

          if (
            data?.work_orders?.work_order_status &&
            data.work_orders.work_order_status[0].work_order_items.length > 0
          ) {
            const workOrderItem = data.work_orders.work_order_status[0].work_order_items.map(
              (item: any, index: number) => ({
                id: item.id,
                index: (Date.now() + index).toString(),
                item_name: item.name,
                tukang_id: item?.tukang_id,
                tukang_name: item?.tukang_name,
                unit: item?.unit,
                is_user: item.is_customer ? 1 : 0,
                type: item.type,
                quantity: item.quantity,
              })
            )

            setWorkOrderItem(workOrderItem)
          }

          if (data?.work_orders?.work_order_status) {
            const workOrderHistoryData = data.work_orders.work_order_status.map((item: any) => ({
              work_order_id: item.work_order_id,
              work_order_status: item.status.category,
              created_at: item.created_at ? formatDate(new Date(item.created_at)) : '',
              updated_at: item.updated_at ? formatDate(new Date(item.updated_at)) : '',
              work_date_time: item.work_date_time ? formatDate(new Date(item.work_date_time)) : '-',
              updated_by: item.updated_by,
            }))

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
    workOrderStatusOption()
    fetchOrderData()
    getTukang()
  }, [])

  // Format Date
  const today = new Date().toISOString().split('T')[0]

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

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
  // const workOrderFormHandler = (e: any) => {
  //   setWorkOrder({
  //     ...workOrder,
  //     [e.target.name]: e.target.value,
  //   })
  // }

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
    setVisible(true)
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
    setVisible(true)
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

  // Update Work Order
  const handleUpdateWorkOrder = async () => {
    const formData = new FormData()

    // Work Order Detail
    formData.append('status_id', selectedWorkOrderStatus?.value?.toString() ?? '')
    formData.append('description', workOrder.description)
    formData.append('work_date_time', workOrder.survey_date_time)
    formData.append('work_start_date', workOrder.work_start_date)
    formData.append('work_end_date', workOrder.work_end_date)

    if (workOrder.tukang_id) {
      workOrder.tukang_id.map((item) => {
        formData.append(`tukang_id`, item?.value)
        formData.append(`tukang_type`, item?.type)
      })
    }

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
        if (order.id) {
          formData.append(`work_order_items[${index}][id]`, order.id.toString())
        }

        formData.append(`work_order_items[${index}][type]`, order.type.toString())
        formData.append(`work_order_items[${index}][item_name]`, order.item_name)
        formData.append(`work_order_items[${index}][is_customer]`, order.is_user.toString())
        formData.append(`work_order_items[${index}][unit]`, order.unit)

        if (order.quantity) {
          formData.append(`work_order_items[${index}][quantity]`, order.quantity.toString())
        }

        if (order.tukang_id) {
          formData.append(`work_order_items[${index}][tukang_id]`, order.tukang_id.toString())
        }

        if (order.tukang_name) {
          formData.append(`work_order_items[${index}][tukang_name]`, order.tukang_name)
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
            text: response.data.message,
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          })
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })
        }

        navigate('/work-order/view-work-order')
      })
      .catch((error) => {
        console.error(error)

        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
        })
      })
  }

  const workOrderStatusOption = () => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
    const desiredStatus = statusData.filter((status: Status) =>
      [
        'SURVEYSTART',
        'SURVEYED',
        'SURVEYEND',
        'WIP',
        'WORKEND',
        'RIP',
        'REWORKEND',
        'RESCHEDULE',
      ].includes(status.category)
    )

    const selectedStatus = desiredStatus.map((status: Status) => ({
      value: status.value,
      category: status.category,
      label: status.category,
    }))

    setWorkOrderStatus(selectedStatus)
  }

  // Work Order History
  const columns: ColumnsType<WorkOrderHistory> = [
    {
      title: 'ID',
      dataIndex: 'work_order_id',
      key: 'work_order_id',
      align: 'center',
      width: 100,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.work_order_id - b.work_order_id,
    },
    {
      title: 'Status',
      dataIndex: 'work_order_status',
      key: 'work_order_status',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.work_order_status.includes(String(value)),
      sorter: (a, b) => a.work_order_status.length - b.work_order_status.length,
    },
    {
      title: 'Date Order',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      width: 110,
      onFilter: (value, record) => record.created_at.includes(String(value)),
      sorter: (a, b) => a.created_at.length - b.created_at.length,
    },
    {
      title: 'Work Date Time',
      dataIndex: 'work_date_time',
      key: 'work_date_time',
      align: 'center',
      width: 120,
      onFilter: (value, record) => record.work_date_time.includes(String(value)),
      sorter: (a, b) => a.work_date_time.length - b.work_date_time.length,
    },
  ]

  return (
    <section id='update-work-order-tukang'>
      <Card className='mb-5'>
        <Card.Body>
          <Row>
            <Col xxl={8} xl={8} md={8} sm={12}>
              <Row>
                <Col>
                  <Form.Group className='detail-info' as={Row}>
                    <Form.Label className='fs-7' column md='4'>
                      Nama Toko
                    </Form.Label>

                    <Col md='8' className='d-flex align-items-center'>
                      <p className='fs-7 fw-semibold'>{orderDetail?.store?.store_name ?? ''}</p>
                    </Col>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className='detail-info' as={Row}>
                    <Form.Label className='fs-7' column md='4'>
                      Nama Vendor
                    </Form.Label>

                    <Col md='8' className='d-flex align-items-center'>
                      <p className='fs-7 fw-semibold'>{orderDetail?.vendor?.company_name ?? ''}</p>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className='detail-info' as={Row}>
                    <Form.Label className='fs-7' column md='4'>
                      Order ID
                    </Form.Label>

                    <Col md='8'>
                      <Form.Control readOnly value={orderDetail?.id ?? ''} />
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
                        <p className='fs-7 fw-bold '>{orderDetail?.members?.full_name ?? ''}</p>
                        <p className='fs-7'> {orderDetail?.project_number ?? ''}</p>
                        <p className='fs-7'>{orderDetail?.members?.email ?? ''}</p>
                        <p className='fs-7'>{orderDetail?.project_address ?? ''}</p>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col>
                  <Form.Group className='detail-info' as={Row}>
                    <Form.Label className='fs-7' column sm='4'>
                      Work Order ID
                    </Form.Label>

                    <Col sm='8'>
                      <Form.Control readOnly value={orderDetail?.work_orders?.id ?? '-'} />
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
                        {orderDetail?.work_orders !== null ? (
                          <>
                            {orderDetail?.work_orders?.work_order_status[0]?.work_order_items.map(
                              (item: any, index: number) => (
                                <p key={`${index}-work_order_tukang`} className='fs-7'>
                                  {item?.name ?? '-'}
                                </p>
                              )
                            )}
                          </>
                        ) : (
                          <p className='fs-7'>Order masih dalam survey</p>
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
                            {workOrderBefore.length ? (
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
                                        visible,
                                        src:
                                          item instanceof File
                                            ? URL.createObjectURL(item)
                                            : `${apiUrl}/public/work-orders/${previewWorkBeforeImage}`,
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
                      </Col>
                    </Form.Group>

                    {['WORKSTART', 'WIP', 'WORKEND', 'REWORKEND'].includes(
                      orderDetail?.work_orders?.work_order_status[0]?.status?.category
                    ) && (
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
                              {workOrderAfter.length ? (
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
                                          visible,
                                          src:
                                            item instanceof File
                                              ? URL.createObjectURL(item)
                                              : `${apiUrl}/public/work-orders/${previewWorkAfterImage}`,
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
                <Form.Label column sm='6' className='fs-7 fw-semibold'>
                  WORK ORDER STATUS :
                </Form.Label>

                <Col sm='6'>
                  <Select
                    classNamePrefix='select'
                    placeholder='Select Status'
                    isSearchable={true}
                    isClearable={true}
                    options={workOrderStatus}
                    value={{
                      value: selectedWorkOrderStatus?.value ?? null,
                      label: selectedWorkOrderStatus?.label ?? '',
                      category: selectedWorkOrderStatus?.category ?? '',
                    }}
                    onChange={(newValue) => setSelectedWorkOrderStatus(newValue)}
                  />
                </Col>
              </Form.Group>

              <Form.Group className='detail-info' as={Row} style={{visibility: 'hidden'}}>
                <Form.Label className='fs-7' column sm='4'></Form.Label>

                <Col sm='8'>
                  <Form.Control />
                </Col>
              </Form.Group>

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
                      format='YYYY-MM-DD'
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
            </Col>
          </Row>

          <Row>
            <Col>
              <div className='fs-5 text-dark fw-bold mb-2'>Jasa Pemasangan</div>

              <table className='table'>
                <thead className='table-item-head'>
                  <tr>
                    <th></th>
                    <th>Nama Produk / Jenis Jasa</th>
                    <th>QTY</th>
                    <th>Satuan</th>
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
                            value={element.item_name}
                            onChange={(e) => handleItemNameChange(index, e.target.value, 2)}
                          />
                        </td>

                        <td>
                          <Form.Control
                            id={`quantity-${index}`}
                            value={element.quantity?.toString()}
                            onChange={(e) => handleQuantityChange(element.index, e.target.value, 2)}
                          />{' '}
                        </td>

                        <td>
                          <Form.Control
                            id={`unit-${index}`}
                            value={element.unit?.toString()}
                            onChange={(e) => handleSatuanChange(element.index, e.target.value, 2)}
                          />
                        </td>

                        <td align='center' width={70}>
                          <Button variant='danger' onClick={() => handleRemoveForm(element.index)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Col>
          </Row>

          <Row>
            <Col>
              <table className='table'>
                <thead className='table-item-head'>
                  <tr>
                    <th></th>
                    <th>Disediakan Customer</th>
                    <th>Material Yang Dibutuhkan</th>
                    <th>QTY</th>
                    <th>Satuan</th>
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
                            onChange={(e) => handleCheckboxChange(element.index, e.target.checked)}
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
                            onChange={(e) => handleQuantityChange(element.index, e.target.value, 1)}
                          />
                        </td>

                        <td>
                          <Form.Control
                            id={`unit-${index}`}
                            value={element.unit?.toString()}
                            onChange={(e) => handleSatuanChange(element.index, e.target.value, 1)}
                          />
                        </td>

                        <td align='center' width={70}>
                          <Button variant='danger' onClick={() => handleRemoveForm(element.index)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Col>
          </Row>

          <Row>
            <div className='d-flex justify-content-center mt-5 mb-3'>
              <Button variant='dark-primary ' type='submit' onClick={handleUpdateWorkOrder}>
                Save
              </Button>
            </div>
          </Row>
        </Card.Body>
      </Card>

      {orderDetail?.work_orders && (
        <Card className='mb-5'>
          <Card.Body>
            <div className='work-order-history'>
              <h1 className='title text-decoration-underline mb-5'>Work Order History</h1>

              <Table
                className='table-striped-rows'
                bordered
                columns={columns}
                dataSource={workOrderHistory}
                rowKey={(record) => record.work_order_id}
                pagination={{position: ['bottomRight']}}
              />
            </div>
          </Card.Body>
        </Card>
      )}
    </section>
  )
}

export {UpdateWorkTukang}
