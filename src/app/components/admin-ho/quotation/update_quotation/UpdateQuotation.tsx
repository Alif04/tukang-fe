import React, {FC} from 'react'
import {useState} from 'react'

import './UpdateQuotation.css'

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

const UpdateQuotationHO: FC = () => {
  const [fileName, setFileName] = useState<string>('No selected file')
  const [image, setImage] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      setFileName(files[0].name)
      setImage(URL.createObjectURL(files[0]))
    }
  }

  const handleImageClick = () => {
    const inputField = document.querySelector('.input-field-image') as HTMLInputElement
    inputField.click()
  }

  const handleRemoveFile = () => {
    setFileName('No selected file')
    setImage(null)
  }

  return (
    <section id='update-quotation'>
      <div className='card mb-5'>
        <div className='card-body'>
          <Row>
            <Col lg={8}>
              <Row className='mb-5'>
                <Col lg={4}>
                  <div className='quotation-information'>
                    <div className='form-header'></div>

                    <div className='form-body'>
                      <Form.Group className='mb-5'>
                        <Form.Label>Nama Toko</Form.Label>
                        <Form.Select>
                          <option selected value='1'>
                            MITRA 10 BSD
                          </option>
                          <option value='2'>MITRA 10 Fatmawati</option>
                          <option value='3'>MITRA 10 Bandung</option>
                          <option value='4'>MITRA 10 Jogja</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className='mb-5'>
                        <Form.Label>Costumer Name</Form.Label>
                        <Form.Control type='text' />
                      </Form.Group>
                    </div>
                  </div>
                </Col>

                <Col lg={4}>
                  <div className='quotation-information'>
                    <div className='form-header'></div>

                    <div className='form-body'>
                      <Form.Group className='mb-5'>
                        <Form.Label>Order ID</Form.Label>
                        <Form.Control />
                      </Form.Group>

                      <Form.Group className='mb-5'>
                        <Form.Label>Phone Number / WA Number</Form.Label>
                        <Form.Control type='number' />
                      </Form.Group>
                    </div>
                  </div>
                </Col>

                <Col lg={4}>
                  <div className='quotation-information'>
                    <div className='form-header'></div>

                    <div className='form-body'>
                      <Form.Group className='mb-5'>
                        <Form.Label>Costumer ID</Form.Label>
                        <Form.Control />
                      </Form.Group>

                      <Form.Group className='mb-5'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type='email' />
                      </Form.Group>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className='mt-5'>
                <div className='table-item'>
                  <table className='table table-hover'>
                    <thead className='table-item-head'>
                      <tr>
                        <th>Item</th>
                        <th>Harga Satuan</th>
                        <th>Jumlah</th>
                        <th>Total Harga</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Jasa Instalasi AC</td>
                        <td>1.800.000</td>
                        <td>1</td>
                        <td>1.800.000</td>
                      </tr>

                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Total
                        </td>
                        <td className=' fw-bolder'>1.800.000</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Discount (8%)
                        </td>
                        <td className=' fw-bolder'>-144.000</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Grand Total
                        </td>
                        <td className=' fw-bolder'>1.854.000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Row>

              <Row>
                <Col xxl={6}>
                  <Form.Group controlId='formFile' className='mb-5'>
                    <Form.Label>Upload Receipt</Form.Label>
                    <Form className='form-input-image' onClick={handleImageClick}>
                      <Form.Control
                        type='file'
                        accept='image/*'
                        className='input-field-image'
                        hidden
                        onChange={handleFileChange}
                      />

                      {image ? (
                        <img src={image} alt={fileName} className='image-preview' />
                      ) : (
                        <div className='input-image-text'>
                          <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                          <p>Add File</p>
                        </div>
                      )}
                    </Form>

                    <div className='uploaded-row'>
                      <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                      <span className='upload-content'>{fileName}</span>

                      <FontAwesomeIcon
                        icon={faTrash}
                        size='sm'
                        color='#ed2b2a'
                        style={{cursor: 'pointer'}}
                        onClick={handleRemoveFile}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col xxl={6}></Col>
              </Row>

              <div className='d-flex justify-content-center align-items-end'>
                <Button variant='dark-danger' type='submit'>
                  Cancel
                </Button>

                <Button variant='dark-primary' type='submit'>
                  Save
                </Button>
              </div>
            </Col>

            <Col lg={4}>
              <div className='bank-information'>
                <div className='form-header'>
                  <h1 className='fw-bold'>ORDER STATUS: </h1>
                  <h1 className='fw-bold text-success'>QUOTE OUT</h1>
                </div>

                <div className='form-body'>
                  <Form.Group as={Row} className='mb-5' controlId='formPlaintextEmail'>
                    <Form.Label column sm='4'>
                      Quotation ID :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control type='text' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5' controlId='formPlaintextEmail'>
                    <Form.Label column sm='4'>
                      Valid Until :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control type='text' />
                    </Col>
                  </Form.Group>

                  <Form.Group className='mb-5'>
                    <Form.Label>Address :</Form.Label>
                    <Form.Control
                      as='textarea'
                      className='field-alamat'
                      placeholder='Jl. Pahlawan'
                    />
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5' controlId='formPlaintextEmail'>
                    <Form.Label column sm='4'>
                      Bank Name :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control type='text' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5' controlId='formPlaintextEmail'>
                    <Form.Label column sm='4'>
                      Bank Account :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control type='text' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5' controlId='formPlaintextEmail'>
                    <Form.Label column sm='4'>
                      Account Name :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control type='text' />
                    </Col>
                  </Form.Group>
                </div>
              </div>

              <div className='d-flex justify-content-end'>
                <Button variant='dark-success' type='submit'>
                  Save & Email Quotation
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className='card'>
        <div className='card-body table-view-order'>
          <div className='table-head-wrapper mb-5'>
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
      </div>
    </section>
  )
}

export {UpdateQuotationHO}
