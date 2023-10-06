/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'

import ListOrderData from '../../../../data/order/viewOrder'

import './ViewOrder.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {DatePicker} from 'antd'
import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate, useParams} from 'react-router-dom'
import {Row, Col, Form, InputGroup, Modal, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faFileImage,
  faTrash,
  faSearch,
  faFilter,
  faImage,
  faPen,
} from '@fortawesome/free-solid-svg-icons'

type Props = {
  className: string
}

const ViewOrderStore: React.FC<Props> = ({className}) => {
  const navigate = useNavigate()
  const apiUrl = process.env.REACT_APP_API_URL

  const {RangePicker} = DatePicker

  const DateRange = () => {
    return <RangePicker className='date-range ms-3' />
  }

  interface DataType {
    order_id: number
    assign_from: string
    date_order: string
    no_member: number
    costumer_name: string
    phone_number: number
    installer_name: string
    // payment_status: string
    order_status: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      width: 90,
      className: 'col_order_id',
    },
    {
      title: 'Assign From',
      dataIndex: 'assign_from',
      key: 'assign_from',
      align: 'center',
      width: 150,
      className: 'col_order_id',
    },
    {
      title: 'Date Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
      width: 110,
    },
    {
      title: 'No Member',
      dataIndex: 'no_member',
      key: 'no_member',
      align: 'center',
      width: 90,
    },
    {
      title: 'Costumer Name',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 140,
    },
    {
      title: 'No Telp / WA',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'left',
      width: 140,
    },
    {
      title: 'Nama Jasa Pemasangan',
      dataIndex: 'installer_name',
      key: 'installer_name',
      align: 'left',
      width: 180,
    },
    // {
    //   title: 'Status Pembayaran',
    //   dataIndex: 'payment_status',
    //   key: 'payment_status',
    //   align: 'left',
    //   width: 150,
    // },
    {
      title: 'Status Order',
      dataIndex: 'order_status',
      key: 'order_status',
      align: 'left',
      width: 140,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => {
        const handleDetailId = () => {
          const id = record.order_id
          navigate(`/order/detail-order/${id}`)
        }

        const handleUpdateId = () => {
          const id = record.order_id
          navigate(`/order/update-order/${id}`)
        }

        const handleDelete = () => {
          const id = record.order_id

          Swal.fire({
            title: 'Are you sure delete this order?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete Order',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
          })
            .then((willDelete) => {
              if (willDelete) {
                axios
                  .delete(`${apiUrl}/orders/${id}`, {
                    headers: {
                      Accept: 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                      'Access-Control-Allow-Origin': '*',
                      'ngrok-skip-browser-warning': 'true',
                    },
                  })
                  .then((res) => {
                    Swal.fire({
                      title: 'Success',
                      text: res.data.message,
                      icon: 'success',
                    })
                    window.location.reload()
                  })
                  .catch((error) => {
                    Swal.fire({
                      title: 'Error',
                      text: error.response.data.message,
                      icon: 'error',
                    })
                  })
              }
            })
            .catch((error) => {
              Swal.fire({
                title: 'Error',
                text: error.response.data.message,
                icon: 'error',
              })
            })
        }

        return (
          <div className='button-wrapper'>
            <a className='button-detail' onClick={handleDetailId}>
              <FontAwesomeIcon icon={faBook} size='sm' />
            </a>

            <a className='button-edit' onClick={handleUpdateId}>
              <FontAwesomeIcon icon={faPen} size='sm' />
            </a>

            <a className='button-delete' onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} size='sm' />
            </a>
          </div>
        )
      },
      fixed: 'right',
      width: 80,
    },
  ]

  const [orderData, setOrderData] = useState<DataType[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await ListOrderData()
      setOrderData(data)
    }

    fetchData()
  }, [])

  return (
    <section id='view-order'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
              <div className='d-flex align-items-center me-3'>
                <FontAwesomeIcon icon={faFilter} size='2xl' className='me-2' />
                <h3 className='fs-3 fw-normal'>Date : </h3>
              </div>

              <DateRange />
            </Col>

            <Col xs={12} md={12} lg={12} xl={8} xxl={8}>
              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control placeholder='Filter' className='filter-ltr' />
                </InputGroup>
              </div>
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={orderData}
            rowKey={(record) => record.order_id}
            scroll={{x: 1500}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewOrderStore}
