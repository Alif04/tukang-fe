import React, {ChangeEvent, FC, useEffect, useState, useRef} from 'react'
import {useNavigate} from 'react-router-dom'

import './NewOrder.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import {Row, Col, Form, InputGroup, Table, Button, ListGroup} from 'react-bootstrap'
import {Image} from 'antd'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface StoreItem {
  value: BigInteger
  label: string
  address: string
  city_id: BigInteger
  zip_code: string
}

interface MemberSelectOptions {
  value: any
  label: any
  full_name: any
  email: any
  phone_number: any
  whatsapp_number: any
  address_1: any
}

interface Sales {
  value: any
  label: any
  full_name: any
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

interface Member {
  id: number | null
  city_id: number | null
}

const NewOrderStore: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  // If User Login is Admin Sales
  const userId = localStorage.getItem('user_id') as any
  const username = localStorage.getItem('username') as string
  const userRole = localStorage.getItem('userRole')
  const staffStoreId = localStorage.getItem('storeId') as any
  const staffStoreName = localStorage.getItem('storeName') as string

  const [indexForm, setIndexForm] = useState<number>(0)

  // Store
  const [store, setStore] = useState<StoreItem[]>([])
  const [storeId, setStoreId] = useState<string>('')

  // Member
  const [memberId, setMemberId] = useState<any>()
  const [member, setMember] = useState<MemberSelectOptions[]>([])
  const [memberName, setMemberName] = useState<string>('')
  const [memberPhoneNumber, setMemberPhoneNumber] = useState<any>()
  const [memberEmail, setMemberEmail] = useState<any>()
  const [memberAddress, setMemberAddress] = useState<any>()

  const [isWhatsapp, setIsWhatsapp] = useState<boolean>(false)

  // Sales
  const [salesId, setSalesId] = useState<any>()
  const [sales, setSales] = useState<Sales[]>([])
  const [salesName, setSalesName] = useState<string>('')

  const [type, setType] = useState<string>('')
  const [paymentType, setPaymentType] = useState<string>('')

  const [requestDate, setRequestDate] = useState<string>('')

