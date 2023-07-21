/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import './ViewVendor.css'

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
  id: string
  date_join: string
  company_name: string
  phone_number: string
  email_address: string
  service_type: string
  serving_area: string
  total_amount_paid: string
  work_done: string
  complaint: string
  rating: string
}

const NewVendorButton = () => {
  const navigate = useNavigate()

  const handleNewVendor = () => {
    navigate('/order/new-order')
  }

  return (
    <button className='button-new-vendor' onClick={handleNewVendor}>
      New Vendor <FontAwesomeIcon icon={faPlus} size='lg' className='plus-icon' />
    </button>
  )
}

const AddButton = () => {
  const navigate = useNavigate()

  const handleAdd = () => {
    navigate('/order/detail-order')
  }

  return (
    <a className='button-add' onClick={handleAdd}>
      <FontAwesomeIcon icon={faUserPlus} size='sm' />
    </a>
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
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    width: 90,
    className: 'col_order_id',
  },
  {
    title: 'Date Join',
    dataIndex: 'date_join',
    key: 'date_join',
    align: 'center',
    width: 90,
  },
  {
    title: 'Company Name',
    dataIndex: 'company_name',
    key: 'company_name',
    align: 'left',
    width: 140,
  },
  {
    title: 'Phone Number',
    dataIndex: 'phone_number',
    key: 'phone_number',
    align: 'left',
    width: 110,
  },
  {
    title: 'Email Address',
    dataIndex: 'email_address',
    key: 'email_address',
    align: 'left',
    width: 110,
  },

  {
    title: 'Service Type',
    dataIndex: 'service_type',
    key: 'service_type',
    align: 'left',
    width: 160,
  },
  {
    title: 'Total Amount Paid',
    dataIndex: 'total_amount_paid',
    key: 'total_amount_paid',
    align: 'left',
    width: 140,
  },
  {
    title: 'Work Done ',
    dataIndex: 'work_done',
    key: 'work_done',
    align: 'left',
    width: 110,
  },
  {
    title: 'Complaint',
    dataIndex: 'complaint',
    key: 'complaint',
    align: 'center',
    width: 110,
  },
  {
    title: 'Rating',
    dataIndex: 'rating',
    key: 'rating',
    align: 'center',
    width: 110,
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <div className='button-wrapper'>
        <AddButton />
        <DetailButton />
        <EditButton />
        <DeleteButton />
      </div>
    ),
    fixed: 'right',
    width: 100,
  },
]

const data: DataType[] = [
  {
    key: '1',
    id: '78453992',
    date_join: '10/2/2023',
    company_name: 'PT.ABC',
    phone_number: '(021) 5445080',
    email_address: 'abc@gmail.com',
    service_type: 'Water Heater Installation, Service AC',
    serving_area: 'JABODETABEK',
    total_amount_paid: '58,000,000    ',
    work_done: '300',
    complaint: '1',
    rating: '5',
  },
  {
    key: '2',
    id: '78453993',
    date_join: '10/2/2023',
    company_name: 'PT.ABC',
    phone_number: '(021) 5445080',
    email_address: 'abc@gmail.com',
    service_type: 'Water Heater Installation, Service AC',
    serving_area: 'JABODETABEK',
    total_amount_paid: '58,000,000    ',
    work_done: '300',
    complaint: '1',
    rating: '5',
  },
  {
    key: '3',
    id: '78453994',
    date_join: '10/2/2023',
    company_name: 'PT.ABC',
    phone_number: '(021) 5445080',
    email_address: 'abc@gmail.com',
    service_type: 'Water Heater Installation, Service AC',
    serving_area: 'JABODETABEK',
    total_amount_paid: '58,000,000    ',
    work_done: '300',
    complaint: '1',
    rating: '5',
  },
  {
    key: '4',
    id: '78453995',
    date_join: '10/2/2023',
    company_name: 'PT.ABC',
    phone_number: '(021) 5445080',
    email_address: 'abc@gmail.com',
    service_type: 'Water Heater Installation, Service AC',
    serving_area: 'JABODETABEK',
    total_amount_paid: '58,000,000    ',
    work_done: '300',
    complaint: '1',
    rating: '5',
  },
  {
    key: '5',
    id: '78453996',
    date_join: '10/2/2023',
    company_name: 'PT.ABC',
    phone_number: '(021) 5445080',
    email_address: 'abc@gmail.com',
    service_type: 'Water Heater Installation, Service AC',
    serving_area: 'JABODETABEK',
    total_amount_paid: '58,000,000    ',
    work_done: '300',
    complaint: '1',
    rating: '5',
  },
  {
    key: '6',
    id: '78453997',
    date_join: '10/2/2023',
    company_name: 'PT.ABC',
    phone_number: '(021) 5445080',
    email_address: 'abc@gmail.com',
    service_type: 'Water Heater Installation, Service AC',
    serving_area: 'JABODETABEK',
    total_amount_paid: '58,000,000    ',
    work_done: '300',
    complaint: '1',
    rating: '5',
  },
  {
    key: '7',
    id: '78453998',
    date_join: '10/2/2023',
    company_name: 'PT.ABC',
    phone_number: '(021) 5445080',
    email_address: 'abc@gmail.com',
    service_type: 'Water Heater Installation, Service AC',
    serving_area: 'JABODETABEK',
    total_amount_paid: '58,000,000    ',
    work_done: '300',
    complaint: '1',
    rating: '5',
  },
]

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
}

const ViewVendorHO: React.FC<Props> = ({className}) => {
  return (
    <section id='view-refund'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <div className='table-head-wrapper'>
            <div className='left'>
              <NewVendorButton />
            </div>

            <div className='right'>
              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control placeholder='Filter' className='filter-ltr' />
                </InputGroup>
              </div>

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

export {ViewVendorHO}
