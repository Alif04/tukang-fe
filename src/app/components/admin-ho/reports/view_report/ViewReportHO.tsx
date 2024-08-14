import React from 'react'

import './ViewReportHO.css'

import {Link} from 'react-router-dom'
import {Row, Col, Card} from 'react-bootstrap'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

const ViewReportHO = () => {
  const newTabs = (reportType: string, label: string) => {
    return (
      <Link className='fs-3 fw-normal text-black' to={`/reports/ho-report-${reportType}`}>
        {label}
      </Link>
    )
  }

  return (
    <section id='view-report-ho'>
      <Card>
        <Card.Body>
          <div className='additional-reports mb-5'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>Additional Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Link to={`/reports/ho-report-expense-promosi`}>
                  <Card className='content-card border-red' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex  justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('expense-promosi', 'Laporan Expense Promosi')}
                    </Card.Body>
                  </Card>
                </Link>

                {/* <Link to={`/reports/ho-report-claim-voucher`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('claim-voucher', 'Laporan Claim Voucher')}
                    </Card.Body>
                  </Card>
                </Link> */}
              </Col>

              <Col md={4}>
                <Link to={`/reports/ho-report-refund`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('refund', 'Laporan Refund')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}>
                {/* <Link to={`/reports/ho-report-other-income`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('other-income', 'Laporan Other Income')}
                    </Card.Body>
                  </Card>
                </Link> */}

                <Link to={`/reports/ho-report-total-penalty`}>
                  <Card className='content-card border-red' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('total-penalty', 'Laporan Total Penalty')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                {/* <Link to={`/reports/ho-report-refund`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('refund', 'Laporan Refund')}
                    </Card.Body>
                  </Card>
                </Link> */}
              </Col>

              <Col md={4}>
                {/* <Link to={`/reports/ho-report-total-penalty`}>
                  <Card className='content-card border-red' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('total-penalty', 'Laporan Total Penalty')}
                    </Card.Body>
                  </Card>
                </Link> */}
              </Col>

              <Col md={4}></Col>
            </Row>
          </div>

          {/* <div className='csi-reports mb-5'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>CSI Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Link to={`/reports/ho-report-csi-unrespon`}>
                  <Card className='content-card border-red' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('csi-unrespon', 'Laporan CSI belum direspon')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}>
                <Link to={`/reports/ho-report-unsent-csi`}>
                  <Card className='content-card border-red' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('unsent-csi', 'Laporan CSI belum terkirim')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}>
                <Link to={`/reports/ho-report-csi`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex  justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('csi', 'Laporan CSI terkirim')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
              
              <Col md={4}>
                <Link to={`/reports/ho-report-csi-responded`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('csi-responded', 'Laporan CSI direspon')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Link to={`/reports/ho-report-csi`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex  justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('csi', 'Laporan CSI terkirim')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}></Col>

              <Col md={4}></Col>
            </Row>
          </div> */}

          <div className='insentive-reports mb-5'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>Insentive Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Link to={`/reports/ho-report-insentive-unpaid`}>
                  <Card className='content-card border-red' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('insentive-unpaid', 'Laporan Insentive belum dibayar')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}>
                <Link to={`/reports/ho-report-insentive-paid`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('insentive-paid', 'Laporan Insentive dibayar')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}>
                <Link to={`/reports/ho-report-complete-order`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex  justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('complete-order', 'Laporan Order Selesai')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                {/* <Link to={`/reports/ho-report-uncomplete-order`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex  justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('uncomplete-order', 'Laporan Order Belum Selesai')}
                    </Card.Body>
                  </Card>
                </Link> */}
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
                <Link to={`/reports/ho-report-quotation`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('quotation', 'Laporan Quotation ( Omset )')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}>
                <Link to={`/reports/ho-report-survey`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('survey', 'Laporan Survey ( Omset )')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}>
                <Link to={`/reports/ho-report-transaksi-all`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('transaksi-all', 'Laporan Transaksi All ( Omset )')}
                    </Card.Body>
                  </Card>
                </Link>
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
                <Link to={`/reports/ho-report-pending-payment`}>
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
                <Link to={`/reports/ho-report-unpaid`}>
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

              <Col md={4}>
                <Link to={`/reports/ho-report-tagihan-bulanan`}>
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
            </Row>

            <Row>
              <Col md={4}>
                <Link to={`/reports/ho-report-paid`}>
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
                <Link to={`/reports/ho-report-claim-garansi`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('claim-garansi', 'Laporan Garansi')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}>
                <Link to={`/reports/ho-report-on-progress`}>
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

              <Col md={4}>
                <Link to={`/reports/ho-report-complaint`}>
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
            </Row>

            <Row>
              <Col md={4}>
                <Link to={`/reports/ho-report-reschedule`}>
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
                {/* <Link to={`/reports/ho-report-pending-payment`}>
                  <Card className='content-card border-red' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex  justify-content-left align-items-center'>
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
                </Link> */}
              </Col>

              <Col md={4}>
                {/* <Link to={`/reports/ho-report-reschedule`}>
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
                </Link> */}
              </Col>

              <Col md={4}></Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {ViewReportHO}
