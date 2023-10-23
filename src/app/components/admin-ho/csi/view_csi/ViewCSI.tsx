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
    date_order: string
    product_name: string
    costumer_id: string
    costumer_name: string
    email_address: string
    vendor_name: string
    installer_name: string
    order_status: string
    complaint_status: string
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
      width: 100,
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
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      align: 'left',
      width: 120,
    },
    {
      title: 'Customer ID',
      dataIndex: 'costumer_id',
      key: 'costumer_id',
      align: 'center',
      width: 120,
    },
    {
      title: 'Customer Name',
      dataIndex: 'costumer_name',
      key: 'costumer_name',
      align: 'left',
      width: 120,
    },
    {
      title: 'Email Address',
      dataIndex: 'email_address',
      key: 'email_address',
      align: 'center',
      width: 135,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendor_name',
      key: 'vendor_name',
      align: 'left',
      width: 135,
    },
    {
      title: 'Installer Name',
      dataIndex: 'installer_name',
      key: 'installer_name',
      align: 'left',
      width: 130,
    },
    {
      title: 'Order Status',
      dataIndex: 'order_status',
      key: 'order_status',
      align: 'left',
      width: 140,
    },
    {
      title: 'Complaint Status',
      dataIndex: 'complaint_status',
      key: 'complaint_status',
      align: 'left',
      width: 140,
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
      width: 70,
    },
  ]

  const data: DataType[] = [
    {
      key: '1',
      order_id: '78453992',
      date_order: '10/2/2023',
      product_name: 'Water Heater',
      costumer_id: '8986747',
      costumer_name: 'Alia',
      email_address: 'alia@gmail.com',
      vendor_name: 'PT.ABC',
      installer_name: 'Patric',
      order_status: 'INVOICED',
      complaint_status: '',
    },
    {
      key: '2',
      order_id: '78453993',
      date_order: '13/2/2023',
      product_name: 'AC',
      costumer_id: '8986748',
      costumer_name: 'Abdulah',
      email_address: 'abdullah@gmail.com',
      vendor_name: 'PT.ABC',
      installer_name: 'Jonas',
      order_status: 'INVOICED',
      complaint_status: '',
    },
    {
      key: '3',
      order_id: '78453994',
      date_order: '14/2/2023',
      product_name: 'Water Heater',
      costumer_id: '8986710',
      costumer_name: 'Alice',
      email_address: 'alice@gmail.com',
      vendor_name: 'PT.ABC',
      installer_name: 'Patric',
      order_status: 'INVOICED',
      complaint_status: '',
    },
    {
      key: '4',
      order_id: '78453995',
      date_order: '15/2/2023',
      product_name: 'AC',
      costumer_id: '8986123',
      costumer_name: 'Kobe',
      email_address: 'kobe@gmail.com',
      vendor_name: 'PT.ABC',
      installer_name: 'Jonas',
      order_status: 'INVOICED',
      complaint_status: '',
    },
    {
      key: '5',
      order_id: '78453996',
      date_order: '10/3/2023',
      product_name: 'AC',
      costumer_id: '8986123',
      costumer_name: 'Kobe',
      email_address: 'kobe@gmail.com',
      vendor_name: 'PT.ABC',
      installer_name: 'Jonas',
      order_status: 'DONE',
      complaint_status: '',
    },
    {
      key: '6',
      order_id: '78453997',
      date_order: '12/3/2023',
      product_name: 'AC',
      costumer_id: '8986123',
      costumer_name: 'Kobe',
      email_address: 'kobe@gmail.com',
      vendor_name: 'PT.ABC',
      installer_name: 'Jonas',
      order_status: 'DONE',
      complaint_status: '',
    },
    {
      key: '7',
      order_id: '78453998',
      date_order: '15/2/2023',
      product_name: 'AC',
      costumer_id: '8986123',
      costumer_name: 'Kobe',
      email_address: 'kobe@gmail.com',
      vendor_name: 'PT.ABC',
      installer_name: 'Jonas',
      order_status: 'DONE',
      complaint_status: '',
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
                    placeholder='Filter'
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
            scroll={{x: 1700}}
            pagination={{position: ['bottomCenter']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewCSIHO}
