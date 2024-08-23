/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'

type Props = {
  className: string
  vendorData: any[]
}

const TopVendorWidget: React.FC<Props> = ({className, vendorData}) => {
  const topThree = vendorData.slice(0, 3)

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Top 3 Best Vendors</h3>
      </div>

      <div className='card-body pt-2'>
        {topThree.map((item: any) => (
          <div className='list-item d-flex justify-content-between mb-7'>
            <div className='d-flex align-items-center'>
              <div className='symbol symbol-50px me-5'>
                <img
                  src={toAbsoluteUrl('/media/avatars/blank.png')}
                  className='rounded-circle'
                  alt=''
                />
              </div>

              <div className='flex-grow-1 me-2'>
                <div className='text-dark fw-bold fs-6'>{item?.company_name}</div>
                <span className='text-muted d-block fw-semibold'>{item?.email_address}</span>
              </div>
            </div>

            <div className='d-flex flex-column justify-content-center align-items-end'>
              <span className='fw-normal text-dark'>{item?.orders?.length} Order</span>
            </div>
          </div>
        ))}
      </div>

      <div className='card-footer pt-1 pb-1'>
        <p className='text-muted'>Total Vendor : {vendorData.length} Vendor</p>
      </div>
    </div>
  )
}

export {TopVendorWidget}
