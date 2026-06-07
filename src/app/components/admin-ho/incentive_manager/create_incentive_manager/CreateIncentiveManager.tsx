import React, {FC, useState, useEffect, ChangeEvent} from 'react'
import {useNavigate} from 'react-router-dom'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import {Form, Button, Row, Col, Card} from 'react-bootstrap'

interface StoreSelect {
  all_store: number | null
  store_group_id: number | null
  store_id: number
  store_name: string
}

interface IncentiveManager {
  name: string
  min_order: number
  max_order: number
  incentive: number
  min_invoice: number
  type: number
  is_manager: boolean
  stores: any[]
}

const CreateIncentiveManager: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const animatedComponents = makeAnimated()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch Data
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
          store_group_id: item.area_id,
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
    getStore()
    getStoreGroup()
  }, [])

  // Store
  const [store, setStore] = useState<StoreSelect[]>([])
  const [storeGroup, setStoreGroup] = useState<any[]>([])

  // Incentive
  const [incentive, setIncentive] = useState<IncentiveManager>({
    name: '',
    min_order: 0,
    max_order: 0,
    min_invoice:0,
    incentive: 0,
    type: 1,
    is_manager: true,
    stores: [],
  })

  // Incentive Form Handler
  const incentiveFormHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target

    setIncentive({
      ...incentive,
      [name]: name === 'min_order' || name === 'incentive'  || name === 'min_invoice'? Number(value) : value,
    })
  }

  // Store Handler
  const storeHandler = (selectedOptions: any) => {
    setIncentive((prev) => ({
      ...prev,
      stores: selectedOptions.map((option: any) => option.id),
    }))
  }

  const handleAssignToStoreByAllStore = (store_id: any, isChecked: boolean) => {
    setIncentive((prev) => {
      const cache = {...prev}

      // Jika checkbox "All Store" dicentang
      if (store_id === 0 && isChecked) {
        cache.stores = store.map((storeItem) => storeItem.store_id)
      } else if (!isChecked) {
        cache.stores = []
      }

      return cache
    })
  }

  const handleAssignToStoreByStoreGroup = (store_group_id: any, isChecked: boolean) => {
    setIncentive((prev) => {
      const cache = {...prev}

      if (store_group_id && isChecked) {
        const storesInGroup = store.filter(
          (storeItem) => storeItem.store_group_id === store_group_id
        )
        const storeIds = storesInGroup.map((storeItem) => storeItem.store_id)
        cache.stores.push(...storeIds)
      } else if (!isChecked) {
        const storesInGroup = store.filter(
          (storeItem) => storeItem.store_group_id === store_group_id
        )
        cache.stores = cache.stores.filter(
          (store_id: any) => !storesInGroup.some((storeItem) => storeItem.store_id === store_id)
        )
      }

      return cache
    })
  }

  const handleAssignToStore = (store_id: any, isChecked: boolean) => {
    setIncentive((prev) => {
      const cache = {...prev}

      if (store_id !== null) {
        const storeIndex = cache.stores.indexOf(store_id)

        if (isChecked) {
          if (storeIndex === -1) {
            cache.stores.push(store_id)
          }
        } else {
          if (storeIndex !== -1) {
            cache.stores.splice(storeIndex, 1)
          }
        }
      }

      return cache
    })
  }

  const isStoreChecked = (store_id: any) => {
    return incentive.stores.includes(store_id)
  }

  // Checbox Handler
  const handleCheckboxChange = (isChecked: boolean) => {
    setIncentive({
      ...incentive,
      type: isChecked ? 1 : 2,
    })
  }
  const handleCheckboxChange2= (isChecked: boolean) => {
    console.log(isChecked);
    
    setIncentive({
      ...incentive,
      is_manager: isChecked===false? false : true ,
    })
  }

  // Incentive Validation
  const IncentiveValidation = () => {
    let valid = true

    if (!incentive.name) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Name form',
        icon: 'warning',
      })
      valid = false
    } else if (!incentive.min_order) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Min Order form',
        icon: 'warning',
      })
      valid = false
    }  else if (!incentive.incentive) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Incentive Manager form',
        icon: 'warning',
      })
      valid = false
    } else if (incentive.stores.length === 0) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Assign To Store form',
        icon: 'warning',
      })
      valid = false
    }else if (!incentive.min_invoice) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill Min Invoice form',
        icon: 'warning',
      })
      valid = false
    }

    return valid
  }

  // Desctructure Object if the value null or empty string
  const objectValueCheck = (data: IncentiveManager) => {
    let cleanedData: Partial<IncentiveManager> = {}

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        cleanedData[key as keyof IncentiveManager] = value
      }
    })

    return cleanedData
  }

  // Handle Create
  const handleSubmit = async () => {
    if (!IncentiveValidation()) {
      setIsLoading(false)
      return false
    }

    setIsLoading(true)
    const incentiveData = objectValueCheck(incentive)
    await axios
      .post(`${apiUrl}/incentive`, incentiveData, {
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
            text: 'Success Create Incentive Manager',
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

        navigate('/incentive-Manager/view-incentive')
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
            <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Nama Insentif :</Form.Label>

              <Form.Control
                name='name'
                type='text'
                onChange={(e) => incentiveFormHandler(e as ChangeEvent<HTMLInputElement>)}
              />
            </Form.Group>
          </Row>

          <Row className='mb-5'>
            <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Intensif Manager :</Form.Label>

              <Form.Control
                name='incentive'
                type='number'
                defaultValue={0}
                onChange={(e) => incentiveFormHandler(e as ChangeEvent<HTMLInputElement>)}
              />

              <Form.Check
                inline
                label='Persen'
                name='type'
                type='checkbox'
                checked={incentive.type === 1}
                className='mt-2'
                onChange={(e) => handleCheckboxChange(e.target.checked)}
              />
            </Form.Group>
          </Row>

          <Row className='mb-5'>
            <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Minimal Order ( Rupiah ) :</Form.Label>

              <Form.Control
                name='min_order'
                type='number'
                defaultValue={0}
                onChange={(e) => incentiveFormHandler(e as ChangeEvent<HTMLInputElement>)}
              />
            </Form.Group>
          </Row>

          <Row className='mb-5'>
            {/* <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Maksimal Order ( Rupiah ) :</Form.Label>

              <Form.Control
                name='max_order'
                type='number'
                defaultValue={0}
                onChange={(e) => incentiveFormHandler(e as ChangeEvent<HTMLInputElement>)}
              />
            </Form.Group> */}
          </Row>
          <Row className='mb-5'>
            <Form.Group className='form-template'>
            <Form.Check
                inline
                label='Insetif Manager'
                name='type'
                type='checkbox'
                checked={incentive.is_manager}
                className='mt-2'
                onChange={(e) => handleCheckboxChange2(e.target.checked)}
              />
            </Form.Group>
          </Row>
          {incentive.is_manager &&  <Row className='mb-5'>
            <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Minimal Invoice :</Form.Label>

              <Form.Control
                name='min_invoice'
                type='number'
                defaultValue={0}
                onChange={(e) => incentiveFormHandler(e as ChangeEvent<HTMLInputElement>)}
              />
            </Form.Group>
          </Row>}
         
          <Row className='mb-5'>
            {/* <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Assign To Store :</Form.Label>

              <Select
                name='stores'
                classNamePrefix='select'
                placeholder='Pilih Toko'
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={store}
                onChange={storeHandler}
                getOptionLabel={(option: StoreSelect) =>
                  store.find((storeItem) => storeItem.id === option.id)?.store_name ?? ''
                }
                getOptionValue={(option) => `${option.id}`}
              />
            </Form.Group> */}

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
              onClick={() => handleSubmit()}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {CreateIncentiveManager}
