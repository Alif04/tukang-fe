import React, {FC} from 'react'
import {useState} from 'react'

import './UpdateOrder.css'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, Button, InputGroup} from 'react-bootstrap'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faTrash, faSearch, faPlus} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

interface DataType {
  key: string
  order_id: string
  date_order: string
  item_name: string
  installation_type: string
  payment_status: string
  costumer_id: string
  costumer_name: string
  phone_number: string
  vendor_name: string
  installer_name: string
  order_status: string
}

const AddOrderButton = () => {
  const navigate = useNavigate()

  const handleAddOrder = () => {
    navigate('/order/new-order')
  }

  return (
    <button className='button-add-order' onClick={handleAddOrder}>
      Add Order <FontAwesomeIcon icon={faPlus} size='lg' className='plus-icon' />
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
    title: 'Item Name',
    dataIndex: 'item_name',
    key: 'item_name',
    align: 'left',
    width: 120,
  },
  {
    title: 'Installation Type',
    dataIndex: 'installation_type',
    key: 'installation_type',
    align: 'left',
    width: 140,
  },
  {
    title: 'Payment Status',
    dataIndex: 'payment_status',
    key: 'payment_status',
    align: 'left',
    width: 150,
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
    width: 140,
  },
  {
    title: 'Phone Number',
    dataIndex: 'phone_number',
    key: 'phone_number',
    align: 'center',
    width: 150,
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vendor_name',
    key: 'vendor_name',
    align: 'center',
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
    width: 115,
  },
]

const data: DataType[] = [
  {
    key: '1',
    order_id: '78453992',
    date_order: '10/2/2023',
    item_name: 'Water Heater',
    installation_type: 'New set up',
    payment_status: 'PAID',
    costumer_id: '8986747',
    costumer_name: 'Alia',
    phone_number: '08158374638',
    vendor_name: 'PT.ABC',
    installer_name: 'Patric',
    order_status: 'DONE',
  },
  {
    key: '2',
    order_id: '78453993',
    date_order: '13/2/2023',
    item_name: 'AC',
    installation_type: 'New set up',
    payment_status: 'PAID',
    costumer_id: '8986748',
    costumer_name: 'Abdulah',
    phone_number: '08158376565',
    vendor_name: 'PT.ABC',
    installer_name: 'Jonas',
    order_status: 'DONE',
  },
  {
    key: '3',
    order_id: '78453994',
    date_order: '14/2/2023',
    item_name: 'Water Heater',
    installation_type: 'New set up',
    payment_status: 'PAID',
    costumer_id: '8986710',
    costumer_name: 'Alice',
    phone_number: '08158300987',
    vendor_name: 'PT.ABC',
    installer_name: 'Patric',
    order_status: 'ON PROGRESS',
  },
  {
    key: '4',
    order_id: '78453995',
    date_order: '15/2/2023',
    item_name: 'AC',
    installation_type: 'New set up',
    payment_status: 'PAID',
    costumer_id: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    vendor_name: 'PT.ABC',
    installer_name: 'Jonas',
    order_status: 'ON PROGRESS',
  },
  {
    key: '5',
    order_id: '78453996',
    date_order: '10/3/2023',
    item_name: 'AC',
    installation_type: 'New set up',
    payment_status: 'PAID',
    costumer_id: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    vendor_name: 'PT.ABC',
    installer_name: 'Jonas',
    order_status: 'ON PROGRESS',
  },
  {
    key: '6',
    order_id: '78453997',
    date_order: '12/3/2023',
    item_name: 'AC',
    installation_type: 'New set up',
    payment_status: 'PAID',
    costumer_id: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    vendor_name: 'PT.ABC',
    installer_name: 'Jonas',
    order_status: 'ON PROGRESS',
  },
  {
    key: '7',
    order_id: '78453998',
    date_order: '15/2/2023',
    item_name: 'AC',
    installation_type: 'New set up',
    payment_status: 'PAID',
    costumer_id: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    vendor_name: 'PT.ABC',
    installer_name: 'Jonas',
    order_status: 'ON PROGRESS',
  },
]

const UpdateOrderStore: FC = () => {
  return (
    <section id='update-order'>
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
          <div className='button-add text-end'>
            <button>Add</button>
          </div>

          <div className='table-picklist'>
            <table className='table table-hover'>
              <thead className='table-picklist-head'>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Group Item</th>
                  <th>Harga Jasa</th>
                  <th>Jumlah</th>
                  <th>Total</th>
                  <th>Sales Person</th>
                  <th>Division</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className='card'>
        <div className='card-body table-view-order'>
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
              <AddOrderButton />
            </div>
          </div>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.key}
            scroll={{x: 1500}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {UpdateOrderStore}
