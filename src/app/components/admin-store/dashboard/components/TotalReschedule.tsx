/* eslint-disable jsx-a11y/anchor-is-valid */
import {Skeleton} from 'antd'
import React from 'react'

type Props = {
  className: string
  chartOrder: any
  loadingPage: boolean
}

const TotalReschedule: React.FC<Props> = ({className, chartOrder, loadingPage}) => {
  const sumTotal = (data: any, key: string) =>
    data.map((item: any) => item[key] || 0).reduce((a: number, b: number) => a + b, 0)
  const waitingSurvey = sumTotal(chartOrder, 'totalOrderSurvey')

  return (
    <div className={`card ${className}`}>
      <div className='card-body '>
        <div className='gap-4'>
          <Skeleton active loading={loadingPage}>
            <div className='d-flex flex-column gap-4'>
              <div className='fs-5 text-center fw-bold text-muted'>
                Menunggu <br></br> Survey
              </div>
              <div className='fs-1 d-block m-auto'>{waitingSurvey}</div>
              <div className='fs-5 text-center d-block m-auto text-muted'>
                Menunggu Suvey dari Vendor
              </div>
            </div>
          </Skeleton>
        </div>
      </div>
    </div>
  )
}

export {TotalReschedule}
