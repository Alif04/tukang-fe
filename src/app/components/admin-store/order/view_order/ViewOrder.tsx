/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from 'react'

import './ViewOrder.css'
import './UpdateOrder.css'

import {DatePicker} from 'antd'
import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup, Modal, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faFileImage,
  faTrash,
  faSearch,
  faFilter,
  faImage,
  faPen,
} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

type Props = {
  className: string
}

interface DataType {
  key: string
  order_id: string
  assign_from: string
  date_order: string
  no_member: string
  costumer_name: string
  phone_number: string
  installer_name: string
  payment_status: string
  order_status: string
}

const {RangePicker} = DatePicker

const DateRange = () => {
  return <RangePicker className='date-range ms-3' />
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

function EditButton() {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

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
    <>
      <a className='button-edit' onClick={handleShow}>
        <FontAwesomeIcon icon={faPen} size='sm' />
      </a>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>UPDATE PESANAN - 78453992 Alia</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div id='update-order'>
            <div className='form-wrapper'>
              <div className='form-costumer'>
                <Row className='form-header'>
                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Label className='fw-bold'>
                      Nama Toko
                      <span className='fs-6 ms-2 pt-2 pb-2 fw-normal bg-secondary'>
                        MITRA 10 - BSD
                      </span>
                    </Form.Label>
                  </Col>

                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <div className='d-flex'>
                      <Form.Label className='payment-type'>Payment Type :</Form.Label>

                      <div className='form-check-request'>
                        <Form.Check inline label='Gratis' name='group1' type='radio' />
                        <Form.Check inline label='Survey' name='group1' type='radio' />
                        <Form.Check inline label='Berbayar' name='group1' type='radio' />
                        <Form.Check
                          inline
                          label='Pemasangan Tanpa Survey'
                          name='group1'
                          type='radio'
                        />
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row className='input-order'>
                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group className='mb-5'>
                      <Form.Label>No Member</Form.Label>
                      <Form.Control type='text' readOnly defaultValue='CUST001' />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group className='mb-5'>
                      <div className='d-flex justify-content-between'>
                        <Form.Label>WA / Phone Number</Form.Label>

                        <div className='form-check-request'>
                          <Form.Check
                            inline
                            label={isChecked ? 'Whatsapp' : 'Bukan Whatsapp'}
                            name='group1'
                            type='checkbox'
                            onChange={handleCheckboxChange}
                          />
                        </div>
                      </div>
                      <InputGroup className='mb-5'>
                        <InputGroup.Text>+ 62</InputGroup.Text>
                        <Form.Control type='number' placeholder='857 7777 7777' />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className='input-order'>
                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group className='mb-5'>
                      <Form.Label>Nama Customer</Form.Label>
                      <Form.Control type='text' readOnly defaultValue='John' />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group className='mb-5'>
                      <Form.Label>Email</Form.Label>
                      <Form.Control type='email' defaultValue='john.doe@gmail.com' />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className='alamat-order'>
                  <Col>
                    <Form.Group className='mb-5'>
                      <Form.Label>Alamat</Form.Label>
                      <Form.Control
                        as='textarea'
                        className='field-alamat'
                        defaultValue='Jl. Pahlawan'
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className='form-sales'>
                <div className='form-header'>
                  <h1 className='text-end fw-bold'>SALES INFORMATION</h1>
                </div>

                <Form.Group as={Row} className='mb-5'>
                  <Form.Label column sm='4'>
                    Sales ID :
                  </Form.Label>

                  <Col sm='8'>
                    <Form.Control defaultValue='SALES001' />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-5'>
                  <Form.Label column sm='4'>
                    Nama Sales :
                  </Form.Label>

                  <Col sm='8'>
                    <Form.Control defaultValue='Artur' />
                  </Col>
                </Form.Group>
              </div>
            </div>

            <Row className='table-order-header d-flex align-items-center mb-5'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='request-date order-2 order-md-1'>
                <Form.Group>
                  <Form.Label>Tanggal Request</Form.Label>
                  <Form.Control type='date' />
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='order-status order-1 order-md-2'>
                <h1 className='fw-bold'>
                  ORDER STATUS : <span className='fw-bold text-success'>PICKLIST</span>
                </h1>
              </Col>

              <Col
                xs={12}
                md={4}
                lg={4}
                xl={4}
                xxl={4}
                className='button-add text-end order-3 order-md-3'
              >
                <button>Tambah Order</button>
              </Col>
            </Row>

            <div className='table-order-content'>
              <div className='table-responsive'>
                <table className='table'>
                  <thead className='table-order-head'>
                    <tr>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Nama Pemasangan</th>
                      <th>QTY Pemasangan</th>
                      <th>Harga Jasa</th>
                      <th>Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>500.00</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>500.00</td>
                    </tr>

                    <tr>
                      <td colSpan={5} className='text-end fw-bolder'>
                        Total
                      </td>
                      <td className=' fw-bolder'>1.000.000</td>
                    </tr>

                    <tr>
                      <td colSpan={5} className='text-end fw-bolder'>
                        Biaya Survey
                      </td>
                      <td className=' fw-bolder'>700.000</td>
                    </tr>

                    <tr>
                      <td colSpan={5} className='text-end fw-bolder'>
                        Grand Total
                      </td>
                      <td className=' fw-bolder'>1.700.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Row className='upload-receipt d-flex align-items-start mt-5 mb-5'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Group controlId='formFile'>
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

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}></Col>
            </Row>

            <div className='button-submit d-flex justify-content-center align-items-center'>
              <Button variant='warning'>Reprint Order</Button>
              <Button variant='dark-primary'>Submit Order & Print</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

// const DeleteButton = () => (
//   <a className='button-delete'>
//     <FontAwesomeIcon icon={faTrash} size='sm' />
//   </a>
// )

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
    title: 'Assign From',
    dataIndex: 'assign_from',
    key: 'assign_from',
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
    title: 'No Member',
    dataIndex: 'no_member',
    key: 'no_member',
    align: 'left',
    width: 120,
  },
  {
    title: 'Costumer Name',
    dataIndex: 'costumer_name',
    key: 'costumer_name',
    align: 'left',
    width: 140,
  },
  {
    title: 'No Telp / WA',
    dataIndex: 'phone_number',
    key: 'phone_number',
    align: 'left',
    width: 140,
  },
  {
    title: 'Nama Jasa Pemasangan',
    dataIndex: 'installer_name',
    key: 'installer_name',
    align: 'left',
    width: 180,
  },
  {
    title: 'Status Pembayaran',
    dataIndex: 'payment_status',
    key: 'payment_status',
    align: 'left',
    width: 150,
  },
  {
    title: 'Status Order',
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
        {/* <DeleteButton /> */}
      </div>
    ),
    fixed: 'right',
    width: 80,
  },
]

