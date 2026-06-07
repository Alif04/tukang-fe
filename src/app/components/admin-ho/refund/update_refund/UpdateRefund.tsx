import React, {FC, useState, useEffect, useRef} from 'react'

import './UpdateRefund.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate, useParams} from 'react-router-dom'
import {Row, Col, Form, Button, ListGroup, Card} from 'react-bootstrap'
import {formatDate} from '../../../../../_metronic/helpers'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Image} from 'antd'
import {faFileImage, faImage, faTrash} from '@fortawesome/free-solid-svg-icons'

interface Refund {
  order_id: number | null
  refund_status: string | null
  notes: string
  reason: string
  date_of_filing: string
  date_approve: string
  penalty_nominal: string
  approval_number: string
  voucher: string
}

const UpdateRefundHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Refund Detail
  const [refundDetail, setRefundDetail] = useState<any>()

  const fetchRefundData = async () => {
    try {
      await axios
        .get(`${apiUrl}/refund/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            // 'Access-Control-Allow-Origin': '*',
           // 'ngrok-skip-browser-warning':  'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          setRefundValues({
            order_id: data?.orders?.id,
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
    // eslint-disable-next-line
  }, [])

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

  // Refund Status
  const getStatusId = (category: string) => {
    const storedStatus = localStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []
    const status = statusData.find((status: any) => status.category === category)
    return status?.value
  }

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

  // Handle Submit
  type RefundActionType = 'approve' | 'reject'

  const formData = new FormData()
  const appendIfNotDefault = (key: any, value: any) => {
    if (value !== null && value !== undefined && value !== '' && value !== 0) {
      formData.append(key, String(value))
    }
  }

  const handleRefundAction = async (action: RefundActionType) => {
    setIsLoading(true)

    const statusMap = {
      approve: {
        statusId: getStatusId('REFUNDAPPROVEDBYHO'),
        successMessage: 'Refund Approved Successfully',
      },
      reject: {
        statusId: getStatusId('REFUNDREJECTEDBYHO'),
        successMessage: 'Refund Rejected Successfully',
      },
    }

    const selectedStatus = statusMap[action]

    appendIfNotDefault('order_id', String(refundValues.order_id || ''))
    appendIfNotDefault('refund_status', selectedStatus?.statusId || '')
    appendIfNotDefault('notes', refundValues.notes)
    appendIfNotDefault('reason', refundValues.reason)
    appendIfNotDefault('date_approve', refundValues.date_approve)
    appendIfNotDefault('date_of_filing', refundValues.date_of_filing)
    appendIfNotDefault('voucher', refundValues.voucher)
    appendIfNotDefault('penalty_nominal', refundValues.penalty_nominal)
    appendIfNotDefault('approval_number', refundValues.approval_number)

    if (refundFiles.length) {
      refundFiles.forEach((item) => {
        if (item instanceof Blob) {
          formData.append(`refund_evidences`, item, item?.name)
        }
      })
    }

    try {
      const response = await axios.post(`${apiUrl}/refund/${params.id}`, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        //  // 'Access-Control-Allow-Origin': '*',
        // // 'ngrok-skip-browser-warning':  'true',
        },
      })

      if (response.data.status === 200 || response.data.status === 201) {
        Swal.fire({
          title: 'Success',
          text: selectedStatus.successMessage,
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
    } catch (error: any) {
      console.error(error)

      Swal.fire({
        title: 'Error',
        text: error?.response?.data?.message || 'Something went wrong',
        icon: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id='update-refund'>
      <Card>
        <Card.Body>
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

            {/* Table Order */}
            {(() => {
              if (
                (refundDetail?.orders?.payment_type === 'survey' &&
                  refundDetail?.orders?.work_orders === null) ||
                (refundDetail?.orders?.work_orders?.work_order_status?.length === 1 &&
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
                [
                  'CANCEL',
                  'REFUND',
                  'QUOTEIN',
                  'QUOTEOUT',
                  'QUOTATIONPAID',
                  'QUOTATIONPAIDSTEPONE',
                  'QUOTATIONPAIDSTEPTWO',
                  'QUOTATIONPAIDSTEPTHREE',
                ].includes(refundDetail?.orders?.status?.category ?? '') &&
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
                          ?.filter((x: any) => x.item_type === 2)
                          ?.map((item: any, index: any) => (
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
                              ?.filter((x: any) => x.item_type === 2)
                              ?.map((item: any) => parseInt(item?.price ?? 0))
                              ?.reduce((total: number, price: number) => total + price, 0)
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
                            ?.filter((x: any) => x.item_type === 1)
                            ?.map((item: any, index: any) => (
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
                [
                  'CANCEL',
                  'REFUND',
                  'SURVEYREQ',
                  'SURVEYSTART',
                  'SURVEYDONE',
                  'WORKEND',
                  'DONE',
                ].includes(
                  refundDetail?.orders?.work_orders?.work_order_status?.[0]?.status?.category
                ) &&
                refundDetail?.orders?.payment_type === 'survey' &&
                refundDetail?.orders?.work_orders?.work_order_status?.length >= 1
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
                          refundDetail?.orders?.work_orders.work_order_status[0].work_order_items.map(
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
                                <td>{`Rp. ${parseInt(item?.total || 0).toLocaleString('id')}`}</td>
                              </>
                            )}
                          </tr>
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

          <section className='refund-form'>
            <div className='title'>
              <h1 className='text-uppercase'>formulir refund</h1>
            </div>

            <Row className='mb-5'>
              <Col md={4}>
                <div className='complaint-information'>
                  <h4>Tanggal Pengajuan Refund : </h4>

                  <Form.Control
                    type='date'
                    className='w-75'
                    min={today}
                    readOnly
                    onChange={(element) => handleChangeRefundDate(element)}
                    value={refundValues.date_of_filing}
                  />
                </div>
              </Col>

              <Col md={4}>
                <div className='complaint-detail'>
                  <h4>Alasan Refund :</h4>

                  <Form.Control
                    as='textarea'
                    className='desc-notes'
                    onChange={(element) => handleChangeRefundDescription(element)}
                    value={refundValues.reason}
                  />
                </div>
              </Col>

              <Col md={4}>
                <Row>
                  <Col md={6}>
                    <Form.Group className='d-flex flex-column'>
                      <Form.Label className='fs-4 fw-bold mb-1'>Untuk Customer</Form.Label>
                      <Form.Label className='mb-1'>Input Voucher</Form.Label>
                      <Form.Control
                        type='text'
                        onChange={(element) => handleChangeRefundVoucher(element)}
                        value={refundValues.voucher}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    {refundDetail?.orders?.vendor_id !== null && (
                      <Form.Group className='d-flex flex-column'>
                        <Form.Label className='fs-4 fw-bold mb-1'>Untuk Vendor</Form.Label>
                        <Form.Label className='mb-1'>Input Nominal Denda</Form.Label>
                        <Form.Control
                          type='text'
                          onChange={(element) => handleChangePenaltyAmount(element)}
                          value={refundValues.penalty_nominal}
                        />
                      </Form.Group>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
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
                  <h4>Nomor Receipt Refund : </h4>
                  <Form.Control
                    type='text'
                    className='w-75'
                    onChange={(element) => handleChangeApprovalNumber(element)}
                    value={refundValues.approval_number}
                  />
                </div>
              </Col>

              <Col md={4}>
                <div className='complaint-information'>
                  <h4>Notes</h4>
                  <Form.Control
                    as='textarea'
                    className='desc-notes'
                    onChange={(element) => handleChangeRefundNotes(element)}
                    value={refundValues.notes}
                  />
                </div>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <h4>File Pendukung : </h4>

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

                            <span
                              className='upload-content'
                              style={{cursor: 'pointer'}}
                              onClick={() => handleFileClick(index)}
                            >
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
                              style={{display: 'none', cursor: 'pointer'}}
                              src={
                                item instanceof File
                                  ? URL.createObjectURL(item)
                                  : `${apiUrl}/public/refunds/${previewImage}`
                              }
                              preview={{
                                visible,
                                src:
                                  item instanceof File
                                    ? URL.createObjectURL(item)
                                    : `${apiUrl}/public/refunds/${previewImage}`,
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
            </Row>
          </section>

          <div className='d-flex justify-content-center'>
            <Button
              variant='dark-danger'
              disabled={isLoading}
              type='submit'
              onClick={() => handleRefundAction('reject')}
            >
              {isLoading ? 'Updating..' : 'Reject'}
            </Button>

            <Button
              className='d-flex justify-content-center align-items-center'
              variant='dark-primary'
              type='submit'
              disabled={isLoading}
              onClick={() => handleRefundAction('approve')}
            >
              {isLoading ? 'Updating..' : 'Approve'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {UpdateRefundHO}
