import React, {FC, useState, useEffect, useRef, ChangeEvent} from 'react'

import './UpdateQuotation.css'

import axios from 'axios'
import Select from 'react-select'
import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, InputGroup, Button, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface StoreItem {
  value: string
  label: string
}

const UpdateQuotationHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()

  // Fetch Data Quotation
  const [quotationDetail, setQuotationDetail] = useState<any>()

  // Fetch Data Order
  const [order, setOrder] = useState<any>()
  const [orderId, setOrderId] = useState<string>('')
  const [orderDetail, setOrderDetail] = useState<any>()

  // Store
  const [store, setStore] = useState<StoreItem[]>([])
  const [storeId, setStoreId] = useState<string>('')
  const [storeName, setStoreName] = useState<string>('')

  const fetchQuotationData = async () => {
    try {
      await axios
        .get(`${apiUrl}/quotation/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data
          setQuotationDetail(data)

          if (data?.order.id) {
            setOrderId(data.order.id)
          }

          if (data?.store?.id && data?.store?.store_name) {
            setStoreId(data.store.id)
            setStoreName(data.store.store_name)
          }
        })
    } catch (error) {
      console.error(error)
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

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Add Quotation
  const [quotationStatus, setQuotationStatus] = useState<any>()
  const [quotationNumber, setQuotationNumber] = useState<string | number>('NaN')
  const [quotationDescription, setQuotationDescription] = useState<string>('')
  const [quotationDate, setQuotationDate] = useState<string>('')
  const [quotationValidity, setQuotationValidity] = useState<string>('')
  const [quotationFiles, setQuotationFiles] = useState<Array<File | null>>([])

  const evidenceRef = useRef<HTMLInputElement>(null)

  // Select Store
  const handleChangeSelectStore = (element: any) => {
    const updatedStoreId = element.value
    const updatedStoreName = element.label

    setStoreId(updatedStoreId)
    setStoreName(updatedStoreName)
  }

  // Select Order
  const handleChangeSelectOrder = (element: any) => {
    const selectedOrder = element.value
    setOrderId(selectedOrder)
  }

  const [fileName, setFileName] = useState<string>('No selected file')
  const [image, setImage] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      setFileName(files[0].name)
      setImage(URL.createObjectURL(files[0]))
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = () => {
    setFileName('No selected file')
    setImage(null)
  }

  return (
    <section id='update-quotation'>
      <div className='card mb-5'>
        <div className='card-body'>
          <Row>
            <Col lg={8}>
              <Row className='mb-5'>
                <Col lg={4}>
                  <div className='quotation-information'>
                    <div className='form-header'></div>

                    <div className='form-body'>
                      <Form.Group className='mb-5'>
                        <Form.Label>Nama Toko</Form.Label>

                        <Col>
                          <Select
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
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group className='mb-5'>
                        <Form.Label>Costumer Name</Form.Label>
                        <Form.Control
                          type='text'
                          readOnly
                          value={quotationDetail?.order.members.full_name}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </Col>

                <Col lg={4}>
                  <div className='quotation-information'>
                    <div className='form-header'></div>

                    <div className='form-body'>
                      <Form.Group className='mb-5'>
                        <Form.Label>Order ID</Form.Label>

                        <Form.Control readOnly value={orderId} />
                      </Form.Group>

                      <Form.Group className='mb-5'>
                        <Form.Label>Phone Number / WA Number</Form.Label>
                        <Form.Control
                          type='number'
                          readOnly
                          value={quotationDetail?.order.project_number}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </Col>

                <Col lg={4}>
                  <div className='quotation-information'>
                    <div className='form-header'></div>

                    <div className='form-body'>
                      <Form.Group className='mb-5'>
                        <Form.Label>Costumer ID</Form.Label>
                        <Form.Control
                          type='number'
                          readOnly
                          value={quotationDetail?.order.members.id}
                        />
                      </Form.Group>

                      <Form.Group className='mb-5'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          type='email'
                          readOnly
                          value={quotationDetail?.order.members.email}
                        />
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
                      {orderDetail?.payment_type === 'survey' ? (
                        <>
                          <tr>
                            <td colSpan={6}>Survey</td>
                          </tr>
                        </>
                      ) : (
                        orderDetail?.order_details.map((item: any, index: any) => (
                          <>
                            <tr>
                              <td>{item?.unit}</td>
                              <td>{item?.quantity}</td>
                              <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString(
                                'id'
                              )}`}</td>
                              <td>{`Rp. ${item?.total.toLocaleString('id')}`}</td>
                            </tr>
                          </>
                        ))
                      )}

                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Total
                        </td>
                        <td className=' fw-bolder'>
                          {' '}
                          {orderDetail?.payment_type === 'gratis' ||
                          orderDetail?.payment_type === 'pemasangan_tanpa_survey'
                            ? `                      Rp. ${0?.toLocaleString(
                                'id'
                              )}                        `
                            : orderDetail?.payment_type === 'survey'
                            ? `                      Rp. ${99000?.toLocaleString(
                                'id'
                              )}                        `
                            : `Rp. ${0}`}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Discount (8%)
                        </td>
                        <td className=' fw-bolder'>-144.000</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Grand Total
                        </td>
                        <td className=' fw-bolder'>1.854.000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Row>

              <Row>
                <Col xxl={6}>
                  <Form.Group controlId='formFile' className='mb-5'>
                    <Form.Label>Upload File </Form.Label>{' '}
                    <Form className='form-input-image' onClick={handleImageClick}>
                      <Form.Control
                        type='file'
                        accept='image/*'
                        className='input-field-image'
                        hidden
                        onChange={handleFileChange}
                      />

                      {image ? (
                        <img src={image} alt={fileName} className='image-preview' />
                      ) : (
                        <div className='input-image-text'>
                          <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                          <p>Add File</p>
                        </div>
                      )}
                    </Form>
                    <div className='uploaded-row'>
                      <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                      <span className='upload-content'>{fileName}</span>

                      <FontAwesomeIcon
                        icon={faTrash}
                        size='sm'
                        color='#ed2b2a'
                        style={{cursor: 'pointer'}}
                        onClick={handleRemoveFile}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col xxl={6}></Col>
              </Row>
            </Col>

            <Col lg={4}>
              <div className='bank-information'>
                <div className='form-header'>
                  <h1 className='fw-bold'>ORDER STATUS: </h1>
                  <h1 className='fw-bold text-success'>QUOTE OUT</h1>
                </div>

                <div className='form-body'>
                  <Form.Group as={Row} className='mb-5' controlId='formPlaintextEmail'>
                    <Form.Label column sm='4'>
                      Quotation ID :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control type='text' readOnly value={quotationDetail?.id} />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5' controlId='formPlaintextEmail'>
                    <Form.Label column sm='4'>
                      Valid Until :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        type='text'
                        readOnly
                        value={
                          quotationDetail
                            ? formatDate(new Date(quotationDetail.quotation_validity))
                            : ''
                        }
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group className='mb-5'>
                    <Form.Label>Address :</Form.Label>
                    <Form.Control
                      as='textarea'
                      className='field-alamat'
                      readOnly
                      value={quotationDetail?.order.project_address}
                    />
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5'>
                    <Form.Label column sm='4'>
                      Bank Name :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control type='text' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5'>
                    <Form.Label column sm='4'>
                      Bank Account :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control type='text' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5'>
                    <Form.Label column sm='4'>
                      Account Name :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control type='text' />
                    </Col>
                  </Form.Group>
                </div>
              </div>
            </Col>
          </Row>

          <Row className='mt-5'>
            <Col lg={8}>
              <div className='d-flex justify-content-center align-items-end'>
                <Button variant='dark-danger' type='submit'>
                  Cancel
                </Button>

                <Button variant='dark-primary' type='submit'>
                  Save
                </Button>
              </div>
            </Col>

            <Col lg={4}>
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

export {UpdateQuotationHO}
