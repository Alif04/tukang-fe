/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

type Props = {
  className: string
}

const TotalReschedule: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-body p-2 d-flex justify-content-center'>
        <div className='d-flex align-items-center gap-4'>
          <div className='d-flex flex-column gap-4'>
            <div className='fs-5 d-block m-auto text-muted'>Total Reschedule</div>
            <div className='fs-1 d-block m-auto'>4</div>
            <div className='fs-5 text-muted'>Reschedule bulan ini</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {TotalReschedule}
