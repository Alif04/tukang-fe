import React, {useState, FC} from 'react'

import './UpdateInvoice.css'
import {Table, Row, Col, Form, Button} from 'react-bootstrap'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faImage, faFileImage, faTrash} from '@fortawesome/free-solid-svg-icons'

const UpdateInvoiceVendor: FC = () => {
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
    <section id='update-invoice'>
      <div className='card'>
        <div className='card-body'>
          <Row>
            <Col lg={8}>
              <Row>
                <Col>
                  <Form>
                    <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
                      <Form.Label>Order ID</Form.Label>
                      <Form.Control type='text' />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
                      <Form.Label>Nama Jasa Pemasangan</Form.Label>
                      <Form.Control type='text' readOnly />
                    </Form.Group>
                  </Form>
                </Col>

                <Col>
                  <Form>
                    <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
                      <Form.Label>Qoutation ID</Form.Label>
                      <Form.Control type='text' />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
                      <Form.Label>Nama Lengkap Barang</Form.Label>
                      <Form.Control type='text' readOnly />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>

              <Row className='mt-5 mb-5'>
                <div className='table-item'>
                  <Table striped hover>
                    <thead className='table-item-head'>
                      <tr>
                        <th>Nama Barang</th>
                        <th>Harga Satuan</th>
                        <th>Jumlah</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Atas Pekerjaan</td>
                        <td>500.000</td>
                        <td>1</td>
                        <td>500.000</td>
                      </tr>

                      <tr>
                        <td>Pipa Air Panas</td>
                        <td>3.000</td>
                        <td>10</td>
                        <td>30.000</td>
                      </tr>

                      <tr>
                        <td>Paku</td>
                        <td>50</td>
                        <td>10</td>
                        <td>500</td>
                      </tr>

                      <tr>
                        <td>Pipa Paralon</td>
                        <td>16.000</td>
                        <td>10</td>
                        <td>160.000</td>
                      </tr>

                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Total
                        </td>
                        <td className=' fw-bolder'>690.500</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Pajak
                        </td>
                        <td className=' fw-bolder'>69.050</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Grand Total
                        </td>
                        <td className=' fw-bolder'>759.550</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Row>

              <Row className='mb-5'>
                <div className='costumer-information'>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    Customer Name : MItra10 BSD
                  </h3>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    WA/Phone Number : 0812.867.6367
                  </h3>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    Email Address : alia.rosana@gmail.com
                  </h3>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    Address : Jl. Semangka IV/32 Jakarta Utara, DKI JAKARTA
                  </h3>
                  <h3 className='fs-5 fw-bolder text-start mt-4 mb-4'>
                    Tanggal Request Survey: 10/2/2023
                  </h3>
                </div>
              </Row>

              <div className='d-flex justify-content-start'>
                <Button variant='dark-danger m-0' type='submit'>
                  Cancel
                </Button>

                <Button variant='dark-primary' type='submit'>
                  Save
                </Button>
              </div>
            </Col>

            <Col lg={4}>
              <div className='survey-information'>
                <div className='form-header'>
                  <h1 className='fw-bold'>WORK STATUS: </h1>
                  <h1 className='fw-bold text-success'>INVOICED</h1>
                </div>

                <div className='form-body'>
                  <h3 className='fs-5 fw-bolder text-end mt-4 mb-4'>Tanggal Survey : 12/2/2023</h3>
                  <h3 className='fs-5 fw-bolder text-end mt-4 mb-4'>
                    Tanggal Pengerjaan : 12/2/2023
                  </h3>
                  <h3 className='fs-5 fw-bolder text-end mt-4 mb-4'>Lama Pengerjaan : 10 hari</h3>
                  <h3 className='fs-5 fw-bolder text-end mt-4 mb-4'>Tanggal Selesai : 12/2/2023</h3>
                </div>
              </div>

              <div className='invoice-evidence'>
                <Form.Group controlId='formFile'>
                  <Form.Label>UPLOAD DOCUMENT</Form.Label>
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

              <div className='d-flex justify-content-end'>
                <Button variant='dark-success' type='submit'>
                  Save & Email Quotation
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  )
}

export {UpdateInvoiceVendor}
