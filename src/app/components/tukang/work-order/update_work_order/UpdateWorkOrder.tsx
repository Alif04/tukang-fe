import React, {FC, useState, useEffect, useRef} from 'react'

import './UpdateWorkOrder.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import Swal from 'sweetalert2'
import {Table, Image} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Button, Card, Row, Col, ListGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface Status {
  value: number | null
  category: string
  label: string
}

interface WorkOrderHistory {
  work_order_id: number
  work_order_status: string
  created_at: string
  updated_at: string
  work_date_time: string
  time_spent: string
  updated_by: string
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
}

const UpdateWorkTukang: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()

  // Order Detail
  const [orderDetail, setOrderDetail] = useState<any>(null)

  // Work Order History
  const [workOrderId, setWorkOrderId] = useState<any>()
  const [workOrderHistory, setWorkOrderHistory] = useState<WorkOrderHistory[]>([])

  // Work Order Status
  const [workOrderStatus, setWorkOrderStatus] = useState<Status[]>([])
  const [selectedWorkOrderStatus, setSelectedWorkOrderStatus] = useState<SingleValue<Status>>({
    value: null,
    label: '',
    category: '',
  })

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
    },
  ])

  // Update Work Order
  const [additionalNotes, setAdditionalNotes] = useState<string>('')
  const [dateTimeSurvey, setDateTimeSurvey] = useState<any>()
  const [workTime, setWorkTime] = useState<any>()
  const [workOrderEvidence, setWorkOrderEvidence] = useState<Array<File | null>>([])
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)
  const evidenceRef = useRef<HTMLInputElement>(null)

  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)

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

          if (data?.work_orders?.id) {
            setWorkOrderId(data.work_orders.id)
          }

          if (data?.work_orders?.work_order_status[0]?.status_id) {
            setSelectedWorkOrderStatus((prev) => ({
              ...prev,
              value: data.work_orders?.work_order_status[0]?.status_id,
              label: data.work_orders?.work_order_status[0]?.status.category,
              category: data.work_orders?.work_order_status[0]?.status.category,
            }))
          }

          if (data?.work_orders?.work_order_status[0]?.description) {
            setAdditionalNotes(data.work_orders.work_order_status[0].description)
          }

          if (data?.work_orders?.work_order_status[0]?.work_date_time) {
            setDateTimeSurvey(
              formatDateTime(new Date(data.work_orders.work_order_status[0].work_date_time))
            )
          }

          if (data?.work_orders?.work_order_status[0]?.time_spent) {
            setWorkTime(data.work_orders.work_order_status[0].time_spent)
          }

          if (data?.work_orders?.work_order_evidences) {
            const initialWorkOrderFiles = data.work_orders.work_order_evidences.map(
              (item: any) => ({
                id: item.id,
                name: item.evidence_location,
              })
            )

            setWorkOrderEvidence(initialWorkOrderFiles)
          }

          if (data?.work_orders?.work_order_status) {
            const workOrderHistoryData = data.work_orders.work_order_status.map((item: any) => ({
              work_order_id: item.work_order_id,
              work_order_status: item.status.category,
              created_at: item.created_at ? formatDate(new Date(item.created_at)) : '',
              updated_at: item.updated_at ? formatDate(new Date(item.updated_at)) : '',
              work_date_time: item.work_date_time ? formatDate(new Date(item.work_date_time)) : '-',
              time_spent: item.time_spent ? item.time_spent : '-',
              updated_by: item.updated_by,
            }))

            setWorkOrderHistory(workOrderHistoryData)
          }

          if (data?.work_orders?.work_order_status) {
            const workOrderItem = data.work_orders.work_order_status[0].work_order_items.map(
              (item: any, index: number) => ({
                id: item.id,
                index: (Date.now() + index).toString(),
                item_name: item.name,
                tukang_id: item?.tukang_id,
                tukang_name: item?.tukang_name,
                is_user: item.is_customer ? 1 : 0,
                type: item.type,
                quantity: item.quantity,
              })
            )

            setWorkOrderItem(workOrderItem)
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

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

  // Form Handler
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

    if (type === 1) {
      updatedMaterialValues[index] = {
        ...updatedMaterialValues[index],
        quantity: value,
      }
    }

    setWorkOrderItem(updatedMaterialValues)
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

  // Handle Input Change
  const handleInputNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedInputValue = event.target.value
    setAdditionalNotes(updatedInputValue)
  }

  const handleInputDateTimeSurvey = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedInputValue = event.target.value
    setDateTimeSurvey(updatedInputValue)
  }

  const handleInputWorkTIme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedInputValue = event.target.value
    setWorkTime(updatedInputValue)
  }

  // Handle Change Upload File
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const existingFiles = [...workOrderEvidence]
      const mergedFiles = existingFiles.concat(file)

      const {length: existingFilesLength} = existingFiles
      const {length: fileListLength} = fileList

      for (let i = 0; i < fileListLength; i++) {
        mergedFiles[existingFilesLength + i] = fileList.item(i)
      }

      setWorkOrderEvidence(mergedFiles)
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleFileClick = (index: number) => {
    setPreviewImage(workOrderEvidence[index]?.name)
    setVisible(true)
    setSelectedFileIndex(index)
  }

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

  const handleRemoveFile = (index: number) => {
    const newEvidances = [...workOrderEvidence]
    newEvidances.splice(index, 1)
    setWorkOrderEvidence(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  // Update Work Order
  const handleUpdateWorkOrder = async () => {
    const formData = new FormData()

    formData.append('work_order_status', selectedWorkOrderStatus?.value?.toString() ?? '')
    formData.append('status_details[description]', additionalNotes)
    formData.append('status_details[work_date_time]', dateTimeSurvey)
    formData.append('status_details[time_spent]', workTime)

    if (workOrderItem) {
      workOrderItem.forEach((order, index) => {
        formData.append(`work_order_items[${index}][type]`, order.type.toString())
        formData.append(`work_order_items[${index}][item_name]`, order.item_name)
        formData.append(`work_order_items[${index}][is_customer]`, order.is_user.toString())

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

    if (workOrderEvidence?.length) {
      workOrderEvidence.forEach((item) => {
        if (item instanceof Blob) {
          formData.append(`work_order_evidences`, item, item?.name)
        }
      })
    }

    await axios
      .post(`${apiUrl}/work-orders/${workOrderId}/set-materials`, formData, {
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
      ['SURVEYED', 'WIP', 'WORKEND', 'RIP', 'REWORKEND', 'RESCHEDULE'].includes(status.category)
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
    {
      title: 'Time Spent',
      dataIndex: 'time_spent',
      key: 'time_spent',
      align: 'center',
      width: 140,
      onFilter: (value, record) => record.time_spent.includes(String(value)),
      sorter: (a, b) => a.time_spent.length - b.time_spent.length,
    },
  ]

  useEffect(() => {
    workOrderStatusOption()
    fetchOrderData()
  }, [])

  return (
    <section id='update-work-order-tukang'>
      <Card className='mb-5'>
        <Card.Body>
          <Row>
            <Col sm={12} md={12} xl={12} xxl={6} className='mb-5'>
              <Row>
                <Form.Group as={Row}>
                  <Form.Label column sm='4'>
                    Nama Toko :
                  </Form.Label>

                  <Col sm='8'>
                    <Form.Control plaintext readOnly value={orderDetail?.store.store_name} />
                  </Col>
                </Form.Group>
              </Row>

              <Row>
                <Col>
                  <Form.Group as={Row}>
                    <Form.Label column sm='4'>
                      Order ID :
                    </Form.Label>

                    <Col sm='8'>
                      <Form.Control readOnly value={orderDetail?.id} />
                    </Col>
                  </Form.Group>

                  <div className='costumer-information mt-5'>
                    <div className='title mb-5'>
                      <h1 className='fs-2 fw-bolder text-decoration-underline'>Costumer Info</h1>
                    </div>

                    <div className='detail-information'>
                      <div className='costumer-name  mb-3'>
                        <p className='fs-4 fw-bold '>{orderDetail?.members.full_name}</p>
                      </div>

                      <div className='telp mb-3'>
                        <p className='fs-5'> {orderDetail?.project_number}</p>
                      </div>

                      <div className='email mb-3'>
                        <p className='fs-5'>{orderDetail?.members.email}</p>
                      </div>

                      <div className='alamat-pemasangan d-flex mb-3'>
                        <p className='fs-5'>{orderDetail?.project_address}</p>
                      </div>
                    </div>
                  </div>

                  <Form.Group controlId='formFile'>
                    <Form.Label>UPLOAD FOTO</Form.Label>
                    <Form className='form-input-image' onClick={handleImageClick}>
                      <Form.Control
                        type='file'
                        accept='image/*'
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
                      {workOrderEvidence.length ? (
                        workOrderEvidence.map((item, index) => (
                          <ListGroup key={`${stringToHash(item?.name ?? 'randomImageHash')}`}>
                            <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                              <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                              <span
                                className='upload-content'
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
                                key={`${stringToHash(previewImage)} - ${index} - ${item?.name}`}
                                width={200}
                                style={{display: 'none'}}
                                src={
                                  item instanceof File
                                    ? URL.createObjectURL(item)
                                    : `${apiUrl}/public/work-orders/${previewImage}`
                                }
                                preview={{
                                  visible,
                                  src:
                                    item instanceof File
                                      ? URL.createObjectURL(item)
                                      : `${apiUrl}/public/work-orders/${previewImage}`,
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

                <Col>
                  <Form.Group as={Row} className='mb-3'>
                    <Form.Label column sm='6'>
                      Work Order ID :
                    </Form.Label>

                    <Col sm='6'>
                      <Form.Control readOnly value={orderDetail?.work_orders.id} />
                    </Col>
                  </Form.Group>

                  <div className='work-information mt-5'>
                    <div className='title mb-5'>
                      <h1 className='fs-2 fw-bolder text-decoration-underline'>
                        Work Order Infomation
                      </h1>
                    </div>

                    <div className='detail-information'>
                      <div className='order-name  mb-3'>
                        <p className='fs-5 me-5'>{orderDetail?.order_details[0].unit}</p>
                      </div>

                      <div className='category-name  mb-3'>
                        <p className='fs-5 me-5'>
                          {orderDetail?.order_details[0].item.category_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Form.Group className='mb-3'>
                    <Form.Label className='fs-5 fw-semibold text-primary text-decoration-underline'>
                      Catatan Tambahan
                    </Form.Label>
                    <Form.Control
                      value={additionalNotes}
                      style={{minHeight: '220px'}}
                      as='textarea'
                      onChange={handleInputNotes}
                    />
                  </Form.Group>
                </Col>

                {/* <div className='d-flex justify-content-end'>
                  <Button
                    variant='dark-danger'
                    type='submit'
                    onClick={() => navigate('/work-order/view-work-order')}
                  >
                    Cancel
                  </Button>

                  <Button variant='dark-primary' type='submit' onClick={handleUpdateWorkOrder}>
                    Save
                  </Button>
                </div> */}
              </Row>
            </Col>

            <Col sm={12} md={12} xl={12} xxl={6} className='mb-5'>
              <Row className='mb-4'>
                <Form.Group as={Row} className='mb-5'>
                  <Form.Label column sm='6' className='fs-1 fw-bold pt-0 pb-0'>
                    NEW WORK STATUS :{' '}
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

                <Form.Group as={Row} className='mb-4'>
                  <Form.Label column sm='6' className='fs-3 fw-semibold pt-0 pb-0'>
                    WORK ORDER STATUS :{' '}
                  </Form.Label>

                  <Col sm='6'>
                    <p className='fs-3 fw-semibold text-success'>
                      {orderDetail?.work_orders?.work_order_status[0]?.status.category}
                    </p>
                  </Col>
                </Form.Group>
              </Row>

              <Row className='mb-5'>
                <Col>
                  <Form.Group>
                    <Form.Label className='fw-semibold'>Tanggal & Jam Survey</Form.Label>
                    <Form.Control
                      type='datetime-local'
                      value={dateTimeSurvey}
                      onChange={handleInputDateTimeSurvey}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label className='fw-semibold'>Lama Pekerjaan</Form.Label>
                    <Form.Control type='text' value={workTime} onChange={handleInputWorkTIme} />
                  </Form.Group>
                </Col>
              </Row>

              <div className='d-flex justify-content-end'>
                <Button variant='button-dark-primary' onClick={() => handleAddForm(1)}>
                  Tambah Material
                </Button>
              </div>

              <div className='fs-5 text-dark fw-bold mb-2'>List Material</div>

              <table className='table'>
                <thead className='table-item-head'>
                  <tr>
                    <th>Disediakan Customer</th>
                    <th>Item</th>
                    <th>Quantity</th>
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
                        <td>
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
                            onChange={(e) => handleQuantityChange(index, e.target.value, 1)}
                          />
                        </td>

                        <td>
                          <Button variant='danger' onClick={() => handleRemoveForm(element.index)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className='d-flex justify-content-end'>
                <Button variant='button-dark-primary' onClick={() => handleAddForm(2)}>
                  Tambah Jasa Pemasangan
                </Button>
              </div>

              <div className='fs-5 text-dark fw-bold mb-2'>List Jasa Pemasangan</div>

              <table className='table'>
                <thead className='table-item-head'>
                  <tr>
                    <th>Jasa Pemasangan</th>
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
                        <td>
                          <Form.Control
                            id={`service-name-${index}`}
                            value={element.item_name}
                            onChange={(e) => handleItemNameChange(index, e.target.value, 2)}
                          />
                        </td>

                        <td>
                          <Button variant='danger' onClick={() => handleRemoveForm(element.index)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className='d-flex justify-content-end'>
                <Button variant='info' type='submit'>
                  Print Work Order Detail
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <div className='d-flex justify-content-center'>
              <Button
                variant='dark-danger'
                type='submit'
                onClick={() => navigate('/work-order/view-work-order')}
              >
                Cancel
              </Button>

              <Button variant='dark-primary' type='submit' onClick={handleUpdateWorkOrder}>
                Save
              </Button>
            </div>
          </Row>
        </Card.Body>
      </Card>

      {orderDetail?.work_orders ? (
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
      ) : (
        ''
      )}
    </section>
  )
}

export {UpdateWorkTukang}
