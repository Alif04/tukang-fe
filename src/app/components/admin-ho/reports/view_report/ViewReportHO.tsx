import React from 'react'

import './ViewReportHO.css'

import {useNavigate} from 'react-router-dom'
import {Row, Col, Card} from 'react-bootstrap'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

const ViewReportHO = () => {
  const navigate = useNavigate()

  const goToReport = (reportType: string) => {
    navigate(`/reports/ho-report-${reportType}`)
  }

  const newTabs = (reportType: string, label: string) => {
    return (
      <a className='fs-3 fw-normal text-black' href={`/reports/ho-report-${reportType}`}>
        {label}
      </a>
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
                <Card
                  className='content-card border-green'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('claim-voucher')}
                >
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
              </Col>

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

                    {newTabs('expense-promosi', 'Laporan Expense Promosi')}
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

                    {newTabs('other-income', 'Laporan Other Income')}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
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

                    {newTabs('refund', 'Laporan Refund')}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('total-penalty')}
                >
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
              </Col>

              <Col md={4}></Col>
            </Row>
          </div>

          <div className='csi-reports mb-5'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>CSI Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('csi-unrespon')}
                >
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
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('unsent-csi')}
                >
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
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-green'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('csi-responded')}
                >
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
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Card
                  className='content-card border-green'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('csi')}
                >
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
              </Col>

              <Col md={4}></Col>

              <Col md={4}></Col>
            </Row>
          </div>

          <div className='insentive-reports mb-5'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>Insentive Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('insentive-unpaid')}
                >
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
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-green'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('insentive-paid')}
                >
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
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-green'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('complete-order')}
                >
                  <Card.Body className='d-flex  justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />

                    {newTabs('complete-order', 'Laporan Order komplit')}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('uncomplete-order')}
                >
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />

                    {newTabs('uncomplete-order', 'Laporan Order tidak komplit')}
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
                  className='content-card border-green'
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

                    {newTabs('quotation', 'Laporan Quotation ( Omset )')}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-green'
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

                    {newTabs('survey', 'Laporan Survey ( Omset )')}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-green'
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

                    {newTabs('transaksi-all', 'Laporan Transaksi All ( Omset )')}
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

                    {newTabs('pending-payment', 'Laporan Pending Payment')}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card
                  className='content-card border-yellow'
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

                    {newTabs('unpaid', 'Laporan Tagihan Belum Dibayar')}
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

                    {newTabs('tagihan-bulanan', 'Laporan Tagihan Bulanan')}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
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

                    {newTabs('paid', 'Laporan Tagihan Dibayar')}
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

                    {newTabs('claim-garansi', 'Laporan Garansi')}
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

                    {newTabs('on-progress', 'Laporan On Progress')}
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

                    {newTabs('complaint', 'Laporan Pengaduan')}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Card
                  className='content-card border-red'
                  style={{cursor: 'pointer'}}
                  onClick={() => goToReport('pending-payment')}
                >
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

                    {newTabs('reschedule', 'Laporan Reschedule')}
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

export {ViewReportHO}
