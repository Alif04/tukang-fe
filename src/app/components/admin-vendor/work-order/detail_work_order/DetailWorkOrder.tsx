import React, {FC} from 'react'

import './DetailWorkOrder.css'

import {Form, Button, InputGroup, Row, Col, Table} from 'react-bootstrap'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faPen,
  faTrash,
  faSearch,
  faPlus,
  faImage,
  faFileImage,
  faUserPlus,
  faFileExcel,
} from '@fortawesome/free-solid-svg-icons'

const DetailWorkVendor: FC = () => {
  return (
    <section id='detail-work-order'>
      <div className='card mb-5'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-id'>
                  <h3>Order ID : 77652739</h3>
                  <h3>Costumer ID : 876992300239</h3>
                </div>
              </div>

              <div className='costumer-information'>
                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>
                      <span>Costumer ID :</span> 77652739
                    </p>
                  </div>

                  <div className='costumer-name  mb-3'>
                    <p className='me-5'>
                      <span>Costumer Name :</span> Ryan Filbert
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      <span>Phone/WA :</span> 876992300239
                    </p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>
                      <span>Email Address :</span> ryan.filbert@gmail.com
                    </p>
                  </div>

                  <div className='alamat-pemasangan d-flex mb-3'>
                    <p className='me-5'>
                      <span>Address :</span> Jl. Kijang no.9, Jakarta Timur, DKI Jakarta, Indonesia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <h1>
                  WORK ORDER STATUS: <span>SURVEYED</span>
                </h1>
              </div>

              <div className='product-information'>
                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>
                      <span>Order ID : </span>88965329
                    </p>
                  </div>

                  <div className='costumer-name mb-3'>
                    <p className='me-5'>
                      <span>Nama Jasa Pemasangan : </span>Pemasangan Water Heater
                    </p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>
                      <span>Item Name : </span>Electrolux Water Heater
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      <span>Tipe Pembayaran : </span>FREE
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      <span>Harga Jasa : </span>1.000.000
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      <span>Quantity : </span>1
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      <span>Total Harga : </span>1.000.000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-status'>
                  <h3>
                    Nama Toko : <span>Mitra10 BSD</span>
                  </h3>
                </div>
              </div>

              <div className='sales-information'>
                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>
                      <span>Tanggal Request Survey : </span>09/06/2023
                    </p>
                  </div>

                  <div className='costumer-name mb-3'>
                    <p className='me-5'>
                      <span>Tanggal Survey : </span>10/06/2023 <span>Oleh : </span> Saiful
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      <span>Tanggal Mulai Kerja : </span>19/06/2023 <span>Oleh : </span> Udin, Jamal
                    </p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>
                      <span>Tanggal Selesai : </span>29/06/2023 <span>Oleh : </span> Udin, Jamal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='table-item'>
            <Table hover>
              <thead className='table-item-head'>
                <tr>
                  <th>Item</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Instalasi AC</td>
                </tr>
                <tr>
                  <td>Pipa AC</td>
                </tr>
                <tr>
                  <td>Pipa Paralon</td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className='d-flex justify-content-center'>
            <Button variant='dark-danger' type='submit'>
              Cancel
            </Button>

            <Button variant='info' type='submit'>
              Print Work Order Detail
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {DetailWorkVendor}
