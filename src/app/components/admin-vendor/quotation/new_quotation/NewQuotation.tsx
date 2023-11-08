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

interface Status {
  value: number
  category: string
}

const NewQuotationVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  // Fetch Data Order
  const [order, setOrder] = useState<any>()
  const [orderId, setOrderId] = useState<string>('')
  const [orderDetail, setOrderDetail] = useState<any>()

  // Order Details
  const [orderDetailValues, setOrderDetailValues] = useState([
    {
      id: null,
      item_id: '',
      unit: '',
      quantity: 1,
      unit_price: 0,
      total: 0,
      margin: 0,
      final_price: 0,
    },
  ])

  const [grandTotal, setGrandTotal] = useState<number>(0)

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

          if (data?.order_details) {
            const initialOrderDetailValues = data.order_details.map((item: any) => ({
              id: item.id,
              item_id: item.item_id,
              unit: item.unit,
              quantity: item.quantity,
              unit_price: parseInt(item.unit_price),
              total: item.total,
            }))

            setOrderDetailValues(initialOrderDetailValues)
          }

          if (data?.store) {
            setStoreId(data.store.id)
          }
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

  // Format Date
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Change Margin Value
  let handleMarginChange = (index: any, value: any) => {
    const updatedOrderDetailValues = [...orderDetailValues]
    const selectedUnitPrice = updatedOrderDetailValues[index].total
    const profitPercentage = value / 100

    updatedOrderDetailValues[index] = {
      ...updatedOrderDetailValues[index],
      margin: value,
      final_price: selectedUnitPrice + profitPercentage * selectedUnitPrice,
    }

    setOrderDetailValues(updatedOrderDetailValues)
  }

  // Calculate Grand Total Jasa
  const calculatedGrandTotalOrder = () => {
    return orderDetailValues.reduce((accumulator, item) => {
      const calculatedTotal = item.final_price
      return accumulator + calculatedTotal
    }, 0)
  }

  useEffect(() => {
    const calculatedGrandTotal = calculatedGrandTotalOrder()

    setGrandTotal(calculatedGrandTotal)
  }, [orderDetailValues])

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

    const desiredStatus = statusData.find((status: any) => status.category === 'QUOTEIN')
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

  // Handle Submit Quotation
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

      // orderDetailValues.forEach((order, index) => {
      //   formData.append(`order_details[${index}][id]`, String(order.id))
      //   formData.append(`order_details[${index}][item_id]`, String(order.item_id))
      //   formData.append(`order_details[${index}][unit]`, order.unit)
      //   formData.append(`order_details[${index}][quantity]`, String(order.quantity))
      //   formData.append(`order_details[${index}][unit_price]`, String(order.unit_price))
      //   formData.append(`order_details[${index}][margin]`, String(order.margin))
      //   formData.append(`order_details[${index}][final_price]`, String(order.final_price))
      // })

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
                  <Form.Label>Nama Toko :</Form.Label>

                  <Col>
                    {/* <Select
                      name='store_id'
                      className='form-control p-0'
                      classNamePrefix='select'
                      placeholder='Pilih Toko'
                      isSearchable={true}
                      options={store}
                      onChange={(element) => handleChangeSelectStore(element)}
                    /> */}
                    <Form.Label className='mt-5 fs-3 fw-bold'>
                      {orderDetail?.store?.store_name}
                    </Form.Label>
                  </Col>
                </Form.Group>

                <Form.Label className='mt-5 fs-5 fw-bold'>{orderDetail?.store?.address}</Form.Label>
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
                  <th className='text-center'>QTY</th>
                  <th className='text-center'>Satuan</th>
                  {/* <th className='text-center'>Total</th> */}
                  {/* <th className='text-center'>Margin</th> */}
                  <th className='text-center'>Final Price</th>
                </tr>
              </thead>
              <tbody>
                {orderDetailValues.map((element, index) => (
                  <>
                    <tr key={element.id}>
                      <td>
                        <Form.Control
                          readOnly
                          plaintext
                          value={orderDetailValues[index]?.unit || ''}
                        />
                      </td>
                      <td>
                        <Form.Control
                          readOnly
                          plaintext
                          value={`${
                            orderDetailValues[index]?.quantity
                              ? orderDetailValues[index]?.quantity
                              : 0
                          }`}
                        />
                      </td>
                      <td>
                        <Form.Control
                          readOnly
                          plaintext
                          value={`Rp. ${
                            orderDetailValues[index]?.unit_price
                              ? orderDetailValues[index]?.unit_price.toLocaleString('id')
                              : 0
                          }`}
                        />
                      </td>
                      {/* <td>
                        {`Rp. ${
                          orderDetailValues[index]?.total
                            ? orderDetailValues[index]?.total.toLocaleString('id')
                            : 0
                        }`}
                      </td> */}
                      {/* <td>
                        <Form.Control
                          type='number'
                          plaintext
                          placeholder='%'
                          value={element.margin}
                          onChange={(e) => handleMarginChange(index, e.target.value)}
                        />
                      </td> */}
                      <td>
                        {/* <Form.Control
                          readOnly
                          plaintext
                          value={`Rp. ${
                            orderDetailValues[index]?.final_price
                              ? orderDetailValues[index]?.final_price.toLocaleString('id')
                              : 0
                          }`}
                        /> */}
                        {`Rp. ${
                          orderDetailValues[index]?.total
                            ? orderDetailValues[index]?.total.toLocaleString('id')
                            : 0
                        }`}
                      </td>
                    </tr>
                  </>
                ))}

                {/* <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Total Jasa
                  </td>
                  <td className=' fw-bolder'>
                    {`Rp. ${
                      grandTotal
                        ? grandTotal.toLocaleString('id')
                        : parseInt(orderDetail?.grand_total).toLocaleString('id')
                    }`}
                  </td>
                </tr> */}
              </tbody>
            </Table>
          </div>

          <div className='detail-table-material'>
            <Table hover>
              <thead>
                <tr>
                  <th className='text-center'>Material Yang Dibutuhkan</th>
                  <th className='text-center'>QTY</th>
                  <th className='text-center'>Satuan</th>
                  <th className='text-center'>Total</th>
                  <th className='text-center'>Margin</th>
                  <th className='text-center'>Final Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Instalasi AC</td>
                  <td>1</td>
                  <td>500.000</td>
                  <td>500.000</td>
                  <td>500.000</td>
                  <td>500.000</td>
                </tr>
                <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Total Material
                  </td>
                  <td className=' fw-bolder'>1.800.000</td>
                </tr>
                <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Total Jasa & Material
                  </td>
                  <td className=' fw-bolder'>1.800.000</td>
                </tr>
                <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
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
