import React, {FC, useState, useEffect, useRef} from 'react'

import './NewInvoice.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import {Table, Row, Col, Form, Button, ListGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faImage, faFileImage, faTrash} from '@fortawesome/free-solid-svg-icons'

interface Status {
  value: number
  category: string
}

const NewInvoiceVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  // Fetch Data Order
  const [order, setOrder] = useState<any>()
  const [orderId, setOrderId] = useState<string>('')
  const [orderDetail, setOrderDetail] = useState<any>()

  const getOrder = async () => {
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
        const tempOrder = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.id,
        }))

        setOrder(tempOrder)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } else {
      console.error('Desired status not found in statusData')
    }
  }

  const getOrderDetail = async () => {
    try {
      await axios
        .get(`${apiUrl}/orders/${orderId}`, {
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
        })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getOrder()

    if (orderId) {
      getOrderDetail()
    }
  }, [orderId])

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

  // Select Order
  const handleChangeSelectOrder = (element: any) => {
    const selectedOrder = element.value
    setOrderId(selectedOrder)
  }

  // Add Invoice
  const [requestWorkTime, setRequestWorkTime] = useState<string>('')
  const [surveyDate, setSurveyDate] = useState<string>('')
  const [workStartDate, setWorkStartDate] = useState<string>('')
  const [workEndDate, setworkEndDate] = useState<string>('')
  const [invoiceFiles, setInvoiceFiles] = useState<Array<File | null>>([])

  const evidenceRef = useRef<HTMLInputElement>(null)

  // Handle Change Upload File
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files

    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const {length} = fileList

      for (let i = 0; i < length; i++) {
        file[i] = fileList.item(i)
      }

      setInvoiceFiles(file)
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = (index: number) => {
    const newEvidances = [...invoiceFiles]

    newEvidances.splice(index, 1)

    setInvoiceFiles(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  return (
    <section id='new-invoice'>
      <div className='card'>
        <div className='card-body'>
          <Row>
            <Col lg={8}>
              <Row>
                <Col>
                  <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
                    <Form.Label>Order ID</Form.Label>
                    <Select
                      name='order-id'
                      className='form-control p-0'
                      placeholder='Ketik/Pilih Order Id'
                      isSearchable={true}
                      options={order}
                      onChange={(e) => handleChangeSelectOrder(e)}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
                    <Form.Label>Qoutation ID</Form.Label>
                    <Form.Control type='number' readOnly value={orderDetail?.quotation.Id} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className='mt-5 mb-5'>
                <div className='table-item'>
                  <Table striped hover>
                    <thead className='table-item-head'>
                      <tr>
                        <th>Nama Barang</th>
                        <th>Harga Satuan</th>
                        <th>Jumlah</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetail?.order_details.map((item: any) => (
                        <>
                          <tr>
                            <td>{item?.unit}</td>
                            <td>{item?.quantity}</td>
                            <td>{`Rp. ${parseInt(item?.unit_price || 0).toLocaleString('id')}`}</td>
                            <td>{`Rp. ${item?.total.toLocaleString('id')}`}</td>
                          </tr>
                        </>
                      ))}

                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Total
                        </td>
                        <td className=' fw-bolder'>690.500</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Pajak
                        </td>
                        <td className=' fw-bolder'>69.050</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Grand Total
                        </td>
                        <td className=' fw-bolder'>
                          {`Rp. ${parseInt(orderDetail?.grand_total).toLocaleString('id')}`}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Row>

              <Row className='mb-5'>
                <div className='costumer-information'>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    Customer Name : {orderDetail?.members.full_name}
                  </h3>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    WA/Phone Number : {orderDetail?.members.project_number}
                  </h3>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    Email Address : {orderDetail?.members.email}
                  </h3>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    Address : {orderDetail?.project_address}
                  </h3>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    Tanggal Request Survey: {formatDate(new Date(orderDetail?.survey_date))}
                  </h3>
                </div>
              </Row>

              <div className='d-flex justify-content-center'>
                <Button variant='dark-danger m-0' type='submit'>
                  Cancel
                </Button>

                <Button variant='dark-primary' type='submit'>
                  Save
                </Button>
              </div>
            </Col>

            <Col lg={4}>
              <div className='survey-information'>
                <div className='form-header'>
                  <h1 className='fw-bold'>WORK STATUS : </h1>
                  <h1 className='fw-bold text-success'>INVOICED</h1>
                </div>

                <div className='form-body'>
                  <h3 className='fs-5 fw-bolder text-end mt-4 mb-4'>
                    Tanggal Survey :{' '}
                    {orderDetail?.survey_date ? formatDate(new Date(orderDetail?.survey_date)) : ''}
                  </h3>
                  <h3 className='fs-5 fw-bolder text-end mt-4 mb-4'>
                    Tanggal Pengerjaan : 12/2/2023
                  </h3>
                  <h3 className='fs-5 fw-bolder text-end mt-4 mb-4'>
                    Lama Pengerjaan :{' '}
                    {orderDetail?.work_orders
                      ? formatDate(new Date(orderDetail?.work_orders.time_spent))
                      : ''}
                  </h3>
                  <h3 className='fs-5 fw-bolder text-end mt-4 mb-4'>
                    Tanggal Selesai :{' '}
                    {orderDetail?.work_orders
                      ? formatDate(new Date(orderDetail?.work_orders.work_end_date))
                      : ''}
                  </h3>
                </div>
              </div>

              <div className='invoice-evidence'>
                <Form.Group controlId='formFile'>
                  <Form.Label>UPLOAD BUKTI</Form.Label>
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
                    {invoiceFiles.length ? (
                      invoiceFiles.map((item, index) => (
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
              </div>

              <div className='d-flex justify-content-end'>
                <Button variant='dark-success' type='submit'>
                  Save & Email Quotation
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  )
}

export {NewInvoiceVendor}
