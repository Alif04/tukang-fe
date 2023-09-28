/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import './ViewQuotation.css'

import {Table, DatePicker} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faTrash, faFilter, faSearch, faPlus} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

type Props = {
  className: string
}

interface DataType {
  key: React.Key
  order_id: string
  date_order: string
  product_name: string
  installation_type: string
  costumer_id: string
  costumer_name: string
  quotation_id: string
  vendor_name: string
  amount: string
  payment_status: string
  order_status: string
}

const {RangePicker} = DatePicker

const DateRange = () => {
  return <RangePicker className='date-range ms-3' />
}

const DetailButton = () => {
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate('/order/detail-order')
  }

  return (
    <a className='button-detail' onClick={handleDetail}>
      <FontAwesomeIcon icon={faBook} size='sm' />
    </a>
  )
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
    width: 110,
  },
  {
    title: 'Installation Type',
    dataIndex: 'installation_type',
    key: 'installation_type',
    align: 'left',
    width: 110,
  },
  {
    title: 'Costumer ID',
    dataIndex: 'costumer_id',
    key: 'costumer_id',
    align: 'center',
    width: 110,
  },
  {
    title: 'Costumer Name',
    dataIndex: 'costumer_name',
    key: 'costumer_name',
    align: 'left',
    width: 140,
  },
  {
    title: 'Quotation ID',
    dataIndex: 'quotation_id',
    key: 'quotation_id',
    align: 'center',
    width: 110,
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vendor_name',
    key: 'vendor_name',
    align: 'left',
    width: 140,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    align: 'left',
    width: 140,
  },
  {
    title: 'Payment Status',
    dataIndex: 'payment_status',
    key: 'payment_status',
    align: 'left',
    width: 140,
  },
  {
    title: 'Order Status',
    dataIndex: 'order_status',
    key: 'order_status',
    align: 'left',
    width: 140,
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <div className='button-wrapper'>
        <DetailButton />
        <EditButton />
        <DeleteButton />
      </div>
    ),
    fixed: 'right',
    width: 90,
  },
]

const data: DataType[] = [
  {
    key: '1',
    order_id: '78453992',
    date_order: '10/2/2023',
    product_name: 'Water Heater',
    installation_type: 'New set up',
    costumer_id: '8986747',
    costumer_name: 'Alia',
    quotation_id: '12877450',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'NONE',
    order_status: 'QUOTEIN',
  },
  {
    key: '2',
    order_id: '78453993',
    date_order: '10/2/2023',
    product_name: 'Water Heater',
    installation_type: 'New set up',
    costumer_id: '8986747',
    costumer_name: 'Alia',
    quotation_id: '12877450',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'NONE',
    order_status: 'QUOTEIN',
  },
  {
    key: '3',
    order_id: '78453994',
    date_order: '10/2/2023',
    product_name: 'Water Heater',
    installation_type: 'New set up',
    costumer_id: '8986747',
    costumer_name: 'Alia',
    quotation_id: '12877450',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'NONE',
    order_status: 'QUOTEIN',
  },
  {
    key: '4',
    order_id: '78453995',
    date_order: '10/2/2023',
    product_name: 'Water Heater',
    installation_type: 'New set up',
    costumer_id: '8986747',
    costumer_name: 'Alia',
    quotation_id: '12877450',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'NONE',
    order_status: 'QUOTEIN',
  },
  {
    key: '5',
    order_id: '78453996',
    date_order: '10/2/2023',
    product_name: 'Water Heater',
    installation_type: 'New set up',
    costumer_id: '8986747',
    costumer_name: 'Alia',
    quotation_id: '12877450',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'NONE',
    order_status: 'QUOTEIN',
  },
  {
    key: '6',
    order_id: '78453997',
    date_order: '10/2/2023',
    product_name: 'Water Heater',
    installation_type: 'New set up',
    costumer_id: '8986747',
    costumer_name: 'Alia',
    quotation_id: '12877450',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'NONE',
    order_status: 'QUOTEIN',
  },
  {
    key: '7',
    order_id: '78453998',
    date_order: '10/2/2023',
    product_name: 'Water Heater',
    installation_type: 'New set up',
    costumer_id: '8986747',
    costumer_name: 'Alia',
    quotation_id: '12877450',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'NONE',
    order_status: 'QUOTEIN',
  },
]

const ViewQuotationHO: React.FC<Props> = ({className}) => {
  return (
    <section id='view-quotation'>
      <div className={`card ${className}`}>
        <div className='card-body'>
          <Row className='table-head-wrapper'>
            <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
              <Form.Group as={Row}>
                <Form.Label className='fs-3' column sm='4'>
                  <FontAwesomeIcon icon={faFilter} size='sm' className='me-1' />
                  Date :
                </Form.Label>

                <Col sm='8'>
                  <DateRange />
                </Col>
              </Form.Group>
            </Col>

            <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control placeholder='Filter' className='filter-ltr' />
                </InputGroup>
              </div>
            </Col>

            <Col xxl={4} xl={4} lg={4} md={4} sm={12}>
              <div className='select-filter'>
                <select className='form-select filter filter-one'>
                  <option selected>All Store</option>
                  <option value='1'>Mitra 10 - BSD</option>
                  <option value='2'>Mitra 10 - Depok</option>
                  <option value='3'>Mitra 10 - Fatmawati</option>
                </select>

                <select className='form-select filter filter-two'>
                  <option selected>All Vendor</option>
                  <option value='1'>Vendor A</option>
                  <option value='2'>Vendor B</option>
                  <option value='3'>Vendor C</option>
                </select>

                <select className='form-select filter filter-four'>
                  <option selected>All Quotation Status</option>
                  <option value='1'>PENDING</option>
                  <option value='2'>PAID</option>
                </select>
              </div>
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.key}
            scroll={{x: 1800}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewQuotationHO}
