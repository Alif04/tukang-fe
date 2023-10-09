import React, {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './NewQuotation.css'

import {Form, Table, Button, Row, Col} from 'react-bootstrap'

const NewQuotationVendor: FC = () => {
  return (
    <section id='new-quotation'>
      <div className='card'>
        <div className='card-body'>
          <Row className='mb-4'>
            <Col xxl={6} className='vendor-information'>
              <div className='vendor-detail'>
                <img
                  alt='Logo'
                  className='h-50px logo mb-3'
                  src={toAbsoluteUrl('/media/auth/logo-mitra.png')}
                />

                <Form.Group className='w-100'>
                  <Form.Label>Nama Toko</Form.Label>
                  <Form.Select>
                    <option value='1'>Mitra 10 - BSD</option>
                    <option value='2'>Mitra 10 - Fatmawati</option>
                    <option value='3'>Mitra 10 - Bandung</option>
                    <option value='4'>Mitra 10 - Jogja</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </Col>

            <Col xxl={6} className='payment-request'>
              <h1 className='fw-bolder'>QUOTATION</h1>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5' column sm='4'>
                  Tanggal :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control type='date' />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5' column sm='4'>
                  Quotation ID :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control type='number' />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5' column sm='4'>
                  Costumer ID :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control type='number' />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='mb-4'>
                <Form.Label className='fs-5' column sm='4'>
                  Quotation Valid Until :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control type='date' />
                </Col>
              </Form.Group>
            </Col>
          </Row>

          <Row className='mb-4'>
            <Col xxl={6}>
              <div className='receiver-information'>
                <div className='receiver-detail'>
                  <h1 className='fw-bolder'>Ditunjukkan kepada :</h1>
                  <h1 className='fw-bolder'>Ibu Ami</h1>
                </div>

                <div className='address'>
                  <h3 className='fw-normal'>Jalan Gading Serpong Boulevard Blok Mitra10</h3>
                  <h3 className='fw-normal'>Curug Sangereng, Klp. Dua, Tangerang, </h3>
                  <h3 className='fw-normal'>Banten Kode Pos : 15310 </h3>
                  <h3 className='fw-normal'> Telp: (021) 54217373</h3>
                </div>
              </div>
            </Col>

            <Col xxl={6}>
              <div className='payment-request'>
                <Form.Group>
                  <Form.Label className='fs-5'>Instruksi Spesial</Form.Label>
                  <Form.Control as='textarea' />
                </Form.Group>
              </div>
            </Col>
          </Row>

          <div className='detail-table-jasa'>
            <Table hover>
              <thead>
                <tr>
                  <th className='text-center'>Jenis Jasa</th>
                  <th className='text-center'>Quantity</th>
                  <th className='text-center'>Harga Satuan</th>
                  <th className='text-center'>Total Harga</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Instalasi AC</td>
                  <td>1</td>
                  <td>500.000</td>
                  <td>500.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Total Jasa
                  </td>
                  <td className=' fw-bolder'>1.800.000</td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className='detail-table-material'>
            <Table hover>
              <thead>
                <tr>
                  <th className='text-center'>Material Yang Dibutuhkan</th>
                  <th className='text-center'>Quantity</th>
                  <th className='text-center'>Harga Satuan</th>
                  <th className='text-center'>Total Harga</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Instalasi AC</td>
                  <td>1</td>
                  <td>500.000</td>
                  <td>500.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Total Material
                  </td>
                  <td className=' fw-bolder'>1.800.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Total Jasa & Material
                  </td>
                  <td className=' fw-bolder'>1.800.000</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Promosi ( Free Survey )
                  </td>
                  <td className=' fw-bolder'></td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bolder'>
                    Additional Promosi
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

          <div className='d-flex justify-content-center'>
            <Button variant='dark-primary'>Save & Email</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {NewQuotationVendor}
