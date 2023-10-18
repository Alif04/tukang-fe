import React, {FC, useEffect, useState, ChangeEvent} from 'react'
import axios from 'axios'
import {useNavigate, useParams} from 'react-router-dom'

import './UpdateOrder.css'

import Swal from 'sweetalert2'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import {Row, Col, Form, InputGroup, Table, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface StoreItem {
  value: string
  label: string
  address: string
  city_id: BigInteger
  zip_code: string
}

interface Member {
  value: any
  label: string
  email: any
  phone_number: any
  whatsapp_number: any
  address_1: any
}

interface Sales {
  value: any
  label: string
}

interface Vendor {
  value: any
  label: string
}

interface ItemDescription {
  value: string
  label: string
  category: string
  prices: Array<ItemPrice>
}

interface ItemPrice {
  id: BigInteger
  item_id: BigInteger
  unit_id: BigInteger
  store_id: BigInteger
  periodic_start: string
  periodic_end: string
  nominal_discount: string
  price: string
}

const UpdateOrderHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()

  // If User Login is Admin Sales
  const userId = localStorage.getItem('user_id') as any
  const username = localStorage.getItem('username') as string
  const userRole = localStorage.getItem('userRole')

  const [indexForm, setIndexForm] = useState<number>(0)

  // Order Information Detail
  const [orderDetail, setOrderDetail] = useState<any>()

  // Store
  const [store, setStore] = useState<StoreItem[]>([])
  const [storeId, setStoreId] = useState<string>('')
  const [storeName, setStoreName] = useState<string>('')

  // Member
  const [memberId, setMemberId] = useState<any>()
  const [member, setMember] = useState<Member[]>([])
  const [memberName, setMemberName] = useState<string>('')
  const [memberPhoneNumber, setMemberPhoneNumber] = useState<any>()
  const [memberEmail, setMemberEmail] = useState<any>()
  const [memberAddress, setMemberAddress] = useState<any>()

  const [isWhatsapp, setIsWhatsapp] = useState<boolean>(false)

  // Sales
  const [salesId, setSalesId] = useState<any>()
  const [sales, setSales] = useState<Sales[]>([])
  const [salesName, setSalesName] = useState<string>('')

  // Vendor
  const [vendorId, setVendorId] = useState<any>()
  const [vendor, setVendor] = useState<Vendor[]>([])
  const [vendorName, setVendorName] = useState<string>('')

  const [type, setType] = useState<string>('')
  const [paymentType, setPaymentType] = useState<string>('')

  const [projectStatusId, setProjectStatusId] = useState<any>()
  console.log(projectStatusId)

  const [requestDate, setRequestDate] = useState<string>('')

  const [receiptNumber, setReceiptNumber] = useState<any>()

  const [receiptFile, setReceiptFile] = useState<FileList | []>()

  const [image, setImage] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  // Order Table
  const [item, setItem] = useState<ItemDescription[]>([])
  const [total, setTotal] = useState<number>(0)
  const [grandTotal, setGrandTotal] = useState<number>(0)
  const [grandTotalComission, setGrandTotalComission] = useState<number>(0)
  const [totalEstimateWorkDays, setTotalEstimateWorkDays] = useState<number>(10)

  // Fetch API Data
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
            setOrderDetail(data)

            if (data?.store?.id && data?.store?.store_name) {
              setStoreId(data.store.id)
              setStoreName(data.store.store_name)
            }

            if (data?.payment_type) {
              setPaymentType(data.payment_type)
            }

            if (data?.created_at) {
              setRequestDate(new Date(data.created_at).toISOString().split('T')[0])
            }

            if (data?.project_number) {
              setMemberPhoneNumber(data.project_number)
            }

            if (data?.receipt_path) {
              setImage({
                blob: '',
                fileName: data.receipt_path,
              })
            }

            if (data?.receipt_number) {
              setReceiptNumber(data.receipt_number)
            }

            if (
              data?.members?.id &&
              data?.members?.full_name &&
              data?.members.email &&
              data?.members.whatsapp_number &&
              data?.members.address_1
            ) {
              setMemberId(data.members.id)
              setMemberName(data.members.full_name)
              setMemberEmail(data.members.email)
              setMemberPhoneNumber(data.members.whatsapp_number)
              setMemberAddress(data.members.address_1)
            }

            if (data?.sales?.id && data?.sales?.full_name) {
              setSalesId(data.sales.id)
              setSalesName(data.sales.full_name)
            }

            if (data?.order_details) {
              const initialOrderDetailValues = data.order_details.map((item: any) => ({
                id: item.id,
                item_id: item.item_id,
                order_status_id: item.order_status_id,
                unit: item.unit,
                category_name: item.category_name,
                unit_price: parseInt(item.unit_price),
                quote_price: item.quote_price,
                quantity: item.quantity,
                total: item.total,
                survey_price: item.survey_price,
                comission: item.comission,
              }))

              setOrderDetailValues(initialOrderDetailValues)
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

    const getCostumer = async () => {
      try {
        const response = await axios.get(`${apiUrl}/member/data`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        if (Array.isArray(response.data.data.member)) {
          const tempMember = response.data.data.member.map((item: any) => ({
            value: item.id,
            label: item.full_name,
            email: item.email,
            whatsapp_number: item.whatsapp_number,
            address_1: item.address_1,
          }))

          const creatableOption = {value: 'memberOption'}
          tempMember.push(creatableOption)

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
        const response = await axios.get(`${apiUrl}/sales/get`, {
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
          }))

          const creatableOptionSales = {value: 'salesOption'}
          tempSales.push(creatableOptionSales)

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
        const response = await axios.get(`${apiUrl}/vendor/get`, {
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

          const creatableOptionVendor = {value: 'vendorOption'}
          tempVendor.push(creatableOptionVendor)

          setVendor(tempVendor)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const getItem = async () => {
      try {
        const response = await axios.get(`${apiUrl}/items?take=0`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempItem = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.item_name,
            category: item.category_name,
            prices: item.prices.map((priceItem: any) => ({
              id: priceItem.id,
              item_id: priceItem.item_id,
              unit_id: priceItem.unit_id,
              store_id: priceItem.store_id,
              periodic_start: priceItem.periodic_start,
              periodic_end: priceItem.periodic_end,
              nominal_discount: priceItem.nominal_discount,
              price: priceItem.price,
            })),
          }))

          setItem(tempItem)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchOrderData()
    getStore()
    getCostumer()
    getSales()
    getVendor()
    getItem()
  }, [])

  // Order Status
  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatusName = 'SURVEYREQ'
    const desiredStatus = statusData.find((status: any) => status.category === desiredStatusName)
    const statusId = desiredStatus.value

    setProjectStatusId(statusId)
  }, [projectStatusId])

  // Select Store
  const handleChangeSelectStore = (element: any) => {
    const updatedStoreId = element.value
    const updatedStoreName = element.label

    setStoreId(updatedStoreId)
    setStoreName(updatedStoreName)
  }

  // Select Date Request
  const today = new Date().toISOString().split('T')[0]

  const handleChangeRequestDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedRequestDate = event.target.value
    setRequestDate(updatedRequestDate)
  }

  // Input No Receipt
  const handleChangeNoReceipt = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedNoReceipt = event.target.value
    setReceiptNumber(updatedNoReceipt)
  }

  // Payment Type ( Radio Button )
  const handlePaymentOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOptionPayment = event.target.value
    setPaymentType(selectedOptionPayment)
  }

  const handleTypeOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOptionType = event.target.value

    if (selectedOptionType === 'gratis') {
      setPaymentType('gratis')
    } else if (selectedOptionType === 'berbayar') {
      setPaymentType('survey')
    }

    setType(selectedOptionType)
  }

  // Upload File
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files[0]) {
      setReceiptFile(files)

      setImage({
        blob: URL.createObjectURL(files[0]),
        fileName: files[0].name,
      })
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = () => {
    setImage({
      blob: '',
      fileName: '',
    })
    setReceiptFile([])
  }

  // Member Information
  const [memberInfo, setMemberInfo] = useState<Member | null>(null)

  // Sales Information
  const [salesInfo, setSalesInfo] = useState<Sales | null>(null)

  // Vendor Information
  const [vendorInfo, setVendorInfo] = useState<Vendor | null>(null)

  // Change Select Member
  const handleChangeSelectMember = (element: Member | null) => {
    if (element && element.value == 'memberOption') {
      setMemberInfo(null)
      setMemberId(null)
      setMemberName('')
      setMemberEmail('')
      setMemberPhoneNumber('')
      setMemberAddress('')
    } else {
      const newMemberInfo: Member = {
        value: element?.value || 0,
        label: element?.label || '',
        email: element?.email || '',
        phone_number: element?.phone_number || '',
        whatsapp_number: element?.whatsapp_number || '',
        address_1: element?.address_1 || '',
      }

      setMemberInfo(newMemberInfo)
      setMemberId(newMemberInfo.value)
      setMemberName(newMemberInfo.label)
      setMemberEmail(newMemberInfo.email)
      setMemberPhoneNumber(newMemberInfo.whatsapp_number)
      setMemberAddress(newMemberInfo.address_1)
    }
  }

  // Change Select Member Id
  const handleChangeMemberId = (element: any) => {
    const newMemberId = element.target.value
    setMemberInfo((prevMemberInfo) => ({
      ...(prevMemberInfo as Member),
      id: newMemberId,
    }))

    setMemberId(newMemberId)
  }

  // Change Select Member Email Address
  const handleChangeMemberEmailAddress = (element: any) => {
    const newMemberEmail = element.target.value
    setMemberInfo((prevMemberInfo) => ({
      ...(prevMemberInfo as Member),
      email: newMemberEmail,
    }))

    setMemberEmail(newMemberEmail)
  }

  // Change Select Member Phone Number
  const handleChangeRadio = (element: ChangeEvent<HTMLInputElement>) => {
    setIsWhatsapp(!isWhatsapp)

    if (isWhatsapp) {
      setMemberPhoneNumber(memberInfo?.whatsapp_number)
    } else {
      setMemberPhoneNumber(memberInfo?.phone_number)
    }
  }

  const handleChangeMemberPhoneNumber = (element: any) => {
    const newMemberPhoneNumber = element.target.value
    setMemberInfo((prevMemberInfo) => ({
      ...(prevMemberInfo as Member),
      whatsapp_number: newMemberPhoneNumber,
    }))

    setMemberPhoneNumber(newMemberPhoneNumber)
  }

  // Change Select Member Address
  const handleChangeMemberAddress = (element: any) => {
    const newMemberAddress = element.target.value
    setMemberInfo((prevMemberInfo) => ({
      ...(prevMemberInfo as Member),
      address_1: newMemberAddress,
    }))

    setMemberAddress(newMemberAddress)
  }

  // Change Select Sales
  const handleChangeSelectSales = (element: Sales | null) => {
    if (element && element.value === 'salesOption') {
      setSalesInfo(null)
      setSalesId(null)
      setSalesName('')
    } else {
      const newSalesInfo: Sales = {
        value: element?.value || 0,
        label: element?.label || '',
      }

      setSalesInfo(newSalesInfo)
      setSalesId(newSalesInfo.value)
      setSalesName(newSalesInfo.label)
    }
  }

  // Change Select Sales Id
  const handleChangeSalesId = (element: any) => {
    const newSalesId = element.target.value

    setSalesInfo((prevSalesInfo) => ({
      ...(prevSalesInfo as Sales),
      value: newSalesId,
    }))

    setSalesId(newSalesId)
  }

  // Change Select Vendor
  const handleChangeSelectVendor = (element: Vendor | null) => {
    if (element && element.value == 'vendorOption') {
      setVendorInfo(null)
      setVendorId(null)
      setVendorName('')
    } else {
      const newVendorInfo: Vendor = {
        value: element?.value || 0,
        label: element?.label || '',
      }

      setVendorInfo(newVendorInfo)
      setVendorId(newVendorInfo.value)
      setVendorName(newVendorInfo.label)
    }
  }

  // Handle Change Vendor Name
  //   const handleChangeVendorId = (element: any) => {
  //     const newVendorId = element.target.value

  //     setVendorInfo((prevVendorInfo) => ({
  //       ...(prevVendorInfo as Vendor),
  //       value: newVendorId,
  //     }))

  //     setVendorId(newVendorId)
  //   }

  // Add New Order

  // Order Details
  const [orderDetailValues, setOrderDetailValues] = useState([
    {
      id: '',
      item_id: '',
      order_status_id: 6,
      unit: '',
      category_name: '',
      unit_price: 0,
      quote_price: 0,
      quantity: 0,
      total: 0,
      survey_price: 0,
      comission: 0,
    },
  ])

  let handleAddForm = () => {
    const newForm = {
      id: '',
      item_id: '',
      order_status_id: 6,
      unit: '',
      category_name: '',
      unit_price: 0,
      quote_price: 0,
      quantity: 0,
      total: 0,
      survey_price: 0,
      comission: 0,
    }

    setIndexForm(indexForm + 1)
    setOrderDetailValues([...orderDetailValues, newForm])
  }

  let handleRemoveForm = (index: any) => {
    const newOrderDetailValues = [...orderDetailValues]
    newOrderDetailValues.splice(index, 1)
    setOrderDetailValues(newOrderDetailValues)
    setIndexForm(indexForm - 1)

    let updatedOrderDetailValues = newOrderDetailValues.map((value) => {
      return {
        ...value,
        id: '',
      }
    })

    setOrderDetailValues(updatedOrderDetailValues)
  }

  // Change Select Item
  const handleChangeSelectItem = (index: any, element: any) => {
    if (!element) return

    const {label, value: selectedItemId, category: selectedCategoryName, prices} = element

    const newOrderDetailValues = [...orderDetailValues]
    newOrderDetailValues[index] = {
      ...newOrderDetailValues[index],
      item_id: selectedItemId,
      unit: label,
      category_name: selectedCategoryName,
      unit_price: prices[0].price,
      total: prices[0].price,
    }

    setOrderDetailValues(newOrderDetailValues)
  }

  // Change Quantity Value
  let handleQuantityChange = (index: any, value: any) => {
    const updatedOrderDetailValues = [...orderDetailValues]
    const selectedUnitPrice = updatedOrderDetailValues[index].unit_price

    updatedOrderDetailValues[index] = {
      ...updatedOrderDetailValues[index],
      quantity: value,
      total: value * selectedUnitPrice,
    }

    setOrderDetailValues(updatedOrderDetailValues)
  }

  // Calculate Order Total Amount
  const calculatedOrderTotal = () => {
    return orderDetailValues.reduce((accumulator, item) => {
      const quantity = item.quantity || 1
      let hargaJasa = 0

      if (paymentType === 'gratis') {
        hargaJasa = 0
      } else {
        hargaJasa = item.unit_price
      }

      const calculatedTotal = quantity * hargaJasa
      return accumulator + calculatedTotal
    }, 0)
  }

  // Calculate Grand Total Order Amount

  const calculatedGrandTotalOrder = () => {
    return orderDetailValues.reduce(() => {
      const totalOrderAmount = total
      let biayaSurvey = 0

      if (paymentType === 'gratis' || paymentType === 'pemasangan_tanpa_survey') {
        biayaSurvey = 0
      } else if (paymentType === 'survey') {
        biayaSurvey = 99000
      } else {
        biayaSurvey = 0
      }

      const calculatedGrandTotal = totalOrderAmount + biayaSurvey
      return calculatedGrandTotal
    }, 0)
  }

  useEffect(() => {
    const calculatedTotal = calculatedOrderTotal()
    const calculatedGrandTotal = calculatedGrandTotalOrder()

    setTotal(calculatedTotal)
    setGrandTotal(calculatedGrandTotal)
  }, [orderDetailValues, total, paymentType, type])

  // Update Order Validation
  const UpdateOrderValidation = () => {
    let valid = true

    if (!storeId) {
      Swal.fire({
        title: 'Error',
        text: 'Please select store',
        icon: 'error',
      })
      valid = false
    } else if (!paymentType) {
      Swal.fire({
        title: 'Error',
        text: 'Please select payment type',
        icon: 'error',
      })
      valid = false
    } else if (!memberId) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill member id form',
        icon: 'error',
      })
      valid = false
    } else if (!memberName) {
      Swal.fire({
        title: 'Error',
        text: 'Please select or create member name form',
        icon: 'error',
      })
      valid = false
    } else if (!memberPhoneNumber) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill phone number field',
        icon: 'error',
      })
      valid = false
    } else if (!memberEmail) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill member email form',
        icon: 'error',
      })
      valid = false
    } else if (!memberAddress) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill member address form',
        icon: 'error',
      })
      valid = false
    } else if (!salesId) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill sales id form',
        icon: 'error',
      })
      valid = false
    } else if (!salesName) {
      Swal.fire({
        title: 'Error',
        text: 'Please select or create sales name form',
        icon: 'error',
      })
      valid = false
    } else if (!requestDate) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill request date form',
        icon: 'error',
      })
      valid = false
    } else if (!receiptNumber) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill receipt number form',
        icon: 'error',
      })
      valid = false
    } else if (!vendorName) {
      Swal.fire({
        title: 'Error',
        text: 'Please select or create vendor name form',
        icon: 'error',
      })
      valid = false
    }

    orderDetailValues.map((item) => {
      if (item.unit === null || item.unit === '') {
        Swal.fire({
          title: 'Error',
          text: 'Please fill select item name form',
          icon: 'error',
        })
        valid = false
      } else if (item.quantity == 0) {
        Swal.fire({
          title: 'Error',
          text: 'Please fill quantity  form',
          icon: 'error',
        })
        valid = false
      }
    })
    return valid
  }

  // Submit Update Order

  const handleSubmitUpdateOrder = async () => {
    if (UpdateOrderValidation()) {
      const formData = new FormData()

      if (receiptFile?.length) {
        formData.append('receipt_file', receiptFile[0])
        formData.append('receipt_name', receiptFile[0].name)
      }

      formData.append('member_id', memberId)
      formData.append('sales_id', salesId)
      formData.append('vendor_id', vendorId)
      formData.append('project_status_id', projectStatusId)
      formData.append('project_address', memberAddress)
      formData.append('receipt_number', receiptNumber.toString())
      formData.append('grand_total', grandTotal.toString())
      formData.append('grand_total_comission', grandTotalComission.toString())
      formData.append('total_estimate_workdays', totalEstimateWorkDays.toString())
      formData.append('store_id', storeId)
      formData.append('payment_type', paymentType)

      orderDetailValues.forEach((order, index) => {
        formData.append(`order_details[${index}][id]`, String(order.id))
        formData.append(`order_details[${index}][item_id]`, String(order.item_id))
        formData.append(`order_details[${index}][order_status_id]`, String(order.order_status_id))
        formData.append(`order_details[${index}][unit]`, order.unit)
        formData.append(`order_details[${index}][unit_price]`, String(order.unit_price))
        formData.append(`order_details[${index}][quote_price]`, String(order.quote_price))
        formData.append(`order_details[${index}][quantity]`, String(order.quantity))
        formData.append(`order_details[${index}][total]`, String(order.total))
        formData.append(`order_details[${index}][survey_price]`, String(order.survey_price))
        formData.append(`order_details[${index}][comission]`, String(order.comission))
      })

      const response = await axios
        .post(`${apiUrl}/orders/${params.id}`, formData, {
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
              text: response.data.message,
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              navigate(`/order/printout-order/${orderId}`)
            })
          } else {
            Swal.fire({
              title: 'Error',
              text: response.data.message,
              icon: 'error',
            })
          }
          navigate('/order/view-order')
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

  return (
    <section id='update-order'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <div className='form-costumer'>
              <Row className='form-header'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='mb-3'>
                  <Form.Group as={Row}>
                    <Form.Label column sm='4'>
                      Nama Toko
                    </Form.Label>

                    <Col sm='8'>
                      <Select
                        name='store_id'
                        className='form-control p-0'
                        classNamePrefix='select'
                        placeholder='Pilih Toko'
                        isSearchable={true}
                        options={store}
                        value={{
                          value: storeId,
                          label: storeName,
                        }}
                        onChange={(element) => handleChangeSelectStore(element)}
                      />
                    </Col>
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='mb-3'>
                  <div className='d-flex'>
                    <Form.Label className='payment-type'>Payment Type :</Form.Label>

                    <div className='form-check-request'>
                      <Form.Check
                        inline
                        label='Gratis'
                        id='gratis'
                        name='type'
                        type='radio'
                        value='gratis'
                        checked={paymentType === 'gratis'}
                        onChange={handleTypeOptionChange}
                      />

                      <Form.Check
                        inline
                        label='Survey'
                        id='survey'
                        name='paymentType'
                        type='radio'
                        value='survey'
                        checked={paymentType === 'survey'}
                        disabled={paymentType === 'gratis'}
                        onChange={handlePaymentOptionChange}
                      />

                      <Form.Check
                        inline
                        label='Berbayar'
                        id='berbayar'
                        name='type'
                        type='radio'
                        value='berbayar'
                        checked={
                          type === 'berbayar' ||
                          paymentType === 'pemasangan_tanpa_survey' ||
                          paymentType === 'survey'
                        }
                        onChange={handleTypeOptionChange}
                      />

                      <Form.Check
                        inline
                        label='Pemasangan Tanpa Survey'
                        id='pemasangan_tanpa_survey'
                        name='paymentType'
                        type='radio'
                        value='pemasangan_tanpa_survey'
                        checked={
                          paymentType === 'gratis' || paymentType === 'pemasangan_tanpa_survey'
                        }
                        disabled={paymentType === 'gratis'}
                        onChange={handlePaymentOptionChange}
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className='input-order'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>No Member</Form.Label>
                    <Form.Control
                      type='number'
                      value={memberId || orderDetail?.members?.id || ''}
                      onChange={(element) => handleChangeMemberId(element)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <div className='d-flex justify-content-between'>
                      <Form.Label>WA / Phone Number</Form.Label>

                      <div className='form-check-request'>
                        <Form.Check
                          inline
                          label='Bukan Whatsapp'
                          name='group1'
                          value='1'
                          type='checkbox'
                          onChange={handleChangeRadio}
                        />
                      </div>
                    </div>

                    <InputGroup className='mb-5'>
                      <InputGroup.Text>+ 62</InputGroup.Text>
                      <Form.Control
                        type='number'
                        value={memberPhoneNumber}
                        onChange={(element) => handleChangeMemberPhoneNumber(element)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Row className='input-order'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Nama Customer</Form.Label>
                    <CreatableSelect
                      name='member'
                      id='member'
                      className='form-control p-0 form-item-name'
                      classNamePrefix='select'
                      placeholder='Pilih/Ketik Nama Member'
                      isSearchable={true}
                      options={member}
                      value={{
                        value: memberId,
                        label: memberName,
                        email: memberEmail,
                        phone_number: memberPhoneNumber,
                        whatsapp_number: memberPhoneNumber,
                        address_1: memberAddress,
                      }}
                      onChange={(element) => handleChangeSelectMember(element)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type='text'
                      value={memberEmail}
                      onChange={(element) => handleChangeMemberEmailAddress(element)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className='alamat-order'>
                <Col>
                  <Form.Group className='mb-5'>
                    <Form.Label>Alamat</Form.Label>
                    <Form.Control
                      as='textarea'
                      className='field-alamat'
                      value={memberAddress}
                      onChange={(element) => handleChangeMemberAddress(element)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className='form-sales'>
              <div className='form-header'>
                <h1 className='text-end fw-bold'>SALES INFORMATION</h1>
              </div>

              {userRole === 'SALES' ? (
                <>
                  <Form.Group as={Row} className='mb-5'>
                    <Form.Label column sm='4'>
                      Sales ID :
                    </Form.Label>

                    <Col sm='8'>
                      <Form.Control type='number' readOnly value={userId} />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5'>
                    <Form.Label column sm='4'>
                      Nama Sales :
                    </Form.Label>

                    <Col sm='8'>
                      <Form.Control type='text' readOnly value={username} />
                    </Col>
                  </Form.Group>
                </>
              ) : (
                <>
                  <Form.Group as={Row} className='mb-5'>
                    <Form.Label column sm='4'>
                      Sales ID :
                    </Form.Label>

                    <Col sm='8'>
                      <Form.Control
                        type='text'
                        value={salesId}
                        onChange={(element) => handleChangeSalesId(element)}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5'>
                    <Form.Label column sm='4'>
                      Nama Sales :
                    </Form.Label>

                    <Col sm='8'>
                      <CreatableSelect
                        name='sales'
                        id='sales'
                        className='form-control p-0 form-item-name'
                        classNamePrefix='select'
                        placeholder='Pilih/Ketik Nama Sales'
                        isSearchable={true}
                        options={sales}
                        value={{
                          value: salesId,
                          label: salesName,
                        }}
                        onChange={(element) => handleChangeSelectSales(element)}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5'>
                    <Form.Label column sm='4'>
                      No Receipt
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        name='no-receipt'
                        type='number'
                        value={receiptNumber}
                        onChange={handleChangeNoReceipt}
                      />
                    </Col>
                  </Form.Group>
                </>
              )}
            </div>
          </div>

          <Row className='table-order-header d-flex align-items-center mb-5'>
            <Col xs={12} md={3} lg={3} xl={3} xxl={3} className='request-date order-2 order-md-1'>
              <Form.Group>
                <Form.Label>Nama Vendor :</Form.Label>

                <CreatableSelect
                  name='vendor'
                  id='vendor'
                  className='form-control p-0 form-item-name'
                  classNamePrefix='select'
                  placeholder='Pilih/Ketik Nama Vendor'
                  isSearchable={true}
                  options={vendor}
                  value={{
                    value: vendorId,
                    label: vendorName,
                  }}
                  onChange={(element) => handleChangeSelectVendor(element)}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={3} lg={3} xl={3} xxl={3}>
              <Form.Group>
                <Form.Label>Tanggal Request</Form.Label>
                <Form.Control
                  name='request-date'
                  type='date'
                  value={requestDate}
                  onChange={handleChangeRequestDate}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={3} lg={3} xl={3} xxl={3} className='order-status order-1 order-md-2'>
              <h1 className='fs-3 fw-bold'>
                ORDER STATUS : {''}
                <span className='fw-bold text-success'>{orderDetail?.status.description}</span>
              </h1>
            </Col>

            <Col
              xs={12}
              md={3}
              lg={3}
              xl={3}
              xxl={3}
              className='button-add text-end order-3 order-md-3'
            >
              <button onClick={() => handleAddForm()}>Tambah Order</button>
            </Col>
          </Row>

          <div className='table-order-content'>
            <Table hover responsive='md'>
              <thead className='table-order-head'>
                <tr>
                  <th>Action</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Nama Pemasangan</th>
                  <th>QTY Pemasangan</th>
                  <th>Harga Item</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {orderDetailValues.map((element, index) => (
                  <tr key={element.id}>
                    <td>
                      <Button variant='danger' onClick={() => handleRemoveForm(index)}>
                        Remove
                      </Button>
                    </td>

                    <td>
                      <Form.Control
                        readOnly
                        plaintext
                        value={orderDetailValues[index]?.item_id || ''}
                      />
                    </td>

                    <td>
                      <Select
                        name={`item-${index}`}
                        id={`item${index}`}
                        className='form-control p-0 form-item-name'
                        classNamePrefix='select'
                        placeholder='Pilih/Ketik Nama Item'
                        isSearchable={true}
                        options={item}
                        value={{
                          value: orderDetailValues[index]?.item_id,
                          label: orderDetailValues[index]?.unit,
                        }}
                        onChange={(element) => handleChangeSelectItem(index, element)}
                      />
                    </td>

                    <td>
                      <Form.Control
                        readOnly
                        plaintext
                        value={orderDetailValues[index]?.category_name || ''}
                      />
                    </td>

                    <td>
                      <Form.Control
                        value={element.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
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

                    <td>{`Rp. ${
                      orderDetailValues[index]?.total
                        ? orderDetailValues[index]?.total.toLocaleString('id')
                        : 0
                    }`}</td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={6} className='text-end fw-bolder'>
                    Biaya Survey
                  </td>
                  <td className=' fw-bolder'>
                    {(() => {
                      if (paymentType === 'gratis' || paymentType === 'pemasangan_tanpa_survey') {
                        return `Rp. 0`
                      } else if (paymentType === 'survey') {
                        return `Rp. 99.000`
                      } else {
                        return `Rp. 0`
                      }
                    })()}
                  </td>
                </tr>

                <tr>
                  <td colSpan={6} className='text-end fw-bolder'>
                    Grand Total
                  </td>
                  <td className=' fw-bolder'>
                    {`Rp. ${
                      grandTotal
                        ? grandTotal.toLocaleString('id')
                        : parseInt(orderDetail?.grand_total).toLocaleString('id')
                    }`}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <Form.Group controlId='formFile'>
                <Form.Label>Upload Receipt</Form.Label>
                <Form className='form-input-image' onClick={handleImageClick}>
                  <Form.Control
                    type='file'
                    accept='image/*'
                    className='input-field-image'
                    hidden
                    onChange={handleFileChange}
                  />

                  {image ? (
                    <img
                      src={image.blob ? image.blob : `${apiUrl}/public/receipt/${image.fileName}`}
                      alt={image.fileName}
                      className='image-preview'
                    />
                  ) : (
                    <div className='input-image-text'>
                      <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                      <p>Add File</p>
                    </div>
                  )}
                </Form>

                <div className='uploaded-row'>
                  <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                  <span className='upload-content'>{image.fileName ? image.fileName : ''}</span>

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

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
            <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
          </Row>

          <div className='button-submit d-flex justify-content-center align-items-center'>
            {/* <Button variant='warning'>Reprint Order</Button> */}

            <Button onClick={handleSubmitUpdateOrder} variant='dark-primary'>
              Update Order & Print
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {UpdateOrderHO}
