/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import './MoreInformation.css'

type Props = {
  className: string
  orderData: any[]
}

const getStatusCount = (orderData: any[], status: string): number => {
  return orderData.filter((order) => order.status === status).length
}

const MoreInformation: React.FC<Props> = ({className, orderData}) => {
  return (
    <div className={`card ${className}`} id='more-information'>
      <div className='card-body'>
        <div className='row mb-5 h-50'>
          <div className='fs-1 text-gray-800'>Informasi Lainnya</div>

          <div className='col-xl-3 pt-5 pb-5'>
            <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
              {getStatusCount(orderData, 'INVESTIGATED')}
            </h1>
            <p className='fs-7 text-danger text-center mt-1 mb-1'>COMPLAINT</p>
          </div>

          <div className='col-xl-3 pt-5 pb-5'>
            <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
              {getStatusCount(orderData, 'RESCHEDULE')}
            </h1>
            <p className='fs-7 text-danger text-center mt-1 mb-1'>RESCHEDULE</p>
          </div>

          <div className='col-xl-3 pt-5 pb-5'>
            <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
              {getStatusCount(orderData, 'REJECTED')}
            </h1>
            <p className='fs-7 text-danger text-center mt-1 mb-1'>CANCEL</p>
          </div>

          <div className='col-xl-3 pt-5 pb-5'>
            <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
              {getStatusCount(orderData, 'REFUND')}
            </h1>
            <p className='fs-7 text-danger text-center mt-1 mb-1'>REFUND</p>
          </div>
        </div>

        <div className='row mt-5 h-50'>
          <div className='col-xl-3 pt-5 pb-5'>
            <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
              {getStatusCount(orderData, 'REWORK')}
            </h1>
            <p className='fs-7 text-danger text-center mt-1 mb-1'>REVISIT</p>
          </div>

          <div className='col-xl-3 pt-5 pb-5'>
            <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
              {getStatusCount(orderData, 'REWORK')}
            </h1>
            <p className='fs-7 text-danger text-center mt-1 mb-1'>REWORK</p>
          </div>

          <div className='col-xl-3 pt-5 pb-5'>
            <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
              {getStatusCount(orderData, 'REWORKEND')}
            </h1>
            <p className='text-success text-center mt-1 mb-1'>RESOLVE</p>
          </div>

          <div className='col-xl-3 pt-5 pb-5'></div>
        </div>
      </div>
    </div>
  )
}

export {MoreInformation}
