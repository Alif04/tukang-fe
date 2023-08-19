/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

type Props = {
  className: string
}

const TotalComplaint: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-body p-2 d-flex justify-content-center'>
        <div className='d-flex align-items-center gap-4'>
          <div className='d-flex flex-column gap-4'>
            <div className='fs-5 fw-bold d-block m-auto text-muted'>Menunggu Quotation</div>
            <div className='fs-1 d-block m-auto'>24</div>
            <div className='fs-5 text-muted'>Menunggu Quotation Vendor</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {TotalComplaint}
