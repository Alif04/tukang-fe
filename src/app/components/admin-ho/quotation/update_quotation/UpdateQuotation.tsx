import React, {FC, useState, useEffect, useRef} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './UpdateQuotation.css'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Table, Button, Row, Col} from 'react-bootstrap'

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
  unit: string
  unit_price: number
  total: number
  final_price: number
  margin: number
  margin_type: number
  quantity: number
  is_user: number
  description: string
}

const UpdateQuotationHO: FC = () => {
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

  const [totalMaterial, setTotalMaterial] = useState<number>(0)
  const [totalJasaMaterial, setTotalJasaMaterial] = useState<number>(0)
  const [promosiDiscount, setPromosiDiscount] = useState<any>()
  const [additionalPromosi, setAdditionalPromosi] = useState<number>(0)
  const [grandTotal, setGrandTotal] = useState<any>(0)
  const [grandTotalRounded, setGrandTotalRounded] = useState<any>(0)
  const [grandTotalDiff, setGrandTotalDiff] = useState<any>(0)

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
      unit: '',
      unit_price: 0,
      total: 0,
      final_price: 0,
      margin: 0,
      margin_type: 1,
      quantity: 0,
      is_user: 0,
      description: '',
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
      unit: '',
      unit_price: 0,
      total: 0,
      final_price: 0,
      margin: 0,
      margin_type: 1,
      quantity: 0,
      is_user: 0,
      description: '',
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

          if (data?.quotation_promotion) {
            setAdditionalPromosi(data.quotation_promotion)
          }

          if (data?.quotation_grand_total) {
            setGrandTotal(data.quotation_grand_total)
          }

          if (data?.quotation_details) {
            const workOrderItem = data.quotation_details.map((item: any, index: number) => ({
              id: item.id,
              index: (Date.now() + index).toString(),
              type: item.item_type,
              item_id: item.item_id,
              work_order_item_id: item.work_order_items_id,
              category_id: item.category_id,
              category_name: item?.category?.category_name,
              item_name: item?.name,
              unit: item?.unit,
              quantity: item?.quantity ?? 0,
              is_user: item.is_customer ? 1 : 0,
              unit_price: parseInt(item.price),
              final_price: parseInt(item.final_price),
              margin: parseInt(item.margin),
              margin_type: item?.margin_type ?? 1,
            }))

            setQuotationDetail(workOrderItem)
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

  // Quotation Status
  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatus = statusData.find((status: any) => status.category === 'QUOTEOUT')
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
  let handleAddtionalPromosiChange = (value: any) => {
    const updatedPromosiValue = value
    setAdditionalPromosi(updatedPromosiValue)
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
    calculateTotalMaterial()
    calculateTotalJasaMaterial()
    calculatedGrandTotal()
  }, [quotationDetail, totalJasaMaterial, promosiDiscount, additionalPromosi])

  // Quotation Validation
  const QuotationValidation = () => {
    let valid = true

    if (!storeId) {
      Swal.fire({
        title: 'Warning',
        text: 'Please select store',
        icon: 'warning',
      })
      valid = false
    } else if (!quotationDate) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill tanggal form',
        icon: 'warning',
      })
      valid = false
    } else if (!quotationValidity) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill quotation valid until form',
        icon: 'warning',
      })
      valid = false
    } else if (!promosiDiscount) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill promotion (fill in 0 if not available)',
        icon: 'warning',
      })
      valid = false
    } else if (!additionalPromosi) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill additional promotion (fill in 0 if not available)',
        icon: 'warning',
      })
      valid = false
    }
    return valid
  }

  // Handle Submit Quotation
  const handleUpdateQuotation = async (readiness: number) => {
    if (!QuotationValidation()) {
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    const appendIfNotDefault = (formData: any, key: any, value: any) => {
      if (value !== null && value !== undefined && value !== '' && value !== 0) {
        formData.append(key, String(value))
      }
    }

    formData.append('order_id', orderId)
    formData.append('store_id', storeId)
    formData.append('description', quotationDescription)
    formData.append('quotation_number', quotationNumber.toString())
    formData.append('quotation_date', quotationDate)
    formData.append('quotation_validity', formatForFormData(new Date(quotationValidity)))
    formData.append('quotation_disc', promosiDiscount.toString())
    formData.append('quotation_promotion', additionalPromosi.toString())

    quotationDetail.forEach((quotation, index) => {
      appendIfNotDefault(formData, `quotation_details[${index}][id]`, quotation.id)
      appendIfNotDefault(formData, `quotation_details[${index}][item_id]`, quotation.item_id)
      appendIfNotDefault(formData, `quotation_details[${index}][type]`, quotation.type)
      appendIfNotDefault(formData, `quotation_details[${index}][name]`, quotation.item_name)
      appendIfNotDefault(formData, `quotation_details[${index}][price]`, quotation.unit_price)
      appendIfNotDefault(formData, `quotation_details[${index}][unit]`, quotation.unit)
      appendIfNotDefault(formData, `quotation_details[${index}][quantity]`, quotation.quantity)
      formData.append(`quotation_details[${index}][margin]`, String(quotation.margin))
      formData.append(`quotation_details[${index}][margin_type]`, String(quotation.margin_type))
      formData.append(`quotation_details[${index}][is_customer]`, String(quotation.is_user))
      appendIfNotDefault(
        formData,
        `quotation_details[${index}][work_order_item_id]`,
        quotation.work_order_item_id
      )
      appendIfNotDefault(
        formData,
        `quotation_details[${index}][category_id]`,
        quotation.category_id
      )
    })

    // if (quotationFiles?.length) {
    //   quotationFiles.forEach((item) => {
    //     if (item) {
    //       formData.append(`quotation_files`, item, item?.name)
    //     }
    //   })
    // }

    let textConfirmation = ''
    switch (readiness) {
      case 1:
        formData.append('readiness', String(1))
        formData.append('quotation_status', String(1014))
        textConfirmation = 'Apakah Anda yakin ingin mengubah status quotation menjadi Draft ?'
        break

      case 2:
        formData.append('readiness', String(2))
        formData.append('quotation_status', String(26))
        textConfirmation = 'Apakah Anda yakin ingin menyetujui dan menyimpan quotation ini?'
        break

      case 3:
        formData.append('readiness', String(3))
        formData.append('quotation_status', String(27))
        textConfirmation = 'Apakah Anda yakin ingin menolak quotation ini?'
        break

      case 4:
        formData.append('readiness', String(4))
        formData.append('quotation_status', quotationStatus)
        textConfirmation = 'Apakah Anda yakin ingin mengirim email otomatis kepada pelanggan?'
        break
      default:
        break
    }

    Swal.fire({
      title: textConfirmation,
      icon: 'question',
      showConfirmButton: true,
      confirmButtonColor: '#6b9230',
      showDenyButton: true,
      confirmButtonText: 'Ya',
      denyButtonText: 'Tidak',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${apiUrl}/quotation/${params.id}`, formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          })

          if (response.data.status === 200 || response.data.status === 201) {
            Swal.fire({
              title: 'Success',
              text: 'Success Update Quotation',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            })

            setIsLoading(false)
            navigate('/quotation/view-quotation')
          } else {
            Swal.fire({
              title: 'Error',
              text: response.data.message,
              icon: 'error',
            })

            setIsLoading(false)
          }
        } catch (error: any) {
          console.error(error)
          setIsLoading(false)

          Swal.fire({
            title: 'Error',
            text: error.response.data.message,
            icon: 'error',
          })
        }
      }
    })
  }

  return (
    <section id='update-quotation'>
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

                <Form.Label className='fs-5 fw-bold'>
                  {quotationData?.store?.address ?? ''}
                </Form.Label>

                <Form.Label className='fs-5 fw-bold'>
                  {`Telp : ${
                    quotationData?.store?.phone_number_1 ??
                    quotationData?.store?.phone_number_2 ??
                    'Nomor telepon belum tersedia'
                  }`}
                </Form.Label>
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

          <div className='detail-table'>
            <Table hover className='table-jasa'>
              <thead>
                <tr>
                  <th></th>
                  <th className='text-center' style={{minWidth: '200px'}}>
                    Jenis Jasa
                  </th>
                  <th className='text-center'>Category</th>
                  <th className='text-center'>QTY</th>
                  <th className='text-center'>Satuan</th>
                  <th className='text-center'>Price</th>
                  <th className='text-center'>Margin</th>
                  <th className='text-center'>Total</th>
                  {/* <th className='text-center'>Keterangan</th> */}
                </tr>
              </thead>

              <tbody>
                {quotationDetail
                  .filter((x) => x.type === 2)
                  .map((element, index) => (
                    <tr key={`${element.index}-service`}>
                      <td>
                        <Form.Check
                          id={`margin-type-${index}`}
                          type='checkbox'
                          checked={element.margin_type === 2}
                          onChange={(e) => handleMarginTypeChange(element.index, e.target.checked)}
                        />
                      </td>

                      <td>
                        {/* <Form.Control
                            id={`item-name-${index}`}
                            value={element.item_name}
                            plaintext
                            disabled
                            readOnly
                            onChange={(e) => handleItemNameChange(index, e.target.value, 2)}
                          /> */}
                        <p>{element?.item_name ?? '-'}</p>
                      </td>

                      <td>
                        <Select
                          name='category_id'
                          className='form-control p-0'
                          classNamePrefix='select'
                          placeholder='Pilih Kategori'
                          isSearchable={true}
                          options={categories}
                          value={{
                            value: element.category_id ?? null,
                            label: element.category_name ?? 'Pilih Category',
                          }}
                          onChange={(newValue) => handleCategoryChange(element.index, newValue)}
                        />

                        {/* <p>{element?.category_name ?? '-'}</p> */}
                      </td>

                      <td>
                        {/* <Form.Control
                            id={`quantity-${index}`}
                            value={element.quantity}
                            plaintext
                            disabled
                            readOnly
                            onChange={(e) => handleQuantityChange(index, e.target.value, 2)}
                          /> */}

                        <p>{element?.quantity ?? 0}</p>
                      </td>

                      <td>
                        {/* <Form.Control
                            id={`unit-price-${index}`}
                            type='number'
                            plaintext
                            disabled
                            readOnly
                            value={element.unit_price}
                            onChange={(e) => handleUnitPriceChange(index, e.target.value, 2)}
                          /> */}

                        <p>{element?.unit ?? '-'}</p>
                      </td>

                      <td>
                        {/* <Form.Control
                            id={`unit-price-${index}`}
                            type='number'
                            plaintext
                            disabled
                            readOnly
                            value={element.unit_price}
                            onChange={(e) => handleUnitPriceChange(index, e.target.value, 2)}
                          /> */}

                        <p>{`Rp. ${element?.unit_price?.toLocaleString('id')}`}</p>
                      </td>

                      <td>
                        {/* <Form.Control
                            id={`unit-price-${index}`}
                            type='number'
                            plaintext
                            disabled
                            readOnly
                            value={element.unit_price}
                            onChange={(e) => handleUnitPriceChange(index, e.target.value, 2)}
                          /> */}

                        <p>
                          {element.margin_type === 1
                            ? `${element.margin}%`
                            : `Rp. ${element?.margin?.toLocaleString('id')}`}
                        </p>
                      </td>

                      <td>
                        {/* <Form.Control
                            readOnly
                            disabled
                            plaintext
                            value={`Rp. ${element.final_price?.toLocaleString('id')}`}
                          /> */}
                        <p>{`Rp. ${element?.final_price?.toLocaleString('id')}`}</p>
                      </td>

                      {/* <td>
                        <Form.Control
                            readOnly
                            disabled
                            plaintext
                            value={`Rp. ${element.final_price?.toLocaleString('id')}`}
                          />
                        <p>{element?.description ?? '-'}</p>
                      </td> */}
                    </tr>
                  ))}
              </tbody>
            </Table>

            <Table hover className='table-material'>
              <thead>
                <tr>
                  <th></th>
                  <th className='text-center' style={{minWidth: '200px'}}>
                    Material Yang Dibutuhkan
                  </th>
                  <th className='text-center'>QTY</th>
                  <th className='text-center'>Satuan</th>
                  <th className='text-center'>Price</th>
                  <th className='text-center'>Margin</th>
                  <th className='text-center' style={{minWidth: '100px'}}>
                    Total
                  </th>
                  {/* <th className='text-center' style={{minWidth: '100px'}}>
                    Keterangan
                  </th> */}
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
                          disabled
                          onChange={(e) => handleCheckboxChange(element.index, e.target.checked)}
                        />
                      </td>

                      <td>
                        {/* <Form.Control
                            id={`item-name-${index}`}
                            value={element.item_name}
                            disabled
                            readOnly
                            plaintext
                            onChange={(e) => handleItemNameChange(index, e.target.value, 1)}
                          /> */}
                        <p>{element?.item_name ?? '-'}</p>
                      </td>

                      <td>
                        {/* <Form.Control
                            id={`quantity-${index}`}
                            value={element.quantity}
                            disabled
                            readOnly
                            plaintext
                            onChange={(e) => handleQuantityChange(index, e.target.value, 1)}
                          /> */}
                        <p>{element?.quantity ?? 0}</p>
                      </td>

                      <td>
                        {/* <Form.Control
                            id={`quantity-${index}`}
                            value={element.quantity}
                            disabled
                            readOnly
                            plaintext
                            onChange={(e) => handleQuantityChange(index, e.target.value, 1)}
                          /> */}
                        <p>{element?.unit ?? 0}</p>
                      </td>

                      <td>
                        {/* <Form.Control
                            id={`unit-price-${index}`}
                            type='number'
                            value={element.unit_price}
                            disabled
                            readOnly
                            plaintext
                            onChange={(e) => handleUnitPriceChange(index, e.target.value, 1)}
                          /> */}
                        <p>{`Rp. ${element?.unit_price?.toLocaleString('id')}`}</p>
                      </td>

                      <td>
                        {/* <Form.Control
                            id={`margin-${index}`}
                            type='number'
                            value={element.margin}
                            disabled
                            readOnly
                            plaintext
                            onChange={(e) => handleMarginChange(index, e.target.value, 1)}
                          /> */}
                        <p>
                          {element.margin_type === 1
                            ? `${element.margin}%`
                            : `Rp. ${element?.margin?.toLocaleString('id')}`}
                        </p>
                      </td>

                      <td>
                        {/* <Form.Control
                            disabled
                            readOnly
                            plaintext
                            value={`Rp. ${element.final_price?.toLocaleString('id')}`}
                          /> */}

                        <p>{`Rp. ${element.final_price?.toLocaleString('id')}`}</p>
                      </td>
                      {/* 
                      <td>
                        <Form.Control
                            readOnly
                            disabled
                            plaintext
                            value={`Rp. ${element.final_price?.toLocaleString('id')}`}
                          /> 
                         <p>{element?.description ?? '-'}</p> 
                      </td> */}
                    </tr>
                  ))}

                <tr>
                  <td colSpan={6} className='text-end fw-bolder'>
                    Total Material
                  </td>
                  <td className=' fw-bolder'>{`Rp. ${totalMaterial.toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={6} className='text-end fw-bolder'>
                    Total Jasa & Material
                  </td>
                  <td className=' fw-bolder'>{`Rp. ${totalJasaMaterial.toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={6} className='text-end fw-bolder'>
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
                  <td colSpan={6} className='text-end fw-bolder'>
                    Additional Promosi
                  </td>

                  <td>
                    <Form.Control
                      id='additional-promosi'
                      type='number'
                      value={additionalPromosi}
                      onChange={(e) => handleAddtionalPromosiChange(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td colSpan={6} className='text-end fw-bolder'>
                    Grand Total
                  </td>
                  <td className=' fw-bolder'>{`Rp. ${grandTotal.toLocaleString('id')}`}</td>
                </tr>

                <tr>
                  <td colSpan={6} className='text-end fw-bolder'>
                    Grand Total{' '}
                    <span className='text-success'>{`+ Rp. ${grandTotalDiff} ( Pembulatan )`}</span>
                  </td>

                  <td className=' fw-bolder'>{grandTotalRounded}</td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className='payment-detail'>
            <div className='payment-method'>
              <h1 className='fw-bolder'>Silahkan melakukan pembayaran di account di bawah ini :</h1>

              <h3 className='fw-normal'>{quotationData?.store?.bank_account}</h3>
              <h3 className='fw-normal'>{quotationData?.store?.bank_name}</h3>
              <h3 className='fw-normal'>{quotationData?.store?.bank_number}</h3>
            </div>

            <div className='payment-evidence'>
              <h1 className='fw-bolder'>Silahkan kirim bukti bayar anda melalui:</h1>
              <h1 className='fw-bolder'>
                {`Telp : ${
                  quotationData?.store?.phone_number_1 ??
                  quotationData?.store?.phone_number_2 ??
                  'Nomor telepon belum tersedia'
                }`}
              </h1>
              <h1 className='fw-bolder'>
                {`Email : ${
                  quotationData?.store?.email ??
                  quotationData?.store?.email ??
                  'Email belum tersedia'
                }`}
              </h1>
            </div>

            <h1 className='fw-bolder'>
              Terima kasih telah melakukan bisnis dengan Mitra10. Kami harap kedatangan anda
              kembali.
            </h1>
          </div>

          <div className='d-flex justify-content-center align-items-center mt-5'>
            <Button
              variant='dark-primary'
              className='d-flex justify-content-center align-items-center'
              type='submit'
              onClick={() => handleUpdateQuotation(1)}
            >
              Save
            </Button>

            {quotationData?.readiness === 1 && (
              <>
                <Button
                  variant='dark-success'
                  className='d-flex justify-content-center align-items-center'
                  type='submit'
                  onClick={() => handleUpdateQuotation(2)}
                >
                  Approve
                </Button>

                <Button
                  variant='dark-danger'
                  className='d-flex justify-content-center align-items-center'
                  type='submit'
                  onClick={() => handleUpdateQuotation(3)}
                >
                  Reject
                </Button>
              </>
            )}

            {quotationData?.readiness === 2 && (
              <Button
                variant='dark-warning'
                className='d-flex justify-content-center align-items-center'
                type='submit'
                onClick={() => handleUpdateQuotation(4)}
              >
                Send Email To Customers
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export {UpdateQuotationHO}
