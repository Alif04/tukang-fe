/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

type Props = {
  className: string
  orderData: any[]
}

const getStatusCount = (orderData: any[], status: string): number => {
  return orderData?.filter((order) => order?.status?.category === status)?.length ?? 0
}

const TotalReschedule: React.FC<Props> = ({className, orderData}) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-body '>
        <div className='gap-4'>
          <div className='d-flex flex-column gap-4'>
            <div className='fs-5 text-center fw-bold text-muted'>
              Menunggu <br></br> Survey
            </div>
            <div className='fs-1 d-block m-auto'>{getStatusCount(orderData, 'SURVEYREQ')}</div>
            <div className='fs-5 text-center d-block m-auto text-muted'>
              Menunggu Suvey dari Vendor
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {TotalReschedule}
