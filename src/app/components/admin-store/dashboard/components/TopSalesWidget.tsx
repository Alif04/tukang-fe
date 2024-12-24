/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Skeleton} from 'antd'

type Props = {
  className: string
  salesData: any[]
  totalSales: number
  loadingPage: boolean
}

const TopSalesWidget: React.FC<Props> = ({className, salesData, loadingPage, totalSales}) => {
  const topFive = salesData?.slice(0, 5)

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Top 5 Best Sales</h3>
      </div>

      <div className='card-body pt-2'>
        {topFive.map((item: any) => (
          <Skeleton active avatar loading={loadingPage} key={item.id}>
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
                  <div className='text-dark fw-bold fs-6'>{item?.full_name}</div>
                  <span className='text-muted d-block fw-semibold me-5'>
                    {Array.from(
                      new Set(
                        item?.sales_categories.map(
                          (category: any) => category?.categories?.category_name ?? '-'
                        )
                      )
                    ).join(', ')}
                  </span>
                </div>
              </div>

              <div className='d-flex flex-column justify-content-center align-items-end w-50'>
                <span className='text-muted'>{`${item?.sales_total_order ?? 0} Order`}</span>
              </div>
            </div>
          </Skeleton>
        ))}
      </div>

      <div className='card-footer pt-1 pb-1'>
        <p className='text-muted'>Total Sales : {totalSales} person</p>
      </div>
    </div>
  )
}

export {TopSalesWidget}
