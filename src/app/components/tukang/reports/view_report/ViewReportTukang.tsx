import React from 'react'

import './ViewReportTukang.css'

import {useNavigate} from 'react-router-dom'
import {Row, Col, Card} from 'react-bootstrap'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

const ViewReportTukang = () => {
  const navigate = useNavigate()

  const goToReport = (reportType: string) => {
    navigate(`/reports/tukang-report-${reportType}`)
  }

  const newTabs = (reportType: string, label: string) => {
    return (
      <a className='fs-3 fw-normal text-black' href={`/reports/tukang-report-${reportType}`}>
        {label}
      </a>
    )
  }

  return (
    <section id='view-report-tukang'>
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

                    {newTabs('refund', 'Laporan Penalty')}
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

                    {newTabs('pending-payment', 'Laporan Pending Payment')}
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

                    {newTabs('tagihan-bulanan', 'Laporan tagihan bulanan')}
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

                    {newTabs('paid', 'Laporan tagihan dibayar')}
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

                    {newTabs('unpaid', 'Laporan tagihan belum dibayar')}
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

                    {newTabs('quotation', 'Laporan Quotation (omset)')}
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

                    {newTabs('survey', 'Laporan Survey (omset)')}
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

                    {newTabs('transaksi-all', 'Laporan Transaksi All (omset)')}
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

                    {newTabs('tagihan-bulanan', 'Laporan tagihan bulanan')}
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

                    {newTabs('paid', 'Laporan tagihan dibayar')}
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

                    {newTabs('unpaid', 'Laporan tagihan belum dibayar')}
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

                    {newTabs('quotation', 'Laporan Quotation')}
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

export {ViewReportTukang}
