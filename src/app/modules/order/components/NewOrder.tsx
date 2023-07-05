import React, {FC} from 'react'
import './NewOrder.css'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const NewOrder: FC = () => {
  return (
    <>
      <div className='card'>
        <div className='card-body'>
          <div className='row g-5 g-xl-8'>
            <div className='col-xl-4'>
              <Form>
                <div className='form-header d-flex'>
                  <Form.Label className='fw-bold'>
                    Nama Toko <span className='ms-2 bg-secondary'>MITRA 10 - BSD</span>
                  </Form.Label>
                </div>

                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Costumer ID</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

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

                <Form.Group className='mb-5' controlId='formBasicEmail'>
                  <Form.Label>Item Name - Item ID</Form.Label>
                  <Form.Control type='text' />
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

                <div className='d-flex justify-content-between'>
                  <Button className='w-50 me-5' variant='primary' type='submit'>
                    Print Order
                  </Button>

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

export {NewOrder}
