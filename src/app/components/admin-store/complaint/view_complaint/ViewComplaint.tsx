/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import './ViewComplaint.css'

import {Table, DatePicker} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Form, InputGroup, Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faPen, faTrash, faFilter, faSearch, faFire} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

type Props = {
  className: string
}

interface DataType {
  key: string
  complaint_id: string
  assign_from: string
  order_id: string
  date_order: string
  no_member: string
  costumer_name: string
  phone_number: string
  installation_type: string
  order_status: string
  work_status: string
  complaint_date: string
  umur_complaint: string
  complaint_status: string
}

const {RangePicker} = DatePicker

const DateRange = () => {
  return <RangePicker className='date-range ms-3' />
}

const NewComplaintButton = () => {
  const navigate = useNavigate()

  const handleNewComplaint = () => {
    navigate('/complaint/new-complaint')
  }

  return (
    <button className='button-new-complaint' onClick={handleNewComplaint}>
      New Complaint <FontAwesomeIcon icon={faFire} size='lg' className='plus-icon' />
    </button>
  )
}

const DetailButton = () => {
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate('/complaint/detail-complaint')
  }

  return (
    <a className='button-detail' onClick={handleDetail}>
      <FontAwesomeIcon icon={faBook} size='sm' />
    </a>
  )
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Complaint ID',
    dataIndex: 'complaint_id',
    key: 'complaint_id',
    align: 'center',
    width: 120,
  },
  {
    title: 'Assign From',
    dataIndex: 'assign_from',
    key: 'assign_from',
    align: 'center',
    width: 120,
  },
  {
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    width: 120,
  },
  {
    title: 'Order Date',
    dataIndex: 'date_order',
    key: 'date_order',
    align: 'center',
    width: 130,
  },
  {
    title: 'No Member',
    dataIndex: 'no_member',
    key: 'no_member',
    align: 'center',
    width: 130,
  },
  {
    title: 'Customer Name',
    dataIndex: 'costumer_name',
    key: 'costumer_name',
    width: 150,
  },
  {
    title: 'Phone Number',
    dataIndex: 'phone_number',
    key: 'phone_number',
    width: 160,
  },
  {
    title: 'Installation Type',
    dataIndex: 'installation_type',
    key: 'installation_type',
    width: 180,
  },
  {
    title: 'Order Status',
    dataIndex: 'order_status',
    key: 'order_status',
    width: 180,
  },
  {
    title: 'Work Status',
    dataIndex: 'work_status',
    key: 'work_status',
    className: 'col-work-status',
    width: 180,
  },
  {
    title: 'Complaint Date',
    dataIndex: 'complaint_date',
    key: 'complaint_date',
    className: 'col-complaint-date',
    width: 180,
  },
  {
    title: 'Umur Complaint',
    dataIndex: 'umur_complaint',
    key: 'umur_complaint',
    className: 'col-complaint-date',
    width: 180,
  },
  {
    title: 'Complaint Status',
    dataIndex: 'complaint_status',
    key: 'complaint_status',
    className: 'col-complaint-status',
    width: 180,
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <div className='button-wrapper d-flex justify-content-center'>
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
    complaint_id: '78453992',
    assign_from: 'HO',
    order_id: '78453992',
    date_order: '10/2/2023',
    no_member: '78453992',
    costumer_name: 'Alia',
    phone_number: '08158374638',
    installation_type: 'Water Heater',
    order_status: 'New set up',
    work_status: 'DONE',
    complaint_date: '11/2/2023',
    umur_complaint: '24 jam',
    complaint_status: 'RECEIVED',
  },
  {
    key: '2',
    complaint_id: '78453992',
    assign_from: 'HO',
    order_id: '78453992',
    date_order: '12/2/2023',
    no_member: '78453992',
    costumer_name: 'Abdul',
    phone_number: '08158374638',
    installation_type: 'Water Heater',
    order_status: 'New set up',
    work_status: 'DONE',
    complaint_date: '11/2/2023',
    umur_complaint: '24 jam',
    complaint_status: 'RECEIVED',
  },
  {
    key: '3',
    complaint_id: '78453992',
    assign_from: 'HO',
    order_id: '78453992',
    date_order: '13/2/2023',
    no_member: '78453992',
    costumer_name: 'Ahmad',
    phone_number: '08158374638',
    installation_type: 'AC',
    order_status: 'New set up',
    work_status: 'DONE',
    complaint_date: '11/2/2023',
    umur_complaint: '24 jam',
    complaint_status: 'RECEIVED',
  },
  {
    key: '4',
    complaint_id: '78453992',
    assign_from: 'STORE',
    order_id: '78453992',
    date_order: '15/2/2023',
    no_member: '78453992',
    costumer_name: 'Jean',
    phone_number: '08158374638',
    installation_type: 'Ubin',
    order_status: 'New set up',
    work_status: 'DONE',
    complaint_date: '11/2/2023',
    umur_complaint: '24 jam',
    complaint_status: 'RECEIVED',
  },
]

const ViewComplaintStore: React.FC<Props> = ({className}) => {
  return (
    <section id='view-complaint'>
      <div className={`card ${className}`}>
        <div className='card-body'>
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
            scroll={{x: 1700}}
            pagination={{position: ['bottomCenter']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewComplaintStore}
