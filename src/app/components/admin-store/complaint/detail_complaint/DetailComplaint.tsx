import React, {FC, useState} from 'react'

import './DetailComplaint.css'

import {Row, Col, Form, FormGroup, Button, ListGroup, Table} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

const DetailComplaintStore: FC = () => {
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
    <section id='detail-complaint'>
      <div className='card'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Nama Toko : <span className='fs-4 ms-2 fw-normal'>MITRA 10 BSD - 10121</span>
                </Form.Label>

                <Form.Label className='fs-4 fw-bold'>
                  Complaint ID : <span className='fs-4 ms-2 fw-normal'>873487923</span>
                </Form.Label>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Order ID : <span className='fs-4 ms-2 fw-normal'>77652739</span>
                </Form.Label>
                <Form.Group as={Row}>
                  <Form.Label column sm='4' className='fs-4 fw-bold m-0'>
                    Order Date :
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control type='date' plaintext readOnly />
                  </Col>
                </Form.Group>
              </Col>

              <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                <Form.Label className='fs-4 fw-bold'>
                  Receipt Number : <span className='fs-4 ms-2 fw-normal'>898823469121</span>
                </Form.Label>
              </Col>
            </Row>

            <Row className='information-detail'>
              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='costumer-info mb-5'>
                <div className='fs-3 fw-bold'>Informasi Pembeli</div>
                <Row>
                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        No Member :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control plaintext readOnly defaultValue='876992300239' />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Customer Name :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control plaintext readOnly defaultValue='Ryan Filbert' />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Alamat Pemasangan :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control
                          as='textarea'
                          plaintext
                          readOnly
                          rows={3}
                          defaultValue='Jl. Kijang no.9, Jakarta Timur DKI Jakarta, Indonesia'
                        />
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Nomor Telp/WA :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control plaintext readOnly defaultValue='08126768945' />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className='detail-info'>
                      <Form.Label column sm='6'>
                        Alamat Email :
                      </Form.Label>
                      <Col sm='6'>
                        <Form.Control plaintext readOnly defaultValue='ryan.filbert@gmail.com' />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='sales-info mb-5'>
                <div className='fs-3 fw-bold'>Informasi Penjual</div>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Sales ID :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Control plaintext readOnly defaultValue='876123887787' />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='detail-info'>
                  <Form.Label column sm='6'>
                    Sales Person :
                  </Form.Label>
                  <Col sm='6'>
                    <Form.Control plaintext readOnly defaultValue='Wendy Silitonga' />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <Row className='table-warranty d-flex align-items-center mb-5'>
            <div className='table-title-warranty mb-2'>
              <div className='fs-3 fw-bold'>Informasi Pemasangan</div>
            </div>

            <div className='table-warranty-content'>
              <Table hover responsive='md'>
                <thead className='table-warranty-head'>
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
              </Table>
            </div>
          </Row>

          <hr />

          <Row>
            <div className='fs-3 fw-bold text-uppercase text-decoration-underline'>
              COMPLAINT HISTORY
            </div>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  Complaint Date :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control type='date' plaintext readOnly />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  Complaint via :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control plaintext readOnly defaultValue='Call' />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='detail-info'>
                <Form.Label column sm='6'>
                  PIC Complaint :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control plaintext readOnly defaultValue='Nuning' />
                </Col>
              </Form.Group>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <Form.Label className='mt-3'>Complaint Detail :</Form.Label>
              <Form.Control
                style={{minHeight: '200px'}}
                as='textarea'
                plaintext
                readOnly
                defaultValue='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
                        in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat'
              ></Form.Control>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
              <Form.Label className='mt-3'>Complaint Evidence :</Form.Label>
              <ListGroup>
                <ListGroup.Item>342344.png</ListGroup.Item>
                <ListGroup.Item>848735.png</ListGroup.Item>
                <ListGroup.Item>Complaint.docx</ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          <hr />

          <Row>
            <Col xs={12} md={8} lg={8} xl={8} xxl={8} className='mb-3'>
              <Form.Label className='fs-3 fw-bold'>Feedback Store :</Form.Label>
              <Form.Control
                style={{minHeight: '170px'}}
                as='textarea'
                defaultValue='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
                        in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat'
              ></Form.Control>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Group controlId='formFile'>
                <Form.Label className='fs-3 fw-normal'>UPLOAD BUKTI</Form.Label>
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
          </Row>

          <Row>
            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Group>
                <Form.Label>Nama Pemberi Feedback</Form.Label>
                <Form.Control type='text' placeholder='John Doe' />
              </Form.Group>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Group>
                <Form.Label>Jabatan</Form.Label>
                <Form.Control type='text' />
              </Form.Group>
            </Col>

            <Col xs={12} md={4} lg={4} xl={4} xxl={4} className='mb-3'>
              <Form.Group>
                <Form.Label>Tanggal Feedback : </Form.Label>
                <Form.Control type='date' />
              </Form.Group>
            </Col>
          </Row>

          <hr />

          <div className='card'>
            <div className='card-body'>
              <Row>
                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Complaint Date :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control type='date' plaintext readOnly />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      Complaint via :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Call' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='detail-info'>
                    <Form.Label column sm='6'>
                      PIC Complaint :
                    </Form.Label>
                    <Col sm='6'>
                      <Form.Control plaintext readOnly defaultValue='Nuning' />
                    </Col>
                  </Form.Group>
                </Col>

                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Label className='mt-3'>Complaint Detail :</Form.Label>
                  <Form.Control
                    style={{minHeight: '200px'}}
                    as='textarea'
                    plaintext
                    readOnly
                    defaultValue='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
                        in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat'
                  ></Form.Control>
                </Col>

                <Col xs={12} md={4} lg={4} xl={4} xxl={4}>
                  <Form.Label className='mt-3'>Complaint Evidence :</Form.Label>
                  <ListGroup>
                    <ListGroup.Item>342344.png</ListGroup.Item>
                    <ListGroup.Item>848735.png</ListGroup.Item>
                    <ListGroup.Item>Complaint.docx</ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export {DetailComplaintStore}
