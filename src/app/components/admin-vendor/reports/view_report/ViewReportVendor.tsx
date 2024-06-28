import React from 'react'

import './ViewReportVendor.css'

import {Link} from 'react-router-dom'
import {Row, Col, Card} from 'react-bootstrap'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

const ViewReportVendor = () => {
  const newTabs = (reportType: string, label: string) => {
    return (
      <Link className='fs-3 fw-normal text-black' to={`/reports/vendor-report-${reportType}`}>
        {label}
      </Link>
    )
  }

  return (
    <section id='view-report-vendor'>
      <Card>
        <Card.Body>
          <div className='pembayaran-reports mb-5'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>LAPORAN PEMBAYARAN</h1>
            </div>

            <Row>
              <Col md={4}>
                <Link to={`/reports/vendor-report-pending-payment`}>
                  <Card className='content-card border-yellow' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('pending-payment', 'Laporan Pending Payment')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}>
                <Link to={`/reports/vendor-report-tagihan-bulanan`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex  justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('tagihan-bulanan', 'Laporan Tagihan Bulanan')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}>
                <Link to={`/reports/vendor-report-paid`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('paid', 'Laporan Tagihan Dibayar')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Link to={`/reports/vendor-report-unpaid`}>
                  <Card className='content-card border-yellow' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('unpaid', 'Laporan Tagihan Belum Dibayar')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}></Col>

              <Col md={4}></Col>
            </Row>
          </div>

          <div className='work-reports mb-5'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>LAPORAN PENGERJAAN</h1>
            </div>

            <Row>
              <Col md={4}>
                <Link to={`/reports/vendor-report-claim-garansi`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('claim-garansi', 'Laporan Penalti')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}>
                <Link to={`/reports/vendor-report-complaint`}>
                  <Card className='content-card border-red' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('complaint', 'Laporan Pengaduan')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}>
                <Link to={`/reports/vendor-report-on-progress`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('on-progress', 'Laporan On Progress')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Link to={`/reports/vendor-report-quotation`}>
                  <Card className='content-card border-red' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex  justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('quotation', 'Laporan Quotation')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}>
                <Link to={`/reports/vendor-report-reschedule`}>
                  <Card className='content-card border-red' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex  justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('reschedule', 'Laporan Reschedule')}
                    </Card.Body>
                  </Card>
                </Link>
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
