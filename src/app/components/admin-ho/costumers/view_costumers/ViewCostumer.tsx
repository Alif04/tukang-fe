/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import './ViewCostumer.css'

import {Table, DatePicker} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPrint, faFileExcel, faSearch} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

type Props = {
  className: string
}

interface DataType {
  key: string
  number: number
  nama_toko: string
  costumer_id: string
  full_name: string
  phone_number: string
  email_address: string
  customer_since: string
  total_services: string
  total_spend: string
  total_complaint: string
  total_cis_score: string
  status: string
}

const DetailButton = () => {
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate('/costumers/detail-costumers')
  }

  return (
    <a className='button-detail' onClick={handleDetail}>
      <FontAwesomeIcon icon={faBook} size='sm' />
    </a>
  )
}

const {RangePicker} = DatePicker

const DateRange = () => {
  return <RangePicker className='date-range ms-3' />
}

const columns: ColumnsType<DataType> = [
  {
    title: 'No Urut',
    dataIndex: 'number',
    key: 'number',
    width: 90,
    align: 'center',
  },
  {
    title: 'Nama Toko',
    dataIndex: 'nama_toko',
    key: 'nama_toko',
    width: 140,
  },
  {
    title: 'No Member',
    dataIndex: 'costumer_id',
    key: 'costumer_id',
    width: 130,
    align: 'center',
  },
  {
    title: 'Nama Costumer',
    dataIndex: 'full_name',
    key: 'full_name',
    width: 140,
  },
  {
    title: 'Nomor HP/WA',
    dataIndex: 'phone_number',
    key: 'phone_number',
    width: 130,
  },
  {
    title: 'Email Address',
    dataIndex: 'email_address',
    key: 'email_address',
    width: 180,
  },
  {
    title: 'Join Date',
    dataIndex: 'customer_since',
    key: 'customer_since',
    align: 'center',
    width: 140,
  },
  {
    title: 'Total Invoice',
    dataIndex: 'total_services',
    key: 'total_services',
    align: 'center',
    width: 140,
  },
  {
    title: 'Total Value',
    dataIndex: 'total_spend',
    key: 'total_spend',
    width: 160,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 140,
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <div className='d-flex justify-content-center button-wrapper'>
        <DetailButton />
      </div>
    ),
    fixed: 'right',
    width: 80,
  },
]

const data: DataType[] = [
  {
    key: '1',
    number: 1,
    nama_toko: 'Mitra 10 - BSD',
    costumer_id: '78453992',
    full_name: 'Bpk. Abdi.S',
    phone_number: '08156785432',
    email_address: 'abdi.s@gmail.com',
    customer_since: '2000',
    total_services: '4',
    total_spend: 'Rp.5.000.000',
    total_complaint: '0',
    total_cis_score: '100',
    status: 'DONE',
  },
  {
    key: '2',
    number: 2,
    nama_toko: 'Mitra 10 - Fatmawati',
    costumer_id: '78453992',
    full_name: 'Bpk. Abdi.S',
    phone_number: '08156785432',
    email_address: 'abdi.s@gmail.com',
    customer_since: '2000',
    total_services: '4',
    total_spend: 'Rp.5.000.000',
    total_complaint: '0',
    total_cis_score: '100',
    status: 'DONE',
  },
  {
    key: '3',
    number: 3,
    nama_toko: 'Mitra 10 - PIK',
    costumer_id: '78453992',
    full_name: 'Bpk. Abdi.S',
    phone_number: '08156785432',
    email_address: 'abdi.s@gmail.com',
    customer_since: '2000',
    total_services: '4',
    total_spend: 'Rp.5.000.000',
    total_complaint: '0',
    total_cis_score: '100',
    status: 'DONE',
  },
  {
    key: '4',
    number: 4,
    nama_toko: 'Mitra 10 - BSD',
    costumer_id: '78453992',
    full_name: 'Bpk. Abdi.S',
    phone_number: '08156785432',
    email_address: 'abdi.s@gmail.com',
    customer_since: '2000',
    total_services: '4',
    total_spend: 'Rp.5.000.000',
    total_complaint: '0',
    total_cis_score: '100',
    status: 'ON PROGRESS',
  },
  {
    key: '5',
    number: 5,
    nama_toko: 'Mitra 10 - Fatmawati',
    costumer_id: '78453992',
    full_name: 'Bpk. Abdi.S',
    phone_number: '08156785432',
    email_address: 'abdi.s@gmail.com',
    customer_since: '2000',
    total_services: '4',
    total_spend: 'Rp.5.000.000',
    total_complaint: '0',
    total_cis_score: '100',
    status: 'ON PROGRESS',
  },
  {
    key: '6',
    number: 6,
    nama_toko: 'Mitra 10 - PIK',
    costumer_id: '78453992',
    full_name: 'Bpk. Abdi.S',
    phone_number: '08156785432',
    email_address: 'abdi.s@gmail.com',
    customer_since: '2000',
    total_services: '4',
    total_spend: 'Rp.5.000.000',
    total_complaint: '0',
    total_cis_score: '100',
    status: 'SCHEDULE',
  },
  {
    key: '7',
    number: 7,
    nama_toko: 'Mitra 10 - PIK',
    costumer_id: '78453992',
    full_name: 'Bpk. Abdi.S',
    phone_number: '08156785432',
    email_address: 'abdi.s@gmail.com',
    customer_since: '2000',
    total_services: '4',
    total_spend: 'Rp.5.000.000',
    total_complaint: '0',
    total_cis_score: '100',
    status: 'SCHEDULE',
  },
]

const ViewCostumerHO: React.FC<Props> = ({className}) => {
  return (
    <section id='view-costumer'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <div className='filter-search'>
            <InputGroup>
              <Form.Control placeholder='Filter' className='filter-rtl' />

              <InputGroup.Text className='filter-rtl'>
                <FontAwesomeIcon icon={faSearch} size='sm' />
              </InputGroup.Text>
            </InputGroup>
          </div>

          <div className='table-head-wrapper'>
            <div className='left'>
              <h3>Filter By :</h3>

              <Form.Group as={Row} className='date-filter mb-5'>
                <Form.Label column sm='4'>
                  Start Date :
                </Form.Label>

                <Col sm='8'>
                  <DateRange />
                </Col>
              </Form.Group>
            </div>

            <div className='middle'>
              <div className='select-filter'>
                <h3>Nama Store : </h3>

                <select className='form-select filter filter-order'>
                  <option value='1'>MITRA 10 - BSD</option>
                  <option selected value='2'>
                    MITRA 10 - SBY
                  </option>
                  <option value='3'> MITRA 10 - JAKARTA</option>
                  <option value='4'> MITRA 10 - BANDUNG</option>
                  <option value='5'> MITRA 10 - CIANJUR</option>
                </select>
              </div>
            </div>

            <div className='right'>
              <button className='button-export'>
                <FontAwesomeIcon icon={faFileExcel} size='2xl' className='excel-icon' />
              </button>

              <button className='button-print'>
                <FontAwesomeIcon icon={faPrint} size='2xl' className='print-icon' />
              </button>
            </div>
          </div>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.key}
            scroll={{x: 1700}}
            pagination={{position: ['bottomCenter']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewCostumerHO}
