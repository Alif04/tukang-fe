import React, {FC} from 'react'
import {useState} from 'react'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, InputGroup, Button, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faPen,
  faTrash,
  faSearch,
  faPlus,
  faImage,
  faFileImage,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

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

const NewQuotation = () => {
  const navigate = useNavigate()

  const handleNewQuotation = () => {
    navigate('/order/new-order')
  }

  return (
    <button className='button-new-quotation' onClick={handleNewQuotation}>
      New Quotation <FontAwesomeIcon icon={faPlus} size='lg' className='plus-icon' />
    </button>
  )
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

const TableList2: FC = () => {
  return (
    <div className='table-view-order'>
      <div className='table-head-wrapper'>
        <div className='left'></div>

        <div className='middle'>
          <div className='filter-search'>
            <InputGroup>
              <Form.Control placeholder='Filter' className='filter-rtl' />

              <InputGroup.Text className='filter-rtl'>
                <FontAwesomeIcon icon={faSearch} size='sm' />
              </InputGroup.Text>
            </InputGroup>
          </div>
        </div>

        <div className='right'>
          <NewQuotation />
        </div>
      </div>

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
  )
}

export {TableList2}
