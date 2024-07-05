import React from 'react'

import './ViewReport.css'

import {Link} from 'react-router-dom'
import {Row, Col, Card} from 'react-bootstrap'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

const ViewReportStore = () => {
  const newTabs = (reportType: string, label: string) => {
    return (
      <Link className='fs-3 fw-normal text-black' to={`/reports/report-${reportType}`}>
        {label}
      </Link>
    )
  }

  return (
    <section id='view-report'>
      <Card>
        <Card.Body>
          <Row className='row-1'>
            <Col>
              <Link to={`/reports/report-total-order`}>
                <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />

                    {newTabs('total-order', 'Total Order')}
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col>
              <Link to={`/reports/report-pending-survey`}>
                <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />

                    {newTabs('pending-survey', 'Permintaan Survei')}
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col>
              <Link to={`/reports/report-survey`}>
                <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />

                    {newTabs('survey', 'Survei Dimulai')}
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col>
              <Link to={`/reports/report-pending-quotation`}>
                <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />

                    {newTabs('pending-quotation', 'Quotation dikirim ke konsumen')}
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col>
              <Link to={`/reports/report-pending-bayar`}>
                <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />

                    {newTabs('pending-bayar', 'Menunggu bayar receipt')}
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>

          <Row className='row-2'>
            <Col>
              <Link to={`/reports/report-on-progress`}>
                <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />

                    {newTabs('on-progress', 'Sedang Pengerjaan')}
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col>
              <Link to={`/reports/report-complete`}>
                <Card className='content-card border-green' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />

                    {newTabs('complete', 'Order Selesai')}
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col>
              <Link to={`/reports/report-reschedule`}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                    <img
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />

                    {newTabs('reschedule', 'Reschedule')}
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col>
              <Link to={`/reports/report-cancel`}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                    <img
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />

                    {newTabs('cancel', 'Cancel')}
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col>
              <Link to={`/reports/report-refund`}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                    <img
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />

                    {newTabs('refund', 'Refund')}
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </section>
  )
}

export {ViewReportStore}
