import React, {FC, useEffect, useState, useRef} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {Orders} from '../../../../interfaces/order'

import './UpdateOrder.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'
import {Card, Row, Col, Form, InputGroup, Table, Button, ListGroup} from 'react-bootstrap'
import {Image, Spin} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
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
  value: number | null
  label: string
  full_name: string
  email: string
  phone_number: string
  whatsapp_number: string
  address_1: string
}

interface SalesSelect {
  value: number | null
  label: string
  full_name: string
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
  project_status_id: number | null
  project_address: string
  project_number: string
  request_survey: string
  payment_type: string
  receipt_number: string
  is_overdistance: number
  additional_fee: number
  notes: string
  order_details: Array<{
    id: number | null
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

const UpdateOrderStoreCS: FC<{updatePageTitle: (order: Orders) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()

  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // If User Login is Admin Sales
  const salesId = localStorage.getItem('sales_id') as any
  const username = localStorage.getItem('username') as string
  const userRole = localStorage.getItem('userRole')
  const staffStoreId = localStorage.getItem('storeId') as any
  const staffStoreName = localStorage.getItem('storeName') as string

  // Order Information Detail
  const [orderDetail, setOrderDetail] = useState<any>()

  // Order
  const [orderForm, setOrderForm] = useState<Order>({
    member_id: null,
    sales_id: null,
    store_id: Number.parseInt(staffStoreId),
    project_status_id: null,
    project_address: '',
    project_number: '',
    request_survey: '',
    payment_type: '',
    receipt_number: '',
    is_overdistance: 0,
    additional_fee: 25000,
    notes: '',
    order_details: [
      {
        id: null,
        item: null,
        item_id: null,
        item_code: '',
        item_name: '',
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
  const [member, setMember] = useState<MemberSelect[]>([])
  const [selectedMember, setSelectedMember] = useState<SingleValue<MemberSelect>>({
    value: null,
    label: '',
    full_name: '',
    email: '',
    phone_number: '',
    whatsapp_number: '',
    address_1: '',
  })

  const [isWhatsapp, setIsWhatsapp] = useState<boolean>(false)
  const [isOverdistance, setIsOverdistance] = useState<number>(0)

  // Sales
  const [sales, setSales] = useState<SalesSelect[]>([])
  const [selectedSales, setSelectedSales] = useState<SingleValue<SalesSelect>>({
    value: null,
    label: '',
    full_name: '',
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
    const fetchOrderData = async () => {
      try {
        await axios
          .get(`${apiUrl}/orders/${params.id}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          })
          .then((response) => {
            const data = response.data.data

            setIsLoadingPage(false)
            setOrderDetail(data)

            if (data?.payment_type) {
              if (data.payment_type === 'survey') {
                setPaymentTypeValue(['berbayar', 'survey'])
              } else if (data.payment_type === 'gratis') {
                setPaymentTypeValue(['gratis', 'pemasangan_tanpa_survey'])
              } else if (data.payment_type === 'pemasangan_tanpa_survey') {
                setPaymentTypeValue(['berbayar', 'pemasangan_tanpa_survey'])
              } else {
                setPaymentTypeValue(['gratis', 'pemasangan_tanpa_survey'])
              }
            }

            if (data?.members) {
              setSelectedMember((prev) => ({
                ...prev,
                value: data.members.id,
                label: data.members.member_number,
                full_name: data.members.full_name,
                email: data.members.email,
                phone_number: data.members.phone_number,
                whatsapp_number: data.members.whatsapp_number,
                address_1: data.members.address_1,
              }))

              setOrderForm((prev) => ({
                ...prev,
                member_id: data.members.id,
              }))
            }

            if (data?.project_address) {
              setOrderForm((prev) => ({
                ...prev,
                project_address: data.project_address,
              }))
            }

            if (data?.project_number) {
              setOrderForm((prev) => ({
                ...prev,
                project_number: data.project_number,
              }))
            }

            if (data?.receipt_number) {
              setOrderForm((prev) => ({
                ...prev,
                receipt_number: data.receipt_number,
              }))
            }

            if (data?.sales) {
              setSelectedSales((prev) => ({
                ...prev,
                value: data.sales.id,
                label: data.sales.id,
                full_name: data.sales.full_name,
              }))

              setOrderForm((prev) => ({
                ...prev,
                sales_id: data.sales.id,
              }))
            }

            if (data?.request_survey) {
              setOrderForm((prev) => ({
                ...prev,
                request_survey: new Date(data.request_survey).toISOString().split('T')[0],
              }))
            }

            if (data?.is_overdistance) {
              setOrderForm((prev) => ({
                ...prev,
                is_overdistance: data?.is_overdistance ?? 0,
              }))

              setIsOverdistance(data?.is_overdistance ?? 0)
            }

            if (data?.additional_fee) {
              setOrderForm((prev) => ({
                ...prev,
                additional_fee: data?.additional_fee ?? 0,
              }))
            }

            if (data?.notes) {
              setOrderForm((prev) => ({
                ...prev,
                notes: data?.notes ?? '',
              }))
            }

            if (data?.order_details) {
              setOrderForm((prev) => {
                const previousDetailValues = data.order_details.map((item: any) => {
                  const previousItem = {
                    value: item.id,
                    label: item?.item?.service_name,
                    item_code: item?.item_code ?? '',
                    item_name: item?.item_name ?? '',
                    category_id: item?.item?.category.id,
                    default_price: item?.item?.default_price,
                    prices: [
                      {
                        id: item?.item?.prices[0].id,
                        item_id: item?.item?.prices[0]?.item_id,
                        store_id: item?.item?.prices[0]?.store_id,
                        periodic_start: item?.item?.prices[0]?.periodic_start,
                        periodic_end: item?.item?.prices[0]?.periodic_end,
                        price: item?.item?.prices[0]?.price,
                        min_order: item?.item?.prices[0]?.min_order,
                      },
                    ],
                  }

                  return {
                    item: previousItem,
                    id: item.id,
                    item_id: item.item_id,
                    item_code: item?.item_code === 'null' ? '' : item.item_code,
                    item_name: item?.item_name === 'null' ? '' : item.item_name,
                    item_notes: item?.item_notes === 'null' ? '' : item.item_notes,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total: item.total,
                  }
                })

                return {
                  ...prev,
                  order_details: previousDetailValues,
                }
              })
            }

            if (data?.order_files) {
              const initialOrderFilesValues = data.order_files.map((item: any) => ({
                id: item.id,
                name: item.path,
              }))

              setReceiptFiles(initialOrderFilesValues)
            }

            updatePageTitle(data)
          })
      } catch (error) {
        console.error(error)
      }
    }

    const getMember = async () => {
      try {
        const response = await axios.get(`${apiUrl}/member`, {
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
            label: item.member_number,
            full_name: item.full_name,
            email: item.email,
            phone_number: item.phone_number,
            whatsapp_number: item.whatsapp_number,
            address_1: item.address_1,
          }))

          setMember(tempMember)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const getSales = async () => {
      try {
        const response = await axios.get(`${apiUrl}/sales?take=0&store_id=${staffStoreId}`, {
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
            label: item.id,
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

    fetchOrderData()
    getMember()
    getSales()
  }, [])

  // Order Form Handler
  const orderFormHandler = (e: any) => {
    setOrderForm({
      ...orderForm,
      [e.target.name]: e.target.value,
    })
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

  // Checkbox Handler
  const handleCheckboxChange = (isChecked: boolean) => {
    setIsOverdistance(isChecked ? 1 : 0)
  }

  // Overdistance
  useEffect(() => {
    setOrderForm({
      ...orderForm,
      is_overdistance: isOverdistance,
    })
  }, [isOverdistance])

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

  // Selected Payment Type && Clear Order Detail if user changed the payment type
  useEffect(() => {
    setOrderForm({
      ...orderForm,
      payment_type: paymentTypeValue[0] === 'gratis' ? 'gratis' : paymentTypeValue[1],
      // order_details: [
      //   {
      //     id: null,
      //     item_id: null,
      //     item_code: null,
      //     item_name: null,
      //     quantity: 1,
      //     unit_price: null,
      //     total: null,
      //     item_notes: null,
      //   },
      // ],
    })
  }, [paymentTypeValue])

  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatusName = 'BOOKED'
    const desiredStatus = statusData.find((status: any) => status?.category === desiredStatusName)
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
      item_code: '',
      item_name: '',
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
  const handleUpdateOrder = async () => {
    setIsLoading(true)
    const url = `${apiUrl}/orders/${params.id}`
    const formData = new FormData()

    let errorBags = []
    const requiredOrderFields = [
      {key: 'member_id', fieldName: 'Nomor Member'},
      {key: 'sales_id', fieldName: 'Sales Information'},
      {key: 'store_id', fieldName: 'Store'},
      {key: 'project_status_id', fieldName: 'Status Proyek'},
      {key: 'project_address', fieldName: 'Alamat Proyek'},
      {key: 'project_number', fieldName: 'Nomor Proyek'},
      {key: 'request_survey', fieldName: 'Request Survey'},
      {key: 'payment_type', fieldName: 'Payment Type'},
      {key: 'receipt_number', fieldName: 'Nomor Receipt'},
      {key: 'order_details', fieldName: 'Order Details'},
      {key: 'is_overdistance', fieldName: 'Overdistance'},
      {key: 'additional_fee', fieldName: 'Additional Fee'},
      {key: 'notes', fieldName: 'Catatan'},
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
                  if (item.id) {
                    formData.append(`order_details[${index}][id]`, item.id)
                  }

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
          } else if (key === 'notes') {
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
      setIsLoading(false)

      Swal.fire({
        title: 'Warning',
        text: errorBags[0].message,
        icon: 'warning',
      })

      return false
    }

    if (receiptFiles?.length) {
      receiptFiles.forEach((item) => {
        if (item instanceof Blob) {
          formData.append(`order_files`, item, item.name)
        }
      })
    }

    if (receiptFiles?.length) {
      receiptFiles.forEach((item: any, index: number) => {
        if (item.id) {
          formData.append(`existing_order_files[${index}][order_file_id]`, item.id)
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

        if (response.data.status === 200 || response.data.status === 201) {
          Swal.fire({
            title: 'Success',
            text: 'Success Update Order',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate(`/order/printout-order-dipesan/${orderId}`)
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
          text: error.response.data.message,
          icon: 'error',
        })
      })
  }

  // Reprint Order
  const handleReprintOrder = async () => {
    await axios
      .request({
        url: `${apiUrl}/orders/${params.id}/counter`,
        method: 'post',
        maxBodyLength: Infinity,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        navigate(`/order/printout-order-dipesan/${params.id}`)
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

  return (
    <section id='update-order'>
      <Spin
        spinning={isLoadingPage}
        size='large'
        tip='Loading..'
        indicator={<LoadingOutlined style={{fontSize: 24}} spin rev />}
      >
        <Card className='mb-5'>
          <Card.Body>
            <div className='form-wrapper'>
              <div className='form-costumer'>
                <Row className='form-header'>
                  <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='mb-3'>
                    <Form.Group>
                      <Form.Label className='title'>
                        Nama Toko
                        <span className='fs-5 ms-2 pt-2 pb-2 fw-semibold bg-secondary'>
                          {staffStoreName}
                        </span>
                      </Form.Label>
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
                                paymentTypeValue[0] === 'berbayar' &&
                                paymentTypeValue[1] === 'survey'
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
                                setPaymentTypeValue([
                                  paymentTypeValue[0],
                                  'pemasangan_tanpa_survey',
                                ])
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
                        isDisabled={true}
                        options={member}
                        value={{
                          value: selectedMember?.value ?? null,
                          label: selectedMember?.label ?? '',
                          full_name: selectedMember?.full_name ?? '',
                          email: selectedMember?.email ?? '',
                          phone_number: selectedMember?.phone_number ?? '',
                          whatsapp_number: selectedMember?.whatsapp_number ?? '',
                          address_1: selectedMember?.address_1 ?? '',
                        }}
                        onChange={(newValue) => setSelectedMember(newValue)}
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
                            disabled
                            label='Bukan Whatsapp'
                            name='group1'
                            value='1'
                            type='checkbox'
                            onChange={() => setIsWhatsapp(!isWhatsapp)}
                          />
                        </div>
                      </div>

                      <InputGroup className='mb-5'>
                        <Form.Control
                          disabled
                          name='project_number'
                          value={orderForm.project_number}
                          onChange={(event) => orderFormHandler(event)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className='input-order'>
                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group className='mb-5'>
                      <Form.Label className='title'>Nama Customer</Form.Label>
                      <Form.Control type='text' disabled value={selectedMember?.full_name || ''} />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group className='mb-5'>
                      <Form.Label className='title'>Email</Form.Label>
                      <Form.Control type='text' disabled value={selectedMember?.email || ''} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className='alamat-order'>
                  <Col>
                    <Form.Group className='mb-5'>
                      <div className='d-flex gap-3'>
                        <Form.Label className='title'>Alamat</Form.Label>

                        <Form.Check
                          inline
                          label='Lebih dari 10 KM dengan maksimal jarak 40 KM'
                          type='checkbox'
                          checked={isOverdistance === 1}
                          onChange={(e) => handleCheckboxChange(e.target.checked)}
                        />
                      </div>

                      <Form.Control
                        as='textarea'
                        name='project_address mb-2'
                        className='field-alamat'
                        value={orderForm.project_address}
                        onChange={(event) => orderFormHandler(event)}
                      />

                      <Form.Label className='fs-7 fw-normal'>
                        <span className='text-danger fw-bold'>Note :</span>
                        <br></br>
                        Jika member baru, maka semua field wajib di isi, kecuali field{' '}
                        <span className='fw-bolder'>No Member</span>
                        <br></br>
                        Segala informasi akan di update melalui email
                        <br></br>
                        Untuk melihat history pengerjaan dapat melalui Aplikasi Mitra10
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className='form-sales'>
                <div className='form-header'>
                  <h1 className='text-end fw-bold'>SALES INFORMATION</h1>
                </div>
                <Form.Group as={Row} className='mb-5'>
                  <Form.Label column sm='4'>
                    Sales ID :
                  </Form.Label>

                  <Col sm='8'>
                    <Form.Control
                      type='number'
                      disabled
                      value={
                        userRole === 'SALES' ? salesId : selectedSales?.value?.toString() || ''
                      }
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-5'>
                  <Form.Label column sm='4'>
                    Nama Sales :
                  </Form.Label>

                  <Col sm='8'>
                    <Form.Control
                      type='text'
                      disabled
                      value={userRole === 'SALES' ? username : selectedSales?.full_name || ''}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-5'>
                  <Form.Label className='title' column xxl='4' xl='5' md='2'>
                    Catatan :
                  </Form.Label>

                  <Col xxl='8' xl='7' md='10'>
                    <Form.Control
                      as='textarea'
                      name='notes'
                      className='additional-notes'
                      style={{minHeight: '150px'}}
                      value={orderForm.notes}
                      onChange={(event) => {
                        orderFormHandler(event)
                      }}
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
                className='request-date order-md-2 order-sm-3'
              >
                <Form.Group>
                  <Form.Label>No Receipt</Form.Label>
                  <Form.Control
                    name='receipt_number'
                    type='text'
                    placeholder='Isi Nomor Receipt'
                    value={orderForm.receipt_number}
                    onChange={(e) => orderFormHandler(e)}
                  />
                  <Form.Text className='fs-8 text-dark'>
                    *Silakan isi no. receipt pembayaran installasi / service
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col
                xs={12}
                md={3}
                lg={3}
                xl={3}
                xxl={3}
                className='request-date order-md-1 order-sm-2 mt-3'
              >
                <Form.Group>
                  <Form.Label>Tanggal Request</Form.Label>
                  <Form.Control
                    name='request_survey'
                    type='date'
                    value={orderForm.request_survey}
                    onChange={(e) => orderFormHandler(e)}
                    min={today}
                  />

                  <Form.Text className='fs-8 text-dark-danger'>
                    *Tanggal Request{' '}
                    <span className='fw-bolder text-decoration-underline'>bukan</span> tanggal
                    pasti. Konfirmasi kunjungan dilakukan oleh Vendor
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col
                xs={12}
                md={3}
                lg={3}
                xl={3}
                xxl={3}
                className='order-status order-md-3 order-sm-1 mt-3 '
              >
                <h1 className='fs-3 fw-bold'>
                  ORDER STATUS :{' '}
                  <span className='fw-bold text-success'>{orderDetail?.status?.description}</span>
                </h1>
              </Col>

              <Col
                xs={12}
                md={3}
                lg={3}
                xl={3}
                xxl={3}
                className='button-add text-end order-md-4 order-sm-4 mt-3'
              >
                <button onClick={() => addOrderDetails()}>Tambah Order</button>
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
                            <span className='text'>Remove</span>
                            <span className='icon'>
                              <FontAwesomeIcon icon={faTrash} />
                            </span>
                          </Button>
                        </td>
                      )}

                      <td>
                        <Form.Control
                          id={`item-code-${index}`}
                          name={`item_code`}
                          plaintext
                          readOnly={
                            paymentTypeValue[1] === 'pemasangan_tanpa_survey' ? true : false
                          }
                          value={element.item_code ?? ''}
                          onChange={(e) => orderDetailsFormHandler(e, index)}
                        />
                      </td>

                      <td style={{maxWidth: '200px', minWidth: '200px'}}>
                        <Form.Control
                          id={`item-name-${index}`}
                          name={`item_name`}
                          as='textarea'
                          plaintext
                          readOnly={
                            paymentTypeValue[1] === 'pemasangan_tanpa_survey' ? true : false
                          }
                          value={element.item_name ?? ''}
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
                            as='textarea'
                            name={`item_notes`}
                            value={element.item_notes ?? ''}
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
                            value={{
                              value: orderForm.order_details[index]?.item_id ?? null,
                              label: orderForm.order_details[index]?.item?.label ?? '',
                              item_code: orderForm.order_details[index]?.item_code ?? '',
                              item_name: orderForm.order_details[index]?.item_name ?? '',
                              category_id:
                                orderForm.order_details[index]?.item?.category_id ?? null,
                              default_price:
                                orderForm.order_details[index]?.item?.default_price ?? null,
                              prices: orderForm.order_details[index]?.item?.prices ?? [],
                            }}
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
                        colSpan={orderForm.order_details.length >= 2 ? 4 : 3}
                        className='text-end fw-bolder'
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
                        Rp. {Number(orderForm.additional_fee).toLocaleString('id')}
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

              <Col xs={12} md={12} lg={12} xl={4} xxl={4}></Col>
              <Col xs={12} md={12} lg={12} xl={4} xxl={4}></Col>
            </Row>

            <div className='button-submit d-flex justify-content-center align-items-center'>
              {orderDetail?.print_counter >= 1 && (
                <Button type='submit' onClick={handleReprintOrder} variant='warning'>
                  Reprint Order
                </Button>
              )}

              <Button
                type='submit'
                disabled={isLoading}
                onClick={handleUpdateOrder}
                variant='dark-primary'
              >
                {isLoading ? ' Submitting Order...' : 'Update Order & Print'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Spin>
    </section>
  )
}

export {UpdateOrderStoreCS}
