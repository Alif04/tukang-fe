/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'

type Props = {
  className: string
}

interface DataType {
  key: string
  order_id: string
  order_date: string
  status: string
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
  },
  {
    title: 'Order Date',
    dataIndex: 'order_date',
    key: 'order_date',
    align: 'left',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    align: 'left',
  },
]

const data: DataType[] = [
  {
    key: '1',
    order_id: '78453992',
    order_date: '09/06/2023',
    status: 'BOOK',
  },
  {
    key: '2',
    order_id: '78453993',
    order_date: '09/06/2023',
    status: 'BOOK',
  },
  {
    key: '3',
    order_id: '78453994',
    order_date: '09/06/2023',
    status: 'BOOK',
  },
]

const TableList: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-body p-5'>
        <div className='d-flex flex-column'>
          <h1 className='fs-1 text-black mb-3'>List Order</h1>

          <Table
            bordered
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.key}
            scroll={{x: 100}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </div>
  )
}

export {TableList}
