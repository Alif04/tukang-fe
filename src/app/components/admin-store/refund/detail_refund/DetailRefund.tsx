import React, {FC, useState, useEffect, KeyboardEventHandler} from 'react'

import './DetailRefund.css'

import axios from 'axios'
import {useNavigate, useParams} from 'react-router-dom'
import {Row, Col, Form, Table, ListGroup} from 'react-bootstrap'
import {Image} from 'antd'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

const DetailRefundCS: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()

  // Refund Detail
  const [refundDetail, setRefundDetail] = useState<any>()

  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)

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
                    {refundDetail?.orders?.store?.store_name ?? ''}
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
                    {refundDetail?.orders?.receipt_number ?? '-'}
                  </span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-4 fw-bold'>
                  LAST ORDER STATUS :{' '}
                  <span className='fs-4 ms-2 fw-bold text-success'>
                    {refundDetail?.orders?.work_orders?.work_order_status?.length > 0
                      ? refundDetail?.orders?.work_orders?.work_order_status[0]?.status?.description
                      : refundDetail?.orders?.status?.description}
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
                        <p className='fs-7'>{refundDetail?.orders?.members?.member_number}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Customer Name :
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>{refundDetail?.orders?.members?.full_name}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Alamat Pemasangan :
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>{refundDetail?.orders?.project_address}</p>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='5'>
                        Nomor Telp/WA :
                      </Form.Label>
                      <Col sm='7'>
                        <p className='fs-7'>{refundDetail?.orders?.project_number}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='5'>
                        Alamat Email :
                      </Form.Label>
                      <Col sm='7'>
                        <p className='fs-7'>{refundDetail?.orders?.members?.email} </p>
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
                    <p className='fs-7'>{refundDetail?.orders?.sales?.id} </p>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='3'>
                    Sales Person :
                  </Form.Label>
                  <Col sm='9'>
                    <p className='fs-7'>{refundDetail?.orders?.sales?.full_name} </p>
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
                    {refundDetail?.orders?.payment_type === 'survey'
                      ? 'Tanggal request survey :'
                      : 'Tanggal request pemasangan :'}
                  </Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {formatDate(new Date(refundDetail?.orders?.request_survey))}
                    </p>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Informasi Vendor Pemasangan :</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>{refundDetail?.orders?.vendor?.company_name ?? '-'}</p>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Payment Type:</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {(() => {
                        if (refundDetail?.orders?.payment_type === 'survey') {
                          return `Berbayar & Survey`
                        } else if (refundDetail?.orders?.payment_type === 'gratis') {
                          return `Gratis`
                        } else if (
                          refundDetail?.orders?.payment_type === 'pemasangan_tanpa_survey'
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

            {/* New */}
            {(() => {
              if (
                (refundDetail?.orders?.payment_type === 'survey' &&
                  refundDetail?.orders?.work_orders === null) ||
                (refundDetail?.orders?.work_orders?.work_order_status.length === 1 &&
                  refundDetail?.orders?.payment_type === 'survey')
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

                    <table className='table hover responsive'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Nama Pemasangan</th>
                          <th>QTY Pemasangan</th>
                        </tr>
                      </thead>

                      <tbody>
                        {refundDetail?.orders?.m_order_details?.map((item: any, index: any) => (
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
                    </table>
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
                          *Order ini lebih dari
                          <span className='fw-bolder text-decoration-underline'> 10 KM</span> dari
                          toko sehingga dikenakan biaya tambahan
                        </Form.Text>
                      </>
                    )}

                    <table className='table hover responsive'>
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

                          <th className='text-center' style={{width: '250px'}}>
                            Price
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {refundDetail?.orders?.quotation[0]?.quotation_details
                          .filter((x: any) => x.item_type === 2)
                          .map((item: any, index: any) => (
                            <tr key={`${index}-quotation`}>
                              <td>
                                {item?.name ?? '-'}{' '}
                                {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                              </td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>{item?.unit}</td>
                              <td>{`Rp. ${parseInt(item?.price ?? 0).toLocaleString('id')}`}</td>
                            </tr>
                          ))}

                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            Total
                          </td>

                          <td className='fw-bolder'>
                            {`Rp. ${refundDetail?.orders?.quotation[0]?.quotation_details
                              .filter((x: any) => x.item_type === 2)
                              .map((item: any) => parseInt(item?.price ?? 0))
                              .reduce((total: number, price: number) => total + price, 0)
                              .toLocaleString('id')}`}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {refundDetail?.orders?.quotation[0]?.quotation_details.filter(
                      (x: any) => x.item_type === 1
                    ).length ? (
                      <table className='table hover responsive'>
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

                            <th className='text-center' style={{width: '250px'}}>
                              Price
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {refundDetail?.orders?.quotation[0]?.quotation_details
                            .filter((x: any) => x.item_type === 1)
                            .map((item: any, index: any) => (
                              <tr key={`${index}-quotation`}>
                                <td>
                                  {item?.name ?? '-'}{' '}
                                  {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                                </td>
                                <td>{item?.quantity ?? 0}</td>
                                <td>{item?.unit ?? '-'}</td>
                                <td>{`Rp. ${parseInt(item?.price ?? 0).toLocaleString('id')}`}</td>
                              </tr>
                            ))}

                          <tr>
                            <td colSpan={3} className='text-end fw-bolder'>
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
                            <td colSpan={3} className='text-end fw-bolder'>
                              Grand Total
                            </td>
                            <td className=' fw-bolder'>
                              {`Rp. ${parseInt(
                                refundDetail?.orders?.quotation[0]?.quotation_grand_total ?? 0
                              ).toLocaleString('id')}`}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <></>
                    )}
                  </div>
                )
              } else if (
                ['SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE', 'WORKEND', 'DONE'].includes(
                  refundDetail?.orders?.work_orders?.work_order_status[0]?.status?.category
                ) &&
                refundDetail?.orders?.payment_type === 'survey' &&
                refundDetail?.orders?.work_orders?.work_order_status.length >= 1
              ) {
                return (
                  <div className='table-warranty-content'>
                    <table className='table hover responsive'>
                      <thead className='table-warranty-head'>
                        <tr>
                          <th>Nama Pemasangan</th>
                          <th>QTY Pemasangan</th>
                          <th>Satuan</th>
                        </tr>
                      </thead>

                      <tbody>
                        {refundDetail?.orders?.work_orders?.work_order_status[0]?.work_order_items
                          .length ? (
                          refundDetail?.orders?.work_orders?.work_order_status[0].work_order_items.map(
                            (item: any, index: any) => (
                              <tr key={`${index}-work_order_detail`}>
                                <td>
                                  {item.name ?? ''}{' '}
                                  {item.is_customer ? '( Disediakan oleh customer )' : ''}
                                </td>
                                <td>{item.quantity ?? 0}</td>
                                <td>{item.unit ?? ''}</td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td>Item belum diset oleh Tukang/Vendor</td>
                            <td>Quantity belum diset oleh Tukang/Vendor</td>
                            <td>Satuan belum diset oleh Tukang/Vendor</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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

                    <table className='table hover responsive'>
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
                        {refundDetail?.orders?.m_order_details?.map((item: any, index: any) => (
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
                              <td
                                colSpan={refundDetail?.orders?.payment_type !== 'gratis' ? 5 : 3}
                                className='text-end fw-bolder align-middle'
                              >
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                refundDetail?.orders?.additional_fee
                              ).toLocaleString('id')}`}</td>
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

                          <td className=' fw-bolder'>{`Rp. ${Number(
                            refundDetail?.orders?.grand_total
                          ).toLocaleString('id')}`}</td>
                        </tr>
                      </tbody>
                    </table>
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

            <Row className='mb-5'>
              <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
                <Form.Group className='mb-5'>
                  <Form.Label className='fs-5 fw-bold'>Tanggal Pengajuan Refund</Form.Label>

                  <Form.Control
                    type='text'
                    readOnly
                    value={refundDetail ? formatDate(new Date(refundDetail?.date_of_filing)) : ''}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label className='fs-5 fw-bold'>Nomor Receipt Refund</Form.Label>

                  <Form.Control
                    type='text'
                    readOnly
                    value={refundDetail ? refundDetail?.approval_number : ''}
                  />
                </Form.Group>
              </Col>

              <Col xxl={8} xl={8} lg={8} md={8} sm={12}>
                <Form.Group>
                  <Form.Label className='fs-5 fw-bold'>Alasan Refund : </Form.Label>

                  <Form.Control
                    as='textarea'
                    className='desc-notes'
                    readOnly
                    value={refundDetail?.reason}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className='mb-5'>
              <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
                <Form.Group>
                  <Form.Label className='fs-5 fw-bold'>Nominal Voucher Konsumen :</Form.Label>

                  <Form.Control
                    type='text'
                    readOnly
                    value={refundDetail ? refundDetail?.approval_number : ''}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label className='mt-3'>File Pendukung :</Form.Label>

                  <ListGroup>
                    {refundDetail?.refund_evidences.map((item: any) => (
                      <ListGroup.Item
                        key={item.id}
                        action
                        onClick={() => {
                          setPreviewImage(item.evidence_location)
                          setVisible(true)
                        }}
                      >
                        {item.evidence_location}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  {previewImage && (
                    <div>
                      <Image
                        key={previewImage}
                        width={200}
                        style={{display: 'none'}}
                        src={`${apiUrl}/public/refund/${previewImage}`}
                        preview={{
                          visible,
                          src: `${apiUrl}/public/refund/${previewImage}`,
                          onVisibleChange: (value) => {
                            setVisible(value)
                          },
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col xxl={8} xl={8} lg={8} md={8} sm={12}>
                <Form.Group>
                  <Form.Label className='fs-5 fw-bold'>Notes : </Form.Label>

                  <Form.Control
                    as='textarea'
                    className='desc-notes'
                    readOnly
                    value={refundDetail?.notes}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </section>
  )
}

export {DetailRefundCS}
