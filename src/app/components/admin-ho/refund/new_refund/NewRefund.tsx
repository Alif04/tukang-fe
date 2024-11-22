import React, {FC, useState, useEffect, KeyboardEventHandler} from 'react'

import './NewRefund.css'

import axios from 'axios'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, Button, Table} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface Option {
  readonly label: string
  readonly value: string
}

const components = {
  DropdownIndicator: null,
}

const inputVoucher = (label: string) => ({
  label,
  value: label,
})

interface Refund {
  order_id: any
  refund_status: any
  notes: string
  reason: string
  date_of_filing: any
  date_approve: any
  penalty_nominal: any
  approval_number: any
  voucher: string
  // refund_voucher: Option[]
}

const NewRefundHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch Data Order
  const [order, setOrder] = useState<any>()
  const [orderId, setOrderId] = useState<string>('')
  const [orderDetail, setOrderDetail] = useState<any>()

  const getOrder = async () => {
    try {
      const response = await axios.get(`${apiUrl}/orders?order_by=desc&take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempOrder = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.id,
          payment_type: item.payment_type,
        }))

        const filteredOrder = tempOrder.filter((detail: any) => detail.payment_type !== 'gratis')

        setOrder(filteredOrder)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getOrderDetail = async () => {
    try {
      await axios
        .get(`${apiUrl}/orders/${orderId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          setOrderDetail(data)
        })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getOrder()
  }, [])

  useEffect(() => {
    if (orderId) {
      getOrderDetail()
    }
  }, [orderId])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Add Refund
  const [refundValues, setRefundValues] = useState<Refund>({
    order_id: null,
    refund_status: null,
    notes: '',
    reason: '',
    date_approve: '',
    date_of_filing: '',
    voucher: '',
    penalty_nominal: '',
    approval_number: '',
    // refund_voucher: [],
  })

  // Refund Status
  useEffect(() => {
    const storedStatus = localStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatus = statusData.find((status: any) => status.category === 'REFUND')
    const statusId = desiredStatus?.value

    setRefundValues((prevRefundValues) => ({
      ...prevRefundValues,
      refund_status: statusId,
    }))
  }, [refundValues])

  // Select Order
  const handleChangeSelectOrder = (element: any) => {
    const selectedOrder = element.value

    setRefundValues((prevRefundValues) => ({
      ...prevRefundValues,
      order_id: selectedOrder,
    }))

    setOrderId(selectedOrder)
  }

  // Createable Multi Value
  const [inputValue, setInputValue] = React.useState('')
  const [value, setValue] = React.useState<readonly Option[]>([])

  // const handleKeyDown: KeyboardEventHandler = (event) => {
  //   if (!inputValue) return

  //   switch (event.key) {
  //     case 'Enter':
  //     case 'Tab':
  //       const newVoucher = inputVoucher(inputValue)

  //       setValue((prev) => [...prev, newVoucher])
  //       setInputValue('')

  //       setRefundValues((prevValues) => ({
  //         ...prevValues,
  //         refund_voucher: [...prevValues.refund_voucher, newVoucher],
  //       }))

  //       event.preventDefault()
  //   }
  // }

  // Handle Change Refund Voucher
  const handleChangeRefundVoucher = (element: any) => {
    const newRefundVoucher = element.target.value

    setRefundValues((prevRefundValues) => ({
      ...prevRefundValues,
      voucher: newRefundVoucher,
    }))
  }

  // Handle Change Refund Date
  const today = new Date().toISOString().split('T')[0]

  // Change Input Date
  const handleChangeRefundDate = (element: any) => {
    const newRefundDate = element.target.value

    setRefundValues((prevRefundValues) => ({
      ...prevRefundValues,
      date_of_filing: newRefundDate,
    }))
  }

  // Change Input Refund Description
  const handleChangeRefundDescription = (element: any) => {
    const newRefundDescription = element.target.value

    setRefundValues((prevRefundValues) => ({
      ...prevRefundValues,
      reason: newRefundDescription,
    }))
  }

  // Change Approval Refund
  const handleChangeApproveRefundDate = (element: any) => {
    const newRefundApproveDate = element.target.value

    setRefundValues((prevRefundValues) => ({
      ...prevRefundValues,
      date_approve: newRefundApproveDate,
    }))
  }

  // Change Nomor Approval
  const handleChangeApprovalNumber = (element: any) => {
    const newRefundApproveDate = element.target.value

    setRefundValues((prevRefundValues) => ({
      ...prevRefundValues,
      approval_number: newRefundApproveDate,
    }))
  }

  // Change Refund Notes
  const handleChangeRefundNotes = (element: any) => {
    const newRefundNotes = element.target.value

    setRefundValues((prevRefundValues) => ({
      ...prevRefundValues,
      notes: newRefundNotes,
    }))
  }

  // Change Nomor Approval
  const handleChangePenaltyAmount = (element: any) => {
    const newPenalyAmount = element.target.value

    setRefundValues((prevRefundValues) => ({
      ...prevRefundValues,
      penalty_nominal: newPenalyAmount,
    }))
  }

  // Handle Submit New Refund
  const handleSubmitNewRefund = async () => {
    setIsLoading(true)

    await axios
      .post(`${apiUrl}/refund`, refundValues, {
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
            text: 'Success Create Refund',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
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

        navigate('/refund/view-refund')
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

  const handleCancelRefund = () => {
    navigate('/refund/view-refund')
  }

  return (
    <section id='new-refund'>
      <div className='card'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko :
                  <span className='fs-4 ms-2 fw-normal'>
                    {orderDetail?.store?.store_name ?? ''}
                  </span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group as={Row} className='order-id-complaint'>
                  <Form.Label column sm='3' className='fs-4 fw-bold'>
                    Order ID :
                  </Form.Label>
                  <Col sm='9'>
                    <Select
                      name='order-id'
                      className='form-control p-0'
                      placeholder='Ketik/Pilih Order Id'
                      isSearchable={true}
                      options={order}
                      onChange={(e) => handleChangeSelectOrder(e)}
                    />
                  </Col>
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Receipt Number :
                  <span className='fs-4 ms-2 fw-normal'>{orderDetail?.receipt_number ?? '-'}</span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-4 fw-bold'>
                  LAST ORDER STATUS :{' '}
                  <span className='fs-4 ms-2 fw-bold text-success'>
                    {orderDetail?.status?.category}
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
                        <p className='fs-7'>{orderDetail?.members?.member_number}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Customer Name :
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>{orderDetail?.members?.full_name}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Alamat Pemasangan :
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>{orderDetail?.project_address}</p>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='5'>
                        Nomor Telp/WA :
                      </Form.Label>
                      <Col sm='7'>
                        <p className='fs-7'>{orderDetail?.project_number}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='5'>
                        Alamat Email :
                      </Form.Label>
                      <Col sm='7'>
                        <p className='fs-7'>{orderDetail?.members?.email} </p>
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
                    <p className='fs-7'>{orderDetail?.sales?.id} </p>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='3'>
                    Sales Person :
                  </Form.Label>
                  <Col sm='9'>
                    <p className='fs-7'>{orderDetail?.sales?.full_name} </p>
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
                  <Form.Label column>Tanggal request pemasangan :</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {orderDetail?.request_survey
                        ? formatDate(new Date(orderDetail?.request_survey))
                        : ''}
                    </p>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Informasi Vendor Pemasangan :</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>{orderDetail?.vendor?.company_name ?? '-'}</p>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Payment Type:</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {(() => {
                        if (orderDetail?.payment_type === 'survey') {
                          return `Berbayar & Survey`
                        } else if (orderDetail?.payment_type === 'gratis') {
                          return `Gratis`
                        } else if (orderDetail?.payment_type === 'pemasangan_tanpa_survey') {
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
                orderDetail?.payment_type === 'survey' &&
                orderDetail?.work_orders?.work_order_status.length === 1
              ) {
                return (
                  <div className='table-warranty-content'>
                    {orderDetail?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari
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
                        {orderDetail?.m_order_details?.map((item: any, index: any) => (
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

                        {orderDetail?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td colSpan={3} className='text-end fw-bolder align-middle'>
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                orderDetail?.additional_fee
                              ).toLocaleString('id')}`}</td>
                            </tr>

                            <tr>
                              <td colSpan={3} className='text-end fw-bolder'>
                                Grand Total
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                orderDetail?.grand_total
                              ).toLocaleString('id')}`}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                ['QUOTEIN', 'QUOTEOUT'].includes(orderDetail?.status?.category ?? '') &&
                orderDetail?.payment_type === 'survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    {orderDetail?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari
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
                        {orderDetail?.quotation[0]?.quotation_details.map(
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
                              orderDetail?.quotation[0]?.quotation_disc ?? 0
                            ).toLocaleString('id')}`}
                          </td>
                        </tr>

                        {orderDetail?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td colSpan={3} className='text-end fw-bolder align-middle'>
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                orderDetail?.additional_fee
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
                              orderDetail?.quotation[0]?.quotation_grand_total ?? 0
                            ).toLocaleString('id')}`}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                ['SURVEYSTART', 'SURVEYDONE', 'WORKEND', 'DONE'].includes(
                  orderDetail?.work_orders?.work_order_status[0]?.status?.category
                ) &&
                orderDetail?.work_orders?.work_order_status.length > 1 &&
                orderDetail?.payment_type === 'survey'
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
                        {orderDetail?.work_orders?.work_order_status[0]?.work_order_items.map(
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
                orderDetail?.payment_type === 'gratis' ||
                orderDetail?.payment_type === 'pemasangan_tanpa_survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    {orderDetail?.is_overdistance === 1 && (
                      <>
                        <Form.Text className='fs-8 text-dark'>
                          *Order ini lebih dari
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
                          {!(orderDetail?.payment_type === 'gratis') && (
                            <>
                              <th>Harga Jasa</th>
                              <th>Jumlah</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetail?.m_order_details?.map((item: any, index: any) => (
                          <>
                            <tr key={`${index} - order_detail`}>
                              <td>{item?.item_code}</td>
                              <td>{item?.item_name}</td>
                              <td>{item?.item?.service_name}</td>
                              <td>{item?.quantity ?? 0}</td>
                              {!(orderDetail?.payment_type === 'gratis') && (
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

                        {orderDetail?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td colSpan={3} className='text-end fw-bolder align-middle'>
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                orderDetail?.additional_fee
                              ).toLocaleString('id')}.`}</td>
                            </tr>
                          </>
                        )}

                        <tr>
                          <td
                            colSpan={orderDetail?.payment_type !== 'gratis' ? 5 : 3}
                            className='text-end fw-bolder'
                          >
                            Grand Total
                          </td>

                          <td className=' fw-bolder'>
                            {(() => {
                              if (orderDetail?.payment_type === 'gratis') {
                                return `Rp. ${(0).toLocaleString('id')}`
                              } else if (orderDetail?.payment_type === 'pemasangan_tanpa_survey') {
                                return `Rp. ${parseInt(orderDetail?.grand_total).toLocaleString(
                                  'id'
                                )}`
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
                    type='date'
                    className='w-75'
                    min={today}
                    onChange={(element) => handleChangeRefundDate(element)}
                  />
                </div>
              </div>

              <div className='col-md-4'>
                <div className='complaint-detail'>
                  <h4>Alasan Refund :</h4>

                  <Form.Control
                    as='textarea'
                    className='desc-notes'
                    onChange={(element) => handleChangeRefundDescription(element)}
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
                    type='date'
                    min={today}
                    className='w-75'
                    onChange={(element) => handleChangeApproveRefundDate(element)}
                  />
                </div>

                <div className='complaint-information'>
                  <h4>Nomor Approval : </h4>
                  <Form.Control
                    type='number'
                    className='w-75'
                    onChange={(element) => handleChangeApprovalNumber(element)}
                  />
                </div>
              </div>

              <div className='col-xxl-4'>
                <div className='complaint-information'>
                  <h4>Notes</h4>
                  <Form.Control
                    as='textarea'
                    className='desc-notes'
                    onChange={(element) => handleChangeRefundNotes(element)}
                  />
                </div>
              </div>

              <div className='col-xxl-4'>
                <div className='row'>
                  <div className='col-xxl-6'>
                    <Form.Group>
                      <Form.Label className='fs-4 fw-bold mb-1'>Untuk Customer</Form.Label>
                      <Form.Label className='mb-1'>Input Voucher</Form.Label>
                      <Form.Control
                        type='text'
                        onChange={(element) => handleChangeRefundVoucher(element)}
                      />
                    </Form.Group>

                    {/* <CreatableSelect
                      className='mt-5 mb-5'
                      components={components}
                      inputValue={inputValue}
                      isClearable
                      isMulti
                      menuIsOpen={false}
                      onChange={(newValue) => setValue(newValue)}
                      onInputChange={(newValue) => setInputValue(newValue)}
                      onKeyDown={handleKeyDown}
                      placeholder='Input Kode Voucher dan Pencet Enter'
                      value={value}
                    /> */}

                    {/* <Button variant='primary'>Voucher</Button> */}
                  </div>

                  <div className='col-xxl-6'>
                    <Form.Group>
                      <Form.Label className='fs-4 fw-bold mb-1'>Untuk Vendor</Form.Label>
                      <Form.Label className='mb-1'>Input Nominal Denda</Form.Label>
                      <Form.Control
                        type='text'
                        onChange={(element) => handleChangePenaltyAmount(element)}
                      />
                    </Form.Group>

                    {/* <Button variant='danger'>Penalty</Button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='d-flex justify-content-center'>
            <Button variant='dark-danger' type='submit' onClick={handleCancelRefund}>
              Cancel
            </Button>

            <Button
              variant='dark-primary'
              type='submit'
              disabled={isLoading}
              onClick={handleSubmitNewRefund}
            >
              {isLoading ? 'Submitting' : 'Submit Refund'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewRefundHO}
