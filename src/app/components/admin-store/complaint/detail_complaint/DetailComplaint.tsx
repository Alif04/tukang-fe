import React, {FC} from 'react'

import './DetailComplaint.css'

import {Button, ListGroup, Table} from 'react-bootstrap'
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

const DetailComplaintStore: FC = () => {
  return (
    <section id='detail-complaint'>
      <div className='card'>
        <div className='card-body'>
          <div className='d-flex justify-content-between'>
            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-id d-flex justify-content-between'>
                  <h3 className='text-start'>Order ID :</h3>
                  <h3 className='text-end'>77652739</h3>
                </div>

                <div className='receipt-number d-flex justify-content-between'>
                  <h3 className='text-start'>Receipt Number :</h3>
                  <h3 className='text-end'>898823469121</h3>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-id d-flex justify-content-between'>
                  <h1 className='text-start'>Order Status :</h1>
                  <h1 className='text-end text-danger'>COMPLAINT</h1>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-id d-flex justify-content-between'>
                  <h3 className='text-start'>Nama Toko :</h3>
                  <h3 className='text-end'>Mitra 10 BSD - 10121</h3>
                </div>
              </div>
            </div>
          </div>

          <div className='costumer-information mb-5'>
            <div className='title mb-5'>
              <h1 className='text-uppercase text-decoration-underline'>Costumer Information</h1>
            </div>

            <Table responsive='md' className='detail-complaint-table' borderless>
              <thead>
                <tr>
                  <th>Customer ID : </th>
                  <th>Customer Name : </th>
                  <th>WA/Phone Number : </th>
                  <th>Email Address : </th>
                  <th>Address : </th>
                  <th>Installation Type : </th>
                  <th>Warranty</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>876992300239</td>
                  <td>Ryan Filbert</td>
                  <td>08126768945</td>
                  <td>ryan.filbert@gmail.com</td>
                  <td>Jl. Kijang no.9, Jakarta Timur, DKI Jakarta, Indonesia</td>
                  <td className='fw-bold text-success'>FREE</td>
                  <td className='fw-bold text-danger'>NO </td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className='order-information mb-5'>
            <div className='title mb-5'>
              <h1 className='text-uppercase text-decoration-underline'>Order Information</h1>
            </div>

            <Table responsive='md' className='detail-complaint-table'>
              <thead>
                <tr>
                  <th>Nama Jasa Pemasangan</th>
                  <th>Nama Lengkap Barang</th>
                  <th>Harga Jasa</th>
                  <th className='text-center'>Jumlah</th>
                  <th className='text-center'>Total Harga Jasa</th>
                  <th>Tanggal Request Survey</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Install Water Heater </td>
                  <td>Electronlux water heater</td>
                  <td>Rp.1.000.000,00</td>
                  <td className='text-center'>1</td>
                  <td className='text-center'>Rp. 1.000.000,00</td>
                  <td>06/09/2023</td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className='order-history'>
            <div className='title'>
              <h1 className='text-uppercase text-decoration-underline'>Complaint History</h1>
            </div>

            <div className='row'>
              <div className='col-md-4'>
                <div className='complaint-information'>
                  <h4>Complaint Date : 22/09/2023 13:24:00</h4>
                  <h4>PIC Complaint : Call</h4>
                  <h4>PIC Complaint : Nuning</h4>
                </div>
              </div>

              <div className='col-md-4'>
                <div className='complaint-detail'>
                  <h4>Complaint Detail :</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint
                  </p>
                </div>
              </div>

              <div className='col-md-4'>
                <div className='complaint-evidence'>
                  <h4>Complaint Evidence :</h4>
                  <ListGroup>
                    <ListGroup.Item>342344.png</ListGroup.Item>
                    <ListGroup.Item>848735.png</ListGroup.Item>
                    <ListGroup.Item>Complaint.png</ListGroup.Item>
                  </ListGroup>
                </div>
              </div>
            </div>
          </div>

          <div className='order-history'>
            <div className='title'>
              <h1 className='text-uppercase text-decoration-underline'>Complaint Flow</h1>
            </div>

            <Steps current={1} labelPlacement='vertical' items={labelTimeline} />
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

export {DetailComplaintStore}
