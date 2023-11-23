import React, {FC, useState, useEffect, useRef} from 'react'

import './UpdateQuotation.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {Row, Col, Form, Table, Button, ListGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface StoreItem {
  value: string
  label: string
}

interface Status {
  value: number
  category: string
}

const UpdateQuotationVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()

  // Quotation Detail
  const [orderId, setOrderId] = useState<string>('')
  const [quotationDetail, setQuotationDetail] = useState<any>()

  // Store
  const [store, setStore] = useState<StoreItem[]>([])
  const [storeId, setStoreId] = useState<string>('')
  const [storeName, setStoreName] = useState<string>('')

  const fetchQuotationData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/quotation/${params.id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      const data = response.data.data
      setQuotationDetail(data)

      if (data?.order.id) {
        setOrderId(data.order.id)
      }

      if (data?.quotation_number) {
        setQuotationNumber(data.quotation_number)
      }

      if (data?.store) {
        setStoreId(data.store.id)
        setStoreName(data.store.store_name)
      }

      if (data?.quotation_date) {
        setQuotationDate(new Date(data.quotation_date).toISOString().split('T')[0])
      }

      if (data?.quotation_validity) {
        setQuotationValidity(new Date(data.quotation_validity).toISOString().split('T')[0])
      }

      if (data?.description) {
        setQuotationDescription(data.description)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getStore = async () => {
    try {
      const response = await axios.get(`${apiUrl}/stores`, {
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
          address: item.address,
          city_id: item.city_id,
          zip_code: item.zip_code,
        }))

        setStore(tempStore)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchQuotationData()
    getStore()
  }, [])

  // Add Quotation
  const [quotationStatus, setQuotationStatus] = useState<any>()
  const [quotationNumber, setQuotationNumber] = useState<string | number>('NaN')
  const [quotationDescription, setQuotationDescription] = useState<string>('')
  const [quotationDate, setQuotationDate] = useState<string>('')
  const [quotationValidity, setQuotationValidity] = useState<string>('')
  const [quotationFiles, setQuotationFiles] = useState<Array<File | null>>([])

  const evidenceRef = useRef<HTMLInputElement>(null)

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Quotation Status
  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatus = statusData.find((status: any) => status.category === 'SURVEYDONE')
    const statusId = desiredStatus.value

    setQuotationStatus(statusId)
  }, [quotationStatus])

  // Select Store
  const handleChangeSelectStore = (element: any) => {
    const updatedStoreId = element.value
    const updatedStoreName = element.label

    setStoreId(updatedStoreId)
    setStoreName(updatedStoreName)
  }

  // Handle Change Quotation Validity
  const today = new Date().toISOString().split('T')[0]

  const handleChangeQuotationValidity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQuotationValidity = event.target.value
    setQuotationValidity(updatedQuotationValidity)
  }

  // Handle Upload Quotation File
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const {length} = fileList

      for (let i = 0; i < length; i++) {
        file[i] = fileList.item(i)
      }

      setQuotationFiles(file)
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
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

  // Handle Update Quotation
  const handleUpdateQuotation = async () => {
    const formData = new FormData()

    formData.append('order_id', orderId)
    formData.append('store_id', storeId)
    formData.append('quotation_status', quotationStatus)
    formData.append('description', quotationDescription)
    formData.append('quotation_number', quotationNumber.toString())
    formData.append('quotation_date', quotationDate)
    formData.append('quotation_validity', quotationValidity)

    if (quotationFiles?.length) {
      quotationFiles.forEach((item) => {
        if (item) {
          formData.append(`quotation_files`, item, item?.name)
        }
      })
    }

    const response = await axios
      .post(`${apiUrl}/quotation/${params.id}`, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          Swal.fire({
            title: 'Success',
            text: 'Success Update Quotation',
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

        navigate('/quotation/view-quotation')
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

  const handleCancelQuotation = () => {
    navigate('/quotation/view-quotation')
  }

  return (
    <section id='update-quotation-vendor'>
      <div className='card mb-5'>
        <div className='card-body'>
          <Row>
            <Col lg={8}>
              <Row className='mb-5'>
                <Col lg={6}>
                  <div className='quotation-information'>
                    <div className='form-body'>
                      <Form.Group as={Row} className='mb-5'>
                        <Form.Label column sm='6'>
                          Order ID
                        </Form.Label>
                        <Col sm='6'>
                          <Form.Control readOnly value={quotationDetail?.order.id} />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className='mb-5'>
                        <Form.Label column sm='6'>
                          Nama Toko :
                        </Form.Label>
                        <Col sm='6'>
                          {/* <Select
                            name='store_id'
                            className='form-control p-0'
                            classNamePrefix='select'
                            placeholder='Pilih Toko'
                            isSearchable={true}
                            options={store}
                            onChange={(element) => handleChangeSelectStore(element)}
                            value={{
                              value: storeId,
                              label: storeName,
                            }}
                          />  */}
                          <Form.Control readOnly value={quotationDetail?.store.store_name} />
                        </Col>
                      </Form.Group>
                    </div>
                  </div>
                </Col>

                <Col lg={6}>
                  <div className='quotation-information'>
                    <div className='form-body'>
                      <Form.Group as={Row} className='mb-5'>
                        <Form.Label column sm='6'>
                          Quotation Number
                        </Form.Label>
                        <Col sm='6'>
                          <Form.Control readOnly value={quotationDetail?.quotation_number} />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className='mb-5'>
                        <Form.Label column sm='6'>
                          Quotation Valid Until :
                        </Form.Label>
                        <Col sm='6'>
                          <Form.Control
                            type='date'
                            min={today}
                            onChange={handleChangeQuotationValidity}
                            value={quotationValidity}
                          />
                        </Col>
                      </Form.Group>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className='mt-5'>
                <div className='table-item'>
                  <table className='table table-hover'>
                    <thead className='table-item-head'>
                      <tr>
                        <th>Item</th>
                        <th>Harga Satuan</th>
                        <th>Jumlah</th>
                        <th>Total Harga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotationDetail?.order.m_order_details.map((item: any) => (
                        <>
                          <tr>
                            <td>{item?.unit}</td>
                            <td>{item?.quantity}</td>
                            <td>{`Rp. ${parseInt(item?.unit_price || 0).toLocaleString('id')}`}</td>
                            <td>{`Rp. ${item?.total.toLocaleString('id')}`}</td>
                          </tr>
                        </>
                      ))}

                      {/* 
                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Total
                        </td>
                        <td className=' fw-bolder'>{`Rp. ${item?.total.toLocaleString('id')}`}</td>
                      </tr> */}

                      {/* <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Pajak
                        </td>
                        <td className=' fw-bolder'>-144.000</td>
                      </tr> */}

                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Grand Total
                        </td>
                        <td className=' fw-bolder'>
                          {`Rp. ${parseInt(quotationDetail?.order?.grand_total).toLocaleString(
                            'id'
                          )}`}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Row>

              <Row className='mb-5'>
                <div className='costumer-information'>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    Customer Name : {quotationDetail?.order.members.full_name}
                  </h3>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    WA/Phone Number : {quotationDetail?.order.project_number}
                  </h3>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    Email Address : {quotationDetail?.order.members.email}
                  </h3>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    Address : {quotationDetail?.order.project_address}
                  </h3>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    Tanggal Request Survey: {formatDate(new Date(quotationDetail?.quotation_date))}
                  </h3>
                </div>
              </Row>

              <div className='d-flex justify-content-center align-items-end'>
                <Button variant='dark-danger' type='submit' onClick={handleCancelQuotation}>
                  Cancel
                </Button>

                <Button variant='dark-primary' type='submit' onClick={handleUpdateQuotation}>
                  Save
                </Button>
              </div>
            </Col>

            <Col lg={4}>
              <div className='bank-information'>
                <div className='form-header'>
                  <h1 className='fw-bold'>NEW WO STATUS: </h1>
                  <h1 className='fw-bold text-success'>QUOTE IN</h1>
                </div>

                <div className='form-sub-header'>
                  <div className='sub-header'>
                    <h3 className=' fw-bolder text-end'>WO STATUS :</h3>
                    <h3 className='text-success'>
                      {quotationDetail?.order.work_orders
                        ? quotationDetail?.order.work_orders.status_id
                        : ''}
                    </h3>
                  </div>

                  <div className='sub-header'>
                    <h3 className='fw-bolder text-end'>Tanggal Pengerjaan :</h3>
                    <h3 className=''>
                      {quotationDetail?.order.work_orders
                        ? formatDate(new Date(quotationDetail?.order.work_orders.work_start_date))
                        : ''}
                    </h3>
                  </div>
                </div>

                <div className='form-body'>
                  <div className='update-quotation-evidence'>
                    <Form.Group controlId='formFile' className='mt-3'>
                      <Form.Label>Upload File </Form.Label>{' '}
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
                        {quotationFiles.length ? (
                          quotationFiles.map((item, index) => (
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
                </div>
              </div>

              <div className='d-flex justify-content-center align-items-center mt-5'>
                <Button variant='dark-primary' type='submit' className='w-100'>
                  Print Quotation
                </Button>

                <Button variant='dark-success' type='submit' className='w-100'>
                  Email Quotation
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  )
}

export {UpdateQuotationVendor}
