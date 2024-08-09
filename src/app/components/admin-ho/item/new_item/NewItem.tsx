import React, {FC, useState, useEffect} from 'react'

import './NewItem.css'

import axios from 'axios'
import Select, {SingleValue} from 'react-select'
import {DatePicker} from 'antd'
import Swal from 'sweetalert2'
import {Form, Table, Button, Row, Col, Modal} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

interface CategorySelect {
  value: number | null
  label: string
}

interface Store {
  all_store: number | null
  store_group_id: number | null
  store_id: number
  label: string
}

interface Item {
  item_code: string
  item_name: string
  name: string
  category_id: number | null
  default_price: number
  item_type: number
  invoice_nominal: number
  prices: Array<{
    id: number | null
    price_store: Array<{
      store_id: number | null
    }>
    periodic_start: string
    periodic_end: string
    min_order: number
    price: number
  }>
}

const NewItemHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Item
  const [item, setItem] = useState<Item>({
    item_code: '',
    item_name: '',
    name: '',
    category_id: null,
    default_price: 0,
    item_type: 1,
    invoice_nominal: 0,
    prices: [
      {
        id: null,
        price_store: [],
        periodic_start: '',
        periodic_end: '',
        min_order: 0,
        price: 0,
      },
    ],
  })

  // Store
  const [store, setStore] = useState<Store[]>([])
  const [storeGroup, setStoreGroup] = useState<any[]>([])

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

      if (Array.isArray(response.data.data)) {
        const tempStore = response.data.data.map((item: any) => ({
          store_id: item.id,
          store_group_id: item.area_id,
          label: item.store_name,
        }))

        setStore(tempStore)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getStoreGroup = async () => {
    try {
      const response = await axios.get(`${apiUrl}/area`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempStoreGroup = response.data.data.map((item: any) => ({
          store_group_id: item.id,
          label: item.area,
        }))

        setStoreGroup(tempStoreGroup)
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
    getStoreGroup()
    getCategories()
  }, [])

  // Add Item Detail
  const handleAddForm = () => {
    const newItemDetail = {
      id: null,
      price_store: [],
      periodic_start: '',
      periodic_end: '',
      min_order: 0,
      price: 0,
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

  const handleMarginTypeChange = (isChecked: boolean) => {
    setItem({
      ...item,
      item_type: isChecked ? 1 : 2,
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
        cache.prices[index].price_store = allStoreIds.map((storeId) => ({store_id: storeId}))
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

  // Item Validation
  const ItemValidation = () => {
    let valid = true

    if (!item.name) {
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
  const handleSubmitNewItem = async () => {
    if (!ItemValidation()) {
      return false
    }

    setIsLoading(true)

    await axios
      .post(`${apiUrl}/items`, item, {
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
          }).then(() => {
            window.location.reload()
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
        console.error(error)
        setIsLoading(false)

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

                    <Form.Check
                      id={`item-type`}
                      className='mt-2'
                      label='Gratis ?'
                      type='checkbox'
                      checked={item.item_type === 1}
                      onChange={(e) => handleMarginTypeChange(e.target.checked)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-4'>
                  <Form.Label className='fs-5 fw-bold' column sm='4'>
                    Harga Normal :
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

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5 fw-bold' column sm='4'>
                  Harga Kepada Vendor:
                </Form.Label>

                <Col sm='8'>
                  <Form.Control
                    name='invoice_nominal'
                    type='number'
                    value={item.invoice_nominal}
                    onChange={(e) => itemFormHandler(e)}
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
              Tambah Periode Order
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
                        className='date-range ms-3 w-100'
                        format={'DD-MM-YYYY'}
                        onChange={(values) => {
                          if (values && values.length === 2) {
                            const dateFromFormatted = values[0]?.format('YYYY-MM-DD')
                            const dateToFormatted = values[1]?.format('YYYY-MM-DD')

                            setItem((prev) => {
                              const cache = {...prev}
                              cache.prices[index] = {
                                ...cache.prices[index],
                                periodic_start: dateFromFormatted ?? '',
                                periodic_end: dateToFormatted ?? '',
                              }

                              return cache
                            })
                          } else {
                            setItem((prev) => {
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
                <Modal.Title>Assign To Store - Item Promo</Modal.Title>
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
              disabled={isLoading}
              onClick={() => handleSubmitNewItem()}
            >
              {isLoading ? 'Saving..' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewItemHO}
