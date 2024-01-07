import React, {useState, useEffect} from 'react'

import './ReportVendor.css'

import axios from 'axios'
import {Table, PaginationProps, Tag} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Card, Row, Col} from 'react-bootstrap'

import {DatePicker} from 'antd'
const {RangePicker} = DatePicker

type Props = {
  endpoint: string
  statusName: string
  headerColor: string
  title: string
}

interface Status {
  value: number
  category: string
}

const ReportVendor: React.FC<Props> = ({endpoint, statusName, headerColor, title}) => {
  const apiUrl = process.env.REACT_APP_API_URL

  const [reportData, setReportData] = useState<any[]>([])
  const [reportGrandTotal, setReportGrandTotal] = useState<string>('0')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalOrder, setTotalOrder] = useState<number>(0)

  const [dateFrom, setDateFrom] = useState<any>('')
  const [dateTo, setDateTo] = useState<any>('')

  let columns: ColumnsType<any> = []

  switch (endpoint) {
    case 'orders':
      columns = [
        {
          title: 'Order ID',
          dataIndex: 'order_id',
          key: 'order_id',
          align: 'center',
          width: 110,
          className: 'col_order_id',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.order_id - b.order_id,
        },
        {
          title: 'Tanggal Order',
          dataIndex: 'date_order',
          key: 'date_order',
          align: 'left',
          width: 110,
          sorter: (a, b) => new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
        },
        {
          title: 'Nama Costumer',
          dataIndex: 'costumer_name',
          key: 'costumer_name',
          align: 'left',
          width: 140,
          onFilter: (value, record) => record.costumer_name.includes(String(value)),
          sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
        },
        {
          title: 'No Telepon',
          dataIndex: 'phone_number',
          key: 'phone_number',
          align: 'left',
          width: 130,
          sorter: (a, b) => a.phone_number - b.phone_number,
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          align: 'left',
          width: 170,
          onFilter: (value, record) => record.email.includes(String(value)),
          sorter: (a, b) => a.email.length - b.email.length,
        },
        {
          title: 'Alamat',
          dataIndex: 'address',
          key: 'address',
          align: 'left',
          width: 150,
          onFilter: (value, record) => record.address.includes(String(value)),
          sorter: (a, b) => a.address.length - b.address.length,
        },
        {
          title: 'Nama Pemasangan',
          dataIndex: 'service_name',
          key: 'service_name',
          align: 'left',
          width: 170,
          onFilter: (value, record) => record.service_name.includes(String(value)),
          sorter: (a, b) => a.service_name.length - b.service_name.length,
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          key: 'quantity',
          align: 'center',
          width: 90,
          sorter: (a, b) => a.quantity - b.quantity,
        },
        {
          title: 'Harga',
          dataIndex: 'harga',
          key: 'harga',
          align: 'center',
          width: 135,
          sorter: (a, b) => a.harga - b.harga,
        },
        {
          title: 'Grand Total',
          dataIndex: 'grand_total',
          key: 'grand_total',
          align: 'center',
          width: 135,
          sorter: (a, b) => a.grand_total - b.grand_total,
        },
      ]
      break

    case 'complaints':
      columns = [
        {
          title: 'Complaint ID',
          dataIndex: 'complaint_id',
          key: 'complaint_id',
          align: 'center',
          width: 120,
          className: 'text-start',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.complaint_id - b.complaint_id,
        },
        {
          title: 'Store Name',
          dataIndex: 'assign_from',
          key: 'assign_from',
          align: 'center',
          width: 120,
          className: 'text-start',
          onFilter: (value, record) => record.assign_from.includes(String(value)),
          sorter: (a, b) => a.assign_from.length - b.assign_from.length,
        },
        {
          title: 'Order ID',
          dataIndex: 'order_id',
          key: 'order_id',
          align: 'center',
          width: 110,
          className: 'text-start',
          sorter: (a, b) => a.order_id - b.order_id,
        },
        {
          title: 'Order Date',
          dataIndex: 'date_order',
          key: 'date_order',
          align: 'center',
          width: 120,
          className: 'text-start',
          onFilter: (value, record) => record.date_order.includes(String(value)),
          sorter: (a, b) => a.date_order.length - b.date_order.length,
        },
        {
          title: 'No Member',
          dataIndex: 'no_member',
          key: 'no_member',
          align: 'center',
          width: 140,
          className: 'text-start',
          sorter: (a, b) => a.no_member - b.no_member,
        },
        {
          title: 'Customer Name',
          dataIndex: 'costumer_name',
          key: 'costumer_name',
          width: 150,
          className: 'text-start',
          onFilter: (value, record) => record.costumer_name.includes(String(value)),
          sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
        },
        {
          title: 'Phone Number',
          dataIndex: 'phone_number',
          key: 'phone_number',
          width: 160,
          className: 'text-start',
          sorter: (a, b) => a.phone_number - b.phone_number,
        },
        {
          title: 'Nama Jasa Pemasangan',
          dataIndex: 'service_name',
          key: 'service_name',
          width: 180,
          className: 'text-start',
        },
        {
          title: 'Order Status',
          dataIndex: 'order_status',
          key: 'order_status',
          render: (order_status) => {
            const orderStatus = order_status
            let color = ''

            switch (orderStatus) {
              case 'UNPAID':
                color = 'red'
                break
              case 'PAID':
                color = 'green'
                break
              case 'PICKLIST':
                color = 'green'
                break
              case 'BOOKED':
                color = 'lime'
                break
              case 'SURVEYREQ':
                color = 'blue'
                break
              case 'SURVEYSTART':
                color = 'blue'
                break
              case 'SURVEYDONE':
                color = 'blue'
                break
              case 'RESURVEYREQ':
                color = 'blue'
                break
              case 'RESURVEYSTART':
                color = 'blue'
                break
              case 'RESURVEYDONE':
                color = 'blue'
                break
              case 'QUOTE IN':
                color = 'blue'
                break
              case 'QUOTE OUT':
                color = 'blue'
                break
              case 'WORKREQ':
                color = 'blue'
                break
              case 'WORKSTART':
                color = 'blue'
                break
              case 'WIP':
                color = 'blue'
                break
              case 'WORKEND':
                color = 'blue'
                break
              case 'INVOICED':
                color = 'blue'
                break
              case 'CISOUT':
                color = 'green'
                break
              default:
                color = 'blue'
                break
            }

            return <Tag color={color}>{orderStatus}</Tag>
          },
          filters: [
            {text: 'PICKLIST', value: 'PICKLIST'},
            {text: 'BOOKED', value: 'BOOKED'},
            {text: 'SURVEYREQ', value: 'SURVEYREQ'},
            {text: 'SURVEYSTART', value: 'SURVEYSTART'},
            {text: 'SURVEYDONE', value: 'SURVEYDONE'},
            {text: 'RESURVEYREQ', value: 'RESURVEYREQ'},
            {text: 'RESURVEYSTART', value: 'RESURVEYSTART'},
            {text: 'RESURVEYDONE', value: 'RESURVEYDONE'},
            {text: 'WORKREQ', value: 'WORKREQ'},
            {text: 'WORKSTART', value: 'WORKSTART'},
            {text: 'WIP', value: 'WIP'},
            {text: 'WORKEND', value: 'WORKEND'},
            {text: 'QUOTEIN', value: 'QUOTEIN'},
            {text: 'QUOTEOUT', value: 'QUOTEOUT'},
            {text: 'CISOUT', value: 'CISOUT'},
            {text: 'INVOICED', value: 'INVOICED'},
          ],
          onFilter: (value, record) => record.order_status.includes(String(value)),
          sorter: (a, b) => a.order_status.length - b.order_status.length,
          width: 150,
          className: 'text-start',
        },
        {
          title: 'Work Status',
          dataIndex: 'work_status',
          key: 'work_status',
          className: 'col-complaint-date text-start',
          width: 180,
          onFilter: (value, record) => record.work_status.includes(String(value)),
          sorter: (a, b) => a.work_status.length - b.work_status.length,
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
          filters: [
            {text: 'INVESTIGATED', value: 'INVESTIGATED'},
            {text: 'ACCEPTED', value: 'ACCEPTED'},
          ],
        },
        {
          title: 'Complaint Date',
          dataIndex: 'complaint_date',
          key: 'complaint_date',
          className: 'col-complaint-date text-start',
          width: 150,
          onFilter: (value, record) => record.complaint_date.includes(String(value)),
          sorter: (a, b) => a.complaint_date.length - b.complaint_date.length,
        },
        {
          title: 'Umur Complaint',
          dataIndex: 'complaint_age',
          key: 'complaint_age',
          className: 'col-complaint-date text-start',
          width: 150,
          onFilter: (value, record) => record.complaint_age.includes(String(value)),
          sorter: (a, b) => a.complaint_age.length - b.complaint_age.length,
        },
        {
          title: 'Complaint Status',
          dataIndex: 'complaint_status',
          key: 'complaint_status',
          className: 'col-complaint-status text-start',
          width: 180,
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
          filters: [
            {text: 'INVESTIGATED', value: 'INVESTIGATED'},
            {text: 'ACCEPTED', value: 'ACCEPTED'},
          ],
          onFilter: (value, record) => record.complaint_status.includes(String(value)),
          sorter: (a, b) => a.complaint_status.length - b.complaint_status.length,
        },
      ]
      break

    case 'quotation':
      columns = [
        {
          title: 'Quotation ID',
          dataIndex: 'quotation_id',
          key: 'quotation_id',
          align: 'center',
          width: 110,
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.quotation_id - b.quotation_id,
        },
        {
          title: 'Nama Store',
          dataIndex: 'store_name',
          key: 'store_name',
          align: 'center',
          width: 130,
          onFilter: (value, record) => record.store_name.includes(String(value)),
          sorter: (a, b) => a.store_name.length - b.store_name.length,
        },
        {
          title: 'Order ID',
          dataIndex: 'order_id',
          key: 'order_id',
          align: 'center',
          width: 90,
          className: 'col_order_id',
          sorter: (a, b) => a.order_id - b.order_id,
        },
        {
          title: 'Order Date',
          dataIndex: 'date_order',
          key: 'date_order',
          align: 'center',
          width: 110,
          onFilter: (value, record) => record.date_order.includes(String(value)),
          sorter: (a, b) => a.date_order.length - b.date_order.length,
        },
        {
          title: 'Customer Name',
          dataIndex: 'costumer_name',
          key: 'costumer_name',
          align: 'left',
          width: 130,
          onFilter: (value, record) => record.costumer_name.includes(String(value)),
          sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
        },
        {
          title: 'Nama Pekerjaan',
          dataIndex: 'service_name',
          key: 'service_name',
          align: 'left',
          width: 130,
          onFilter: (value, record) => record.service_name.includes(String(value)),
          sorter: (a, b) => a.service_name.length - b.service_name.length,
        },
        {
          title: 'Payment Status',
          dataIndex: 'payment_status',
          key: 'payment_status',
          align: 'left',
          width: 120,
          onFilter: (value, record) => record.payment_status.includes(String(value)),
          sorter: (a, b) => a.payment_status.length - b.payment_status.length,
        },
      ]
      break

    case 'refund':
      columns = [
        {
          title: 'Order ID',
          dataIndex: 'order_id',
          key: 'order_id',
          align: 'center',
          width: 100,
          className: 'col_order_id',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.order_id - b.order_id,
        },
        {
          title: 'Refund Id',
          dataIndex: 'refund_id',
          key: 'refund_id',
          align: 'center',
          width: 100,
          sorter: (a, b) => a.refund_id - b.refund_id,
        },
        {
          title: 'Nama Toko',
          dataIndex: 'store_name',
          key: 'store_name',
          align: 'center',
          width: 110,
          onFilter: (value, record) => record.store_name.includes(String(value)),
          sorter: (a, b) => a.store_name.length - b.store_name.length,
        },
        {
          title: 'Tanggal Order',
          dataIndex: 'date_order',
          key: 'date_order',
          align: 'center',
          width: 110,
          onFilter: (value, record) => record.date_order.includes(String(value)),
          sorter: (a, b) => a.date_order.length - b.date_order.length,
        },
        {
          title: 'Nomor Member',
          dataIndex: 'member_id',
          key: 'member_id',
          align: 'left',
          width: 110,
          sorter: (a, b) => a.member_id - b.member_id,
        },
        {
          title: 'Nama Costumer',
          dataIndex: 'member_name',
          key: 'member_name',
          align: 'left',
          width: 110,
          onFilter: (value, record) => record.member_name.includes(String(value)),
          sorter: (a, b) => a.member_name.length - b.member_name.length,
        },
        {
          title: 'No Telp / WA',
          dataIndex: 'phone_number',
          key: 'phone_number',
          align: 'center',
          width: 110,
          sorter: (a, b) => a.phone_number - b.phone_number,
        },
        {
          title: 'Item Name',
          dataIndex: 'item_name',
          key: 'item_name',
          align: 'left',
          width: 130,
          onFilter: (value, record) => record.item_name.includes(String(value)),
          sorter: (a, b) => a.item_name.length - b.item_name.length,
        },
        {
          title: 'Nama Jasa Pemasangan',
          dataIndex: 'nama_jasa',
          key: 'nama_jasa',
          align: 'center',
          width: 180,
          onFilter: (value, record) => record.nama_jasa.includes(String(value)),
          sorter: (a, b) => a.nama_jasa.length - b.nama_jasa.length,
        },
        {
          title: 'Payment Status',
          dataIndex: 'payment_status',
          key: 'payment_status',
          align: 'left',
          width: 140,
          onFilter: (value, record) => record.payment_status.includes(String(value)),
          sorter: (a, b) => a.payment_status.length - b.payment_status.length,
        },
        {
          title: 'Order Status',
          dataIndex: 'order_status',
          key: 'order_status',
          align: 'left',
          width: 140,
          render: (order_status) => {
            const orderStatus = order_status
            let color = ''

            switch (orderStatus) {
              case 'BOOK':
                color = 'green'
                break
              case 'BOOKED':
                color = 'lime'
                break
              case 'SURVEYREQ':
                color = 'blue'
                break
              case 'SURVEYSTART':
              case 'SURVEYDONE':
              case 'QUOTE IN':
              case 'QUOTE OUT':
              case 'WORKREQ':
              case 'WORKSTART':
              case 'WIP':
              case 'WORKEND':
              case 'CISOUT':
                color = 'green'
                break
              default:
                color = 'blue'
                break
            }

            return <Tag color={color}>{orderStatus}</Tag>
          },
          filters: [
            {text: 'BOOK', value: 'BOOK'},
            {text: 'BOOKED', value: 'BOOKED'},
          ],
          onFilter: (value, record) => record.order_status.includes(String(value)),
          sorter: (a, b) => a.order_status.length - b.order_status.length,
        },
      ]
      break

    case 'reschedule':
      columns = [
        {
          title: 'Order ID',
          dataIndex: 'order_id',
          key: 'order_id',
          align: 'center',
          width: 80,
          className: 'col_order_id',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.order_id - b.order_id,
        },
        {
          title: 'Refund Id',
          dataIndex: 'refund_id',
          key: 'refund_id',
          align: 'center',
          width: 80,
          sorter: (a, b) => a.refund_id - b.refund_id,
        },
        {
          title: 'Nama Toko',
          dataIndex: 'store_name',
          key: 'store_name',
          align: 'center',
          width: 150,
          onFilter: (value, record) => record.store_name.includes(String(value)),
          sorter: (a, b) => a.store_name.length - b.store_name.length,
        },
        {
          title: 'Tanggal Order',
          dataIndex: 'date_order',
          key: 'date_order',
          align: 'center',
          width: 110,
          onFilter: (value, record) => record.date_order.includes(String(value)),
          sorter: (a, b) => a.date_order.length - b.date_order.length,
        },
        {
          title: 'Nomor Member',
          dataIndex: 'member_id',
          key: 'member_id',
          align: 'center',
          width: 110,
          sorter: (a, b) => a.member_id - b.member_id,
        },
        {
          title: 'Nama Member',
          dataIndex: 'member_name',
          key: 'member_name',
          align: 'left',
          width: 110,
          onFilter: (value, record) => record.member_name.includes(String(value)),
          sorter: (a, b) => a.member_name.length - b.member_name.length,
        },
        {
          title: 'No Telp / WA',
          dataIndex: 'phone_number',
          key: 'phone_number',
          align: 'center',
          width: 110,
          sorter: (a, b) => a.phone_number - b.phone_number,
        },
        {
          title: 'Item Name',
          dataIndex: 'item_name',
          key: 'item_name',
          align: 'left',
          width: 130,
          onFilter: (value, record) => record.item_name.includes(String(value)),
          sorter: (a, b) => a.item_name.length - b.item_name.length,
        },
        {
          title: 'Nama Jasa Pemasangan',
          dataIndex: 'service_name',
          key: 'service_name',
          align: 'center',
          width: 180,
          onFilter: (value, record) => record.service_name.includes(String(value)),
          sorter: (a, b) => a.service_name.length - b.service_name.length,
        },
        {
          title: 'Payment Status',
          dataIndex: 'payment_status',
          key: 'payment_status',
          align: 'left',
          width: 140,
          onFilter: (value, record) => record.payment_status.includes(String(value)),
          sorter: (a, b) => a.payment_status.length - b.payment_status.length,
        },
        {
          title: 'Order Status',
          dataIndex: 'order_status',
          key: 'order_status',
          align: 'left',
          width: 140,
          render: (order_status) => {
            const orderStatus = order_status
            let color = ''

            switch (orderStatus) {
              case 'BOOK':
                color = 'green'
                break
              case 'BOOKED':
                color = 'lime'
                break
              case 'SURVEYREQ':
                color = 'blue'
                break
              case 'SURVEYSTART':
              case 'SURVEYDONE':
              case 'QUOTE IN':
              case 'QUOTE OUT':
              case 'WORKREQ':
              case 'WORKSTART':
              case 'WIP':
              case 'WORKEND':
              case 'CISOUT':
                color = 'green'
                break
              default:
                color = 'blue'
                break
            }

            return <Tag color={color}>{orderStatus}</Tag>
          },
          filters: [
            {text: 'BOOK', value: 'BOOK'},
            {text: 'BOOKED', value: 'BOOKED'},
          ],
          onFilter: (value, record) => record.order_status.includes(String(value)),
          sorter: (a, b) => a.order_status.length - b.order_status.length,
        },
      ]
      break

    default:
      columns = [
        {
          title: 'Order ID',
          dataIndex: 'order_id',
          key: 'order_id',
          align: 'center',
          width: 110,
          className: 'col_order_id',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.order_id - b.order_id,
        },
        {
          title: 'Tanggal Order',
          dataIndex: 'date_order',
          key: 'date_order',
          align: 'left',
          width: 110,
          sorter: (a, b) => new Date(a.date_order).getTime() - new Date(b.date_order).getTime(),
        },
        {
          title: 'Nama Costumer',
          dataIndex: 'costumer_name',
          key: 'costumer_name',
          align: 'left',
          width: 140,
          onFilter: (value, record) => record.costumer_name.includes(String(value)),
          sorter: (a, b) => a.costumer_name.length - b.costumer_name.length,
        },
        {
          title: 'No Telepon',
          dataIndex: 'phone_number',
          key: 'phone_number',
          align: 'left',
          width: 130,
          sorter: (a, b) => a.phone_number - b.phone_number,
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          align: 'left',
          width: 170,
          onFilter: (value, record) => record.email.includes(String(value)),
          sorter: (a, b) => a.email.length - b.email.length,
        },
        {
          title: 'Alamat',
          dataIndex: 'address',
          key: 'address',
          align: 'left',
          width: 150,
          onFilter: (value, record) => record.address.includes(String(value)),
          sorter: (a, b) => a.address.length - b.address.length,
        },
        {
          title: 'Nama Pemasangan',
          dataIndex: 'service_name',
          key: 'service_name',
          align: 'left',
          width: 170,
          onFilter: (value, record) => record.service_name.includes(String(value)),
          sorter: (a, b) => a.service_name.length - b.service_name.length,
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          key: 'quantity',
          align: 'center',
          width: 90,
          sorter: (a, b) => a.quantity - b.quantity,
        },
        {
          title: 'Harga',
          dataIndex: 'harga',
          key: 'harga',
          align: 'center',
          width: 135,
          sorter: (a, b) => a.harga - b.harga,
        },
        {
          title: 'Grand Total',
          dataIndex: 'grand_total',
          key: 'grand_total',
          align: 'center',
          width: 135,
          sorter: (a, b) => a.grand_total - b.grand_total,
        },
      ]
      break
  }

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fetchReportData = async (endpoint: string, page: number, pageSize: number) => {
    try {
      const storedStatus = sessionStorage.getItem('statusData')
      const statusData: Array<Status> = storedStatus ? JSON.parse(storedStatus) : []
      const desiredStatus = statusData.filter((status: any) => status.category.includes(statusName))

      if (desiredStatus && endpoint) {
        const statuses = desiredStatus.map((x) => x.value)

        const url =
          statusName === ''
            ? `${apiUrl}/${endpoint}?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&page=${page}&take=${pageSize}`
            : `${apiUrl}/${endpoint}?order_by=desc&date_from=${dateFrom}&date_to=${dateTo}&page=${page}&take=${pageSize}&status=${statuses}`

        const response = await axios.get(url, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (response?.data) {
          switch (endpoint) {
            case 'orders':
              setReportGrandTotal(response?.data?.orderGrandTotal ?? 0)
              break

            case 'complaints':
              setReportGrandTotal(response?.data?.complaintGrandTotal ?? 0)
              break

            case 'quotation':
              setReportGrandTotal(response?.data?.quotationGrandTotal ?? 0)
              break

            default:
              setReportGrandTotal(response?.data?.orderGrandTotal ?? 0)
              break
          }

          setCurrentPage(response.data.page)
          setTotalOrder(response.data.total)
        }

        return endpoint === 'reschedule' ? response.data.data.data : response.data.data
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const ViewReportData = async (endpoint: string, page: number, pageSize: number) => {
    try {
      const apiData = await fetchReportData(endpoint, page, pageSize)

      if (!apiData) {
        console.error('No data received from getReportData')
        return []
      }

      let orderData
      let complaintData
      let quotationData
      let refundData
      let rescheduleData

      switch (endpoint) {
        case 'orders':
          orderData = apiData.map((item: any) => {
            let data

            const orderDate = new Date(item.request_survey)

            const price = parseInt(item.m_order_details[0]?.unit_price ?? 0, 10)
            const formattedUnitPrice = `Rp. ${price.toLocaleString('id')}`

            const quantity = parseInt(item.m_order_details[0]?.quantity ?? 0, 10)

            const grandTotalPrice = parseInt(item.grand_total)
            const formattedGrandTotal = `Rp. ${grandTotalPrice.toLocaleString('id')}`

            data = {
              order_id: item.id,
              date_order: formatDate(orderDate),
              costumer_name: item.members.full_name,
              phone_number: item.project_number,
              email: item.members.email,
              address: item.project_address,
              service_name: item.m_order_details[0]?.item?.service_name ?? '-',
              quantity: quantity,
              harga: formattedUnitPrice,
              grand_total: formattedGrandTotal,
            }

            return data
          })
          break

        case 'complaints':
          complaintData = apiData.map((item: any) => {
            let data

            const orderDate = new Date(item.orders.created_at)
            const complaintDate = new Date(item.complaint_date)
            const currentDate = new Date()

            const timeDifferenceInMilliseconds = Number(currentDate) - Number(complaintDate)
            const timeDifferenceInMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60))
            const timeDifferenceInHours = Math.floor(
              timeDifferenceInMilliseconds / (1000 * 60 * 60)
            )
            const timeDifferenceInDays = Math.floor(
              timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
            )

            let complaintAge

            if (timeDifferenceInDays >= 1) {
              complaintAge = `${timeDifferenceInDays} Hari`
            } else if (timeDifferenceInHours >= 1) {
              complaintAge = `${timeDifferenceInHours} Jam`
            } else {
              complaintAge = `${timeDifferenceInMinutes} Menit`
            }

            let phoneNumber =
              item.orders.members.phone_number !== 'null'
                ? item.orders.members.phone_number
                : item.orders.members.whatsapp_number

            data = {
              complaint_id: item.id,
              assign_from: item.orders.store.store_name,
              order_id: item.orders.id,
              date_order: formatDate(orderDate),
              no_member: item.orders.members.member_number,
              costumer_name: item.orders.members.full_name,
              phone_number: phoneNumber,
              service_name: item.orders.m_order_details[0].item_name ?? '-',
              order_status: item.orders.status.category,
              work_status: item.orders.status.category,
              complaint_date: formatDate(complaintDate),
              complaint_age: complaintAge,
              complaint_status: item.status.category,
            }

            return data
          })
          break

        case 'quotation':
          quotationData = apiData.map((item: any) => {
            let data

            const orderDate = new Date(item?.order?.request_survey ?? '-')

            const workOrderItems = item?.quotation_details
              .map((service: any) => service.name ?? '-')
              .join(', ')

            let paymentStatus = item.receipt_number === null ? 'UNPAID' : 'PAID'

            data = {
              quotation_id: item.id,
              store_name: item?.store?.store_name ?? '-',
              order_id: item?.order?.id,
              date_order: formatDate(orderDate),
              costumer_name: item?.order?.members?.full_name ?? '',
              service_name: workOrderItems,
              vendor_name: item?.order?.vendor?.company_name ?? '-',
              payment_status: paymentStatus,
              order_status: item?.status?.category ?? '',
              quotation_status: item?.status?.category ?? '',
            }

            return data
          })
          break

        case 'refund':
          refundData = apiData.map((item: any) => {
            let data

            const orderDate = new Date(item.orders.created_at)

            let phoneNumber =
              item.orders.members.phone_number !== 'null'
                ? item.orders.members.phone_number
                : item.orders.members.whatsapp_number

            let paymentStatus = item.orders.receipt_path !== 'null' ? 'PAID' : 'UNPAID'

            data = {
              refund_id: item.id,
              order_id: item.order_id,
              store_name: item.orders.store.store_name,
              date_order: formatDate(orderDate),
              member_id: item.orders.members.id,
              member_name: item.orders.members.full_name,
              phone_number: phoneNumber,
              item_name: item.orders.m_order_details[0].item?.item_name,
              nama_jasa: item.orders.m_order_details[0].item?.category_name ?? '-',
              payment_status: paymentStatus,
              order_status: item.orders.status.category,
            }

            return data
          })
          break

        case 'reschedule':
          rescheduleData = apiData.map((item: any) => {
            let data

            const orderDate = new Date(item.order.created_at)

            let phoneNumber =
              item.order.members.phone_number !== 'null'
                ? item.order.members.phone_number
                : item.order.members.whatsapp_number

            let paymentStatus = item.order.receipt_path !== 'null' ? 'PAID' : 'UNPAID'

            data = {
              refund_id: item?.id,
              order_id: item?.order_id,
              store_name: item?.order?.store.store_name,
              date_order: formatDate(orderDate),
              member_id: item?.order?.members.member_number,
              member_name: item?.order?.members.full_name,
              phone_number: phoneNumber,
              item_name: item?.order?.m_order_details[0]?.item?.item_name ?? '-',
              service_name: item?.order?.m_order_details[0]?.item?.service_name ?? '-',
              payment_status: paymentStatus,
              order_status: item?.order?.status.category,
            }

            return data
          })
          break

        default:
          break
      }

      return endpoint === 'orders'
        ? orderData
        : endpoint === 'quotation'
        ? quotationData
        : endpoint === 'complaints'
        ? complaintData
        : endpoint === 'refund'
        ? refundData
        : endpoint === 'reschedule'
        ? rescheduleData
        : []
    } catch (error) {
      console.error('Error getting report list data:', error)
      return []
    }
  }

  const fetchData = async (page: number, pageSize: number) => {
    const data = await ViewReportData(endpoint, page, pageSize)
    setReportData(data)
  }

  useEffect(() => {
    fetchData(1, 10)
  }, [dateFrom, dateTo])

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>Prev</a>
    }
    if (type === 'next') {
      return <a>Next</a>
    }
    return originalElement
  }

  return (
    <section id='view-report-vendor'>
      <Row className='mb-5'>
        <Col xxl={4} xl={4} lg={12}>
          <Row>
            <Col xxl={4} xl={4} lg={4} className='d-flex align-items-center'>
              <h3 className='title-header fs-5 fw-normal'>Pilih rentang waktu</h3>
            </Col>

            <Col xxl={8} xl={8} lg={8}>
              <RangePicker
                format={'DD-MM-YYYY'}
                className='date-range w-100'
                onChange={(values) => {
                  if (values && values.length === 2) {
                    const dateFromFormatted = values[0]?.format('YYYY-MM-DD')
                    const dateToFormatted = values[1]?.format('YYYY-MM-DD')

                    setDateFrom(dateFromFormatted)
                    setDateTo(dateToFormatted)
                  } else {
                    setDateFrom('')
                    setDateTo('')
                  }
                }}
              />
            </Col>
          </Row>
        </Col>

        <Col xxl={4} xl={4} lg={12}></Col>

        <Col xxl={4} xl={4} lg={12}></Col>
      </Row>

      <Row className='mb-5'>
        <Col>
          <Card className={`border-top border-${headerColor} border-5`}>
            <Card.Body>
              <h3 className='fs-3 fw-semibold text-uppercase mb-3'>{title}</h3>
              <h1 className='fs-1 fw-bold'>{`Rp. ${parseInt(reportGrandTotal).toLocaleString(
                'id'
              )}`}</h1>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className='mb-5'>
        <Col>
          {endpoint === 'complaints' ? (
            <Table
              className='table-striped-rows'
              bordered
              columns={columns}
              dataSource={reportData}
              rowKey={(record) => record.order_id}
              scroll={{x: 2000}}
              pagination={{
                position: ['bottomRight'],
                current: currentPage,
                total: totalOrder,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50, 100],
                onChange: (page, pageSize) => {
                  fetchData(page, pageSize)
                },
                itemRender: itemRender,
                showTotal: (total, range) => (
                  <span style={{left: 0, position: 'absolute'}}>
                    Showing {range[0]} - {range[1]} of {total} List
                  </span>
                ),
              }}
            />
          ) : (
            <Table
              className='table-striped-rows'
              bordered
              columns={columns}
              dataSource={reportData}
              rowKey={(record) => record.order_id}
              pagination={{
                position: ['bottomRight'],
                current: currentPage,
                total: totalOrder,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20, 50, 100],
                onChange: (page, pageSize) => {
                  fetchData(page, pageSize)
                },
                itemRender: itemRender,
                showTotal: (total, range) => (
                  <span style={{left: 0, position: 'absolute'}}>
                    Showing {range[0]} - {range[1]} of {total} List
                  </span>
                ),
              }}
            />
          )}
        </Col>
      </Row>
    </section>
  )
}

export {ReportVendor}
