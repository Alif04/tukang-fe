/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {Row, Col} from 'react-bootstrap'

import './MoreInformation.css'

type Props = {
  className: string
  orderData: any[]
}

const getStatusCount = (orderData: any[], status: string): number => {
  return orderData.filter((order) => order.status.category === status).length
}

const MoreInformation: React.FC<Props> = ({className, orderData}) => {
  return (
    <section id='more-information-ho'>
      <div className={`card ${className}`} id='more-information'>
        <div className='card-body'>
          <Row className='mb-5'>
            <div className='fs-1 text-gray-800'>Informasi Lainnya</div>

            <Col className='pt-5 pb-5'>
              <h1 className='fw-normal text-center' style={{fontSize: '25px'}}>
                {getStatusCount(orderData, 'INVESTIGATED')}
              </h1>
              <p className='fs-6 text-danger text-center mt-1 mb-1'>COMPLAINT</p>
            </Col>

            <Col className='pt-5 pb-5'>
              <h1 className='fw-normal text-center' style={{fontSize: '25px'}}>
                {getStatusCount(orderData, 'RESCHEDULE')}
              </h1>
              <p className='fs-6 text-danger text-center mt-1 mb-1'>RESCHEDULE</p>
            </Col>

            <Col className='pt-5 pb-5'>
              <h1 className='fw-normal text-center' style={{fontSize: '25px'}}>
                {getStatusCount(orderData, 'REJECTED')}
              </h1>
              <p className='fs-6 text-danger text-center mt-1 mb-1'>CANCEL</p>
            </Col>

            <Col className='pt-5 pb-5'>
              <h1 className='fw-normal text-center' style={{fontSize: '25px'}}>
                {getStatusCount(orderData, 'REFUND')}
              </h1>
              <p className='fs-6 text-danger text-center mt-1 mb-1'>REFUND</p>
            </Col>

            <Col className='pt-5 pb-5'>
              <h1 className='fw-normal text-center' style={{fontSize: '25px'}}>
                {getStatusCount(orderData, 'REWORK')}
              </h1>
              <p className='fs-6 text-danger text-center mt-1 mb-1'>REVISIT</p>
            </Col>

            <Col className='pt-5 pb-5'>
              <h1 className='fw-normal text-center' style={{fontSize: '25px'}}>
                {getStatusCount(orderData, 'REWORK')}
              </h1>
              <p className='fs-6 text-danger text-center mt-1 mb-1'>REWORK</p>
            </Col>

            <Col className='pt-5 pb-5'>
              <h1 className='fw-normal text-center' style={{fontSize: '25px'}}>
                {getStatusCount(orderData, 'REWORKEND')}
              </h1>
              <p className='fs-6 text-success text-center mt-1 mb-1'>RESOLVED</p>
            </Col>

            <Col className='hidden-column pt-5 pb-5'></Col>
          </Row>
        </div>
      </div>
    </section>
  )
}

export {MoreInformation}
