/* eslint-disable jsx-a11y/anchor-is-valid */
import {Skeleton} from 'antd'
import React from 'react'

type Props = {
  className: string
  chartOrder: any
  loadingPage: boolean
  orderData: any[]
}

const WaitingPaymentQuotation: React.FC<Props> = ({
  className,
  loadingPage,
  chartOrder,
  orderData,
}) => {
  // Count From Order API
  const getStatusCount = (orderData: any[]): number => {
    return (
      orderData?.filter(
        (order) =>
          order?.quotation?.length &&
          order?.status?.category === 'QUOTEOUT' &&
          order?.quotation[0]?.receipt_quotation === null
      ).length ?? 0
    )
  }

  // // Sum Total From API
  // const sumTotal = (data: any, key: string) =>
  //   data.map((item: any) => item[key] || 0).reduce((a: number, b: number) => a + b, 0)
  // const waitingPayment = sumTotal(chartOrder, 'totalUnpaid')

  return (
    <div className={`card ${className}`}>
      <div className='card-body'>
        <div className='gap-4'>
          <Skeleton active loading={loadingPage}>
            <div className='d-flex flex-column gap-4'>
              <div className='fs-5 text-center fw-bold text-muted'>Menunggu Bayar</div>
              <div className='fs-1 d-block m-auto'>{getStatusCount(orderData)}</div>
              <div className='fs-5 text-center d-block m-auto text-muted'>
                Menunggu Bayar Quotation
              </div>
            </div>
          </Skeleton>
        </div>
      </div>
    </div>
  )
}

export {WaitingPaymentQuotation}
