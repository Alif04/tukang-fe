import React, {FC} from 'react'
import {useState} from 'react'

import './UpdateOrder.css'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import InputGroup from 'react-bootstrap/InputGroup'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faImage, faFileImage, faTrash} from '@fortawesome/free-solid-svg-icons'

const UpdateOrderStore: FC = () => {
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
    <>
      <div className='card'>
        <div className='card-body'>
          <div className='row g-5 g-xl-8'>
            <div className='col-xl-4'>
              <Form>
                <div className='form-header d-flex gap-10'>
                  <Form.Label className='fw-bold'>
                    Nama Toko <span className='ms-2 bg-secondary'>MITRA 10 - BSD</span>
                  </Form.Label>

                  <div className=''>
                    <Form.Check reverse type='switch' id='custom-switch' label='Payment Type :' />
                    <Form.Label className='fw-bold d-flex justify-content-end me-2'>
                      Free
                    </Form.Label>
                  </div>
                </div>

                <Form.Label>Costumer ID</Form.Label>
                <InputGroup className='mb-3'>
                  <InputGroup.Text id='basic-addon1'>
                    <i className='bi bi-search'></i>
                  </InputGroup.Text>
                  <Form.Control
                    aria-label='Username'
                    aria-describedby='basic-addon1'
                    placeholder='Search'
                  />
                </InputGroup>

                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Costumer Name</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>WA / Phone Number</Form.Label>
                  <Form.Control type='number' />
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type='email' />
                </Form.Group>

                <Form.Group className='mb-5' controlId='exampleForm.ControlTextarea1'>
                  <Form.Label>Address</Form.Label>
                  <Form.Control as='textarea' rows={3} />
                </Form.Group>

                <Button variant='success' type='submit'>
                  Print Picklist
                </Button>
              </Form>
            </div>

            <div className='col-xl-4'>
              <Form>
                <Form.Group as={Row} className='mb-3' controlId='formPlaintextPassword'>
                  <Form.Label column sm='4'>
                    Receipt Number
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control type='text' />
                  </Col>
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Order ID</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Nama Jasa Pemasangan</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5 ' controlId='formBasicEmail'>
                  <Form.Label>Item Name - Item ID</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Table hover className='mb-3'>
                  <thead>
                    <tr>
                      <th>Harga Jasa</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>

                <Form.Group className='mb-5' controlId='formBasicEmail'>
                  <div className='d-flex justify-content-between'>
                    <Form.Label>Tanggal Request</Form.Label>

                    <div className=''>
                      <Form.Check inline checked label='Survey' name='group1' type='radio' />
                      <Form.Check inline label='Kerja Jasa' name='group2' type='radio' />
                    </div>
                  </div>
                  <Form.Control type='date' />
                </Form.Group>

                <div className='d-flex justify-content-center'>
                  <Button className='w-25 me-5' variant='danger' type='submit'>
                    Cancel
                  </Button>

                  <Button className='w-25 ms-5' variant='primary' type='submit'>
                    Save
                  </Button>
                </div>
              </Form>
            </div>

            <div className='col-xl-4'>
              <Form>
                <div className='d-flex justify-content-between mb-5'>
                  <h1 className='fw-bold'>ORDER STATUS: </h1>
                  <h1 className='fw-bold text-success'>BOOK</h1>
                </div>

                <h2 className='d-flex justify-content-end mb-5'>Sales Information</h2>

                <Form.Group as={Row} className='mb-3' controlId='formPlaintextPassword'>
                  <Form.Label column sm='4'>
                    Sales Person
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control type='text' placeholder='nama harus sama dengan nama ktp' />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-3' controlId='formPlaintextPassword'>
                  <Form.Label column sm='4'>
                    NIK
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control type='number' placeholder='nomor KTP' />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-3' controlId='formPlaintextPassword'>
                  <Form.Label column sm='4'>
                    Brand/Division
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Select>
                      <option>Default select</option>
                    </Form.Select>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-3' controlId='formPlaintextPassword'>
                  <Form.Label column sm='4'>
                    Nama Bank
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Select>
                      <option>Default select</option>
                    </Form.Select>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-3' controlId='formPlaintextPassword'>
                  <Form.Label column sm='4'>
                    Account Number
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control type='text' />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className='mb-3' controlId='formPlaintextPassword'>
                  <Form.Label column sm='4'>
                    Account Name
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control type='number' />
                  </Col>
                </Form.Group>

                <Form.Group controlId='formFile' className='mb-3'>
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

                <div className='d-flex justify-content-center'>
                  <Button className='w-50 ms-5' variant='success' type='submit'>
                    Email Order
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export {UpdateOrderStore}
