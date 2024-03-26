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
    <section id='more-information-tukang'>
      <div className={`card ${className}`} id='more-information'>
        <div className='card-body'>
          <div className='row mb-5'>
            <div className='fs-1 text-gray-800'>Informasi Lainnya</div>

            <div className='col pt-5 pb-5'>
              <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
                {getStatusCount(orderData, 'WARRANTYCLAIM')}
              </h1>
              <p className='fs-6 text-danger text-center mt-1 mb-1'>GARANSI AKTIF</p>
            </div>

            <div className='col pt-5 pb-5'>
              <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
                {getStatusCount(orderData, 'CLAIM')}
              </h1>
              <p className='fs-6 text-success text-center mt-1 mb-1'>RESOLVE</p>
            </div>
          </div>

          <div className='row mb-5'>
            <div className='fs-1 text-danger'>COMPLAINT</div>

            <div className='col pt-5 pb-5'>
              <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
                {getStatusCount(orderData, 'APPROVED')}
              </h1>
              <p className='fs-6 text-danger text-center mt-1 mb-1'>MENUNGGU REVISIT </p>
            </div>

            <div className='col pt-5 pb-5'>
              <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
                {getStatusCount(orderData, 'CLAIM')}
              </h1>
              <p className='fs-6 text-danger text-center mt-1 mb-1'>MENUNGGU RESOLVE</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export {MoreInformation}
