/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import './ViewInvoice.css'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faPen,
  faTrash,
  faFileExcel,
  faSearch,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

type Props = {
  className: string
}

interface DataType {
  key: React.Key
  order_id: string
  date_order: string
  quotation_id: string
  invoice_id: string
  invoice_date: string
  vendor_name: string
  amount: string
  payment_status: string
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
    title: 'Quotation ID',
    dataIndex: 'quotation_id',
    key: 'quotation_id',
    align: 'left',
    width: 110,
  },
  {
    title: 'Invoice ID',
    dataIndex: 'invoice_id',
    key: 'invoice_id',
    align: 'left',
    width: 110,
  },
  {
    title: 'Invoice Date',
    dataIndex: 'invoice_date',
    key: 'invoice_date',
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
    align: 'center',
    width: 110,
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
    quotation_id: '898393',
    invoice_id: '990088',
    invoice_date: '10/2/2023',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'PAID',
    order_status: 'DONE',
  },
  {
    key: '2',
    order_id: '78453993',
    date_order: '10/2/2023',
    quotation_id: '898393',
    invoice_id: '990088',
    invoice_date: '10/2/2023',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'PAID',
    order_status: 'DONE',
  },
  {
    key: '3',
    order_id: '78453994',
    date_order: '10/2/2023',
    quotation_id: '898393',
    invoice_id: '990088',
    invoice_date: '10/2/2023',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'PAID',
    order_status: 'DONE',
  },
  {
    key: '4',
    order_id: '78453995',
    date_order: '10/2/2023',
    quotation_id: '898393',
    invoice_id: '990088',
    invoice_date: '10/2/2023',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'PAID',
    order_status: 'DONE',
  },
  {
    key: '5',
    order_id: '78453996',
    date_order: '10/2/2023',
    quotation_id: '898393',
    invoice_id: '990088',
    invoice_date: '10/2/2023',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'PAID',
    order_status: 'DONE',
  },
  {
    key: '6',
    order_id: '78453997',
    date_order: '10/2/2023',
    quotation_id: '898393',
    invoice_id: '990088',
    invoice_date: '10/2/2023',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'PAID',
    order_status: 'DONE',
  },
  {
    key: '7',
    order_id: '78453998',
    date_order: '10/2/2023',
    quotation_id: '898393',
    invoice_id: '990088',
    invoice_date: '10/2/2023',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'PAID',
    order_status: 'DONE',
  },
]

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
}

const ViewInvoiceVendor: React.FC<Props> = ({className}) => {
  return (
    <section id='view-invoice'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <Row className='mb-5'>
            <Col xxl={4}></Col>

            <Col xxl={4}>
              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control placeholder='Filter' className='filter-ltr' />
                </InputGroup>
              </div>
            </Col>

            <Col xxl={4} className='d-flex justify-content-end'>
              <button className='button-export '>
                Export To Excel
                <FontAwesomeIcon icon={faFileExcel} size='lg' className='excel-icon' />
              </button>
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={data}
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            rowKey={(record) => record.key}
            scroll={{x: 1500}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewInvoiceVendor}
