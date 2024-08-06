/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import './ViewCostumer.css'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faPen,
  faTrash,
  faFileExcel,
  faSearch,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

type Props = {
  className: string
}

interface DataType {
  key: string
  costumer_id: string
  full_name: string
  phone_number: string
  email_address: string
  address: string
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

const DeleteButton = () => (
  <a className='button-delete'>
    <FontAwesomeIcon icon={faTrash} size='sm' />
  </a>
)

const columns: ColumnsType<DataType> = [
  {
    title: 'Customer ID',
    dataIndex: 'costumer_id',
    key: 'costumer_id',
    width: 130,
    align: 'center',
  },
  {
    title: 'Full Name',
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
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width: 200,
  },
  {
    title: 'Customer Since',
    dataIndex: 'customer_since',
    key: 'customer_since',
    align: 'center',
    width: 140,
  },
  {
    title: 'Total Services',
    dataIndex: 'total_services',
    key: 'total_services',
    align: 'center',
    width: 140,
  },
  {
    title: 'Total Spend',
    dataIndex: 'total_spend',
    key: 'total_spend',
    width: 160,
  },
  {
    title: 'Total Complaint',
    dataIndex: 'total_complaint',
    key: 'total_complaint',
    width: 160,
  },
  {
    title: 'Total CIS Score',
    dataIndex: 'total_cis_score',
    key: 'total_cis_score',
    width: 140,
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
      <div className='button-wrapper'>
        <DetailButton />
        <DeleteButton />
      </div>
    ),
    fixed: 'right',
    width: 90,
  },
]

const data: DataType[] = [
  {
    key: '1',
    costumer_id: '78453992',
    full_name: 'Bpk. Abdi.S',
    phone_number: '08156785432',
    email_address: 'abdi.s@gmail.com',
    address: 'jl. Kenanga no.2',
    customer_since: '2000',
    total_services: '4',
    total_spend: 'Rp.5.000.000',
    total_complaint: '0',
    total_cis_score: '100',
    status: 'ACTIVE',
  },
  {
    key: '2',
    costumer_id: '78453992',
    full_name: 'Bpk. Abdi.S',
    phone_number: '08156785432',
    email_address: 'abdi.s@gmail.com',
    address: 'jl. Kenanga no.2',
    customer_since: '2000',
    total_services: '4',
    total_spend: 'Rp.5.000.000',
    total_complaint: '0',
    total_cis_score: '100',
    status: 'ACTIVE',
  },
  {
    key: '3',
    costumer_id: '78453992',
    full_name: 'Bpk. Abdi.S',
    phone_number: '08156785432',
    email_address: 'abdi.s@gmail.com',
    address: 'jl. Kenanga no.2',
    customer_since: '2000',
    total_services: '4',
    total_spend: 'Rp.5.000.000',
    total_complaint: '0',
    total_cis_score: '100',
    status: 'ACTIVE',
  },
  {
    key: '4',
    costumer_id: '78453992',
    full_name: 'Bpk. Abdi.S',
    phone_number: '08156785432',
    email_address: 'abdi.s@gmail.com',
    address: 'jl. Kenanga no.2',
    customer_since: '2000',
    total_services: '4',
    total_spend: 'Rp.5.000.000',
    total_complaint: '0',
    total_cis_score: '100',
    status: 'ACTIVE',
  },
  {
    key: '5',
    costumer_id: '78453992',
    full_name: 'Bpk. Abdi.S',
    phone_number: '08156785432',
    email_address: 'abdi.s@gmail.com',
    address: 'jl. Kenanga no.2',
    customer_since: '2000',
    total_services: '4',
    total_spend: 'Rp.5.000.000',
    total_complaint: '0',
    total_cis_score: '100',
    status: 'ACTIVE',
  },
  {
    key: '6',
    costumer_id: '78453992',
    full_name: 'Bpk. Abdi.S',
    phone_number: '08156785432',
    email_address: 'abdi.s@gmail.com',
    address: 'jl. Kenanga no.2',
    customer_since: '2000',
    total_services: '4',
    total_spend: 'Rp.5.000.000',
    total_complaint: '0',
    total_cis_score: '100',
    status: 'ACTIVE',
  },
  {
    key: '7',
    costumer_id: '78453992',
    full_name: 'Bpk. Abdi.S',
    phone_number: '08156785432',
    email_address: 'abdi.s@gmail.com',
    address: 'jl. Kenanga no.2',
    customer_since: '2000',
    total_services: '4',
    total_spend: 'Rp.5.000.000',
    total_complaint: '0',
    total_cis_score: '100',
    status: 'ACTIVE',
  },
]

const ViewCostumerStore: React.FC<Props> = ({className}) => {
  return (
    <section id='view-costumer'>
      <div className={`card ${className}`}>
        <div className='card-body table-view-order'>
          <div className='table-head-wrapper'>
            <div className='left'>
              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control placeholder='Filter' className='filter-ltr' />
                </InputGroup>
              </div>
            </div>

            <div className='right'>
              <div className='select-filter'>
                <select className='form-select filter filter-one'>
                  <option selected>All</option>
                  <option value='1'>One</option>
                  <option value='2'>Two</option>
                  <option value='3'>Three</option>
                </select>

                <select className='form-select filter filter-two'>
                  <option selected>All</option>
                  <option value='1'>One</option>
                  <option value='2'>Two</option>
                  <option value='3'>Three</option>
                </select>

                <select className='form-select filter filter-three'>
                  <option selected>All</option>
                  <option value='1'>One</option>
                  <option value='2'>Two</option>
                  <option value='3'>Three</option>
                </select>

                <select className='form-select filter filter-four'>
                  <option selected>All</option>
                  <option value='1'>One</option>
                  <option value='2'>Two</option>
                  <option value='3'>Three</option>
                </select>
              </div>

              <button className='button-export'>
                Export To Excel
                <FontAwesomeIcon icon={faFileExcel} size='lg' className='excel-icon' />
              </button>
            </div>
          </div>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.key}
            tableLayout='auto'
            scroll={{x: 'max-content'}}
            pagination={{position: ['bottomCenter']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewCostumerStore}
