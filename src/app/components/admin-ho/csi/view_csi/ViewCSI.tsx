/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'

import './ViewCSI.css'

import axios from 'axios'
import {Table, DatePicker, Tag} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faTrash, faFilter, faSearch, faPlus} from '@fortawesome/free-solid-svg-icons'

const {RangePicker} = DatePicker

type Props = {
  className: string
}

const ViewCSIHO: React.FC<Props> = ({className}) => {
  const navigate = useNavigate()

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const handleChangeSearchFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSearchFilter = event.target.value
    setSearchFilter(updatedSearchFilter)
  }

  interface DataType {
    key: string
    order_id: string
    store_name: string
    date_order: string
    costumer_id: string
    costumer_name: string
    phone_number: string
    service_name: string
    order_status: string
  }

  const EditButton = () => {
    const navigate = useNavigate()

    const handleEdit = () => {
      navigate('/order/update-order')
    }

    return (
      <a className='button-edit' onClick={handleEdit}>
        <FontAwesomeIcon icon={faPen} size='sm' />
      </a>
    )
  }

  const DeleteButton = () => (
    <a className='button-delete'>
      <FontAwesomeIcon icon={faTrash} size='sm' />
    </a>
  )

  const columns: ColumnsType<DataType> = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      className: 'col_order_id',
    },
    {
      title: 'Nama Store',
      dataIndex: 'store_name',
      key: 'store_name',
      align: 'center',
    },
    {
      title: 'Date Order',
      dataIndex: 'date_order',
      key: 'date_order',
      align: 'center',
    },
    {
      title: 'No Member',
      dataIndex: 'costumer_id',
      key: 'costumer_id',
      align: 'center',
    },
    {
      title: 'Nama Costumer',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
    },
    {
      title: 'WA/No Handphone',
      dataIndex: 'phone_number',
      key: 'phone_number',
      align: 'center',
    },
    {
      title: 'Nama Jasa Pemasangan',
      dataIndex: 'service_name',
      key: 'service_name',
      align: 'center',
    },
    {
      title: 'Order Status',
      dataIndex: 'order_status',
      key: 'order_status',
      align: 'left',
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <div className='button-wrapper'>
          <EditButton />
          <DeleteButton />
        </div>
      ),
      fixed: 'right',
      width: 50,
    },
  ]

  const data: DataType[] = [
    {
      key: '1',
      order_id: '78453993',
      store_name: 'mitra10_depok',
      date_order: '13/2/2023',
      costumer_id: '8986748',
      costumer_name: 'Abdulah',
      phone_number: '+62857128314',
      service_name: 'Pemasangan AC',
      order_status: 'INVOICED',
    },
    {
      key: '2',
      order_id: '78453993',
      store_name: 'mitra10_depok',
      date_order: '13/2/2023',
      costumer_id: '8986748',
      costumer_name: 'Abdulah',
      phone_number: '+62857128314',
      service_name: 'Pemasangan AC',
      order_status: 'INVOICED',
    },
    {
      key: '3',
      order_id: '78453993',
      store_name: 'mitra10_depok',
      date_order: '13/2/2023',
      costumer_id: '8986748',
      costumer_name: 'Abdulah',
      phone_number: '+62857128314',
      service_name: 'Pemasangan AC',
      order_status: 'INVOICED',
    },
    {
      key: '4',
      order_id: '78453993',
      store_name: 'mitra10_depok',
      date_order: '13/2/2023',
      costumer_id: '8986748',
      costumer_name: 'Abdulah',
      phone_number: '+62857128314',
      service_name: 'Pemasangan AC',
      order_status: 'INVOICED',
    },
    {
      key: '5',
      order_id: '78453993',
      store_name: 'mitra10_depok',
      date_order: '13/2/2023',
      costumer_id: '8986748',
      costumer_name: 'Abdulah',
      phone_number: '+62857128314',
      service_name: 'Pemasangan AC',
      order_status: 'INVOICED',
    },
    {
      key: '6',
      order_id: '78453993',
      store_name: 'mitra10_depok',
      date_order: '13/2/2023',
      costumer_id: '8986748',
      costumer_name: 'Abdulah',
      phone_number: '+62857128314',
      service_name: 'Pemasangan AC',
      order_status: 'INVOICED',
    },
    {
      key: '7',
      order_id: '78453993',
      store_name: 'mitra10_depok',
      date_order: '13/2/2023',
      costumer_id: '8986748',
      costumer_name: 'Abdulah',
      phone_number: '+62857128314',
      service_name: 'Pemasangan AC',
      order_status: 'INVOICED',
    },
  ]

  return (
    <section id='view-csi'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
              <div className='d-flex align-items-center me-3'>
                <FontAwesomeIcon icon={faFilter} size='2xl' className='me-2' />
                <h3 className='fs-3 fw-normal'>Date : </h3>
              </div>

              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range ms-3'
                onChange={(values) => {
                  if (values && values.length === 2) {
                    const dateFromFormatted = values[0]?.format('YYYY-MM-DD')
                    const dateToFormatted = values[1]?.format('YYYY-MM-DD')

                    setDateFrom(dateFromFormatted)
                    setDateTo(dateToFormatted)
                  } else {
                    setDateFrom('')
                    setDateTo('')
                  }
                }}
              />
            </Col>

            <Col xs={12} md={12} lg={12} xl={8} xxl={8}>
              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control
                    placeholder='Search'
                    className='filter-ltr'
                    onChange={handleChangeSearchFilter}
                  />
                </InputGroup>
              </div>
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.key}
            pagination={{position: ['bottomCenter']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewCSIHO}
