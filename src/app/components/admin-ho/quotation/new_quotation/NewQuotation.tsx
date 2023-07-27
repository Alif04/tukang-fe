import React, {FC} from 'react'

import './NewQuotation.css'

import {Form, Table, Button, Row, Col} from 'react-bootstrap'

const NewQuotationHO: FC = () => {
  return (
    <section id='new-quotation'>
      <div className='card mb-5'>
        <div className='card-body'>
          <Row>
            <Col lg={8}>
              <Row className='mb-5'>
                <Col lg={4}>
                  <div className='quotation-information'>
                    <div className='form-header'></div>

                    <div className='form-body'>
                      <Form.Group className='mb-5'>
                        <Form.Label>Nama Toko</Form.Label>
                        <Form.Select>
                          <option selected value='1'>
                            MITRA 10 BSD
                          </option>
                          <option value='2'>MITRA 10 Fatmawati</option>
                          <option value='3'>MITRA 10 Bandung</option>
                          <option value='4'>MITRA 10 Jogja</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className='mb-5'>
                        <Form.Label>Costumer Name</Form.Label>
                        <Form.Control type='text' />
                      </Form.Group>
                    </div>
                  </div>
                </Col>

                <Col lg={4}>
                  <div className='quotation-information'>
                    <div className='form-header'></div>

                    <div className='form-body'>
                      <Form.Group className='mb-5'>
                        <Form.Label>Costumer ID</Form.Label>
                        <Form.Control type='email' placeholder='name@example.com' />
                      </Form.Group>

                      <Form.Group className='mb-5'>
                        <Form.Label>Phone Number / WA Number</Form.Label>
                        <Form.Control type='number' />
                      </Form.Group>
                    </div>
                  </div>
                </Col>

                <Col lg={4}>
                  <div className='quotation-information'>
                    <div className='form-header'></div>

                    <div className='form-body'>
                      <Form.Group className='mb-5'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type='email' placeholder='name@example.com' />
                      </Form.Group>

                      <Form.Group className='mb-5'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type='email' />
                      </Form.Group>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className='mt-5'>
                <div className='table-item'>
                  <Table hover>
                    <thead className='table-item-head'>
                      <tr>
                        <th>Item</th>
                        <th>Harga Satuan</th>
                        <th>Jumlah</th>
                        <th>Total Harga</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Jasa Instalasi AC</td>
                        <td>1.800.000</td>
                        <td>1</td>
                        <td>1.800.000</td>
                      </tr>

                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Total
                        </td>
                        <td className=' fw-bolder'>1.800.000</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Discount (8%)
                        </td>
                        <td className=' fw-bolder'>-144.000</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className='text-end fw-bolder'>
                          Grand Total
                        </td>
                        <td className=' fw-bolder'>1.854.000</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Row>

              <div className='d-flex justify-content-center align-items-end'>
                <Button variant='dark-danger' type='submit'>
                  Cancel
                </Button>

                <Button variant='dark-primary' type='submit'>
                  Save
                </Button>
              </div>
            </Col>

            <Col lg={4}>
              <div className='bank-information'>
                <div className='form-header'>
                  <h1 className='fw-bold'>ORDER STATUS: </h1>
                  <h1 className='fw-bold text-success'>QUOTE OUT</h1>
                </div>

                <div className='form-body'>
                  <Form.Group as={Row} className='mb-5' controlId='formPlaintextEmail'>
                    <Form.Label column sm='4'>
                      Quotation ID :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control type='text' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5' controlId='formPlaintextEmail'>
                    <Form.Label column sm='4'>
                      Valid Until :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control type='text' />
                    </Col>
                  </Form.Group>

                  <Form.Group className='mb-5'>
                    <Form.Label>Alamat</Form.Label>
                    <Form.Control
                      as='textarea'
                      className='field-alamat'
                      placeholder='Jl. Pahlawan'
                    />
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5' controlId='formPlaintextEmail'>
                    <Form.Label column sm='4'>
                      Bank Name :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control type='text' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5' controlId='formPlaintextEmail'>
                    <Form.Label column sm='4'>
                      Bank Account :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control type='text' />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className='mb-5' controlId='formPlaintextEmail'>
                    <Form.Label column sm='4'>
                      Account Name :
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control type='text' />
                    </Col>
                  </Form.Group>
                </div>
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

export {NewQuotationHO}
