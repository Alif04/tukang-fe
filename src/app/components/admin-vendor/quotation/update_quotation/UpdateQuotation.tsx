import React, {FC, useState, useEffect, useRef} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './UpdateQuotation.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Table, Button, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'

interface CategorySelect {
  value: number | null
  label: string
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

const UpdateQuotationVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Order Id
  const [orderId, setOrderId] = useState<string>('')

  // Add Quotation
  const [quotationData, setQuotationData] = useState<any>()
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
  const [storeId, setStoreId] = useState<string>('')

  // Category
  const [categories, setCategories] = useState<CategorySelect[]>([])

  const getQuotationData = async () => {
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

          setQuotationData(data)

          if (data?.order_id) {
            setOrderId(data.order_id)
          }

          if (data?.store) {
            setStoreId(data.store.id)
          }

          if (data?.id) {
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

          if (data?.quotation_grand_total) {
            setGrandTotal(data.quotation_grand_total)
          }

          if (data?.quotation_details) {
            const quotationDetails = data.quotation_details.map((item: any, index: number) => ({
              id: item.id,
              index: Math.abs(stringToHash(`${Date.now() + index}-indexes`)),
              type: item.item_type,
              item_id: item.item_id,
              work_order_item_id: item.work_order_items_id,
              category_id: item.category_id,
              category_name: item?.category?.category_name,
              item_name: item.name,
              quantity: item?.quantity ?? 0,
              unit: item.unit,
              is_user: item.is_customer ? 1 : 0,
              unit_price: parseInt(item.price),
              final_price: parseInt(item.final_price),
              margin: parseInt(item.margin),
              margin_type: item?.margin_type ?? 1,
            }))

            setQuotationDetail(quotationDetails)
          }
        })
    } catch (err) {
      console.error(err)
    }
  }

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

  useEffect(() => {
    getQuotationData()
    getCategories()
  }, [])

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

  // Promosi & Discount
  // let handlePromosiChange = (value: any) => {
  //   const updatedPromosiValue = value
  //   setPromosiDiscount(updatedPromosiValue)
  // }

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

    if (!storeId) {
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
      setIsLoading(true)
      const formData = new FormData()

      formData.append('order_id', orderId)
      formData.append('store_id', storeId)
      formData.append('quotation_status', quotationStatus)
      formData.append('description', quotationDescription)
      formData.append('quotation_number', quotationNumber.toString())
      formData.append('quotation_date', quotationDate)
      formData.append('quotation_validity', formatForFormData(new Date(quotationValidity)))
      // formData.append('quotation_disc', promosiDiscount.toString())

      // New
      const appendIfNotDefault = (formData: any, key: any, value: any) => {
        if (value !== null && value !== undefined && value !== '' && value !== 0) {
          formData.append(key, String(value))
        }
      }

      quotationDetail.forEach((quotation, index) => {
        appendIfNotDefault(formData, `quotation_details[${index}][id]`, quotation.id)
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
        // appendIfNotDefault(formData, `quotation_details[${index}][margin]`, quotation.margin)
        formData.append(`quotation_details[${index}][margin]`, String(quotation.margin))
        formData.append(`quotation_details[${index}][margin_type]`, String(quotation.margin_type))
        appendIfNotDefault(formData, `quotation_details[${index}][quantity]`, quotation.quantity)
        formData.append(`quotation_details[${index}][is_customer]`, String(quotation.is_user))
      })

      // if (quotationFiles?.length) {
      //   quotationFiles.forEach((item) => {
      //     if (item) {
      //       formData.append(`quotation_files`, item, item?.name)
      //     }
      //   })
      // }

      await axios
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
                      {quotationData?.store?.store_name}
                    </Form.Label>
                  </Col>
                </Form.Group>

                <Form.Group>
                  <Form.Label className='fs-5 fw-bold'>{quotationData?.store?.address}</Form.Label>

                  <Col>
                    <Form.Label className='fs-5 fw-bold'>
                      {quotationData?.store?.phone_number_1
                        ? `Telp : ${
                            quotationData?.store?.phone_number_1 ??
                            quotationData?.store?.phone_number_2 ??
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
                    value={quotationData?.status?.description}
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
                  <Form.Control
                    readOnly
                    className='fs-5  text-black'
                    type='text'
                    value={quotationData?.order_id}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold' column sm='4'>
                  Quotation ID :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control type='number' value={quotationData?.id} readOnly />
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
            <Table responsive hover>
              <thead>
                <tr>
                  <th className='content text-center'>Jenis Jasa</th>
                  <th className='content text-center'>QTY</th>
                  <th className='content text-center'>Satuan</th>
                  <th className='content text-center'>Price</th>
                  <th className='content text-center'>Total</th>
                  <th className='content text-center'>Margin</th>
                  <th className='content text-center'>Final Price</th>
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
                          value={element.quantity}
                          onChange={(e) => {
                            handleChangeQuotationDetail(e, index, e.target.value, 2)
                            calcEachDetails(element.margin_type, element.index)
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
                          name='unit_price'
                          type='number'
                          value={element.unit_price}
                          onChange={(e) => {
                            handleChangeQuotationDetail(e, index, e.target.value, 2)
                            calcEachDetails(element.margin_type, element.index)
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
                          value={element.margin}
                          name='margin'
                          onChange={(e) => {
                            handleChangeQuotationDetail(e, index, e.target.value, 2)
                            calcEachDetails(element.margin_type, element.index)
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
                                calcEachDetails(element.margin_type, element.index)
                              }}
                            />
                          </div>

                          <div className='ms-1'>
                            {element.margin_type === 1 ? 'Persen' : 'Nominal'}
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

            <Table responsive hover>
              <thead>
                <tr>
                  <th></th>
                  <th className='text-center' style={{minWidth: '230px'}}>
                    Material Yang Dibutuhkan
                  </th>
                  <th className='content text-center'>QTY</th>
                  <th className='content text-center'>Satuan</th>
                  <th className='content text-center'>Price</th>
                  <th className='content text-center'>Total</th>
                  <th className='content text-center'>Margin</th>
                  <th className='content text-center' style={{minWidth: '100px'}}>
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
                            calcEachDetails(element.margin_type, element.index)
                          }}
                        />
                      </td>

                      <td>
                        <Form.Control
                          id={`satuan-${index}`}
                          name='unit'
                          value={element.unit}
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
                            calcEachDetails(element.margin_type, element.index)
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
                            calcEachDetails(element.margin_type, element.index)
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
                                calcEachDetails(element.margin_type, element.index)
                              }}
                            />
                          </div>

                          <div className='ms-1'>
                            {element.margin_type === 1 ? 'Persen' : 'Nominal'}
                          </div>
                        </div>
                      </td>

                      <td>
                        <Form.Control
                          readOnly
                          plaintext
                          value={`Rp. ${element.final_price?.toLocaleString('id')}`}
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
                {/* 
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
                </tr> */}

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
              onClick={handleUpdateQuotation}
            >
              {isLoading ? 'Saving..' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {UpdateQuotationVendor}
