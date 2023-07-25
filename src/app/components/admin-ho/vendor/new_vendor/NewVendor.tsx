import React, {FC} from 'react'

import './NewVendor.css'

import {Form, Row, Col, Button} from 'react-bootstrap'

const NewVendorHO: FC = () => {
  return (
    <section id='new-vendor'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='costumer-information'>
              <div className='form-header'>
                <Form.Label className='fw-bold'>Serving Area</Form.Label>

                <Form.Select className='form-select-area'>
                  <option>Open this select menu</option>
                  <option value='1'>One</option>
                  <option value='2'>Two</option>
                  <option value='3'>Three</option>
                </Form.Select>
                <Form.Select className='form-select-area'>
                  <option>Open this select menu</option>
                  <option value='1'>One</option>
                  <option value='2'>Two</option>
                  <option value='3'>Three</option>
                </Form.Select>
                <Form.Select className='form-select-area'>
                  <option>Open this select menu</option>
                  <option value='1'>One</option>
                  <option value='2'>Two</option>
                  <option value='3'>Three</option>
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
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control type='number' />
                    </Col>

                    <Col>
                      <Form.Label>Fax Number</Form.Label>
                      <Form.Control type='number' />
                    </Col>
                  </Row>
                </Form.Group>
              </div>
            </div>

            <div className='costumer-information'>
              <div className='form-header'></div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>WA / Phone Number</Form.Label>
                  <Form.Control type='number' placeholder='0855 1234 5768' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Alamat Email</Form.Label>
                  <Form.Control type='email' placeholder='john.doe@gmail.com' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <div className='d-flex justify-content-between'>
                    <Form.Label>Tanggal Request</Form.Label>

                    <div className='form-check-request'>
                      <Form.Check inline label='Survey' name='group1' type='radio' />
                      <Form.Check inline label='Kerja Jasa' name='group1' type='radio' />
                    </div>
                  </div>
                  <Form.Control type='date' />
                </Form.Group>
              </div>
            </div>

            <div className='costumer-information'>
              <div className='form-header'>
                <h1 className='fw-bold'>ORDER STATUS: </h1>
                <h1 className='fw-bold text-success'>PICKLIST</h1>
              </div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control as='textarea' className='field-alamat' placeholder='Jl. Pahlawan' />
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
