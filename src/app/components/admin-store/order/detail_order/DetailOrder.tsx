import React, {FC} from 'react'

import './DetailOrder.css'

import {Button} from 'react-bootstrap'
import {Steps} from 'antd'

const labelTimeline = [
  {
    title: 'Booking process',
  },
  {
    title: 'Survey Process',
  },
  {
    title: 'Work in Progress',
  },
  {
    title: 'Work Done',
  },
  {
    title: 'Complaint Received',
  },
  {
    title: 'Complaint Investigated',
  },
  {
    title: 'Work Done',
  },
]

const DetailOrderStore: FC = () => {
  return (
    <section id='detail-order'>
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

              <div className='costumer-information'>
                <div className='title mb-5'>
                  <h1>Costumer Information</h1>
                </div>

                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>Costumer ID : 876992300239</p>
                  </div>

                  <div className='costumer-name  mb-3'>
                    <p className='me-5'>Costumer Name : 876992300239</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Nomor Telp / WA : 08126768945</p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>Alamat Email : ryan.filbert@gmail.com</p>
                  </div>

                  <div className='alamat-pemasangan d-flex mb-3'>
                    <p className='me-5'>
                      Alamat Pemasangan : Jl. Kijang no.9, Jakarta Timur DKI Jakarta, Indonesia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-id d-flex justify-content-between'>
                  <h1 className='text-start'>Order Status :</h1>
                  <h1 className='text-end text-success'>BOOKED</h1>
                </div>
              </div>

              <div className='product-information'>
                <div className='title  mb-5'>
                  <h1>Product Information</h1>
                </div>

                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>Nama Jasa Pemasangan : Install Water Heater New</p>
                  </div>

                  <div className='costumer-name mb-3'>
                    <p className='me-5'>
                      Item Name - Item ID : Electrolux water heater - 123765782
                    </p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>Jumlah Pemasangan : 1</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Harga Jasa : Rp. 1.000.000</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Request Tanggal Survey: 006/09/2023</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='information-wrapper'>
              <div className='detail-header'>
                <div className='order-id d-flex justify-content-between'>
                  <h3 className='text-start'>Nama Toko :</h3>
                  <h3 className='text-end'>Mitra 10 BSD - 10121</h3>
                </div>

                <div className='receipt-number d-flex justify-content-between'>
                  <h3 className='text-start'>Biaya :</h3>
                  <h3 className='text-success'>FREE</h3>
                </div>
              </div>

              <div className='sales-information'>
                <div className='title mb-5'>
                  <h1>Sales information</h1>
                </div>

                <div className='detail-information'>
                  <div className='costumer-id mb-3'>
                    <p className='me-5'>Sales Person : Wendy Silitonga</p>
                  </div>

                  <div className='costumer-name mb-3'>
                    <p className='me-5'>NIK : 876123887787</p>
                  </div>

                  <div className='email mb-3'>
                    <p className='me-5'>Brand/Division : Keramik</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Nama Bank : 1</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Nomor Akun Bank : 12312399</p>
                  </div>

                  <div className='telp mb-3'>
                    <p className='me-5'>Nama Pemilik Akun : Wendy Silitonga</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='order-history'>
            <div className='title'>
              <h1>Order History</h1>
            </div>

            <Steps current={2} labelPlacement='vertical' items={labelTimeline} />
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

export {DetailOrderStore}
