/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import './MoreInformation.css'

import {Row, Col} from 'react-bootstrap'

type Props = {
  className: string
  totalComplaint: number
  totalCancel: number
  totalResurvey: number
  totalRework: number
  totalActiveWarranty: number
  totalExpiredWarranty: number
}

const renderStat = (value: number, label: string, className: string) => (
  <Col className='pt-5 pb-5'>
    <h1 className='fw-normal text-center' style={{fontSize: '25px'}}>
      {value}
    </h1>
    <p className={className}>{label}</p>
  </Col>
)

const MoreInformation: React.FC<Props> = ({
  className,
  totalComplaint,
  totalCancel,
  totalResurvey,
  totalRework,
  totalActiveWarranty,
  totalExpiredWarranty,
}) => {
  return (
    <div className={`card ${className}`} id='more-information'>
      <div className='card-body'>
        <Row>
          {renderStat(
            totalActiveWarranty,
            'GARANSI AKTIF',
            'fs-6 text-black text-center mt-1 mb-1'
          )}

          {renderStat(
            totalExpiredWarranty,
            'GARANSI EXPIRED',
            'fs-6 text-black text-center mt-1 mb-1'
          )}
        </Row>

        <Row>
          {renderStat(totalComplaint, 'COMPLAINT', 'fs-6 text-danger text-center mt-1 mb-1')}
          {renderStat(totalCancel, 'CANCEL', 'fs-6 text-danger text-center mt-1 mb-1')}
        </Row>

        <Row>
          {renderStat(totalResurvey, 'RESURVEY', 'fs-6 text-danger text-center mt-1 mb-1')}
          {renderStat(totalRework, 'REWORK', 'fs-6 text-danger text-center mt-1 mb-1')}
        </Row>
      </div>
    </div>
  )
}

export {MoreInformation}
