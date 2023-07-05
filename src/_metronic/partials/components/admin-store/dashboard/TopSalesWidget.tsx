/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../helpers'
import {Dropdown1} from '../../../content/dropdown/Dropdown1'

type Props = {
  className: string
}

const TopSalesWidget: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Top 5 Best Sales</h3>
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
          </button>
          <Dropdown1 />
        </div>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body pt-2'>
        <div className='d-flex align-items-center mb-7'>
          <div className='symbol symbol-50px me-5'>
            <img
              src={toAbsoluteUrl('/media/avatars/300-6.jpg')}
              className='rounded-circle'
              alt=''
            />
          </div>
          <div className='flex-grow-1'>
            <div className='text-dark fw-bold fs-6'>Sandra</div>
            <span className='text-muted d-block fw-semibold'>Keramik</span>
          </div>
        </div>

        <div className='d-flex align-items-center mb-7'>
          <div className='symbol symbol-50px me-5'>
            <img
              src={toAbsoluteUrl('/media/avatars/300-2.jpg')}
              className='rounded-circle'
              alt=''
            />
          </div>
          <div className='flex-grow-1'>
            <div className='text-dark fw-bold fs-6'>Nur Amalia</div>
            <span className='text-muted d-block fw-semibold'>Cat</span>
          </div>
        </div>

        <div className='d-flex align-items-center mb-7'>
          <div className='symbol symbol-50px me-5'>
            <img
              src={toAbsoluteUrl('/media/avatars/300-7.jpg')}
              className='rounded-circle'
              alt=''
            />
          </div>
          <div className='flex-grow-1'>
            <div className='text-dark fw-bold fs-6'>Paulus</div>
            <span className='text-muted d-block fw-semibold'>Water Heater</span>
          </div>
        </div>

        <div className='d-flex align-items-center mb-7'>
          <div className='symbol symbol-50px me-5'>
            <img
              src={toAbsoluteUrl('/media/avatars/300-9.jpg')}
              className='rounded-circle'
              alt=''
            />
          </div>
          <div className='flex-grow-1'>
            <div className='text-dark fw-bold fs-6'>Anton</div>
            <span className='text-muted d-block fw-semibold'>Gypsum</span>
          </div>
        </div>

        <div className='d-flex align-items-center mb-7'>
          <div className='symbol symbol-50px me-5'>
            <img
              src={toAbsoluteUrl('/media/avatars/300-11.jpg')}
              className='rounded-circle'
              alt=''
            />
          </div>
          <div className='flex-grow-1'>
            <div className='text-dark fw-bold fs-6'>Sudirman</div>
            <span className='text-muted d-block fw-semibold'>Ubin</span>
          </div>
        </div>
      </div>
      {/* end::Body */}

      {/* begin::Footer */}
      <div className='card-footer pt-1 pb-1'>
        <p className='text-muted'>Total Sales person : 45 Sales person</p>
      </div>
      {/* end::Footer */}
    </div>
  )
}

export {TopSalesWidget}
