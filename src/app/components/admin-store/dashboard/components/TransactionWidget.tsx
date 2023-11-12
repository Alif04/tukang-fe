/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG} from '../../../../../_metronic/helpers'
import {Dropdown1} from '../../../../../_metronic/partials/content/dropdown/Dropdown1'

type Props = {
  className: string
}

const TransactionWidget: React.FC<Props> = () => {
  return (
    <div className='card card-xl-stretch mb-5 mb-xl-8'>
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Transaction</h3>
      </div>

      <div className='card-body pt-2'>
        <div className='transaction-wrapper'>
          <div className='d-flex align-items-center mb-7'>
            <div className='flex-grow-1 me-2'>
              <div className='fw-bolder text-gray-800 fs-5'>Bpk. Slamet</div>
              <div className='fw-bold text-gray-800 fs-6'>Pemasangan Water Heater</div>
              <span className='text-muted fw-semibold d-block'>16 March 2023</span>
            </div>

            <div className='d-flex flex-column align-items-end'>
              <span className='fw-bold text-success'>Rp. 1.000.000</span>

              <span className='fw-bold text-dark'>Done</span>
            </div>
          </div>

          <div className='d-flex align-items-center mb-7'>
            <div className='flex-grow-1 me-2'>
              <div className='fw-bolder text-gray-800 fs-5'>Ibu Riana</div>
              <div className='fw-bold text-gray-800 fs-6'>Pemasangan Ubin</div>
              <span className='text-muted fw-semibold d-block'>17 March 2023</span>
            </div>

            <div className='d-flex flex-column align-items-end'>
              <span className='fw-bold text-success'>Rp. 5.400.000</span>
              <span className='fw-bold text-dark'>Done</span>
            </div>
          </div>

          <div className='d-flex align-items-center mb-7'>
            <div className='flex-grow-1 me-2'>
              <div className='fw-bolder text-gray-800 fs-5'>Ibu Karen</div>
              <div className='fw-bold text-gray-800 fs-6'>Pemasangan Kitchen Set</div>
              <span className='text-muted fw-semibold d-block'>17 March 2023</span>
            </div>

            <div className='d-flex flex-column align-items-end'>
              <span className='fw-bold text-success'>Rp. 15.400.000</span>

              <span className='fw-bold text-dark'>Done</span>
            </div>
          </div>

          <div className='d-flex align-items-center mb-7'>
            <div className='flex-grow-1 me-2'>
              <div className='fw-bolder text-gray-800 fs-5'>Bpk. Vincent</div>
              <div className='fw-bold text-gray-800 fs-6'>Pemasangan Kloset</div>
              <span className='text-muted fw-semibold d-block'>17 March 2023</span>
            </div>

            <div className='d-flex flex-column align-items-end'>
              <span className='fw-bold text-danger'>Rp. 1.000.000</span>

              <span className='fw-bold text-dark'>Cancel</span>
            </div>
          </div>
        </div>
      </div>

      <div className='button-wrapper d-flex justify-content-center' style={{margin: '30px'}}>
        <div className='btn btn-outline-info border-1 w-75'>See More Transaction</div>
      </div>
    </div>
  )
}

export {TransactionWidget}
