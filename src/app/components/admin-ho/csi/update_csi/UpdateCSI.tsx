import React, {FC} from 'react'
import {useState} from 'react'

import './UpdateCSI.css'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, Button, InputGroup} from 'react-bootstrap'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFileExcel, faPen, faTrash, faSearch, faPlus} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

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

const AddButton = () => {
  const navigate = useNavigate()

  const handleAdd = () => {
    navigate('/order/detail-order')
  }

  return (
    <a className='button-add' onClick={handleAdd}>
      <FontAwesomeIcon icon={faPlus} size='sm' />
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
        <AddButton />
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

const UpdateCSIHO: FC = () => {
  return (
    <section id='update-csi'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='costumer-information'>
              <div className='form-header'>
                <Form.Label className='fw-bold'>
                  Nama Toko
                  <span className='fs-6 ms-2 pt-2 pb-2 fw-normal bg-secondary'>MITRA 10 - BSD</span>
                </Form.Label>

                <div className=''>
                  <Form.Check reverse type='switch' id='custom-switch' label='Payment Type :' />
                  <Form.Label className='fw-bold d-flex justify-content-end me-2'>Free</Form.Label>
                </div>
              </div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Customer ID</Form.Label>
                  <Form.Control type='text' placeholder='CUST001' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Nama Customer</Form.Label>
                  <Form.Control type='text' placeholder='John Doe' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Order ID</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>
              </div>

              <div className='btn-wrapper d-flex align-items-end'>
                <Button variant='light-dark' type='submit'>
                  Print Picklist
                </Button>
              </div>
            </div>

            <div className='costumer-information'>
              <div className='form-header'></div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>WA / Phone Number</Form.Label>
                  <Form.Control type='number' placeholder='0855 1234 5768' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Alamat Email</Form.Label>
                  <Form.Control type='email' placeholder='john.doe@gmail.com' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <div className='d-flex justify-content-between'>
                    <Form.Label>Tanggal Request</Form.Label>

                    <div className='form-check-request'>
                      <Form.Check inline label='Survey' name='group1' type='radio' />
                      <Form.Check inline label='Kerja Jasa' name='group1' type='radio' />
                    </div>
                  </div>
                  <Form.Control type='date' />
                </Form.Group>
              </div>

              <div className='d-flex justify-content-center'>
                <Button variant='dark-danger' type='submit'>
                  Cancel
                </Button>

                <Button variant='dark-primary' type='submit'>
                  Save
                </Button>
              </div>
            </div>

            <div className='costumer-information'>
              <div className='form-header'>
                <h1 className='fw-bold'>ORDER STATUS: </h1>
                <h1 className='fw-bold text-success'>PICKLIST</h1>
              </div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control as='textarea' className='field-alamat' placeholder='Jl. Pahlawan' />
                </Form.Group>
              </div>

              <div className='d-flex justify-content-center'>
                <Button variant='dark-success' type='submit'>
                  Email Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='card mb-5'>
        <div className='card-body'>
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
            rowKey={(record) => record.key}
            scroll={{x: 1700}}
            pagination={{position: ['bottomCenter']}}
          />
        </div>
      </div>
    </section>
  )
}

export {UpdateCSIHO}
