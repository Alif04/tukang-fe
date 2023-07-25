import React, {FC} from 'react'

import './NewTukang.css'

import {Form, Row, Col, Button} from 'react-bootstrap'

const NewTukang: FC = () => {
  return (
    <section id='new-vendor'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='col-8 d-flex justify-content-between'>
            <div className='costumer-information'>
              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Username</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                      <Form.Label>Tukang ID</Form.Label>
                      <Form.Control type='number' />
                </Form.Group>

                <Form.Group className='mb-5'>
                      <Form.Label>Tanggal Lahir</Form.Label>
                      <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                      <Form.Label>WA/Phone Number</Form.Label>
                      <Form.Control type='number' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <div className='d-flex justify-content-between'>
                    <Form.Label>Keahlian</Form.Label>

                    <a className='form-button-request'>
                      <Form.Label>Tambah Keahlian & jasa</Form.Label>
                      <i className="bi bi-plus"></i>
                    </a>
                  </div>
                      <Form.Control type='text' />
                </Form.Group>
              </div>
            </div>

            <div className='costumer-information'>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type='password' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Nama Tukang</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Umur</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Nomor KTP</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Harga Jasa</Form.Label>
                  <Form.Control type='number' />
                </Form.Group>
              </div>
            </div>
                <div className='col-12'>
                    <Form.Label>Alamat</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                </div>
            </div>

            <div className='costumer-information'>
              <div className='form-header'></div>

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

export {NewTukang}
