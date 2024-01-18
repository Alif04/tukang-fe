import React, {FC, useEffect, useState, useRef} from 'react'
import {useNavigate} from 'react-router-dom'

import './NewOrder.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'
import {Row, Col, Form, InputGroup, Table, Button, ListGroup} from 'react-bootstrap'
import {Image} from 'antd'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

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
  category: string
  default_price: number
  prices: Array<{
    id: number | null
    item_id: number | null
    unit_id: number | null
    store_id: number | null
    periodic_start: string
    periodic_end: string
    nominal_discount: string
    price: string
    min_order: string
  }>
}

interface Order {
  member_id: number | null
  sales_id: number | null
  store_id: number | null
  project_address: string
  project_number: string
  request_survey: string
  payment_type: string
  order_details: Array<{
    item?: ItemSelect | null
    item_id: number | null
    item_code: string | null
    item_name: string | null
    quantity: number
    unit_price: string | null
    total: string | null
  }>

  [key: string]: any
}

const NewOrderStoreStaff: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // If User Login is Admin Sales
  const userId = localStorage.getItem('user_id') as any
  const username = localStorage.getItem('username') as string
  const userRole = localStorage.getItem('userRole')
  const staffStoreId = localStorage.getItem('storeId') as any
  const staffStoreName = localStorage.getItem('storeName') as string

  // Order
  const [orderForm, setOrderForm] = useState<Order>({
    member_id: null,
    sales_id: userRole === 'Sales' ? Number.parseInt(userId) ?? null : null,
    store_id: Number.parseInt(staffStoreId),
    project_address: '',
    project_number: '',
    request_survey: '',
    payment_type: 'gratis',
    order_details: [
      {
        item_id: null,
        item_code: null,
        item_name: null,
        quantity: 1,
        unit_price: null,
        total: null,
      },
    ],
  })

  const [paymentTypeValue, setPaymentTypeValue] = useState(['gratis', 'pemasangan_tanpa_survey'])

  // Member
  const [member, setMember] = useState<MemberSelect[]>([])
  const [searchByPhoneNumber, setSearchByPhoneNumber] = useState('')
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

  // Sales
  const [sales, setSales] = useState<SalesSelect[]>([])
  const [selectedSales, setSelectedSales] = useState<SingleValue<SalesSelect>>({
    value: null,
    label: '',
    full_name: '',
  })

  // Order Detail Table
  const [item, setItem] = useState<ItemSelect[]>([])
  const [total, setTotal] = useState<number>(0)
  const [grandTotal, setGrandTotal] = useState<number>(0)

  // Fetch API Data
  const getItem = async (itemNameSearch: string) => {
    try {
      const response = await axios.get(`${apiUrl}/items?take=0&search=${itemNameSearch}`, {
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

        setItem(item)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const getMember = async () => {
      try {
        const labelKey = determineLabelKey(searchByPhoneNumber)

        const response = await axios.get(`${apiUrl}/member?search=${searchByPhoneNumber}`, {
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
            label: item[labelKey],
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

    const determineLabelKey = (search: any) => {
      switch (true) {
        case search.includes('-'):
          return 'whatsapp_number'
        case search.includes('+'):
          return 'phone_number'
        default:
          return 'member_number'
      }
    }

    getMember()
  }, [searchByPhoneNumber])

  useEffect(() => {
    const getSales = async () => {
      try {
        const response = await axios.get(`${apiUrl}/sales?take=0`, {
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

    getSales()
    getItem('')
  }, [])

  // Order Form Handler
  const orderFormHandler = (e: any) => {
    setOrderForm({
      ...orderForm,
      [e.target.name]: e.target.value,
    })
  }

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

  useEffect(() => {
    setOrderForm({
      ...orderForm,
      project_address: selectedMember?.address_1 ?? '',
      project_number:
        (isWhatsapp ? selectedMember?.whatsapp_number : selectedMember?.phone_number) ?? '',
      member_id: selectedMember?.value ?? null,
    })
  }, [selectedMember, isWhatsapp])

  useEffect(() => {
    setOrderForm({
      ...orderForm,
      sales_id: selectedSales?.value ?? null,
    })
  }, [selectedSales])

  useEffect(() => {
    setOrderForm({
      ...orderForm,
      payment_type: paymentTypeValue[0] === 'gratis' ? 'gratis' : paymentTypeValue[1],
    })
  }, [paymentTypeValue])

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
            quantity >= +prices[0]?.min_order.toString() ? +prices[0].price : +default_price
          const total = unitPrice * quantity

          newDetail = {...newDetail, unit_price: unitPrice.toString(), total: total.toString()}
        }

        return newDetail
      })

      return {...prev, order_details}
    })
  }

  // Order Details
  const addOrderDetails = () => {
    const newDetail = {
      item_id: null,
      item_code: null,
      item_name: null,
      quantity: 1,
      unit_price: null,
      total: null,
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

    return grandTotal
  }

  useEffect(() => {
    const calculatedGrandTotal = calculatedGrandTotalOrder()
    setGrandTotal(calculatedGrandTotal)
  }, [orderForm.order_details, paymentTypeValue])

  // Submit New Order
  const handleSubmitNewOrder = async () => {
    setIsLoading(true)
    const url = `${apiUrl}/orders`
    const formData = new FormData()

    let errorBags = []
    const requiredOrderFields = [
      {key: 'member_id', fieldName: 'Nomor Member'},
      {key: 'sales_id', fieldName: 'Sales Information'},
      {key: 'store_id', fieldName: 'Store'},
      {key: 'project_address', fieldName: 'Alamat Proyek'},
      {key: 'project_number', fieldName: 'Nomor Proyek'},
      {key: 'request_survey', fieldName: 'Request Survey'},
      {key: 'payment_type', fieldName: 'Payment Type'},
      {key: 'order_details', fieldName: 'Order Details'},
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

                  formData.append(`order_details[${index}][item_id]`, item.item_id)
                  formData.append(`order_details[${index}][quantity]`, item.quantity)
                }
              })
            } else {
              formData.append(key, orderForm[key])
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

      return false
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
            text: response.data.message,
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate(`/order/printout-order/${orderId}`)
          })

          setIsLoading(false)
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })

          setIsLoading(true)
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

  return (
    <section id='pre-order'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <div className='form-costumer'>
              <Row className='form-header'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='mb-3'>
                  <Form.Group className='form-header'>
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
                              console.log('pemasangan_tanpa_survey')
                              console.log(paymentTypeValue[1])

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
                          label='Bukan Whatsapp'
                          name='group1'
                          value='1'
                          type='checkbox'
                          onChange={() => setIsWhatsapp(!isWhatsapp)}
                        />
                      </div>
                    </div>

                    <InputGroup className='mb-5'>
                      <InputGroup.Text>+ 62</InputGroup.Text>
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
                    <Form.Control type='text' value={selectedMember?.full_name || ''} />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label className='title'>Email</Form.Label>
                    <Form.Control type='text' value={selectedMember?.email || ''} />
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
                      onChange={(event) => orderFormHandler(event)}
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
                  {userRole === 'Sales' ? (
                    <Form.Control type='number' disabled value={userId} />
                  ) : (
                    <Select
                      name='sales_id'
                      id='sales_id'
                      className='form-control p-0 form-item-name'
                      classNamePrefix='select'
                      placeholder='Pilih/Ketik ID Sales'
                      isSearchable={true}
                      isClearable={true}
                      options={sales}
                      onChange={(newValue) => setSelectedSales(newValue)}
                    />
                  )}
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-5'>
                <Form.Label className='title' column xxl='4' xl='5' md='2'>
                  Nama Sales :
                </Form.Label>

                <Col xxl='8' xl='7' md='10'>
                  <Form.Control
                    type='text'
                    disabled={userRole === 'Sales'}
                    value={userRole === 'Sales' ? username : selectedSales?.full_name || ''}
                  />
                </Col>
              </Form.Group>
            </div>
          </div>

          <Row className='table-order-header d-flex align-items-center mb-5'>
            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='request-date order-2 order-md-1'>
              <Form.Group>
                <Form.Label className='title'>Tanggal Request</Form.Label>
                <Form.Control
                  name='request_survey'
                  type='date'
                  value={orderForm.request_survey}
                  onChange={(e) => orderFormHandler(e)}
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
                        onChange={(e) => orderDetailsFormHandler(e, index)}
                      />
                    </td>

                    <td style={{maxWidth: '200px', minWidth: '200px'}}>
                      <Form.Control
                        id={`item-name-${index}`}
                        plaintext
                        name={`item_name`}
                        onChange={(e) => {
                          orderDetailsFormHandler(e, index)
                          getItem(e.target.value)
                        }}
                      />
                    </td>

                    <td>
                      <Select
                        id={`item_id-${index}`}
                        className='form-control p-0 form-item-name'
                        classNamePrefix='select'
                        placeholder='Pilih/Ketik Nama Pemasangan'
                        isSearchable={true}
                        options={item}
                        name={`item_id`}
                        onChange={(newValue) => {
                          setOrderForm((prev) => {
                            const cache = {...prev}
                            cache.order_details[index] = {
                              ...cache.order_details[index],
                              item_id: newValue?.value ?? null,
                              item: newValue,
                            }
                            return cache
                          })
                          calcEachDetails()
                        }}
                      />
                    </td>

                    <td>
                      <Form.Control
                        id={`quantity-${index}`}
                        name={`quantity`}
                        value={element.quantity}
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

                {paymentTypeValue[1] !== 'survey' && (
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

          <div className='button-submit d-flex justify-content-center align-items-center mt-5'>
            <Button
              type='submit'
              onClick={handleSubmitNewOrder}
              disabled={isLoading}
              variant='dark-primary'
            >
              {isLoading ? 'Submit Order & Print' : 'Submitting Order...'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewOrderStoreStaff}
