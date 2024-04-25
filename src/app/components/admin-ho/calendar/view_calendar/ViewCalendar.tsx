/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'

import './ViewCalendar.css'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import axios from 'axios'
import dayjs from 'dayjs'
import Select, {SingleValue} from 'react-select'
import {Row, Col, Modal, Form, InputGroup, Table, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch} from '@fortawesome/free-solid-svg-icons'

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
  title: string
  start: string
  end: string
  work_order_detail?: any
}

const ViewCalendarHO: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const [loadingButton, setLoadingButton] = useState(false)

  const [store, setStore] = useState<StoreItem[]>([])
  const [vendor, setVendor] = useState<VendorItem[]>([])

  const storeOptions = [{value: null, label: 'All Store'}, ...store]
  const [selectedStore, setSelectedStore] = useState<SingleValue<StoreItem>>({
    value: null,
    label: 'All Store',
  })

  const vendorOptions = [{value: null, label: 'All Vendor'}, ...vendor]
  const [selectedVendor, setSelectedVendor] = useState<SingleValue<VendorItem>>({
    value: null,
    label: 'All Vendor',
  })

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  const [workOrder, setWorkOrder] = useState<WorkOrder[]>([
    {
      id: '',
      title: '',
      start: '',
      end: '',
    },
  ])

  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null)

  // Fetch Data
  const getWorkOrder = async (queryparams: any) => {
    let apiUrlWithParams = `${apiUrl}/work-orders?order_by=desc&take=0${queryparams}`

    try {
      await axios
        .get(apiUrlWithParams, {
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
    getWorkOrder('')
  }, [])

  useEffect(() => {
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
            city_id: item.city_id,
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

  const handleSubmitFilter = async () => {
    setLoadingButton(true)

    const store_id = selectedStore && selectedStore.value ? `&store_id=${selectedStore.value}` : ``
    const vendor_id =
      selectedVendor && selectedVendor.value ? `&vendor_id=${selectedVendor.value}` : ``

    const queryparams = `&date_from=${dateFrom}&date_to=${dateTo}${store_id}${vendor_id}`
    await getWorkOrder(queryparams)

    setLoadingButton(false)
  }

  return (
    <section id='view-calendar'>
      <Row className='mb-5'>
        <Col xxl={3} xl={6} lg={6} md={6} sm={12}>
          <Form.Group as={Row}>
            <Form.Label className='fs-3' column sm='3'>
              Date :
            </Form.Label>

            <Col sm='8'>
              <RangePicker
                format={'DD-MM-YYYY'}
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

        <Col xxl={3} xl={6} lg={6} md={6} sm={12}>
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
            options={storeOptions}
            value={selectedStore}
            onChange={(newValue) => setSelectedStore(newValue)}
          />
        </Col>

        <Col xxl={2} xl={6} lg={6} md={6} sm={12}>
          <Select
            name='vendor_id'
            className='form-control p-0'
            classNamePrefix='select'
            placeholder='Pilih Vendor'
            isSearchable={true}
            options={vendorOptions}
            value={selectedVendor}
            onChange={(newValue) => setSelectedVendor(newValue)}
          />
        </Col>

        <Col xxl={2} xl={12} lg={12} md={12} sm={12}>
          <Button
            className='btn-dark-primary button-submit'
            disabled={loadingButton}
            onClick={handleSubmitFilter}
          >
            {loadingButton ? 'Filtering..' : 'Submit'}
          </Button>
        </Col>
      </Row>

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
                    {selectedWorkOrder?.work_order_detail?.work_order_status[0]?.status?.category ??
                      ''}
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
                <Col md={5}>
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

                <Col md={7}>
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
                selectedWorkOrder?.work_order_detail?.order?.payment_type === 'survey' ||
                selectedWorkOrder?.work_order_detail?.work_orders?.work_order_status.length === 1
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
                                <td>{item?.item_notes}</td>
                                <td>{item?.quantity ?? 0}</td>
                              </tr>
                            </>
                          )
                        )}

                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            Biaya Survey
                          </td>

                          <td className=' fw-bolder'>Rp. 99.000</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                ['QUOTEIN', 'QUOTEOUT'].includes(
                  selectedWorkOrder?.work_order_detail?.order?.status?.category ?? ''
                ) &&
                selectedWorkOrder?.work_order_detail?.order?.payment_type === 'survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    <Table hover responsive='md'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th className='text-center'>Jenis Jasa</th>
                          <th className='text-center'>QTY</th>
                          <th className='text-center'>Satuan</th>
                          <th className='text-center'>Price</th>
                          <th className='text-center'>Total</th>
                          <th className='text-center'>Keterangan</th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedWorkOrder?.work_order_detail?.order?.quotation[0]?.quotation_details.map(
                          (item: any, index: any) => (
                            <tr key={`${index}-quotation`}>
                              <td>{item?.name ?? '-'}</td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>{item?.unit}</td>
                              <td>{`Rp. ${parseInt(item?.price || 0).toLocaleString('id')}`}</td>
                              <td>{`Rp. ${parseInt(item?.final_price || 0).toLocaleString(
                                'id'
                              )}`}</td>
                              <td>{item?.description ? '' : '-'}</td>
                            </tr>
                          )
                        )}

                        <tr>
                          <td colSpan={5} className='text-end fw-bolder'>
                            Grand Total
                          </td>
                          <td className=' fw-bolder'>
                            {`Rp. ${parseInt(
                              selectedWorkOrder?.work_order_detail?.order?.quotation[0]
                                ?.quotation_grand_total ?? 0
                            ).toLocaleString('id')}`}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                ['SURVEYSTART', 'SURVEYDONE', 'WIP', 'WORKEND', 'DONE'].includes(
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
                          {!(
                            selectedWorkOrder?.work_order_detail?.order?.payment_type === 'gratis'
                          ) && (
                            <>
                              <th>Harga Jasa</th>
                              <th>Jumlah</th>
                            </>
                          )}
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
                                {!(
                                  selectedWorkOrder?.work_order_detail?.order?.payment_type ===
                                  'gratis'
                                ) && (
                                  <>
                                    <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString(
                                      'id'
                                    )}`}</td>
                                    <td>{`Rp. ${parseInt(item?.total || 0).toLocaleString(
                                      'id'
                                    )}`}</td>
                                  </>
                                )}
                              </tr>
                            </>
                          )
                        )}

                        <tr>
                          <td
                            colSpan={
                              selectedWorkOrder?.work_order_detail?.order?.payment_type !== 'gratis'
                                ? 5
                                : 3
                            }
                            className='text-end fw-bolder'
                          >
                            Grand Total
                          </td>

                          <td className=' fw-bolder'>
                            {(() => {
                              if (
                                selectedWorkOrder?.work_order_detail?.order?.payment_type ===
                                'gratis'
                              ) {
                                return `Rp. ${(0).toLocaleString('id')}`
                              } else if (
                                selectedWorkOrder?.work_order_detail?.order?.payment_type ===
                                'pemasangan_tanpa_survey'
                              ) {
                                return `Rp. ${parseInt(
                                  selectedWorkOrder?.work_order_detail?.order?.grand_total
                                ).toLocaleString('id')}`
                              } else {
                                return `Rp. ${(0).toLocaleString('id')}`
                              }
                            })()}
                          </td>
                        </tr>
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

export {ViewCalendarHO}
