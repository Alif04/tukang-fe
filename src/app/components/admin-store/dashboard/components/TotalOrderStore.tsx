/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {Card, Row, Col} from 'react-bootstrap'

type Props = {
  className: string
  totalOrders: number
  totalComplete: number
  totalProgress: number
  totalCancel: number
  totalRefund: number
}

const TotalOrderStore: React.FC<Props> = ({
  className,
  totalOrders,
  totalComplete,
  totalProgress,
  totalCancel,
  totalRefund,
}) => {
  return (
    <Card className={`${className}`}>
      <Card.Body>
        <Row>
          <Col
            className='d-flex justify-content-center align-items-center'
            xxl={6}
            xl={6}
            lg={6}
            md={12}
          >
            <div className='d-flex flex-column gap-4'>
              <div className='fs-5 text-center text-dark text-muted'>Jumlah Order</div>
              <div className='fs-1 text-center'>{totalOrders}</div>
            </div>
          </Col>

          <Col xxl={6} xl={6} lg={6} md={12}>
            <ul>
              <li>Complete : {totalComplete}</li>
              <li>Progress : {totalProgress}</li>
              <li>Cancel : {totalCancel}</li>
              <br></br>
              <li>Refund : {totalRefund}</li>
            </ul>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export {TotalOrderStore}
