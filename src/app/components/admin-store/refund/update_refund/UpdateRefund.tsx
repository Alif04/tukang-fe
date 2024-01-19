import React, {FC, useState, useEffect, useRef} from 'react'

import './UpdateRefund.css'

import axios from 'axios'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {Row, Col, Form, Button, Table, ListGroup} from 'react-bootstrap'
import {Image} from 'antd'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface Option {
  readonly label: string
  readonly value: string
}

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
}

const UpdateRefundCS: FC = () => {
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

          if (data?.refund_evidences) {
            const refundEvidencesValue = data.refund_evidences.map((item: any) => ({
              id: item.id,
              name: item.evidence_location,
            }))

            setRefundFiles(refundEvidencesValue)
          }

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
  })

  const [refundFiles, setRefundFiles] = useState<Array<File | null>>([])
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)
  const evidenceRef = useRef<HTMLInputElement>(null)

  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)

  // Refund Order Id
  useEffect(() => {
    setRefundValues((prevRefundValues) => ({
      ...prevRefundValues,
      order_id: orderId,
    }))
  }, [refundValues, orderId])

  // Refund Status
  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatus = statusData.find((status: any) => status.category === 'REFUND')
    const statusId = desiredStatus?.value

    setRefundValues((prevRefundValues) => ({
      ...prevRefundValues,
      refund_status: statusId,
    }))
  }, [refundValues])

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

  // Change Refund Notes
  const handleChangeRefundNotes = (element: any) => {
    const newRefundNotes = element.target.value

    setRefundValues((prevRefundValues) => ({
      ...prevRefundValues,
      notes: newRefundNotes,
    }))
  }

  // Upload Order File Handler
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const {length} = fileList

      for (let i = 0; i < length; i++) {
        file[i] = fileList.item(i)
      }

      setRefundFiles(file)
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = (index: number) => {
    const newEvidances = [...refundFiles]
    newEvidances.splice(index, 1)
    setRefundFiles(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  const handleFileClick = (index: number) => {
    setPreviewImage(refundFiles[index]?.name)
    setVisible(true)
    setSelectedFileIndex(index)
  }

  // Handle Submit Update Refund
  const handleUpdateRefund = async () => {
    await axios
      .post(`${apiUrl}/refund/${params.id}`, refundValues, {
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
                  {refundDetail?.orders?.m_order_details.map((item: any, index: any) => (
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

            <Row className='mb-5'>
              <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
                <Form.Group>
                  <Form.Label className='fs-5 fw-bold'>Tanggal Pengajuan Refund</Form.Label>

                  <Form.Control
                    type='date'
                    className='w-100'
                    min={today}
                    value={refundValues.date_of_filing}
                    onChange={(element) => handleChangeRefundDate(element)}
                  />
                </Form.Group>
              </Col>

              <Col xxl={8} xl={8} lg={8} md={8} sm={12}>
                <Form.Group>
                  <Form.Label className='fs-5 fw-bold'>Alasan Refund : </Form.Label>

                  <Form.Control
                    as='textarea'
                    className='desc-notes'
                    value={refundValues.reason}
                    onChange={(element) => handleChangeRefundDescription(element)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className='mb-5'>
              <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
                <Form.Group>
                  <Form.Label>Upload File Pendukung</Form.Label>
                  <Form className='form-input-image' onClick={handleImageClick}>
                    <Form.Control
                      type='file'
                      accept='image/jpeg, image/png'
                      className='input-field-image'
                      multiple
                      hidden
                      id='file-input'
                      ref={evidenceRef}
                      onChange={handleFileChange}
                    />

                    <div className='input-image-text'>
                      <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                      <p>Add File</p>
                    </div>
                  </Form>

                  <ListGroup className='pt-3'>
                    {refundFiles.length ? (
                      refundFiles.map((item, index) => (
                        <ListGroup>
                          <ListGroup.Item
                            className='d-flex justify-content-between align-items-center'
                            key={`${item?.name}-${index}-${item?.type}`}
                          >
                            <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                            <span className='upload-content' onClick={() => handleFileClick(index)}>
                              {item?.name}
                            </span>

                            <FontAwesomeIcon
                              icon={faTrash}
                              size='sm'
                              color='#ed2b2a'
                              style={{cursor: 'pointer'}}
                              onClick={(e) => handleRemoveFile(index)}
                            />
                          </ListGroup.Item>

                          {selectedFileIndex === index && item && (
                            <Image
                              key={`${previewImage} - ${index}`}
                              width={200}
                              style={{display: 'none'}}
                              src={
                                item instanceof File
                                  ? URL.createObjectURL(item)
                                  : `${apiUrl}/public/refund/${previewImage}`
                              }
                              preview={{
                                visible,
                                src:
                                  item instanceof File
                                    ? URL.createObjectURL(item)
                                    : `${apiUrl}/public/refund/${previewImage}`,
                                onVisibleChange: (value) => {
                                  setVisible(value)
                                },
                              }}
                            />
                          )}
                        </ListGroup>
                      ))
                    ) : (
                      <ListGroup.Item className='d-flex justify-content-center'>
                        Tidak ada file yang dipilih
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Form.Group>
              </Col>

              <Col xxl={8} xl={8} lg={8} md={8} sm={12}>
                <Form.Group>
                  <Form.Label className='fs-5 fw-bold'>Notes : </Form.Label>

                  <Form.Control
                    as='textarea'
                    className='desc-notes'
                    value={refundValues.notes}
                    onChange={(element) => handleChangeRefundNotes(element)}
                  />
                </Form.Group>
              </Col>
            </Row>
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

export {UpdateRefundCS}
