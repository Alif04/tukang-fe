import React, {FC, useEffect, useState, useRef, ChangeEvent} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './NewOrder.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'
import {Row, Col, Form, FormGroup, Table, Button, ListGroup} from 'react-bootstrap'
import {Image} from 'antd'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface StoreItemSelect {
  value: number | null
  label: string
  address: string
  city_id: number | null
  zip_code: string
}

interface MemberSelect {
  value?: number | null
  label?: string
  full_name: string
  email?: string
  phone_number?: string
  whatsapp_number?: string
  address_1: string
  join_location: number | null
}

interface SalesSelect {
  value: number | null
  label: string
  full_name: string
}

interface VendorSelect {
  value: number | null
  label: string
}

interface ItemSelect {
  value: number | null
  label: string
  item_code: string
  item_name: string
  category_id: number | null
  default_price: number | null
  prices: Array<{
    id: number | null
    item_id: number | null
    store_id: number | null
    periodic_start: string
    periodic_end: string
    price: string
    min_order: string
  }>
}

interface Order {
  member_id: number | null
  sales_id: number | null
  store_id: number | null
  vendor_id: number | null
  project_status_id: number | null
  project_address: string
  project_number: string
  request_survey: string
  payment_type: string
  receipt_number: string
  is_overdistance: number
  additional_fee: number
  order_details: Array<{
    item?: ItemSelect | null
    item_id: number | null
    item_code: string | null
    item_name: string | null
    quantity: number
    unit_price: string | null
    total: string | null
    item_notes: string | null
  }>
  order_files: Array<any>

  [key: string]: any
}

const NewOrderHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Order Information Detail
  const [orderDetail, setOrderDetail] = useState<any>()

  // Store
  const [store, setStore] = useState<StoreItemSelect[]>([])
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreItemSelect>>({
    value: null,
    label: '',
    address: '',
    city_id: null,
    zip_code: '',
  })

  // Order
  const [orderForm, setOrderForm] = useState<Order>({
    member_id: null,
    sales_id: null,
    store_id: null,
    vendor_id: null,
    project_status_id: null,
    project_address: '',
    project_number: '',
    request_survey: '',
    payment_type: 'gratis',
    receipt_number: '',
    is_overdistance: 0,
    additional_fee: 25000,
    order_details: [
      {
        item: null,
        item_id: null,
        item_code: null,
        item_name: null,
        quantity: 1,
        unit_price: null,
        total: null,
        item_notes: null,
      },
    ],
    order_files: [],
  })

  const [paymentTypeValue, setPaymentTypeValue] = useState(['gratis', 'pemasangan_tanpa_survey'])
  const [receiptFiles, setReceiptFiles] = useState<Array<File | null>>([])
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)
  const evidenceRef = useRef<HTMLInputElement>(null)

  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)

  // Member
  const [isSubmittingNewMember, setIsSubmittingNewMember] = useState(false)
  const [member, setMember] = useState<MemberSelect[]>([])
  const [searchByPhoneNumber, setSearchByPhoneNumber] = useState('')
  const [selectedMember, setSelectedMember] = useState<MemberSelect>({
    full_name: '',
    email: '',
    address_1: '',
    join_location: null,
  })

  const [isWhatsapp, setIsWhatsapp] = useState<boolean>(true)
  const [isOverdistance, setIsOverdistance] = useState<number>(0)

  // Sales
  const [sales, setSales] = useState<SalesSelect[]>([])
  const [selectedSales, setSelectedSales] = useState<SingleValue<SalesSelect>>({
    value: null,
    label: '',
    full_name: '',
  })

  // Vendor
  const [vendor, setVendor] = useState<VendorSelect[]>([])
  const [selectedVendor, setSelectedVendor] = useState<SingleValue<VendorSelect>>({
    value: null,
    label: '',
  })

  // Order Detail Table
  const [item, setItem] = useState<ItemSelect[]>([])
  const [grandTotal, setGrandTotal] = useState<number>(0)

  // Fetch API Data
  const getItem = async (itemNameSearch: string) => {
    const itemFree = paymentTypeValue[0] === 'gratis' ? '&is_free=1' : ''
    const search = itemNameSearch ? `&search=${itemNameSearch}` : ''

    try {
      const response = await axios.get(`${apiUrl}/items?take=0${search}${itemFree}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const item = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.service_name,
          item_code: item?.item_code ?? '',
          item_name: item?.item_name ?? '',
          category_id: item.category_id,
          default_price: item.default_price,
          prices: item.prices.map((priceItem: any) => ({
            id: priceItem.id,
            item_id: priceItem.item_id,
            store_id: priceItem.store_id,
            periodic_start: priceItem.periodic_start,
            periodic_end: priceItem.periodic_end,
            min_order: priceItem.min_order,
            price: priceItem.price,
          })),
        }))

        const filteredItem = item.filter((detail: any) => detail.default_price !== '0')
        setItem(paymentTypeValue[0] === 'berbayar' ? filteredItem : item)

        // setItem(item)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getItem('')
  }, [paymentTypeValue])

  useEffect(() => {
    const getMember = async () => {
      const storeId = selectedStore && selectedStore.value ? `store_id=${selectedStore.value}` : ``

      try {
        const labelKey = determineLabelKey(searchByPhoneNumber)
        const phoneNumber = searchByPhoneNumber ? `&search=${searchByPhoneNumber}` : ''

        const response = await axios.get(`${apiUrl}/member?${storeId}${phoneNumber}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempMember = response.data.data.map((item: any) => ({
            value: item.id,
            label: item[labelKey],
            full_name: item.full_name,
            email: item.email,
            phone_number: item.phone_number,
            whatsapp_number: item.whatsapp_number,
            address_1: item.address_1,
            join_location: item.join_location,
          }))

          setMember(tempMember)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const determineLabelKey = (search: any) => {
      switch (true) {
        case search.includes('+'):
          return 'whatsapp_number'
        case search.includes('08'):
          return 'phone_number'
        default:
          return 'member_number'
      }
    }

    getMember()
  }, [searchByPhoneNumber, selectedStore])

  useEffect(() => {
    const storeId = selectedStore && selectedStore.value ? `store_id=${selectedStore.value}` : ``

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

    const getSales = async () => {
      try {
        const response = await axios.get(`${apiUrl}/sales?${storeId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempSales = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.full_name,
            full_name: item.full_name,
          }))

          setSales(tempSales)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const getVendor = async () => {
      try {
        const response = await axios.get(`${apiUrl}/vendor?vendor_with_max_order=1&${storeId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempVendor = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.company_name,
          }))

          setVendor(tempVendor)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getStore()
    getSales()
    getVendor()
  }, [selectedStore?.value])

  // Order Form Handler
  const orderFormHandler = (e: any) => {
    setOrderForm({
      ...orderForm,
      [e.target.name]: e.target.value,
    })
  }

  // Checkbox Handler
  const handleCheckboxChange = (isChecked: boolean) => {
    setIsOverdistance(isChecked ? 1 : 0)
  }

  // Member Form Handler
  const handleChangeSelectMember = (newValue: MemberSelect | null) => {
    if (newValue) {
      setSelectedMember({
        value: newValue.value || null,
        label: newValue.label || '',
        full_name: newValue.full_name || '',
        email: newValue.email || '',
        phone_number: newValue.phone_number || '',
        whatsapp_number: newValue.whatsapp_number || '',
        address_1: newValue.address_1 || '',
        join_location: newValue.join_location || null,
      })
    } else {
      setSelectedMember({
        value: null,
        label: '',
        full_name: '',
        email: '',
        phone_number: '',
        whatsapp_number: '',
        address_1: '',
        join_location: null,
      })
    }
  }

  // Order Detail Form Handler
  const orderDetailsFormHandler = (e: any, index: number) => {
    setOrderForm((prev) => {
      const cache = {...prev}
      cache.order_details[index] = {
        ...cache.order_details[index],
        [e.target.name]: e.target.value,
      }

      return cache
    })
  }

  // Overdistance
  useEffect(() => {
    setOrderForm({
      ...orderForm,
      is_overdistance: isOverdistance,
    })
  }, [isOverdistance])

  // Selected Store
  useEffect(() => {
    setOrderForm({
      ...orderForm,
      store_id: selectedStore?.value ?? null,
    })
  }, [selectedStore])

  // Selected Member
  useEffect(() => {
    setOrderForm({
      ...orderForm,
      project_address: selectedMember?.address_1 ?? '',
      project_number:
        (isWhatsapp ? selectedMember?.whatsapp_number : selectedMember?.phone_number) ?? '',
      member_id: selectedMember?.value ?? null,
    })
  }, [selectedMember, isWhatsapp])

  // Selected Sales
  useEffect(() => {
    setOrderForm({
      ...orderForm,
      sales_id: selectedSales?.value ?? null,
    })
  }, [selectedSales])

  // Selected Vendor
  useEffect(() => {
    setOrderForm({
      ...orderForm,
      vendor_id: selectedVendor?.value ?? null,
    })
  }, [selectedVendor])

  // Selected Payment Type && Clear Order Detail if user changed the payment type
  useEffect(() => {
    setOrderForm({
      ...orderForm,
      payment_type: paymentTypeValue[0] === 'gratis' ? 'gratis' : paymentTypeValue[1],
      order_details: [
        {
          item_id: null,
          item_code: null,
          item_name: null,
          quantity: 1,
          unit_price: null,
          total: null,
          item_notes: null,
        },
      ],
    })
  }, [paymentTypeValue])

  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const statusNameByPaymentType =
      paymentTypeValue[0] === 'gratis' || paymentTypeValue[1] === 'pemasangan_tanpa_survey'
        ? 'WORKREQ'
        : 'SURVEYREQ'

    const desiredStatus = statusData.find(
      (status: any) => status.category === statusNameByPaymentType
    )

    const statusId = desiredStatus?.value

    setOrderForm({
      ...orderForm,
      project_status_id: statusId,
    })
  }, [orderForm.project_status_id])

  // Select Date Request
  const today = new Date().toISOString().split('T')[0]

  // Calculate each details
  const calcEachDetails = () => {
    setOrderForm((prev) => {
      const order_details = prev.order_details.map((detail) => {
        let newDetail = {...detail}

        if (detail.item) {
          const {item, quantity} = detail
          const {prices, default_price} = item

          const unitPrice =
            prices && prices.length > 0 && quantity >= +prices[0]?.min_order
              ? +prices[0].price
              : default_price !== null
              ? +default_price
              : 0 // Provide a default value if default_price is null
          const total = unitPrice * quantity

          newDetail = {...newDetail, unit_price: unitPrice.toString(), total: total.toString()}
        }

        return newDetail
      })

      return {...prev, order_details}
    })
  }

  // Upload Order File Handler
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const existingFiles = [...receiptFiles]
      const mergedFiles = existingFiles.concat(file)

      const {length: existingFilesLength} = existingFiles
      const {length: fileListLength} = fileList

      for (let i = 0; i < fileListLength; i++) {
        mergedFiles[existingFilesLength + i] = fileList.item(i)
      }

      setReceiptFiles(mergedFiles)
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = (index: number) => {
    const newEvidances = [...receiptFiles]
    newEvidances.splice(index, 1)
    setReceiptFiles(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  const handleFileClick = (index: number) => {
    setPreviewImage(receiptFiles[index]?.name)
    setVisible(true)
    setSelectedFileIndex(index)
  }

  // Order Details
  const addOrderDetails = () => {
    const newDetail = {
      id: null,
      item_id: null,
      item_code: null,
      item_name: null,
      quantity: 1,
      unit_price: null,
      total: null,
      item_notes: null,
    }

    setOrderForm((prev) => {
      const cache = {...prev}
      cache.order_details.push(newDetail)
      return cache
    })

    getItem('')
  }

  const handleRemoveForm = (index: any) => {
    setOrderForm((prev) => {
      const cache = {...prev}
      cache.order_details.splice(index, 1)
      return cache
    })

    getItem('')
  }

  // Calculate Grand Total Order Amount
  const calculatedGrandTotalOrder = () => {
    const grandTotal = orderForm.order_details.reduce((accumulator, element) => {
      let totalOrderAmount = 0
      let biayaSurvey = 0

      const total = element.total ? parseInt(element.total) : 0

      if (paymentTypeValue[0] === 'gratis') {
        biayaSurvey = 0
        totalOrderAmount = 0
      } else if (paymentTypeValue[1] === 'survey') {
        biayaSurvey = 99000
        totalOrderAmount = 0
      } else {
        biayaSurvey = 0
        totalOrderAmount = total
      }

      const calculatedGrandTotal = totalOrderAmount + biayaSurvey

      return paymentTypeValue[1] === 'pemasangan_tanpa_survey'
        ? accumulator + calculatedGrandTotal
        : calculatedGrandTotal
    }, 0)

    const additionalFee = Number(orderForm.additional_fee)
    const grandTotalWithFee = isOverdistance === 1 ? grandTotal + additionalFee : grandTotal

    return grandTotalWithFee
  }

  useEffect(() => {
    const calculatedGrandTotal = calculatedGrandTotalOrder()
    setGrandTotal(calculatedGrandTotal)
  }, [orderForm.order_details, orderForm.additional_fee, paymentTypeValue, isOverdistance])

  // Submit Update Order
  const handleSubmitNewOrder = async () => {
    setIsLoading(true)
    const url = `${apiUrl}/orders`
    const formData = new FormData()

    let errorBags = []
    const requiredOrderFields = [
      {key: 'member_id', fieldName: 'Nomor Member'},
      {key: 'sales_id', fieldName: 'Sales Information'},
      {key: 'store_id', fieldName: 'Store'},
      {key: 'vendor_id', fieldName: 'Vendor'},
      {key: 'project_status_id', fieldName: 'Proyek Status'},
      {key: 'project_address', fieldName: 'Alamat Proyek'},
      {key: 'project_number', fieldName: 'Nomor Proyek'},
      {key: 'request_survey', fieldName: 'Request Survey'},
      {key: 'payment_type', fieldName: 'Payment Type'},
      {key: 'receipt_number', fieldName: 'Nomor Receipt'},
      {key: 'order_details', fieldName: 'Order Details'},
      {key: 'is_overdistance', fieldName: 'Overdistance'},
      {key: 'additional_fee', fieldName: 'Additional Fee'},
    ]

    const requiredOrderDetailsFields = [
      {key: 'item_id', fieldName: 'Jasa Pemasangan'},
      {key: 'quantity', fieldName: 'Quantity'},
    ]

    for (const key in orderForm) {
      if (Object.prototype.hasOwnProperty.call(orderForm, key)) {
        const value = orderForm[key]
        const required = requiredOrderFields.find((fields: {key: string}) => fields.key === key)

        if (required) {
          if (value) {
            if (key === 'order_details') {
              orderForm.order_details.forEach((item: any, index: number) => {
                if (item) {
                  if (item?.item_code !== null) {
                    formData.append(`order_details[${index}][item_code]`, item.item_code)
                  }

                  if (item?.item_name !== null) {
                    formData.append(`order_details[${index}][item_name]`, item.item_name)
                  }

                  if (item?.item_notes !== null && item?.item_notes !== '') {
                    formData.append(`order_details[${index}][item_notes]`, item.item_notes)
                  }

                  if (item?.item_id !== null) {
                    formData.append(`order_details[${index}][item_id]`, item.item_id)
                  }

                  formData.append(`order_details[${index}][quantity]`, item.quantity)
                }
              })
            } else if (
              key === 'project_number' &&
              isWhatsapp === true &&
              isSubmittingNewMember === true
            ) {
              formData.append(key, `+62${orderForm[key]}`)
            } else if (
              key === 'project_number' &&
              isWhatsapp === false &&
              isSubmittingNewMember === true
            ) {
              formData.append(key, `08${orderForm[key]}`)
            } else {
              formData.append(key, orderForm[key])
            }
          } else if (key === 'additional_fee' && isOverdistance === 1) {
            if (value) {
              formData.append(key, orderForm[key].toString())
            }
          } else if (key === 'is_overdistance') {
            if (value) {
              formData.append(key, orderForm[key].toString())
            }
          } else {
            errorBags.push({
              message: `${required.fieldName} cannot be empty`,
            })
          }
        }
      }
    }

    if (errorBags.length > 0) {
      Swal.fire({
        title: 'Warning',
        text: errorBags[0].message,
        icon: 'warning',
      })

      setIsLoading(false)
      return false
    }

    if (receiptFiles?.length) {
      receiptFiles.forEach((item) => {
        if (item instanceof Blob) {
          formData.append(`order_files`, item, item.name)
        }
      })
    }

    await axios
      .post(url, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        const orderId = response.data.data.id

        if (response.data.status === 201) {
          Swal.fire({
            title: 'Success',
            text: 'Success Add Order',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate(`/order/preview-email/${orderId}`)
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
      })
      .catch((error) => {
        setIsLoading(false)

        Swal.fire({
          title: 'Error',
          text: error.response.data.messages,
          icon: 'error',
        })
      })
  }

  // Submit New Member
  const handleSubmitNewMember = async () => {
    if (selectedMember.value === null) {
      setIsSubmittingNewMember(true)

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      const newMember: MemberSelect = {
        full_name: selectedMember.full_name,
        address_1: selectedMember.address_1,
        join_location: Number(selectedStore?.value),
      }

      if (selectedMember.whatsapp_number) {
        newMember.whatsapp_number = '+62' + selectedMember.whatsapp_number
      }

      if (selectedMember.phone_number) {
        newMember.phone_number = '08' + selectedMember.phone_number
      }

      if (selectedMember.email && !emailPattern.test(selectedMember.email)) {
        Swal.fire({
          title: 'Invalid Email',
          text: 'Please enter a valid email address.',
          icon: 'warning',
        })

        setIsSubmittingNewMember(false)
        return
      } else {
        newMember.email = selectedMember.email
      }

      try {
        const response = await axios.post(`${apiUrl}/member`, newMember, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (response.data.status === 201) {
          setSelectedMember((selectedMember) => ({
            ...selectedMember,
            value: response.data.data.member.id,
          }))

          setOrderForm((prevOrderForm) => ({
            ...prevOrderForm,
            member_id: response.data.data.member.id,
          }))

          setIsSubmittingNewMember(true)
        } else {
          setIsSubmittingNewMember(false)

          Swal.fire({
            title: 'Warning',
            text: response.data.message,
            icon: 'warning',
          })
        }
      } catch (error: any) {
        setIsSubmittingNewMember(false)

        Swal.fire({
          title: 'Warning',
          text: error.response.data.message,
          icon: 'warning',
        })
      }
    } else {
      await handleSubmitNewOrder()
    }
  }

  useEffect(() => {
    if (isSubmittingNewMember === true) {
      setOrderForm({
        ...orderForm,
        member_id: selectedMember?.value ?? null,
      })

      handleSubmitNewOrder()
    }
  }, [selectedMember.value])

  return (
    <section id='update-order'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <div className='form-costumer'>
              <Row className='form-header'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='mb-3'>
                  <Form.Group as={Row}>
                    <Form.Label column sm='4' className='title'>
                      Nama Toko
                    </Form.Label>

                    <Col sm='8'>
                      <Select
                        name='store_id'
                        className='form-control p-0'
                        classNamePrefix='select'
                        placeholder='Pilih Toko'
                        isSearchable={true}
                        isClearable={true}
                        options={store}
                        onChange={(newValue) => setSelectedStore(newValue)}
                      />
                    </Col>
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='mb-3'>
                  <Row>
                    <Col xxl={3}>
                      <Form.Label className='payment-type title'>Payment Type :</Form.Label>
                    </Col>

                    <Col className='form-check-request' xxl={9}>
                      <Row>
                        <Col xxl={5}>
                          <Form.Check
                            inline
                            label='Gratis'
                            id='gratis'
                            name='type'
                            type='radio'
                            value='gratis'
                            checked={paymentTypeValue[0] === 'gratis'}
                            onChange={() =>
                              setPaymentTypeValue(['gratis', 'pemasangan_tanpa_survey'])
                            }
                          />
                        </Col>

                        <Col xxl={7}>
                          <Form.Check
                            inline
                            label='Survey'
                            id='survey'
                            name='paymentType'
                            type='radio'
                            value='survey'
                            checked={
                              paymentTypeValue[0] === 'berbayar' && paymentTypeValue[1] === 'survey'
                            }
                            disabled={paymentTypeValue[0] === 'gratis'}
                            onChange={() => {
                              setPaymentTypeValue(['berbayar', 'survey'])
                            }}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col xxl={5}>
                          <Form.Check
                            inline
                            label='Berbayar'
                            id='berbayar'
                            name='type'
                            type='radio'
                            value='berbayar'
                            checked={paymentTypeValue[0] === 'berbayar'}
                            onChange={() => {
                              setPaymentTypeValue(['berbayar', 'survey'])
                            }}
                          />
                        </Col>

                        <Col xxl={7}>
                          <Form.Check
                            inline
                            label='Pemasangan Tanpa Survey'
                            id='pemasangan_tanpa_survey'
                            name='paymentType'
                            type='radio'
                            value='pemasangan_tanpa_survey'
                            checked={
                              (paymentTypeValue[0] === 'gratis' &&
                                paymentTypeValue[1] === 'pemasangan_tanpa_survey') ||
                              (paymentTypeValue[0] === 'berbayar' &&
                                paymentTypeValue[1] === 'pemasangan_tanpa_survey')
                            }
                            disabled={paymentTypeValue[0] === 'gratis'}
                            onChange={() => {
                              setPaymentTypeValue([paymentTypeValue[0], 'pemasangan_tanpa_survey'])
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Form.Label className='fs-7 fw-normal'>
                    <span className='text-danger fw-bold'>Note :</span>
                    <br></br>Tidak dapat memilih gratis dan survey secara bersamaan
                  </Form.Label>
                </Col>
              </Row>

              <Row className='input-order'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label className='title'>No Member</Form.Label>
                    <Select
                      name='member'
                      id='member'
                      className='form-control p-0 form-item-name'
                      classNamePrefix='select'
                      placeholder='Ketik No Telepon Member/Nomor Member'
                      isSearchable={true}
                      isClearable={true}
                      options={member}
                      onInputChange={(newValue) => setSearchByPhoneNumber(newValue)}
                      onChange={(newValue) => handleChangeSelectMember(newValue)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <div className='d-flex justify-content-between'>
                      <Form.Label className='title'>WA / Phone Number</Form.Label>

                      <div className='form-check-request'>
                        <Form.Check
                          inline
                          label='Bukan Whatsapp'
                          name='group1'
                          value='1'
                          type='checkbox'
                          onChange={() => setIsWhatsapp(!isWhatsapp)}
                        />
                      </div>
                    </div>

                    <FormGroup>
                      <Form.Control
                        className={
                          isWhatsapp === true &&
                          (selectedMember.value === null || selectedMember.value === undefined)
                            ? 'form-project-number-wa'
                            : isWhatsapp === false &&
                              (selectedMember.value === null || selectedMember.value === undefined)
                            ? 'form-project-number-phone'
                            : ''
                        }
                        name='project_number'
                        value={orderForm.project_number}
                        onChange={(event) => {
                          const name = isWhatsapp ? 'whatsapp_number' : 'phone_number'
                          orderFormHandler(event)
                          handleChangeSelectMember({
                            ...selectedMember,
                            [name]: event.target.value,
                          })
                        }}
                      />

                      {(selectedMember.value === null || selectedMember.value === undefined) && (
                        <span className='project-number'>
                          <div className='prefix-number text-black'>
                            {isWhatsapp === true ? '+62' : '08'}
                          </div>
                        </span>
                      )}
                    </FormGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Row className='input-order'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label className='title'>Nama Customer</Form.Label>
                    <Form.Control
                      type='text'
                      value={selectedMember?.full_name || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChangeSelectMember({
                          ...selectedMember,
                          full_name: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label className='title'>Email</Form.Label>
                    <Form.Control
                      type='email'
                      value={selectedMember?.email || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChangeSelectMember({
                          ...selectedMember,
                          email: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className='alamat-order'>
                <Col>
                  <Form.Group className='mb-5'>
                    <Form.Label className='title'>Alamat</Form.Label>
                    <Form.Control
                      as='textarea'
                      name='project_address'
                      className='field-alamat'
                      value={orderForm.project_address}
                      onChange={(event) => {
                        orderFormHandler(event)
                        handleChangeSelectMember({
                          ...selectedMember,
                          address_1: event.target.value,
                        })
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className='form-sales'>
              <div className='form-header'>
                <h1 className='text-end fw-bold'>SALES INFORMATION</h1>
              </div>
              <Form.Group as={Row} className='mb-5'>
                <Form.Label className='title' column xxl='4' xl='5' md='2'>
                  Sales ID :
                </Form.Label>

                <Col xxl='8' xl='7' md='10'>
                  <Form.Control type='number' readOnly value={selectedSales?.value || ''} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-5'>
                <Form.Label className='title' column xxl='4' xl='5' md='2'>
                  Nama Sales :
                </Form.Label>

                <Col xxl='8' xl='7' md='10'>
                  <Select
                    name='sales'
                    id='sales'
                    className='form-control p-0 form-item-name'
                    classNamePrefix='select'
                    placeholder='Pilih/Ketik Nama Sales'
                    isSearchable={true}
                    isClearable={true}
                    options={sales}
                    onChange={(newValue) => setSelectedSales(newValue)}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-5'>
                <Form.Label column sm='4'>
                  No Receipt
                </Form.Label>
                <Col sm='8'>
                  <Form.Control
                    name='receipt_number'
                    type='text'
                    value={orderForm.receipt_number}
                    onChange={(e) => orderFormHandler(e)}
                  />
                </Col>
              </Form.Group>
            </div>
          </div>

          <Row className='table-order-header d-flex align-items-center mb-5'>
            <Col
              xs={12}
              md={3}
              lg={3}
              xl={3}
              xxl={3}
              className='request-date order-md-2 order-sm-1'
            >
              <Form.Group>
                <Form.Label>Nama Vendor :</Form.Label>

                <Select
                  name='vendor'
                  id='vendor'
                  className='form-control p-0 form-item-name'
                  classNamePrefix='select'
                  placeholder='Pilih/Ketik Nama Vendor'
                  isSearchable={true}
                  isClearable={true}
                  options={vendor}
                  onChange={(newValue) => setSelectedVendor(newValue)}
                />
              </Form.Group>
              <Form.Text className='fs-8 text-transparent'>
                *Tanggal Request <span className='fw-bolder text-decoration-underline'>bukan</span>{' '}
                tanggal pasti. Konfirmasi kunjungan dilakukan oleh Vendor
              </Form.Text>
            </Col>

            <Col
              xs={12}
              md={3}
              lg={3}
              xl={3}
              xxl={3}
              className='request-date order-md-1 order-sm-2'
            >
              <Form.Group>
                <Form.Label>Tanggal Request</Form.Label>
                <Form.Control
                  name='request_survey'
                  type='date'
                  value={orderForm.request_survey}
                  onChange={(e) => orderFormHandler(e)}
                  // TODO: ENABLE BACKDATE VALIDATION WHILE PRODUCTION
                  // min={today}
                />
                <Form.Text className='fs-8 text-dark-danger'>
                  *Tanggal Request{' '}
                  <span className='fw-bolder text-decoration-underline'>bukan</span> tanggal pasti.
                  Konfirmasi kunjungan dilakukan oleh Vendor
                </Form.Text>
              </Form.Group>
            </Col>

            <Col
              xs={12}
              md={3}
              lg={3}
              xl={3}
              xxl={3}
              className='order-status order-md-3 order-sm-4'
            >
              <h1 className='fs-3 fw-bold'>
                ORDER STATUS : <span className='fw-bold text-success'>BOOKED</span>
              </h1>
            </Col>

            <Col xs={12} md={3} lg={3} xl={3} xxl={3} className='button-add text-end order-md-4'>
              <button onClick={() => addOrderDetails()}>Tambah Order</button>
            </Col>
          </Row>

          <Row className='mb-2'>
            <Col>
              <Form.Check
                inline
                label='Lebih dari 10 KM dari Store'
                type='checkbox'
                onChange={(e) => handleCheckboxChange(e.target.checked)}
              />
            </Col>
          </Row>

          <div className='table-order-content'>
            <Table hover responsive='md'>
              <thead className='table-order-head'>
                <tr>
                  {orderForm.order_details.length >= 2 && <th>Action</th>}
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Nama Pemasangan</th>
                  <th>QTY Pemasangan</th>
                  {!(paymentTypeValue[0] === 'gratis' || paymentTypeValue[1] === 'survey') && (
                    <>
                      <th>Harga Jasa</th>
                      <th>Total</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {orderForm.order_details.map((element, index) => (
                  <tr key={`${index}-order_details`}>
                    {orderForm.order_details.length >= 2 && (
                      <td align='center'>
                        <Button
                          className='btn-remove'
                          variant='danger'
                          onClick={() => handleRemoveForm(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    )}

                    <td>
                      <Form.Control
                        id={`item-code-${index}`}
                        plaintext
                        readOnly={paymentTypeValue[1] === 'pemasangan_tanpa_survey' ? true : false}
                        name={`item_code`}
                        value={element?.item_code ?? ''}
                        onChange={(e) => orderDetailsFormHandler(e, index)}
                      />
                    </td>

                    <td style={{maxWidth: '200px', minWidth: '200px'}}>
                      <Form.Control
                        id={`item-name-${index}`}
                        plaintext
                        readOnly={paymentTypeValue[1] === 'pemasangan_tanpa_survey' ? true : false}
                        name={`item_name`}
                        value={element?.item_name ?? ''}
                        onChange={(e) => {
                          orderDetailsFormHandler(e, index)
                          getItem(e.target.value)
                        }}
                      />
                    </td>

                    <td>
                      {paymentTypeValue[1] === 'survey' ? (
                        <Form.Control
                          id={`item-notes-${index}`}
                          plaintext
                          name={`item_notes`}
                          onChange={(e) => {
                            orderDetailsFormHandler(e, index)
                          }}
                        />
                      ) : (
                        <Select
                          id={`item_id-${index}`}
                          className='form-control p-0 form-item-name'
                          classNamePrefix='select'
                          placeholder='Pilih/Ketik Nama Pemasangan'
                          isSearchable={true}
                          options={item}
                          name={`item_id`}
                          value={orderForm.order_details[index]?.item ?? null}
                          onChange={(newValue) => {
                            setOrderForm((prev) => {
                              const cache = {...prev}
                              cache.order_details[index] = {
                                ...cache.order_details[index],
                                item_id: newValue?.value ?? null,
                                item_code: newValue?.item_code ?? '',
                                item_name: newValue?.item_name ?? '',
                                item: newValue,
                              }
                              return cache
                            })
                            calcEachDetails()
                          }}
                        />
                      )}
                    </td>

                    <td>
                      <Form.Control
                        id={`quantity-${index}`}
                        name={`quantity`}
                        value={element.quantity ?? ''}
                        onChange={(e) => {
                          orderDetailsFormHandler(e, index)
                          calcEachDetails()
                        }}
                      />
                    </td>

                    {!(paymentTypeValue[0] === 'gratis' || paymentTypeValue[1] === 'survey') && (
                      <>
                        <td>
                          <Form.Control
                            id={`unit-price-${index}`}
                            readOnly
                            plaintext
                            value={`Rp. ${
                              element?.unit_price
                                ? parseInt(element?.unit_price).toLocaleString('id')
                                : 0
                            }`}
                          />
                        </td>

                        <td>
                          <Form.Control
                            id={`total-${index}`}
                            readOnly
                            plaintext
                            value={`Rp. ${
                              element?.total ? parseInt(element?.total).toLocaleString('id') : 0
                            }`}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {!(
                  paymentTypeValue[0] === 'gratis' ||
                  paymentTypeValue[1] === 'pemasangan_tanpa_survey'
                ) && (
                  <tr>
                    <td
                      className='text-end fw-bolder'
                      colSpan={orderForm.order_details.length >= 2 ? 4 : 3}
                    >
                      Biaya Survey
                    </td>

                    <td className=' fw-bolder'>
                      {(() => {
                        if (paymentTypeValue[1] === 'survey') {
                          return `Rp. 99.000`
                        } else {
                          return `Rp. 0`
                        }
                      })()}
                    </td>
                  </tr>
                )}

                {isOverdistance === 1 && (
                  <tr>
                    <td
                      className='text-end fw-bolder align-middle'
                      colSpan={
                        !(paymentTypeValue[0] === 'gratis' || paymentTypeValue[1] === 'survey')
                          ? orderForm.order_details.length >= 2
                            ? 6
                            : 5
                          : orderForm.order_details.length === 1
                          ? 3
                          : 4
                      }
                    >
                      Biaya Tambahan
                    </td>

                    <td className=' fw-bolder'>
                      <Form.Control
                        name='additional_fee'
                        type='number'
                        value={orderForm.additional_fee}
                        onChange={(e) => orderFormHandler(e)}
                      />
                    </td>
                  </tr>
                )}

                {(paymentTypeValue[1] !== 'survey' || isOverdistance === 1) && (
                  <tr>
                    <td
                      className='text-end fw-bolder'
                      colSpan={
                        !(paymentTypeValue[0] === 'gratis' || paymentTypeValue[1] === 'survey')
                          ? orderForm.order_details.length >= 2
                            ? 6
                            : 5
                          : orderForm.order_details.length === 1
                          ? 3
                          : 4
                      }
                    >
                      Grand Total
                    </td>
                    <td className=' fw-bolder'>Rp. {grandTotal.toLocaleString('id')}</td>
                  </tr>
                )}
              </tbody>
            </Table>

            <Form.Text className='fs-8 fs-l text-dark-danger'>
              *Penulisan Item code dan Item Name sama persis dengan yang tercantum di NAV
            </Form.Text>
          </div>

          <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <Form.Group>
                <Form.Label>Upload Receipt</Form.Label>
                <Form className='form-input-image' onClick={handleImageClick}>
                  <Form.Control
                    type='file'
                    accept='image/jpeg, image/png'
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
                  {receiptFiles.length ? (
                    receiptFiles.map((item, index) => (
                      <ListGroup>
                        <ListGroup.Item
                          className='d-flex justify-content-between align-items-center'
                          key={`${item?.name}-${index}-${item?.type}`}
                        >
                          <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                          <span className='upload-content' onClick={() => handleFileClick(index)}>
                            {item?.name}
                          </span>

                          <FontAwesomeIcon
                            icon={faTrash}
                            size='sm'
                            color='#ed2b2a'
                            style={{cursor: 'pointer'}}
                            onClick={(e) => handleRemoveFile(index)}
                          />
                        </ListGroup.Item>

                        {selectedFileIndex === index && item && (
                          <Image
                            key={`${previewImage} - ${index}`}
                            width={200}
                            style={{display: 'none'}}
                            src={
                              item instanceof File
                                ? URL.createObjectURL(item)
                                : `${apiUrl}/public/receipt/${previewImage}`
                            }
                            preview={{
                              visible,
                              src:
                                item instanceof File
                                  ? URL.createObjectURL(item)
                                  : `${apiUrl}/public/receipt/${previewImage}`,
                              onVisibleChange: (value) => {
                                setVisible(value)
                              },
                            }}
                          />
                        )}
                      </ListGroup>
                    ))
                  ) : (
                    <ListGroup.Item className='d-flex justify-content-center'>
                      Tidak ada file yang dipilih
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Form.Group>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
            <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
          </Row>

          <div className='button-submit d-flex justify-content-center align-items-center'>
            <Button
              type='submit'
              onClick={handleSubmitNewMember}
              disabled={isLoading}
              variant='dark-primary'
            >
              {isLoading || isSubmittingNewMember ? 'Submitting..' : 'Submit Order & Email'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewOrderHO}
