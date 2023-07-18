import React, {FC} from 'react'
import {useState} from 'react'

import './NewComplaint.css'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import InputGroup from 'react-bootstrap/InputGroup'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faImage, faFileImage, faTrash} from '@fortawesome/free-solid-svg-icons'

const NewComplaintStore: FC = () => {
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
              <Form className='h-100'>
                <div className='form-header d-flex gap-10'>
                  <Form.Label className='fw-bold'>
                    Nama Toko
                    <span className='ps-4 fs-4 fw-bolder'>MITRA 10 - BSD</span>
                  </Form.Label>
                </div>

                <Form.Label>Customer ID</Form.Label>
                <InputGroup className='mb-5'>
                  <InputGroup.Text>
                    <i className='bi bi-search' style={{fontSize: '15px'}}></i>
                  </InputGroup.Text>
                  <Form.Control aria-label='Username' placeholder='Search' />
                </InputGroup>

                <Form.Group className='mb-5'>
                  <Form.Label>Nama Customer</Form.Label>
                  <Form.Control type='text' placeholder='John Doe' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>WA / Phone Number</Form.Label>
                  <Form.Control type='number' placeholder='0855 1234 5768' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Alamat Email</Form.Label>
                  <Form.Control type='email' placeholder='john.doe@gmail.com' />
                </Form.Group>

                <Form.Group className='mb-5' controlId='exampleForm.ControlTextarea1'>
                  <Form.Label>Alamat Pemasangan</Form.Label>
                  <Form.Control as='textarea' rows={3} placeholder='Jl. Pahlawan' />
                </Form.Group>

                <div className='btn-wrapper d-flex align-items-end'>
                  <Button variant='light-dark' type='submit'>
                    Print Picklist
                  </Button>
                </div>
              </Form>
            </div>

            <div className='col-xl-4'>
              <Form>
                <Form.Group as={Row} className='mb-3'>
                  <Form.Label column sm='4'>
                    Complaint ID :
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control type='text' />
                  </Col>
                </Form.Group>

                <Form.Label>Order ID : </Form.Label>
                <InputGroup className='mb-5'>
                  <InputGroup.Text>
                    <i className='bi bi-search' style={{fontSize: '15px'}}></i>
                  </InputGroup.Text>
                  <Form.Control aria-label='Username' placeholder='Search' />
                </InputGroup>

                <Form.Group className='mb-5'>
                  <Form.Label>Nama Jasa Pemasangan</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5 '>
                  <Form.Label>Nama Lengkap Barang</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <div className='d-flex justify-content-between mb-5'>
                  <div className='text-center'>
                    <h1 className='fs-6'>Harga Jasa</h1>
                    <p>1.000.000</p>
                  </div>

                  <div className='text-center'>
                    <h1 className='fs-6'>Quantity</h1>
                    <p>1</p>
                  </div>

                  <div className='text-center'>
                    <h1 className='fs-6'>Total Harga Jasa</h1>
                    <p>1.000.000</p>
                  </div>
                </div>

                <div className='d-flex justify-content-between mb-5'>
                  <Form.Group className='mb-5' controlId='formBasicEmail'>
                    <div className='d-flex justify-content-between'>
                      <h1 className='fs-6'>Tanggal Request Survey</h1>
                    </div>
                    <Form.Control type='date' />
                  </Form.Group>

                  <Form.Group className='mb-5' controlId='formBasicEmail'>
                    <div className='d-flex justify-content-between'>
                      <h1 className='fs-6'>Tanggal Survey</h1>
                    </div>
                    <Form.Control type='date' />
                  </Form.Group>
                </div>

                <div className='d-flex justify-content-between mb-5'>
                  <Form.Group className='mb-5' controlId='formBasicEmail'>
                    <div className='d-flex justify-content-between'>
                      <h1 className='fs-6 text-center'>Tanggal Work Start</h1>
                    </div>
                    <Form.Control type='date' />
                  </Form.Group>

                  <Form.Group className='mb-5' controlId='formBasicEmail'>
                    <div className='d-flex justify-content-between'>
                      <h1 className='fs-6'>Tanggal Work Finish</h1>
                    </div>
                    <Form.Control type='date' />
                  </Form.Group>
                </div>

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
                  <h1 className='fw-bold text-danger'>COMPLAINT</h1>
                </div>

                <Form.Group className='mb-5' controlId='exampleForm.ControlTextarea1'>
                  <Form.Label>Reason For Complaint</Form.Label>
                  <Form.Control as='textarea' rows={3} placeholder='Write a message' />
                </Form.Group>

                <Form.Group as={Row} className='mb-3' controlId='formPlaintextPassword'>
                  <Form.Label>Komplain melalui : </Form.Label>
                  <Col>
                    <Form.Select>
                      <option>Default select</option>
                    </Form.Select>
                  </Col>
                </Form.Group>

                <Form.Group className='mb-5' controlId='formBasicEmail'>
                  <div className='d-flex justify-content-between'>
                    <Form.Label>Tanggal Komplain :</Form.Label>
                  </div>
                  <Form.Control type='date' />
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

export {NewComplaintStore}