  const [receiptFiles, setReceiptFiles] = useState<Array<File | null>>([])
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)
  const evidenceRef = useRef<HTMLInputElement>(null)

  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)

  // Order Table
  const [item, setItem] = useState<ItemDescription[]>([])
  const [total, setTotal] = useState<number>(0)
  const [grandTotal, setGrandTotal] = useState<number>(0)
  const [grandTotalComission, setGrandTotalComission] = useState<number>(0)
  const [totalEstimateWorkDays, setTotalEstimateWorkDays] = useState<number>(10)

  // Fetch API Data
  const getItem = async (itemNameSearch: string) => {
    try {
      if (orderDetailValues[0].item_name) {
        const response = await axios.get(`${apiUrl}/items?take=0&search=${itemNameSearch}`, {
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
            label: item.service_name,
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

          setItem(tempItem)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
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
        if (Array.isArray(response.data.data.member)) {
          const tempMember = response.data.data.member.map((item: any) => ({
            value: item.id,
            label: item.id,
            full_name: item.full_name,
            email: item.email,
            phone_number: item.phone_number,
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
        const response = await axios.get(`${apiUrl}/sales`, {
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

    getMember()
    getSales()
    getItem('')
  }, [])

  // Store
  useEffect(() => {
    const updatedStore = staffStoreId.toString()
    setStoreId(updatedStore)
  }, [staffStoreId])

  // Select Date Request
  const today = new Date().toISOString().split('T')[0]

  const handleChangeRequestDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedRequestDate = event.target.value
    setRequestDate(updatedRequestDate)
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
    const fileList = event.target.files
    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const {length} = fileList

      for (let i = 0; i < length; i++) {
        file[i] = fileList.item(i)
      }

      setReceiptFiles(file)
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

  // Member Information
  const [memberInfo, setMemberInfo] = useState<MemberSelectOptions | null>(null)

  // Sales Information
  const [salesInfo, setSalesInfo] = useState<Sales | null>(null)

  // Change Select Member
  const handleChangeSelectMember = (element: MemberSelectOptions | null) => {
    if (element && element.value == 'memberOption') {
      setMemberInfo(null)
      setMemberId(null)
      setMemberName('')
      setMemberEmail('')
      setMemberPhoneNumber('')
      setMemberAddress('')
    } else {
      const newMemberInfo: MemberSelectOptions = {
        value: element?.value || 0,
        label: element?.label || '',
        full_name: element?.full_name || '',
        email: element?.email || '',
        phone_number: element?.phone_number || '',
        whatsapp_number: element?.whatsapp_number || '',
        address_1: element?.address_1 || '',
      }

      setMemberInfo(newMemberInfo)
      setMemberId(newMemberInfo.value)
      setMemberName(newMemberInfo.full_name)
      setMemberEmail(newMemberInfo.email)
      setMemberPhoneNumber(newMemberInfo.whatsapp_number)
      setMemberAddress(newMemberInfo.address_1)
    }
  }

  // Change Select Member Full Name
  const handleChangeMemberFullName = (element: any) => {
    const newMemberFullName = element.target.value
    setMemberInfo((prevMemberInfo) => ({
      ...(prevMemberInfo as MemberSelectOptions),
      full_name: newMemberFullName,
    }))

    setMemberName(newMemberFullName)
  }

  // Change Select Member Email Address
  const handleChangeMemberEmailAddress = (element: any) => {
    const newMemberEmail = element.target.value
    setMemberInfo((prevMemberInfo) => ({
      ...(prevMemberInfo as MemberSelectOptions),
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
      ...(prevMemberInfo as MemberSelectOptions),
      whatsapp_number: newMemberPhoneNumber,
    }))

    setMemberPhoneNumber(newMemberPhoneNumber)
  }

  // Change Select Member Address
  const handleChangeMemberAddress = (element: any) => {
    const newMemberAddress = element.target.value
    setMemberInfo((prevMemberInfo) => ({
      ...(prevMemberInfo as MemberSelectOptions),
      address_1: newMemberAddress,
    }))

    setMemberAddress(newMemberAddress)
  }

  // Change Select Sales
  const handleChangeSales = (element: any, value: any, name: string) => {
    if (name === 'sales') {
      if (element && element.value === 'salesOption') {
        setSalesInfo(null)
        setSalesId(null)
        setSalesName('')
      } else {
        const newSalesInfo: Sales = {
          value: element?.value || 0,
          label: element?.label || 0,
          full_name: element?.full_name || '',
        }

        setSalesInfo(newSalesInfo)
        setSalesId(newSalesInfo.value)
        setSalesName(newSalesInfo.full_name)
      }
    } else if (name === 'full_name') {
      setSalesInfo((prevSalesInfo) => ({
        ...(prevSalesInfo as Sales),
        [name]: value,
      }))

      setSalesName(value)
    }
  }

  // Add New Order

  // Order Details
  const [orderDetailValues, setOrderDetailValues] = useState([
    {
      item_id: null,
      item_code: '',
      item_name: '',
      installation_name: '',
      min_order: 0,
      default_price: 0,
      discount_price: 0,
      unit_price: 0,
      quote_price: 0,
      quantity: 1,
      total: 0,
      survey_price: 0,
      comission: 0,
    },
  ])

  let handleAddForm = () => {
    const newForm = {
      item_id: null,
      item_code: '',
      item_name: '',
      installation_name: '',
      min_order: 0,
      default_price: 0,
      discount_price: 0,
      unit_price: 0,
      quote_price: 0,
      quantity: 1,
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
        id: newIndex,
      }
    })

    setOrderDetailValues(updatedOrderDetailValues)
  }

  // Change Select Item
  const handleChangeSelectItem = (index: any, item: any) => {
    if (!item) return

    const {label, value: selectedItemId, prices, default_price} = item
    const newOrderDetailValues = [...orderDetailValues]

    const unitPrice =
      newOrderDetailValues[index].quantity >= prices[0].min_order
        ? +prices[0].price
        : +default_price

    // const total = unitPrice * newOrderDetailValues[index].quantity

    newOrderDetailValues[index] = {
      ...newOrderDetailValues[index],
      item_id: selectedItemId,
      installation_name: label,
      min_order: prices[0].min_order,
      default_price: default_price,
      discount_price: prices[0].price,
      unit_price: unitPrice,
      // total,
    }

    // setOrderDetailValues(() => {
    //   const cache = [...orderDetailValues]

    //   cache[index] = {
    //     ...cache[index],
    //     installation_name: label,
    //     item_id: selectedItemId,
    //     min_order: prices[0].min_order,
    //     default_price: default_price,
    //     unit_price: prices[0].price,
    //     // total: total,
    //   }

    //   return cache
    // })

    setOrderDetailValues(newOrderDetailValues)

    // console.log(newOrderDetailValues)
  }

  // Handle Change Order Detail
  let handleChangeOrderDetail = (index: any, value: any, name: string) => {
    const updatedOrderDetailValues = [...orderDetailValues]

    const quantity = updatedOrderDetailValues[index].quantity
    const minOrder = orderDetailValues[index].min_order
    const unitPrice = updatedOrderDetailValues[index].unit_price

    // console.log('updatedOrderDetailValues:', updatedOrderDetailValues)
    console.log('quantity:', quantity)
    // console.log('minOrder:', minOrder)
    // console.log('unitPrice:', unitPrice)

    const servicePrice =
      updatedOrderDetailValues[index].quantity >= orderDetailValues[index].min_order
        ? orderDetailValues[index].discount_price
        : orderDetailValues[index].default_price

    // const total = servicePrice * updatedOrderDetailValues[index].quantity

    updatedOrderDetailValues[index] = {
      ...updatedOrderDetailValues[index],
      [name]: value,
      unit_price: servicePrice,
      // total: total,
    }

    if (name === 'item_name') {
      getItem(updatedOrderDetailValues[index].item_name)
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
      let totalOrderAmount = 0
      let biayaSurvey = 0

      if (paymentType === 'gratis') {
        biayaSurvey = 0
        totalOrderAmount = 0
      } else if (paymentType === 'pemasangan_tanpa_survey') {
        biayaSurvey = 0
        totalOrderAmount = total
      } else if (paymentType === 'survey') {
        biayaSurvey = 99000
        totalOrderAmount = 0
      } else {
        biayaSurvey = 0
        totalOrderAmount = total
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
  }, [orderDetailValues, total, type, paymentType])

  // Order Validation
  const PreOrderValidation = () => {
    let valid = true

    if (!paymentType) {
      Swal.fire({
        title: 'Error',
        text: 'Please select payment type',
        icon: 'error',
      })
      valid = false
    } else if (!type) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill member id form',
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
    }

    orderDetailValues.map((item) => {
      if (item.item_id === null || item.item_name === '') {
        Swal.fire({
          title: 'Error',
          text: 'Please fill select item name form',
          icon: 'error',
        })
        valid = false
      } else if (item.quantity == 0) {
        Swal.fire({
          title: 'Error',
          text: 'Please fill quantity form',
          icon: 'error',
        })
        valid = false
      }
    })
    return valid
  }

  // Submit Pre Order

  const handleSubmitPreOrder = async () => {
    if (PreOrderValidation()) {
      const formData = new FormData()

      if (receiptFiles?.length) {
        receiptFiles.forEach((item) => {
          if (item) {
            formData.append(`order_files`, item, item?.name)
          }
        })
      }

      formData.append('member_id', memberId)
      formData.append('sales_id', salesId)
      formData.append('store_id', storeId)
      formData.append('project_address', memberAddress)
      formData.append('project_number', memberPhoneNumber)
      formData.append('request_survey', requestDate)
      formData.append('payment_type', paymentType)

      orderDetailValues.forEach((order, index) => {
        formData.append(`order_details[${index}][item_id]`, String(order.item_id))
        formData.append(`order_details[${index}][unit_price]`, String(order.unit_price))
        formData.append(`order_details[${index}][quantity]`, String(order.quantity))
        formData.append(`order_details[${index}][total]`, String(order.total))
      })

      const response = await axios
        .post(`${apiUrl}/orders`, formData, {
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
    <section id='pre-order'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <div className='form-costumer'>
              <Row className='form-header'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='mb-3'>
                  <Form.Group className='form-header'>
                    <Form.Label>
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
                      <Form.Label className='payment-type'>Payment Type :</Form.Label>
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
                            checked={paymentType === 'gratis'}
                            onChange={handleTypeOptionChange}
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
                            checked={paymentType === 'survey'}
                            disabled={paymentType === 'gratis'}
                            onChange={handlePaymentOptionChange}
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
                            checked={type === 'berbayar'}
                            onChange={handleTypeOptionChange}
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
                              paymentType === 'gratis' || paymentType === 'pemasangan_tanpa_survey'
                            }
                            disabled={paymentType === 'gratis'}
                            onChange={handlePaymentOptionChange}
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
                    <Form.Label>No Member</Form.Label>
                    <CreatableSelect
                      name='member'
                      id='member'
                      className='form-control p-0 form-item-name'
                      classNamePrefix='select'
                      placeholder='Ketik No Telepon Member/Nomor Member'
                      isSearchable={true}
                      isClearable={true}
                      options={member}
                      onChange={(element) => handleChangeSelectMember(element)}
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
                        disabled
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
                    <Form.Control
                      type='text'
                      value={memberName}
                      onChange={(element) => handleChangeMemberFullName(element)}
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
                      <CreatableSelect
                        name='sales'
                        id='sales'
                        className='form-control p-0 form-item-name'
                        classNamePrefix='select'
                        placeholder='Pilih/Ketik ID Sales'
                        isSearchable={true}
                        options={sales}
                        onChange={(element) => handleChangeSales(element, element?.value, 'sales')}
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
                        value={salesName}
                        onChange={(element) =>
                          handleChangeSales(element, element.target.value, 'full_name')
                        }
                      />
                    </Col>
                  </Form.Group>
                </>
              )}
            </div>
          </div>

          <Row className='table-order-header d-flex align-items-center mb-5'>
            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='request-date order-2 order-md-1'>
              <Form.Group>
                <Form.Label>Tanggal Request</Form.Label>
                <Form.Control
                  name='request-date'
                  type='date'
                  value={requestDate}
                  onChange={handleChangeRequestDate}
                  min={today}
                />
                <Form.Text className='fs-8 text-dark-danger'>
                  *Tanggal Request{' '}
                  <span className='fw-bolder text-decoration-underline'>bukan</span> tanggal pasti.
                  Konfirmasi kunjungan dilakukan oleh Vendor
                </Form.Text>
              </Form.Group>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='order-status order-1 order-md-2'>
              <h1 className='fs-3 fw-bold'>
                ORDER STATUS : <span className='fw-bold text-success'>PICKLIST</span>
              </h1>
            </Col>

            <Col
              xs={12}
              md={4}
              lg={4}
              xl={4}
              xxl={4}
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
                  {paymentType !== 'gratis' && (
                    <>
                      <th>Harga Jasa</th>
                      <th>Total</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {orderDetailValues.map((element, index) => (
                  <tr key={`${element.item_id} - ${element.item_id} - ${element.quantity}`}>
                    <td>
                      <Button variant='danger' onClick={() => handleRemoveForm(index)}>
                        Remove
                      </Button>
                    </td>

                    <td>
                      <Form.Control
                        id={`item-code-${index}`}
                        name={`order_details[${index}][item_code]`}
                        plaintext
                        // value={element.item_code}
                        value={orderDetailValues[index]?.item_code || ''}
                        onChange={(e) =>
                          handleChangeOrderDetail(index, e.target.value, 'item_code')
                        }
                      />
                    </td>

                    <td style={{maxWidth: '200px', minWidth: '200px'}}>
                      <Form.Control
                        id={`item-name-${index}`}
                        plaintext
                        name={`order_details[${index}][item_name]`}
                        value={orderDetailValues[index]?.item_name || ''}
                        onChange={(e) =>
                          handleChangeOrderDetail(index, e.target.value, 'item_name')
                        }
                      />
                    </td>

                    <td>
                      <Select
                        id={`installation-name-${index}`}
                        className='form-control p-0 form-item-name'
                        classNamePrefix='select'
                        placeholder='Pilih/Ketik Nama Pemasangan'
                        isSearchable={true}
                        options={item}
                        name={`order_details[${index}][item_id]`}
                        value={{
                          // value: orderDetailValues[index]?.item_id,
                          label: orderDetailValues[index]?.installation_name,
                        }}
                        onChange={(element) => handleChangeSelectItem(index, element)}
                      />
                    </td>

                    <td>
                      <Form.Control
                        id={`quantity-${index}`}
                        // value={element.quantity}
                        name={`order_details[${index}][quantity]`}
                        value={orderDetailValues[index]?.quantity || ''}
                        onChange={(e) =>
                          handleChangeOrderDetail(index, parseInt(e.target.value), 'quantity')
                        }
                      />
                    </td>

                    {paymentType !== 'gratis' && (
                      <>
                        <td>
                          <Form.Control
                            id={`unit-price-${index}`}
                            readOnly
                            plaintext
                            value={`Rp. ${
                              orderDetailValues[index]?.unit_price
                                ? orderDetailValues[index]?.unit_price.toLocaleString('id')
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
                              orderDetailValues[index]?.total
                                ? orderDetailValues[index]?.total.toLocaleString('id')
                                : 0
                            }`}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {paymentType !== 'gratis' && (
                  <tr>
                    <td colSpan={6} className='text-end fw-bolder'>
                      Biaya Survey
                    </td>
                    <td className=' fw-bolder'>
                      {(() => {
                        if (paymentType === 'survey') {
                          return `Rp. 99.000`
                        } else {
                          return `Rp. 0`
                        }
                      })()}
                    </td>
                  </tr>
                )}

                <tr>
                  <td colSpan={paymentType !== 'gratis' ? 6 : 4} className='text-end fw-bolder'>
                    Grand Total
                  </td>
                  <td className=' fw-bolder'>Rp. {grandTotal.toLocaleString('id')}</td>
                </tr>
              </tbody>
            </Table>
          </div>

          <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <Form.Group>
                <Form.Label>Upload File</Form.Label>
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
                            src={URL.createObjectURL(item)}
                            preview={{
                              visible,
                              src: URL.createObjectURL(item),
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
            <Button onClick={handleSubmitPreOrder} variant='dark-primary'>
              Submit Order & Print
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewOrderStore}
