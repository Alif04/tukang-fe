import React, {FC, useState, useEffect, useRef} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './NewQuotation.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import {Form, Table, Button, Row, Col} from 'react-bootstrap'

interface StoreItem {
  value: string
  label: string
}

const NewQuotationVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  // Fetch Data Order
  const [order, setOrder] = useState<any>()
  const [orderId, setOrderId] = useState<string>('')
  const [orderDetail, setOrderDetail] = useState<any>()

  // Store
  const [store, setStore] = useState<StoreItem[]>([])
  const [storeId, setStoreId] = useState<string>('')
  const [storeName, setStoreName] = useState<string>('')
  const [storeDetail, setStoreDetail] = useState<any>()

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

  const getStoreDetail = async () => {
    try {
      const response = await axios.get(`${apiUrl}/stores/${storeId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      const data = response.data.data
      setStoreDetail(data)
    } catch (err) {
      console.error(err)
    }
  }

  const getOrder = async () => {
    try {
      const response = await axios.get(`${apiUrl}/orders?order_by=desc&take=0`, {
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
    } catch (err) {
      console.error(err)
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

  const getCode = async () => {
    try {
      const response = await axios.get(`${apiUrl}/quotation/next-code`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response.status === 200) {
        const {data} = response
        setQuotationNumber(data.data.code)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getOrder()
    getStore()
    getCode()
  }, [])

  useEffect(() => {
    if (orderId) {
      getOrderDetail()
    }

    if (storeId) {
      getStoreDetail()
    }
  }, [orderId, storeId])

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

  // Quotation Status
  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatus = statusData.find((status: any) => status.category === 'SURVEYDONE')
    const statusId = desiredStatus.value

    setQuotationStatus(statusId)
  }, [quotationStatus])

  // Handle Change Quotation Description
  const handleInputQuotationDesc = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedInputValue = event.target.value
    setQuotationDescription(updatedInputValue)
  }

  // Handle Change Quotation Date
  const today = new Date().toISOString().split('T')[0]

  const handleChangeQuotationDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQuotationDate = event.target.value
    setQuotationDate(updatedQuotationDate)
  }

  // Handle Change Quotation Validity
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

  // Quotation Validation
  const QuotationValidation = () => {
    let valid = true

    if (!orderId) {
      Swal.fire({
        title: 'Error',
        text: 'Please select order Id',
        icon: 'error',
      })
      valid = false
    } else if (!quotationDescription) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill instruksi spesial form',
        icon: 'error',
      })
      valid = false
    } else if (!storeId) {
      Swal.fire({
        title: 'Error',
        text: 'Please select store',
        icon: 'error',
      })
      valid = false
    } else if (!quotationDate) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill tanggal form',
        icon: 'error',
      })
      valid = false
    } else if (!quotationValidity) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill quotation valid until form',
        icon: 'error',
      })
      valid = false
    }
    return valid
  }

  // Handle Submit Complaint
  const handleSubmitNewQuotation = async () => {
    if (QuotationValidation()) {
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
        .post(`${apiUrl}/quotation`, formData, {
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
              text: 'Success Add Quotation',
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
  }

  const handleCancelQuotation = () => {
    navigate('/quotation/view-quotation')
  }

  return (
    <section id='new-quotation'>
      <div className='card'>
        <div className='card-body'>
          <Row className='mb-4'>
            <Col xxl={6} className='vendor-information'>
              <div className='vendor-detail'>
                <img
                  alt='Logo'
                  className='h-50px logo mb-3'
                  src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
                />

                <Form.Group>
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
                    />
                  </Col>
                </Form.Group>

                <Form.Label className='mt-5 fs-5 fw-bold'>{storeDetail?.address}</Form.Label>
              </div>
            </Col>

            <Col xxl={6} className='payment-request'>
              <h1 className='fw-bolder'>QUOTATION</h1>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold' column sm='4'>
                  Status :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control
                    readOnly
                    plaintext
                    className='fs-2 fw-bold text-black'
                    type='text'
                    value={orderDetail?.status.category}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold' column sm='4'>
                  Tanggal :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control type='date' min={today} onChange={handleChangeQuotationDate} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold' column sm='4'>
                  Order ID :
                </Form.Label>

                <Col sm='8'>
                  <Select
                    name='order-id'
                    className='form-control p-0'
                    placeholder='Ketik/Pilih Order Id'
                    isSearchable={true}
                    options={order}
                    onChange={(e) => handleChangeSelectOrder(e)}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold' column sm='4'>
                  Quotation ID :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control type='number' value={quotationNumber} readOnly />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold' column sm='4'>
                  Costumer ID :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control type='number' readOnly value={orderDetail?.members.id} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold' column sm='4'>
                  Quotation Valid Until :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control type='date' min={today} onChange={handleChangeQuotationValidity} />
                </Col>
              </Form.Group>
            </Col>
          </Row>

          <Row className='mb-4'>
            <Col xxl={6}>
              <div className='receiver-information'>
                <div className='receiver-detail'>
                  <h1 className='fw-bolder'>Ditunjukkan kepada :</h1>
                  <h1 className='fw-bolder mt-2'>{orderDetail?.members.full_name}</h1>
                </div>

                <div className='address'>
                  <h3 className='fw-normal'>{orderDetail?.project_address}</h3>
                  <h3 className='fw-normal'>
                    {orderDetail?.project_number ? `Telp : ${orderDetail?.project_number}` : ''}
                  </h3>
                </div>
              </div>
            </Col>

            <Col xxl={6}>
              <div className='payment-request'>
                <Form.Group>
                  <Form.Label className='fs-5 fw-bold'>Instruksi Spesial</Form.Label>
                  <Form.Control
                    style={{minHeight: '140px'}}
                    as='textarea'
                    onChange={handleInputQuotationDesc}
                  />
                </Form.Group>
              </div>
            </Col>
          </Row>

          <div className='detail-table-jasa'>
            <Table hover>
              <thead>
                <tr>
                  <th className='text-center'>Jenis Jasa</th>
                  <th className='text-center'>Quantity</th>
                  <th className='text-center'>Harga Satuan</th>
                  <th className='text-center'>Total Harga</th>
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
                        <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString('id')}`}</td>
                        <td>{`Rp. ${item?.total.toLocaleString('id')}`}</td>
                      </tr>
                    </>
                  ))
                )}

                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Total Jasa
                  </td>
                  <td className=' fw-bolder'>
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
              </tbody>
            </Table>
          </div>

          <div className='detail-table-material'>
            <Table hover>
              <thead>
                <tr>
                  <th className='text-center'>Material Yang Dibutuhkan</th>
                  <th className='text-center'>Quantity</th>
                  <th className='text-center'>Harga Satuan</th>
                  <th className='text-center'>Total Harga</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Instalasi AC</td>
                  <td>1</td>
                  <td>500.000</td>
                  <td>500.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Total Material
                  </td>
                  <td className=' fw-bolder'>1.800.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Total Jasa & Material
                  </td>
                  <td className=' fw-bolder'>1.800.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Promosi ( Free Survey )
                  </td>
                  <td className=' fw-bolder'></td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Additional Promosi
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
            </Table>
          </div>

          <div className='payment-detail'>
            <div className='payment-method'>
              <h1 className='fw-bolder'>Silahkan melakukan pembayaran di account di bawah ini :</h1>

              <h3 className='fw-normal'>BANK BCA</h3>
              <h3 className='fw-normal'>PT.MITRA10</h3>
              <h3 className='fw-normal'>123-876-90</h3>
            </div>

            <div className='payment-evidence'>
              <h1 className='fw-bolder'>Silahkan kirim bukti bayar anda melalui:</h1>
              <h1 className='fw-bolder'>WA: 0813748392</h1>
              <h1 className='fw-bolder'>Email: Installation.support@mitra10.com</h1>
            </div>

            <h1 className='fw-bolder'>
              Terima kasih telah melakukan bisnis dengan Mitra10. Kami harap kedatangan anda
              kembali.
            </h1>
          </div>

          <div className='d-flex justify-content-center align-items-center mt-5'>
            <Button
              variant='dark-danger'
              className='d-flex justify-content-center align-items-center'
              type='submit'
              onClick={handleCancelQuotation}
            >
              Cancel
            </Button>

            <Button
              variant='dark-primary'
              className='d-flex justify-content-center align-items-center'
              type='submit'
              onClick={handleSubmitNewQuotation}
            >
              Save & Email
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewQuotationVendor}
