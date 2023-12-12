import React from 'react'

import './ViewReportHO.css'

import {useNavigate} from 'react-router-dom'
import {Row, Col, Card} from 'react-bootstrap'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

const ViewReportHO = () => {
  const navigate = useNavigate()

  const goToReport = (reportType: string) => {
    navigate(`/reports/ho/report-${reportType}`)
  }

  return (
    <section id='view-report-ho'>
      <Card>
        <Card.Body>
          <div className='sales-reports'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>Sales Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex  justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Transaksi All ( Omset )</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Survey ( Omset )</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Quotation ( Omset )</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          <div className='work-reports'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>Work Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex  justify-content-left align-items-center'>
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
                <Card className='content-card' style={{cursor: 'pointer'}}>
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

              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
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
            </Row>

            <Row>
              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Complain</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
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

              <Col md={4}></Col>
            </Row>
          </div>

          <div className='additional-reports'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>Additional Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
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
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Refund</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
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
            </Row>

            <Row>
              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Total Penalty</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Claim Voucher</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}></Col>
            </Row>
          </div>

          <div className='tagihan-reports'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>Tagihan Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex  justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Tagihan Bulanan</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
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
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Tagihan Dibayar</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Tagihan Belum Dibayar</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}></Col>

              <Col md={4}></Col>
            </Row>
          </div>

          <div className='csi-reports'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>CSI Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex  justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan CSI terkirim</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan CSI belum terkirim</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan CSI direspon</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan CSI belum direspon</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}></Col>

              <Col md={4}></Col>
            </Row>
          </div>

          <div className='insentive-reports'>
            <div className='title'>
              <hr />

              <h1 className='fs-1 fw-bolder text-uppercase text-dark'>Insentive Reports</h1>
            </div>

            <Row>
              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex  justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Order komplit</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Order tidak komplit</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Insentive dibayar</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Card className='content-card' style={{cursor: 'pointer'}}>
                  <Card.Body className='d-flex justify-content-left align-items-center'>
                    <img
                      className='m-2'
                      alt=''
                      src={toAbsoluteUrl('/media/tukangin/folder-icon.png')}
                      width={50}
                      height={50}
                    />
                    <div className='fs-3 fw-normal'>Laporan Insentive belum dibayar</div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}></Col>

              <Col md={4}></Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {ViewReportHO}
