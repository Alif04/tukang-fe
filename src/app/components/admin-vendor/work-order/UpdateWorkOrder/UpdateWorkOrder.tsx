import React, {FC} from 'react'
import {useState} from 'react'

import './UpdateWorkOrder.css'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, Button, InputGroup, FormControl} from 'react-bootstrap'

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

const UpdateWorkOrder: FC = () => {
  return (
    <section id='update-order'>
      <div className='card mb-5'>
        <div className='data-order d-flex'>
          <div className='info customer'>
            <div className='head'>
              <p>Nama Toko: <b>Mitra10 BSD</b></p>
            </div>
            <div className='content'>
              <b>Customer Information</b>
              <table>
                <tbody>
                    <tr>
                        <td>Customer Id</td>
                        <td className='right'>7765234</td>
                    </tr>
                    <tr>
                        <td>Customer Name</td>
                        <td className='right'>Admin</td>
                    </tr>
                    <tr>
                        <td>Phone/WA Number</td>
                        <td className='right'>085621727</td>
                    </tr>
                    <tr>
                        <td>Email Address</td>
                        <td className='right'>Admin@gmail.com</td>
                    </tr>
                    <tr>
                        <td>Address</td>
                        <td className='right'>Jln. Raya Bakti Egos</td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className='info order'>
            <div className='head d-flex'>
              <p className='input1'>Work Order Id: </p>
              <FormControl value='751624157-90' className='input2' readOnly />
            </div>
            <div className='content'>
              <b>Order Information</b>
              <table>
                <tbody>
                    <tr>
                        <td>Order Id</td>
                        <td className='right'>7765234</td>
                    </tr>
                    <tr>
                        <td>Nama Jasa Pemasangan</td>
                        <td className='right'>Pemasangan Shower</td>
                    </tr>
                    <tr>
                        <td>Item Name</td>
                        <td className='right'>Sony electronic</td>
                    </tr>
                    <tr>
                        <td>Tipe Pembayaran</td>
                        <td className='right'>Free</td>
                    </tr>
                    <tr>
                        <td>Harga Jasa</td>
                        <td className='right'>1.000.000</td>
                    </tr>
                    <tr>
                        <td>Quantity</td>
                        <td className='right'>2</td>
                    </tr>
                    <tr>
                        <td>Total Harga</td>
                        <td className='right'>2.000.000</td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className='info work'>
            <div className='head'>
              <p>Order Status: <b>Permintaan Survey</b></p>
            </div>
            <div className='content'>
              <b>Work Information</b>
              <table>
                <tbody>
                    <tr>
                        <td>Tanggal Request Survey</td>
                        <td className='right'>23/6/2023</td>
                    </tr>
                    <tr>
                        <td>Tanggal Survey</td>
                        <td className='right'>23/6/2023</td>
                    </tr>
                    <tr>
                        <td>Tanggal Pekerjaan</td>
                        <td className='right'>23/6/2023</td>
                    </tr>
                    <tr>
                        <td>Tanggal Reschedule</td>
                        <td className='right'>23/6/2023</td>
                    </tr>
                    <tr>
                        <td>Tanggal Mulai Kerja</td>
                        <td className='right'>23/6/2023</td>
                    </tr>
                    <tr>
                        <td>Tanggal Selesai</td>
                        <td className='right'>23/6/2023</td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <hr/>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='costumer-information'>
              <div className='form-header'>
                <Form.Label className='fw-bold'>
                  New Work Status
                </Form.Label>
              </div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Update Work Order</Form.Label>
                  <Form.Select placeholder='CUST001' />
                </Form.Group>
              </div>
            </div>

            <div className='costumer-information'>
              <div className='form-header'> </div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Tanggal Survey</Form.Label>
                  <Form.Control type='date' placeholder='CUST001' />
                </Form.Group>
              </div>
            </div>

            <div className='costumer-information'>
              <div className='form-header'></div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Tanggal Mulai Pengerjaan</Form.Label>
                  <Form.Control type='date' placeholder='CUST001' />
                </Form.Group>
              </div>
            </div>

            <div className='costumer-information'>
              <div className='form-header'></div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Tanggal Selesai Pengerjaan</Form.Label>
                  <Form.Control type='date' placeholder='0855 1234 5768' />
                </Form.Group>
              </div>
            </div>

            <div className='costumer-information'>
              <div className='form-header'></div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Nama Lengkap Tehnisi</Form.Label>
                  <Form.Select placeholder='CUST001' />
                </Form.Group>
              </div>
            </div>
          </div>
          <div className='button'>
            <div className='d-flex justify-content-center'>
              <Button variant='dark-danger' type='submit'>
                Cancel
              </Button>

              <Button variant='dark-primary' type='submit'>
                Save
              </Button>
            </div>
            <div className='button-right'>
              <Button variant='dark-primary' type='submit'>
                Print Work Order
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='card'>
        <div className='card-body table-view-order'>
          <div className='table-head-wrapper'>
            <div className='middle'>
              <div className='filter-search'>
                <InputGroup>
                  <Form.Control placeholder='Search Work Order' className='filter-rtl' />

                  <InputGroup.Text className='filter-rtl'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>
                </InputGroup>
              </div>
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

export {UpdateWorkOrder}
