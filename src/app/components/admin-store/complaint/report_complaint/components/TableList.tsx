/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {Table, Tag} from 'antd'
import type {ColumnsType} from 'antd/es/table'

type Props = {
  className: string
  complaintData: DataType[]
}

interface DataType {
  order_id: number
  complaint_date: string
  customer_name: string
  complaint_age: string
  status: string
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    sorter: (a, b) => a.order_id - b.order_id,
    width: 100,
  },
  {
    title: 'Tanggal Komplain',
    dataIndex: 'complaint_date',
    key: 'complaint_date',
    align: 'left',
  },
  {
    title: 'Nama Customer',
    dataIndex: 'customer_name',
    key: 'customer_name',
    align: 'left',
  },
  {
    title: 'Umur Komplain',
    dataIndex: 'complaint_age',
    key: 'complaint_age',
    align: 'left',
  },
  {
    title: 'Status Komplain',
    dataIndex: 'complaint_status',
    key: 'complaint_status',
    align: 'left',
    width: 130,
    render: (complaint_status) => {
      const complaintStatus = complaint_status
      let color = ''

      switch (complaintStatus) {
        case 'INVESTIGATED':
          color = 'volcano'
          break
        case 'ACCEPTED':
          color = 'green'
          break
        default:
          color = 'blue'
          break
      }

      return <Tag color={color}>{complaintStatus}</Tag>
    },
  },
]

const TableList: React.FC<Props> = ({className, complaintData}) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-body p-5'>
        <div className='d-flex flex-column'>
          <h1 className='fs-1 text-black mb-3'>List Pengaduan</h1>

          <Table
            bordered
            columns={columns}
            dataSource={complaintData}
            rowKey={(record) => record.order_id}
            scroll={{x: 1000}}
            pagination={{position: ['bottomRight']}}
          />
        </div>
      </div>
    </div>
  )
}

export {TableList}
