import React, {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './NewMaterial.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import Swal from 'sweetalert2'
import {Table, Spin} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, Button, Row, Col, Card, FormGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage, faPlus} from '@fortawesome/free-solid-svg-icons'

interface Status {
  value: number | null
  label: string
  category: string
}

interface WorkOrderSelect {
  value: number | null
  label: number | null
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
  time_spent: string
  updated_by: string
}

const NewMaterialVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  // Loader
  const [loading, setLoading] = useState<boolean>(false)

  // Loader for Submit
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Work Order
  const [workOrder, setWorkOrder] = useState<any>()
  const [workOrderDetail, setWorkOrderDetail] = useState<any>(null)
  const [workOrderHistory, setWorkOrderHistory] = useState<WorkOrderHistory[]>([])
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<WorkOrderSelect>({
    value: null,
    label: null,
  })

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

  // Fetch Work Order Data
  const getWorkOrder = async () => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
    const desiredStatus = statusData.filter((status: any) =>
      ['SURVEYSTART', 'SURVEYDONE', 'WIP', 'WORKEND', 'RIP', 'REWORKEND', 'RESCHEDULE'].includes(
        status.category
      )
    )

    if (desiredStatus) {
      const statuses = desiredStatus.map((x) => x.value)

      try {
        const response = await axios.get(
          `${apiUrl}/orders?order_by=desc&take=0&status=${statuses.join(',')}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          }
        )
        if (Array.isArray(response.data.data)) {
          const tempWorkOrder = response.data.data
            .filter((item: any) => item.work_orders && item.work_orders.id)
            .map((item: any) => ({
              value: item.work_orders.id,
              label: item.work_orders.id,
            }))

          setWorkOrder(tempWorkOrder)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    } else {
      console.error('Desired status not found in statusData')
    }
  }

  const getWorkOrderDetail = async () => {
    try {
      setLoading(false)
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
          const data = response.data.data.data
          setWorkOrderDetail(data)

          if (data?.work_order_status) {
            const workOrderHistoryData = data.work_order_status.map((item: any) => ({
              work_order_id: item?.work_order_id,
              work_order_status: item?.status?.category,
              created_at: item.created_at ? formatDate(new Date(item?.created_at)) : '',
              updated_at: item.updated_at ? formatDate(new Date(item?.updated_at)) : '',
              work_date_time: item?.work_date_time
                ? formatDate(new Date(item?.work_date_time))
                : '-',
              time_spent: item?.time_spent ? item.time_spent : '-',
              updated_by: item?.updated_by,
            }))

            setWorkOrderHistory(workOrderHistoryData)
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
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getWorkOrder()
  }, [])

  const formatDateTime = (date: any) => {
    if (isNaN(date.getTime())) {
      return ''
    }

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `Tanggal ${day}-${month}-${year} Jam ${hours}:${minutes}`
  }

  // Filter Work Order Status
  useEffect(() => {
    const workOrderStatusOption = () => {
      const storedStatus = sessionStorage.getItem('statusData')
      const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
      const desiredStatus = statusData.filter((status: Status) =>
        ['WORKSTART', 'WIP', 'WORKEND', 'RIP', 'REWORKEND'].includes(status.category)
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
    if (isNaN(date.getTime())) {
      return '--/--/----'
    }

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
    setLoading(true)
    setWorkOrderHistory([])
    setWorkOrderItem([])
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
      unit: '',
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
    setIsLoading(true)
    const formData = new FormData()

    // Work Order Detail
    formData.append('work_order_status', selectedWorkOrderStatus?.value?.toString() ?? '')

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
        console.error(error)
        setIsLoading(false)

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
          <div className='form-wrapper'>
            <Row className='form-header mb-5'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko :{' '}
                  <span className='fs-4 ms-2 fw-normal'>
                    {workOrderDetail?.order?.store?.store_name ?? ''}
                  </span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Col>
                  <Form.Label className='fs-4 fw-bold'>
                    Order ID :{' '}
                    <span className='fs-4 ms-2 fw-normal'>{workOrderDetail?.order?.id ?? ''}</span>
                  </Form.Label>
                </Col>

                <Col>
                  <Form.Label className='fs-4 fw-bold'>Work Order ID : </Form.Label>

                  <Select
                    name='work-order-id'
                    className='form-control p-0'
                    placeholder='Ketik/Pilih Work Order Id'
                    isSearchable={true}
                    isClearable={true}
                    options={workOrder}
                    onChange={(newValue) => handleChangeSelectWorkOrder(newValue)}
                  />
                </Col>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Col>
                  <Form.Label className='fs-4 fw-bold'>
                    Receipt Number :
                    <span className='fs-4 ms-2 fw-normal'>
                      {workOrderDetail?.order?.receipt_number ?? '-'}
                    </span>
                  </Form.Label>
                </Col>

                <Col>
                  <Form.Label className='fs-4 fw-bold'>Work Status :</Form.Label>
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
              </Col>
            </Row>

            <Row className='information-detail mb-5'>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='costumer-info mb-5'>
                <div className='fs-4 fw-bold'>Informasi Pembeli</div>
                <Row>
                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        No Member :
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>
                          {workOrderDetail?.order?.members?.member_number ?? ''}
                        </p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Customer Name :
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>{workOrderDetail?.order?.members?.full_name ?? ''}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Alamat Pemasangan
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>{workOrderDetail?.order?.project_address ?? ''}</p>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='4'>
                        Nomor Telp/WA :
                      </Form.Label>

                      <Col sm='8'>
                        <p className='fs-7'>{workOrderDetail?.order?.project_number ?? ''}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='4'>
                        Alamat Email
                      </Form.Label>

                      <Col sm='8'>
                        <p className='fs-7'>{workOrderDetail?.order?.members?.email ?? ''} </p>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='sales-info mb-5'>
                <Row>
                  <Col md={5}>
                    <div className='survey mb-3'>
                      <div className='detail-info mb-3'>
                        <p className='fs-4 fw-bold'>Survey dikerjakan pada:</p>
                        <p className='fs-7'>
                          {formatDateTime(new Date(workOrderDetail?.survey_date) ?? '')}
                        </p>
                      </div>

                      <div className='detail-info mb-3'>
                        <p className='fs-5 fw-bold'>Oleh:</p>
                        <p className='fs-7'>
                          {workOrderDetail?.work_order_tukang
                            .filter((x: any) => x.type === 1)
                            .map((item: any) => item?.tukang?.full_name)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </Col>

                  <Col md={7}>
                    <div className='work-date'>
                      <p className='fs-4 fw-bold'>Pekerjaan dilakukan pada:</p>

                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='3'>
                          MULAI
                        </Form.Label>

                        <Col sm='9'>
                          <p className='fs-7'>
                            {formatDateTime(new Date(workOrderDetail?.work_start_date))}
                          </p>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='3'>
                          SELESAI
                        </Form.Label>

                        <Col sm='9'>
                          <p className='fs-7'>
                            {formatDateTime(new Date(workOrderDetail?.work_orders?.work_end_date))}
                          </p>
                        </Col>
                      </Form.Group>

                      <div className='detail-info mb-3'>
                        <p className='fs-5 fw-bold'>Oleh:</p>
                        <p className='fs-7'>
                          {workOrderDetail?.work_orders?.work_order_tukang
                            .filter((x: any) => x.type === 2)
                            .map((item: any) => item?.tukang?.full_name)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <Row className='table-warranty d-flex align-items-center mb-5'>
            <div className='table-title-warranty'>
              <div className='fs-3 fw-bold'>Informasi Pemasangan</div>
              <Row>
                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Tanggal request pemasangan :</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {formatDate(new Date(workOrderDetail?.order?.request_survey))}
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
                    <th>Harga Jasa</th>
                    <th>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {workOrderDetail?.work_order_status[0]?.work_order_items.map(
                      (item: any, index: any) => (
                        <tr key={`${index}-work_order_detail`}>
                          <td>{item?.item_id ?? '-'}</td>
                          <td>{item?.item ?? '-'}</td>
                          <td>{item?.name ?? '-'}</td>
                          <td>{item?.quantity ?? 0}</td>
                          <td>{`Rp. ${parseInt(item?.unit_price ?? 0)?.toLocaleString('id')}`}</td>
                          <td>{`Rp. ${parseInt(item?.total ?? 0).toLocaleString('id')}`}</td>
                        </tr>
                      )
                    )}
                  </>

                  <tr>
                    <td colSpan={5} className='text-end fw-bolder'>
                      Grand Total
                    </td>
                    <td className=' fw-bolder'>
                      {`Rp. ${parseInt(workOrderDetail?.grand_total ?? 0).toLocaleString('id')}`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                        id={`${stringToHash(element.index)}-service`}
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
                        id={`${stringToHash(element.index)}-material`}
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
                            onChange={(e) => handleQuantityChange(index, e.target.value, 1)}
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

          <div className='d-flex justify-content-center align-items-center'>
            <Button
              className='button-dark-primary'
              disabled={isLoading}
              onClick={() => handleUpdateWorkOrder()}
            >
              {isLoading ? 'Saving..' : 'Save'}
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
