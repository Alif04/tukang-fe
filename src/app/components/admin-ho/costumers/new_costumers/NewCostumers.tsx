import React, {FC, useState} from 'react'

import './NewCostumers.css'

import {Row, Col, Form, InputGroup, Table, Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faImage, faFileImage} from '@fortawesome/free-solid-svg-icons'

const NewCostumerHO: FC = () => {
  return (
    <section id='new-costumer'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='form-wrapper'>
            <Row className='form-header'>
              <Col xs={12} md={3} lg={3} xl={3} xxl={3} className='mb-3'>
                <Form.Group as={Row} className='mb-5'>
                  <Form.Label column sm='5' className='fw-bold'>
                    Nama Toko :
                  </Form.Label>

                  <Col sm='7'>
                    <Form.Select>
                      <option value='1'>Mitra 10 - BSD</option>
                      <option value='2'>Mitra 10 - Cirebon</option>
                      <option value='3'>Mitra 10 - Cibinong</option>
                      <option value='4'>Mitra 10 - Fatmawati</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>

              <Col xs={12} md={9} lg={9} xl={9} xxl={9}></Col>
            </Row>

            <div className='form-new-costumer'>
              <Row className='input-order'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Costumer ID</Form.Label>
                    <Form.Control type='text' />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Costumer Name</Form.Label>
                    <Form.Control type='text' />
                  </Form.Group>
                </Col>
              </Row>

              <Row className='input-order'>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <div className='d-flex justify-content-between'>
                      <Form.Label>WA / Phone Number</Form.Label>

                      <div className='form-check-request'>
                        <Form.Check
                          inline
                          label='Bisa Whatsapp'
                          name='group1'
                          type='switch'
                          reverse={true}
                        />
                      </div>
                    </div>
                    <Form.Control type='number' />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group className='mb-5'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' />
                  </Form.Group>
                </Col>
              </Row>

              <Row className='alamat-order'>
                <Col>
                  <Form.Group className='mb-5'>
                    <Form.Label>Alamat</Form.Label>
                    <Form.Control as='textarea' className='field-alamat' />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>

          <div className='button-wrapper d-flex justify-content-center align-items-center'>
            <Button variant='dark-danger'>Cancel</Button>
            <Button variant='dark-primary'>Save</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewCostumerHO}
