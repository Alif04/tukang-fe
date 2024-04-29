import React, {FC, useState, useEffect, useRef} from 'react'

import './NewQuotation.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import {Form, Table, Button, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'

interface SelectedStoreItem {
  value: number | null
  label: string
}

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
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch Data Work Order
  const [workOrder, setWorkOrder] = useState<any>()
  const [workOrderId, setWorkOrderId] = useState<string>('')
  const [workOrderDetail, setWorkOrderDetail] = useState<any>()

  console.log('id', workOrderDetail)

  // Add Quotation
  const [quotationStatus, setQuotationStatus] = useState<any>()
  const [quotationNumber, setQuotationNumber] = useState<string | number>('NaN')
  const [quotationDescription, setQuotationDescription] = useState<string>('')
  const [quotationDate, setQuotationDate] = useState<string>('')
  const [quotationValidity, setQuotationValidity] = useState<any>()
  const [quotationFiles, setQuotationFiles] = useState<Array<File | null>>([])

  const [totalJasa, setTotalJasa] = useState<number>(0)
  const [totalMaterial, setTotalMaterial] = useState<number>(0)
  const [totalJasaMaterial, setTotalJasaMaterial] = useState<number>(0)
  const [promosiDiscount, setPromosiDiscount] = useState<number>(0)
  const [grandTotal, setGrandTotal] = useState<any>(0)
  const [grandTotalRounded, setGrandTotalRounded] = useState<any>(0)
  const [grandTotalDiff, setGrandTotalDiff] = useState<any>(0)

  const evidenceRef = useRef<HTMLInputElement>(null)

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

  // Store
  const [store, setStore] = useState<SelectedStoreItem[]>([])
  const [storeId, setStoreId] = useState<string>('')
  const [storeName, setStoreName] = useState<string>('')
  const [storeDetail, setStoreDetail] = useState<any>()

  const getStore = async () => {
    try {
      const response = await axios.get(`${apiUrl}/stores?take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data.data)) {
        const tempStore = response.data.data.data.map((item: any) => ({
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

  const getWorkOrder = async () => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
    const desiredStatus = statusData.filter((status: any) =>
      ['SURVEYDONE'].includes(status?.category)
    )

    if (desiredStatus) {
      const statuses = desiredStatus.map((x) => x.value)

      const response = await axios.get(
        `${apiUrl}/work-orders?order_by=desc&take=0&status=${statuses}`,
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
          label: item.id,
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
                work_order_item_id: item.item_id,
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

          if (data?.order?.store) {
            setStoreId(data.order.store.id)
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
    getStore()
    getCode()
  }, [])

  useEffect(() => {
    if (workOrderId) {
      getWorkOrderDetail()
    }

    if (storeId) {
      getStoreDetail()
    }
  }, [workOrderId, storeId])

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
      updatedDetailValues[elementIndex].margin_type = isChecked ? 2 : 1
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
  const calcEachDetails = (isNominal: number) => {
    setQuotationDetail((prev) => {
      const updatedQuotationDetail = [...prev]

      updatedQuotationDetail.forEach((detail) => {
        let {quantity, unit_price, margin, is_user} = detail

        let total = Number(quantity) * Number(unit_price)
        let final_price =
          is_user === 1
            ? 0
            : isNominal === 1
            ? total + total * (Number(margin) / 100)
            : total + Number(margin)

        detail.total = total
        detail.final_price = final_price
      })

      return updatedQuotationDetail
    })
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

  // Promosi & Discount
  let handlePromosiChange = (value: any) => {
    const updatedPromosiValue = value
    setPromosiDiscount(updatedPromosiValue)
  }

  // Grand Total
  const calculatedGrandTotal = () => {
    const grandTotal = Number(totalJasaMaterial) - Number(promosiDiscount)
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
  }, [quotationDetail, totalJasaMaterial, promosiDiscount])

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
    }
    return valid
  }

  // Handle Submit Quotation
  const handleSubmitNewQuotation = async () => {
    if (QuotationValidation()) {
      setIsLoading(true)
      const formData = new FormData()

      formData.append('order_id', workOrderDetail.order.id)
      formData.append('store_id', storeId)
      formData.append('quotation_status', quotationStatus)
      formData.append('description', quotationDescription)
      formData.append('quotation_number', quotationNumber.toString())
      formData.append('quotation_date', quotationDate)
      formData.append('quotation_validity', formatForFormData(new Date(quotationValidity)))
      formData.append('quotation_disc', promosiDiscount.toString())

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

        // appendIfNotDefault(
        //   formData,
        //   `quotation_details[${index}][category_id]`,
        //   quotation.category_id
        // )

        appendIfNotDefault(formData, `quotation_details[${index}][type]`, quotation.type)
        appendIfNotDefault(formData, `quotation_details[${index}][name]`, quotation.item_name)
        appendIfNotDefault(formData, `quotation_details[${index}][price]`, quotation.unit_price)
        appendIfNotDefault(formData, `quotation_details[${index}][unit]`, quotation.unit)
        appendIfNotDefault(formData, `quotation_details[${index}][margin]`, quotation.margin)
        formData.append(`quotation_details[${index}][margin_type]`, String(quotation.margin_type))
        appendIfNotDefault(formData, `quotation_details[${index}][quantity]`, quotation.quantity)
        formData.append(`quotation_details[${index}][is_customer]`, String(quotation.is_user))
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
    <section id='new-quotation'>
      <div className='card'>
        <div className='card-body'>
          <Row className='mb-4'>
            <Col xxl={6} className='vendor-information'>
              <div className='vendor-detail'>
                <Form.Group>
                  <Form.Label className='fs-5'>Nama Toko :</Form.Label>

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

          <Row className='mb-4'>
            <Col xxl={6}>
              <div className='receiver-information'>
                <div className='receiver-detail'>
                  <h1 className='fw-bolder'>Ditunjukkan kepada :</h1>
                  <h1 className='fw-bolder mt-2'>{workOrderDetail?.order?.members.full_name}</h1>
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

          <div className='d-flex justify-content-end'>
            <Button
              className='add-jasa'
              variant='button-dark-success'
              onClick={() => handleAddForm(2)}
            >
              Tambah Jasa Pemasangan
            </Button>
          </div>

          <div className='detail-table-jasa'>
            <Table hover>
              <thead>
                <tr>
                  <th className='text-center'>Jenis Jasa</th>
                  <th className='text-center'>QTY</th>
                  <th className='text-center'>Satuan</th>
                  <th className='text-center'>Price</th>
                  <th className='text-center'>Total</th>
                  <th className='text-center'>Margin</th>
                  <th className='text-center'>Final Price</th>
                  <th className='text-center'>Action</th>
                </tr>
              </thead>

              <tbody>
                {quotationDetail
                  .filter((x) => x.type === 2)
                  .map((element, index) => (
                    <tr key={`${element.index}-service`}>
                      <td>
                        <Form.Control
                          id={`item-name-${index}`}
                          name='item_name'
                          value={element.item_name}
                          onChange={(e) => handleChangeQuotationDetail(e, index, e.target.value, 2)}
                        />
                      </td>

                      <td>
                        <Form.Control
                          id={`quantity-${index}`}
                          name='quantity'
                          type='number'
                          value={element.quantity}
                          onChange={(e) => {
                            handleChangeQuotationDetail(e, index, e.target.value, 2)
                            calcEachDetails(element.margin_type)
                          }}
                        />
                      </td>

                      <td>
                        <Form.Control
                          id={`satuan-${index}`}
                          name='unit'
                          value={element.unit}
                          onChange={(e) => {
                            handleChangeQuotationDetail(e, index, e.target.value, 2)
                          }}
                        />
                      </td>

                      <td>
                        <Form.Control
                          id={`unit-price-${index}`}
                          type='number'
                          name='unit_price'
                          value={element.unit_price}
                          onChange={(e) => {
                            handleChangeQuotationDetail(e, index, e.target.value, 2)
                            calcEachDetails(element.margin_type)
                          }}
                        />
                      </td>

                      <td>
                        <Form.Control
                          readOnly
                          plaintext
                          value={`Rp. ${(
                            Number(element.quantity) * Number(element.unit_price)
                          ).toLocaleString()}`}
                        />
                      </td>

                      <td>
                        <Form.Control
                          id={`margin-${index}`}
                          type='number'
                          name='margin'
                          value={element.margin}
                          onChange={(e) => {
                            handleChangeQuotationDetail(e, index, e.target.value, 2)
                            calcEachDetails(element.margin_type)
                          }}
                        />

                        <br></br>

                        <div className='d-flex flex-inline'>
                          <div className='me-1'>
                            <Form.Check
                              id={`margin-type-${index}`}
                              type='checkbox'
                              checked={element.margin_type === 2}
                              onChange={(e) => {
                                handleMarginTypeChange(element.index, e.target.checked)
                                calcEachDetails(element.margin_type)
                              }}
                            />
                          </div>

                          <div className='ms-1'>
                            {element.margin_type === 1 ? '( Persen )' : '( Nominal )'}
                          </div>
                        </div>
                      </td>

                      <td>
                        <Form.Control
                          readOnly
                          plaintext
                          value={`Rp. ${element.final_price.toLocaleString('id')}`}
                        />
                      </td>

                      <td>
                        <Button variant='danger' onClick={() => handleRemoveForm(element.index)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}

                <tr>
                  <td colSpan={7} className='text-end fw-bolder'>
                    Total Jasa
                  </td>
                  <td className=' fw-bolder'>{`Rp. ${totalJasa.toLocaleString('id')}`}</td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className='detail-table-material'>
            <div className='d-flex justify-content-end'>
              <Button
                className='add-material'
                variant='button-warning'
                onClick={() => handleAddForm(1)}
              >
                Tambah Material
              </Button>
            </div>

            <Table hover>
              <thead>
                <tr>
                  <th></th>
                  <th className='text-center' style={{minWidth: '230px'}}>
                    Material Yang Dibutuhkan
                  </th>
                  <th className='text-center'>QTY</th>
                  <th className='text-center'>Satuan</th>
                  <th className='text-center'>Price</th>
                  <th className='text-center'>Total</th>
                  <th className='text-center'>Margin</th>
                  <th className='text-center' style={{minWidth: '100px'}}>
                    Final Price
                  </th>
                  <th className='text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {quotationDetail
                  .filter((x) => x.type === 1)
                  .map((element, index) => (
                    <tr key={`${element.index}-material`}>
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
                          name='item_name'
                          value={element.item_name}
                          disabled={element.is_user === 1 ? true : false}
                          onChange={(e) => {
                            handleChangeQuotationDetail(e, index, e.target.value, 1)
                          }}
                        />
                      </td>

                      <td>
                        <Form.Control
                          id={`quantity-${index}`}
                          name='quantity'
                          value={element.quantity}
                          disabled={element.is_user === 1 ? true : false}
                          onChange={(e) => {
                            handleChangeQuotationDetail(e, index, e.target.value, 1)
                            calcEachDetails(element.margin_type)
                          }}
                        />
                      </td>

                      <td>
                        <Form.Control
                          id={`satuan-${index}`}
                          name='unit'
                          value={element.unit}
                          disabled={element.is_user === 1 ? true : false}
                          onChange={(e) => {
                            handleChangeQuotationDetail(e, index, e.target.value, 1)
                          }}
                        />
                      </td>

                      <td>
                        <Form.Control
                          id={`unit-price-${index}`}
                          type='number'
                          name='unit_price'
                          value={element.unit_price}
                          disabled={element.is_user === 1 ? true : false}
                          onChange={(e) => {
                            handleChangeQuotationDetail(e, index, e.target.value, 1)
                            calcEachDetails(element.margin_type)
                          }}
                        />
                      </td>

                      <td>
                        <Form.Control
                          readOnly
                          plaintext
                          value={`Rp. ${(
                            Number(element.quantity) * Number(element.unit_price)
                          ).toLocaleString()}`}
                        />
                      </td>

                      <td>
                        <Form.Control
                          id={`margin-${index}`}
                          type='number'
                          name='margin'
                          value={element.margin}
                          disabled={element.is_user === 1 ? true : false}
                          onChange={(e) => {
                            handleChangeQuotationDetail(e, index, e.target.value, 1)
                            calcEachDetails(element.margin_type)
                          }}
                        />
                        <br></br>

                        <div className='d-flex flex-inline'>
                          <div className='me-1'>
                            <Form.Check
                              id={`margin-type-${index}`}
                              type='checkbox'
                              checked={element.margin_type === 2}
                              disabled={element.is_user === 1 ? true : false}
                              onChange={(e) => {
                                handleMarginTypeChange(element.index, e.target.checked)
                                calcEachDetails(element.margin_type)
                              }}
                            />
                          </div>

                          <div className='ms-1'>
                            {element.margin_type === 1 ? '( Persen )' : '( Nominal )'}
                          </div>
                        </div>
                      </td>

                      <td>
                        <Form.Control
                          readOnly
                          plaintext
                          value={`Rp. ${element.final_price.toLocaleString('id')}`}
                        />
                      </td>

                      <td align='center'>
                        <Button variant='danger' onClick={() => handleRemoveForm(element.index)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}

                <tr>
                  <td colSpan={8} className='text-end fw-bolder'>
                    Total Material
                  </td>
                  <td className=' fw-bolder'>{`Rp. ${totalMaterial.toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={8} className='text-end fw-bolder'>
                    Total Jasa & Material
                  </td>
                  <td className=' fw-bolder'>{`Rp. ${totalJasaMaterial.toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={8} className='text-end fw-bolder'>
                    Promosi / Discount
                  </td>

                  <td>
                    <Form.Control
                      id='promosi'
                      type='number'
                      value={promosiDiscount}
                      onChange={(e) => handlePromosiChange(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td colSpan={8} className='text-end fw-bolder'>
                    Grand Total
                  </td>
                  <td className=' fw-bolder'>{`Rp. ${grandTotal.toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={8} className='text-end fw-bolder'>
                    Grand Total{' '}
                    <span className='text-success'>{`+ Rp. ${grandTotalDiff} ( Pembulatan )`}</span>
                  </td>

                  <td className=' fw-bolder'>{grandTotalRounded}</td>
                </tr>
              </tbody>
            </Table>

            <Form.Text className='fs-8 text-dark'>
              *Jika <span className='fw-bolder text-decoration-underline'>Material</span> diceklis,
              maka material tersebut disediakan oleh customer
            </Form.Text>
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
              disabled={isLoading}
              onClick={handleSubmitNewQuotation}
            >
              {isLoading ? 'Saving..' : 'Save & Email'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewQuotationVendor}
