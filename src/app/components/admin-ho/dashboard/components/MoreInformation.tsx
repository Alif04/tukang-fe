/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import './MoreInformation.css'

type Props = {
  className: string
}

const MoreInformation: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`} id='more-information'>
      <div className='card-body'>
        <div className='row mb-5 h-50'>
          <div className='fs-1 text-gray-800'>Informasi Lainnya</div>

          <div className='col-xl-3 pt-5 pb-5'>
            <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
              05
            </h1>
            <p className='text-danger text-center mt-1 mb-1'>COMPLAINT</p>
          </div>

          <div className='col-xl-3 pt-5 pb-5'>
            <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
              02
            </h1>
            <p className='text-danger text-center mt-1 mb-1'>RESCHEDULE</p>
          </div>

          <div className='col-xl-3 pt-5 pb-5'>
            <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
              01
            </h1>
            <p className='text-danger text-center mt-1 mb-1'>CANCEL</p>
          </div>

          <div className='col-xl-3 pt-5 pb-5'>
            <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
              01
            </h1>
            <p className='text-danger text-center mt-1 mb-1'>REFUND</p>
          </div>
        </div>

        <div className='row mt-5 h-50'>
          <div className='col-xl-3 pt-5 pb-5'>
            <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
              01
            </h1>
            <p className='text-danger text-center mt-1 mb-1'>REVISIT</p>
          </div>

          <div className='col-xl-3 pt-5 pb-5'>
            <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
              01
            </h1>
            <p className='text-danger text-center mt-1 mb-1'>REWORK</p>
          </div>

          <div className='col-xl-3 pt-5 pb-5'>
            <h1 className='fw-normal text-center' style={{fontSize: '35px'}}>
              01
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
