/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Dropdown1} from '../../../../../_metronic/partials/content/dropdown/Dropdown1'

type Props = {
  className: string
  salesData: any[]
  memberData: any[]
}

const TopSalesWidget: React.FC<Props> = ({className, salesData, memberData}) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Top 5 Best Sales</h3>
      </div>

      <div className='card-body pt-2'>
        {salesData.map((item: any) => (
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

            <div className='d-flex flex-column justify-content-center align-items-end w-50'>
              <span className='fw-bold text-success'>Rp. 12.000.000</span>
              <span className='text-muted'>6 Invoices</span>
            </div>
          </div>
        ))}

        {/* <div className='list-item d-flex justify-content-between mb-7'>
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
            <span className='fw-bold text-success'>Rp. 10.000.000</span>
            <span className='text-muted'>10 Invoices</span>
          </div>
        </div>

        <div className='list-item d-flex justify-content-between mb-7'>
          <div className='d-flex align-items-center'>
            <div className='symbol symbol-50px me-5'>
              <img
                src={toAbsoluteUrl('/media/avatars/300-9.jpg')}
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
            <span className='fw-bold text-success'>Rp. 9.000.000</span>
            <span className='text-muted'>9 Invoices</span>
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
              <div className='text-dark fw-bold fs-6'>Anton</div>
              <span className='text-muted d-block fw-semibold'>Gypsum</span>
            </div>
          </div>

          <div className='d-flex flex-column justify-content-center align-items-end'>
            <span className='fw-bold text-success'>Rp. 5.000.000</span>
            <span className='text-muted'>7 Invoices</span>
          </div>
        </div>

        <div className='list-item d-flex justify-content-between mb-7'>
          <div className='d-flex align-items-center'>
            <div className='symbol symbol-50px me-5'>
              <img
                src={toAbsoluteUrl('/media/avatars/300-3.jpg')}
                className='rounded-circle'
                alt=''
              />
            </div>

            <div className='flex-grow-1'>
              <div className='text-dark fw-bold fs-6'>Sudirman</div>
              <span className='text-muted d-block fw-semibold'>Ubin</span>
            </div>
          </div>

          <div className='d-flex flex-column justify-content-center align-items-end'>
            <span className='fw-bold text-success'>Rp. 5.000.000</span>
            <span className='text-muted'>10 Invoices</span>
          </div>
        </div> */}
      </div>

      <div className='card-footer pt-1 pb-1'>
        <p className='text-muted'>Total Customer : {memberData.length} person</p>
      </div>
    </div>
  )
}

export {TopSalesWidget}
