/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ViewCalendar.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import axios from 'axios'
import dayjs from 'dayjs'
import {Row, Col, Modal, Form, Table, Accordion} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleInfo} from '@fortawesome/free-solid-svg-icons'

interface WorkOrder {
  id: any
  title: string
  start: string
  end: string
  status_order: string
  className: string
  work_order_detail?: any
}

const ViewCalendarTukang: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const tukangId = localStorage.getItem('tukang_id')

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [workOrder, setWorkOrder] = useState<WorkOrder[]>([
    {
      id: '',
      title: '',
      start: '',
      end: '',
      status_order: '',
      className: '',
    },
  ])

  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null)

  // Fetch Data
  const getWorkOrder = async (start: any, end: any) => {
    try {
      await axios
        .get(
          `${apiUrl}/work-orders?tukang_id=${tukangId}&take=0&order_by=desc&date_from=${start}&date_to=${end}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          }
        )
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

              const startDate =
                item.survey_date !== null && item.work_start_date === null
                  ? item.survey_date
                  : item.survey_date && item.work_start_date
                  ? item.work_start_date
                  : null

              const endDate =
                item.survey_date !== null && item.work_end_date === null
                  ? item.survey_date
                  : item.survey_date && item.work_end_date
                  ? item.work_end_date
                  : null

              const orderStatus = (() => {
                if (item?.work_orders?.work_order_status?.length >= 0) {
                  if (['QUOTEIN', 'QUOTEOUT'].includes(item?.status?.category)) {
                    return item?.status?.category
                  } else if (
                    ['WORKREQ'].includes(item?.status?.category) &&
                    item?.payment_type === 'survey' &&
                    !['WORKSTART', 'WIP', 'WORKEND'].includes(
                      item?.work_orders?.work_order_status[0]?.status?.category
                    )
                  ) {
                    return item?.status?.category
                  } else {
                    return item?.work_orders?.work_order_status[0]?.status?.category
                  }
                } else {
                  return item?.status?.category
                }
              })()

              const contextualColor = (() => {
                switch (orderStatus) {
                  case 'WORKEND':
                    return 'bg-calendar-order-done'
                  case 'RESCHEDULE':
                    return 'bg-calendar-order-reschedule'
                  case 'INVESTIGATED':
                    return 'bg-calendar-order-complaint'
                  default:
                    return 'bg-primary'
                }
              })()

              return {
                id: item?.id.toString(),
                order_id: item?.order_id.toString(),
                title: `WORK ORDER - ${item.id}`,
                work_order_status: item?.work_order_status[0]?.status.category,
                service: workOrderItems ?? '',
                tukang: workOrderTukang ?? '',
                start: dayjs(startDate).format('YYYY-MM-DD'),
                end: dayjs(endDate).format('YYYY-MM-DD'),
                order_status: orderStatus,
                className: contextualColor,
                work_order_detail: item,
              }
            })

            setWorkOrder(workOrderDetail)
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (dateFrom && dateTo) {
      getWorkOrder(dateFrom, dateTo)
    }
  }, [dateFrom, dateTo])

  const handleDatesSet = (arg: any) => {
    const start = dayjs(arg.startStr).format('YYYY-MM-DD')
    const end = dayjs(arg.endStr).format('YYYY-MM-DD')

    setDateFrom(start)
    setDateTo(end)
  }

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

  // Format Date
  const formatDate = (date: any) => {
    if (isNaN(date.getTime())) {
      return ''
    }

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  const formatDateTime = (date: any) => {
    if (isNaN(date.getTime())) {
      return ''
    }

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `Tanggal ${day}-${month}-${year} Jam ${hours}:${minutes}`
  }

  // Grand Total Order
  const calculateTotal = (orderDetail: any) => {
    const {payment_type, is_overdistance, grand_total, additional_fee} = orderDetail ?? {}

    let totalAmount = 0

    if (payment_type === 'gratis') {
      totalAmount = is_overdistance === 0 ? 0 : Number(grand_total)
    } else if (payment_type === 'pemasangan_tanpa_survey') {
      totalAmount = is_overdistance === 0 ? Number(grand_total) : Number(grand_total)
    } else if (payment_type === 'survey') {
      totalAmount =
        is_overdistance === 0 ? 99000 : Number(grand_total) + Number(additional_fee) ?? 0
    }

    return `Rp. ${Number(totalAmount).toLocaleString('id')}`
  }

  return (
    <section id='view-calendar'>
      <Accordion className='mb-5'>
        <Accordion.Item eventKey='0'>
          <Accordion.Header>
            <FontAwesomeIcon icon={faCircleInfo} size='lg' className='me-2' />
            <p className='fs-7 fw-bold'>Panduan Warna Kalendar</p>
          </Accordion.Header>

          <Accordion.Body>
            <div className='description fs-7 mb-5'>
              Informasi mengenai keterangan warna didalam kalendar
            </div>

            <div className='vendor-avail'>
              <Table>
                <thead>
                  <tr>
                    <th>Status Order</th>
                    <th>Warna</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Order sedang dalam pengerjaan</td>

                    <td>
                      <div className='box-primary'></div>
                    </td>
                  </tr>

                  <tr>
                    <td>Order Selesai</td>
                    <td>
                      <div className='box-success'></div>
                    </td>
                  </tr>

                  <tr>
                    <td>Order yang dijadwalkan ulang</td>
                    <td>
                      <div className='box-warning'></div>
                    </td>
                  </tr>

                  <tr>
                    <td>Order yang dikomplain</td>
                    <td>
                      <div className='box-danger'></div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        initialView='dayGridMonth'
        weekends={true}
        events={workOrder}
        datesSet={handleDatesSet}
        eventClick={(info) => handleShowModal(info.event.id)}
      />

      <Modal
        dialogClassName='modal-calendar-detail'
        centered
        show={showModal}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedWorkOrder?.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className='form-header mb-5'>
            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <Form.Label className='fs-4 fw-bold'>
                Nama Toko :{' '}
                <span className='fs-4 ms-2 fw-normal'>
                  {selectedWorkOrder?.work_order_detail?.order?.store?.store_name ?? ''}
                </span>
              </Form.Label>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <Col>
                <Form.Label className='fs-4 fw-bold'>
                  Order ID :{' '}
                  <span className='fs-4 ms-2 fw-normal'>
                    {selectedWorkOrder?.work_order_detail?.order?.id ?? ''}
                  </span>
                </Form.Label>
              </Col>

              <Col>
                <Form.Label className='fs-4 fw-bold'>
                  Work Order ID :{' '}
                  <span className='fs-4 ms-2 fw-normal'>
                    {selectedWorkOrder?.work_order_detail?.id ?? '-'}
                  </span>
                </Form.Label>
              </Col>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <Col>
                <Form.Label className='fs-4 fw-bold'>
                  Receipt Number :
                  <span className='fs-4 ms-2 fw-normal'>
                    {selectedWorkOrder?.work_order_detail?.order?.receipt_number ?? '-'}
                  </span>
                </Form.Label>
              </Col>

              <Col>
                <Form.Label className='fs-4 fw-bold'>
                  Work Order Status :
                  <span className='fs-4 ms-2 fw-bold text-success'>
                    {selectedWorkOrder?.work_order_detail?.work_order_status[0]?.status
                      ?.description ?? ''}
                  </span>
                </Form.Label>
              </Col>
            </Col>
          </Row>

          <Row className='information-detail mb-5'>
            <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='costumer-info mb-5'>
              <div className='fs-4 fw-bold'>Informasi Pembeli</div>
              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      No Member :
                    </Form.Label>
                    <Col sm='6'>
                      <p className='fs-7'>
                        {selectedWorkOrder?.work_order_detail?.order?.members?.member_number ?? ''}
                      </p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Customer Name :
                    </Form.Label>
                    <Col sm='6'>
                      <p className='fs-7'>
                        {selectedWorkOrder?.work_order_detail?.order?.members?.full_name ?? ''}
                      </p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Alamat Pemasangan
                    </Form.Label>
                    <Col sm='6'>
                      <p className='fs-7'>
                        {selectedWorkOrder?.work_order_detail?.order?.project_address ?? ''}
                      </p>
                    </Col>
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='4'>
                      Nomor Telp/WA :
                    </Form.Label>

                    <Col sm='8'>
                      <p className='fs-7'>
                        {selectedWorkOrder?.work_order_detail?.order?.project_number ?? ''}
                      </p>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='4'>
                      Alamat Email
                    </Form.Label>

                    <Col sm='8'>
                      <p className='fs-7'>
                        {selectedWorkOrder?.work_order_detail?.order?.members?.email ?? ''}{' '}
                      </p>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </Col>

            <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='sales-info mb-5'>
              <Row>
                {['SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE'].includes(
                  selectedWorkOrder?.work_order_detail?.work_order_status.length !== 0
                    ? selectedWorkOrder?.work_order_detail?.work_order_status[0]?.status?.category
                    : selectedWorkOrder?.work_order_detail?.order?.status?.category
                ) && (
                  <Col>
                    <div className='survey mb-3'>
                      <div className='detail-info mb-3'>
                        <p className='fs-4 fw-bold'>Survey dikerjakan pada:</p>
                        <p className='fs-7'>
                          {formatDateTime(
                            new Date(selectedWorkOrder?.work_order_detail?.survey_date)
                          )}
                        </p>
                      </div>

                      <div className='detail-info mb-3'>
                        <p className='fs-5 fw-bold'>Oleh:</p>
                        <p className='fs-7'>
                          {selectedWorkOrder?.work_order_detail?.work_order_tukang
                            .filter((x: any) => x.type === 1)
                            .map((item: any) => item?.tukang?.full_name)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </Col>
                )}

                {[
                  'WORKREQ',
                  'WORKSTART',
                  'WIP',
                  'WORKEND',
                  'REWORK',
                  'REWORKSTART',
                  'RIP',
                  'REWORKEND',
                  'RESCHEDULE',
                  'DONE',
                ].includes(
                  selectedWorkOrder?.work_order_detail?.work_order_status.length !== 0
                    ? selectedWorkOrder?.work_order_detail?.work_order_status[0]?.status?.category
                    : selectedWorkOrder?.work_order_detail?.order?.status?.category
                ) && (
                  <Col>
                    <div className='work-date'>
                      <p className='fs-4 fw-bold'>Pekerjaan dilakukan pada:</p>

                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='3'>
                          MULAI
                        </Form.Label>

                        <Col sm='9'>
                          <p className='fs-7'>
                            {formatDateTime(
                              new Date(selectedWorkOrder?.work_order_detail?.work_start_date)
                            )}
                          </p>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className='detail-info'>
                        <Form.Label column sm='3'>
                          SELESAI
                        </Form.Label>

                        <Col sm='9'>
                          <p className='fs-7'>
                            {formatDateTime(
                              new Date(selectedWorkOrder?.work_order_detail?.work_end_date)
                            )}
                          </p>
                        </Col>
                      </Form.Group>

                      <div className='detail-info mb-3'>
                        <p className='fs-5 fw-bold'>Oleh:</p>
                        <p className='fs-7'>
                          {selectedWorkOrder?.work_order_detail?.work_order_tukang
                            .filter((x: any) => x.type === 2)
                            .map((item: any) => item?.tukang?.full_name)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>

          <Row className='table-warranty d-flex align-items-center mb-5'>
            <div className='table-title-warranty'>
              <div className='fs-3 fw-bold'>Informasi Pemasangan</div>
              <Row>
                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Tanggal request pemasangan :</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {formatDate(
                        new Date(selectedWorkOrder?.work_order_detail?.order?.request_survey)
                      )}
                    </p>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Informasi Vendor Pemasangan :</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {selectedWorkOrder?.work_order_detail?.vendor?.company_name ?? '-'}
                    </p>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Payment Type:</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {(() => {
                        if (
                          selectedWorkOrder?.work_order_detail?.order?.payment_type === 'survey'
                        ) {
                          return `Berbayar & Survey`
                        } else if (
                          selectedWorkOrder?.work_order_detail?.order?.payment_type === 'gratis'
                        ) {
                          return `Gratis`
                        } else if (
                          selectedWorkOrder?.work_order_detail?.order?.payment_type ===
                          'pemasangan_tanpa_survey'
                        ) {
                          return `Berbayar & Pemasangan Tanpa Survey`
                        } else {
                          return ``
                        }
                      })()}
                    </p>
                  </Col>
                </Form.Group>
              </Row>
            </div>

            {(() => {
              if (
                selectedWorkOrder?.work_order_detail?.order?.payment_type === 'survey' &&
                selectedWorkOrder?.work_order_detail?.work_order_status.length === 1
              ) {
                return (
                  <div className='table-warranty-content'>
                    <Table hover responsive='md'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Nama Pemasangan</th>
                          <th>QTY Pemasangan</th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedWorkOrder?.work_order_detail?.order?.m_order_details?.map(
                          (item: any, index: any) => (
                            <>
                              <tr key={`${index} - order_detail`}>
                                <td>{item?.item_code}</td>
                                <td>{item?.item_name}</td>
                                <td>{item?.item_notes}</td>
                                <td>{item?.quantity ?? 0}</td>
                              </tr>
                            </>
                          )
                        )}
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                ['QUOTEIN', 'QUOTEOUT'].includes(
                  selectedWorkOrder?.work_order_detail?.order?.status?.category ?? ''
                ) &&
                selectedWorkOrder?.work_order_detail?.order?.payment_type === 'survey' &&
                selectedWorkOrder?.work_order_detail?.work_order_status?.length >= 2
              ) {
                return (
                  <div className='table-warranty-content'>
                    <Table hover responsive='md'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th className='text-center' style={{width: '355px'}}>
                            Jenis Jasa
                          </th>

                          <th className='text-center' style={{width: '100px'}}>
                            QTY
                          </th>

                          <th className='text-center' style={{width: '250px'}}>
                            Satuan
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedWorkOrder?.work_order_detail?.order?.quotation[0]?.quotation_details
                          ?.filter((x: any) => x.item_type === 2)
                          ?.map((item: any, index: any) => (
                            <tr key={`${index}-quotation`}>
                              <td>
                                {item?.name ?? '-'}{' '}
                                {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                              </td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>{item?.unit}</td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>

                    <Table hover responsive='md'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th className='text-center' style={{width: '355px'}}>
                            Material Yang Dibutuhkan
                          </th>

                          <th className='text-center' style={{width: '100px'}}>
                            QTY
                          </th>

                          <th className='text-center' style={{width: '250px'}}>
                            Satuan
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedWorkOrder?.work_order_detail?.order?.quotation[0]?.quotation_details
                          ?.filter((x: any) => x.item_type === 1)
                          ?.map((item: any, index: any) => (
                            <tr key={`${index}-quotation`}>
                              <td>
                                {item?.name ?? '-'}{' '}
                                {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                              </td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>{item?.unit}</td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                ['SURVEYSTART', 'SURVEYDONE', 'WORKSTART', 'WIP', 'WORKEND', 'DONE'].includes(
                  selectedWorkOrder?.work_order_detail?.work_orders?.work_order_status[0]?.status
                    ?.category
                ) &&
                selectedWorkOrder?.work_order_detail?.work_orders?.work_order_status.length > 1 &&
                selectedWorkOrder?.work_order_detail?.order?.payment_type === 'survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    <Table hover responsive='md'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th>Item / Nama Pemasangan</th>
                          <th>QTY Pemasangan</th>
                          <th>Satuan</th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedWorkOrder?.work_order_detail?.work_orders?.work_order_status[0]?.work_order_items.map(
                          (item: any, index: any) => (
                            <tr key={`${index}-work_order_detail`}>
                              <td>{item?.name ?? '-'}</td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>{item?.unit ?? ''}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                selectedWorkOrder?.work_order_detail?.order?.payment_type === 'gratis' ||
                selectedWorkOrder?.work_order_detail?.order?.payment_type ===
                  'pemasangan_tanpa_survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    <Table hover responsive='md'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Nama Pemasangan</th>
                          <th>QTY Pemasangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedWorkOrder?.work_order_detail?.order?.m_order_details.map(
                          (item: any, index: any) => (
                            <>
                              <tr key={`${index} - order_detail`}>
                                <td>{item?.item_code}</td>
                                <td>{item?.item_name}</td>
                                <td>{item?.item?.service_name}</td>
                                <td>{item?.quantity ?? 0}</td>
                              </tr>
                            </>
                          )
                        )}
                      </tbody>
                    </Table>
                  </div>
                )
              }
            })()}
          </Row>
        </Modal.Body>
      </Modal>
    </section>
  )
}

export {ViewCalendarTukang}
