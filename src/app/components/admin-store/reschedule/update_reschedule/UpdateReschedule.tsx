import React, {FC, useState, useEffect, useRef} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import axios from 'axios'
import Select from 'react-select'
import Swal from 'sweetalert2'
import {Table, Form, Button, Row, Col, Card, ListGroup} from 'react-bootstrap'
import {Image} from 'antd'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface Reschedule {
  order_id: any
  status_id: any
  reschedule_date: string
  reschedule_status_id: any
  description: string
  reschedule_status_by: string
}

interface Status {
  value: number
  category: string
}

const UpdateReschedule: FC<{updatePageTitle: (reschedule: any) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [orderId, setOrderId] = useState<any>()
  const [rescheduleDetail, setRescheduleDetail] = useState<any>()

  const userRole = localStorage.getItem('userRole')
  const [reschedule, setReschedule] = useState<Reschedule>({
    order_id: null,
    status_id: null,
    reschedule_date: '',
    reschedule_status_id: null,
    description: '',
    reschedule_status_by: '',
  })

  const getRescheduleDetail = async () => {
    try {
      await axios
        .get(`${apiUrl}/reschedule/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          setRescheduleDetail(data)
          updatePageTitle(data)

          if (data?.order_id) {
            setOrderId(data.order_id)
          }

          if (data) {
            setReschedule({
              order_id: data?.order_id ?? null,
              status_id: data?.status_id ?? null,
              reschedule_date: new Date(data.reschedule_date).toISOString().split('T')[0],
              reschedule_status_id: data?.reschedule_status[0]?.status_id,
              description: data?.reschedule_status[0]?.description,
              reschedule_status_by: data?.reschedule_status[0]?.status_by,
            })
          }

          if (data?.reschedule_evidences) {
            const rescheduleEvidencesValue = data.reschedule_evidences.map((item: any) => ({
              id: item.id,
              reschedule_id: item.reschedule_id,
              name: item.evidence_location,
            }))

            setRescheduleEvidence(rescheduleEvidencesValue)
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getRescheduleDetail()
  }, [])

  // Format Date
  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Reschedule Status
  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatus = statusData.find((status: any) => status.category === 'RESCHEDULE')
    const statusId = desiredStatus?.value

    setReschedule((prevRescheduleValues) => ({
      ...prevRescheduleValues,
      reschedule_status_id: statusId,
    }))
  }, [reschedule])

  // Reschedule Handler Form
  const today = new Date().toISOString().split('T')[0]

  const RescheduleFormHandler = (e: any) => {
    setReschedule({
      ...reschedule,
      [e.target.name]: e.target.value,
    })
  }

  // Upload File Reschedule
  const [rescheduleEvidence, setRescheduleEvidence] = useState<Array<File | null>>([])
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)
  const evidenceRef = useRef<HTMLInputElement>(null)

  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files

    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const existingFiles = [...rescheduleEvidence]
      const mergedFiles = existingFiles.concat(file)

      const {length: existingFilesLength} = existingFiles
      const {length: fileListLength} = fileList

      for (let i = 0; i < fileListLength; i++) {
        mergedFiles[existingFilesLength + i] = fileList.item(i)
      }

      setRescheduleEvidence(mergedFiles)
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleFileClick = (index: number) => {
    setPreviewImage(rescheduleEvidence[index]?.name)
    setVisible(true)
    setSelectedFileIndex(index)
  }

  const handleRemoveFile = (index: number) => {
    const newEvidances = [...rescheduleEvidence]
    newEvidances.splice(index, 1)
    setRescheduleDetail(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  // Reschedule Validation
  const RescheduleValidation = () => {
    let valid = true

    if (!reschedule.description) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill reschedule description form',
        icon: 'error',
      })
      valid = false
    } else if (!reschedule.reschedule_date) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill reschedule date form',
        icon: 'error',
      })
      valid = false
    } else if (!rescheduleEvidence) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill reschedule evidence form',
        icon: 'error',
      })
      valid = false
    }
    return valid
  }

  // Handle Update Reschedule
  const handleUpdateReschedule = async () => {
    if (RescheduleValidation()) {
      setIsLoading(true)
      const formData = new FormData()

      formData.append('order_id', reschedule.order_id)
      formData.append('status_id', reschedule.status_id)
      formData.append('reschedule_date', reschedule.reschedule_date)

      formData.append('reschedule_status[status_id]', reschedule.reschedule_status_id)
      formData.append('reschedule_status[description]', reschedule.description)
      formData.append('reschedule_status[status_by]', reschedule.reschedule_status_by)

      if (rescheduleEvidence?.length) {
        rescheduleEvidence.forEach((item) => {
          if (item) {
            formData.append(`reschedule_evidences`, item, item?.name)
          }
        })
      }

      await axios
        .post(`${apiUrl}/reschedule/${params.id}`, formData, {
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
              text: 'Success Update Reschedule',
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

          navigate('/complaint/report-complaint')
        })
        .catch((error) => {
          console.error(error)

          Swal.fire({
            title: 'Error',
            text: error.response.data.message,
            icon: 'error',
          })

          setIsLoading(false)
        })
    }
  }

  return (
    <section id='new-reschedule'>
      <Card className='mb=5'>
        <Card.Body>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko :
                  <span className='fs-4 ms-2 fw-normal'>
                    {rescheduleDetail?.order?.store?.store_name ?? ''}
                  </span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group as={Row} className='order-id-complaint'>
                  <Form.Label column sm='3' className='fs-4 fw-bold'>
                    Order ID :
                  </Form.Label>
                  <Col sm='9'>
                    <Form.Control type='number' readOnly value={rescheduleDetail?.order?.id} />
                  </Col>
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Receipt Number :
                  <span className='fs-4 ms-2 fw-normal'>
                    {rescheduleDetail?.order?.receipt_number ?? '-'}
                  </span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-4 fw-bold'>
                  LAST ORDER STATUS :{' '}
                  <span className='fs-4 ms-2 fw-bold text-success'>
                    {rescheduleDetail?.order?.status?.description}
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
                        <p className='fs-7'>{rescheduleDetail?.order?.members?.member_number}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Customer Name :
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>{rescheduleDetail?.order?.members?.full_name}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Alamat Pemasangan :
                      </Form.Label>
                      <Col sm='6'>
                        <p className='fs-7'>{rescheduleDetail?.order?.project_address}</p>
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='5'>
                        Nomor Telp/WA :
                      </Form.Label>
                      <Col sm='7'>
                        <p className='fs-7'>{rescheduleDetail?.order?.project_number}</p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='5'>
                        Alamat Email :
                      </Form.Label>
                      <Col sm='7'>
                        <p className='fs-7'>{rescheduleDetail?.order?.members?.email} </p>
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
                    <p className='fs-7'>{rescheduleDetail?.order?.sales?.id} </p>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='3'>
                    Sales Person :
                  </Form.Label>
                  <Col sm='9'>
                    <p className='fs-7'>{rescheduleDetail?.order?.sales?.full_name} </p>
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
                    {rescheduleDetail?.order?.payment_type === 'survey'
                      ? 'Tanggal request survey :'
                      : 'Tanggal request pemasangan :'}
                  </Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {formatDate(new Date(rescheduleDetail?.order?.request_survey))}
                    </p>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Informasi Vendor Pemasangan :</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {rescheduleDetail?.order?.vendor?.company_name ?? '-'}
                    </p>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} className='mb-3' controlId='formPlaintextEmail'>
                  <Form.Label column>Payment Type:</Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {(() => {
                        if (rescheduleDetail?.order?.payment_type === 'survey') {
                          return `Berbayar & Survey`
                        } else if (rescheduleDetail?.order?.payment_type === 'gratis') {
                          return `Gratis`
                        } else if (
                          rescheduleDetail?.order?.payment_type === 'pemasangan_tanpa_survey'
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
                rescheduleDetail?.order?.payment_type === 'survey' ||
                rescheduleDetail?.order?.work_orders?.work_order_status.length === 1
              ) {
                return (
                  <div className='table-warranty-content'>
                    {rescheduleDetail?.order?.is_overdistance === 1 && (
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
                        {rescheduleDetail?.order?.m_order_details.map((item: any, index: any) => (
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

                        {rescheduleDetail?.order?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td colSpan={3} className='text-end fw-bolder align-middle'>
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                rescheduleDetail?.order?.additional_fee
                              ).toLocaleString('id')}`}</td>
                            </tr>

                            <tr>
                              <td colSpan={3} className='text-end fw-bolder'>
                                Grand Total
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                rescheduleDetail?.order?.grand_total
                              ).toLocaleString('id')}`}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                ['QUOTEIN', 'QUOTEOUT'].includes(rescheduleDetail?.order?.status?.category ?? '') &&
                rescheduleDetail?.order?.payment_type === 'survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    {rescheduleDetail?.order?.is_overdistance === 1 && (
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
                        {rescheduleDetail?.order?.quotation[0]?.quotation_details.map(
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
                              rescheduleDetail?.order?.quotation[0]?.quotation_disc ?? 0
                            ).toLocaleString('id')}`}
                          </td>
                        </tr>

                        {rescheduleDetail?.order?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td colSpan={3} className='text-end fw-bolder align-middle'>
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                rescheduleDetail?.order?.additional_fee
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
                              rescheduleDetail?.order?.quotation[0]?.quotation_grand_total ?? 0
                            ).toLocaleString('id')}`}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )
              } else if (
                ['SURVEYSTART', 'SURVEYDONE', 'WORKEND', 'DONE'].includes(
                  rescheduleDetail?.order?.work_orders?.work_order_status[0]?.status?.category
                ) &&
                rescheduleDetail?.order?.work_orders?.work_order_status.length > 1 &&
                rescheduleDetail?.order?.payment_type === 'survey'
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
                        {rescheduleDetail?.order?.work_orders?.work_order_status[0]?.work_order_items.map(
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
                rescheduleDetail?.order?.payment_type === 'gratis' ||
                rescheduleDetail?.order?.payment_type === 'pemasangan_tanpa_survey'
              ) {
                return (
                  <div className='table-warranty-content'>
                    {rescheduleDetail?.order?.is_overdistance === 1 && (
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
                          {!(rescheduleDetail?.order?.payment_type === 'gratis') && (
                            <>
                              <th>Harga Jasa</th>
                              <th>Jumlah</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {rescheduleDetail?.order?.m_order_details.map((item: any, index: any) => (
                          <>
                            <tr key={`${index} - order_detail`}>
                              <td>{item?.item_code}</td>
                              <td>{item?.item_name}</td>
                              <td>{item?.item?.service_name}</td>
                              <td>{item?.quantity ?? 0}</td>
                              {!(rescheduleDetail?.order?.payment_type === 'gratis') && (
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

                        {rescheduleDetail?.order?.is_overdistance === 1 && (
                          <>
                            <tr>
                              <td colSpan={3} className='text-end fw-bolder align-middle'>
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                rescheduleDetail?.order?.additional_fee
                              ).toLocaleString('id')}.`}</td>
                            </tr>
                          </>
                        )}

                        <tr>
                          <td
                            colSpan={rescheduleDetail?.order?.payment_type !== 'gratis' ? 5 : 3}
                            className='text-end fw-bolder'
                          >
                            Grand Total
                          </td>

                          <td className=' fw-bolder'>
                            {(() => {
                              if (rescheduleDetail?.order?.payment_type === 'gratis') {
                                return `Rp. ${(0).toLocaleString('id')}`
                              } else if (
                                rescheduleDetail?.order?.payment_type === 'pemasangan_tanpa_survey'
                              ) {
                                return `Rp. ${parseInt(
                                  rescheduleDetail?.order?.grand_total
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

          <div className='title mb-3'>
            <h1 className='text-uppercase'>formulir reschedule</h1>
          </div>

          <Row className='mb-3'>
            <Col xxl={4} xl={4} md={4} sm={12}>
              <Form.Group className='detail-info mb-3'>
                <Form.Label>Tanggal Request Survey/Pekerjaan :</Form.Label>

                <p className='fs-3'>
                  {rescheduleDetail?.order?.request_survey
                    ? formatDate(new Date(rescheduleDetail?.order?.request_survey))
                    : 'DD-MM-YYYY'}
                </p>
              </Form.Group>

              <Form.Group className='detail-info mb-3'>
                <Form.Label>Tanggal Reschedule :</Form.Label>
                <Form.Control
                  name='reschedule_date'
                  type='date'
                  min={today}
                  disabled={userRole === 'Tukang'}
                  value={reschedule.reschedule_date}
                  onChange={(e) => RescheduleFormHandler(e)}
                />
              </Form.Group>
            </Col>

            <Col xxl={4} xl={4} md={4} sm={12}>
              <Form.Group className='detail-info mb-3'>
                <Form.Label>Alasan :</Form.Label>
                <Form.Control
                  as='textarea'
                  className='reason'
                  name='description'
                  value={reschedule.description}
                  disabled={userRole === 'Tukang'}
                  onChange={(e) => RescheduleFormHandler(e)}
                />
              </Form.Group>
            </Col>

            <Col xxl={4} xl={4} md={4} sm={12}>
              <Form.Group>
                <Form.Label className='mb-2'>
                  {userRole === 'Tukang' ? 'File Pendukung' : 'Upload File Pendukung'}
                </Form.Label>

                {userRole !== 'Tukang' && (
                  <>
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
                  </>
                )}

                <ListGroup>
                  {rescheduleEvidence.length ? (
                    rescheduleEvidence.map((item, index) => (
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
                                : `${apiUrl}/public/reschedule/${previewImage}`
                            }
                            preview={{
                              visible,
                              src:
                                item instanceof File
                                  ? URL.createObjectURL(item)
                                  : `${apiUrl}/public/reschedule/${previewImage}`,
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

          {userRole !== 'Tukang' && (
            <div className='d-flex justify-content-center mt-5'>
              <Button variant='dark-primary' type='submit' onClick={handleUpdateReschedule}>
                Save Update
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </section>
  )
}

export {UpdateReschedule}
