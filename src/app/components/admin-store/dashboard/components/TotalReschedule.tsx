/* eslint-disable jsx-a11y/anchor-is-valid */
import {Skeleton} from 'antd'
import React from 'react'

type Props = {
  className: string
  chartOrder: any
  loadingPage: boolean
  orderData: any[]
}

const TotalReschedule: React.FC<Props> = ({className, chartOrder, loadingPage, orderData}) => {
  // Count From Order API
  const getStatusCount = (orderData: any[]): number => {
    return orderData?.filter((order) => order?.status?.category === 'SURVEYREQ')?.length ?? 0
  }

  // Sum Total From API
  const sumTotal = (data: any, key: string) =>
    data.map((item: any) => item[key] || 0).reduce((a: number, b: number) => a + b, 0)
  const waitingSurvey = sumTotal(chartOrder, 'totalWaitingSurvey')

  return (
    <div className={`card ${className}`}>
      <div className='card-body '>
        <div className='gap-4'>
          <Skeleton active loading={loadingPage}>
            <div className='d-flex flex-column gap-4'>
              <div className='fs-5 text-center fw-bold text-muted'>Survei</div>
              <div className='fs-1 d-block m-auto'>{waitingSurvey}</div>
              <div className='fs-5 text-center d-block m-auto text-muted'>
                Menunggu Survei dari Vendor
              </div>
            </div>
          </Skeleton>
        </div>
      </div>
    </div>
  )
}

export {TotalReschedule}
