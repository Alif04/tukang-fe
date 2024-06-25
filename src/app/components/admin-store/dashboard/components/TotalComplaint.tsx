/* eslint-disable jsx-a11y/anchor-is-valid */
import {Skeleton} from 'antd'
import React from 'react'

type Props = {
  className: string
  chartOrder: any
  loadingPage: boolean
}

const TotalComplaint: React.FC<Props> = ({className, loadingPage, chartOrder}) => {
  const sumTotal = (data: any, key: string) =>
    data.map((item: any) => item[key] || 0).reduce((a: number, b: number) => a + b, 0)

  const waitingQuotations = sumTotal(chartOrder, 'totalWaitingQuotation')

  return (
    <div className={`card ${className}`}>
      <div className='card-body'>
        <div className='gap-4'>
          <Skeleton active loading={loadingPage}>
            <div className='d-flex flex-column gap-4'>
              <div className='fs-5 text-center fw-bold text-muted'>Menunggu Quotation</div>
              <div className='fs-1 d-block m-auto'>{waitingQuotations}</div>
              <div className='fs-5 text-center d-block m-auto text-muted'>
                Menunggu Quotation Vendor
              </div>
            </div>
          </Skeleton>
        </div>
      </div>
    </div>
  )
}

export {TotalComplaint}
