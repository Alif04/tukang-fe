/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {Card, Row, Col} from 'react-bootstrap'
import './MoreInformation.css'

type Props = {
  className: string
  totalComplaint: number
  totalResurvey: number
  totalRework: number
  totalReschedule: number
  totalRefund: number
  totalCancel: number
}

const renderStat = (value: number, label: string) => (
  <Col className='pt-5 pb-5'>
    <h1 className='fw-normal text-center' style={{fontSize: '25px'}}>
      {value}
    </h1>
    <p className='fs-6 text-danger text-center mt-1 mb-1'>{label}</p>
  </Col>
)

const MoreInformation: React.FC<Props> = ({
  className,
  totalComplaint,
  totalRework,
  totalResurvey,
  totalReschedule,
  totalCancel,
  totalRefund,
}) => {
  return (
    <section id='more-information-vendor'>
      <Card className={`${className}`} id='more-information'>
        <Card.Body>
          <Row className='mb-5'>
            <div className='fs-1 text-gray-800'>Informasi Lainnya</div>

            <Row>
              {renderStat(totalComplaint, 'COMPLAINT')}
              {renderStat(totalCancel, 'CANCEL')}
            </Row>

            <Row>
              {renderStat(totalResurvey, 'RESURVEY')}
              {renderStat(totalRework, 'REWORK')}
            </Row>

            <Row>
              {renderStat(totalReschedule, 'RESCHEDULE')}
              {renderStat(totalRefund, 'REFUND')}
            </Row>
          </Row>
        </Card.Body>
      </Card>
    </section>
  )
}

export {MoreInformation}
