/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {useState} from 'react'

import {Table, Steps, Input} from 'antd'
import type {ColumnsType} from 'antd/es/table'

import './OrderTracking.css'

const Search = Input.Search

type Props = {
  className: string
}

interface DataType {
  key: string
  order_id: string
  order_status: string
  date_time: string
  notes: string
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
  },
  {
    title: 'Order Status',
    dataIndex: 'order_status',
    key: 'order_status',
  },
  {
    title: 'Date Time',
    dataIndex: 'date_time',
    key: 'date_time',
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    key: 'notes',
  },
]

const data: DataType[] = [
  {
    key: '1',
    order_id: '845729',
    order_status: 'Done',
    date_time: '20/06/2023',
    notes: 'description here',
  },
  {
    key: '2',
    order_id: '845729',
    order_status: 'CIS In',
    date_time: '20/06/2023',
    notes: 'description here',
  },
  {
    key: '3',
    order_id: '845729',
    order_status: 'CIS Out',
    date_time: '20/06/2023',
    notes: 'description here',
  },
  {
    key: '4',
    order_id: '845729',
    order_status: 'Work End',
    date_time: '20/06/2023',
    notes: 'description here',
  },
]

const labelTimeline = [
  {
    title: 'New WO',
  },
  {
    title: 'Survey Process',
  },
  {
    title: 'Work in Progress',
  },
  {
    title: 'Work Done',
  },
  {
    title: 'Complaint Received',
  },
  {
    title: 'Complaint Investigated',
  },
  {
    title: 'Work Done',
  },
]

const OrderTracking: React.FC<Props> = ({className}) => {
  const [filtered, setFiltered] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [tableData, setTableData] = useState(data)

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reg = new RegExp(e.target.value, 'gi')

    const filteredData = tableData.filter((record) => {
      const orderId = record.order_id.match(reg)
      const orderStatus = record.order_status.match(reg)
      const notes = record.notes.match(reg)
      return orderId || orderStatus || notes
    })

    setSearchText(e.target.value)
    setFiltered(!!e.target.value)
    setTableData(e.target.value ? filteredData : data)
  }

  return (
    <div className={`card ${className}`}>
      <div className='card-body order-tracking'>
        <div className='searchbar'>
          <h3>Order and Complaint Tracking :</h3>

          <Search size='large' onChange={onSearch} placeholder='Search' value={searchText} />
        </div>

        <div className='timeline'>
          <Steps current={2} size='small' labelPlacement='vertical' items={labelTimeline} />
        </div>

        <div className='order-tracking-table'>
          <Table
            className='table-striped-rows'
            columns={columns}
            dataSource={tableData}
            size='small'
            rowKey={(record) => record.key}
          />
        </div>
      </div>
    </div>
  )
}

export {OrderTracking}
