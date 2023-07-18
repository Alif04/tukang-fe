/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './ViewOrder.css'

import {Table, Space} from 'antd'
import type {ColumnsType} from 'antd/es/table'

type Props = {
  className: string
}

interface DataType {
  key: string
  order_id: string
  date_order: string
  item_name: string
  installation_type: string
  payment_status: string
  costumer_id: string
  costumer_name: string
  phone_number: string
  vendor_name: string
  installer_name: string
  order_status: string
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    width: 100,
  },
  {
    title: 'Date Order',
    dataIndex: 'date_order',
    key: 'date_order',
    align: 'center',
    width: 110,
  },
  {
    title: 'Item Name',
    dataIndex: 'item_name',
    key: 'item_name',
    align: 'left',
    width: 120,
  },
  {
    title: 'Installation Type',
    dataIndex: 'installation_type',
    key: 'installation_type',
    align: 'left',
    width: 140,
  },
  {
    title: 'Payment Status',
    dataIndex: 'payment_status',
    key: 'payment_status',
    align: 'left',
    width: 150,
  },
  {
    title: 'Customer ID',
    dataIndex: 'costumer_id',
    key: 'costumer_id',
    align: 'center',
    width: 120,
  },
  {
    title: 'Customer Name',
    dataIndex: 'costumer_name',
    key: 'costumer_name',
    align: 'left',
    width: 140,
  },
  {
    title: 'Phone Number',
    dataIndex: 'phone_number',
    key: 'phone_number',
    align: 'center',
    width: 150,
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vendor_name',
    key: 'vendor_name',
    align: 'center',
    width: 135,
  },
  {
    title: 'Installer Name',
    dataIndex: 'installer_name',
    key: 'installer_name',
    align: 'left',
    width: 130,
  },
  {
    title: 'Order Status',
    dataIndex: 'order_status',
    key: 'order_status',
    align: 'left',
    width: 140,
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <Space size='middle'>
        <a>Invite</a>
        <a>Delete</a>
      </Space>
    ),
    fixed: 'right',
    width: 140,
  },
]

const data: DataType[] = [
  {
    key: '1',
    order_id: '78453992',
    date_order: '10/2/2023',
    item_name: 'Water Heater',
    installation_type: 'New set up',
    payment_status: 'PAID',
    costumer_id: '8986747',
    costumer_name: 'Alia',
    phone_number: '08158374638',
    vendor_name: 'PT.ABC',
    installer_name: 'Patric',
    order_status: 'DONE',
  },
  {
    key: '2',
    order_id: '78453993',
    date_order: '13/2/2023',
    item_name: 'AC',
    installation_type: 'New set up',
    payment_status: 'PAID',
    costumer_id: '8986748',
    costumer_name: 'Abdulah',
    phone_number: '08158376565',
    vendor_name: 'PT.ABC',
    installer_name: 'Jonas',
    order_status: 'DONE',
  },
  {
    key: '3',
    order_id: '78453994',
    date_order: '14/2/2023',
    item_name: 'Water Heater',
    installation_type: 'New set up',
    payment_status: 'PAID',
    costumer_id: '8986710',
    costumer_name: 'Alice',
    phone_number: '08158300987',
    vendor_name: 'PT.ABC',
    installer_name: 'Patric',
    order_status: 'ON PROGRESS',
  },
  {
    key: '4',
    order_id: '78453995',
    date_order: '15/2/2023',
    item_name: 'AC',
    installation_type: 'New set up',
    payment_status: 'PAID',
    costumer_id: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    vendor_name: 'PT.ABC',
    installer_name: 'Jonas',
    order_status: 'ON PROGRESS',
  },
  {
    key: '5',
    order_id: '78453996',
    date_order: '10/3/2023',
    item_name: 'AC',
    installation_type: 'New set up',
    payment_status: 'PAID',
    costumer_id: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    vendor_name: 'PT.ABC',
    installer_name: 'Jonas',
    order_status: 'ON PROGRESS',
  },
  {
    key: '6',
    order_id: '78453997',
    date_order: '12/3/2023',
    item_name: 'AC',
    installation_type: 'New set up',
    payment_status: 'PAID',
    costumer_id: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    vendor_name: 'PT.ABC',
    installer_name: 'Jonas',
    order_status: 'ON PROGRESS',
  },
  {
    key: '7',
    order_id: '78453998',
    date_order: '15/2/2023',
    item_name: 'AC',
    installation_type: 'New set up',
    payment_status: 'PAID',
    costumer_id: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    vendor_name: 'PT.ABC',
    installer_name: 'Jonas',
    order_status: 'ON PROGRESS',
  },
]

const ViewOrderStore: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      <Table
        className='table-view-order'
        bordered
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.key}
        scroll={{x: 1500}}
        pagination={{position: ['bottomCenter']}}
      />
    </div>
  )
}

export {ViewOrderStore}
