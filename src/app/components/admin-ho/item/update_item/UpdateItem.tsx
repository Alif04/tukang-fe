import React, {FC, useState, useEffect} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './UpdateItem.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import dayjs from 'dayjs'
import {DatePicker} from 'antd'
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
  value: number | null
  label: string
}

interface ItemDetail {
  item_code: string
  item_name: string
  name: string
  category_id: number | null
  default_price: number
  prices: Array<{
    id: number | null
    store_id: number | null
    store?: StoreSelect | null
    periodic_start: string | null | Date
    periodic_end: string | null | Date
    min_order: number
    price: number
  }>
}

const UpdateItemHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()

  // Item
  const [itemDetail, setItemDetail] = useState<ItemDetail>({
    item_code: '',
    item_name: '',
    name: '',
    category_id: null,
    default_price: 0,
    prices: [
      {
        id: null,
        store_id: null,
        periodic_start: null,
        periodic_end: null,
        min_order: 0,
        price: 0,
      },
    ],
  })

  // Store
  const [store, setStore] = useState<StoreSelect[]>([])
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreSelect>>({
    value: null,
    label: '',
  })

  // Category
  const [categories, setCategories] = useState<CategorySelect[]>([])
  const [selectedCategory, setSelectedCategory] = useState<SingleValue<CategorySelect>>({
    value: null,
    label: '',
  })

  const getItemData = async () => {
    try {
      await axios
        .get(`${apiUrl}/items/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          if (data) {
            const pricesItem = data?.prices.map((item: any) => ({
              id: item?.id,
              store_id: item?.store_id,
              // periodic_start: item?.periodic_start,
              // periodic_end: item?.periodic_end,
              periodic_start: dayjs(item?.periodic_start).format('YYYY-MM-DD'),
              periodic_end: dayjs(item?.periodic_end).format('YYYY-MM-DD'),
              // periodic_start: formatPeriodicDate(new Date(item?.periodic_start)),
              // periodic_end: formatPeriodicDate(new Date(item?.periodic_end)),
              min_order: item?.min_order,
              price: item?.price,
              store: {
                value: item?.store_id,
                label: item?.store.store_name,
              },
            }))

            setItemDetail((prev) => ({
              ...prev,
              item_code: data?.item_code,
              item_name: data?.item_name,
              name: data?.service_name,
              category_id: data?.category_id,
              default_price: data?.default_price,
              prices: pricesItem,
            }))

            setSelectedCategory((prev) => ({
              ...prev,
              value: data?.category_id,
              label: data?.category.category_name,
            }))
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

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
    getItemData()
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

  const formatPeriodicDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  // Add Item Detail
  const handleAddForm = () => {
    const newItemDetail = {
      id: null,
      store_id: null,
      periodic_start: dayjs(new Date()).format('YYYY-MM-DD'),
      periodic_end: dayjs(new Date()).add(1, 'day').format('YYYY-MM-DD'),
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
  const handleUpdateItem = async () => {
    if (!ItemValidation()) {
      return false
    }

    const updatedPrices = itemDetail.prices.map((price) => {
      if (price.id === null) {
        const {id, ...priceWithoutId} = price
        return priceWithoutId
      }

      const {store, ...priceWithoutStore} = price
      return priceWithoutStore
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
    <section id='update-item'>
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
                      value={itemDetail.item_code}
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
                      value={itemDetail.item_name}
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
                      value={itemDetail.default_price}
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
                  <Form.Control
                    name='name'
                    type='text'
                    value={itemDetail.name}
                    onChange={(e) => itemFormHandler(e)}
                  />
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
                    value={{
                      value: selectedCategory?.value ?? null,
                      label: selectedCategory?.label ?? '',
                    }}
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
                  <th className='text-center' style={{minWidth: '200px'}}>
                    Periode
                  </th>
                  <th className='text-center' style={{minWidth: '200px'}}>
                    Assign To Store
                  </th>
                  <th className='text-center'>Minimum Order</th>
                  <th className='text-center'>Price</th>
                  <th className='text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {itemDetail.prices.map((element, index) => (
                  <tr key={`${index}-item_details`}>
                    <td>
                      <RangePicker
                        id={`date-range-${index}`}
                        className='date-range ms-1 me-1 w-100'
                        format={'YYYY-MM-DD'}
                        allowClear={false}
                        // value={[
                        //   dayjs(element.periodic_start).format('YYYY-MM-DD'),
                        //   dayjs(element.periodic_end).format('YYYY-MM-DD'),
                        // ]}
                        // value={[dayjs(element.periodic_start), dayjs(element.periodic_end)]}
                        value={[
                          dayjs(itemDetail.prices[index].periodic_start, 'YYYY-MM-DD') ?? null,
                          dayjs(itemDetail.prices[index].periodic_end, 'YYYY-MM-DD') ?? null,
                        ]}
                        onChange={(values) => {
                          if (values && values.length === 2) {
                            setItemDetail((prev) => {
                              const cache = {...prev}
                              cache.prices[index] = {
                                ...cache.prices[index],
                                periodic_start: dayjs(values[0]).format('YYYY-MM-DD') ?? null,
                                periodic_end: dayjs(values[1]).format('YYYY-MM-DD') ?? null,
                              }

                              return cache
                            })
                          }
                        }}
                      />
                    </td>

                    <td>
                      <Select
                        id={`store-id-${index}`}
                        name='store-id'
                        className='form-control p-0'
                        placeholder='Ketik/Pilih Store'
                        isSearchable={true}
                        options={store}
                        value={{
                          value: itemDetail.prices[index]?.store?.value ?? null,
                          label: itemDetail.prices[index]?.store?.label ?? '',
                        }}
                        onChange={(newValue) => {
                          setItemDetail((prev) => {
                            const cache = {...prev}
                            cache.prices[index] = {
                              ...cache.prices[index],
                              store_id: newValue?.value ?? null,
                              store: newValue,
                            }
                            return cache
                          })
                        }}
                      />
                    </td>

                    <td>
                      <Form.Control
                        id={`min-order-${index}`}
                        name={`min_order`}
                        type='number'
                        value={element.min_order}
                        onChange={(e) => itemDetailsFormHandler(e, index)}
                      />
                    </td>

                    <td>
                      <Form.Control
                        id={`price-${index}`}
                        name={`price`}
                        type='number'
                        value={element.price}
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
              onClick={() => handleUpdateItem()}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {UpdateItemHO}
