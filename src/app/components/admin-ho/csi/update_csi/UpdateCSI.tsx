import React, {FC} from 'react'
import {useState} from 'react'

import './UpdateCSI.css'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, Button, InputGroup, Row, Col} from 'react-bootstrap'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faFileExcel,
  faPen,
  faTrash,
  faSearch,
  faPlus,
  faFilter,
  faPrint,
} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

interface DataType {
  key: string
  order_id: string
  date_order: string
  product_name: string
  installation_type: string
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
    title: 'Installation Type',
    dataIndex: 'installation_type',
    key: 'installation_type',
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
    installation_type: 'New Set Up',
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
    installation_type: 'New Set Up',

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
    installation_type: 'New Set Up',

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
    installation_type: 'New Set Up',

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
    installation_type: 'New Set Up',

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
    installation_type: 'New Set Up',

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
    installation_type: 'New Set Up',

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
          <div className='header-information'>
            <div className='information-detail'>
              <Form.Group as={Row} controlId='formPlaintextPassword'>
                <Form.Label column sm='5'>
                  Nama Toko :
                </Form.Label>
                <Col sm='7'>
                  <Form.Select>
                    <option value='1' selected>
                      MITRA 10 BSD
                    </option>
                    <option value='2'>MITRA 10 BANDUNG</option>
                    <option value='3'>MITRA 10 CIREBON</option>
                    <option value='4'>MITRA 10 CIBINONG</option>
                  </Form.Select>
                </Col>
              </Form.Group>
            </div>

            <div className='information-detail'>
              <Form.Group as={Row}>
                <Form.Label column sm='5'>
                  Costumer ID :
                </Form.Label>
                <Col sm='7'>
                  <Form.Control type='text' />
                </Col>
              </Form.Group>
            </div>

            <div className='information-detail'>
              <Form.Group as={Row}>
                <Form.Label column sm='6'>
                  Nama Costumer :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control type='text' />
                </Col>
              </Form.Group>
            </div>

            <div className='information-detail'>
              <Form.Group as={Row} controlId='formPlaintextPassword'>
                <Form.Label column sm='6'>
                  Change Status :
                </Form.Label>
                <Col sm='6'>
                  <Form.Select>
                    <option value='1'>CISIN</option>
                    <option value='2'>CISOUT</option>
                  </Form.Select>
                </Col>
              </Form.Group>
            </div>
          </div>

          <div className='question'>
            <ul>
              <li className='list-question'>
                <div className='list-item d-flex justify-content-between'>
                  <h3>
                    Performance: Apakah tehnisi/tukang melakukan pekerjaan sesuai dengan spesifikasi
                    yang di haruskan?
                  </h3>

                  <div className='form-check-question'>
                    <Form.Check inline label='1' name='group1' type='radio' />
                    <Form.Check inline label='2' name='group1' type='radio' />
                    <Form.Check inline label='3' name='group1' type='radio' />
                    <Form.Check inline label='4' name='group1' type='radio' />
                    <Form.Check inline label='5' name='group1' type='radio' />
                  </div>
                </div>
              </li>

              <li className='list-question'>
                <div className='list-item d-flex justify-content-between'>
                  <h3>Delivery: Apakah pengiriman barang tepat waktu?</h3>

                  <div className='form-check-question'>
                    <Form.Check inline label='1' name='group1' type='radio' />
                    <Form.Check inline label='2' name='group1' type='radio' />
                    <Form.Check inline label='3' name='group1' type='radio' />
                    <Form.Check inline label='4' name='group1' type='radio' />
                    <Form.Check inline label='5' name='group1' type='radio' />
                  </div>
                </div>
              </li>

              <li className='list-question'>
                <div className='list-item d-flex justify-content-between'>
                  <h3>
                    Invoicing: Bagaimana harga final dibandingan dengan budget? apakah sesuai?
                  </h3>

                  <div className='form-check-question'>
                    <Form.Check inline label='1' name='group1' type='radio' />
                    <Form.Check inline label='2' name='group1' type='radio' />
                    <Form.Check inline label='3' name='group1' type='radio' />
                    <Form.Check inline label='4' name='group1' type='radio' />
                    <Form.Check inline label='5' name='group1' type='radio' />
                  </div>
                </div>
              </li>

              <li className='list-question'>
                <div className='list-item d-flex justify-content-between'>
                  <h3>Customer Service: Bagaimana tehnisi/tukang kami menjawab pertanyaan?</h3>

                  <div className='form-check-question'>
                    <Form.Check inline label='1' name='group1' type='radio' />
                    <Form.Check inline label='2' name='group1' type='radio' />
                    <Form.Check inline label='3' name='group1' type='radio' />
                    <Form.Check inline label='4' name='group1' type='radio' />
                    <Form.Check inline label='5' name='group1' type='radio' />
                  </div>
                </div>
              </li>

              <li className='list-question'>
                <div className='list-item d-flex justify-content-between'>
                  <h3>Knowledge: Seberapa dalamkan pengetahuan tehnisi/Tukang kami?</h3>

                  <div className='form-check-question'>
                    <Form.Check inline label='1' name='group1' type='radio' />
                    <Form.Check inline label='2' name='group1' type='radio' />
                    <Form.Check inline label='3' name='group1' type='radio' />
                    <Form.Check inline label='4' name='group1' type='radio' />
                    <Form.Check inline label='5' name='group1' type='radio' />
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className='notes'>
            <h3 className='mb-3'>Catatan Tambahan</h3>

            <Form.Group className='mb-5'>
              <Form.Control as='textarea' rows={3} />
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
      </div>

      <div className='card mb-5'>
        <div className='card-body'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='mb-2'>
              <Form.Group as={Row}>
                <Form.Label className='fs-3' column sm='4'>
                  <FontAwesomeIcon icon={faFilter} size='sm' className='me-1' />
                  Date :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control type='date' />
                </Col>
              </Form.Group>
            </Col>

            <Col xs={12} md={12} lg={12} xl={4} xxl={4}>
              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control placeholder='Filter' className='filter-ltr' />
                </InputGroup>
              </div>
            </Col>

            <Col xs={12} md={12} lg={12} xl={4} xxl={4}>
              <div className='d-flex justify-content-end'>
                <button className='button-export'>
                  Export To Excel
                  <FontAwesomeIcon icon={faFileExcel} size='lg' className='excel-icon' />
                </button>

                <button className='button-print'>
                  Print Data
                  <FontAwesomeIcon icon={faPrint} size='lg' className='print-icon' />
                </button>
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

export {UpdateCSIHO}
