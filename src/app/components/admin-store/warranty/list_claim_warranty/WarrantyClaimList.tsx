/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import './WarrantyClaimList.css'

import {DatePicker} from 'antd'
import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTicket, faSearch, faFilter} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

type Props = {
  className: string
}

interface DataType {
  key: string
  order_id: string
  date_order: string
  no_member: string
  costumer_name: string
  phone_number: string
  installer_name: string
  payment_status: string
  tanggal_aktif_garansi: string
}

const {RangePicker} = DatePicker

const DateRange = () => {
  return <RangePicker className='date-range ms-3' />
}

const NewWarrantyClaimButton = () => {
  const navigate = useNavigate()

  const handleNewFormWarranty = () => {
    navigate('/warranty/claim-warranty-form')
  }

  return (
    <a className='button-new-claim-garansi-form' onClick={handleNewFormWarranty}>
      <FontAwesomeIcon icon={faTicket} size='sm' />
    </a>
  )
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
    title: 'Order Date',
    dataIndex: 'date_order',
    key: 'date_order',
    align: 'center',
    width: 110,
  },
  {
    title: 'No Member',
    dataIndex: 'no_member',
    key: 'no_member',
    align: 'left',
    width: 120,
  },
  {
    title: 'Costumer Name',
    dataIndex: 'costumer_name',
    key: 'costumer_name',
    align: 'left',
    width: 140,
  },
  {
    title: 'No Telp / WA',
    dataIndex: 'phone_number',
    key: 'phone_number',
    align: 'left',
    width: 140,
  },
  {
    title: 'Nama Jasa Pemasangan',
    dataIndex: 'installer_name',
    key: 'installer_name',
    align: 'left',
    width: 180,
  },
  {
    title: 'Status Pembayaran',
    dataIndex: 'payment_status',
    key: 'payment_status',
    align: 'left',
    width: 150,
  },
  {
    title: 'Tanggal Aktif Garansi',
    dataIndex: 'tanggal_aktif_garansi',
    key: 'tanggal_aktif_garansi',
    align: 'left',
    width: 140,
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <div className='button-wrapper d-flex justify-content-center'>
        <NewWarrantyClaimButton />
      </div>
    ),
    fixed: 'right',
    width: 70,
  },
]

const data: DataType[] = [
  {
    key: '1',
    order_id: '78453992',
    date_order: '10/2/2023',
    no_member: '8986747',
    costumer_name: 'Alia',
    phone_number: '08158374638',
    installer_name: 'Patric',
    payment_status: 'PAID',
    tanggal_aktif_garansi: '08/08/2023',
  },
  {
    key: '2',
    order_id: '78453993',
    date_order: '13/2/2023',
    no_member: '8986748',
    costumer_name: 'Abdulah',
    phone_number: '08158376565',
    installer_name: 'Artur',
    payment_status: 'PAID',
    tanggal_aktif_garansi: '08/08/2023',
  },
  {
    key: '3',
    order_id: '78453994',
    date_order: '14/2/2023',
    no_member: '8986710',
    costumer_name: 'Alice',
    phone_number: '08158300987',
    installer_name: 'John',
    payment_status: 'PAID',
    tanggal_aktif_garansi: '08/08/2023',
  },
  {
    key: '4',
    order_id: '78453995',
    date_order: '15/2/2023',
    no_member: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    installer_name: 'Patric',
    payment_status: 'PAID',
    tanggal_aktif_garansi: '08/08/2023',
  },
  {
    key: '5',
    order_id: '78453996',
    date_order: '10/3/2023',
    no_member: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    installer_name: 'Jonas',
    payment_status: 'PAID',
    tanggal_aktif_garansi: '08/08/2023',
  },
  {
    key: '6',
    order_id: '78453997',
    date_order: '12/3/2023',
    no_member: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    installer_name: 'Jonas',
    payment_status: 'PAID',
    tanggal_aktif_garansi: '08/08/2023',
  },
  {
    key: '7',
    order_id: '78453998',
    date_order: '15/2/2023',
    no_member: '8986123',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    installer_name: 'Jonas',
    payment_status: 'PAID',
    tanggal_aktif_garansi: '08/08/2023',
  },
]

const WarrantyClaimList: React.FC<Props> = ({className}) => {
  return (
    <section id='warranty-claim-list'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <Row className='table-head-wrapper'>
            <Col xs={12} md={12} lg={12} xl={4} xxl={4} className='d-flex mb-2'>
              <div className='d-flex align-items-center me-3'>
                <FontAwesomeIcon icon={faFilter} size='2xl' className='me-2' />
                <h3 className='fs-3 fw-normal'>Date : </h3>
              </div>

              <DateRange />
            </Col>

            <Col xs={12} md={12} lg={12} xl={8} xxl={8}>
              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control placeholder='Filter' className='filter-ltr' />
                </InputGroup>
              </div>
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
        </div>
      </div>
    </section>
  )
}

export {WarrantyClaimList}
