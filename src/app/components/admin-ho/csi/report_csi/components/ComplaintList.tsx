/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../../../_metronic/helpers'

type Props = {
  className: string
}

const ComplaintList: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-body p-2'>
        <div className='card-header border-0'>
          <h3 className='card-title fw-bold text-dark'>Top 5 Dissatisfaction Cause</h3>
        </div>

        <div className='card-body pt-2'>
          <div className='d-flex align-items-center mb-7'>
            <div className='symbol symbol-50px me-5'>
              <img
                src={toAbsoluteUrl('/media/avatars/blank.png')}
                className='rounded-circle'
                alt=''
              />
            </div>
            <div className='flex-grow-1'>
              <div className='text-dark fw-bold fs-6'>Kerjaan kurang rapih</div>
              <span className='text-muted d-block fw-semibold'>Keramik</span>
            </div>
          </div>

          <div className='d-flex align-items-center mb-7'>
            <div className='symbol symbol-50px me-5'>
              <img
                src={toAbsoluteUrl('/media/avatars/blank.png')}
                className='rounded-circle'
                alt=''
              />
            </div>
            <div className='flex-grow-1'>
              <div className='text-dark fw-bold fs-6'>Sering datang terlambat </div>
              <span className='text-muted d-block fw-semibold'>Cat</span>
            </div>
          </div>

          <div className='d-flex align-items-center mb-7'>
            <div className='symbol symbol-50px me-5'>
              <img
                src={toAbsoluteUrl('/media/avatars/blank.png')}
                className='rounded-circle'
                alt=''
              />
            </div>
            <div className='flex-grow-1'>
              <div className='text-dark fw-bold fs-6'>Pergi tanpa memberikan laporan</div>
              <span className='text-muted d-block fw-semibold'>Water Heater</span>
            </div>
          </div>

          <div className='d-flex align-items-center mb-7'>
            <div className='symbol symbol-50px me-5'>
              <img
                src={toAbsoluteUrl('/media/avatars/blank.png')}
                className='rounded-circle'
                alt=''
              />
            </div>
            <div className='flex-grow-1'>
              <div className='text-dark fw-bold fs-6'>Harga kemahalan</div>
              <span className='text-muted d-block fw-semibold'>Gypsum</span>
            </div>
          </div>

          <div className='d-flex align-items-center mb-7'>
            <div className='symbol symbol-50px me-5'>
              <img
                src={toAbsoluteUrl('/media/avatars/blank.png')}
                className='rounded-circle'
                alt=''
              />
            </div>
            <div className='flex-grow-1'>
              <div className='text-dark fw-bold fs-6'>Datang terlalu sore</div>
              <span className='text-muted d-block fw-semibold'>Ubin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {ComplaintList}
