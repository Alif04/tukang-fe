/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import './ReportInsentif.css'

import {Table, DatePicker} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Button} from 'react-bootstrap'

type Props = {
  className: string
}

interface DataType {
  key: string
  order_id: string
  date_order: string
  costumer_name: string
  phone_number: string
  email: string
  nama_pemasangan: string
  quantity: string
  harga: string
  grand_total: string
}

const {RangePicker} = DatePicker

const DateRange = () => {
  return <RangePicker className='date-range ms-3' />
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    width: 100,
    className: 'col_order_id',
  },
  {
    title: 'Tanggal Order',
    dataIndex: 'date_order',
    key: 'date_order',
    align: 'center',
    width: 110,
  },
  {
    title: 'Nama Costumer',
    dataIndex: 'costumer_name',
    key: 'costumer_name',
    align: 'left',
    width: 140,
  },
  {
    title: 'No Telepon',
    dataIndex: 'phone_number',
    key: 'phone_number',
    align: 'center',
    width: 150,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    align: 'center',
    width: 135,
  },
  {
    title: 'Nama Pemasangan',
    dataIndex: 'nama_pemasangan',
    key: 'nama_pemasangan',
    align: 'center',
    width: 135,
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'center',
    width: 135,
  },
  {
    title: 'Harga',
    dataIndex: 'harga',
    key: 'harga',
    align: 'center',
    width: 135,
  },
  {
    title: 'Grand Total',
    dataIndex: 'grand_total',
    key: 'grand_total',
    align: 'center',
    width: 135,
  },
]

const data: DataType[] = [
  {
    key: '1',
    order_id: '78453995',
    date_order: '15/2/2023',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    email: 'kobe@gmail.com',
    nama_pemasangan: 'Water Heater',
    quantity: '1',
    harga: '500.000',
    grand_total: '1.000.000',
  },
  {
    key: '2',
    order_id: '78453995',
    date_order: '15/2/2023',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    email: 'kobe@gmail.com',
    nama_pemasangan: 'Water Heater',
    quantity: '1',
    harga: '500.000',
    grand_total: '1.000.000',
  },
  {
    key: '3',
    order_id: '78453995',
    date_order: '15/2/2023',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    email: 'kobe@gmail.com',
    nama_pemasangan: 'Water Heater',
    quantity: '1',
    harga: '500.000',
    grand_total: '1.000.000',
  },
  {
    key: '4',
    order_id: '78453995',
    date_order: '15/2/2023',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    email: 'kobe@gmail.com',
    nama_pemasangan: 'Water Heater',
    quantity: '1',
    harga: '500.000',
    grand_total: '1.000.000',
  },
  {
    key: '5',
    order_id: '78453996',
    date_order: '10/3/2023',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    email: 'kobe@gmail.com',
    nama_pemasangan: 'Water Heater',
    quantity: '1',
    harga: '500.000',
    grand_total: '1.000.000',
  },
  {
    key: '6',
    order_id: '78453997',
    date_order: '12/3/2023',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    email: 'kobe@gmail.com',
    nama_pemasangan: 'Water Heater',
    quantity: '1',
    harga: '500.000',
    grand_total: '1.000.000',
  },
  {
    key: '7',
    order_id: '78453998',
    date_order: '15/2/2023',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    email: 'kobe@gmail.com',
    nama_pemasangan: 'Water Heater',
    quantity: '1',
    harga: '500.000',
    grand_total: '1.000.000',
  },
]

const ReportInsentifStore: React.FC<Props> = ({className}) => {
  return (
    <section id='report-insentif'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={8} xxl={8} className='d-flex align-items-center mb-2'>
              <div className='fw-bold mb-5'>
                Nama Toko
                <span className='fs-6 ms-2 pt-2 pb-2 fw-normal bg-secondary'>MITRA 10 - BSD</span>
              </div>

              <div className='d-flex align-items-center ms-5 me-3 mb-2'>
                <h3 className='fs-6 fw-normal'>Periode : </h3>
                <DateRange />
              </div>
            </Col>

            <Col
              xs={12}
              md={12}
              lg={12}
              xl={4}
              xxl={4}
              className='d-flex align-items-center justify-content-end'
            >
              <div className='fs-1 fw-normal text-uppercase'>Total Order : 30</div>
            </Col>
          </Row>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.key}
            scroll={{x: 1500}}
            pagination={{position: ['bottomCenter']}}
          />

          <div className='d-flex justify-content-center align-items-center mt-5'>
            <Button
              variant='dark-gray'
              className='d-flex justify-content-center align-items-center'
              type='submit'
            >
              Print Report
            </Button>

            <Button
              variant='dark-success'
              className='d-flex justify-content-center align-items-center'
              type='submit'
            >
              Email Report
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export {ReportInsentifStore}
