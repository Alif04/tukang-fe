/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {Row, Col} from 'react-bootstrap'

import './MoreInformation.css'

type Props = {
  className: string
  totalComplaint: number
  totalReschedule: number
  totalCancel: number
  totalRefund: number
  totalRework: number
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
  totalReschedule,
  totalCancel,
  totalRefund,
  totalRework,
}) => {
  return (
    <section id='more-information-ho'>
      <div className={`card ${className}`} id='more-information'>
        <div className='card-body'>
          <Row className='mb-5'>
            <div className='fs-1 text-gray-800'>Informasi Lainnya</div>

            <Row>
              {renderStat(totalComplaint, 'COMPLAINT')}
              {renderStat(totalReschedule, 'RESCHEDULE')}
              {renderStat(totalCancel, 'CANCEL')}
            </Row>

            <Row>
              {renderStat(totalRefund, 'REFUND')}
              {renderStat(totalRework, 'REWORK')}
              <Col className='hidden-column pt-5 pb-5'></Col>
            </Row>
          </Row>
        </div>
      </div>
    </section>
  )
}

export {MoreInformation}
