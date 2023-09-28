import React, {useState, FC} from 'react'

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
  faPrint,
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

const UpdateWorkTukang: FC = () => {
  const [isChecked, setIsChecked] = useState(false)
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

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <section id='update-work-order-tukang'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <div className='form-costumer'>
              <Row className='form-header'>
                <Form.Group as={Row} className='mb-5'>
                  <Form.Label column sm='2' className='fw-bold'>
                    Nama Toko :
                  </Form.Label>

                  <Col sm='10'>
                    <Form.Control plaintext readOnly defaultValue='Mitra 10 - BSD' />
                  </Col>
                </Form.Group>
              </Row>

              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group as={Row} className='form-sub-header'>
                    <Form.Label column sm='4'>
                      Order ID :
                    </Form.Label>

                    <Col sm='8'>
                      <Form.Control readOnly defaultValue='213312' />
                    </Col>
                  </Form.Group>

                  <div className='costumer-info'>
                    <div className='fs-4 fw-bold text-decoration-underline'>Costumer Info</div>

                    <div className='costumer-info-detail mb-3'>
                      <div className='fs-6 fw-bold mt-1 mb-1'>Ibu Widya Chandra</div>
                      <div className='fs-6 fw-normal  mt-1 mb-1'>0812 283-7362</div>
                      <div className='fs-6 fw-normal  mt-1 mb-1'>widya.c@gmail.com</div>
                      <div className='fs-6 fw-normal  mt-1 mb-1'>
                        Jalan. ketapang V/12, Jakarta Barat, Jakarta, Indonesia
                      </div>
                    </div>
                  </div>

                  <Form.Group controlId='formFile'>
                    <Form.Label>Upload Foto</Form.Label>
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

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group as={Row} className='form-sub-header'>
                    <Form.Label column sm='5'>
                      Work Order ID :
                    </Form.Label>

                    <Col sm='7'>
                      <Form.Control readOnly defaultValue='213312' />
                    </Col>
                  </Form.Group>

                  <div className='work-order-info'>
                    <div className='fs-4 fw-bold text-decoration-underline'>Work Order Info</div>

                    <div className='work-order-info-detail mb-3'>
                      <div className='fs-6 fw-normal  mt-1 mb-1'>
                        Pemasangan Electric water Heater 500L
                      </div>
                      <div className='fs-6 fw-normal  mt-1 mb-1'>Eletrolux Water Heater</div>
                    </div>

                    <Form.Group className='mb-5'>
                      <Form.Label className='fs-6 text-decoration-underline text-primary fw-bold h-100'>
                        Catatan Tambahan
                      </Form.Label>
                      <Form.Control as='textarea' />
                    </Form.Group>
                  </div>
                </Col>

                <div className='d-flex justify-content-end mt-2 mb-2'>
                  <Button variant='dark-danger' type='submit'>
                    Cancel
                  </Button>

                  <Button variant='dark-primary' type='submit'>
                    Save
                  </Button>
                </div>
              </Row>
            </div>

            <div className='form-work-order'>
              <div className='form-header'>
                <Form.Group as={Row} className=''>
                  <Form.Label column sm='6' className='fs-1 fw-bold'>
                    New Work Status :
                  </Form.Label>

                  <Col sm='6'>
                    <Form.Select>
                      <option selected value='1'>
                        SURVEYED
                      </option>
                      <option value='2'>WIP</option>
                      <option value='3'>WORKEND</option>
                      <option value='4'>INVESTIGATE</option>
                      <option value='5'>RIP</option>
                      <option value='6'>REWORKEND</option>
                      <option value='7'>RESCHEDULE</option>
                      <option value='8'>DONE</option>
                    </Form.Select>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-5'>
                  <Form.Label column sm='6' className='fs-5 fw-bold'>
                    Work Order Status :
                  </Form.Label>

                  <Col sm='6'>
                    <Form.Control
                      plaintext
                      readOnly
                      className='text-success'
                      defaultValue='SURVEY'
                    />
                  </Col>
                </Form.Group>
              </div>

              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Tanggal & Jam Survey</Form.Label>
                    <Form.Control type='date' />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Lama Pekerjaan</Form.Label>
                    <Form.Control type='text' />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <div className='fs-5 text-dark fw-bold mb-2'>List Material</div>

                <div className='table-order-content'>
                  <div className='table-responsive'>
                    <table className='table'>
                      <thead className='table-item-head'>
                        <tr>
                          <th>Item</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Instalasi AC</td>
                        </tr>
                        <tr>
                          <td>Pipa AC</td>
                        </tr>
                        <tr>
                          <td>Pipa Paralon</td>
                        </tr>
                        <tr>
                          <td></td>
                        </tr>
                        <tr>
                          <td></td>
                        </tr>
                        <tr>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Row>

              <div className='d-flex justify-content-end'>
                <Button variant='info' type='submit'>
                  Print Work Order Detail
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='card'>
        <div className='card-body table-view-order'>
          <div className='filter-search'>
            <InputGroup>
              <Form.Control placeholder='Filter' className='filter-rtl' />

              <InputGroup.Text className='filter-rtl'>
                <FontAwesomeIcon icon={faSearch} size='sm' />
              </InputGroup.Text>
            </InputGroup>
          </div>

          <div className='table-head-wrapper'>
            <div className='left'>
              <h3>Filter By :</h3>
            </div>

            <div className='middle'>
              <div className='date-filter'>
                <div className='start-date'>
                  <h3>Start Date : </h3>
                  <Form.Control type='date' />
                </div>

                <div className='end-date'>
                  <h3>End Date : </h3>
                  <Form.Control type='date' />
                </div>
              </div>
            </div>

            <div className='right d-flex justify-content-end align-items-center'>
              <div className='select-filter'>
                <h3>Sort Work Order Status : </h3>

                <select className='form-select filter filter-order'>
                  <option selected value='1'>
                    DONE
                  </option>
                  <option value='2'>ON PROGRESS</option>
                </select>
              </div>

              <button className='button-export'>
                <FontAwesomeIcon icon={faFileExcel} size='2xl' className='excel-icon' />
              </button>

              <button className='button-print'>
                <FontAwesomeIcon icon={faPrint} size='2xl' className='print-icon' />
              </button>
            </div>
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

export {UpdateWorkTukang}
