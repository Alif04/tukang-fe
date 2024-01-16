import React, {FC, useState, useEffect} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './NewItem.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import {DatePicker} from 'antd'
import makeAnimated from 'react-select/animated'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Table, Button, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faTrash} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

interface CategorySelect {
  value: number | null
  label: string
}

interface StoreSelect {
  value: number
  label: string
}

interface ItemDetail {
  item_code: number | null
  item_name: string
  name: string
  category_id: number | null
  default_price: number
  prices: Array<{
    id: number | null
    store: Array<{
      id: number | null
    }>
    periodic_start: string
    periodic_end: string
    min_order: number
    price: number
  }>
}

const NewItemHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const animatedComponents = makeAnimated()

  // Item
  const [itemDetail, setItemDetail] = useState<ItemDetail>({
    item_code: null,
    item_name: '',
    name: '',
    category_id: null,
    default_price: 0,
    prices: [
      {
        id: null,
        store: [
          {
            id: null,
          },
        ],
        periodic_start: '',
        periodic_end: '',
        min_order: 0,
        price: 0,
      },
    ],
  })

  // Store
  const [store, setStore] = useState<StoreSelect[]>([])

  // Category
  const [categories, setCategories] = useState<CategorySelect[]>([])
  const [selectedCategory, setSelectedCategory] = useState<SingleValue<CategorySelect>>({
    value: null,
    label: '',
  })

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
    getStore()
    getCategories()
  }, [])

  // Format Date
  const today = new Date().toISOString().split('T')[0]
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Add Item Detail
  const handleAddForm = () => {
    const newItemDetail = {
      id: null,
      store: [
        {
          id: null,
        },
      ],
      periodic_start: '',
      periodic_end: '',
      min_order: 0,
      price: 0,
    }

    setItemDetail((prev) => {
      const cache = {...prev}
      cache.prices.push(newItemDetail)
      return cache
    })
  }

  const handleRemoveForm = (index: any) => {
    setItemDetail((prev) => {
      const cache = {...prev}
      cache.prices.splice(index, 1)
      return cache
    })
  }

  // Item Form Handler
  const itemFormHandler = (e: any) => {
    setItemDetail({
      ...itemDetail,
      [e.target.name]: e.target.value,
    })
  }

  useEffect(() => {
    setItemDetail({
      ...itemDetail,
      category_id: selectedCategory?.value ?? null,
    })
  }, [selectedCategory])

  // Item Detail Form Handler
  const itemDetailsFormHandler = (e: any, index: number) => {
    setItemDetail((prev) => {
      const cache = {...prev}
      cache.prices[index] = {
        ...cache.prices[index],
        [e.target.name]: e.target.value,
      }

      return cache
    })
  }

  // Item Validation
  const ItemValidation = () => {
    let valid = true

    if (!itemDetail.name) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Item Nama Jasa Pemasangan form',
        icon: 'warning',
      })
      valid = false
    } else if (!itemDetail.category_id) {
      Swal.fire({
        title: 'Warning',
        text: 'Please select Kategori form',
        icon: 'warning',
      })
      valid = false
    } else if (!itemDetail.default_price) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Harga form',
        icon: 'warning',
      })
      valid = false
    }

    itemDetail.prices.map((item) => {
      if (item.periodic_start === '') {
        Swal.fire({
          title: 'Warning',
          text: 'Please fill Periode form',
          icon: 'warning',
        })
        valid = false
      } else if (item.periodic_end === '') {
        Swal.fire({
          title: 'Warning',
          text: 'Please fill Periode  form',
          icon: 'warning',
        })
        valid = false
      } else if (item.min_order === 0) {
        Swal.fire({
          title: 'Warning',
          text: 'Please fill Minimum Order  form',
          icon: 'warning',
        })
        valid = false
      } else if (item.price === 0) {
        Swal.fire({
          title: 'Warning',
          text: 'Please fill Price  form',
          icon: 'warning',
        })
        valid = false
      }
    })
    return valid
  }

  // Handle Submit New Item
  const handleSubmitNewItem = async () => {
    if (!ItemValidation()) {
      return false
    }

    const updatedPrices = itemDetail.prices.map((price) => {
      if (price.id === null) {
        const {id, ...priceWithoutId} = price
        return priceWithoutId
      }
      return price
    })

    const newItemDetail = {
      ...itemDetail,
      prices: updatedPrices,
    }

    await axios
      .post(`${apiUrl}/items`, newItemDetail, {
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
            text: 'Success Create Item',
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

        navigate('/home')
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
    <section id='new-item'>
      <div className='card'>
        <div className='card-body'>
          <Row className='mb-5'>
            <h1 className='text-center fw-bolder' style={{fontSize: '30px'}}>
              FORMULIR ITEM BARU
            </h1>
          </Row>

          <Row className='mb-3'>
            <Col xxl={6} className='vendor-information'>
              <div className='vendor-detail'>
                <Form.Group as={Row} className='mb-4'>
                  <Form.Label className='fs-5 fw-bold pt-0 pb-0' column sm='4'>
                    Item Code :
                  </Form.Label>

                  <Col sm='8'>
                    <Form.Control
                      name='item_code'
                      type='number'
                      onChange={(e) => itemFormHandler(e)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-4'>
                  <Form.Label className='fs-5 fw-bold' column sm='4'>
                    Nama Item :
                  </Form.Label>

                  <Col sm='8'>
                    <Form.Control
                      name='item_name'
                      type='text'
                      onChange={(e) => itemFormHandler(e)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-4'>
                  <Form.Label className='fs-5 fw-bold' column sm='4'>
                    Harga :
                  </Form.Label>

                  <Col sm='8'>
                    <Form.Control
                      name='default_price'
                      type='number'
                      onChange={(e) => itemFormHandler(e)}
                    />
                  </Col>
                </Form.Group>
              </div>
            </Col>

            <Col xxl={6} className='payment-request'>
              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold pt-0 pb-0' column sm='4'>
                  Nama Jasa Pemasangan :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control name='name' type='text' onChange={(e) => itemFormHandler(e)} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold' column sm='4'>
                  Kategori :
                </Form.Label>

                <Col sm='8'>
                  <Select
                    name='category-id'
                    className='form-control p-0'
                    placeholder='Ketik/Pilih Kategori Barang'
                    isSearchable={true}
                    options={categories}
                    onChange={(newValue) => setSelectedCategory(newValue)}
                  />
                </Col>
              </Form.Group>
            </Col>
          </Row>

          <div className='d-flex justify-content-end mb-5'>
            <Button
              className='d-flex justify-content-center align-items-center'
              variant='dark-primary'
              onClick={() => handleAddForm()}
            >
              Tambah Minimal Order
            </Button>
          </div>

          <div className='detail-table'>
            <Table hover>
              <thead>
                <tr>
                  <th className='text-center'>Periode</th>
                  <th className='text-center'>Assign To Store</th>
                  <th className='text-center'>Minimum Order</th>
                  <th className='text-center'>Price</th>
                  <th className='text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {itemDetail.prices.map((element, index) => (
                  <tr key={`${index}-item_details`}>
                    <td style={{minWidth: '230px'}}>
                      <RangePicker
                        id={`date-range-${index}`}
                        className='date-range ms-3 w-100'
                        onChange={(values) => {
                          if (values && values.length === 2) {
                            const dateFromFormatted = values[0]?.format('YYYY-MM-DD')
                            const dateToFormatted = values[1]?.format('YYYY-MM-DD')

                            setItemDetail((prev) => {
                              const cache = {...prev}
                              cache.prices[index] = {
                                ...cache.prices[index],
                                periodic_start: dateFromFormatted ?? '',
                                periodic_end: dateToFormatted ?? '',
                              }

                              return cache
                            })
                          } else {
                            setItemDetail((prev) => {
                              const cache = {...prev}
                              cache.prices[index] = {
                                ...cache.prices[index],
                                periodic_start: '',
                                periodic_end: '',
                              }
                              return cache
                            })
                          }
                        }}
                      />
                    </td>

                    <td style={{minWidth: '150px'}}>
                      <Select
                        id={`store-id-${index}`}
                        name='store-id'
                        className='form-control p-0'
                        placeholder='Ketik/Pilih Store'
                        isSearchable={true}
                        options={store}
                        isMulti
                        components={animatedComponents}
                      />
                    </td>

                    <td>
                      <Form.Control
                        id={`min-order-${index}`}
                        name={`min_order`}
                        type='number'
                        onChange={(e) => itemDetailsFormHandler(e, index)}
                      />
                    </td>

                    <td>
                      <Form.Control
                        id={`price-${index}`}
                        name={`price`}
                        type='number'
                        onChange={(e) => itemDetailsFormHandler(e, index)}
                      />
                    </td>

                    <td>
                      <Button variant='danger' onClick={() => handleRemoveForm(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className='d-flex justify-content-center mb-5'>
            <Button
              className='btn-submit d-flex justify-content-center align-items-center'
              variant='dark-primary'
              onClick={() => handleSubmitNewItem()}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewItemHO}
