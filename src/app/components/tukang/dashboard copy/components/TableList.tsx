/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'

type Props = {
  className: string
  orderData: DataType[]
}

interface DataType {
  order_id: string
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
  },
  {
    title: 'Nama Pemasangan',
    dataIndex: 'service_name',
    key: 'service_name',
    align: 'left',
  },
  {
    title: 'Grand Total',
    dataIndex: 'total',
    key: 'total',
    align: 'center',
  },
]

const TableList: React.FC<Props> = ({className, orderData}) => {
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
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </div>
  )
}

export {TableList}
