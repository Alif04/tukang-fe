import React, {useState, useEffect, FC} from 'react'

import './UpdateWorkOrder.css'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, Button, InputGroup, Row, Col} from 'react-bootstrap'

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
  faFileExcel,
} from '@fortawesome/free-solid-svg-icons'

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
  installer_name: string
  vendor_name: string
  order_status: string
}

const DetailButton = () => {
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate('/work-order/Detail-work_order')
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
    width: 100,
  },
  {
    title: 'Payment Status',
    dataIndex: 'payment_status',
    key: 'payment_status',
    align: 'left',
    width: 100,
  },
  {
    title: 'Customer ID',
    dataIndex: 'costumer_id',
    key: 'costumer_id',
    align: 'center',
    width: 100,
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
    title: 'Installer Name',
    dataIndex: 'installer_name',
    key: 'installer_name',
    align: 'left',
    width: 130,
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vendor_name',
    key: 'vendor_name',
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
    width: 90,
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
    installer_name: 'Patric',
    vendor_name: 'PT ABC',
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
    installer_name: 'Jonas',
    vendor_name: 'PT ABC',
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
    installer_name: 'Patric',
    vendor_name: 'PT ABC',
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
    installer_name: 'Jonas',
    vendor_name: 'PT ABC',
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
    installer_name: 'Jonas',
    vendor_name: 'PT ABC',
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
    installer_name: 'Jonas',
    vendor_name: 'PT ABC',
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
    installer_name: 'Jonas',
    vendor_name: 'PT ABC',
    order_status: 'ON PROGRESS',
  },
]

const UpdateWorkVendor: FC = () => {
  return (
    <section id='update-work-order'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-id'>
                  <h3>Nama Toko : MITRA 10 BSD</h3>
                </div>
              </div>

              <div className='costumer-information'>
                <div className='title mb-5'>
                  <h1>COSTUMER INFORMATION</h1>
                </div>

                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>Costumer ID : 77652739</p>
                  </div>

                  <div className='costumer-name  mb-3'>
                    <p className='me-5'>Costumer Name : Ryan Filbert</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Phone/WA : 876992300239</p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>Email Address : ryan.filbert@gmail.com</p>
                  </div>

                  <div className='alamat-pemasangan d-flex mb-3'>
                    <p className='me-5'>
                      Address : Jl. Kijang no.9, Jakarta TimurDKI Jakarta, Indonesia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <Form.Group as={Row} className='mb-3'>
                  <Form.Label column sm='4'>
                    Work order ID :
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control readOnly type='text' value='899359-2' />
                  </Col>
                </Form.Group>
              </div>

              <div className='product-information'>
                <div className='title  mb-5'>
                  <h1>PRODUCT INFORMATION</h1>
                </div>

                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>Order ID : 88965329</p>
                  </div>

                  <div className='costumer-name mb-3'>
                    <p className='me-5'>Nama Jasa Pemasangan : Peemasangan Water Heater</p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>Item Name : Electrolux Water Heaater</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Tipe Pembayaran : FREE</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Harga Jasa : 1.000.000</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Quantity : 1</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Total Harga : 1.000.000</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-status'>
                  <h3>
                    Order Status : <span>Permintaan Survey</span>
                  </h3>
                </div>
              </div>

              <div className='sales-information'>
                <div className='title mb-5'>
                  <h1>WORK INFORMATION</h1>
                </div>

                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>Tanggal Request Survey : 09/06/2023</p>
                  </div>

                  <div className='costumer-name mb-3'>
                    <p className='me-5'>Tanggal Survey : 10/06/2023</p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>Tanggal Pekerjaan : 19/06/2023</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Tanggal Reschedule</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Tanggal Mulai Keja : 19/06/2023</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Tanggal Selesai : 29/06/2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className='work-status'>
            <h1 className='title text-decoration-underline'>New Work Status</h1>

            <div className='d-flex justify-content-between'>
              <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                <Form.Label>Update Work Order</Form.Label>
                <Form.Select>
                  <option value='1' selected>
                    SURVEY START
                  </option>
                  <option value='2'>WORK START</option>
                  <option value='3'>WIP</option>
                  <option value='4'>WORK END</option>
                  <option value='5'>INVESTIGATE</option>
                  <option value='6'>REWORK</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                <Form.Label>Tanggal survey : </Form.Label>
                <Form.Control type='date' />
              </Form.Group>

              <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                <Form.Label>Tanggal mulai pengerjaan : </Form.Label>
                <Form.Control type='date' />
              </Form.Group>

              <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                <Form.Label>Tanggal selesai pengerjaan : </Form.Label>
                <Form.Control type='date' />
              </Form.Group>

              <Form.Group className='mt-5 mb-5' controlId='exampleForm.ControlInput1'>
                <Form.Label>Nama Lengkap Tehnisi : </Form.Label>
                <Form.Select>
                  <option value='1' selected>
                    Johan
                  </option>
                  <option value='2'>Sugiro</option>
                  <option value='3'>Aang</option>
                  <option value='4'>Paulus</option>
                </Form.Select>
              </Form.Group>
            </div>
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

            <div className='right'></div>
          </div>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.key}
            scroll={{x: 2000}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </section>
  )
}

export {UpdateWorkVendor}
