import React, {FC, useState, useEffect, KeyboardEventHandler} from 'react'

import './UpdateRefund.css'

import axios from 'axios'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
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

const UpdateRefundHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()

  // Refund Detail
  const [orderId, setOrderId] = useState<string>('')
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

          if (data?.orders.id) {
            setOrderId(data.id)
          }

          setRefundValues({
            order_id: data.id,
            refund_status: data.refund_status,
            notes: data.notes,
            reason: data.reason,
            date_approve: new Date(data.date_approve).toISOString().split('T')[0],
            date_of_filing: new Date(data.date_of_filing).toISOString().split('T')[0],
            voucher: data.voucher,
            penalty_nominal: data.penalty_nominal,
            approval_number: data.approval_number,
          })

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
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatus = statusData.find((status: any) => status.category === 'REFUND')
    const statusId = desiredStatus.value

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
      store_id: selectedOrder,
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
  const handleUpdateRefund = async () => {
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
            text: 'Success Update Refund',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          })
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })
        }

        navigate('/refund/view-refund')
      })
      .catch((error) => {
        console.error(error)

        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
        })
      })
  }

  const handleCancelUpdateRefund = () => {
    navigate('/refund/view-refund')
  }

  return (
    <section id='update-refund'>
      <div className='card'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko :
                  <span className='fs-4 ms-2 fw-normal'>
                    {refundDetail?.store?.store_name ?? ''}
                  </span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group as={Row} className='order-id-complaint'>
                  <Form.Label className='fs-4 fw-bold'>
                    Order ID :
                    <span className='fs-4 ms-2 fw-normal'>{refundDetail?.orders?.id ?? ''}</span>
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
                  <Form.Label column>Tanggal request pemasangan :</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {refundDetail?.orders?.request_survey
                        ? formatDate(new Date(refundDetail?.orders?.request_survey))
                        : ''}
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

            <div className='table-warranty-content'>
              <Table hover responsive='md'>
                <thead className='table-warranty-head'>
                  <tr>
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Nama Pemasangan</th>
                    <th>QTY Pemasangan</th>
                    {!(
                      refundDetail?.orders?.payment_type === 'gratis' ||
                      refundDetail?.orders?.payment_type === 'survey'
                    ) && (
                      <>
                        <th>Harga Jasa</th>
                        <th>Jumlah</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {refundDetail?.orders?.order_details.map((item: any, index: any) => (
                    <>
                      <tr key={`${index} - detail-order`}>
                        <td>{item?.item_code ?? '-'}</td>
                        <td>{item?.item_name ?? '-'}</td>
                        <td>{item?.item?.service_name ?? '-'}</td>
                        <td>{item?.quantity ?? '-'}</td>
                        {!(
                          refundDetail?.orders?.payment_type === 'gratis' ||
                          refundDetail?.orders?.payment_type === 'survey'
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

                  {refundDetail?.orders?.payment_type !== 'gratis' &&
                    refundDetail?.orders?.payment_type !== 'pemasangan_tanpa_survey' && (
                      <tr>
                        <td
                          colSpan={refundDetail?.orders?.payment_type === 'survey' ? 3 : 5}
                          className='text-end fw-bolder'
                        >
                          Biaya Survey
                        </td>

                        <td className=' fw-bolder'>
                          {refundDetail?.orders?.payment_type === 'gratis' ||
                          refundDetail?.orders?.payment_type === 'pemasangan_tanpa_survey'
                            ? `Rp. ${(0).toLocaleString('id')}`
                            : refundDetail?.orders?.payment_type === 'survey'
                            ? `Rp. ${(99000).toLocaleString('id')}`
                            : `Rp. ${0}`}
                        </td>
                      </tr>
                    )}

                  {refundDetail?.orders?.payment_type !== 'survey' && (
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
                          } else if (refundDetail?.orders?.payment_type === 'survey') {
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
                    value={refundValues.date_of_filing}
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
                    value={refundValues.reason}
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
                    value={refundValues.date_approve}
                  />
                </div>

                <div className='complaint-information'>
                  <h4>Nomor Approval : </h4>
                  <Form.Control
                    type='number'
                    className='w-75'
                    onChange={(element) => handleChangeApprovalNumber(element)}
                    value={refundValues.approval_number}
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
                    value={refundValues.notes}
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
                      onChange={(element) => handleChangeRefundVoucher(element)}
                      value={refundValues.voucher}
                    />

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

                    <Button variant='primary'>Voucher</Button>
                  </div>

                  <div className='col-xxl-6'>
                    <h4 className='mb-2'>Untuk Vendor</h4>
                    <h4 className='mb-2'>Input Nominal Denda</h4>

                    <Form.Control
                      type='number'
                      className='mt-5 mb-5'
                      onChange={(element) => handleChangePenaltyAmount(element)}
                      value={refundValues.penalty_nominal}
                    />

                    <Button variant='danger'>Penalty</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='d-flex justify-content-center'>
            <Button variant='dark-danger' type='submit' onClick={handleCancelUpdateRefund}>
              Cancel
            </Button>

            <Button variant='dark-primary' type='submit' onClick={handleUpdateRefund}>
              Update Refund
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {UpdateRefundHO}
