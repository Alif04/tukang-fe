/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {Card, Row, Col} from 'react-bootstrap'
import './MoreInformation.css'

type Props = {
  className: string
  totalAssign: number
  totalResolve: number
  totalUnAssign: number

}

const renderStat = (value: number, label: string) => (
<Col className='pt-5 pb-5 d-flex flex-row align-items-center justify-content-between'>
  <p className='fs-6 text-danger mt-1 mb-1 flex-grow-1'>{label}</p>
  <h1 className='fw-normal' style={{ fontSize: '25px' }}>
    {value}
  </h1>
</Col>
)

const MoreInformation: React.FC<Props> = ({
  className,
  totalUnAssign,
  totalResolve,
  totalAssign
}) => {
  return (
    <section id='more-information-vendor'>
      <Card className={`${className}`} id='more-information'>
        <Card.Body>
          <Row className='mb-5'>
            <div className='fs-1 text-gray-800'>Conversation Status</div>

            <Row className='justify-content-start'>
              {renderStat(totalUnAssign, 'Unassigned')}
            </Row>

            <Row className='justify-content-start'>
              {renderStat(totalAssign, 'Assigned')}
            </Row>

            <Row className='justify-content-start'>
              {renderStat(totalResolve, 'Resolved')}
            </Row>
          </Row>
        </Card.Body>
      </Card>
    </section>
  )
}

export {MoreInformation}
