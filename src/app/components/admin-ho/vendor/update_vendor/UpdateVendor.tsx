import React, {FC} from 'react'
import {useState} from 'react'

import './UpdateVendor.css'

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
} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

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

const AddVendorButton = () => {
  const navigate = useNavigate()

  const handleAddVendor = () => {
    navigate('/order/new-order')
  }

  return (
    <button className='button-add-order' onClick={handleAddVendor}>
      New Vendor <FontAwesomeIcon icon={faPlus} size='lg' className='plus-icon' />
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

const UpdateVendorHO: FC = () => {
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
    <section id='update-vendor'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='vendor-information'>
              <div className='form-header'>
                <Form.Label className='fw-bold'>Serving Area</Form.Label>

                <Form.Select className='form-select-area'>
                  <option value='1' selected>
                    DKI Jakarta
                  </option>
                  <option value='2'>Jabodetabek</option>
                  <option value='3'>Jawa Barat</option>
                  <option value='4'>Jawa Tengah</option>
                </Form.Select>

                <Form.Select className='form-select-area'>
                  <option value='1' selected>
                    DKI Jakarta
                  </option>
                  <option value='2'>Jabodetabek</option>
                  <option value='3'>Jawa Barat</option>
                  <option value='4'>Jawa Tengah</option>
                </Form.Select>

                <Form.Select className='form-select-area'>
                  <option value='1' selected>
                    All
                  </option>
                  <option value='2'>Mitra 10 BSD</option>
                  <option value='3'>Mitra 10 Fatmawati</option>
                  <option value='4'>Mitra 10 Kemanggisan</option>
                </Form.Select>
              </div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Row>
                    <Col>
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control type='number' />
                    </Col>

                    <Col>
                      <Form.Label>Fax Number</Form.Label>
                      <Form.Control type='number' />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Row>
                    <Col>
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control type='email' />
                    </Col>

                    <Col>
                      <Form.Label>NPWP</Form.Label>
                      <Form.Control type='number' />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control as='textarea' className='field-alamat' placeholder='Jl. Pahlawan' />
                </Form.Group>
              </div>
            </div>

            <div className='bank-information'>
              <div className='form-header'></div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Account Holder Name</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Bank Account</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <div className='d-flex justify-content-between'>
                    <Form.Label>Default Markup</Form.Label>

                    <div className='form-check-request'>
                      <Form.Check inline label='Rp' name='group1' type='radio' />
                      <Form.Check inline label='%' name='group1' type='radio' />
                    </div>
                  </div>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Discount</Form.Label>
                  <Form.Control type='number' />
                </Form.Group>
              </div>
            </div>

            <div className='service-information'>
              <div className='form-header'>
                <Form.Label className='fw-bold'>Vendor ID</Form.Label>
                <Form.Control type='text' />
              </div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <div className='d-flex justify-content-between'>
                    <Form.Label>Add PIC</Form.Label>

                    <Form.Label>Add KTP</Form.Label>
                  </div>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Service Type</Form.Label>

                  <Form.Select aria-label='Default select example'>
                    <option value='1'>ALL</option>
                    <option value='2'>ELECTRICAL</option>
                    <option value='3'>MECHANICAL</option>
                  </Form.Select>
                </Form.Group>

                <div className='mb-5'>
                  <Form.Check className='mb-3' label='NPWP' />
                  <Form.Check className='mb-3' label='PKS' />
                  <Form.Check className='mb-3' label='SIUP' />
                </div>

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
              </div>
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

            <div className='right'>
              <AddVendorButton />
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

export {UpdateVendorHO}
