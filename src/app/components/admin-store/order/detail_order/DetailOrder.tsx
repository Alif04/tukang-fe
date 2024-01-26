import React, {useState, FC, useEffect} from 'react'

import './DetailOrder.css'

import {Orders} from '../../../../interfaces/order'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Image} from 'antd'
import {Row, Col, Form, ListGroup, Table} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'
import {Steps} from 'antd'

interface Status {
  value: number | null
  category: string
}

const DetailOrders: FC<{updatePageTitle: (order: Orders) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const [order, setOrder] = useState<Orders>({
    member_id: null,
    seles_id: null,
    store_id: null,
    project_status_id: null,
    request_survey: '',
    vendor_id: null,
    tukang_id: null,
    project_address: '',
    project_number: '',
    receipt_number: '',
    receipt_path: '',
    total_estimate_workdays: null,
    payment_type: '',
    grand_total: '',
    grand_total_comission: '',
    print_counter: null,
    created_by: null,
    updated_by: null,
    created_at: '',
    order_details: [],
    m_order_details: [],
    order_files: [],
    complaints: [],
    work_orders: {
      work_order_status: [],
    },
    quotation: [],
  })

  const fetchOrderData = async () => {
    try {
      await axios
        .get(`${apiUrl}/orders/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data as Orders
          setOrder(data)
          updatePageTitle(data)
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchOrderData()
  }, [])

  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Statuses for Order Timeline
  const storedStatus = sessionStorage.getItem('statusData')
  const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []

  const getStatuses = (categories: string[]) =>
    statusData.filter((status: any) => categories.includes(status.category)).map((x) => x.value)

  const bookStatuses = getStatuses(['BOOK', 'BOOKED', 'PICKLIST', 'UNPAID', 'PAID'])
  const surveyStatuses = getStatuses([
    'SURVEYREQ',
    'SURVEYSTART',
    'SURVEYDONE',
    'QUOTEIN',
    'QUOTEOUT',
  ])
  const workStatuses = getStatuses(['WORKREQ', 'WORKSTART', 'WIP', 'WORKEND'])
  const workDoneStatuses = getStatuses(['WORKEND', 'DONE'])

  const orderHistory = [
    {title: 'Booking Process', value: bookStatuses},
    {title: 'Survey Process', value: surveyStatuses},
    {title: 'Work in Progress', value: workStatuses},
    {title: 'Work Done', value: workDoneStatuses},
  ]

  // Statuses for Complaint Timeline
  const complaintReceivedStatuses = getStatuses(['INVESTIGATE'])
  const investigationProcessStatuses = getStatuses(['INVESTIGATED', 'APPROVED', 'ACCEPTED'])
  const remedialProgressStatuses = getStatuses([
    'RESURVEYREQ',
    'RESURVEYSTART',
    'REWORKREQ',
    'REWORKSTART',
  ])
  const complaintDoneStatuses = getStatuses(['RESURVEYDONE', 'REWORKEND'])

  const complaintHistory = [
    {
      title: 'Complaint Received',
      value: complaintReceivedStatuses,
    },
    {
      title: 'Investigation Proccess',
      value: investigationProcessStatuses,
    },
    {
      title: 'Remedial Progress',
      value: remedialProgressStatuses,
    },
    {
      title: 'Complaint Done',
      value: complaintDoneStatuses,
    },
  ]

  return (
    <section id='detail-order'>
      <div className='card'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko :{' '}
                  <span className='fs-4 ms-2 fw-normal'>{order?.store?.store_name ?? ''}</span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Order ID : <span className='fs-4 ms-2 fw-normal'>{order?.id}</span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Col>
                  <Form.Label className='fs-4 fw-bold'>
                    Receipt Number :
                    <span className='fs-4 ms-2 fw-normal'>{order?.receipt_number ?? '-'}</span>
                  </Form.Label>
                </Col>
                <Col>
                  <Form.Label className='fs-4 fw-bold'>
                    Order Status :
                    <span className='fs-4 ms-2 fw-bold text-success'>
                      {order?.work_orders?.work_order_status?.length > 0
                        ? order?.work_orders?.work_order_status[0]?.status?.category
                        : order?.status?.category}
                    </span>
                  </Form.Label>
                </Col>
              </Col>
            </Row>

            <Row className='information-detail'>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='costumer-info mb-5'>
                <div className='fs-3 fw-bold'>Informasi Pembeli</div>
                <Row>
                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        No Member :
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>{order?.members?.member_number}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Customer Name :
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>{order?.members?.full_name}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Alamat Pemasangan :
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>{order?.project_address}</p>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='5'>
                        Nomor Telp/WA :
                      </Form.Label>
                      <Col sm='7'>
                        <p className='fs-7'>{order?.project_number}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='5'>
                        Alamat Email :
                      </Form.Label>
                      <Col sm='7'>
                        <p className='fs-7'>{order?.members?.email} </p>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='sales-info mb-5'>
                <div className='fs-3 fw-bold'>Informasi Penjual</div>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='3'>
                    Sales ID :
                  </Form.Label>
                  <Col sm='9'>
                    <p className='fs-7'>{order?.sales?.id} </p>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='3'>
                    Sales Person :
                  </Form.Label>
                  <Col sm='9'>
                    <p className='fs-7'>{order?.sales?.full_name} </p>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <Row className='table-warranty d-flex align-items-center mb-5'>
            <div className='table-title-warranty'>
              <div className='fs-3 fw-bold'>Informasi Pemasangan</div>
              <Row>
                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>
                    {order?.payment_type === 'survey'
                      ? 'Tanggal request survey :'
                      : 'Tanggal request pemasangan :'}
                  </Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>{formatDate(new Date(order?.request_survey))}</p>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Informasi Vendor Pemasangan :</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>{order?.vendor?.company_name ?? '-'}</p>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Payment Type:</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {(() => {
                        if (order?.payment_type === 'survey') {
                          return `Berbayar & Survey`
                        } else if (order?.payment_type === 'gratis') {
                          return `Gratis`
                        } else if (order?.payment_type === 'pemasangan_tanpa_survey') {
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

            {/* Old */}
            {/* {order?.work_orders === null ? (
              <div className='table-warranty-content'>
                <Table hover responsive='md'>
                  <thead className='table-warranty-head'>
                    <tr>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Nama Pemasangan</th>
                      <th>QTY Pemasangan</th>
                      {!(order?.payment_type === 'gratis' || order?.payment_type === 'survey') && (
                        <>
                          <th>Harga Jasa</th>
                          <th>Jumlah</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {order?.order_details.map((item: any, index: any) => (
                      <>
                        <tr key={`${index} - order_detail`}>
                          <td>{item?.item_code}</td>
                          <td>{item?.item_name}</td>
                          <td>
                            {order?.payment_type === 'survey'
                              ? item?.item_notes
                              : item?.item?.service_name}
                          </td>
                          <td>{item?.quantity ?? 0}</td>
                          {!(
                            order?.payment_type === 'gratis' || order?.payment_type === 'survey'
                          ) && (
                            <>
                              <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString(
                                'id'
                              )}`}</td>
                              <td>{`Rp. ${parseInt(item?.total || 0).toLocaleString('id')}`}</td>
                            </>
                          )}
                        </tr>
                      </>
                    ))}

                    {order?.payment_type !== 'gratis' &&
                      order?.payment_type !== 'pemasangan_tanpa_survey' && (
                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            Biaya Survey
                          </td>

                          <td className=' fw-bolder'>
                            {order?.payment_type === 'gratis' ||
                            order?.payment_type === 'pemasangan_tanpa_survey'
                              ? `Rp. ${(0).toLocaleString('id')}`
                              : order?.payment_type === 'survey'
                              ? `Rp. ${(99000).toLocaleString('id')}`
                              : `Rp. ${0}`}
                          </td>
                        </tr>
                      )}

                    {order?.payment_type !== 'survey' && (
                      <tr>
                        <td
                          colSpan={order?.payment_type !== 'gratis' ? 5 : 3}
                          className='text-end fw-bolder'
                        >
                          Grand Total
                        </td>

                        <td className=' fw-bolder'>
                          {(() => {
                            if (order?.payment_type === 'gratis') {
                              return `Rp. ${(0).toLocaleString('id')}`
                            } else if (order?.payment_type === 'pemasangan_tanpa_survey') {
                              return `Rp. ${parseInt(order?.grand_total).toLocaleString('id')}`
                            } else if (order?.payment_type === 'survey') {
                              return `Rp. ${(99000).toLocaleString('id')}`
                            } else {
                              return `Rp. ${(0).toLocaleString('id')}`
                            }
                          })()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className='table-warranty-content'>
                <Table hover responsive='md'>
                  <thead className='table-warranty-head'>
                    <tr>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Nama Pemasangan</th>
                      <th>QTY Pemasangan</th>
                      <th>Harga Jasa</th>
                      <th>Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.work_orders?.work_order_status[0]?.work_order_items.map(
                      (item: any, index: any) => (
                        <tr key={`${index}-work_order_detail`}>
                          <td>{item?.item_id ?? '-'}</td>
                          <td>{item?.item ?? '-'}</td>
                          <td>{item?.name ?? '-'}</td>
                          <td>{item?.quantity ?? 0}</td>
                          <td>{`Rp. ${parseInt(item?.unit_price ?? 0)?.toLocaleString('id')}`}</td>
                          <td>{`Rp. ${parseInt(item?.total ?? 0).toLocaleString('id')}`}</td>
                        </tr>
                      )
                    )}

                    <tr>
                      <td colSpan={5} className='text-end fw-bolder'>
                        Grand Total
                      </td>
                      <td className=' fw-bolder'>
                        {`Rp. ${parseInt(order?.grand_total ?? 0).toLocaleString('id')}`}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            )} */}

            {/* New */}
            {(() => {
              if (
                [
                  'PICKLIST',
                  'BOOK',
                  'BOOKED',
                  'SURVEYREQ',
                  'SURVEYSTART',
                  'WORKREQ',
                  'WORKSTART',
                ].includes(order?.status?.category ?? '')
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
                            order?.payment_type === 'gratis' || order?.payment_type === 'survey'
                          ) && (
                            <>
                              <th>Harga Jasa</th>
                              <th>Jumlah</th>
                            </>
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {order?.order_details.map((item: any, index: any) => (
                          <>
                            <tr key={`${index} - order_detail`}>
                              <td>{item?.item_code}</td>
                              <td>{item?.item_name}</td>
                              <td>
                                {order?.payment_type === 'survey'
                                  ? item?.item_notes
                                  : item?.item?.service_name}
                              </td>
                              <td>{item?.quantity ?? 0}</td>
                              {!(
                                order?.payment_type === 'gratis' || order?.payment_type === 'survey'
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
                        ))}

                        {order?.payment_type !== 'gratis' &&
                          order?.payment_type !== 'pemasangan_tanpa_survey' && (
                            <tr>
                              <td colSpan={3} className='text-end fw-bolder'>
                                Biaya Survey
                              </td>

                              <td className=' fw-bolder'>
                                {order?.payment_type === 'gratis' ||
                                order?.payment_type === 'pemasangan_tanpa_survey'
                                  ? `Rp. ${(0).toLocaleString('id')}`
                                  : order?.payment_type === 'survey'
                                  ? `Rp. ${(99000).toLocaleString('id')}`
                                  : `Rp. ${0}`}
                              </td>
                            </tr>
                          )}

                        {order?.payment_type !== 'survey' && (
                          <tr>
                            <td
                              colSpan={order?.payment_type !== 'gratis' ? 5 : 3}
                              className='text-end fw-bolder'
                            >
                              Grand Total
                            </td>

                            <td className=' fw-bolder'>
                              {(() => {
                                if (order?.payment_type === 'gratis') {
                                  return `Rp. ${(0).toLocaleString('id')}`
                                } else if (order?.payment_type === 'pemasangan_tanpa_survey') {
                                  return `Rp. ${parseInt(order?.grand_total).toLocaleString('id')}`
                                } else if (order?.payment_type === 'survey') {
                                  return `Rp. ${(99000).toLocaleString('id')}`
                                } else {
                                  return `Rp. ${(0).toLocaleString('id')}`
                                }
                              })()}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (['QUOTEIN', 'QUOTEOUT'].includes(order?.status?.category ?? '')) {
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
                        {order?.quotation[0]?.quotation_details?.map((item: any, index: any) => (
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
                        ))}

                        <tr>
                          <td colSpan={5} className='text-end fw-bolder'>
                            Grand Total
                          </td>
                          <td className=' fw-bolder'>
                            {`Rp. ${parseInt(
                              order?.quotation[0]?.quotation_grand_total ?? 0
                            ).toLocaleString('id')}`}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                ['SURVEYDONE', 'WIP', 'WORKEND', 'DONE'].includes(
                  order?.work_orders?.work_order_status[0]?.status?.category
                )
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
                          <th>Harga Jasa</th>
                          <th>Jumlah</th>
                        </tr>
                      </thead>

                      <tbody>
                        {order?.work_orders?.work_order_status[0]?.work_order_items.map(
                          (item: any, index: any) => (
                            <tr key={`${index}-work_order_detail`}>
                              <td>{item?.item_id ?? '-'}</td>
                              <td>{item?.item ?? '-'}</td>
                              <td>{item?.name ?? '-'}</td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>{`Rp. ${parseInt(item?.unit_price ?? 0)?.toLocaleString(
                                'id'
                              )}`}</td>
                              <td>{`Rp. ${parseInt(item?.total ?? 0).toLocaleString('id')}`}</td>
                            </tr>
                          )
                        )}

                        <tr>
                          <td colSpan={5} className='text-end fw-bolder'>
                            Grand Total
                          </td>
                          <td className=' fw-bolder'>
                            {`Rp. ${parseInt(order?.grand_total ?? 0).toLocaleString('id')}`}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )
              }
            })()}
          </Row>

          {order?.order_files.length >= 1 ? (
            <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='mt-3'>Bukti Receipt :</Form.Label>
                <ListGroup>
                  {order?.order_files.map((item: any) => (
                    <ListGroup.Item
                      key={item.id}
                      action
                      onClick={() => {
                        setPreviewImage(item.path)
                        setVisible(true)
                      }}
                    >
                      {item.path}
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                {previewImage && (
                  <div>
                    <Image
                      key={previewImage}
                      width={200}
                      style={{display: 'none'}}
                      src={`${apiUrl}/public/receipt/${previewImage}`}
                      preview={{
                        visible,
                        src: `${apiUrl}/public/receipt/${previewImage}`,
                        onVisibleChange: (value) => {
                          setVisible(value)
                        },
                      }}
                    />
                  </div>
                )}
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
            </Row>
          ) : (
            <></>
          )}

          <div className='order-history mt-3 mb-3'>
            <div className='fs-3 fw-bold text-success mb-4'>Order History</div>
            <Steps
              className='order-history-timeline'
              current={orderHistory.findIndex((step) =>
                step.value.includes(order?.project_status_id)
              )}
              labelPlacement='vertical'
              items={orderHistory}
            />
          </div>

          {order?.complaints && order?.complaints?.length >= 1 && (
            <div className='complaint-history  mt-3 mb-3'>
              <div className='fs-3 fw-bold text-danger mb-4'>Complaint History</div>
              <Steps
                className='complaint-history-timeline'
                current={complaintHistory.findIndex((step) =>
                  step.value.includes(order?.complaints?.[0]?.complaint_status ?? 0)
                )}
                labelPlacement='vertical'
                items={complaintHistory}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export {DetailOrders}
