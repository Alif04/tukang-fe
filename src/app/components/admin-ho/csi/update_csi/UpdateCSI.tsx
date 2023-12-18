import React, {FC, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import './UpdateCSI.css'

import {Form, Button, Row, Col} from 'react-bootstrap'

const UpdateCSIHO: FC = () => {
  return (
    <section id='update-csi'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='header-information'>
            <div className='information-detail'>
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

            <div className='information-detail'>
              <Form.Group as={Row}>
                <Form.Label column sm='5'>
                  Costumer ID :
                </Form.Label>
                <Col sm='7'>
                  <Form.Control type='text' />
                </Col>
              </Form.Group>
            </div>

            <div className='information-detail'>
              <Form.Group as={Row}>
                <Form.Label column sm='6'>
                  Nama Costumer :
                </Form.Label>
                <Col sm='6'>
                  <Form.Control type='text' />
                </Col>
              </Form.Group>
            </div>

            <div className='information-detail'>
              <Form.Group as={Row} controlId='formPlaintextPassword'>
                <Form.Label column sm='6'>
                  Change Status :
                </Form.Label>
                <Col sm='6'>
                  <Form.Select>
                    <option value='1'>CISIN</option>
                    <option value='2'>CISOUT</option>
                  </Form.Select>
                </Col>
              </Form.Group>
            </div>
          </div>

          <div className='question'>
            <ul>
              <li className='list-question'>
                <div className='list-item d-flex justify-content-between'>
                  <h3>
                    Performance: Apakah tehnisi/tukang melakukan pekerjaan sesuai dengan spesifikasi
                    yang di haruskan?
                  </h3>

                  <div className='form-check-question'>
                    <Form.Check inline label='1' name='group1' type='radio' />
                    <Form.Check inline label='2' name='group1' type='radio' />
                    <Form.Check inline label='3' name='group1' type='radio' />
                    <Form.Check inline label='4' name='group1' type='radio' />
                    <Form.Check inline label='5' name='group1' type='radio' />
                  </div>
                </div>
              </li>

              <li className='list-question'>
                <div className='list-item d-flex justify-content-between'>
                  <h3>Delivery: Apakah pengiriman barang tepat waktu?</h3>

                  <div className='form-check-question'>
                    <Form.Check inline label='1' name='group1' type='radio' />
                    <Form.Check inline label='2' name='group1' type='radio' />
                    <Form.Check inline label='3' name='group1' type='radio' />
                    <Form.Check inline label='4' name='group1' type='radio' />
                    <Form.Check inline label='5' name='group1' type='radio' />
                  </div>
                </div>
              </li>

              <li className='list-question'>
                <div className='list-item d-flex justify-content-between'>
                  <h3>
                    Invoicing: Bagaimana harga final dibandingan dengan budget? apakah sesuai?
                  </h3>

                  <div className='form-check-question'>
                    <Form.Check inline label='1' name='group1' type='radio' />
                    <Form.Check inline label='2' name='group1' type='radio' />
                    <Form.Check inline label='3' name='group1' type='radio' />
                    <Form.Check inline label='4' name='group1' type='radio' />
                    <Form.Check inline label='5' name='group1' type='radio' />
                  </div>
                </div>
              </li>

              <li className='list-question'>
                <div className='list-item d-flex justify-content-between'>
                  <h3>Customer Service: Bagaimana tehnisi/tukang kami menjawab pertanyaan?</h3>

                  <div className='form-check-question'>
                    <Form.Check inline label='1' name='group1' type='radio' />
                    <Form.Check inline label='2' name='group1' type='radio' />
                    <Form.Check inline label='3' name='group1' type='radio' />
                    <Form.Check inline label='4' name='group1' type='radio' />
                    <Form.Check inline label='5' name='group1' type='radio' />
                  </div>
                </div>
              </li>

              <li className='list-question'>
                <div className='list-item d-flex justify-content-between'>
                  <h3>Knowledge: Seberapa dalamkan pengetahuan tehnisi/Tukang kami?</h3>

                  <div className='form-check-question'>
                    <Form.Check inline label='1' name='group1' type='radio' />
                    <Form.Check inline label='2' name='group1' type='radio' />
                    <Form.Check inline label='3' name='group1' type='radio' />
                    <Form.Check inline label='4' name='group1' type='radio' />
                    <Form.Check inline label='5' name='group1' type='radio' />
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className='notes'>
            <h3 className='mb-3'>Catatan Tambahan</h3>

            <Form.Group className='mb-5'>
              <Form.Control as='textarea' rows={3} />
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
      </div>
    </section>
  )
}

export {UpdateCSIHO}
