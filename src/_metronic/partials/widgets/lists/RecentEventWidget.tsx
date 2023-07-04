/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {Dropdown1} from '../../content/dropdown/Dropdown1'

type Props = {
  className: string
  items?: number
}

const RecentEventWidget: React.FC<Props> = ({className, items = 6}) => {
  return (
    <div className='card card-xl-stretch mb-xl-8'>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold text-dark'>Recent Event</span>
        </h3>
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
        {/* begin::Item */}
        <div className='d-flex align-items-center mb-7'>
          <span className='badge bg-primary rounded-pill p-1 me-2'>
            <p className='d-flex flex-column mt-2 mb-2'>
              Sun <span className='pt-2'>17</span>
            </p>
          </span>

          <div className='flex-grow-1 me-2'>
            <div className='fw-bold text-gray-800 fs-6'>
              Pemasangan Keramik untuk order ID : 980765
            </div>
            <span className='text-muted fw-semibold d-block'>Aepa Kemayoran, Jakarta</span>
          </div>

          <div className='d-flex flex-column align-items-end'>
            <span className='fw-bold text-success'>Keramik</span>

            <span className='fw-bold text-dark'>08 AM - 12 PM</span>
          </div>
        </div>
        {/* end::Item */}

        {/* begin::Item */}
        <div className='d-flex align-items-center mb-7'>
          <span className='badge bg-warning rounded-pill p-1 me-2'>
            <p className='d-flex flex-column mt-2 mb-2'>
              Sun <span className='pt-2'>18</span>
            </p>
          </span>

          <div className='flex-grow-1 me-2'>
            <div className='fw-bold text-gray-800 fs-6'>Request Survey untuk order ID : 980765</div>
            <span className='text-muted fw-semibold d-block'>Bandung Valley, Bandung</span>
          </div>

          <div className='d-flex flex-column align-items-end'>
            <span className='fw-bold text-warning'>Torrent</span>

            <span className='fw-bold text-dark'>09 AM - 04 PM</span>
          </div>
        </div>
        {/* end::Item */}

        {/* begin::Item */}
        <div className='d-flex align-items-center mb-7'>
          <span className='badge bg-primary rounded-pill p-1 me-2'>
            <p className='d-flex flex-column mt-2 mb-2'>
              Sun <span className='pt-2'>17</span>
            </p>
          </span>

          <div className='flex-grow-1 me-2'>
            <div className='fw-bold text-gray-800 fs-6'>Request Survey untuk order ID : 980765</div>
            <span className='text-muted fw-semibold d-block'>Kemang Pratama Bekasi, Jakarta</span>
          </div>

          <div className='d-flex flex-column align-items-end'>
            <span className='fw-bold text-success'>Genteng</span>

            <span className='fw-bold text-dark'>08 AM - 12 PM</span>
          </div>
        </div>
        {/* end::Item */}

        {/* begin::Item */}
        <div className='d-flex align-items-center mb-7'>
          <span className='badge bg-warning rounded-pill p-1 me-2'>
            <p className='d-flex flex-column mt-2 mb-2'>
              Sun <span className='pt-2'>17</span>
            </p>
          </span>

          <div className='flex-grow-1 me-2'>
            <div className='fw-bold text-gray-800 fs-6'>
              Pemasangan Water untuk order ID : 980765
            </div>
            <span className='text-muted fw-semibold d-block'>
              Bandung Valley Bandung, Jawa Barat
            </span>
          </div>

          <div className='d-flex flex-column align-items-end'>
            <span className='fw-bold text-warning'>Water</span>

            <span className='fw-bold text-dark'>09 AM - 04 PM</span>
          </div>
        </div>
        {/* end::Item */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {RecentEventWidget}
