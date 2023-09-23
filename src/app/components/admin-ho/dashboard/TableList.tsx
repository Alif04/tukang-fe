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
  store_name: string
  costumer_name: string
  nama_pemasaran: string
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
    width: 140,
  },
  {
    title: 'Nama Konsumen',
    dataIndex: 'costumer_name',
    key: 'costumer_name',
    align: 'left',
    width: 140,
  },
  {
    title: 'Nama Pemasaran',
    dataIndex: 'nama_pemasaran',
    key: 'nama_pemasaran',
    align: 'left',
    width: 150,
  },
  {
    title: 'Grand Total',
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
    store_name: 'Mitra 10 - BSD',
    costumer_name: 'Alia',
    nama_pemasaran: 'BOOK',
    total: '',
  },
  {
    key: '2',
    order_id: '78453993',
    store_name: 'Mitra 10 - Fatmawati',
    costumer_name: 'Rudi',
    nama_pemasaran: 'BOOKED',
    total: '',
  },
  {
    key: '3',
    order_id: '78453994',
    store_name: 'Mitra 10 - BSD',
    costumer_name: 'Amir',
    nama_pemasaran: 'CANCEL',
    total: '',
  },
  {
    key: '4',
    order_id: '78453995',
    store_name: 'Mitra 10 - Fatmawati',
    costumer_name: 'Amaretta',
    nama_pemasaran: 'BOOKED',
    total: '',
  },
  {
    key: '5',
    order_id: '78453996',
    store_name: 'Mitra 10 - BSD',
    costumer_name: 'Krusho',
    nama_pemasaran: 'BOOKED',
    total: '',
  },
  {
    key: '6',
    order_id: '78453997',
    store_name: 'Mitra 10 - Fatmawati',
    costumer_name: 'Ryan',
    nama_pemasaran: 'BOOKED',
    total: '',
  },
]

const TableList: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-body p-5'>
        <div className='d-flex flex-column'>
          <h1 className='fs-1 text-black mb-3'>ORDER</h1>

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
