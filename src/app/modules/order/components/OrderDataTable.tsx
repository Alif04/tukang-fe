/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../_metronic/helpers'

type Props = {
  className: string
}

const OrderDataTable: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <div className='card-toolbar'>
          <a href='#' className='btn btn-sm btn-light-primary'>
            <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
            New Member
          </a>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='ps-4 min-w-100px rounded-start'>Order ID</th>
                <th className='min-w-100px'>Date Order</th>
                <th className='min-w-125px'>Item Name</th>
                <th className='min-w-150px'>Installation Type</th>
                <th className='min-w-150px'>Payment Status</th>
                <th className='min-w-150px'>Costumer ID</th>
                <th className='min-w-150px'>Costumer Name</th>
                <th className='min-w-150px'>Phone Number</th>
                <th className='min-w-150px'>Vendor Name</th>
                <th className='min-w-150px'>Installer Name</th>
                <th className='min-w-150px'>Order Status</th>
                <th className='min-w-250px text-start rounded-end'>Action</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <tr>
                <td>
                  <div className='text-dark fw-bold text-hover-primary mb-1 fs-6'>78453992</div>
                </td>
                <td>
                  <div className='text-dark fw-bold text-hover-primary mb-1 fs-6'>10/2/2023</div>
                </td>
                <td>
                  <div className='text-dark fw-bold text-hover-primary mb-1 fs-6'>Water Heater</div>
                </td>
                <td>
                  <div className='text-dark fw-bold text-hover-primary mb-1 fs-6'>New set up</div>
                </td>
                <td>
                  <div className='text-dark fw-bold text-hover-primary mb-1 fs-6'>PAID</div>
                </td>
                <td>
                  <div className='text-dark fw-bold text-hover-primary mb-1 fs-6'>8986747</div>
                </td>
                <td>
                  <div className='text-dark fw-bold text-hover-primary mb-1 fs-6'>Alia</div>
                </td>
                <td>
                  <div className='text-dark fw-bold text-hover-primary mb-1 fs-6'>08158374638</div>
                </td>
                <td>
                  <div className='text-dark fw-bold text-hover-primary mb-1 fs-6'>PT.ABC</div>
                </td>
                <td>
                  <div className='text-dark fw-bold text-hover-primary mb-1 fs-6'>Patrick</div>
                </td>
                <td>
                  <div className='text-dark fw-bold text-hover-primary mb-1 fs-6'>DONE</div>
                </td>
                <td className='text-start'>
                  <a
                    href='#'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTSVG path='/media/icons/duotune/general/gen019.svg' className='svg-icon-3' />
                  </a>
                  <a
                    href='#'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
                  </a>
                  <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                  </a>
                </td>
              </tr>
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export {OrderDataTable}
