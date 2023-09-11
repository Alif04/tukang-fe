/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {Dropdown1} from '../../../../../../_metronic/partials/content/dropdown/Dropdown1'

type Props = {
  className: string
}

const BestCostumers: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Top 3 Best Costumers</h3>
      </div>

      <div className='card-body pt-2'>
        <div className='list-item d-flex justify-content-between mb-7'>
          <div className='d-flex align-items-center'>
            <div className='symbol symbol-50px me-5'>
              <img
                src={toAbsoluteUrl('/media/avatars/300-6.jpg')}
                className='rounded-circle'
                alt=''
              />
            </div>

            <div className='flex-grow-1 me-2'>
              <div className='text-dark fw-bold fs-6'>Bpk. Gultom</div>
              <span className='text-muted d-block fw-semibold'>Keramik</span>
            </div>
          </div>

          <div className='d-flex flex-column justify-content-center align-items-end'>
            <span className='fw-normal text-dark'>15 Order</span>
            <span className='text-muted'>Rp. 15.000.000</span>
          </div>
        </div>

        <div className='list-item d-flex justify-content-between mb-7'>
          <div className='d-flex align-items-center'>
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

          <div className='d-flex flex-column justify-content-center align-items-end'>
            <span className='fw-normal text-dark'>11 Order</span>
            <span className='text-muted'>Rp. 11.000.000</span>
          </div>
        </div>

        <div className='list-item d-flex justify-content-between mb-7'>
          <div className='d-flex align-items-center'>
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

          <div className='d-flex flex-column justify-content-center align-items-end'>
            <span className='fw-normal text-dark'>20 Order</span>
            <span className='text-muted'>Rp. 10.000.000</span>
          </div>
        </div>
      </div>

      <div className='card-footer pt-1 pb-1'>
        <p className='text-muted'>Total costumer : 45 person</p>
      </div>
    </div>
  )
}

export {BestCostumers}
