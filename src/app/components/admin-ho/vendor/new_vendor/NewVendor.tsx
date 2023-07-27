import React, {FC} from 'react'
import {useState} from 'react'

import './NewVendor.css'

import {Form, Row, Col, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faImage, faFileImage, faTrash} from '@fortawesome/free-solid-svg-icons'

const NewVendorHO: FC = () => {
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
    <section id='new-vendor'>
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
    </section>
  )
}

export {NewVendorHO}
