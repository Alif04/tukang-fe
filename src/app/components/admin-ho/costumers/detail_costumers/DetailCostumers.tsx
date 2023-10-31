import React, {FC, useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './DetailCostumers.css'

import axios from 'axios'
import {Table, Rate} from 'antd'
import {useParams} from 'react-router-dom'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, Tabs, Tab} from 'react-bootstrap'

const DetailCostumerHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [memberDetail, setMemberDetail] = useState<any>()

  const [orderData, setOrderData] = useState<DataTypeOrder[]>([])
  const [complaintData, setComplaintData] = useState<DataTypeComplaint[]>([])

  const fetchMemberDetail = async () => {
    try {
      await axios
        .get(`${apiUrl}/member/data/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data.member
          setMemberDetail(data)
        })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMemberDetail()
  }, [])

  const phoneNumber =
    memberDetail?.phone_number !== null ? memberDetail?.phone_number : memberDetail?.whatsapp_number

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  interface DataTypeOrder {
    key: string
    number: number
    order_id: number
    date_order: string
  }

  const columnsOrder: ColumnsType<DataTypeOrder> = [
    {
      title: 'No',
      dataIndex: 'number',
      key: 'number',
      align: 'center',
      width: 10,
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 250,
    },
    {
      title: 'Tanggal',
      dataIndex: 'date_order',
      key: 'date_order',
    },
  ]

  interface DataTypeComplaint {
    key: string
    number: number
    complaint_id: number
    complaint_date: string
  }

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

  const ViewOrder = async () => {
    try {
      const apiData = memberDetail?.order

      const orderData = apiData.map((item: any) => {
        let data

        const orderDate = new Date(item.created_at)

        data = {
          number: apiData.indexOf(item) + 1,
          order_id: item.id,
          date_order: formatDate(orderDate),
        }

        return data
      })

      return orderData
    } catch (error) {
      console.error('Error getting order list data:', error)
      return []
    }
  }

  const ViewComplaint = async () => {
    try {
      const apiData = memberDetail?.order

      if (apiData) {
        let complaintNumber = 1

        const complaintDataArray = apiData.flatMap((orderItem: any) => {
          return orderItem.complaints.map((complaintItem: any) => {
            const complaintDate = new Date(complaintItem.complaint_date)

            const complaintData = {
              number: complaintNumber,
              complaint_id: complaintItem.id,
              complaint_date: formatDate(complaintDate),
            }

            complaintNumber++
            return complaintData
          })
        })

        return complaintDataArray
      } else {
        return []
      }
    } catch (error) {
      console.error('Error getting complaint data:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchOrderData = async () => {
      const data = await ViewOrder()
      setOrderData(data)
    }

    const fetchComplaintData = async () => {
      const data = await ViewComplaint()
      setComplaintData(data)
    }

    fetchOrderData()
    fetchComplaintData()
  }, [memberDetail])

  return (
    <section id='detail-costumer'>
      <Row className='row-1'>
        <Col xxl={3} xl={3} lg={3} md={3} sm={12}>
          <i className='bi bi-person-circle'></i>
        </Col>

        <Col xxl={9} xl={9} lg={9} md={9} sm={12}>
          <div className='costumer-profile'>
            <h1 className='fs-1 mb-3'>{memberDetail?.full_name}</h1>
            <h3 className='fs-2 fst-3 mb-3 text-muted'>{memberDetail?.id}</h3>
            <p className='fs-4 mb-1'>Customer of : Mitra 10-BSD</p>
            <p className='fs-4 text-muted mb-1'>Rating</p>

            <Rate disabled defaultValue={memberDetail?.rating} />
          </div>
        </Col>
      </Row>

      <Row className='row-2 mb-3'>
        <Col xxl={3} xl={3} lg={12} md={12} sm={12} className='mb-5'>
          <div className='basic-info'>
            <hr />

            <div className='d-flex'>
              <i className='bi bi-person-fill'></i>
              <p>About </p>
            </div>

            <div className='data'>
              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Address :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control plaintext readOnly as='textarea' value={memberDetail?.address_1} />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Phone :
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
                  <Form.Control plaintext readOnly value={memberDetail?.email} />
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
              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Costumer Sejak :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control
                    plaintext
                    readOnly
                    type='text'
                    value={memberDetail ? formatDate(new Date(memberDetail?.join_date)) : ''}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Total Invoice :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control plaintext readOnly defaultValue='29' />
                </Col>
              </Form.Group>
            </div>
          </div>
        </Col>
      </Row>

      <Row className='row-3'>
        <Col xxl={3} xl={3} lg={12} md={12} sm={12}></Col>

        <Col xxl={9} xl={9} lg={12} md={12} sm={12}>
          <Tabs fill defaultActiveKey={1} className='navtab-detail-costumer'>
            <Tab eventKey={1} title='Historical Pemesanan' className='tab-1'>
              <Table
                className='mt-3'
                bordered
                columns={columnsOrder}
                dataSource={orderData}
                rowKey={(record) => record.order_id}
                pagination={{position: ['bottomCenter']}}
              />
            </Tab>

            <Tab eventKey={2} title='Historical Pengaduan' className='tab-2'>
              <Table
                className='mt-3'
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

export {DetailCostumerHO}
