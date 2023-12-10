/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ViewCalendar.css'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import axios from 'axios'
import dayjs from 'dayjs'
import {Container, Row, Col, Modal, Form} from 'react-bootstrap'

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

const ViewCalendarCS: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL

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
                const workOrderItems = item?.work_order_status[0]?.work_order_items
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

export {ViewCalendarCS}
