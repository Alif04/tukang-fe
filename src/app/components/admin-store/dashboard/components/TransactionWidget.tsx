/* eslint-disable jsx-a11y/anchor-is-valid */
import {Skeleton} from 'antd'
import React from 'react'
import {Link} from 'react-router-dom'

type Props = {
  className: string
  orderData: any[]
  loadingPage: boolean
}

const TransactionWidget: React.FC<Props> = ({className, orderData, loadingPage}) => {
  const filteredOrderData = orderData?.slice(0, 4)

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-dark'>Transactions</h3>
      </div>

      <div
        className={
          filteredOrderData?.length === 0
            ? 'card-body d-flex justify-content-center align-items-center pt-2'
            : 'card-body pt-2'
        }
      >
        <Skeleton active loading={loadingPage}>
          <div className='transaction-wrapper'>
            {filteredOrderData?.length === 0 ? (
              <div className='text-center'>Tidak ada order pada periode ini</div>
            ) : (
              filteredOrderData?.map((item: any) => (
                <div className='d-flex align-items-center mb-5' key={item.id}>
                  <div className='flex-grow-1 me-2'>
                    <div className='fw-bolder text-gray-800 fs-5'>
                      {item?.members?.full_name ?? ''}
                    </div>

                    <div className='fw-bold text-gray-800 fs-6'>
                      {item?.m_order_details
                        .map((item: any) =>
                          item?.item === null ? item?.item_notes : item?.item?.service_name ?? '-'
                        )
                        .join(', ')}
                    </div>

                    <span className='text-muted fw-semibold d-block'>
                      {new Date(item?.request_survey).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className='d-flex flex-column align-items-end'>
                    <span className='fw-bold text-success'>{`Rp. ${
                      parseInt(item?.grand_total).toLocaleString('id') ?? 0
                    }`}</span>
                    <span className='fw-bold text-dark'>{item?.status?.description ?? ''}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Skeleton>
      </div>

      <div className='button-wrapper d-flex justify-content-center' style={{margin: '30px'}}>
        <Link to='/order/view-order' className='btn btn-outline-info border-1 w-75'>
          See More Transaction
        </Link>
      </div>
    </div>
  )
}

export {TransactionWidget}
