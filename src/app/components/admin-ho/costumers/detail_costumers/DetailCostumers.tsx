import React, {FC, useEffect, useState} from 'react'
import axiosInstance from '../../../../../_metronic/layout/core/axiosInterceptor'
import {useParams, Link} from 'react-router-dom'

import './DetailCostumers.css'

import axios from 'axios'
import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, Tabs, Tab} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleUser, faUser} from '@fortawesome/free-solid-svg-icons'

const DetailCostumerHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [memberDetail, setMemberDetail] = useState<any>()

  const [orderData, setOrderData] = useState<DataTypeOrder[]>([])
  const [complaintData, setComplaintData] = useState<DataTypeComplaint[]>([])

  const fetchMemberDetail = async () => {
    try {
      await axiosInstance
        .get(`${apiUrl}/member/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          setMemberDetail(data)
        })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMemberDetail()
  }, [])

  interface DataTypeOrder {
    number: number
    order_id: number
    store_name: string
    receipt_number: string
    date_order: string
    total_invoice: string
    status: string
  }

  const columnsOrder: ColumnsType<DataTypeOrder> = [
    {
      title: 'No. ',
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
      title: 'Nomor Receipt',
      dataIndex: 'receipt_number',
      key: 'receipt_number',
      align: 'center',
      width: 130,
    },
    {
      title: 'Tanggal Order',
      dataIndex: 'date_order',
      key: 'date_order',
      width: 150,
    },
    {
      title: 'Status Order',
      dataIndex: 'status',
      key: 'status',
    },
  ]

  interface DataTypeComplaint {
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
      title: 'Tanggal Pengaduan',
      dataIndex: 'complaint_date',
      key: 'complaint_date',
    },
  ]

  const ViewOrder = async () => {
    try {
      const apiData = memberDetail?.order

      const orderData = apiData.map((item: any) => {
        let data

        const orderDate = new Date(item?.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })

        data = {
          number: apiData.indexOf(item) + 1,
          order_id: item.id,
          store_name: item?.store?.store_name ?? '-',
          receipt_number: (
            <Link to={`/order/detail-order/${item.id}`}>{item?.receipt_number ?? '-'}</Link>
          ),
          date_order: orderDate,
          status: item?.status?.description ?? '-',
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
            const complaintDate = new Date(complaintItem?.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })

            const complaintData = {
              number: complaintNumber,
              complaint_id: complaintItem.id,
              complaint_date: complaintDate,
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
          <FontAwesomeIcon icon={faCircleUser} style={{fontSize: '150px'}} />
        </Col>

        <Col xxl={9} xl={9} lg={9} md={9} sm={12}>
          <div className='costumer-profile'>
            <h1 className='fs-1 mb-2'>{memberDetail?.full_name}</h1>
            <p className='fs-4 mb-2'>
              Customer of :{' '}
              <span className='fw-semibold'>{memberDetail?.join_location_store?.store_name}</span>
            </p>
            <p className='fs-4 mb-2'>
              Member Number : <span className='fw-semibold'>{memberDetail?.member_number}</span>
            </p>
          </div>
        </Col>
      </Row>

      <Row className='row-2 mb-3'>
        <Col xxl={3} xl={3} lg={12} md={12} sm={12} className='mb-5'>
          <div className='basic-info'>
            <hr />

            <div className='d-flex'>
              <i className='bi bi-person-fill'></i>
              <h1>About</h1>
            </div>

            <div className='data'>
              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  No. WA :
                </Form.Label>

                <Col sm='8'>
                  <p className='fs-6'>{memberDetail?.whatsapp_number}</p>
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  No. Telp :
                </Form.Label>

                <Col sm='8'>
                  <p className='fs-6'>{memberDetail?.phone_number}</p>
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Email :
                </Form.Label>

                <Col sm='8'>
                  <p className='fs-6'>{memberDetail?.email}</p>
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Address :
                </Form.Label>

                <Col sm='8'>
                  <p className='fs-6'>{memberDetail?.address_1}</p>
                </Col>
              </Form.Group>
            </div>
          </div>
        </Col>

        <Col xxl={9} xl={9} lg={12} md={12} sm={12} className='mb-5'>
          <div className='tab'>
            <div className='tab-title'>
              <div className='title'>
                <FontAwesomeIcon icon={faUser} size='2xl' />
                <p>About</p>
              </div>
            </div>

            <div className='data-diri'>
              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Costumer Sejak :
                </Form.Label>

                <Col sm='8'>
                  <p className='fs-6'>
                    {memberDetail
                      ? new Date(memberDetail?.join_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : ''}
                  </p>
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Total Order :
                </Form.Label>

                <Col sm='8'>
                  <p className='fs-6'>{memberDetail?.order.length ?? 0}</p>
                </Col>
              </Form.Group>
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

export {DetailCostumerHO}
