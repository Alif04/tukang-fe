import React, {FC, useState, useEffect, useRef} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './NewQuotation.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Table, Button, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'

interface CategorySelect {
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
  total: number
  final_price: number
  margin: number
  quantity: number
  is_user: number
}

const NewQuotationHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()

  // Fetch Data Order
  const [order, setOrder] = useState<any>()
  const [orderId, setOrderId] = useState<string>('')
  const [orderDetail, setOrderDetail] = useState<any>()

  // Add Quotation
  const [quotationData, setQuotationData] = useState<any>()
  const [quotationId, setQuotationId] = useState<any>()
  const [quotationStatus, setQuotationStatus] = useState<any>()
  const [quotationNumber, setQuotationNumber] = useState<string | number>('NaN')
  const [quotationDescription, setQuotationDescription] = useState<string>('')
  const [quotationDate, setQuotationDate] = useState<string>('')
  const [quotationValidity, setQuotationValidity] = useState<string>('')
  const [quotationFiles, setQuotationFiles] = useState<Array<File | null>>([])

  const [totalMaterial, setTotalMaterial] = useState<number>(0)
  const [totalJasaMaterial, setTotalJasaMaterial] = useState<number>(0)
  const [promosiDiscount, setPromosiDiscount] = useState<number>(0)
  const [additionalPromosi, setAdditionalPromosi] = useState<number>(0)
  const [grandTotal, setGrandTotal] = useState<number>(0)

  const evidenceRef = useRef<HTMLInputElement>(null)

  // Quotation Detail
  const [quotationDetail, setQuotationDetail] = useState<QuotationDetail[]>([
    {
      id: null,
      index: Date.now().toString(),
      item_id: null,
      work_order_item_id: null,
      category_id: null,
      category_name: '',
      type: 1,
      item_name: '',
      unit_price: 0,
      total: 0,
      final_price: 0,
      margin: 0,
      quantity: 0,
      is_user: 0,
    },
    {
      id: null,
      index: Date.now().toString(),
      item_id: null,
      category_id: null,
      category_name: '',
      work_order_item_id: null,
      type: 2,
      item_name: '',
      unit_price: 0,
      total: 0,
      final_price: 0,
      margin: 0,
      quantity: 0,
      is_user: 0,
    },
  ])

  // Store
  const [storeId, setStoreId] = useState<string>('')

  // Category
  const [categories, setCategories] = useState<CategorySelect[]>([])

  const getCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/categories`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempCategories = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.category_name,
        }))

        setCategories(tempCategories)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getQuotation = async () => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
    const desiredStatus = statusData.filter((status: any) => ['QUOTEIN'].includes(status.category))

    if (desiredStatus) {
      const statuses = desiredStatus.map((x) => x.value)

      const response = await axios.get(
        `${apiUrl}/quotation?order_by=desc&take=0&status=${statuses}`,
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
        const tempQuotation = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.id,
        }))

        setQuotationData(tempQuotation)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } else {
      console.error('Desired status not found in statusData')
    }
  }

  const getQuotationDetail = async () => {
    try {
      await axios
        .get(`${apiUrl}/quotation/${quotationId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          setQuotationData(data)

          if (data?.order_id) {
            setOrderId(data.order_id)
          }

          if (data?.store) {
            setStoreId(data.store.id)
          }

          if (data?.id) {
            setQuotationId(data.id)
            setQuotationNumber(data.id)
          }

          if (data?.store) {
            setStoreId(data.store.id)
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

          if (data?.quotation_disc) {
            setPromosiDiscount(data.quotation_disc)
          }

          if (data?.quotation_promotion) {
            setAdditionalPromosi(data.quotation_promotion)
          }

          if (data?.quotation_grand_total) {
            setGrandTotal(data.quotation_grand_total)
          }

          if (data?.quotation_details) {
            const quotationDetails = data.quotation_details.map((item: any, index: number) => ({
              id: item.id,
              index: (Date.now() + index).toString(),
              type: item.item_type,
              item_id: item.item_id,
              work_order_item_id: item.work_order_items_id,
              category_id: item.category_id,
              category_name: item?.category?.category_name,
              item_name: item.name,
              quantity: item.quantity,
              is_user: item.is_customer ? 1 : 0,
              unit_price: parseInt(item.price),
              final_price: parseInt(item.final_price),
              margin: parseInt(item.margin),
            }))

            setQuotationDetail(quotationDetails)
          }
        })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getQuotation()
    getCategories()
  }, [])

  useEffect(() => {
    if (quotationId) {
      getQuotationDetail()
    }
  }, [quotationId])

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

  // Select Quotation
  const handleChangeSelectQuotation = (element: any) => {
    const selectedQuotation = element.value
    setQuotationId(selectedQuotation)
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
    setQuotationDate(updatedQuotationDate)
  }

  // Handle Change Quotation Validity
  const handleChangeQuotationValidity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQuotationValidity = event.target.value
    setQuotationValidity(updatedQuotationValidity)
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
      unit_price: 0,
      total: 0,
      final_price: 0,
      margin: 0,
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

  // Handle Category Change
  let handleCategoryChange = (index: any, value: any) => {
    const updatedDetailValues = [...quotationDetail]
    const elementIndex = updatedDetailValues.findIndex((item) => item.index === index)

    if (elementIndex !== -1) {
      updatedDetailValues[elementIndex].category_id = value.value
      updatedDetailValues[elementIndex].category_name = value.label
    }

    setQuotationDetail(updatedDetailValues)
  }

  // Handle Item Name Change
  let handleItemNameChange = (index: any, value: any, type: number) => {
    const updatedQuotationDetail = [...quotationDetail]
    const filteredDetailValues = updatedQuotationDetail.filter((x) => x.type === type)

    if (filteredDetailValues[index]) {
      filteredDetailValues[index] = {
        ...filteredDetailValues[index],
        item_name: value,
      }

      setQuotationDetail((prev) =>
        prev.map((element) => (element.type === type ? filteredDetailValues.shift()! : element))
      )
    }
  }

  // Handle Quantity Change
  let handleQuantityChange = (index: any, value: any, type: number) => {
    const updatedQuotationDetail = [...quotationDetail]
    const filteredDetailValues = updatedQuotationDetail.filter((x) => x.type === type)

    if (filteredDetailValues[index]) {
      filteredDetailValues[index] = {
        ...filteredDetailValues[index],
        quantity: value,
        total: value * filteredDetailValues[index].unit_price,
        final_price:
          Number(value * filteredDetailValues[index].unit_price) -
          Number(filteredDetailValues[index].margin),
      }

      setQuotationDetail((prev) =>
        prev.map((element) => (element.type === type ? filteredDetailValues.shift()! : element))
      )
    }
  }

  // Handle Unit Price Change
  let handleUnitPriceChange = (index: any, value: any, type: number) => {
    const updatedQuotationDetail = [...quotationDetail]
    const filteredDetailValues = updatedQuotationDetail.filter((x) => x.type === type)

    if (filteredDetailValues[index]) {
      filteredDetailValues[index] = {
        ...filteredDetailValues[index],
        unit_price: value,
        total: value * filteredDetailValues[index].quantity,
        final_price:
          Number(value * filteredDetailValues[index].quantity) -
          Number(filteredDetailValues[index].margin),
      }

      setQuotationDetail((prev) =>
        prev.map((element) => (element.type === type ? filteredDetailValues.shift()! : element))
      )
    }
  }

  // Handle Margin Change
  let handleMarginChange = (index: any, value: any, type: number) => {
    const updatedQuotationDetail = [...quotationDetail]
    const filteredDetailValues = updatedQuotationDetail.filter((x) => x.type === type)

    if (filteredDetailValues[index]) {
      filteredDetailValues[index] = {
        ...filteredDetailValues[index],
        margin: value,
        final_price:
          Number(filteredDetailValues[index].quantity * filteredDetailValues[index].unit_price) -
          Number(value),
      }

      setQuotationDetail((prev) =>
        prev.map((element) => (element.type === type ? filteredDetailValues.shift()! : element))
      )
    }
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

  // Promosi & Discount
  let handleAdditionalPromosiChange = (value: any) => {
    const updatedAdditionalPromosiValue = value
    setAdditionalPromosi(updatedAdditionalPromosiValue)
  }

  // Grand Total
  const calculatedGrandTotal = () => {
    const grandTotal =
      Number(totalJasaMaterial) - Number(promosiDiscount) - Number(additionalPromosi)
    setGrandTotal(grandTotal)
  }

  useEffect(() => {
    calculateTotalMaterial()
    calculateTotalJasaMaterial()
    calculatedGrandTotal()
  }, [quotationDetail, totalJasaMaterial, promosiDiscount, additionalPromosi])

  // Quotation Validation
  const QuotationValidation = () => {
    let valid = true

    if (!quotationId) {
      Swal.fire({
        title: 'Error',
        text: 'Please select Quotation Id',
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
  const handleUpdateQuotation = async () => {
    if (QuotationValidation()) {
      const formData = new FormData()

      formData.append('order_id', orderId)
      formData.append('store_id', storeId)
      formData.append('quotation_status', quotationStatus)
      formData.append('description', quotationDescription)
      formData.append('quotation_number', quotationNumber.toString())
      formData.append('quotation_date', quotationDate)
      formData.append('quotation_validity', quotationValidity)
      formData.append('quotation_disc', promosiDiscount.toString())
      formData.append('quotation_promotion', additionalPromosi.toString())

      // if (quotationFiles?.length) {
      //   quotationFiles.forEach((item) => {
      //     if (item) {
      //       formData.append(`quotation_files`, item, item?.name)
      //     }
      //   })
      // }

      quotationDetail.forEach((quotation, index) => {
        if (quotation.id !== null) {
          formData.append(`quotation_details[${index}][id]`, String(quotation.id))
        }

        if (quotation.item_id !== null) {
          formData.append(`quotation_details[${index}][item_id]`, String(quotation.item_id))
        }

        if (quotation.item_id !== null) {
          formData.append(
            `quotation_details[${index}][work_order_item_id]`,
            String(quotation.work_order_item_id)
          )
        }

        if (quotation.category_id !== null) {
          formData.append(`quotation_details[${index}][category_id]`, String(quotation.category_id))
        }

        formData.append(`quotation_details[${index}][type]`, String(quotation.type))
        formData.append(`quotation_details[${index}][name]`, quotation.item_name)
        formData.append(`quotation_details[${index}][price]`, String(quotation.unit_price))
        formData.append(`quotation_details[${index}][margin]`, String(quotation.margin))
        formData.append(`quotation_details[${index}][quantity]`, String(quotation.quantity))
        formData.append(`quotation_details[${index}][is_customer]`, String(quotation.is_user))
      })

      await axios
        .post(`${apiUrl}/quotation/${quotationId}`, formData, {
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
                    <Form.Label className='fs-3 fw-bold'>
                      {quotationData?.store?.store_name}
                    </Form.Label>
                  </Col>
                </Form.Group>

                <Form.Label className='fs-5 fw-bold'>{quotationData?.store?.address}</Form.Label>
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
                    value={quotationData?.status?.category}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold' column sm='4'>
                  Tanggal :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control
                    type='date'
                    min={today}
                    value={quotationDate}
                    onChange={handleChangeQuotationDate}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold' column sm='4'>
                  Order ID :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control type='number' value={quotationData?.order_id} readOnly />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold' column sm='4'>
                  Quotation ID :
                </Form.Label>

                <Col sm='8'>
                  <Select
                    name='quotation-id'
                    className='form-control p-0'
                    placeholder='Ketik/Pilih Quotation Id'
                    isSearchable={true}
                    options={quotationData}
                    onChange={(e) => handleChangeSelectQuotation(e)}
                  />
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
                    value={quotationData?.order?.members?.member_number}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold' column sm='4'>
                  Quotation Valid Until :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control
                    type='date'
                    min={today}
                    value={quotationValidity}
                    onChange={handleChangeQuotationValidity}
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
                  <h1 className='fw-bolder mt-2'>{quotationData?.order?.members?.full_name}</h1>
                </div>

                <div className='address'>
                  <h3 className='fw-normal'>{quotationData?.order?.project_address}</h3>
                  <h3 className='fw-normal'>
                    {quotationData?.order?.project_number
                      ? `Telp : ${quotationData?.order?.project_number}`
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
                    value={quotationDescription}
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
                  <th className='text-center'>Category</th>
                  <th className='text-center'>QTY</th>
                  <th className='text-center'>Satuan</th>
                  <th className='text-center'>Final Price</th>
                </tr>
              </thead>

              <tbody>
                {quotationDetail
                  .filter((x) => x.type === 2)
                  .map((element, index) => (
                    <>
                      <tr key={`${element.index}-service`}>
                        <td>
                          <Form.Control
                            id={`item-name-${index}`}
                            value={element.item_name}
                            disabled
                            onChange={(e) => handleItemNameChange(index, e.target.value, 2)}
                          />
                        </td>

                        <td>
                          <Select
                            name='category_id'
                            className='form-control p-0'
                            classNamePrefix='select'
                            placeholder='Pilih Kategori'
                            isSearchable={true}
                            isDisabled={true}
                            options={categories}
                            defaultValue={{
                              value: element.category_id,
                              label: element.category_name,
                            }}
                            onChange={(newValue) => handleCategoryChange(element.index, newValue)}
                          />
                        </td>

                        <td>
                          <Form.Control
                            id={`quantity-${index}`}
                            value={element.quantity}
                            disabled
                            onChange={(e) => handleQuantityChange(index, e.target.value, 2)}
                          />
                        </td>

                        <td>
                          <Form.Control
                            id={`unit-price-${index}`}
                            type='number'
                            value={element.unit_price}
                            disabled
                            onChange={(e) => handleUnitPriceChange(index, e.target.value, 2)}
                          />
                        </td>

                        <td>
                          <Form.Control
                            readOnly
                            plaintext
                            value={`Rp. ${element.final_price?.toLocaleString('id')}`}
                          />
                        </td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </Table>
          </div>

          <div className='detail-table-material'>
            <Table hover>
              <thead>
                <tr>
                  <th></th>
                  <th className='text-center' style={{minWidth: '250px'}}>
                    Material Yang Dibutuhkan
                  </th>
                  <th className='text-center'>QTY</th>
                  <th className='text-center'>Satuan</th>
                  <th className='text-center'>Margin</th>
                  <th className='text-center' style={{minWidth: '100px'}}>
                    Final Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {quotationDetail
                  .filter((x) => x.type === 1)
                  .map((element, index) => (
                    <>
                      <tr key={`${element.index}-material`}>
                        <td>
                          <Form.Check
                            id={`is-user-${index}`}
                            type='checkbox'
                            checked={element.is_user === 1}
                            disabled
                            onChange={(e) => handleCheckboxChange(element.index, e.target.checked)}
                          />
                        </td>

                        <td>
                          <Form.Control
                            id={`item-name-${index}`}
                            value={element.item_name}
                            disabled
                            onChange={(e) => handleItemNameChange(index, e.target.value, 1)}
                          />
                        </td>

                        <td>
                          <Form.Control
                            id={`quantity-${index}`}
                            value={element.quantity}
                            disabled
                            onChange={(e) => handleQuantityChange(index, e.target.value, 1)}
                          />
                        </td>

                        <td>
                          <Form.Control
                            id={`unit-price-${index}`}
                            type='number'
                            value={element.unit_price}
                            disabled
                            onChange={(e) => handleUnitPriceChange(index, e.target.value, 1)}
                          />
                        </td>

                        <td>
                          <Form.Control
                            id={`margin-${index}`}
                            type='number'
                            value={element.margin}
                            disabled
                            onChange={(e) => handleMarginChange(index, e.target.value, 1)}
                          />
                        </td>

                        <td>
                          <Form.Control
                            readOnly
                            plaintext
                            value={`Rp. ${element.final_price?.toLocaleString('id')}`}
                          />
                        </td>
                      </tr>
                    </>
                  ))}

                <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Total Material
                  </td>
                  <td className=' fw-bolder'>{`Rp. ${totalMaterial.toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Total Jasa & Material
                  </td>
                  <td className=' fw-bolder'>{`Rp. ${totalJasaMaterial.toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Promosi ( Free Survey )
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
                  <td colSpan={5} className='text-end fw-bolder'>
                    Additional Promosi
                  </td>

                  <td>
                    <Form.Control
                      id='promosi'
                      type='number'
                      value={additionalPromosi}
                      onChange={(e) => handleAdditionalPromosiChange(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Grand Total
                  </td>
                  <td className=' fw-bolder'>{`Rp. ${grandTotal.toLocaleString('id')}`}</td>
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
              onClick={handleUpdateQuotation}
            >
              Save & Email
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewQuotationHO}
