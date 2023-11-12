import React from 'react'

import './ViewReport.css'

import {useNavigate} from 'react-router-dom'
import {Row, Col, Card} from 'react-bootstrap'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

const ViewReportStore = () => {
  const navigate = useNavigate()

  const goToReport = (reportType: string) => {
    navigate(`/reports/report-${reportType}`)
  }

  return (
    <section id='view-report'>
      <Card>
        <Card.Body>
          <Row className='row-1'>
            <Col>
              <Card
                className='content-card'
                onClick={() => goToReport('total-order')}
                style={{cursor: 'pointer'}}
              >
                <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                  <img
                    alt=''
                    src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                    width={50}
                    height={50}
                  />
                  <div className='fs-3 fw-normal'>Total Order</div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card
                className='content-card'
                onClick={() => goToReport('pending-survey')}
                style={{cursor: 'pointer'}}
              >
                <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                  <img
                    alt=''
                    src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                    width={50}
                    height={50}
                  />

                  <div className='fs-3 fw-normal'>Pending Survey</div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card
                className='content-card'
                onClick={() => goToReport('survey')}
                style={{cursor: 'pointer'}}
              >
                <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                  <img
                    alt=''
                    src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                    width={50}
                    height={50}
                  />

                  <div className='fs-3 fw-normal'>Survey</div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card
                className='content-card'
                onClick={() => goToReport('pending-quotation')}
                style={{cursor: 'pointer'}}
              >
                <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                  <img
                    alt=''
                    src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                    width={50}
                    height={50}
                  />

                  <div className='fs-3 fw-normal'>Pending Quotation</div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card
                className='content-card'
                onClick={() => goToReport('pending-bayar')}
                style={{cursor: 'pointer'}}
              >
                <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                  <img
                    alt=''
                    src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                    width={50}
                    height={50}
                  />

                  <div className='fs-3 fw-normal'>Pending Bayar</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className='row-2'>
            <Col>
              <Card
                className='content-card'
                onClick={() => goToReport('on-progress')}
                style={{cursor: 'pointer'}}
              >
                <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                  <img
                    alt=''
                    src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                    width={50}
                    height={50}
                  />

                  <div className='fs-3 fw-normal'>On Progress</div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card
                className='content-card'
                onClick={() => goToReport('complete')}
                style={{cursor: 'pointer'}}
              >
                <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                  <img
                    alt=''
                    src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                    width={50}
                    height={50}
                  />

                  <div className='fs-3 fw-normal'>Complete</div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card
                className='content-card'
                onClick={() => goToReport('reschedule')}
                style={{cursor: 'pointer'}}
              >
                <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                  <img
                    alt=''
                    src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                    width={50}
                    height={50}
                  />

                  <div className='fs-3 fw-normal'>Reschedule</div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card
                className='content-card'
                onClick={() => goToReport('cancel')}
                style={{cursor: 'pointer'}}
              >
                <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                  <img
                    alt=''
                    src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                    width={50}
                    height={50}
                  />

                  <div className='fs-3 fw-normal'>Cancel</div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card
                className='content-card'
                onClick={() => goToReport('refund')}
                style={{cursor: 'pointer'}}
              >
                <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                  <img
                    alt=''
                    src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                    width={50}
                    height={50}
                  />

                  <div className='fs-3 fw-normal'>Refund</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </section>
  )
}

export {ViewReportStore}
