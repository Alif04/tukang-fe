import React, {FC, useState, useEffect, useRef} from 'react'

import './UpdateWorkOrder.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Button, Card, Row, Col, ListGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface Status {
  value: any
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

interface Material {
  value: BigInteger
  label: string
  prices: Array<ItemPrice>
}

interface ItemPrice {
  id: BigInteger
  item_id: BigInteger
  unit_id: BigInteger
  store_id: BigInteger
  periodic_start: string
  periodic_end: string
  nominal_discount: string
  price: string
}

const UpdateWorkTukang: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()

  // Order Detail
  const [orderId, setOrderId] = useState<any>()
  const [orderDetail, setOrderDetail] = useState<any>(null)

  // Work Order History
  const [workOrderId, setWorkOrderId] = useState<any>()
  const [workOrderHistory, setWorkOrderHistory] = useState<WorkOrderHistory[]>([])

  // Work Order Status
  const [workOrderStatusId, setWorkOrderStatusId] = useState<any>()
  const [workOrderStatus, setWorkOrderStatus] = useState<Status[]>([])

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

          if (data?.id) {
            setOrderId(data.id)
          }

          if (data.work_orders) {
            const workOrderHistoryData = data.work_orders.work_order_status.map((item: any) => ({
              work_order_id: item.work_order_id,
              work_order_status: workOrderStatus.find((option) => option.value === item.status_id)
                ?.category,
              created_at: item.created_at ? formatDate(new Date(item.created_at)) : '',
              updated_at: item.updated_at ? formatDate(new Date(item.updated_at)) : '',
              work_date_time: item.work_date_time ? formatDate(new Date(item.work_date_time)) : '',
              time_spent: item.time_spent,
              updated_by: item.updated_by,
            }))

            setWorkOrderHistory(workOrderHistoryData)
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  const getMaterial = async () => {
    try {
      const response = await axios.get(`${apiUrl}/items?take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempMaterial = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.item_name,
          prices: item.prices.map((priceItem: any) => ({
            id: priceItem.id,
            item_id: priceItem.item_id,
            unit_id: priceItem.unit_id,
            store_id: priceItem.store_id,
            periodic_start: priceItem.periodic_start,
            periodic_end: priceItem.periodic_end,
            nominal_discount: priceItem.nominal_discount,
            price: priceItem.price,
          })),
        }))

        setMaterial(tempMaterial)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchOrderData()
    getMaterial()
  }, [])

  // Format Date
  const today = new Date().toISOString().split('T')[0]

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatInputDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

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

  // Update Work Order
  const [additionalNotes, setAdditionalNotes] = useState<string>('')
  const [dateTimeSurvey, setDateTimeSurvey] = useState<any>()
  const [workTime, setWorkTime] = useState<any>()
  const [workOrderEvidence, setWorkOrderEvidence] = useState<Array<File | null>>([])

  const evidenceRef = useRef<HTMLInputElement>(null)

  // Add Material Order
  const [material, setMaterial] = useState<Material[]>([])
  const [materialValues, setMaterialValues] = useState([
    {
      id: 0,
      item_id: null,
      tukang_id: 3,
      tukang_name: 'Gilang Prananta',
      unit: '',
      unit_price: 0,
      quantity: 1,
    },
  ])

  const [indexForm, setIndexForm] = useState<number>(0)

  let handleAddForm = () => {
    const newId = materialValues.length > 0 ? materialValues[materialValues.length - 1].id + 1 : 0

    const newForm = {
      id: newId,
      item_id: null,
      tukang_id: 3,
      tukang_name: 'Gilang Prananta',
      unit: '',
      unit_price: 0,
      quantity: 1,
    }

    setIndexForm(indexForm + 1)
    setMaterialValues([...materialValues, newForm])
  }

  let handleRemoveForm = (index: any) => {
    const newMaterialValues = [...materialValues]
    newMaterialValues.splice(index, 1)
    setMaterialValues(newMaterialValues)
    setIndexForm(indexForm - 1)

    let updatedMaterialValues = newMaterialValues.map((value, newIndex) => {
      return {
        ...value,
        id: newIndex,
      }
    })

    setMaterialValues(updatedMaterialValues)
  }

  // Change Select Item
  const handleChangeSelectItem = (index: any, element: any) => {
    if (!element) return

    const {label, value: selectedItemId, prices} = element

    const newMaterialValues = [...materialValues]

    newMaterialValues[index] = {
      ...newMaterialValues[index],
      item_id: selectedItemId,
      unit: label,
      unit_price: prices[0].price,
    }

    setMaterialValues(newMaterialValues)
  }

  // Change Quantity Value
  let handleQuantityChange = (index: any, value: any) => {
    const updatedMaterialValues = [...materialValues]

    updatedMaterialValues[index] = {
      ...updatedMaterialValues[index],
      quantity: value,
    }

    setMaterialValues(updatedMaterialValues)
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

  // Handle Change Status Work Order
  const handleChangeSelectWorkOrder = (element: any) => {
    const selectedWorkOrder = element.value
    setWorkOrderStatusId(selectedWorkOrder)
  }

  // Handle Change Upload File
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const {length} = fileList

      for (let i = 0; i < length; i++) {
        file[i] = fileList.item(i)
      }

      setWorkOrderEvidence(file)
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
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

    formData.append('work_order_status', workOrderStatusId)

    formData.append('status_details[work_date_time]', dateTimeSurvey)
    formData.append('status_details[time_spent]', workTime)

    materialValues.forEach((order, index) => {
      formData.append(
        `status_details[work_order_materials][${index}][item_id]`,
        String(order.item_id)
      )
      formData.append(`status_details[work_order_materials][${index}][item_name]`, order.unit)
      formData.append(
        `status_details[work_order_materials][${index}][price]`,
        order.unit_price.toString()
      )
      formData.append(
        `status_details[work_order_materials][${index}][tukang_id]`,
        order.tukang_id.toString()
      )
      formData.append(
        `status_details[work_order_materials][${index}][tukang_name]`,
        order.tukang_name
      )
      formData.append(
        `status_details[work_order_materials][${index}][quantity]`,
        order.quantity.toString()
      )
    })

    if (workOrderEvidence?.length) {
      workOrderEvidence.forEach((item) => {
        if (item) {
          formData.append(`work_order_evidences`, item, item?.name)
        }
      })
    }

    await axios
      .post(`${apiUrl}/work-orders/${workOrderId}`, formData, {
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

  const handleCancelUpdateWorkOrder = () => {
    navigate('/work-order/view-work-order')
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
      align: 'left',
      width: 140,
      onFilter: (value, record) => record.time_spent.includes(String(value)),
      sorter: (a, b) => a.time_spent.length - b.time_spent.length,
    },
  ]

  return (
    <section id='update-work-order-tukang'>
      <Card className='mb-5'>
        <Card.Body>
          <Row>
            <Col xxl={6}>
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
                          <ListGroup.Item
                            key={`${item?.name}-${index}-${item?.type}`}
                            className='d-flex justify-content-between'
                          >
                            <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                            <span className='upload-content'> {item?.name}</span>

                            <FontAwesomeIcon
                              icon={faTrash}
                              size='sm'
                              color='#ed2b2a'
                              style={{cursor: 'pointer'}}
                              onClick={(e) => handleRemoveFile(index)}
                            />
                          </ListGroup.Item>
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
                      style={{minHeight: '220px'}}
                      as='textarea'
                      onChange={handleInputNotes}
                    />
                  </Form.Group>
                </Col>

                <div className='d-flex justify-content-end'>
                  <Button variant='dark-danger' type='submit' onClick={handleCancelUpdateWorkOrder}>
                    Cancel
                  </Button>

                  <Button variant='dark-primary' type='submit' onClick={handleUpdateWorkOrder}>
                    Save
                  </Button>
                </div>
              </Row>
            </Col>

            <Col xxl={6}>
              <Row className='mb-5'>
                <Form.Group as={Row}>
                  <Form.Label column sm='6' className='fs-1 fw-bold pt-0 pb-0'>
                    NEW WORK STATUS :{' '}
                  </Form.Label>

                  <Col sm='6'>
                    <Select
                      classNamePrefix='select'
                      placeholder='Select Status'
                      isSearchable={true}
                      options={workOrderStatus}
                      onChange={(e) => handleChangeSelectWorkOrder(e)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm='6' className='fs-3 fw-semibold pt-0 pb-0'>
                    WORK ORDER STATUS :{' '}
                  </Form.Label>

                  <Col sm='6'>
                    <p className='fs-3 fw-semibold text-success'>{orderDetail?.status.category}</p>
                  </Col>
                </Form.Group>
              </Row>

              <Row className='mb-5'>
                <Col>
                  <Form.Group>
                    <Form.Label className='fw-semibold'>Tanggal & Jam Survey</Form.Label>
                    <Form.Control type='datetime-local' onChange={handleInputDateTimeSurvey} />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label className='fw-semibold'>Lama Pekerjaan</Form.Label>
                    <Form.Control type='text' onChange={handleInputWorkTIme} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className='d-flex justify-content-end mb-5'>
                <Button variant='button-dark-primary' onClick={() => handleAddForm()}>
                  Tambah Material
                </Button>
              </Row>

              <div className='fs-5 text-dark fw-bold mb-2'>List Material</div>

              <table className='table'>
                <thead className='table-item-head'>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {materialValues.map((element, index) => (
                    <tr key={element.id}>
                      <td>
                        <Select
                          id={`item-name-${index}`}
                          className='form-control p-0 form-item-name'
                          classNamePrefix='select'
                          placeholder='Pilih/Ketik Nama Material'
                          isSearchable={true}
                          options={material}
                          onChange={(element) => handleChangeSelectItem(index, element)}
                        />
                      </td>

                      <td>
                        <Form.Control
                          id={`quantity-${index}`}
                          value={element.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                        />
                      </td>

                      <td>
                        <Button variant='danger' onClick={() => handleRemoveForm(index)}>
                          Remove
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
