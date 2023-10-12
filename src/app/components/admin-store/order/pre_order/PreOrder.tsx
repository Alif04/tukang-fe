import React, {FC, useEffect, useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

import './PreOrder.css'

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

const PreOrderStore: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()

  // If User Login is Admin Sales
  const userId = localStorage.getItem('user_id') as any
  const username = localStorage.getItem('username') as string
  const userRole = localStorage.getItem('userRole')

  const [indexForm, setIndexForm] = useState<number>(0)

  // Order Information Detail

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

  const [type, setType] = useState<string>('')
  const [paymentType, setPaymentType] = useState<string>('')

  const [requestDate, setRequestDate] = useState<string>('')
  const [receiptFile, setReceiptFile] = useState<string>('No selected file')
  const [image, setImage] = useState<string | null>(null)

  // Order Table
  const [item, setItem] = useState<ItemDescription[]>([])
  const [total, setTotal] = useState<number>(0)
  const [grandTotal, setGrandTotal] = useState<number>(0)
  const [grandTotalComission, setGrandTotalComission] = useState<number>(0)
  const [totalEstimateWorkDays, setTotalEstimateWorkDays] = useState<number>(10)

  // Fetch API Data
  useEffect(() => {
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

    const getMember = async () => {
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
            // phone_number: item.phone_number,
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

    getStore()
    getMember()
    getSales()
    getItem()
  }, [])

  // Select Store
  const handleChangeSelectStore = (element: any) => {
    const updatedStore = element.value
    setStoreId(updatedStore)
  }

  // Select Date Request
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

  // Add New Order

  // Order Details
  const [orderDetailValues, setOrderDetailValues] = useState([
    {
      index_id: 0,
      item_id: null,
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
  }, [orderDetailValues, total, type, paymentType])

  // Order Validation
  const PreOrderValidation = () => {
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
    } else if (!image) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill upload receipt form',
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

  // Submit Pre Order

  const handleSubmitPreOrder = async () => {
    if (PreOrderValidation()) {
      const formData = new FormData()

      formData.append('receipt_file', receiptFile)
      formData.append('member_id', memberId)
      formData.append('sales_id', salesId)
      formData.append('project_address', memberAddress)
      formData.append('grand_total', grandTotal.toString())
      formData.append('grand_total_comission', grandTotalComission.toString())
      formData.append('total_estimate_workdays', totalEstimateWorkDays.toString())
      formData.append('store_id', storeId)
      formData.append('payment_type', paymentType)

      orderDetailValues.forEach((order, index) => {
        formData.append(`order_details[${index}][item_id]`, String(order.item_id))
        formData.append(`order_details[${index}][unit]`, order.unit)
        formData.append(`order_details[${index}][unit_price]`, String(order.unit_price))
        formData.append(`order_details[${index}][quote_price]`, String(order.quote_price))
        formData.append(`order_details[${index}][quantity]`, String(order.quantity))
        formData.append(`order_details[${index}][total]`, String(order.total))
        formData.append(`order_details[${index}][survey_price]`, String(order.survey_price))
        formData.append(`order_details[${index}][comission]`, String(order.comission))
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
          if (response.data.status === 201) {
            Swal.fire({
              title: 'Success',
              text: response.data.message,
              icon: 'success',
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
    <section id='pre-order'>
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
                        defaultValue={store.find((storeItem) => storeItem.value) || null}
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
                        checked={type === 'berbayar'}
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
                />
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
                        id={`item-id-${index}`}
                        readOnly
                        plaintext
                        value={orderDetailValues[index]?.item_id || ''}
                      />
                    </td>

                    <td>
                      <Select
                        id={`item-name-${index}`}
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
                        id={`category-name-${index}`}
                        readOnly
                        plaintext
                        value={orderDetailValues[index]?.category_name || ''}
                      />
                    </td>

                    <td>
                      <Form.Control
                        id={`quantity-${index}`}
                        value={element.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                      />
                    </td>

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
            <Button onClick={handleSubmitPreOrder} variant='dark-primary'>
              Submit Order & Print
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {PreOrderStore}
