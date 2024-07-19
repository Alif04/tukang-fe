/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {Row, Col} from 'react-bootstrap'

import './MoreInformation.css'

type Props = {
  className: string
  totalComplaint: number
  totalResurvey: number
  totalRework: number
  totalReschedule: number
  totalRefund: number
  totalCancel: number
  totalActiveWarranty: number
  totalUsedWarranty: number
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
  totalResurvey,
  totalRework,
  totalReschedule,
  totalRefund,
  totalCancel,
  totalActiveWarranty,
  totalUsedWarranty,
  totalExpiredWarranty,
}) => {
  return (
    <section id='more-information-ho'>
      <div className={`card ${className}`} id='more-information'>
        <div className='card-body'>
          <Row className='mb-5'>
            <div className='fs-1 text-gray-800'>Informasi Lainnya</div>

            <Row>
              {renderStat(totalComplaint, 'COMPLAINT', 'fs-6 text-danger text-center mt-1 mb-1')}
              {renderStat(totalResurvey, 'RESURVEY', 'fs-6 text-danger text-center mt-1 mb-1')}
              {renderStat(totalRework, 'REWORK', 'fs-6 text-danger text-center mt-1 mb-1')}
            </Row>

            <Row>
              {renderStat(totalReschedule, 'RESCHEDULE', 'fs-6 text-danger text-center mt-1 mb-1')}
              {renderStat(totalRefund, 'REFUND', 'fs-6 text-danger text-center mt-1 mb-1')}
              {renderStat(totalCancel, 'CANCEL', 'fs-6 text-danger text-center mt-1 mb-1')}
            </Row>

            <Row>
              {renderStat(
                totalActiveWarranty,
                'GARANSI AKTIF',
                'fs-6 text-black text-center mt-1 mb-1'
              )}

              {renderStat(
                totalUsedWarranty,
                'GARANSI TERPAKAI',
                'fs-6 text-black text-center mt-1 mb-1'
              )}

              {renderStat(
                totalExpiredWarranty,
                'GARANSI EXPIRED',
                'fs-6 text-black text-center mt-1 mb-1'
              )}
            </Row>
          </Row>
        </div>
      </div>
    </section>
  )
}

export {MoreInformation}
