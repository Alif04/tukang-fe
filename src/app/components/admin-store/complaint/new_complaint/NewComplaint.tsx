import React, {FC, useState, useEffect, useRef} from 'react'
import {useNavigate} from 'react-router-dom'

import './NewComplaint.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Image} from 'antd'
import Select, {SingleValue} from 'react-select'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Row, Col, Form, Button, ListGroup, Card} from 'react-bootstrap'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

interface Complaint {
  order_id: number | null
  pic_name: string
  description: string
  complaint_channel: number | null
  complaint_date: string
  complaint_status: string
  complaint_type: number
}

interface ComplaintChannel {
  value: number | null
  label: string
}

interface Order {
  value: number | null
  label: string
}

const NewComplaintForm: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const today = String(new Date().toISOString().split('T')[0])

  const userStore = localStorage.getItem('storeId')
  const userRole = localStorage.getItem('userRole')
  const userVendor = localStorage.getItem('vendor_id')

  // Loading
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Data Order
  const [order, setOrder] = useState<Order[]>([])
  const [orderDetail, setOrderDetail] = useState<any>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<SingleValue<Order>>({
    value: null,
    label: 'Ketik/Pilih Order Id',
  })

  // Add Complaint
  const [complaintCode, setComplaintCode] = useState<string | number>('NaN')
  const [complaintForm, setComplaintForm] = useState<Complaint>({
    order_id: null,
    pic_name: '',
    description: '',
    complaint_channel: null,
    complaint_date: '',
    complaint_status: '',
    complaint_type: 1,
  })

  // Complaint Channel
  const [complaintChannel, setComplaintChannel] = useState<ComplaintChannel[]>([])
  const [selectedComplaintChannel, setSelectedComplaintChannel] = useState<
    SingleValue<ComplaintChannel>
  >({
    value: null,
    label: 'Complaint Via',
  })

  const [complaintEvidence, setComplaintEvidence] = useState<Array<File | null>>([])
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)

  const evidenceRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<any>()
  const [visible, setVisible] = useState(false)

  const getOrder = async () => {
    try {
      const url = (() => {
        switch (userRole) {
          case 'Store CS':
            return `${apiUrl}/orders?order_by=desc&store_id=${userStore}&take=0`
          case 'Admin HO':
            return `${apiUrl}/orders?order_by=desc&take=0`
          case 'Admin Vendor':
            return `${apiUrl}/orders?order_by=desc&vendor_id=${userVendor}&take=0`
          default:
            return `${apiUrl}/orders?order_by=desc&take=0`
        }
      })()

      const response = await axios.get(url, {
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
          status: item.status.category,
        }))

        const filteredOrder = tempOrder.filter(
          (detail: any) =>
            ![
              'UNPAID',
              'PICKLIST',
              'BOOK',
              'BOOKED',
              'INVESTIGATE',
              'INVESTIGATED',
              'COMPLAINTAPPROVEDBYHO',
              'COMPLAINTREJECTEDBYHO',
              'SURVEYREQ',
              'WORKREQ',
            ].includes(detail.status)
        )

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
        .get(`${apiUrl}/orders/${selectedOrderId?.value}`, {
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

  const getComplaintChannel = async () => {
    try {
      const response = await axios.get(`${apiUrl}/complaint-channels`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempComplaintChannel = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        }))

        setComplaintChannel(tempComplaintChannel)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getCode = async () => {
    try {
      const response = await axios.get(`${apiUrl}/complaints/next-code`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response.status === 200) {
        const {data} = response
        setComplaintCode(data.data.code)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getOrder()
    getComplaintChannel()
    getCode()
  }, [complaintCode])

  useEffect(() => {
    if (selectedOrderId?.value) {
      getOrderDetail()
    }
  }, [selectedOrderId?.value])

  useEffect(() => {
    setComplaintForm({
      ...complaintForm,
      order_id: selectedOrderId?.value ?? null,
      complaint_channel: selectedComplaintChannel?.value ?? null,
    })
  }, [selectedOrderId, selectedComplaintChannel])

  // Complaint Status
  useEffect(() => {
    const storedStatus = sessionStorage.getItem('statusData')
    const statusData = storedStatus ? JSON.parse(storedStatus) : []

    const desiredStatusName = 'INVESTIGATED'
    const desiredStatus = statusData.find((status: any) => status?.category === desiredStatusName)
    const statusId = desiredStatus?.value

    setComplaintForm({
      ...complaintForm,
      complaint_status: statusId,
    })
  }, [])

  // Complaint Form Handler
  const complaintFormHandler = (e: any) => {
    setComplaintForm({
      ...complaintForm,
      [e.target.name]: e.target.value,
    })
  }

  // Handle Change Upload File
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const file: Array<File | null> = new Array<File>()
      const {length} = fileList

      for (let i = 0; i < length; i++) {
        file[i] = fileList.item(i)
      }

      setComplaintEvidence(file)
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = (index: number) => {
    const newEvidances = [...complaintEvidence]

    newEvidances.splice(index, 1)

    setComplaintEvidence(newEvidances)

    // Update element value
    if (evidenceRef.current?.value) {
      evidenceRef.current.value = ''
    }
  }

  const handleFileClick = (index: number) => {
    setPreviewImage(complaintEvidence[index]?.name)
    setVisible(true)
    setSelectedFileIndex(index)
  }

  // Complaint Validation
  const ComplaintValidation = () => {
    let valid = true

    if (!selectedOrderId?.value) {
      Swal.fire({
        title: 'Error',
        text: 'Please select order Id',
        icon: 'error',
      })
      valid = false
    } else if (!complaintForm.description) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill complaint description form',
        icon: 'error',
      })
      valid = false
    } else if (!selectedComplaintChannel?.value) {
      Swal.fire({
        title: 'Error',
        text: 'Please select complaint channel',
        icon: 'error',
      })
      valid = false
    } else if (!complaintEvidence) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill complaint evidence form',
        icon: 'error',
      })
      valid = false
    }
    return valid
  }

  // Clear State
  const clear = (e: any) => {
    e.preventDefault()

    // Order
    setOrderDetail(null)
    setSelectedOrderId({
      value: null,
      label: 'Ketik/Pilih Order Id',
    })

    // Complaint
    setComplaintCode('')
    setComplaintForm({
      order_id: null,
      complaint_channel: null,
      pic_name: '',
      description: '',
      complaint_date: '',
      complaint_status: '',
      complaint_type: 1,
    })
    setComplaintEvidence([])
    setSelectedComplaintChannel({
      value: null,
      label: 'Complaint Via',
    })
  }

  // Handle Submit Complaint
  const handleSubmitNewComplaint = async (e: any) => {
    if (ComplaintValidation()) {
      setIsLoading(true)
      const formData = new FormData()

      formData.append('order_id', String(complaintForm.order_id))
      formData.append('pic_name', complaintForm.pic_name)
      formData.append('description', complaintForm.description)
      formData.append('complaint_status', complaintForm.complaint_status)
      formData.append('complaint_channel', String(complaintForm.complaint_channel))
      formData.append('complaint_date', today)
      formData.append('type', complaintForm.complaint_type.toString())

      if (complaintEvidence?.length) {
        complaintEvidence.forEach((item) => {
          if (item) {
            formData.append(`complaint_evidences`, item, item?.name)
          }
        })
      }

      await axios
        .post(`${apiUrl}/complaints`, formData, {
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
              text: 'Success Add Complaint',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              clear(e)
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
        })
        .catch((error) => {
          Swal.fire({
            title: 'Error',
            text: error.response.data.message,
            icon: 'error',
          })

          setIsLoading(false)
        })
    }
  }

  const handleCancelComplaint = () => {
    navigate('/complaint/view-complaint')
  }

  return (
    <section id='new-complaint'>
      <Card>
        <Card.Body>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko :
                  <span className='fs-4 ms-2 fw-normal'>{orderDetail?.store.store_name || ''}</span>
                </Form.Label>
                <br></br>
                <Form.Label className='fs-4 fw-bold'>
                  Complaint ID :<span className='fs-4 ms-2 fw-normal'> {complaintCode} </span>
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
                      value={selectedOrderId}
                      onChange={(newValue) => setSelectedOrderId(newValue)}
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
                    {orderDetail?.work_orders?.work_order_status.length > 0
                      ? orderDetail?.work_orders?.work_order_status[0]?.status?.description
                      : orderDetail?.status?.description}
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
                        Nomor Whatsapp :
                      </Form.Label>
                      <Col sm='7'>
                        <p className='fs-7'>
                          {!orderDetail?.project_number.startsWith('0')
                            ? `+62${orderDetail ? orderDetail?.members?.whatsapp_number : ''}`
                            : '-'}
                        </p>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='5'>
                        Nomor Telepon :
                      </Form.Label>
                      <Col sm='7'>
                        <p className='fs-7'>
                          {orderDetail?.project_number.startsWith('0')
                            ? orderDetail?.members?.phone_number
                            : '-'}
                        </p>
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
                  <Form.Label column>
                    {orderDetail?.payment_type === 'survey'
                      ? 'Tanggal request survey :'
                      : 'Tanggal request pemasangan :'}
                  </Form.Label>
                  <Col>
                    <p className='fs-7 p-0'>
                      {orderDetail
                        ? new Date(orderDetail?.request_survey).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : '-'}
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
                          return `-`
                        }
                      })()}
                    </p>
                  </Col>
                </Form.Group>
              </Row>
            </div>

            {(() => {
              if (
                (orderDetail?.payment_type === 'survey' && orderDetail?.work_orders === null) ||
                (orderDetail?.work_orders?.work_order_status.length === 1 &&
                  orderDetail?.payment_type === 'survey')
              ) {
                return (
                  <div className='table-warranty-content'>
                    {orderDetail?.is_overdistance === 1 && (
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
                        {orderDetail?.order_details?.map((item: any, index: any) => (
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
                    </table>
                  </div>
                )
              } else if (
                ['SURVEYREQ', 'SURVEYSTART', 'SURVEYDONE'].includes(
                  orderDetail?.work_orders?.work_order_status[0]?.status?.category
                ) &&
                orderDetail?.payment_type === 'survey' &&
                orderDetail?.work_orders?.work_order_status.length >= 1 &&
                orderDetail?.quotation?.length === 0
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
                        {orderDetail?.work_orders?.work_order_status[0]?.work_order_items
                          ?.length ? (
                          orderDetail?.work_orders?.work_order_status[0]?.work_order_items?.map(
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
                orderDetail?.work_orders?.work_order_status?.length >= 1 &&
                orderDetail?.quotation?.length >= 1 &&
                orderDetail?.payment_type === 'survey'
              ) {
                return (
                  <div className='table-warranty-content'>
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
                            Final Price
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {orderDetail?.quotation[0]?.quotation_details
                          ?.filter((x: any) => x.item_type === 2)
                          ?.map((item: any, index: any) => (
                            <tr key={`${index}-quotation`}>
                              <td>
                                {item?.name ?? '-'}{' '}
                                {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                              </td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>{item?.unit}</td>
                              <td>{`Rp. ${parseInt(item?.final_price ?? 0).toLocaleString(
                                'id'
                              )}`}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

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
                            Final Price
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {orderDetail?.quotation[0]?.quotation_details
                          ?.filter((x: any) => x.item_type === 1)
                          ?.map((item: any, index: any) => (
                            <tr key={`${index}-quotation`}>
                              <td>
                                {item?.name ?? '-'}{' '}
                                {item?.is_customer === true ? '( Disediakan oleh customer )' : ''}
                              </td>
                              <td>{item?.quantity ?? 0}</td>
                              <td>{item?.unit ?? '-'}</td>
                              <td>{`Rp. ${parseInt(item?.final_price ?? 0).toLocaleString(
                                'id'
                              )}`}</td>
                            </tr>
                          ))}

                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            Total Jasa
                          </td>
                          <td className='fw-bolder'>{`Rp. ${parseInt(
                            orderDetail?.quotation[0]?.quotation_details
                              .filter((x: any) => x.item_type === 2)
                              .reduce(
                                (total: any, item: any) => total + parseInt(item.final_price || 0),
                                0
                              )
                          ).toLocaleString('id')}`}</td>
                        </tr>

                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            Total Material
                          </td>
                          <td className='fw-bolder'>{`Rp. ${parseInt(
                            orderDetail?.quotation[0]?.quotation_details
                              ?.filter((x: any) => x.item_type === 1)
                              ?.reduce(
                                (total: any, item: any) => total + parseInt(item.final_price || 0),
                                0
                              )
                          ).toLocaleString('id')}`}</td>
                        </tr>

                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            Promosi
                          </td>
                          <td className=' fw-bolder'>
                            {`Rp. ${parseInt(
                              orderDetail?.quotation[0]?.quotation_disc ?? 0
                            ).toLocaleString('id')}`}
                          </td>
                        </tr>

                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            {`${
                              orderDetail?.quotation[0]?.promotion
                                ? `Additional Promotion (${orderDetail?.quotation[0]?.promotion?.name})`
                                : `Additional Promotion`
                            }`}
                          </td>

                          <td className=' fw-bolder'>
                            {orderDetail?.quotation[0]?.promotion?.promotion_type === 1
                              ? `${orderDetail?.quotation[0]?.promotion?.promotion} %`
                              : `Rp. ${parseInt(
                                  orderDetail?.quotation[0]?.promotion?.promotion ?? 0
                                ).toLocaleString('id')}`}
                          </td>
                        </tr>

                        <tr>
                          <td colSpan={3} className='text-end fw-bolder'>
                            Grand Total
                          </td>
                          <td className=' fw-bolder'>
                            {`Rp. ${parseInt(
                              orderDetail?.quotation[0]?.quotation_grand_total ?? 0
                            ).toLocaleString('id')}`}
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
                          *orderDetail ini lebih dari{' '}
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
                          {!(orderDetail?.payment_type === 'gratis') && (
                            <>
                              <th>Harga Jasa</th>
                              <th>Jumlah</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetail?.order_details?.map((item: any, index: any) => (
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
                              <td
                                colSpan={orderDetail?.payment_type !== 'gratis' ? 5 : 3}
                                className='text-end fw-bolder align-middle'
                              >
                                Biaya Tambahan
                              </td>

                              <td className=' fw-bolder'>{`Rp. ${Number(
                                orderDetail?.additional_fee
                              ).toLocaleString('id')}`}</td>
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

                          <td className=' fw-bolder'>{`Rp. ${Number(
                            orderDetail?.grand_total
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

          <Row className='mb-5'>
            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Group className='mb-3'>
                <Form.Label>Nama PIC :</Form.Label>
                <Form.Control
                  name='pic_name'
                  type='text'
                  placeholder='Isi Nama PIC'
                  value={complaintForm?.pic_name ?? ''}
                  onChange={(e) => complaintFormHandler(e)}
                />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>Tanggal Komplain :</Form.Label>
                <Form.Control
                  name='complaint_date'
                  type='date'
                  value={today}
                  readOnly
                  onChange={(e) => complaintFormHandler(e)}
                />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>Komplain melalui : </Form.Label>

                <Select
                  name='complaint_channel_id'
                  className='form-control p-0'
                  classNamePrefix='select'
                  placeholder='Complaint Via'
                  isSearchable={true}
                  options={complaintChannel}
                  value={selectedComplaintChannel}
                  onChange={(newValue) => setSelectedComplaintChannel(newValue)}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Label>Alasan :</Form.Label>
              <Form.Control
                as='textarea'
                name='description'
                style={{minHeight: '250px'}}
                value={complaintForm?.description ?? ''}
                onChange={(e) => complaintFormHandler(e)}
              ></Form.Control>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Group>
                <Form.Label>UPLOAD BUKTI COMPLAINT</Form.Label>
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
                  {complaintEvidence.length ? (
                    complaintEvidence.map((item, index) => (
                      <ListGroup>
                        <ListGroup.Item
                          key={`${item?.name}-${index}-${item?.type}`}
                          className='d-flex justify-content-between align-items-center'
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
                            src={URL.createObjectURL(item)}
                            preview={{
                              visible,
                              src: URL.createObjectURL(item),
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

          <div className='d-flex justify-content-center align-items-center mt-5'>
            <Button
              variant='dark-danger'
              className='d-flex justify-content-center align-items-center'
              type='submit'
              disabled={isLoading}
              onClick={handleCancelComplaint}
            >
              Cancel
            </Button>

            <Button
              variant='dark-primary'
              className='d-flex justify-content-center align-items-center'
              type='submit'
              disabled={isLoading}
              onClick={handleSubmitNewComplaint}
            >
              {isLoading ? 'Submitting..' : 'Submit'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {NewComplaintForm}
