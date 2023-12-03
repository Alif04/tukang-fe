/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ViewCalendar.css'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import axios from 'axios'
import dayjs from 'dayjs'
import Select from 'react-select'
import {Container, Row, Col, Modal, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch, faFilter} from '@fortawesome/free-solid-svg-icons'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

interface StoreItem {
  value: number | null
  label: string
}

interface VendorItem {
  value: number | null
  label: string
}

interface WorkOrder {
  id: any
  order_id: any
  title: string
  work_order_status: string
  start: string
  end: string
  service: string
  tukang: string
  className: string
}

const ViewCalendarHO: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [store, setStore] = useState<StoreItem[]>([])
  const [vendor, setVendor] = useState<VendorItem[]>([])
  const [searchByStore, setSearchByStore] = useState<any>('')
  const [searchByVendor, setSearchByVendor] = useState<any>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const handleChangeSelectStore = (element: any) => {
    const updatedStoreId = element.value
    setSearchByStore(updatedStoreId)
  }

  const handleChangeSelectVendor = (element: any) => {
    const updatedVendorId = element.value
    setSearchByVendor(updatedVendorId)
  }

  const [workOrder, setWorkOrder] = useState<WorkOrder[]>([
    {
      id: '',
      order_id: '',
      work_order_status: '',
      title: '',
      start: '',
      end: '',
      service: '',
      tukang: '',
      className: '',
    },
  ])

  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null)

  // Fetch Data
  useEffect(() => {
    const getWorkOrder = async () => {
      try {
        await axios
          .get(`${apiUrl}/work-orders`, {
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
              const workOrderDetail = data.map((item: any) => {
                const workOrderItems = item?.work_order_status[1]?.work_order_items
                  .map((service: any) => service.name ?? '')
                  .join(', ')

                const workOrderTukang = item?.work_order_tukang
                  .map((item: any) => item.tukang.full_name ?? '')
                  .join(', ')

                return {
                  id: item?.id.toString(),
                  order_id: item?.order_id.toString(),
                  title: `WORK ORDER - ${item.id}`,
                  work_order_status: item?.work_order_status[0]?.status.category,
                  service: workOrderItems ?? '',
                  tukang: workOrderTukang ?? '',
                  start: dayjs(item?.work_start_date).format('YYYY-MM-DD'),
                  end: dayjs(item?.work_end_date).format('YYYY-MM-DD'),
                }
              })

              setWorkOrder(workOrderDetail)
            }
          })
      } catch (error) {
        console.error(error)
      }
    }

    getWorkOrder()
  }, [])

  useEffect(() => {
    const getStore = async () => {
      try {
        const response = await axios.get(`${apiUrl}/stores`, {
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
          }))

          setStore(tempStore)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const getVendor = async () => {
      try {
        const response = await axios.get(`${apiUrl}/vendor`, {
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

          setVendor(tempVendor)
        } else {
          console.error('API response data is not an array:', response.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    getStore()
    getVendor()
  }, [])

  // MODAL
  const [showModal, setShowModal] = useState(false)

  const handleShowModal = (id: string) => {
    const selected = workOrder.find((order) => order.id === id)
    if (selected) {
      setSelectedWorkOrder(selected)
      setShowModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  useEffect(() => {
    const updatedWorkOrder = workOrder.map((order) => {
      const status = order?.work_order_status

      switch (status) {
        case 'SURVEYSTART':
          return {...order, className: 'bg-primary'}
        case 'WORKSTART':
          return {...order, className: 'bg-success'}
        case 'WIP':
          return {...order, className: 'bg-primary'}
        case 'WORKEND':
          return {...order, className: 'bg-success'}
        case 'REWORK':
          return {...order, className: 'bg-primary'}
        case 'REWORKSTART':
          return {...order, className: 'bg-secondary'}
        case 'RIP':
          return {...order, className: 'bg-secondary'}
        case 'REWORKEND':
          return {...order, className: 'bg-warning'}
        case 'RESCHEDULE':
          return {...order, className: 'bg-primary'}
        default:
          return {...order, className: 'bg-primary'}
      }
    })

    setWorkOrder(updatedWorkOrder)
  }, [selectedWorkOrder?.work_order_status])

  return (
    <section id='view-calendar'>
      <Row className='mb-5'>
        <Col xxl={4} xl={6} lg={6} md={6} sm={12}>
          <Form.Group as={Row}>
            <Form.Label className='fs-3' column sm='3'>
              <FontAwesomeIcon icon={faFilter} size='sm' className='me-1' />
              Date :
            </Form.Label>

            <Col sm='8'>
              <RangePicker
                className='date-range ms-3'
                onChange={(values) => {
                  if (values && values.length === 2) {
                    const dateFromFormatted = values[0]?.format('YYYY-MM-DD')
                    const dateToFormatted = values[1]?.format('YYYY-MM-DD')

                    setDateFrom(dateFromFormatted)
                    setDateTo(dateToFormatted)
                  } else {
                    setDateFrom('')
                    setDateTo('')
                  }
                }}
              />
            </Col>
          </Form.Group>
        </Col>

        <Col xxl={4} xl={6} lg={6} md={6} sm={12}>
          <div className='filter-search'>
            <InputGroup>
              <InputGroup.Text className='filter-ltr'>
                <FontAwesomeIcon icon={faSearch} size='sm' />
              </InputGroup.Text>

              <Form.Control
                placeholder='Search'
                className='filter-ltr'
                onChange={handleChangeSearchFilter}
              />
            </InputGroup>
          </div>
        </Col>

        <Col xxl={2} xl={6} lg={6} md={6} sm={12}>
          <Select
            name='store_id'
            className='form-control p-0'
            classNamePrefix='select'
            placeholder='Pilih Toko'
            isSearchable={true}
            options={store}
            onChange={(element) => handleChangeSelectStore(element)}
          />
        </Col>

        <Col xxl={2} xl={6} lg={6} md={6} sm={12}>
          <Select
            name='vendor_id'
            className='form-control p-0'
            classNamePrefix='select'
            placeholder='Pilih Vendor'
            isSearchable={true}
            options={vendor}
            onChange={(element) => handleChangeSelectVendor(element)}
          />
        </Col>
      </Row>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        initialView='dayGridMonth'
        weekends={true}
        events={workOrder}
        eventClick={(info) => handleShowModal(info.event.id)}
      />

      <Modal centered show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedWorkOrder?.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Row>
              <Form.Group as={Row} className='mb-4'>
                <Form.Label column md={6} className='pt-0 fs-3 fw-semibold'>
                  Nama Tukang :
                </Form.Label>

                <Col md={6}>
                  <p className='fs-5'>{selectedWorkOrder?.tukang}</p>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className=' mb-4'>
                <Form.Label column md={6} className='pt-0 fs-3 fw-semibold'>
                  Jenis Perkerjaan :
                </Form.Label>

                <Col md={6}>
                  <p className='fs-5'>{selectedWorkOrder?.service}</p>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label column md={6} className='pt-0  fs-3 fw-semibold'>
                  Status Pengerjaan :
                </Form.Label>

                <Col md={6}>
                  <p className='fs-5'>{selectedWorkOrder?.work_order_status}</p>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className=' mb-4'>
                <Form.Label column md={6} className='pt-0 fs-3 fw-semibold'>
                  Tanggal Mulai :
                </Form.Label>

                <Col md={6}>
                  <p className='fs-5'>{selectedWorkOrder?.start}</p>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className=' mb-4'>
                <Form.Label column md={6} className='pt-0 fs-3 fw-semibold'>
                  Tanggal Selesai :
                </Form.Label>

                <Col md={6}>
                  <p className='fs-5'>{selectedWorkOrder?.end}</p>
                </Col>
              </Form.Group>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </section>
  )
}

export {ViewCalendarHO}
