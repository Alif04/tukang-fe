import React, {FC} from 'react'

import './DetailInvoice.css'
import {Table, Button, Row, Col} from 'react-bootstrap'

const DetailInvoiceVendor: FC = () => {
  return (
    <section id='detail-invoice'>
      <div className='card'>
        <div className='card-body'>
          <div className='invoice-detail d-flex justify-content-between'>
            <div className='vendor-information'>
              <div className='vendor-detail'>
                <h1 className='fw-bolder'>PT ABC</h1>

                <div className='address'>
                  <h3 className='fw-normal'>Jalan Gading Serpong Boulevard Blok Mitra10</h3>
                  <h3 className='fw-normal'>Curug Sangereng, Klp. Dua, Tangerang, </h3>
                  <h3 className='fw-normal'>Banten Kode Pos : 15310 </h3>
                  <h3 className='fw-normal'> Telp: (021) 54217373</h3>
                </div>
              </div>
            </div>

            <div className='payment-request'>
              <h1 className='fw-bolder'>INVOICE</h1>

              <h3 className='fw-bolder'>
                Tanggal : <span className='fw-normal'>16/3/2023</span>
              </h3>

              <h3 className='fw-bolder'>
                Quotation ID : <span className='fw-normal'>897983245</span>
              </h3>

              <h3 className='fw-bolder'>
                Costumer ID : <span className='fw-normal'>121768</span>
              </h3>
            </div>
          </div>

          <div className='invoice-detail d-flex justify-content-between'>
            <div className='receiver-information'>
              <div className='receiver-detail'>
                <h1 className='fw-bolder'>Ditunjukkan kepada :</h1>
                <h1 className='fw-bolder'>Mitra 10 BSD</h1>
              </div>

              <div className='address'>
                <h3 className='fw-normal'>Jalan Gading Serpong Boulevard Blok Mitra10</h3>
                <h3 className='fw-normal'>Curug Sangereng, Klp. Dua, Tangerang, </h3>
                <h3 className='fw-normal'>Banten Kode Pos : 15310 </h3>
                <h3 className='fw-normal'> Telp: (021) 54217373</h3>
              </div>
            </div>

            <div className='payment-request'>
              <h3 className='fw-bolder'>
                Quotation valid until : <span className='fw-normal'>21/3/2023</span>
              </h3>

              <h3 className='fw-bolder'>
                Instruksi spesial : <span className='fw-normal'>Tidak ada</span>
              </h3>
            </div>
          </div>

          <div className='detail-table'>
            <Table hover>
              <thead>
                <tr>
                  <th className='text-center'>Item</th>
                  <th className='text-center'>Harga Satuan</th>
                  <th className='text-center'>Jumlah</th>
                  <th className='text-center'>Total Harga</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Instalasi AC</td>
                  <td>500.000</td>
                  <td>1</td>
                  <td>500.000</td>
                </tr>
                <tr>
                  <td>Pipa AC</td>
                  <td>50.000</td>
                  <td>16</td>
                  <td>800.000</td>
                </tr>
                <tr>
                  <td>Pipa Paralon</td>
                  <td>50.000</td>
                  <td>10</td>
                  <td>500.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Total
                  </td>
                  <td className=' fw-bolder'>1.800.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Tax (11%)
                  </td>
                  <td className=' fw-bolder'>198.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Discount (8%)
                  </td>
                  <td className=' fw-bolder'>-144.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Grand Total
                  </td>
                  <td className=' fw-bolder'>1.854.000</td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className='payment-detail'>
            <div className='payment-method'>
              <h1 className='fw-bolder'>Silahkan melakukan pembayaran di account di bawah ini :</h1>

              <h3 className='fw-normal'>BANK BCA</h3>
              <h3 className='fw-normal'>PT.MITRA10</h3>
              <h3 className='fw-normal'>123-876-90</h3>
            </div>

            <div className='payment-evidence'>
              <h1 className='fw-bolder'>Silahkan kirim bukti bayar anda melalui:</h1>
              <h1 className='fw-bolder'>WA: 0813748392</h1>
              <h1 className='fw-bolder'>Email: Installation.support@mitra10.com</h1>
            </div>

            <h1 className='fw-bolder'>
              Terima kasih telah melakukan bisnis dengan Mitra10. Kami harap kedatangan anda
              kembali.
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}

export {DetailInvoiceVendor}
