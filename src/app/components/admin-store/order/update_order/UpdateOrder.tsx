import React, {FC, useEffect, useState} from 'react'
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
  value: BigInteger
  label: string
  address: string
  city_id: BigInteger
  zip_code: string
}

interface Member {
  value: any
  label: string
  email: any
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

interface Tukang {
  value: any
  label: string
}

interface Category {
  value: any
  label: string
}

interface ItemDescription {
  value: BigInteger
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

const UpdateOrderStore: FC = () => {
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

  // Member
  const [memberId, setMemberId] = useState<any>()
  const [member, setMember] = useState<Member[]>([])
  const [memberName, setMemberName] = useState<string>('')
  const [memberPhoneNumber, setMemberPhoneNumber] = useState<any>()
  const [memberEmail, setMemberEmail] = useState<any>()
  const [memberAddress, setMemberAddress] = useState<any>()

  // Sales
  const [salesId, setSalesId] = useState<any>()
  const [sales, setSales] = useState<Sales[]>([])
  const [salesName, setSalesName] = useState<string>('')

  // Vendor
  const [vendorId, setVendorId] = useState<any>()
  const [vendor, setVendor] = useState<Vendor[]>([])
  const [vendorName, setVendorName] = useState<string>('')

  // Tukang
  const [tukangId, setTukangId] = useState<any>()
  const [tukang, setTukang] = useState<Tukang[]>([])
  const [tukangName, setTukangName] = useState<string>('')

  // Category
  const [categoryId, setCategoryId] = useState<any>()
  const [category, setCategory] = useState<Category[]>([])
  const [categoryName, setCategoryName] = useState<string>('')

  const [projectStatusId, setProjectStatusId] = useState<number>(1)

  const [paymentType, setPaymentType] = useState<string>('')
  const [serviceType, setServiceType] = useState<string>('')

  const [requestDate, setRequestDate] = useState<string>('')
  const [receiptFile, setReceiptFile] = useState<string>('No selected file')
  const [receiptNumber, setReceiptNumber] = useState<any>()
  const [image, setImage] = useState<string | null>(null)

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
          })
      } catch (error) {
        console.error(error)
      }
    }

    const getStore = async () => {
      try {
        const response = await axios.get(`${apiUrl}/store/get`, {
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
          // console.log(tempSales)
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
          // console.log(tempVendor)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const getTukang = async () => {
      try {
        const response = await axios.get(`${apiUrl}/tukang/get`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (Array.isArray(response.data.data)) {
          const tempTukang = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.full_name,
          }))

          const creatableOptionTukang = {value: 'tukangOption'}
          tempTukang.push(creatableOptionTukang)

          setTukang(tempTukang)
          // console.log(tempTukang)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const getCategory = async () => {
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
          const tempCategory = response.data.data.map((item: any) => ({
            value: item.id,
            label: item.category_name,
          }))

          const creatableOptionCategory = {value: 'categoryOption'}
          tempCategory.push(creatableOptionCategory)

          setCategory(tempCategory)
          // console.log(tempCategory)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const getItem = async () => {
      try {
        const response = await axios.get(`${apiUrl}/items`, {
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
    getTukang()
    getCategory()
    getItem()
  }, [])

  // Select Store
  const handleChangeSelectStore = (element: any) => {
    const updatedStore = element.value
    setStoreId(updatedStore)
  }

  // Select Date Requeet
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

    if (selectedOptionPayment == 'GRATIS') {
      setServiceType('PEMASANGAN TANPA SURVEY')
    } else if (selectedOptionPayment == 'BERBAYAR') {
      setServiceType('SURVEY')
    }

    setPaymentType(selectedOptionPayment)
  }

  const handleServiceOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOptionService = event.target.value
    setServiceType(selectedOptionService)
  }

  // Upload File
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      setReceiptFile(files[0].name)
      setImage(URL.createObjectURL(files[0]))
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = () => {
    setReceiptFile('No selected file')
    setImage(null)
  }

  // Member Information
  const [memberInfo, setMemberInfo] = useState<Member | null>(null)

  // Sales Information
  const [salesInfo, setSalesInfo] = useState<Sales | null>(null)

  // Vendor Information
  const [vendorInfo, setVendorInfo] = useState<Vendor | null>(null)

  // Tukang Information
  const [tukangInfo, setTukangInfo] = useState<Tukang | null>(null)

  // Category Information
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null)

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
  const handleChangeVendorId = (element: any) => {
    const newVendorId = element.target.value

    setVendorInfo((prevVendorInfo) => ({
      ...(prevVendorInfo as Vendor),
      value: newVendorId,
    }))

    setVendorId(newVendorId)
  }

  // Change Select Tukang
  const handleChangeSelectTukang = (element: Tukang | null) => {
    if (element && element.value == 'tukangOption') {
      setTukangInfo(null)
      setTukangId(null)
      setTukangName('')
    } else {
      const newTukangInfo: Tukang = {
        value: element?.value || 0,
        label: element?.label || '',
      }

      setTukangInfo(newTukangInfo)
      setTukangId(newTukangInfo.value)
      setTukangName(newTukangInfo.label)
    }
  }

  // Handle Change Tukang Name
  const handleChangeTukangId = (element: any) => {
    const newTukangId = element.target.value

    setTukangInfo((prevTukangInfo) => ({
      ...(prevTukangInfo as Tukang),
      value: newTukangId,
    }))

    setTukangId(newTukangId)
  }

  // Change Select Category
  const handleChangeSelectCategory = (element: Category | null) => {
    if (element && element.value == 'categoryOption') {
      setCategoryInfo(null)
      setCategoryId(null)
      setCategoryName('')
    } else {
      const newCategoryInfo: Category = {
        value: element?.value || 0,
        label: element?.label || '',
      }

      setCategoryInfo(newCategoryInfo)
      setCategoryId(newCategoryInfo.value)
      setCategoryName(newCategoryInfo.label)
    }
  }

  // Handle Change Category Name
  const handleChangeCategoryId = (element: any) => {
    const newCategoryId = element.target.value

    setCategoryInfo((prevCategoryInfo) => ({
      ...(prevCategoryInfo as Category),
      value: newCategoryId,
    }))

    setCategoryName(newCategoryId)
  }

  // Add New Order

  // Order Details
  const [orderDetailValues, setOrderDetailValues] = useState([
    {
      index_id: 0,
      item_id: null,
      order_status_id: 1,
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
    const newId =
      orderDetailValues.length > 0
        ? orderDetailValues[orderDetailValues.length - 1].index_id + 1
        : 0

    const newForm = {
      index_id: newId,
      item_id: null,
      order_status_id: 1,
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

    let updatedOrderDetailValues = newOrderDetailValues.map((value, newIndex) => {
      return {
        ...value,
        index_id: newIndex,
      }
    })

    setOrderDetailValues(updatedOrderDetailValues)
  }

  // Change Select Item
  const handleChangeSelectItem = (index: any, element: any) => {
    if (!element) return

    const selectedItemId = element.value
    const selectedCategoryName = element.category
    const selectedUnitPrice = element.prices[0].price

    const newOrderDetailValues = [...orderDetailValues]
    newOrderDetailValues[index] = {
      ...newOrderDetailValues[index],
      item_id: selectedItemId,
      unit: element.label,
      category_name: selectedCategoryName,
      unit_price: selectedUnitPrice,
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
      const hargaJasa = item.unit_price || 0

      // console.log(quantity)
      // console.log(hargaJasa)

      const calculatedTotal = quantity * hargaJasa

      return accumulator + calculatedTotal
    }, 0)
  }

  // Calculate Grand Total Order Amount

  const calculatedGrandTotalOrder = () => {
    return orderDetailValues.reduce(() => {
      const totalOrderAmount = total
      let biayaSurvey = 0

      if (paymentType === 'GRATIS' && serviceType === 'PEMASANGAN TANPA SURVEY') {
        biayaSurvey = 0
      } else if (paymentType === 'BERBAYAR' && serviceType === 'PEMASANGAN TANPA SURVEY') {
        biayaSurvey = 0
      } else if (paymentType === 'BERBAYAR' && serviceType === 'SURVEY') {
        biayaSurvey = 99000
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
  }, [orderDetailValues, total, paymentType, serviceType])

  // Submit New Order

  const handleSubmitNewOrder = async () => {
    try {
      const formData = new FormData()

      formData.append('receipt_file', receiptFile)
      formData.append('member_id', memberId)
      formData.append('sales_id', salesId)
      formData.append('vendor_id', vendorId.toString())
      formData.append('tukang_id', tukangId.toString())
      formData.append('project_status_id', projectStatusId.toString())
      formData.append('category_id', categoryId.toString())
      formData.append('project_address', memberAddress)
      formData.append('receipt_number', receiptNumber.toString())
      formData.append('grand_total', grandTotal.toString())
      formData.append('grand_total_comission', grandTotalComission.toString())
      formData.append('total_estimate_workdays', totalEstimateWorkDays.toString())
      formData.append('store_id', storeId)
      formData.append('payment_type', paymentType)

      orderDetailValues.forEach((order, index) => {
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

      const response = await axios.post(`${apiUrl}/orders`, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      Swal.fire({
        title: 'Success',
        text: 'Success Create Order',
        icon: 'success',
      })

      navigate('/order/view-order')
    } catch (error) {
      console.error(error)

      Swal.fire({
        title: 'Error',
        text: 'Cant Add Order',
        icon: 'error',
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
                        onChange={(e) => handleChangeSelectStore(e)}
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
                        id='GRATIS'
                        name='paymentType'
                        type='radio'
                        value='GRATIS'
                        checked={paymentType === 'GRATIS'}
                        onChange={handlePaymentOptionChange}
                      />

                      <Form.Check
                        inline
                        label='Survey'
                        name='serviceType'
                        type='radio'
                        value='SURVEY'
                        id='SURVEY'
                        checked={serviceType === 'SURVEY'}
                        disabled={paymentType === 'GRATIS'}
                        onChange={handleServiceOptionChange}
                      />

                      <Form.Check
                        inline
                        label='Berbayar'
                        name='paymentType'
                        type='radio'
                        value='BERBAYAR'
                        checked={paymentType === 'BERBAYAR'}
                        onChange={handlePaymentOptionChange}
                      />

                      <Form.Check
                        inline
                        label='Pemasangan Tanpa Survey'
                        name='serviceType'
                        type='radio'
                        value='PEMASANGAN TANPA SURVEY'
                        id='PEMASANGAN TANPA SURVEY'
                        checked={serviceType === 'PEMASANGAN TANPA SURVEY'}
                        disabled={paymentType === 'GRATIS'}
                        onChange={handleServiceOptionChange}
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
                      value={memberId}
                      onChange={(element) => handleChangeMemberId(element)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <div className='d-flex justify-content-between'>
                      <Form.Label>WA / Phone Number</Form.Label>

                      <div className='form-check-request'>
                        <Form.Check inline label='Bukan Whatsapp' name='group1' type='checkbox' />
                      </div>
                    </div>

                    <InputGroup className='mb-5'>
                      <InputGroup.Text>+ 62</InputGroup.Text>
                      <Form.Control
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
                      onChange={(element) => handleChangeSelectMember(element)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type='text'
                      value={memberEmail || ''}
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
                      value={memberAddress || ''}
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
                        onChange={(element) => handleChangeSelectSales(element)}
                      />
                    </Col>
                  </Form.Group>
                </>
              )}

              <Form.Group as={Row} className='mb-5'>
                <Form.Label column sm='4'>
                  Vendor ID :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control
                    type='text'
                    value={vendorId}
                    onChange={(element) => handleChangeVendorId(element)}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-5'>
                <Form.Label column sm='4'>
                  Nama Vendor :
                </Form.Label>

                <Col sm='8'>
                  <CreatableSelect
                    name='vendor'
                    id='vendor'
                    className='form-control p-0 form-item-name'
                    classNamePrefix='select'
                    placeholder='Pilih/Ketik Nama Vendor'
                    isSearchable={true}
                    options={vendor}
                    onChange={(element) => handleChangeSelectVendor(element)}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-5'>
                <Form.Label column sm='4'>
                  Tukang ID :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control
                    type='text'
                    value={tukangId}
                    onChange={(element) => handleChangeTukangId(element)}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-5'>
                <Form.Label column sm='4'>
                  Nama Tukang :
                </Form.Label>

                <Col sm='8'>
                  <CreatableSelect
                    name='tukang'
                    id='tukang'
                    className='form-control p-0 form-item-name'
                    classNamePrefix='select'
                    placeholder='Pilih/Ketik Nama Tukang'
                    isSearchable={true}
                    options={tukang}
                    onChange={(element) => handleChangeSelectTukang(element)}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-5'>
                <Form.Label column sm='4'>
                  Category ID :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control
                    type='text'
                    value={categoryId}
                    onChange={(element) => handleChangeCategoryId(element)}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-5'>
                <Form.Label column sm='4'>
                  Nama Category :
                </Form.Label>

                <Col sm='8'>
                  <CreatableSelect
                    name='category'
                    id='category'
                    className='form-control p-0 form-item-name'
                    classNamePrefix='select'
                    placeholder='Pilih/Ketik Nama Category'
                    isSearchable={true}
                    options={category}
                    onChange={(element) => handleChangeSelectCategory(element)}
                  />
                </Col>
              </Form.Group>
            </div>
          </div>

          <Row className='table-order-header d-flex align-items-center mb-5'>
            <Col xs={12} md={3} lg={3} xl={3} xxl={3} className='request-date order-2 order-md-1'>
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

            <Col xs={12} md={3} lg={3} xl={3} xxl={3}>
              <Form.Group>
                <Form.Label>No Receipt</Form.Label>
                <Form.Control name='no-receipt' type='number' onChange={handleChangeNoReceipt} />
              </Form.Group>
            </Col>

            <Col xs={12} md={3} lg={3} xl={3} xxl={3} className='order-status order-1 order-md-2'>
              <h1 className='fw-bold'>
                ORDER STATUS : <span className='fw-bold text-success'>PICKLIST</span>
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
                  <tr key={element.index_id}>
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
                        type='number'
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
                      if (paymentType === 'GRATIS' && serviceType === 'PEMASANGAN TANPA SURVEY') {
                        return `Rp. 0`
                      } else if (
                        paymentType === 'BERBAYAR' &&
                        serviceType === 'PEMASANGAN TANPA SURVEY'
                      ) {
                        return `Rp. 0`
                      } else if (paymentType === 'BERBAYAR' && serviceType === 'SURVEY') {
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
                  <td className=' fw-bolder'>Rp. {grandTotal.toLocaleString('id')}</td>
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
                    <img src={image} alt={receiptFile} className='image-preview' />
                  ) : (
                    <div className='input-image-text'>
                      <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                      <p>Add File</p>
                    </div>
                  )}
                </Form>

                <div className='uploaded-row'>
                  <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                  <span className='upload-content'>{receiptFile}</span>

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
            <Button variant='warning'>Reprint Order</Button>

            <Button onClick={handleSubmitNewOrder} variant='dark-primary'>
              Update Order & Print
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {UpdateOrderStore}
