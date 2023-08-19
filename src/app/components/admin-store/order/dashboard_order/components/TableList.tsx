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
  costumer_name: string
  nama_jasa: string
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
    title: 'Nama Konsumen',
    dataIndex: 'costumer_name',
    key: 'costumer_name',
    align: 'left',
    width: 140,
  },
  {
    title: 'Nama Jasa',
    dataIndex: 'nama_jasa',
    key: 'nama_jasa',
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

const data: DataType[] = [
  {
    key: '1',
    order_id: '78453992',
    costumer_name: 'Alia',
    nama_jasa: '',
    total: '',
  },
  {
    key: '2',
    order_id: '78453993',
    costumer_name: 'Abdulah',
    nama_jasa: '',
    total: '',
  },
  {
    key: '3',
    order_id: '78453994',
    costumer_name: 'Alice',
    nama_jasa: '',
    total: '',
  },
  {
    key: '4',
    order_id: '78453995',
    costumer_name: 'Kobe',
    nama_jasa: '',
    total: '',
  },
  {
    key: '5',
    order_id: '78453996',
    costumer_name: 'Kobe',
    nama_jasa: '',
    total: '',
  },
  {
    key: '6',
    order_id: '78453997',
    costumer_name: 'Kobe',
    nama_jasa: '',
    total: '',
  },
  {
    key: '7',
    order_id: '78453998',
    costumer_name: 'Kobe',
    nama_jasa: '',
    total: '',
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
            scroll={{x: 1000}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </div>
  )
}

export {TableList}
