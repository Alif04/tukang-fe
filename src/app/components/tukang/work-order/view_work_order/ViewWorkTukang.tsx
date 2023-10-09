/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import './ViewWorkOrder.css'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faBook,
  faPen,
  faTrash,
  faFileExcel,
  faSearch,
  faPrint,
} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

type Props = {
  className: string
}

interface DataType {
  key: string
  order_id: string
  date_order: string
  item_name: string
  installation_type: string
  costumer_name: string
  phone_number: string
  installer_name: string
  order_status: string
}

const DetailButton = () => {
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate('/work-order/detail-work-order')
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
    navigate('/work-order/update-work-order')
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
  },
  {
    title: 'Date Order',
    dataIndex: 'date_order',
    key: 'date_order',
    align: 'center',
  },
  {
    title: 'Product Name',
    dataIndex: 'item_name',
    key: 'item_name',
    align: 'left',
  },
  {
    title: 'Installation Type',
    dataIndex: 'installation_type',
    key: 'installation_type',
    align: 'left',
  },
  {
    title: 'Customer Name',
    dataIndex: 'costumer_name',
    key: 'costumer_name',
    align: 'left',
  },
  {
    title: 'Phone Number',
    dataIndex: 'phone_number',
    key: 'phone_number',
    align: 'center',
  },
  {
    title: 'Installer Name',
    dataIndex: 'installer_name',
    key: 'installer_name',
    align: 'left',
  },
  {
    title: 'Work Order Status',
    dataIndex: 'order_status',
    key: 'order_status',
    align: 'left',
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
    width: 90,
  },
]

const data: DataType[] = [
  {
    key: '1',
    order_id: '78453992',
    date_order: '10/2/2023',
    item_name: 'Water Heater',
    installation_type: 'New set up',
    costumer_name: 'Alia',
    phone_number: '08158374638',
    installer_name: 'Patric',
    order_status: 'DONE',
  },
  {
    key: '2',
    order_id: '78453993',
    date_order: '13/2/2023',
    item_name: 'AC',
    installation_type: 'New set up',
    costumer_name: 'Abdulah',
    phone_number: '08158376565',
    installer_name: 'Jonas',
    order_status: 'DONE',
  },
  {
    key: '3',
    order_id: '78453994',
    date_order: '14/2/2023',
    item_name: 'Water Heater',
    installation_type: 'New set up',
    costumer_name: 'Alice',
    phone_number: '08158300987',
    installer_name: 'Patric',
    order_status: 'ON PROGRESS',
  },
  {
    key: '4',
    order_id: '78453995',
    date_order: '15/2/2023',
    item_name: 'AC',
    installation_type: 'New set up',

    costumer_name: 'Kobe',
    phone_number: '0815833346',
    installer_name: 'Jonas',
    order_status: 'ON PROGRESS',
  },
  {
    key: '5',
    order_id: '78453996',
    date_order: '10/3/2023',
    item_name: 'AC',
    installation_type: 'New set up',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    installer_name: 'Jonas',
    order_status: 'ON PROGRESS',
  },
  {
    key: '6',
    order_id: '78453997',
    date_order: '12/3/2023',
    item_name: 'AC',
    installation_type: 'New set up',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    installer_name: 'Jonas',
    order_status: 'ON PROGRESS',
  },
  {
    key: '7',
    order_id: '78453998',
    date_order: '15/2/2023',
    item_name: 'AC',
    installation_type: 'New set up',
    costumer_name: 'Kobe',
    phone_number: '0815833346',
    installer_name: 'Jonas',
    order_status: 'ON PROGRESS',
  },
]

const ViewWorkTukang: React.FC<Props> = ({className}) => {
  return (
    <section id='view-work-order-tukang'>
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
            </div>

            <div className='middle'>
              <div className='date-filter'>
                <div className='start-date'>
                  <h3>Start Date : </h3>
                  <Form.Control type='date' />
                </div>

                <div className='end-date'>
                  <h3>End Date : </h3>
                  <Form.Control type='date' />
                </div>
              </div>
            </div>

            <div className='right d-flex justify-content-end align-items-center'>
              <div className='select-filter'>
                <h3>Sort Work Order Status : </h3>

                <select className='form-select filter filter-order'>
                  <option selected value='1'>
                    SURVEY
                  </option>
                  <option value='2'>WOREQ</option>
                  <option value='3'>WORESTART</option>
                  <option value='4'>WIP</option>
                  <option value='5'>WORKEND</option>
                  <option value='6'>INVESTIGATE</option>
                  <option value='7'>REWORK</option>
                  <option value='8'>REWORKSTART</option>
                  <option value='9'>RIP</option>
                  <option value='10'>REWORKEND</option>
                  <option value='11'>DONE</option>
                </select>
              </div>

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
            scroll={{x: 1300}}
            pagination={{position: ['bottomCenter']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewWorkTukang}
