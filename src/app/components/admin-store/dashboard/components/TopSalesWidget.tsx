/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

type Props = {
  className: string
  salesData: any[]
}

const TopSalesWidget: React.FC<Props> = ({className, salesData}) => {
  const topFive = salesData.slice(0, 5)

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Top 5 Best Sales</h3>
      </div>

      <div className='card-body pt-2'>
        {topFive.map((item: any) => (
          <div className='list-item d-flex justify-content-between mb-7' key={item.id}>
            <div className='d-flex align-items-center'>
              <div className='symbol symbol-50px me-5'>
                <img
                  src={toAbsoluteUrl('/media/avatars/300-6.jpg')}
                  className='rounded-circle'
                  alt=''
                />
              </div>

              <div className='flex-grow-1 me-2'>
                <div className='text-dark fw-bold fs-6'>{item.full_name}</div>
                <span className='text-muted d-block fw-semibold me-5'>
                  {item?.sales_categories
                    .map((category: any) => category?.categories?.category_name ?? '-')
                    .join(', ')}
                </span>
              </div>
            </div>
            {/* 
            <div className='d-flex flex-column justify-content-center align-items-end w-50'>
              <span className='fw-bold text-success'>Rp. 12.000.000</span>
              <span className='text-muted'>{`${item?.order_total ?? 0} Order`}</span>
            </div> */}
          </div>
        ))}
      </div>

      <div className='card-footer pt-1 pb-1'>
        <p className='text-muted'>Total Sales : {salesData.length} person</p>
      </div>
    </div>
  )
}

export {TopSalesWidget}
