import React from 'react'

import './ViewReportTukang.css'

import {Link} from 'react-router-dom'
import {Row, Col, Card} from 'react-bootstrap'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

const ViewReportTukang = () => {
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
          <div className='work-reports mb-5'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>LAPORAN PENGERJAAN</h1>
            </div>

            <Row>
              <Col md={4}>
                <Link to={`/reports/tukang-report-claim-garansi`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('claim-garansi', 'Laporan Total Penalti')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col md={4}>
                <Link to={`/reports/tukang-report-complaint`}>
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
                <Link to={`/reports/tukang-report-on-progress`}>
                  <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                    <Card.Body className='d-flex justify-content-left align-items-center'>
                      <img
                        className='m-2'
                        alt=''
                        src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                        width={50}
                        height={50}
                      />

                      {newTabs('on-progress', 'Laporan Pengerjaan')}
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Link to={`/reports/tukang-report-reschedule`}>
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

export {ViewReportTukang}
