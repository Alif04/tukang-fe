import React, {FC, useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import axios from 'axios'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import {DatePicker} from 'antd'
import makeAnimated from 'react-select/animated'
import {Form, Button, Row, Col, Card} from 'react-bootstrap'

const {RangePicker} = DatePicker

interface StoreSelect {
  id?: number | null
  all_store: number | null
  store_group_id: number | null
  store_id: number
  store_name: string
}

interface Promotion {
  name: string
  start_date: string
  end_date: string
  min_order: number
  promotion: number
  promotion_type: number
  promotion_store: any[]
}

const UpdatePromotionQuotation: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch Data
  const fetchPromotionData = async () => {
    try {
      await axios
        .get(`${apiUrl}/promotion/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            // 'Access-Control-Allow-Origin': '*',
           // 'ngrok-skip-browser-warning':  'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          if (data) {
            const promotionStores = data.promotion_stores.map((item: any) => ({
              id: item.id,
              store_id: item.store.id,
            }))

            setPromo((prev) => ({
              ...prev,
              name: data?.name,
              start_date: dayjs(data?.periodic_start).toISOString(),
              end_date: dayjs(data?.periodic_end).toISOString(),
              min_order: data?.min_order,
              promotion: data?.promotion,
              promotion_type: data?.promotion_type,
              promotion_store: promotionStores,
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
        //  // 'Access-Control-Allow-Origin': '*',
        // // 'ngrok-skip-browser-warning':  'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempStore = response.data.data.map((item: any) => ({
          store_id: item.id,
          store_name: item.store_name,
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
        //  // 'Access-Control-Allow-Origin': '*',
        // // 'ngrok-skip-browser-warning':  'true',
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

  useEffect(() => {
    fetchPromotionData()
    getStore()
    getStoreGroup()
  }, [])

  // Store
  const [store, setStore] = useState<StoreSelect[]>([])
  const [storeGroup, setStoreGroup] = useState<any[]>([])

  // Promotion
  const [promo, setPromo] = useState<Promotion>({
    name: '',
    start_date: '',
    end_date: '',
    min_order: 0,
    promotion: 0,
    promotion_type: 1,
    promotion_store: [],
  })

  console.log('promo', promo)

  // Promotion Form Handler
  const promoFormHandler = (e: any) => {
    setPromo({
      ...promo,
      [e.target.name]: e.target.value,
    })
  }

  // Store Handler
  const storeHandler = (selectedOptions: any) => {
    const updatedStore = selectedOptions.map((option: any) => ({
      id: option?.id ?? null,
      store_id: option.store_id,
    }))

    setPromo((prev) => ({
      ...prev,
      promotion_store: updatedStore,
    }))
  }

  const handleAssignToStoreByAllStore = (store_id: any, isChecked: boolean) => {
    setPromo((prev) => {
      const cache = {...prev}

      // Jika checkbox "All Store" dicentang
      if (store_id === 0 && isChecked) {
        const allStoreIds = store.map((storeItem) => storeItem.store_id)
        cache.promotion_store = allStoreIds.map((storeId) => ({store_id: storeId}))
      } else if (!isChecked) {
        cache.promotion_store = []
      }

      return cache
    })
  }

  const handleAssignToStoreByStoreGroup = (store_group_id: any, isChecked: boolean) => {
    setPromo((prev) => {
      const cache = {...prev}

      if (store_group_id && isChecked) {
        // Mengambil store dari store_group yang dicentang
        const storesInGroup = store.filter(
          (storeItem) => storeItem.store_group_id === store_group_id
        )

        // Mengambil store_id dari storesInGroup
        const storeIds = storesInGroup.map((storeItem) => storeItem.store_id)

        // Menggabungkan store_id ke price_store
        cache.promotion_store.push(...storeIds.map((storeId) => ({store_id: storeId})))
      } else if (!isChecked) {
        // Mengambil store dari store_group yang dicentang
        const storesInGroup = store.filter(
          (storeItem) => storeItem.store_group_id === store_group_id
        )

        // Mengecek jika tidak ada store_group yang dicentang maka diuncheck
        cache.promotion_store = cache.promotion_store.filter(
          (store: any) => !storesInGroup.some((storeItem) => storeItem.store_id === store.store_id)
        )
      }

      return cache
    })
  }

  const handleAssignToStore = (store_id: any, isChecked: boolean) => {
    setPromo((prev) => {
      const cache = {...prev}

      if (store_id !== null) {
        const storeIndex = cache.promotion_store.findIndex((store) => store.store_id === store_id)

        if (isChecked) {
          // Jika checkbox di-check, tambahkan store_id ke price_store
          if (storeIndex === -1) {
            cache.promotion_store.push({store_id})
          }
        } else {
          // Jika checkbox di-uncheck, hapus store_id dari price_store
          if (storeIndex !== -1) {
            cache.promotion_store.splice(storeIndex, 1)
          }
        }
      }

      return cache
    })
  }

  const isStoreChecked = (store_id: any) => {
    return promo.promotion_store.some((store: any) => store.store_id === store_id)
  }

  // Checbox Handler
  const handleCheckboxChange = (isChecked: boolean) => {
    setPromo({
      ...promo,
      promotion_type: isChecked ? 1 : 2,
    })
  }

  // Incentive Validation
  const IncentiveValidation = () => {
    let valid = true

    if (!promo.min_order) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Min Order form',
        icon: 'warning',
      })
      valid = false
    } else if (!promo.promotion) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Promotion form',
        icon: 'warning',
      })
      valid = false
    } else if (promo.promotion_store.length === 0) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Assign To Store form',
        icon: 'warning',
      })
      valid = false
    }

    return valid
  }

  // Desctructure Object if the value null or empty string
  const objectValueCheck = (data: Promotion) => {
    let cleanedData: Partial<Promotion> = {}

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        cleanedData[key as keyof Promotion] = value
      }
    })

    return cleanedData
  }

  // Handle Create
  const handleUpdate = async () => {
    if (!IncentiveValidation()) {
      setIsLoading(false)
      return false
    }

    setIsLoading(true)
    const promoData = objectValueCheck(promo)
    await axios
      .post(`${apiUrl}/promotion/${params.id}`, promoData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        //  // 'Access-Control-Allow-Origin': '*',
        // // 'ngrok-skip-browser-warning':  'true',
        },
      })
      .then((response) => {
        if (response.data.status === 201) {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'Success Update Promotion',
            showConfirmButton: false,
            timer: 1500,
          })

          setIsLoading(false)
        } else {
          setIsLoading(false)

          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })
        }

        navigate('/promotion-quotation/view-promotion')
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
    <section id='new-user'>
      <Card className='mb-5'>
        <Card.Body>
          <Row className='mb-5'>
            <Col xxl={6} xl={6} md={6} sm={12}>
              <Form.Group className='form-template'>
                <Form.Label className='fs-5'>Nama Promosi :</Form.Label>

                <Form.Control
                  name='name'
                  type='text'
                  value={promo.name}
                  onChange={(e) => promoFormHandler(e)}
                />
              </Form.Group>
            </Col>

            <Col xxl={6} xl={6} md={6} sm={12}>
              <Form.Group className='form-template'>
                <Form.Label className='fs-5'>Periode Promosi :</Form.Label>

                <RangePicker
                  className='date-range w-100'
                  format={'DD-MM-YYYY'}
                  allowClear={false}
                  value={[
                    dayjs(promo.start_date, 'YYYY-MM-DD') ?? null,
                    dayjs(promo.end_date, 'YYYY-MM-DD') ?? null,
                  ]}
                  onChange={(values) => {
                    if (values && values.length === 2) {
                      const dateFromFormatted = values[0]?.format('YYYY-MM-DD')
                      const dateToFormatted = values[1]?.format('YYYY-MM-DD')

                      setPromo((prev) => ({
                        ...prev,
                        start_date: dateFromFormatted ?? '',
                        end_date: dateToFormatted ?? '',
                      }))
                    } else {
                      setPromo((prev) => ({
                        ...prev,
                        start_date: '',
                        end_date: '',
                      }))
                    }
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className='mb-5'>
            <Col xxl={6} xl={6} md={6} sm={12}>
              <Form.Group className='form-template'>
                <Form.Label className='fs-5'>Harga Promosi :</Form.Label>

                <Form.Control
                  name='promotion'
                  type='number'
                  value={promo.promotion}
                  onChange={(e) => promoFormHandler(e)}
                />

                <Form.Check
                  inline
                  label='Persen'
                  name='type'
                  type='checkbox'
                  checked={promo.promotion_type === 1}
                  className='mt-2'
                  onChange={(e) => handleCheckboxChange(e.target.checked)}
                />
              </Form.Group>
            </Col>

            <Col xxl={6} xl={6} md={6} sm={12}>
              <Form.Group className='form-template'>
                <Form.Label className='fs-5'>Minimal Belanja ( Rupiah ) :</Form.Label>

                <Form.Control
                  name='min_order'
                  type='number'
                  value={promo.min_order}
                  onChange={(e) => promoFormHandler(e)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className='mb-5'>
            <Form.Group className='mb-5'>
              <Form.Label className='fs-5'>Assign To Store : </Form.Label>

              <Row>
                <Form.Label className='fs-5'>Shortcut</Form.Label>

                <Col xxl={3} xl={3} md={3} sm={12} className='all-store'>
                  <Form.Check
                    label='All Store'
                    name='all-store'
                    value={0}
                    type='checkbox'
                    onChange={(e) => handleAssignToStoreByAllStore(0, e.target.checked)}
                  />
                </Col>

                <Col xxl={9} xl={9} md={9} sm={12}>
                  <Row>
                    {storeGroup.map((item) => (
                      <Col key={item.store_group_id} xs={12} sm={6} md={3} lg={3} className='mb-3'>
                        <Form.Check
                          className='mb-3'
                          key={item.store_group_id}
                          inline
                          name='store-group'
                          type='checkbox'
                          value={item.store_group_id}
                          label={item.label}
                          onChange={(e) =>
                            handleAssignToStoreByStoreGroup(item.store_group_id, e.target.checked)
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
                <Form.Label className='fs-5'>List Store</Form.Label>
              </Row>

              <Row>
                {store.map((item) => (
                  <Col key={item.store_id} xs={12} sm={6} md={4} lg={4} className='mb-3'>
                    <Form.Check
                      inline
                      name='store'
                      type='checkbox'
                      value={item.store_id}
                      label={item.store_name}
                      checked={isStoreChecked(item.store_id)}
                      onChange={(e) => handleAssignToStore(item.store_id, e.target.checked)}
                    />
                  </Col>
                ))}
              </Row>
            </Form.Group>
          </Row>

          <div className='d-flex justify-content-center'>
            <Button
              className='d-flex justify-content-center align-items-center'
              variant='dark-primary'
              type='submit'
              disabled={isLoading}
              onClick={() => handleUpdate()}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {UpdatePromotionQuotation}
