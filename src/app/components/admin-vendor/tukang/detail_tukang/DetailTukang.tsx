import React, {FC, useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'

import './DetailTukang.css'

import axios from 'axios'
import {Table, Rate} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, Row, Col, Tabs, Tab} from 'react-bootstrap'

interface DataTypeOrder {
  number: number
  order_id: number
  store_name: string
  receipt_number: string
  date_order: string
  total_invoice: string
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

  const [orderData, setOrderData] = useState<DataTypeOrder[]>([])
  const [complaintData, setComplaintData] = useState<DataTypeComplaint[]>([])
  const [tukangDetail, setTukangDetail] = useState<any>()

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
          const data = response.data.data.data
          setTukangDetail(data)
        })
    } catch (error) {
      console.log(error)
    }
  }

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
      title: 'Nomor WO/Complain',
      dataIndex: 'receipt_number',
      key: 'receipt_number',
      align: 'center',
      width: 180,
    },
    {
      title: 'Tanggal Pengerjaan',
      dataIndex: 'date_order',
      key: 'date_order',
      width: 150,
    },
    {
      title: 'Total Value Pekerjaan',
      dataIndex: 'total_invoice',
      key: 'total_invoice',
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

  // const ViewOrder = async () => {
  //   try {
  //     const apiData = tukangDetail?.order

  //     const orderData = apiData.map((item: any) => {
  //       let data

  //       const orderDate = new Date(item?.request_survey ?? '-')

  //       data = {
  //         number: apiData.indexOf(item) + 1,
  //         order_id: item.id,
  //         store_name: item?.store?.store_name ?? '-',
  //         receipt_number: item?.receipt_number ?? '-',
  //         date_order: formatDate(orderDate),
  //         total_invoice: item?.total_invoice ?? '-',
  //         status: item?.status?.category ?? '-',
  //       }

  //       return data
  //     })

  //     return orderData
  //   } catch (error) {
  //     console.error('Error getting order list data:', error)
  //     return []
  //   }
  // }

  // const ViewComplaint = async () => {
  //   try {
  //     const apiData = tukangDetail?.order

  //     if (apiData) {
  //       let complaintNumber = 1

  //       const complaintDataArray = apiData.flatMap((orderItem: any) => {
  //         return orderItem.complaints.map((complaintItem: any) => {
  //           const complaintDate = new Date(complaintItem.complaint_date)

  //           const complaintData = {
  //             number: complaintNumber,
  //             complaint_id: complaintItem.id,
  //             complaint_date: formatDate(complaintDate),
  //           }

  //           complaintNumber++
  //           return complaintData
  //         })
  //       })

  //       return complaintDataArray
  //     } else {
  //       return []
  //     }
  //   } catch (error) {
  //     console.error('Error getting complaint data:', error)
  //     return []
  //   }
  // }

  // useEffect(() => {
  //   const fetchOrderData = async () => {
  //     const data = await ViewOrder()
  //     setOrderData(data)
  //   }

  //   const fetchComplaintData = async () => {
  //     const data = await ViewComplaint()
  //     setComplaintData(data)
  //   }

  //   fetchOrderData()
  //   fetchComplaintData()
  // }, [])

  return (
    // <section id='detail-tukang'>
    //   <Row>
    //     <div className='content-top d-flex'>
    //       <Col md={3}>
    //         <i className='bi bi-person-circle'></i>
    //       </Col>

    //       <Col md={9}>
    //         <div className='box'>
    //           <h1>{tukangDetail?.full_name}</h1>
    //           <p>TUKANG</p>
    //           <small>rating</small>
    //           <div className='star-rating'>
    //             <Rate className='mt-2' disabled defaultValue={tukangDetail?.rating} />
    //           </div>
    //         </div>
    //       </Col>
    //     </div>

    //     <div className='content-bottom'>
    //       <Col md={3}>
    //         <div className='box'>
    //           <div className='title'>
    //             <h4>Keahlian</h4>
    //           </div>
    //           <ul>
    //             <li>Pasar Genteng</li>
    //             <li>Pengecatan</li>
    //             <li>Pasang Keramik</li>
    //             <li>Pasang Fikstur</li>
    //           </ul>
    //         </div>
    //       </Col>

    //       <Col md={9}>
    //         <div className='tab'>
    //           <div className='tab-title'>
    //             <div className='title'>
    //               <i className='bi bi-person-fill'></i>
    //               <p>About</p>
    //             </div>
    //           </div>
    //           <div className='data-diri'>
    //             <div className='data'>
    //               <tr>
    //                 <td className='left'>Address : </td>
    //                 <td className='right'>{tukangDetail?.address}</td>
    //               </tr>
    //               <tr>
    //                 <td className='left'>Phone : </td>
    //                 <td className='right'>{tukangDetail?.phone_number}</td>
    //               </tr>
    //               <tr>
    //                 <td className='left'>Email : </td>
    //                 <td className='right'>{tukangDetail?.email}</td>
    //               </tr>
    //             </div>
    //           </div>

    //           <div className='basic-info'>
    //             <hr />
    //             <p>Basic Information</p>
    //             <div className='data'>
    //               <tr>
    //                 <td>Tanggal Lahir : </td>
    //                 <td className='right'>
    //                   {tukangDetail ? formatDate(new Date(tukangDetail?.join_date)) : ''}
    //                 </td>
    //               </tr>

    //               <tr>
    //                 <td>Nomor Telepon : </td>
    //                 <td className='right'>{tukangDetail?.phone_number}</td>
    //               </tr>
    //             </div>
    //           </div>
    //         </div>
    //       </Col>
    //     </div>
    //   </Row>
    // </section>

    <section id='detail-tukang'>
      <Row className='row-1'>
        <Col xxl={3} xl={3} lg={3} md={3} sm={12}>
          <i className='bi bi-person-circle'></i>
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
          <div className='tab'>
            <div className='tab-title'>
              <div className='title'>
                <i className='bi bi-person-fill'></i>
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
                        value={tukangDetail ? formatDate(new Date(tukangDetail?.bod)) : ''}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Form.Label column sm='6'>
                      Total Value Pekerjaan :
                    </Form.Label>

                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Rp. 1.000.000' />
                    </Col>
                  </Form.Group>

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
                dataSource={orderData}
                rowKey={(record) => record.order_id}
                pagination={{position: ['bottomCenter']}}
              />
            </Tab>

            <Tab eventKey={2} title='Historical Pengaduan' className='tab-2'>
              <Table
                className='table-striped-rows mt-3'
                bordered
                columns={columnsComplaint}
                dataSource={complaintData}
                rowKey={(record) => record.complaint_id}
                pagination={{position: ['bottomCenter']}}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </section>
  )
}

export {DetailTukangVendor}
