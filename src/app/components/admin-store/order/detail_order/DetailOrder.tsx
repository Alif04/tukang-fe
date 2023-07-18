import React, {FC} from 'react'
import {useState} from 'react'

import './DetailOrder.css'

const DetailOrderStore: FC = () => {
  return (
    <>
      <div className='card'>
        <div className='card-body d-flex justify-content-between'>
          <div className='information-wrapper'>
            <div className='order-information mb-5'>
              <div className='order-id d-flex justify-content-between'>
                <h3 className='text-start'>Order ID :</h3>
                <h3 className='text-end'>77652739</h3>
              </div>

              <div className='receipt-number d-flex justify-content-between'>
                <h3 className='text-start'>Receipt Number :</h3>
                <h3 className='text-end'>898823469121</h3>
              </div>
            </div>

            <div className='costumer-wrapper'>
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
            <div className='order-information mb-5'>
              <div className='order-id d-flex justify-content-between'>
                <h1 className='text-start'>Order Status :</h1>
                <h1 className='text-end text-success'>BOOKED</h1>
              </div>
            </div>

            <div className='product-wrapper'>
              <div className='title  mb-5'>
                <h1>Product Information</h1>
              </div>

              <div className='detail-information'>
                <div className='costumer-id mb-3'>
                  <p className='me-5'>Nama Jasa Pemasangan : Install Water Heater New</p>
                </div>

                <div className='costumer-name mb-3'>
                  <p className='me-5'>Item Name - Item ID : Electrolux water heater - 123765782</p>
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
            <div className='order-information mb-5'>
              <div className='order-id d-flex justify-content-between'>
                <h3 className='text-start'>Nama Toko :</h3>
                <h3 className='text-end'>Mitra 10 BSD - 10121</h3>
              </div>

              <div className='receipt-number d-flex justify-content-between'>
                <h3 className='text-start'>Biaya :</h3>
                <h3 className='text-success'>FREE</h3>
              </div>
            </div>

            <div className='costumer-wrapper'>
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
      </div>
    </>
  )
}

export {DetailOrderStore}
