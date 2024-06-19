import React, {FC, useState, useEffect, useRef} from 'react'

import './NewQuotation.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import {Form, Table, Button, Row, Col, Card} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'

interface Status {
  value: number | null
  category: string
}

interface QuotationDetail {
  id: number | null
  index: string
  item_id: number | null
  work_order_item_id: number | null
  category_id: number | null
  category_name: string
  type: number
  item_name: string
  unit_price: number
  unit: string
  description: string
  total: number
  final_price: number
  margin: number
  margin_type: number
  quantity: number
  is_user: number
}

const NewQuotationVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const vendorId = localStorage.getItem('vendor_id')
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch Data Work Order
  const [workOrder, setWorkOrder] = useState<any>()
  const [workOrderId, setWorkOrderId] = useState<string>('')
  const [workOrderDetail, setWorkOrderDetail] = useState<any>()

  // Add Quotation
  const [quotationStatus, setQuotationStatus] = useState<any>()
  const [quotationNumber, setQuotationNumber] = useState<string | number>('NaN')
  const [quotationDescription, setQuotationDescription] = useState<string>('')
  const [quotationDate, setQuotationDate] = useState<string>('')
  const [quotationValidity, setQuotationValidity] = useState<any>()

  const [totalJasa, setTotalJasa] = useState<number>(0)
  const [totalMaterial, setTotalMaterial] = useState<number>(0)
  const [totalJasaMaterial, setTotalJasaMaterial] = useState<number>(0)
  const [grandTotal, setGrandTotal] = useState<any>(0)
  const [grandTotalRounded, setGrandTotalRounded] = useState<any>(0)
  const [grandTotalDiff, setGrandTotalDiff] = useState<any>(0)

  // Quotation Detail
  const [quotationDetail, setQuotationDetail] = useState<QuotationDetail[]>([
    {
      id: null,
      index: (Date.now() + 1).toString(),
      item_id: null,
      work_order_item_id: null,
      category_id: null,
      category_name: '',
      type: 1,
      item_name: '',
      unit: '',
      description: '',
      unit_price: 0,
      total: 0,
      final_price: 0,
      margin: 0,
      margin_type: 1,
      quantity: 0,
      is_user: 0,
    },
    {
      id: null,
      index: (Date.now() + 2).toString(),
      item_id: null,
      category_id: null,
      category_name: '',
      work_order_item_id: null,
      type: 2,
      item_name: '',
      unit: '',
      description: '',
      unit_price: 0,
      total: 0,
      final_price: 0,
      margin: 0,
      margin_type: 1,
      quantity: 0,
      is_user: 0,
    },
  ])

  const getWorkOrder = async () => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
    const desiredStatus = statusData.filter((status: any) =>
      ['SURVEYDONE'].includes(status?.category)
    )

    if (desiredStatus) {
      const statuses = desiredStatus.map((x) => x.value)

      const response = await axios.get(
        `${apiUrl}/work-orders?order_by=desc&take=0&status=${statuses}&vendor_id=${vendorId}`,
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
        const tempWorkOrder = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.order_id,
          quotation: item?.order?.quotation,
        }))

        const filteredWorkOrder = tempWorkOrder.filter((x: any) => x.quotation.length === 0)

        setWorkOrder(filteredWorkOrder)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } else {
      console.error('Desired status not found in statusData')
    }
  }

  const getWorkOrderDetail = async () => {
    try {
      await axios
        .get(`${apiUrl}/work-orders/${workOrderId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          setWorkOrderDetail(data)

          if (data?.work_order_status) {
            const workOrderItem = data.work_order_status[0].work_order_items.map(
              (item: any, index: number) => ({
                id: item?.id,
                index: Math.abs(stringToHash(`${Date.now() + index}-indexes`)),
                type: item?.type,
                item_id: null,
                work_order_item_id: item.id,
                category_id: null,
                item_name: item?.name,
                quantity: item?.quantity,
                unit: item?.unit ?? '',
                is_user: item?.is_customer ? 1 : 0,
                unit_price: 0,
                final_price: 0,
                margin: 0,
                margin_type: 1,
              })
            )

            setQuotationDetail(workOrderItem)
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
    getWorkOrder()
    getCode()
  }, [])

  useEffect(() => {
    if (workOrderId) {
      getWorkOrderDetail()
    }
  }, [workOrderId])

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

  const formatForFormData = (date: any) => {
    if (isNaN(date.getTime())) {
      return ''
    }

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${year}-${month}-${day}`
  }

  // Hash Key
  const stringToHash = (string: string): number => {
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
  const handleSelectWorkOrder = (element: any) => {
    const selectedWorkOrder = element.value
    setWorkOrderId(selectedWorkOrder)
  }

  // Quotation Status
  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatus = statusData.find((status: any) => status.category === 'QUOTEIN')
    const statusId = desiredStatus?.value

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
    const quotationDateObject = new Date(updatedQuotationDate)

    const days = 7
    const nextDays = new Date(quotationDateObject.getTime() + days * 24 * 60 * 60 * 1000)
    const parsedNextDays = new Date(nextDays)

    setQuotationDate(updatedQuotationDate)
    setQuotationValidity(parsedNextDays)
  }

  // Quotation Detail Form Handler
  let handleAddForm = (type: number) => {
    const newForm = {
      id: null,
      index: Date.now().toString(),
      item_id: null,
      work_order_item_id: null,
      category_id: null,
      category_name: '',
      type: type,
      item_name: '',
      unit: '',
      description: '',
      unit_price: 0,
      total: 0,
      final_price: 0,
      margin: 0,
      margin_type: 1,
      quantity: 0,
      is_user: 0,
    }

    setQuotationDetail((prev) => [...prev, newForm])
  }

  let handleRemoveForm = (index: any) => {
    setQuotationDetail((prev) => {
      const updatedValues = [...prev]
      const typeIndex = updatedValues.findIndex((item) => item.index === index)

      if (typeIndex !== -1) {
        updatedValues.splice(typeIndex, 1)
      }

      return updatedValues
    })
  }

  // Handle Checkbox Change
  let handleCheckboxChange = (index: any, isChecked: boolean) => {
    const updatedDetailValues = [...quotationDetail]
    const elementIndex = updatedDetailValues.findIndex((item) => item.index === index)

    if (elementIndex !== -1) {
      updatedDetailValues[elementIndex].is_user = isChecked ? 1 : 0
    }

    setQuotationDetail(updatedDetailValues)
  }

  // Handle Margin Type Change
  let handleMarginTypeChange = (index: any, isChecked: boolean) => {
    const updatedDetailValues = [...quotationDetail]
    const elementIndex = updatedDetailValues.findIndex((item) => item.index === index)

    if (elementIndex !== -1) {
      updatedDetailValues[elementIndex].margin_type = isChecked ? 1 : 2
    }

    setQuotationDetail(updatedDetailValues)
  }

  // Handle Change Quotation Detail
  let handleChangeQuotationDetail = (e: any, index: any, value: any, type: number) => {
    const updatedQuotationDetail = [...quotationDetail]
    const filteredDetailValues = updatedQuotationDetail.filter((x) => x.type === type)

    if (filteredDetailValues[index]) {
      let quantity = 0
      let unit_price = 0
      let margin = 0

      if (filteredDetailValues[index].is_user === 1) {
        quantity = 0
        unit_price = 0
        margin = 0
      } else {
        filteredDetailValues[index] = {
          ...filteredDetailValues[index],
          [e.target.name]: value,
        }
      }

      setQuotationDetail((prev) =>
        prev.map((element) => (element.type === type ? filteredDetailValues.shift()! : element))
      )
    }
  }

  // Calculate Detail
  const calcEachDetails = (isNominal: number, index: any) => {
    setQuotationDetail((prev) =>
      prev.map((detail) => {
        if (detail.index === index) {
          let {quantity, unit_price, margin, is_user} = detail

          let total = Number(quantity) * Number(unit_price)

          let final_price =
            is_user === 1
              ? 0
              : isNominal === 1
              ? Number(quantity) * Number(unit_price) + total * (Number(margin) / 100)
              : total + Number(margin)

          return {
            ...detail,
            total: total,
            final_price: final_price,
          }
        }
        return detail
      })
    )
  }

  // Total Jasa
  const calculateTotalJasa = () => {
    const serviceDetails = quotationDetail.filter((detail) => detail.type === 2)
    const total = serviceDetails.reduce(
      (accumulator, detail) => accumulator + detail.final_price,
      0
    )
    setTotalJasa(total)
  }

  // Total Material
  const calculateTotalMaterial = () => {
    const materialDetails = quotationDetail.filter((detail) => detail.type === 1)
    const total = materialDetails.reduce(
      (accumulator, detail) => accumulator + detail.final_price,
      0
    )
    setTotalMaterial(total)
  }

  // Total Material & Jasa
  const calculateTotalJasaMaterial = () => {
    let total = 0
    for (const detail of quotationDetail) {
      if (detail.type === 1 || detail.type === 2) {
        total += detail.final_price
      }
    }
    setTotalJasaMaterial(total)
  }

  // Grand Total
  const calculatedGrandTotal = () => {
    const grandTotal = Number(totalJasaMaterial)
    const roundedValue = Math.ceil(grandTotal / 100) * 100
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    })

    setGrandTotal(grandTotal)
    setGrandTotalRounded(formatter.format(roundedValue))
    setGrandTotalDiff(roundedValue - grandTotal)
  }

  useEffect(() => {
    calculateTotalJasa()
    calculateTotalMaterial()
    calculateTotalJasaMaterial()
    calculatedGrandTotal()
  }, [quotationDetail, totalJasaMaterial])

  // Quotation Validation
  const QuotationValidation = () => {
    let valid = true

    if (!workOrderDetail.order.id) {
      Swal.fire({
        title: 'Error',
        text: 'Please select order Id',
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
    }
    return valid
  }

  // Handle Submit Quotation
  const handleSubmitNewQuotation = async () => {
    if (QuotationValidation()) {
      setIsLoading(true)
      const formData = new FormData()

      formData.append('order_id', workOrderDetail?.order?.id)
      formData.append('store_id', workOrderDetail?.order?.store?.id)
      formData.append('quotation_status', quotationStatus)
      formData.append('description', quotationDescription)
      formData.append('quotation_number', quotationNumber.toString())
      formData.append('quotation_date', quotationDate)
      formData.append('quotation_validity', formatForFormData(new Date(quotationValidity)))

      const appendIfNotDefault = (formData: any, key: any, value: any) => {
        if (value !== null && value !== undefined && value !== '' && value !== 0) {
          formData.append(key, String(value))
        }
      }

      quotationDetail.forEach((quotation, index) => {
        appendIfNotDefault(formData, `quotation_details[${index}][item_id]`, quotation.item_id)
        appendIfNotDefault(
          formData,
          `quotation_details[${index}][work_order_item_id]`,
          quotation.work_order_item_id
        )

        appendIfNotDefault(formData, `quotation_details[${index}][name]`, quotation.item_name)
        appendIfNotDefault(formData, `quotation_details[${index}][price]`, quotation.unit_price)
        appendIfNotDefault(formData, `quotation_details[${index}][unit]`, quotation.unit)
        appendIfNotDefault(formData, `quotation_details[${index}][margin]`, quotation.margin)
        appendIfNotDefault(formData, `quotation_details[${index}][quantity]`, quotation.quantity)

        if (quotation.item_name !== '') {
          appendIfNotDefault(formData, `quotation_details[${index}][type]`, quotation.type)
          formData.append(`quotation_details[${index}][margin_type]`, String(quotation.margin_type))
          formData.append(`quotation_details[${index}][is_customer]`, String(quotation.is_user))
        }
      })

      await axios
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

            setIsLoading(false)
          } else {
            Swal.fire({
              title: 'Error',
              text: response.data.message,
              icon: 'error',
            })

            setIsLoading(false)
          }

          navigate('/quotation/view-quotation')
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
  }

  const handleCancelQuotation = () => {
    navigate('/quotation/view-quotation')
  }

  return (
    <section id='quotation-vendor'>
      <Card className='card-quotation'>
        <Card.Body className='content-quotation'>
          <Row className='mb-4'>
            <Col
              xs={{order: 'last'}}
              xxl={6}
              className='vendor-information order-1 order-xxl-1 order-xl-2 order-lg-2 order-md-2 order-sm-2 mb-3'
            >
              <div className='vendor-detail'>
                <Form.Group>
                  <Form.Label className='fs-5 fw-semibold'>Nama Toko :</Form.Label>

                  <Col>
                    <Form.Label className='fs-3 fw-bold'>
                      {workOrderDetail?.order?.store?.store_name}
                    </Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group>
                  <Form.Label className='fs-5 fw-bold'>
                    {workOrderDetail?.order?.store?.address}
                  </Form.Label>

                  <Col>
                    <Form.Label className='fs-5 fw-bold'>
                      {workOrderDetail?.order?.store?.phone_number_1
                        ? `Telp : ${
                            workOrderDetail?.order?.store?.phone_number_1 ??
                            workOrderDetail?.order?.store?.phone_number_2 ??
                            'Nomor Telepon tidak tersedia'
                          }`
                        : ''}
                    </Form.Label>
                  </Col>
                </Form.Group>
              </div>
            </Col>

            <Col
              xs={{order: 'first'}}
              xxl={6}
              className='payment-request order-2 order-xxl-2 order-xl-1 order-lg-1 order-md-1 order-sm-1 mb-3'
            >
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
                    value={workOrderDetail?.work_order_status[0]?.status?.description}
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
                    options={workOrder}
                    onChange={(e) => handleSelectWorkOrder(e)}
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
                  <Form.Control
                    type='number'
                    readOnly
                    value={workOrderDetail?.order?.members?.member_number}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold' column sm='4'>
                  Quotation Valid Until :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control
                    type='text'
                    min={today}
                    value={formatDate(new Date(quotationValidity))}
                    plaintext
                    readOnly
                  />
                </Col>
              </Form.Group>
            </Col>
          </Row>

          <Row className='mb-5'>
            <Col xxl={6}>
              <div className='receiver-information mb-3'>
                <div className='receiver-detail'>
                  <h1 className='fs-5 fw-semibold'>Ditunjukkan kepada :</h1>
                  <h1 className='fs-3 fw-bold mt-2'>{workOrderDetail?.order?.members.full_name}</h1>
                </div>

                <div className='address'>
                  <h3 className='fw-normal'>{workOrderDetail?.order?.project_address}</h3>
                  <h3 className='fw-normal'>
                    {workOrderDetail?.order?.project_number
                      ? `Telp : ${workOrderDetail?.order?.project_number}`
                      : ''}
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

          <hr />

          <div className='item-jasa'>
            <h4 className='fs-4 fw-semibold mb-5'>Item Jasa Pemasangan</h4>

            {quotationDetail
              .filter((x) => x.type === 2)
              .map((element, index) => (
                <Card key={`${element.index}-service`} className='card-item-jasa mb-5'>
                  <div className='d-flex border-rounded-3'>
                    <Card.Body>
                      <Row>
                        <Col xxl={4} xl={6} lg={12} md={12} sm={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label className='fs-5 fw-bold'>Jenis Jasa</Form.Label>
                            <Form.Control
                              id={`item-name-${index}`}
                              name='item_name'
                              type='text'
                              value={element.item_name}
                              onChange={(e) =>
                                handleChangeQuotationDetail(e, index, e.target.value, 2)
                              }
                            />
                          </Form.Group>
                        </Col>

                        <Col xxl={2} xl={2} lg={12} md={12} sm={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label className='fs-5 fw-bold'>QTY</Form.Label>
                            <Form.Control
                              id={`quantity-${index}`}
                              name='quantity'
                              type='number'
                              value={element.quantity}
                              onChange={(e) => {
                                handleChangeQuotationDetail(e, index, e.target.value, 2)
                                calcEachDetails(element.margin_type, element.index)
                              }}
                            />
                          </Form.Group>
                        </Col>

                        <Col xxl={3} xl={3} lg={12} md={12} sm={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label className='fs-5 fw-bold'>Price</Form.Label>
                            <Form.Control
                              id={`unit-price-${index}`}
                              type='number'
                              name='unit_price'
                              value={element.unit_price}
                              onChange={(e) => {
                                handleChangeQuotationDetail(e, index, e.target.value, 2)
                                calcEachDetails(element.margin_type, element.index)
                              }}
                            />
                          </Form.Group>
                        </Col>

                        <Col xxl={3} xl={3} lg={12} md={12} sm={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label className='fs-5 fw-bold'>Total</Form.Label>
                            <Form.Control
                              readOnly
                              plaintext
                              value={`Rp. ${(
                                Number(element.quantity) * Number(element.unit_price)
                              ).toLocaleString()}`}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col xxl={6} xl={6} lg={12} md={12} sm={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label className='fs-5 fw-bold'>Satuan</Form.Label>

                            <Form.Control
                              id={`satuan-${index}`}
                              name='unit'
                              value={element.unit}
                              onChange={(e) => {
                                handleChangeQuotationDetail(e, index, e.target.value, 2)
                              }}
                            />
                          </Form.Group>
                        </Col>

                        <Col xxl={3} xl={3} lg={12} md={12} sm={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label className='fs-5 fw-bold'>Profit</Form.Label>

                            <Form.Control
                              id={`margin-${index}`}
                              type='number'
                              name='margin'
                              value={element.margin}
                              onChange={(e) => {
                                handleChangeQuotationDetail(e, index, e.target.value, 2)
                                calcEachDetails(element.margin_type, element.index)
                              }}
                            />

                            <div className='d-flex flex-inline mt-2'>
                              <div className='me-1'>
                                <Form.Check
                                  id={`margin-type-${index}`}
                                  type='checkbox'
                                  checked={element.margin_type === 1}
                                  onChange={(e) => {
                                    handleMarginTypeChange(element.index, e.target.checked)
                                    calcEachDetails(element.margin_type, element.index)
                                  }}
                                />
                              </div>

                              <div className='ms-1'>Persen</div>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col xxl={3} xl={3} lg={12} md={12} sm={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label className='fs-5 fw-bold'>Final Price</Form.Label>

                            <Form.Control
                              readOnly
                              plaintext
                              value={`Rp. ${element.final_price.toLocaleString('id')}`}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>

                    <div className='d-flex flex-column align-items-center justify-content-between border-start p-2'>
                      <Button
                        className='button-transparent text-danger'
                        variant='primary'
                        onClick={() => handleRemoveForm(element.index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

            <Button
              className='add-jasa'
              variant='button-dark-success'
              onClick={() => handleAddForm(2)}
            >
              Tambah Jasa
            </Button>
          </div>

          <hr />

          <div className='item-material'>
            <h4 className='fs-4 fw-semibold mb-5'>Item Material</h4>

            {quotationDetail
              .filter((x) => x.type === 1)
              .map((element, index) => (
                <Card key={`${element.index}-material`} className='card-item-material mb-5'>
                  <div className='d-flex border-rounded-3'>
                    <div className='d-flex flex-column align-items-center justify-content-between border-end p-2'>
                      <Form.Check
                        id={`is-user-${index}`}
                        type='checkbox'
                        className='mt-2'
                        checked={element.is_user === 1}
                        onChange={(e) => handleCheckboxChange(element.index, e.target.checked)}
                      />
                    </div>

                    <Card.Body>
                      <Row>
                        <Col xxl={4} xl={6} lg={12} md={12} sm={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label className='fs-5 fw-bold'>
                              Material Yang Dibutuhkan
                            </Form.Label>

                            <Form.Control
                              id={`item-name-${index}`}
                              name='item_name'
                              value={element.item_name}
                              disabled={element.is_user === 1 ? true : false}
                              onChange={(e) => {
                                handleChangeQuotationDetail(e, index, e.target.value, 1)
                              }}
                            />
                          </Form.Group>
                        </Col>

                        <Col xxl={2} xl={2} lg={12} md={12} sm={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label className='fs-5 fw-bold'>QTY</Form.Label>
                            <Form.Control
                              id={`quantity-${index}`}
                              name='quantity'
                              value={element.quantity}
                              disabled={element.is_user === 1 ? true : false}
                              onChange={(e) => {
                                handleChangeQuotationDetail(e, index, e.target.value, 1)
                                calcEachDetails(element.margin_type, element.index)
                              }}
                            />
                          </Form.Group>
                        </Col>

                        <Col xxl={3} xl={3} lg={12} md={12} sm={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label className='fs-5 fw-bold'>Price</Form.Label>
                            <Form.Control
                              id={`unit-price-${index}`}
                              type='number'
                              name='unit_price'
                              value={element.unit_price}
                              disabled={element.is_user === 1 ? true : false}
                              onChange={(e) => {
                                handleChangeQuotationDetail(e, index, e.target.value, 1)
                                calcEachDetails(element.margin_type, element.index)
                              }}
                            />
                          </Form.Group>
                        </Col>

                        <Col xxl={3} xl={3} lg={12} md={12} sm={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label className='fs-5 fw-bold'>Total</Form.Label>
                            <Form.Control
                              readOnly
                              plaintext
                              value={`Rp. ${(
                                Number(element.quantity) * Number(element.unit_price)
                              ).toLocaleString()}`}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col xxl={6} xl={6} lg={12} md={12} sm={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label className='fs-5 fw-bold'>Satuan</Form.Label>

                            <Form.Control
                              id={`satuan-${index}`}
                              name='unit'
                              value={element.unit}
                              disabled={element.is_user === 1 ? true : false}
                              onChange={(e) => {
                                handleChangeQuotationDetail(e, index, e.target.value, 1)
                              }}
                            />
                          </Form.Group>
                        </Col>

                        <Col xxl={3} xl={3} lg={12} md={12} sm={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label className='fs-5 fw-bold'>Profit</Form.Label>

                            <Form.Control
                              id={`margin-${index}`}
                              type='number'
                              name='margin'
                              value={element.margin}
                              disabled={element.is_user === 1 ? true : false}
                              onChange={(e) => {
                                handleChangeQuotationDetail(e, index, e.target.value, 1)
                                calcEachDetails(element.margin_type, element.index)
                              }}
                            />

                            <div className='d-flex flex-inline mt-2'>
                              <div className='me-1'>
                                <Form.Check
                                  id={`margin-type-${index}`}
                                  type='checkbox'
                                  checked={element.margin_type === 1}
                                  disabled={element.is_user === 1 ? true : false}
                                  onChange={(e) => {
                                    handleMarginTypeChange(element.index, e.target.checked)
                                    calcEachDetails(element.margin_type, element.index)
                                  }}
                                />
                              </div>

                              <div className='ms-1'>Persen</div>
                            </div>
                          </Form.Group>
                        </Col>

                        <Col xxl={3} xl={3} lg={12} md={12} sm={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label className='fs-5 fw-bold'>Final Price</Form.Label>

                            <Form.Control
                              readOnly
                              plaintext
                              value={`Rp. ${element.final_price.toLocaleString('id')}`}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>

                    <div className='d-flex flex-column align-items-center justify-content-between border-start p-2'>
                      <Button
                        className='button-transparent text-danger'
                        variant='primary'
                        onClick={() => handleRemoveForm(element.index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

            <h4 className='fs-8 fw-normal text-danger'>
              *Jika <span className='fw-bolder text-decoration-underline'>Material</span> diceklis,
              maka material tersebut disediakan oleh customer
            </h4>

            <Button
              className='add-material'
              variant='button-warning'
              onClick={() => handleAddForm(1)}
            >
              Tambah Material
            </Button>
          </div>

          <hr />

          <div className='item-total'>
            <table className='table table-borderless '>
              <tr>
                <td align='right'>
                  <div className='fs-6 fw-bold'>Total Material :</div>
                </td>

                <td className='total-content'>
                  <div className='fs-6 fw-semibold'>{`Rp. ${totalMaterial.toLocaleString(
                    'id'
                  )}`}</div>
                </td>
              </tr>

              <tr>
                <td align='right'>
                  <div className='fs-6 fw-bold'>Total Jasa & Material :</div>
                </td>

                <td className='total-content'>
                  <div className='fs-6 fw-semibold'>{`Rp. ${totalJasaMaterial.toLocaleString(
                    'id'
                  )}`}</div>
                </td>
              </tr>

              <tr>
                <td align='right'>
                  <div className='fs-6 fw-bold'>Grand Total :</div>
                </td>

                <td className='total-content'>
                  <div className='fs-6 fw-semibold'>{`Rp. ${grandTotal.toLocaleString('id')}`}</div>
                </td>
              </tr>

              <tr>
                <td align='right'>
                  <div className='fs-6 fw-bold'>
                    Grand Total{' '}
                    <span className='dark-success'>{`+ Rp. ${grandTotalDiff} (Pembulatan) :`}</span>
                  </div>
                </td>

                <td className='total-content'>
                  <div className='fs-6 fw-semibold'>{grandTotalRounded}</div>
                </td>
              </tr>
            </table>
          </div>

          <div className='button-wrapper d-flex justify-content-center align-items-center mt-5'>
            <Button
              variant='dark-danger'
              className='d-flex justify-content-center align-items-center mb-2'
              type='submit'
              disabled={isLoading}
              onClick={handleCancelQuotation}
            >
              Cancel
            </Button>

            <Button
              variant='dark-primary'
              className='d-flex justify-content-center align-items-center mb-2'
              type='submit'
              disabled={isLoading}
              onClick={handleSubmitNewQuotation}
            >
              {isLoading ? 'Saving..' : 'Save'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {NewQuotationVendor}
