/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {Table, PaginationProps} from 'antd'
import type {ColumnsType} from 'antd/es/table'

type Props = {
  className: string
  orderData: DataType[]
  currentPage: number
}

interface DataType {
  order_id: number
  store_name: string
  costumer_name: string
  service_name: string
  total: string
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    width: 10,
  },
  {
    title: 'Nama Toko',
    dataIndex: 'store_name',
    key: 'store_name',
    align: 'left',
  },
  {
    title: 'Nama Konsumen',
    dataIndex: 'costumer_name',
    key: 'costumer_name',
    align: 'left',
    width: 140,
  },
  {
    title: 'Nama Pemasangan',
    dataIndex: 'service_name',
    key: 'service_name',
    align: 'left',
    width: 150,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    align: 'center',
    width: 135,
  },
]

const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
  if (type === 'prev') {
    return <a>Prev</a>
  }
  if (type === 'next') {
    return <a>Next</a>
  }
  return originalElement
}

const TableList: React.FC<Props> = ({className, orderData, currentPage}) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-body p-5'>
        <div className='d-flex flex-column'>
          <h1 className='fs-1 text-black mb-3'>List Order</h1>

          <Table
            bordered
            columns={columns}
            dataSource={orderData}
            rowKey={(record) => record.order_id}
            scroll={{x: 400, y: 625}}
            pagination={{
              current: currentPage,
              total: orderData?.length ?? 0,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50, 100],
              defaultPageSize: 5,
              // onChange: (page, pageSize) => {
              //   orderData(page, pageSize)
              // },
              itemRender: itemRender,
              showTotal: (total, range) => (
                <span style={{left: 0, position: 'absolute'}}>
                  Showing {range[0]} - {range[1]} of {total} List Order
                </span>
              ),
            }}
          />
        </div>
      </div>
    </div>
  )
}

export {TableList}
