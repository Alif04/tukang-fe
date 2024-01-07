import React from 'react'

import './ViewReportVendor.css'

import {useNavigate} from 'react-router-dom'
import {Row, Col, Card} from 'react-bootstrap'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

const ViewReportVendor = () => {
  const navigate = useNavigate()

  const goToReport = (reportType: string) => {
    navigate(`/reports/vendor-report-${reportType}`)
  }

  return (
    <section id='view-report-vendor'>
      <Card>
        <Card.Body>
          <div className='additional-reports mb-5'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>Additional Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('expense-promosi')}
                >
                  <Card.Body className='d-flex  justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Expense Promosi</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-green'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('other-income')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Other Income</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-green'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('refund')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Penalty atas Refund</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          <div className='pembayaran-reports mb-5'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>Pembayaran Tukang Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Card
                  className='content-card border-yellow'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('pending-payment')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Pending Payment</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-green'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('tagihan-bulanan')}
                >
                  <Card.Body className='d-flex  justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan tagihan bulanan</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-green'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('paid')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan tagihan dibayar</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('unpaid')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan tagihan belum dibayar</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}></Col>

              <Col md={4}></Col>
            </Row>
          </div>

          <div className='sales-reports mb-5'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>Sales Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('quotation')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Quotation (omset)</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('survey')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Survey (omset)</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('transaksi-all')}
                >
                  <Card.Body className='d-flex  justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Transaksi All (omset)</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          <div className='tagihan-reports mb-5'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>Tagihan Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Card
                  className='content-card border-yellow'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('pending-payment')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Pending Payment</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-green'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('tagihan-bulanan')}
                >
                  <Card.Body className='d-flex  justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan tagihan bulanan</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-green'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('paid')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan tagihan dibayar</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('unpaid')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan tagihan belum dibayar</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}></Col>

              <Col md={4}></Col>
            </Row>
          </div>

          <div className='work-reports mb-5'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>Work Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Card
                  className='content-card border-blue'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('claim-garansi')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Garansi</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('complaint')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Pengaduan</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-blue'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('on-progress')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan On Progress</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('quotation')}
                >
                  <Card.Body className='d-flex  justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Quotation</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('reschedule')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Reschedule</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}></Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {ViewReportVendor}