const data: DataType[] = [
  {
    key: '1',
    order_id: '78453992',
    assign_from: 'STORE',
    date_order: '10/2/2023',
    no_member: '8986747',
    costumer_name: 'Alia',
    phone_number: '08158374638',
    installer_name: 'Patric',
    payment_status: 'PAID',
    order_status: 'DONE',
  },
  {
    key: '2',
    order_id: '78453993',
    assign_from: 'STORE',
    date_order: '13/2/2023',
    no_member: '8986748',
    costumer_name: 'Abdulah',
    phone_number: '08158376565',
    installer_name: 'Artur',
    order_status: 'DONE',
    payment_status: 'PAID',
  },
  {
    key: '3',
    order_id: '78453994',
    assign_from: 'HO',
    date_order: '14/2/2023',
    no_member: '8986710',
    costumer_name: 'Alice',
    phone_number: '08158300987',
    installer_name: 'John',
    payment_status: 'PAID',
    order_status: 'ON PROGRESS',
  },
  {
    key: '4',
    order_id: '78453995',
    assign_from: 'HO',
    date_order: '15/2/2023',
    no_member: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    installer_name: 'Patric',
    payment_status: 'PAID',
    order_status: 'ON PROGRESS',
  },
  {
    key: '5',
    order_id: '78453996',
    assign_from: 'HO',
    date_order: '10/3/2023',
    no_member: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    installer_name: 'Jonas',
    payment_status: 'PAID',
    order_status: 'ON PROGRESS',
  },
  {
    key: '6',
    order_id: '78453997',
    assign_from: 'HO',
    date_order: '12/3/2023',
    no_member: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    installer_name: 'Jonas',
    payment_status: 'PAID',
    order_status: 'ON PROGRESS',
  },
  {
    key: '7',
    order_id: '78453998',
    assign_from: 'HO',
    date_order: '15/2/2023',
    no_member: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    installer_name: 'Jonas',
    payment_status: 'PAID',
    order_status: 'ON PROGRESS',
  },
]

const ViewOrderStore: React.FC<Props> = ({className}) => {
  return (
    <section id='view-order'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
              <div className='d-flex align-items-center me-3'>
                <FontAwesomeIcon icon={faFilter} size='2xl' className='me-2' />
                <h3 className='fs-3 fw-normal'>Date : </h3>
              </div>

              <DateRange />
            </Col>

            <Col xs={12} md={12} lg={12} xl={8} xxl={8}>
              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control placeholder='Filter' className='filter-ltr' />
                </InputGroup>
              </div>
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.key}
            scroll={{x: 1500}}
            pagination={{position: ['bottomCenter']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewOrderStore}
