/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import './ViewPayment.css'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faPen,
  faTrash,
  faFileExcel,
  faSearch,
  faPlus,
  faUserPlus,
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
  costumer_name: string
  complaint: string
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
    width: 90,
  },
  {
    title: 'Date Order',
    dataIndex: 'date_order',
    key: 'date_order',
    align: 'center',
    width: 90,
  },
  {
    title: 'Quotation ID',
    dataIndex: 'quotation_id',
    key: 'quotation_id',
    align: 'left',
    width: 90,
  },
  {
    title: 'Costumer Name',
    dataIndex: 'costumer_name',
    key: 'costumer_name',
    align: 'left',
    width: 100,
  },
  {
    title: 'Complaint',
    dataIndex: 'complaint',
    key: 'complaint',
    align: 'center',
    width: 90,
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vendor_name',
    key: 'vendor_name',
    align: 'left',
    width: 130,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    align: 'left',
    width: 110,
  },
  {
    title: 'Payment Status',
    dataIndex: 'payment_status',
    key: 'payment_status',
    align: 'left',
    width: 110,
  },
  {
    title: 'Order Status',
    dataIndex: 'order_status',
    key: 'order_status',
    align: 'left',
    width: 110,
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
    order_id: '78453992',
    date_order: '10/2/2023',
    quotation_id: '898393',
    costumer_name: 'Ibu Alia',
    complaint: 'TIDAK',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'NONE',
    order_status: 'DONE',
  },
  {
    key: '2',
    order_id: '78453992',
    date_order: '10/2/2023',
    quotation_id: '898393',
    costumer_name: 'Ibu Alia',
    complaint: 'TIDAK',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'NONE',
    order_status: 'DONE',
  },
  {
    key: '3',
    order_id: '78453992',
    date_order: '10/2/2023',
    quotation_id: '898393',
    costumer_name: 'Ibu Alia',
    complaint: 'TIDAK',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'NONE',
    order_status: 'DONE',
  },
  {
    key: '4',
    order_id: '78453992',
    date_order: '10/2/2023',
    quotation_id: '898393',
    costumer_name: 'Ibu Alia',
    complaint: 'TIDAK',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'NONE',
    order_status: 'DONE',
  },
  {
    key: '5',
    order_id: '78453992',
    date_order: '10/2/2023',
    quotation_id: '898393',
    costumer_name: 'Ibu Alia',
    complaint: 'TIDAK',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'NONE',
    order_status: 'DONE',
  },
  {
    key: '6',
    order_id: '78453992',
    date_order: '10/2/2023',
    quotation_id: '898393',
    costumer_name: 'Ibu Alia',
    complaint: 'TIDAK',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'NONE',
    order_status: 'DONE',
  },
  {
    key: '7',
    order_id: '78453992',
    date_order: '10/2/2023',
    quotation_id: '898393',
    costumer_name: 'Ibu Alia',
    complaint: 'TIDAK',
    vendor_name: 'PT.ABC',
    amount: '500.000',
    payment_status: 'NONE',
    order_status: 'DONE',
  },
]

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
}

const ViewPaymentHO: React.FC<Props> = ({className}) => {
  return (
    <section id='view-payment'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <div className='table-head-wrapper'>
            <div className='left'>
              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control placeholder='Filter' className='filter-ltr' />
                </InputGroup>
              </div>
            </div>

            <div className='right'>
              <div className='select-filter'>
                <select className='form-select filter filter-one'>
                  <option selected>All</option>
                  <option value='1'>One</option>
                  <option value='2'>Two</option>
                  <option value='3'>Three</option>
                </select>

                <select className='form-select filter filter-two'>
                  <option selected>All</option>
                  <option value='1'>One</option>
                  <option value='2'>Two</option>
                  <option value='3'>Three</option>
                </select>

                <select className='form-select filter filter-three'>
                  <option selected>All</option>
                  <option value='1'>One</option>
                  <option value='2'>Two</option>
                  <option value='3'>Three</option>
                </select>

                <select className='form-select filter filter-four'>
                  <option selected>All</option>
                  <option value='1'>One</option>
                  <option value='2'>Two</option>
                  <option value='3'>Three</option>
                </select>
              </div>

              <button className='button-export'>
                Export To Excel
                <FontAwesomeIcon icon={faFileExcel} size='lg' className='excel-icon' />
              </button>
            </div>
          </div>

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
            scroll={{x: 1800}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewPaymentHO}
