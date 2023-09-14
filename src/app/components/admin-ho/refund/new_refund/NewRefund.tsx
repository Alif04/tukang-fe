import React, {FC} from 'react'

import './NewRefund.css'

import {Form, Button, Table} from 'react-bootstrap'
import {Steps} from 'antd'

const labelTimeline = [
  {
    title: 'New Complaint',
  },
  {
    title: 'Investigation',
  },
  {
    title: 'Investigation Result',
  },
  {
    title: 'Rework',
  },
  {
    title: 'Refund',
  },
  {
    title: 'Review',
  },
  {
    title: 'Complaint Resolve',
  },
]

const NewRefundHO: FC = () => {
  return (
    <section id='new-refund'>
      <div className='card'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-id d-flex justify-content-between'>
                  <h3 className='text-start'>Nama Toko :</h3>
                  <h3 className='text-end'>Mitra 10 BSD - 10121</h3>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-id d-flex justify-content-between'>
                  <h3 className='text-start'>Order ID : </h3>
                  <h3 className='text-end'>77652739</h3>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='receipt-number d-flex justify-content-between'>
                  <h3 className='text-start'>Receipt Number :</h3>
                  <h3 className='text-end'>898823469121</h3>
                </div>

                <div className='order-id d-flex justify-content-between'>
                  <h3 className='text-start'>Order Status :</h3>
                  <h3 className='text-end text-success'>PAID</h3>
                </div>
              </div>
            </div>
          </div>

          <div className='costumer-information mb-5'>
            <div className='row'>
              <div className='col-xxl-6'>
                <div className='title mb-5'>
                  <h1>Informasi Pembeli</h1>
                </div>

                <div className='row'>
                  <div className='col-xxl-6'>
                    <h6>No. Member : 876992300239</h6>
                    <h6>Customer Name : Ryan Filbert</h6>
                    <h6>
                      Alamat Pemasangan : Jl. Kijang no.9, Jakarta TimurDKI Jakarta, Indonesia
                    </h6>
                  </div>

                  <div className='col-xxl-6'>
                    <h6>Nomor Telp/WA : 08126768945</h6>
                    <h6>Alamat Email : ryan.filbert@gmail.com</h6>
                  </div>
                </div>
              </div>
              <div className='col-xxl-6'>
                <div className='title mb-5'>
                  <h1>Informasi Penjual</h1>
                </div>

                <div className='row'>
                  <div className='col-xxl-6'>
                    <h6>Sales ID : 876123887787</h6>
                    <h6>Sales Person : Wendy Silitonga</h6>
                  </div>

                  <div className='col-xxl-6'></div>
                </div>
              </div>
            </div>
          </div>

          <div className='order-information mb-5'>
            <div className='header-information mb-5'>
              <h1>Informasi Pemasangan</h1>
              <h5>Tanggal request pemasangan : 20/08/2023</h5>
            </div>

            <Table responsive='md' className='new-refund-table'>
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Nama Pemasangan</th>
                  <th>QTY Pemasangan</th>
                  <th>Harga Jasa</th>
                  <th>Jumlah Harga</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0001 </td>
                  <td>Electronlux Water Heater</td>
                  <td>Install Water Heater</td>
                  <td className='text-center'>1</td>
                  <td>Rp. 1.000.000</td>
                  <td>Rp. 1.0000.000</td>
                </tr>
                <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Biaya Survey
                  </td>
                  <td className=' fw-bolder'>Rp. 500.000</td>
                </tr>
                <tr>
                  <td colSpan={5} className='text-end fw-bolder'>
                    Grand Total
                  </td>
                  <td className=' fw-bolder'>Rp. 1.500.000</td>
                </tr>
              </tbody>
            </Table>
          </div>

          <hr />

          <div className='order-history'>
            <div className='title'>
              <h1 className='text-uppercase'>formulir refund</h1>
            </div>

            <div className='row mb-5'>
              <div className='col-md-4'>
                <div className='complaint-information'>
                  <h4>Tanggal Pengajuan Refund : </h4>
                  <h4>22/09/2023</h4>
                </div>
              </div>

              <div className='col-md-4'>
                <div className='complaint-detail'>
                  <h4>Alasan Refund :</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint
                  </p>
                </div>
              </div>

              <div className='col-xxl-4'></div>
            </div>

            <div className='row'>
              <div className='col-xxl-4'>
                <div className='complaint-information mb-5'>
                  <h4>Tanggal Approve Refund : </h4>
                  <Form.Control type='date' className='w-75' />
                </div>

                <div className='complaint-information'>
                  <h4>Nomor Approval : </h4>
                  <Form.Control type='number' className='w-75' placeholder='08434323' />
                </div>
              </div>

              <div className='col-xxl-4'>
                <div className='complaint-information'>
                  <h4>Notes</h4>
                  <Form.Control as='textarea' className='desc-notes' />
                </div>
              </div>

              <div className='col-xxl-4'>
                <div className='row'>
                  <div className='col-xxl-6'>
                    <h4 className='mb-2'>Untuk Customer</h4>
                    <h4 className='mb-2'>Input Voucher</h4>
                    <Form.Control type='text' placeholder='VOUCHER01' className='mt-5 mb-5' />
                    <Button variant='primary'>Voucher</Button>
                  </div>

                  <div className='col-xxl-6'>
                    <h4 className='mb-2'>Untuk Vendor</h4>
                    <h4 className='mb-2'>Input Nominal Denda</h4>
                    <Form.Control type='number' placeholder='Rp. 1.000.000' className='mt-5 mb-5' />
                    <Button variant='danger'>Penalty</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='d-flex justify-content-center'>
            <Button variant='dark-danger' type='submit'>
              Cancel
            </Button>

            <Button variant='dark-primary' type='submit'>
              Update Complaint
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewRefundHO}
