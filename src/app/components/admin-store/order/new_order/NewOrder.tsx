import React, {FC} from 'react'

import './NewOrder.css'

import {Form, Table, Button} from 'react-bootstrap'

const NewOrderStore: FC = () => {
  return (
    <section id='new-order'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='costumer-information'>
              <div className='form-header'>
                <Form.Label className='fw-bold'>
                  Nama Toko
                  <span className='fs-6 ms-2 pt-2 pb-2 fw-normal bg-secondary'>MITRA 10 - BSD</span>
                </Form.Label>

                <div className=''>
                  <Form.Check reverse type='switch' id='custom-switch' label='Payment Type :' />
                  <Form.Label className='fw-bold d-flex justify-content-end me-2'>Free</Form.Label>
                </div>
              </div>

              <div className='form-body'>
                <Form.Group className='mb-5'>
                  <Form.Label>Customer ID</Form.Label>
                  <Form.Control type='text' placeholder='CUST001' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Nama Customer</Form.Label>
                  <Form.Control type='text' placeholder='John Doe' />
                </Form.Group>

                <Form.Group className='mb-5'>
                  <Form.Label>Order ID</Form.Label>
                  <Form.Control type='text' />
                </Form.Group>
              </div>

              <div className='btn-wrapper d-flex align-items-end'>
                <Button variant='light-dark' type='submit'>
                  Print Picklist
                </Button>
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

              <div className='d-flex justify-content-center'>
                <Button variant='dark-success' type='submit'>
                  Email Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='card'>
        <div className='card-body'>
          <div className='button-add text-end'>
            <button>Add</button>
          </div>

          <div className='table-picklist'>
            <Table hover>
              <thead className='table-picklist-head'>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Group Item</th>
                  <th>Harga Jasa</th>
                  <th>Jumlah</th>
                  <th>Total</th>
                  <th>Sales Person</th>
                  <th>Division</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewOrderStore}
