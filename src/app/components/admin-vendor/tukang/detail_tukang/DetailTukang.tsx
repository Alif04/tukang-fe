import React, {FC, useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'

import './DetailTukang.css'

import axios from 'axios'
import {Table, Rate} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, Row, Col, Tabs, Tab} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleUser, faUser} from '@fortawesome/free-solid-svg-icons'

interface DataTypeOrder {
  number: number
  order_id: number
  store_name: string
  receipt_number: string
  date_order: string
  total: string
  status: string
}

interface DataTypeComplaint {
  number: number
  complaint_id: number
  complaint_date: string
}

const DetailTukangVendor: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [tukangId, setTukangId] = useState<any>('')
  const [orderData, setOrderData] = useState<any[]>([])
  const [orderList, setOrderList] = useState<any[]>([])
  const [order, setOrder] = useState<any[]>([])
  const [complaintData, setComplaintData] = useState<DataTypeComplaint[]>([])
  const [tukangDetail, setTukangDetail] = useState<any>()

  // Tukang Evidence
  const [imageKTP, setimageKTP] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  const [imageNPWP, setimageNPWP] = useState<{
    blob: string
    fileName: string
  }>({
    blob: '',
    fileName: '',
  })

  const fetchTukangDetail = async () => {
    try {
      await axios
        .get(`${apiUrl}/tukang/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          setTukangDetail(data)
          setTukangId(response.data.data.data.id)

          if (data?.tukang_document) {
            const documentTypes = ['npwp_file', 'ktp_file', 'compro_file', 'surat_permohonan_file']

            type DocumentStateSetter = (state: {blob: string; fileName: string}) => void

            const documentStateSetters: Record<string, DocumentStateSetter> = {
              npwp_file: setimageNPWP,
              ktp_file: setimageKTP,
            }

            data.tukang_document.forEach((document: any) => {
              const {document_name, path} = document

              if (documentTypes.includes(document_name)) {
                const setter = documentStateSetters[document_name]

                if (setter) {
                  setter({
                    blob: '',
                    fileName: path,
                  })
                }
              }
            })
          }
        })
    } catch (error) {
      console.log(error)
    }
  }

  const fetchOrderList = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/orders?order_by=desc&take=0&tukang_id=${tukangId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )

      const data = response.data.data

      setOrderData(data)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewOrder = async () => {
    try {
      const apiData = await fetchOrderList()

      if (!apiData) {
        console.error('No data received from fetchOrderList')
        return []
      }

      const orderData = apiData.map((item: any, index: number) => {
        let data

        const orderDate = new Date(item?.request_survey)

        data = {
          number: index + 1,
          order_id: item.id,
          date_order: formatDate(orderDate),
          store_name: item?.store?.store_name ?? '-',
          costumer_name: item?.members?.full_name ?? '-',
          receipt_number: item?.receipt_number ?? '',
          total: `Rp. ${parseInt(item.grand_total).toLocaleString('id')}`,
          status: item?.status?.category,
        }

        return data
      })

      return orderData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ViewOrder()
        setOrderList(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [tukangId])

  useEffect(() => {
    fetchTukangDetail()
  }, [])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const phoneNumber =
    tukangDetail?.phone_number !== null ? tukangDetail?.phone_number : tukangDetail?.whatsapp_number

  const columnsOrder: ColumnsType<DataTypeOrder> = [
    {
      title: 'Nomor Urut',
      dataIndex: 'number',
      key: 'number',
      align: 'center',
      width: 10,
    },
    {
      title: 'Nama Toko',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Tanggal Pengerjaan',
      dataIndex: 'date_order',
      key: 'date_order',
      width: 150,
    },
    {
      title: 'Grand Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ]

  const columnsComplaint: ColumnsType<DataTypeComplaint> = [
    {
      title: 'No',
      dataIndex: 'number',
      key: 'number',
      align: 'center',
      width: 10,
    },
    {
      title: 'Complaint ID',
      dataIndex: 'complaint_id',
      key: 'complaint_id',
      align: 'center',
      width: 250,
    },
    {
      title: 'Tanggal',
      dataIndex: 'complaint_date',
      key: 'complaint_date',
    },
  ]

  return (
    <section id='detail-tukang'>
      <Row className='row-1'>
        <Col xxl={3} xl={3} lg={3} md={3} sm={12}>
          <FontAwesomeIcon icon={faCircleUser} style={{fontSize: '150px'}} />
        </Col>

        <Col xxl={9} xl={9} lg={9} md={9} sm={12}>
          <div className='tukang-profile'>
            <h1 className='fs-1 mb-3'>{tukangDetail?.full_name}</h1>
            <p className='fs-3 mb-1'>TUKANG</p>
            <p className='fs-4 mb-1'>{tukangDetail?.vendor?.company_name}</p>
            <p className='fs-4 text-muted mb-1'>Rating</p>

            <Rate disabled defaultValue={tukangDetail?.rating} />
          </div>
        </Col>
      </Row>

      <Row className='row-2 mb-3'>
        <Col xxl={3} xl={3} lg={12} md={12} sm={12} className='mb-5'>
          <div className='basic-info'>
            <hr />

            <div className='d-flex'>
              <p>Info </p>
            </div>

            <div className='data'>
              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Address :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control plaintext readOnly as='textarea' value={tukangDetail?.address} />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  No. Telp :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control plaintext readOnly value={phoneNumber} />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Email :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control plaintext readOnly value={tukangDetail?.email} />
                </Col>
              </Form.Group>
            </div>
          </div>
        </Col>

        <Col xxl={9} xl={9} lg={12} md={12} sm={12} className='mb-5'>
          <div className='tab mb-3'>
            <div className='tab-title'>
              <div className='title'>
                <FontAwesomeIcon icon={faUser} size='2xl' />
                <p>About</p>
              </div>
            </div>

            <div className='data-diri'>
              <Row>
                <Col>
                  <Form.Group as={Row}>
                    <Form.Label column md='7'>
                      Tanggal Lahir :
                    </Form.Label>

                    <Col md='5'>
                      <Form.Control
                        plaintext
                        readOnly
                        type='text'
                        value={tukangDetail ? formatDate(new Date(tukangDetail?.bod)) : ''}
                      />
                    </Col>
                  </Form.Group>

                  {/* <Form.Group as={Row}>
                    <Form.Label column sm='4'>
                      Kontak Emergency :
                    </Form.Label>

                    <Col sm='8'>
                      <Form.Control plaintext readOnly defaultValue='Sapardi' />
                    </Col>
                  </Form.Group> */}

                  <Form.Group as={Row}>
                    <Form.Label column md='7'>
                      Nomor Telepon :
                    </Form.Label>

                    <Col md='5'>
                      <Form.Control plaintext readOnly value={tukangDetail?.phone_number ?? ''} />
                    </Col>
                  </Form.Group>

                  {/* <Form.Group as={Row}>
                    <Form.Label column sm='4'>
                      Hubungan :
                    </Form.Label>

                    <Col sm='8'>
                      <Form.Control plaintext readOnly defaultValue='Ayah' />
                    </Col>
                  </Form.Group> */}
                </Col>

                <Col md={5}>
                  <Form.Group as={Row}>
                    <Form.Label column sm='6'>
                      Nomor KTP :
                    </Form.Label>

                    <Col sm='6'>
                      <Form.Control
                        plaintext
                        readOnly
                        type='text'
                        value={tukangDetail?.ktp_number}
                      />
                    </Col>
                  </Form.Group>

                  {/* <Form.Group as={Row}>
                    <Form.Label column sm='6'>
                      Total Value Pekerjaan :
                    </Form.Label>

                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Rp. 1.000.000' />
                    </Col>
                  </Form.Group> */}

                  <Form.Group as={Row}>
                    <Form.Label column sm='6'>
                      Complain :
                    </Form.Label>

                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='0' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Form.Label column sm='6'>
                      Refund :
                    </Form.Label>

                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='0' />
                    </Col>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group as={Row}>
                    <Form.Label column sm='6'>
                      Total Pekerjaan :
                    </Form.Label>

                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='0' />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>

          <div className='tab mb-3'>
            <div className='tab-title'>
              <div className='title'>
                <FontAwesomeIcon icon={faUser} size='2xl' />
                <p>Dokumen Pendukung</p>
              </div>
            </div>

            <div className='data-diri'>
              <Row>
                <Col>
                  <Form.Group controlId='formFile'>
                    <Form.Label>Foto KTP</Form.Label>
                    <Form className='form-input-image'>
                      <Form.Control
                        type='file'
                        accept='image/*'
                        className='input-field-image'
                        hidden
                      />

                      {imageKTP?.fileName ? (
                        <img
                          src={`${apiUrl}/public/tukang/${imageKTP.fileName}`}
                          alt={imageKTP.fileName}
                          className='image-preview'
                        />
                      ) : (
                        <></>
                      )}
                    </Form>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group controlId='formFile'>
                    <Form.Label>Foto NPWP</Form.Label>
                    <Form className='form-input-image'>
                      <Form.Control
                        type='file'
                        accept='image/*'
                        className='input-field-image'
                        hidden
                      />

                      {imageNPWP?.fileName ? (
                        <img
                          src={`${apiUrl}/public/tukang/${imageNPWP.fileName}`}
                          alt={imageNPWP.fileName}
                          className='image-preview'
                        />
                      ) : (
                        <></>
                      )}
                    </Form>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      <Row className='row-3'>
        <Col xxl={3} xl={3} lg={12} md={12} sm={12}></Col>

        <Col xxl={9} xl={9} lg={12} md={12} sm={12}>
          <hr />

          <Tabs fill defaultActiveKey={1} className='navtab-detail-costumer'>
            <Tab eventKey={1} title='Historical Pemesanan' className='tab-1'>
              <Table
                className='table-striped-rows mt-3'
                bordered
                columns={columnsOrder}
                dataSource={order}
                rowKey={(record) => record.order_id}
                pagination={{position: ['bottomRight']}}
              />
            </Tab>

            <Tab eventKey={2} title='Historical Pengaduan' className='tab-2'>
              <Table
                className='table-striped-rows mt-3'
                bordered
                columns={columnsComplaint}
                dataSource={complaintData}
                rowKey={(record) => record.complaint_id}
                pagination={{position: ['bottomRight']}}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </section>
  )
}

export {DetailTukangVendor}
