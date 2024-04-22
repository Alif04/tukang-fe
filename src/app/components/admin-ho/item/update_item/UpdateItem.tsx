import React, {FC, useState, useEffect} from 'react'

import './UpdateItem.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import dayjs from 'dayjs'
import {DatePicker} from 'antd'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {Form, Table, Button, Row, Col, Modal} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

interface CategorySelect {
  value: number | null
  label: string
}

interface Store {
  id: number | null
  all_store: number | null
  store_group_id: number | null
  store_id: number
  label: string
}

interface Item {
  item_code: string
  item_name: string
  service_name: string
  category_id: number | null
  default_price: number
  prices: Array<{
    id: number | null
    item_id: number | null
    price_store: Array<{
      store_id: number
    }>
    periodic_start: string | null | Date
    periodic_end: string | null | Date
    min_order: number
    price: number
    created_at: string
  }>
}

const UpdateItemHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()

  // Item
  const [item, setItem] = useState<Item>({
    item_code: '',
    item_name: '',
    service_name: '',
    category_id: null,
    default_price: 0,
    prices: [
      {
        id: null,
        item_id: null,
        price_store: [],
        periodic_start: null,
        periodic_end: null,
        min_order: 0,
        price: 0,
        created_at: '',
      },
    ],
  })

  // Store
  const [store, setStore] = useState<Store[]>([])
  const [storeGroup, setStoreGroup] = useState<any[]>([
    {
      store_group_id: 4,
      label: 'Batam',
    },
  ])

  // const [storeGroup, setStoreGroup] = useState<any[]>([])
  // const [storeOptions, setStoreOptions] = useState<Store[]>([])
  // const [selectedAllStore, setSelectedAllStore] = useState<any[]>([])
  // console.log('selected all store', selectedAllStore)

  // useEffect(() => {
  //   setStoreOptions(storeGroup.concat(store))
  // }, [store, storeGroup])

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
              item_id: item?.item_id,
              periodic_start: dayjs(item?.periodic_start).toISOString(),
              periodic_end: dayjs(item?.periodic_end).toISOString(),
              min_order: item?.min_order,
              price: item?.price,
              created_at: item?.created_at,
              price_store: item?.price_stores
                ? item.price_stores.map((storeItem: any) => ({
                    id: storeItem?.id ?? null,
                    store_id: storeItem?.store_id ?? null,
                    // store_group_id: storeItem?.store?.store_group_id ?? null,
                    // label: storeItem?.store?.store_name,
                  }))
                : [],
            }))

            setItem((prev) => ({
              ...prev,
              item_code: data?.item_code,
              item_name: data?.item_name,
              service_name: data?.service_name,
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
          store_id: item.id,
          store_group_id: item.area_id,
          label: item.store_name,
        }))

        setStore(tempStore)

        // setStore([tempAllStore, ...tempStore])
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getStoreGroup = async () => {
    try {
      const response = await axios.get(`${apiUrl}/store-group`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        // const tempStoreGroup = response.data.data.map((item: any) => ({
        //   store_group_id: item.id,
        //   label: item.group_name,
        // }))
        // setStoreGroup(tempStoreGroup)
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
    getStoreGroup()
    getCategories()
  }, [])

  // Add Item Detail
  const handleAddForm = () => {
    const newItemDetail = {
      id: null,
      item_id: null,
      price_store: [],
      periodic_start: dayjs(new Date()).format('YYYY-MM-DD'),
      periodic_end: dayjs(new Date()).add(1, 'day').format('YYYY-MM-DD'),
      min_order: 0,
      price: 0,
      created_at: new Date().toISOString(),
    }

    setItem((prev) => {
      const cache = {...prev}
      cache.prices.push(newItemDetail)
      return cache
    })
  }

  const handleRemoveForm = (index: any) => {
    setItem((prev) => {
      const cache = {...prev}
      cache.prices.splice(index, 1)
      return cache
    })
  }

  // Item Form Handler
  const itemFormHandler = (e: any) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    })
  }

  // Modal Assign To Store
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const [searchByStore, setSearchByStore] = useState<string>('')

  const handleShowModal = (index: any) => {
    setModalIndex(index)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  // Handle Checkbox Change
  const handleAssignToStoreByAllStore = (store_id: any, index: any, isChecked: boolean) => {
    setItem((prev) => {
      const cache = {...prev}

      // Jika checkbox "All Store" dicentang
      if (store_id === 0 && isChecked) {
        const allStoreIds = store.map((storeItem) => storeItem.store_id)
        cache.prices[index].price_store = allStoreIds.map((storeId) => ({
          store_id: storeId,
        }))
      } else if (!isChecked) {
        cache.prices[index].price_store = []
      }

      return cache
    })
  }

  const handleAssignToStoreByStoreGroup = (store_group_id: any, index: any, isChecked: boolean) => {
    setItem((prev) => {
      const cache = {...prev}

      if (store_group_id && isChecked) {
        // Mengambil store dari store_group yang dicentang
        const storesInGroup = store.filter(
          (storeItem) => storeItem.store_group_id === store_group_id
        )

        // Mengambil store_id dari storesInGroup
        const storeIds = storesInGroup.map((storeItem) => storeItem.store_id)

        // Menggabungkan store_id ke price_store
        cache.prices[index].price_store.push(...storeIds.map((storeId) => ({store_id: storeId})))
      } else if (!isChecked) {
        // Mengambil store dari store_group yang dicentang
        const storesInGroup = store.filter(
          (storeItem) => storeItem.store_group_id === store_group_id
        )

        // Mengecek jika tidak ada store_group yang dicentang maka diuncheck
        cache.prices[index].price_store = cache.prices[index].price_store.filter(
          (store) => !storesInGroup.some((storeItem) => storeItem.store_id === store.store_id)
        )
      }

      return cache
    })
  }

  const handleAssignToStore = (store_id: any, index: any, isChecked: boolean) => {
    setItem((prev) => {
      const cache = {...prev}

      if (store_id !== null) {
        const storeIndex = cache.prices[index].price_store.findIndex(
          (store) => store.store_id === store_id
        )

        if (isChecked) {
          // Jika checkbox di-check, tambahkan store_id ke price_store
          if (storeIndex === -1) {
            cache.prices[index].price_store.push({store_id})
          }
        } else {
          // Jika checkbox di-uncheck, hapus store_id dari price_store
          if (storeIndex !== -1) {
            cache.prices[index].price_store.splice(storeIndex, 1)
          }
        }
      }

      return cache
    })
  }

  const isStoreChecked = (store_id: any, index: any) => {
    return item.prices[index].price_store.some((store) => store.store_id === store_id)
  }

  useEffect(() => {
    setItem({
      ...item,
      category_id: selectedCategory?.value ?? null,
    })
  }, [selectedCategory])

  // Item Detail Form Handler
  const itemDetailsFormHandler = (e: any, index: number) => {
    setItem((prev) => {
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

    if (!item.service_name) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Item Nama Jasa Pemasangan form',
        icon: 'warning',
      })
      valid = false
    } else if (!item.category_id) {
      Swal.fire({
        title: 'Warning',
        text: 'Please select Kategori form',
        icon: 'warning',
      })
      valid = false
    }

    item.prices.map((item) => {
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
      }
    })
    return valid
  }

  // Handle Submit New Item
  const handleUpdateItem = async () => {
    if (!ItemValidation()) {
      return false
    }

    const updatedPrices = item.prices.map((price) => {
      if (price.id === null && price.item_id === null) {
        const {id, item_id, ...priceWithoutId} = price
        return priceWithoutId
      }

      return price
    })

    const newItemDetail = {
      ...item,
      prices: updatedPrices,
    }

    await axios
      .post(`${apiUrl}/items/${params.id}`, newItemDetail, {
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
            text: 'Success Update Item',
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

        navigate('/item/view-item')
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
              UPDATE FORMULIR ITEM
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
                      value={item.item_code}
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
                      value={item.item_name}
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
                      value={item.default_price}
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
                    name='service_name'
                    type='text'
                    value={item.service_name}
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
                  <th className='text-center'>Periode</th>
                  <th className='text-center'>Assign To Store</th>
                  <th className='text-center'>Minimum Order</th>
                  <th className='text-center'>Price</th>
                  <th className='text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {item.prices.map((element, index) => (
                  <tr key={`${index}-item_details`}>
                    <td style={{maxWidth: '300px'}}>
                      <RangePicker
                        id={`date-range-${index}`}
                        className='date-range ms-1 me-1 w-100'
                        format={'DD-MM-YYYY'}
                        allowClear={false}
                        value={[
                          dayjs(item.prices[index].periodic_start, 'YYYY-MM-DD') ?? null,
                          dayjs(item.prices[index].periodic_end, 'YYYY-MM-DD') ?? null,
                        ]}
                        onChange={(values) => {
                          if (values && values.length === 2) {
                            setItem((prev) => {
                              const cache = {...prev}
                              cache.prices[index] = {
                                ...cache.prices[index],
                                periodic_start: dayjs(values[0]).toISOString() ?? null,
                                periodic_end: dayjs(values[1]).toISOString() ?? null,
                              }

                              return cache
                            })
                          }
                        }}
                      />
                    </td>

                    <td style={{maxWidth: '300px'}}>
                      <Button
                        className='d-flex justify-content-center align-items-center assign-store'
                        variant='dark-primary'
                        onClick={() => handleShowModal(index)}
                      >
                        Assign To Store
                      </Button>
                    </td>

                    <td style={{maxWidth: '150px'}}>
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

          {showModal && (
            <Modal
              key={`${modalIndex}-Assign-Store`}
              dialogClassName='modal-assign-store'
              centered
              show={true}
              onHide={handleCloseModal}
            >
              <Modal.Header closeButton>
                <Modal.Title>Assign To Store - Item Promo - {modalIndex}</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Form.Group className='mb-5'>
                  <Form.Label>Shortcut</Form.Label>

                  <Row>
                    <Col xxl={3} xl={3} md={3} sm={12} className='all-store'>
                      <Form.Check
                        label='All Store'
                        name='all-store'
                        value={0}
                        type='checkbox'
                        // checked={element.all_store === 1}
                        onChange={(e) =>
                          handleAssignToStoreByAllStore(0, modalIndex, e.target.checked)
                        }
                      />
                    </Col>

                    <Col xxl={9} xl={9} md={9} sm={12}>
                      <Row>
                        {storeGroup.map((item) => (
                          <Col
                            key={item.store_group_id}
                            xs={12}
                            sm={6}
                            md={3}
                            lg={3}
                            className='mb-3'
                          >
                            <Form.Check
                              className='mb-3'
                              key={item.store_group_id}
                              inline
                              name='store-group'
                              type='checkbox'
                              value={item.store_group_id}
                              label={item.label}
                              onChange={(e) =>
                                handleAssignToStoreByStoreGroup(
                                  item.store_group_id,
                                  modalIndex,
                                  e.target.checked
                                )
                              }
                            />
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group>
                  <Row>
                    <Form.Label>List Store</Form.Label>

                    {/* <div className='d-flex align-items-center mb-5'>
                      <Form.Label className='me-2'>Search</Form.Label>

                      <Form.Control
                        className='store-search'
                        name='store-search'
                        placeholder='Search..'
                        type='text'
                        onChange={(e) => setSearchByStore(e.target.value)}
                      />
                    </div> */}
                  </Row>

                  <Row>
                    {store.map((item) => (
                      <Col key={item.store_id} xs={12} sm={6} md={4} lg={4} className='mb-3'>
                        <Form.Check
                          inline
                          name='store'
                          type='checkbox'
                          id={`${modalIndex}-checkbox`}
                          value={item.store_id}
                          label={item.label}
                          checked={isStoreChecked(item.store_id, modalIndex)}
                          onChange={(e) =>
                            handleAssignToStore(item.store_id, modalIndex, e.target.checked)
                          }
                        />
                      </Col>
                    ))}
                  </Row>
                </Form.Group>
              </Modal.Body>
            </Modal>
          )}

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
