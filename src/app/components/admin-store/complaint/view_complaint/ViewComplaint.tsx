/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import './ViewComplaint.css'

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
  faFire,
} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

type Props = {
  className: string
}

interface DataType {
  key: string
  order_id: string
  date_order: string
  product_name: string
  installation_type: string
  costumer_name: string
  phone_number: string
  installer_name: string
  work_status: string
  complaint_date: string
  complaint_status: string
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

const EditButton = () => {
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate('/complaint/update-complaint')
  }

  return (
    <a className='button-edit' onClick={handleEdit}>
      <FontAwesomeIcon icon={faPen} size='sm' />
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
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    width: 120,
  },
  {
    title: 'Date Order',
    dataIndex: 'date_order',
    key: 'date_order',
    align: 'center',
    width: 130,
  },
  {
    title: 'Product Name',
    dataIndex: 'product_name',
    key: 'product_name',
    width: 150,
  },
  {
    title: 'Installation Type',
    dataIndex: 'installation_type',
    key: 'installation_type',
  },
  {
    title: 'Customer Name',
    dataIndex: 'costumer_name',
    key: 'costumer_name',
    width: 180,
  },
  {
    title: 'Phone Number',
    dataIndex: 'phone_number',
    key: 'phone_number',
  },
  {
    title: 'Installer Name',
    dataIndex: 'installer_name',
    key: 'installer_name',
  },
  {
    title: 'Work Status',
    dataIndex: 'work_status',
    key: 'work_status',
    className: 'col-work-status',
  },
  {
    title: 'Complaint Date',
    dataIndex: 'complaint_date',
    key: 'complaint_date',
    className: 'col-complaint-date',
  },
  {
    title: 'Complaint Status',
    dataIndex: 'complaint_status',
    key: 'complaint_status',
    className: 'col-complaint-status',
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <div className='button-wrapper'>
        <DetailButton />
        <EditButton />
        <DeleteButton />
      </div>
    ),
    fixed: 'right',
    width: 110,
  },
]

const data: DataType[] = [
  {
    key: '1',
    order_id: '78453992',
    date_order: '10/2/2023',
    product_name: 'Water Heater',
    installation_type: 'New set up',
    costumer_name: 'Alia',
    phone_number: '08158374638',
    installer_name: 'Patric',
    work_status: 'DONE',
    complaint_date: '11/2/2023',
    complaint_status: 'RECEIVED',
  },
  {
    key: '2',
    order_id: '78453993',
    date_order: '13/2/2023',
    product_name: 'AC',
    installation_type: 'New set up',
    costumer_name: 'Abdulah',
    phone_number: '08158376565',
    installer_name: 'Jonas',
    work_status: 'DONE',
    complaint_date: '11/2/2023',
    complaint_status: 'IN PROGRESS',
  },
  {
    key: '3',
    order_id: '78453994',
    date_order: '14/2/2023',
    product_name: 'Water Heater',
    installation_type: 'New set up',
    costumer_name: 'Alice',
    phone_number: '08158300987',
    installer_name: 'Patric',
    work_status: 'ON PROGRESS',
    complaint_date: '11/2/2023',
    complaint_status: 'IN PROGRESS',
  },
  {
    key: '4',
    order_id: '78453995',
    date_order: '15/2/2023',
    product_name: 'AC',
    installation_type: 'New set up',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    installer_name: 'Jonas',
    work_status: 'ON PROGRESS',
    complaint_date: '11/2/2023',
    complaint_status: 'IN PROGRESS',
  },
]

const ViewComplaintStore: React.FC<Props> = ({className}) => {
  return (
    <section id='view-complaint'>
      <div className={`card ${className}`}>
        <div className='card-body'>
          <div className='table-head-wrapper'>
            <div className='left'>
              <NewComplaintButton />
            </div>

            <div className='right'>
              <div className='filter-search'>
                <InputGroup>
                  <InputGroup.Text className='filter-ltr'>
                    <FontAwesomeIcon icon={faSearch} size='sm' />
                  </InputGroup.Text>

                  <Form.Control placeholder='Filter' className='filter-ltr' />
                </InputGroup>
              </div>

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
            scroll={{x: 1700}}
            pagination={{position: ['bottomCenter']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewComplaintStore}
