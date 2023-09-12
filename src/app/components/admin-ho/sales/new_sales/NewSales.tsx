import React, {FC} from 'react'

import './NewSales.css'

import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import {Row, Col, Form, FormGroup, Table, Button} from 'react-bootstrap'

const NewSalesHO: FC = () => {
  const animatedComponents = makeAnimated()

  const category = [
    {value: 'bathroom', label: 'Bathroom'},
    {value: 'doors', label: 'Doors'},
    {value: 'windows', label: 'Windows'},
  ]

  return (
    <section id='new-sales'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='costumer-information'>
              <div className='form-header'>
                <Form.Group as={Row} controlId='formPlaintextPassword'>
                  <Form.Label column sm='5'>
                    Nama Toko :
                  </Form.Label>
                  <Col sm='7'>
                    <Form.Select>
                      <option value='1' selected>
                        MITRA 10 BSD
                      </option>
                      <option value='2'>MITRA 10 BANDUNG</option>
                      <option value='3'>MITRA 10 CIREBON</option>
                      <option value='4'>MITRA 10 CIBINONG</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
              </div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Sales ID</Form.Label>
                  <Form.Control type='number' placeholder='SLS001' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Nama Sales Consultant</Form.Label>
                  <Form.Control type='text' placeholder='John Doe' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>WA/Phone Number</Form.Label>
                  <Form.Control type='number' placeholder='0855 1234 5768' />
                </Form.Group>
              </div>
            </div>

            <div className='costumer-information'>
              <div className='form-header'></div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Nama Bank</Form.Label>
                  <Form.Control type='text' placeholder='BCA' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Nomor Akun Bank</Form.Label>
                  <Form.Control type='number' placeholder='233248349' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Nama Pemilik Akun</Form.Label>
                  <Form.Control type='text' placeholder='John Doe' />
                </Form.Group>
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

            <div className='costumer-information'>
              <div className='form-header'></div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Brand</Form.Label>
                  <Form.Select>
                    <option value='1' selected>
                      RUCIKA
                    </option>
                    <option value='2'>ALDERON</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Category</Form.Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={category}
                  />
                </Form.Group>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewSalesHO}
