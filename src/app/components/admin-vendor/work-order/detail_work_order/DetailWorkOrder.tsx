import React, {FC, useState, useEffect, SetStateAction} from 'react'
import {Orders} from '../../../../interfaces/order'
import {WorkOrder} from '../../../../interfaces/work-order'

import './DetailWorkOrder.css'

import axios from 'axios'
import Select from 'react-select'
import dayjs from 'dayjs'
import {useParams} from 'react-router-dom'
import {Form, Row, Col, Table} from 'react-bootstrap'
import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

const DetailWorkVendor: FC<{updatePageTitle: (order: Orders) => void}> = ({updatePageTitle}) => {
  const apiUrl = process.env.REACT_APP_API_URL
  const params = useParams()

  const [orderDetail, setOrderDetail] = useState<any>()

  const [workOrder, setWorkOrder] = useState<WorkOrder>({
    id: null,
    order_id: null,
    vendor_id: null,
    tukang_id: [],
    request_work_time: '',
    survey_date: '',
    work_order_status: null,
    complaint_status: null,
    work_start_date: '',
    work_end_date: '',
  })

  const fetchOrderData = async () => {
    try {
      await axios
        .get(`${apiUrl}/orders/${params.id}`, {
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
          updatePageTitle(data)

          if (data?.work_orders?.work_order_tukang) {
            const tukang = data.work_orders.work_order_tukang.map((item: any) => ({
              id: item.id,
              tukang_id: item.tukang_id,
              tukang_name: item.tukang.full_name,
            }))

            workOrderHandler(tukang, 'tukang_id')
          }

          if (data?.work_orders) {
            setWorkOrder((prev) => ({
              ...prev,
              work_start_date: data?.work_orders.work_start_date,
              work_end_date: data?.work_orders.work_end_date,
            }))
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchOrderData()
  }, [])

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  const workOrderHandler = (
    value: number | string | Array<number | string | null> | any | null,
    target: string,
    setStateAction: SetStateAction<typeof setWorkOrder> = setWorkOrder
  ) => {
    setWorkOrder((prev) => {
      const cache = {...prev, [target]: value}
      return cache
    })
  }

  return (
    <section id='detail-work-order'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko :{' '}
                  <span className='fs-4 ms-2 fw-normal'>{orderDetail?.store.store_name}</span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Col>
                  <Form.Label className='fs-4 fw-bold'>
                    Order ID : <span className='fs-4 ms-2 fw-normal'>{orderDetail?.id}</span>
                  </Form.Label>
                </Col>

                <Col>
                  <Form.Label className='fs-4 fw-bold'>
                    Work Order ID :{' '}
                    <span className='fs-4 ms-2 fw-normal'>
                      {orderDetail?.work_orders?.id ?? '-'}
                    </span>
                  </Form.Label>
                </Col>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Col>
                  <Form.Label className='fs-4 fw-bold'>
                    Receipt Number :
                    <span className='fs-4 ms-2 fw-normal'>{orderDetail?.receipt_number}</span>
                  </Form.Label>
                </Col>

                <Col>
                  <Form.Label className='fs-4 fw-bold'>
                    Order Status :
                    <span className='fs-4 ms-2 fw-bold text-success'>
                      {orderDetail?.status?.category}
                    </span>
                  </Form.Label>
                </Col>
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
                <div className='survey mb-3'>
                  <div className='fs-3 fw-bold'>Survey</div>

                  <Row>
                    <Col md={6}>
                      <Form.Group className='detail-info'>
                        <Form.Label>Tanggal Survey :</Form.Label>

                        <Form.Control
                          type='date'
                          readOnly
                          value={formatDate(new Date(orderDetail?.work_orders?.survey_date ?? '-'))}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className='detail-info'>
                        <Form.Label>Nama Lengkap Tehnisi :</Form.Label>
                        <Select
                          classNamePrefix='select'
                          closeMenuOnSelect={false}
                          isClearable={false}
                          isMulti
                          menuIsOpen={false}
                          getOptionLabel={(option) => `${option.tukang_name}`}
                          getOptionValue={(option) => `${option.tukang_id}`}
                          value={workOrder.tukang_id}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <div className='work-date'>
                  <div className='fs-3 fw-bold'>Tanggal Pengerjaan</div>

                  <Row>
                    <Col md={6}>
                      <Form.Group className='detail-info'>
                        <Form.Label>Tanggal mulai pengerjaan :</Form.Label>

                        <RangePicker
                          className='date-range w-100'
                          format='YYYY-MM-DD'
                          value={[
                            dayjs(workOrder.work_start_date, 'YYYY-MM-DD'),
                            dayjs(workOrder.work_end_date, 'YYYY-MM-DD'),
                          ]}
                          disabled={[true, true]}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}></Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>

          <Row className='table-warranty d-flex align-items-center mb-5'>
            <div className='table-title-warranty'>
              <div className='fs-3 fw-bold'>Informasi Pemasangan</div>
            </div>

            <div className='table-warranty-content'>
              <Table hover responsive='md'>
                <thead className='table-warranty-head'>
                  <tr>
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Nama Pemasangan</th>
                    <th>QTY Pemasangan</th>
                    <th>Harga Jasa</th>
                    <th>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {orderDetail?.order_details.map((item: any, index: any) => (
                    <>
                      <tr>
                        <td>{item?.item_code}</td>
                        <td>{item?.item_name}</td>
                        <td>{item?.item?.service_name}</td>
                        <td>{item?.quantity}</td>
                        <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString('id')}`}</td>
                        <td>{`Rp. ${parseInt(item?.total).toLocaleString('id')}`}</td>
                      </tr>
                    </>
                  ))} */}

                  {orderDetail?.work_orders?.work_order_status[0]?.work_order_items.map(
                    (item: any, index: any) => (
                      <>
                        <tr>
                          <td>{item?.item_id || '-'}</td>
                          <td>{item?.item || '-'}</td>
                          <td>{item?.name}</td>
                          <td>{item?.quantity}</td>
                          <td>{`Rp. ${parseInt(item?.unit_price || 0)?.toLocaleString('id')}`}</td>
                          <td>{`Rp. ${parseInt(item?.total || 0).toLocaleString('id')}`}</td>
                        </tr>
                      </>
                    )
                  )}

                  <tr>
                    <td colSpan={5} className='text-end fw-bolder'>
                      Grand Total
                    </td>
                    <td className=' fw-bolder'>
                      {`Rp. ${parseInt(orderDetail?.grand_total || 0).toLocaleString('id')}`}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Row>
        </div>
      </div>
    </section>
  )
}

export {DetailWorkVendor}
