import React, {FC, useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './NewMaterial.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import Swal from 'sweetalert2'
import {Table, Spin} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, Button, Row, Col, Card, FormGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface Status {
  value: number | null
  category: string
  label: string | null
}

interface WorkOrderSelect {
  value: number | null
  label: number | null
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

const NewMaterialVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  // Loader
  const [loading, setIsLoading] = useState<boolean>(false)

  // Work Order
  const [workOrder, setWorkOrder] = useState<any>()
  const [workOrderHistory, setWorkOrderHistory] = useState<WorkOrderHistory[]>([])
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<WorkOrderSelect>({
    value: null,
    label: null,
  })

  // Work Order Status
  const [workOrderStatus, setWorkOrderStatus] = useState<Status[]>([])
  const [selectedWorkOrderStatus, setSelectedWorkOrderStatus] = useState<Status>({
    value: null,
    label: null,
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

  // Fetch Work Order Data
  const getWorkOrder = async () => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
    const desiredStatus = statusData.filter((status: any) =>
      [
        'SURVEYSTART',
        'WORKSTART',
        'WIP',
        'WORKEND',
        'INVESTIGATE',
        'REWORK',
        'REWORKSTART',
        'RIP',
        'REWORKEND',
        'RESCHEDULE',
      ].includes(status.category)
    )

    if (desiredStatus) {
      const statuses = desiredStatus.map((x) => x.value)

      const response = await axios.get(`${apiUrl}/orders?order_by=desc&take=0&status=${statuses}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempWorkOrder = response.data.data.map((item: any) => ({
          value: item.work_orders.id,
          label: item.work_orders.id,
        }))

        setWorkOrder(tempWorkOrder)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } else {
      console.error('Desired status not found in statusData')
    }
  }

  const getWorkOrderDetail = async () => {
    try {
      setIsLoading(false)
      setWorkOrderHistory([])

      await axios
        .get(`${apiUrl}/work-orders/${selectedWorkOrderId.value}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          if (data?.work_order_status) {
            const workOrderHistoryData = data.work_order_status.map((item: any) => ({
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

          if (data?.work_order_status) {
            const workOrderItem = data.work_order_status[3].work_order_items.map(
              (item: any, index: number) => ({
                id: item.id,
                index: (Date.now() + index).toString(),
                item_name: item.name,
                tukang_id: item?.tukang_id,
                tukang_name: item?.tukang_name,
                is_user: item.is_customer,
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

  useEffect(() => {
    getWorkOrder()
  }, [])

  // Filter Work Order Status
  useEffect(() => {
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

    workOrderStatusOption()
  }, [])

  // Selected Work Order ID
  useEffect(() => {
    if (selectedWorkOrderId && selectedWorkOrderId.value !== null) {
      getWorkOrderDetail()
    }
  }, [selectedWorkOrderId])

  // Format Date
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Hash Key
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

  // Select Work Order
  const handleChangeSelectWorkOrder = (value: any) => {
    const selectedWorkOrder = value
    setSelectedWorkOrderId(selectedWorkOrder)
    setIsLoading(true)
    setWorkOrderHistory([])
    setWorkOrderItem([])
  }

  // Select Work Order Status
  const handleChangeSelectWorkOrderStatus = (value: any) => {
    const selectedWorkOrderStatus = value
    setSelectedWorkOrderStatus(selectedWorkOrderStatus)
  }

  // Form Handler
  let handleAddForm = (type: number) => {
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

  let handleRemoveForm = (index: any) => {
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
  let handleItemNameChange = (index: any, value: any, type: number) => {
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
  let handleQuantityChange = (index: any, value: any, type: number) => {
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
  let handleCheckboxChange = (index: any, isChecked: boolean) => {
    const updatedMaterialValues = [...workOrderItem]
    const elementIndex = updatedMaterialValues.findIndex((item) => item.index === index)

    if (elementIndex !== -1) {
      updatedMaterialValues[elementIndex].is_user = isChecked ? 1 : 0
    }

    setWorkOrderItem(updatedMaterialValues)
  }

  // Update Work Order
  const handleUpdateWorkOrder = async () => {
    const formData = new FormData()

    formData.append('work_order_status', selectedWorkOrderStatus?.value?.toString() ?? '')

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

    // if (workOrderEvidence?.length) {
    //   workOrderEvidence.forEach((item) => {
    //     if (item instanceof Blob) {
    //       formData.append(`work_order_evidences`, item, item?.name)
    //     }
    //   })
    // }

    await axios
      .post(`${apiUrl}/work-orders/${selectedWorkOrderId.value}/set-materials`, formData, {
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

  // Table Work Order History
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

  return (
    <section id='new-material'>
      <Card className='mb-5'>
        <Card.Body>
          <Row>
            <Col>
              <Form.Group className='work-order-id'>
                <Form.Label className='fs-4 fw-bold'>Work Order ID :</Form.Label>

                <Select
                  name='work-order-id'
                  className='form-control p-0'
                  placeholder='Ketik/Pilih Work Order Id'
                  isSearchable={true}
                  isClearable={true}
                  options={workOrder}
                  onChange={(newValue) => handleChangeSelectWorkOrder(newValue)}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className='mb-5'>
                <Form.Label className='fs-4 fw-bold '>NEW WORK STATUS : </Form.Label>

                <Select
                  classNamePrefix='select'
                  placeholder='Select Status'
                  isSearchable={true}
                  isClearable={true}
                  options={workOrderStatus}
                  onChange={(newValue) => handleChangeSelectWorkOrderStatus(newValue)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
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
                      id={`${stringToHash(element.index)}-material`}
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
          </Row>

          <Row>
            <div className='d-flex justify-content-end'>
              <Button variant='button-warning' onClick={() => handleAddForm(2)}>
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
                      id={`${stringToHash(element.index)}-service`}
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
          </Row>

          <div className='d-flex justify-content-center align-items-center'>
            <Button className='button-dark-primary' onClick={() => handleUpdateWorkOrder()}>
              Save
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card className='mb-5'>
        <Card.Body>
          <div className='work-order-history'>
            <h1 className='title text-decoration-underline mb-5'>Work Order History</h1>

            <Table
              className='table-striped-rows'
              bordered
              columns={columns}
              dataSource={workOrderHistory}
              loading={loading}
              rowKey={(record) => record.work_order_id}
              pagination={{position: ['bottomRight']}}
            />
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {NewMaterialVendor}
