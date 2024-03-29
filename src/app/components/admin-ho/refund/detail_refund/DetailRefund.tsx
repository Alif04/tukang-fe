import React, {FC, useState, useEffect, KeyboardEventHandler} from 'react'

import './DetailRefund.css'

import axios from 'axios'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {Row, Col, Form, Button, Table} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

const DetailRefundHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()

  // Refund Detail
  const [refundDetail, setRefundDetail] = useState<any>()

  const fetchRefundData = async () => {
    try {
      await axios
        .get(`${apiUrl}/refund/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data
          setRefundDetail(data)
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchRefundData()
  }, [])

  const phoneNumber =
    refundDetail?.orders.members.phone_number !== null
      ? refundDetail?.orders.members.phone_number
      : refundDetail?.orders.members.whatsapp_number

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <section id='detail-refund'>
      <div className='card'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko :
                  <span className='fs-4 ms-2 fw-normal'>
                    {refundDetail?.orders?.store?.store_name ?? '-'}
                  </span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group as={Row} className='order-id-complaint'>
                  <Form.Label className='fs-4 fw-bold'>
                    Order ID :
                    <span className='fs-4 ms-2 fw-normal'>{refundDetail?.orders?.id}</span>
                  </Form.Label>
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Receipt Number :
                  <span className='fs-4 ms-2 fw-normal'>
                    {refundDetail?.orders.receipt_number ?? '-'}
                  </span>
                </Form.Label>
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
                        <Form.Control plaintext readOnly value={refundDetail?.orders.members.id} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Customer Name :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control
                          plaintext
                          readOnly
                          value={refundDetail?.orders.members.full_name}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Alamat Pemasangan :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control
                          as='textarea'
                          plaintext
                          readOnly
                          rows={3}
                          value={refundDetail?.orders.project_address}
                        />
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='4'>
                        Nomor Telp/WA :
                      </Form.Label>
                      <Col sm='8'>
                        <Form.Control plaintext readOnly value={phoneNumber} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='4'>
                        Alamat Email :
                      </Form.Label>
                      <Col sm='8'>
                        <Form.Control
                          plaintext
                          readOnly
                          value={refundDetail?.orders.members.email}
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='sales-info mb-5'>
                <Row>
                  <div className='fs-3 fw-bold'>Informasi Penjual</div>

                  <div className='d-flex'>
                    <Form.Group as={Row}>
                      <Form.Label column md='4'>
                        Sales ID :
                      </Form.Label>

                      <Col md='8'>
                        <Form.Control plaintext readOnly value={refundDetail?.orders.sales.id} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                      <Form.Label column md='5'>
                        Sales Person :
                      </Form.Label>

                      <Col md='7'>
                        <Form.Control
                          plaintext
                          readOnly
                          value={refundDetail?.orders.sales.full_name}
                        />
                      </Col>
                    </Form.Group>
                  </div>
                </Row>

                <Row>
                  <div className='fs-3 fw-bold'>Informasi Vendor Pemasangan</div>

                  <div className='d-flex'>
                    <Form.Group as={Row}>
                      <Form.Label column md='5'>
                        Vendor Name :
                      </Form.Label>

                      <Col md='7'>
                        <Form.Control
                          plaintext
                          readOnly
                          value={refundDetail?.orders?.vendor?.company_name ?? '-'}
                        />
                      </Col>
                    </Form.Group>
                  </div>
                </Row>
              </Col>
            </Row>
          </div>

          <Row className='table-warranty d-flex align-items-center mb-5'>
            <div className='table-title-warranty'>
              <div className='fs-3 fw-bold'>Informasi Pemasangan</div>

              <Form.Group as={Row} className='mb-3' controlId='formPlaintextEmail'>
                <Form.Label column sm='3'>
                  Tanggal request pemasangan :
                </Form.Label>
                <Col sm='9'>
                  <Form.Control
                    type='text'
                    plaintext
                    readOnly
                    value={
                      refundDetail ? formatDate(new Date(refundDetail?.orders.request_survey)) : ''
                    }
                  />
                </Col>
              </Form.Group>
            </div>

            {/* New */}
            {(() => {
              if (
                refundDetail?.orders?.payment_type === 'survey' ||
                refundDetail?.orders?.work_orders?.work_order_status.length === 1
              ) {
                return (
                  <div className='table-warranty-content'>
                    {refundDetail?.orders?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari{' '}
                          <span className='fw-bolder text-decoration-underline'>10 KM</span> dari
                          toko sehingga dikenakan biaya tambahan
                        </Form.Text>
                      </>
                    )}

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
                        {refundDetail?.orders?.m_order_details.map((item: any, index: any) => (
                          <>
                            <tr key={`${index} - order_detail`}>
                              <td>{item?.item_code}</td>
                              <td>{item?.item_name}</td>
                              <td>{item?.item_notes}</td>
                              <td>{item?.quantity ?? 0}</td>
                            </tr>
                          </>
                        ))}

                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            Biaya Survey
                          </td>

                          <td className=' fw-bolder'>Rp. 99.000</td>
                        </tr>

                        {refundDetail?.orders?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td colSpan={3} className='text-end fw-bolder align-middle'>
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                refundDetail?.orders?.additional_fee
                              ).toLocaleString('id')}`}</td>
                            </tr>

                            <tr>
                              <td colSpan={3} className='text-end fw-bolder'>
                                Grand Total
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                refundDetail?.orders?.grand_total
                              ).toLocaleString('id')}`}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                ['QUOTEIN', 'QUOTEOUT'].includes(refundDetail?.orders?.status?.category ?? '') &&
                refundDetail?.orders?.payment_type === 'survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    {refundDetail?.orders?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari{' '}
                          <span className='fw-bolder text-decoration-underline'>10 KM</span> dari
                          toko sehingga dikenakan biaya tambahan
                        </Form.Text>
                      </>
                    )}

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
                        {refundDetail?.orders?.quotation[0]?.quotation_details.map(
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
                          <td colSpan={6} className='text-end fw-bolder'>
                            Promosi ( Free Survey )
                          </td>
                          <td className=' fw-bolder'>
                            {`Rp. ${parseInt(
                              refundDetail?.orders?.quotation[0]?.quotation_disc ?? 0
                            ).toLocaleString('id')}`}
                          </td>
                        </tr>

                        {refundDetail?.orders?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td colSpan={3} className='text-end fw-bolder align-middle'>
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                refundDetail?.orders?.additional_fee
                              ).toLocaleString('id')}.`}</td>
                            </tr>
                          </>
                        )}

                        <tr>
                          <td colSpan={5} className='text-end fw-bolder'>
                            Grand Total
                          </td>
                          <td className=' fw-bolder'>
                            {`Rp. ${parseInt(
                              refundDetail?.orders?.quotation[0]?.quotation_grand_total ?? 0
                            ).toLocaleString('id')}`}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                ['SURVEYSTART', 'SURVEYDONE', 'WIP', 'WORKEND', 'DONE'].includes(
                  refundDetail?.orders?.work_orders?.work_order_status[0]?.status?.category
                ) &&
                refundDetail?.orders?.work_orders?.work_order_status.length > 1 &&
                refundDetail?.orders?.payment_type === 'survey'
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
                        {refundDetail?.orders?.work_orders?.work_order_status[0]?.work_order_items.map(
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
                refundDetail?.orders?.payment_type === 'gratis' ||
                refundDetail?.orders?.payment_type === 'pemasangan_tanpa_survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    {refundDetail?.orders?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari{' '}
                          <span className='fw-bolder text-decoration-underline'>10 KM</span> dari
                          toko sehingga dikenakan biaya tambahan
                        </Form.Text>
                      </>
                    )}

                    <Table hover responsive='md'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Nama Pemasangan</th>
                          <th>QTY Pemasangan</th>
                          {!(refundDetail?.orders?.payment_type === 'gratis') && (
                            <>
                              <th>Harga Jasa</th>
                              <th>Jumlah</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {refundDetail?.orders?.m_order_details.map((item: any, index: any) => (
                          <>
                            <tr key={`${index} - order_detail`}>
                              <td>{item?.item_code}</td>
                              <td>{item?.item_name}</td>
                              <td>{item?.item?.service_name}</td>
                              <td>{item?.quantity ?? 0}</td>
                              {!(refundDetail?.orders?.payment_type === 'gratis') && (
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

                        {refundDetail?.orders?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td colSpan={3} className='text-end fw-bolder align-middle'>
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                refundDetail?.orders?.additional_fee
                              ).toLocaleString('id')}.`}</td>
                            </tr>
                          </>
                        )}

                        <tr>
                          <td
                            colSpan={refundDetail?.orders?.payment_type !== 'gratis' ? 5 : 3}
                            className='text-end fw-bolder'
                          >
                            Grand Total
                          </td>

                          <td className=' fw-bolder'>
                            {(() => {
                              if (refundDetail?.orders?.payment_type === 'gratis') {
                                return `Rp. ${(0).toLocaleString('id')}`
                              } else if (
                                refundDetail?.orders?.payment_type === 'pemasangan_tanpa_survey'
                              ) {
                                return `Rp. ${parseInt(
                                  refundDetail?.orders?.grand_total
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

          <hr />

          <div className='order-history'>
            <div className='title'>
              <h1 className='text-uppercase'>formulir refund</h1>
            </div>

            <div className='row mb-5'>
              <div className='col-md-4'>
                <div className='complaint-information'>
                  <h4>Tanggal Pengajuan Refund : </h4>

                  <Form.Control
                    type='text'
                    className='w-75'
                    readOnly
                    value={refundDetail ? formatDate(new Date(refundDetail?.date_of_filing)) : ''}
                  />
                </div>
              </div>

              <div className='col-md-4'>
                <div className='complaint-detail'>
                  <h4>Alasan Refund :</h4>

                  <Form.Control
                    as='textarea'
                    className='desc-notes'
                    readOnly
                    value={refundDetail?.reason}
                  />
                </div>
              </div>

              <div className='col-xxl-4'></div>
            </div>

            <div className='row'>
              <div className='col-xxl-4'>
                <div className='complaint-information mb-5'>
                  <h4>Tanggal Approve Refund : </h4>

                  <Form.Control
                    type='text'
                    className='w-75'
                    readOnly
                    value={refundDetail ? formatDate(new Date(refundDetail?.date_approve)) : ''}
                  />
                </div>

                <div className='complaint-information'>
                  <h4>Nomor Approval : </h4>
                  <Form.Control
                    type='number'
                    className='w-75'
                    readOnly
                    value={refundDetail?.approval_number}
                  />
                </div>
              </div>

              <div className='col-xxl-4'>
                <div className='complaint-information'>
                  <h4>Notes</h4>
                  <Form.Control
                    as='textarea'
                    className='desc-notes'
                    readOnly
                    value={refundDetail?.notes}
                  />
                </div>
              </div>

              <div className='col-xxl-4'>
                <div className='row'>
                  <div className='col-xxl-6'>
                    <h4 className='mb-2'>Untuk Customer</h4>
                    <h4 className='mb-5'>Input Voucher</h4>
                    <Form.Control
                      type='text'
                      className='mt-5 mb-5'
                      readOnly
                      value={refundDetail?.voucher}
                    />
                  </div>

                  <div className='col-xxl-6'>
                    <h4 className='mb-2'>Untuk Vendor</h4>
                    <h4 className='mb-2'>Input Nominal Denda</h4>
                    <Form.Control
                      type='number'
                      className='mt-5 mb-5'
                      value={parseInt(refundDetail?.penalty_nominal || 0)?.toLocaleString('id')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export {DetailRefundHO}
