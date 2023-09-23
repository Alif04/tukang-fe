import React, {FC, useState} from 'react'

import './NewOrder.css'

import {Row, Col, Form, InputGroup, Table, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

const NewOrderHO: FC = () => {
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
    <section id='new-order'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <div className='form-costumer'>
              <Row className='form-header'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='mb-3'>
                  <Form.Group as={Row} className='mb-5'>
                    <Form.Label column sm='4' className='fw-bold'>
                      Nama Toko :
                    </Form.Label>

                    <Col sm='8'>
                      <Form.Select>
                        <option value='1'>Mitra 10 - BSD</option>
                        <option value='2'>Mitra 10 - Cirebon</option>
                        <option value='3'>Mitra 10 - Cibinong</option>
                        <option value='4'>Mitra 10 - Fatmawati</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6} className='mb-3'>
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
                    <Form.Label>Alamat Email</Form.Label>
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

              <Form.Group as={Row} className='mb-5'>
                <Form.Label column sm='4'>
                  No Receipt :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control defaultValue='38423' />
                </Col>
              </Form.Group>
            </div>
          </div>

          <Row className='table-order-header d-flex align-items-center mb-5'>
            <Col xs={12} md={3} lg={3} xl={3} xxl={3} className='request-date order-2 order-md-1'>
              <Form.Group>
                <Form.Label>Tanggal Request</Form.Label>
                <Form.Control type='date' />
              </Form.Group>
            </Col>

            <Col xs={12} md={3} lg={3} xl={3} xxl={3} className='vendor-name order-2 order-md-1'>
              <Form.Group>
                <Form.Label>Nama Vendor</Form.Label>
                <Form.Select>
                  <option value='1'>PT. ABC</option>
                  <option value='2'>PT. BCA</option>
                  <option value='3'>PT. AZA</option>
                  <option value='4'>PT. DBK</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col
              xs={12}
              md={4}
              lg={4}
              xl={4}
              xxl={4}
              className='order-status order-1 order-md-2 text-end'
            >
              <h1 className='fw-bold'>
                ORDER STATUS : <span className='fw-bold text-success'>ORDER</span>
              </h1>
            </Col>

            <Col
              xs={12}
              md={2}
              lg={2}
              xl={2}
              xxl={2}
              className='button-add text-end order-3 order-md-3  d-flex justify-content-center align-items-center'
            >
              <button>Tambah Order</button>
            </Col>
          </Row>

          <div className='table-order-content'>
            <Table hover responsive='md'>
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
            </Table>
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
            <Button variant='dark-primary'>Submit Order & Print</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewOrderHO}
