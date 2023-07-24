/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import '../../../../app/components/admin-store/order/view_order/ViewOrder.css'

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
  order_id: string
  date_order: string
  item_name: string
  installation_type: string
  payment_status: string
  costumer_id: string
  costumer_name: string
  phone_number: string
  installer_name: string
  order_status: string
}

const NewOrderButton = () => {
  const navigate = useNavigate()

  const handleNewOrder = () => {
    navigate('/order/new-order')
  }

  return (
    <button className='button-new-order' onClick={handleNewOrder}>
      New Order <FontAwesomeIcon icon={faPlus} size='lg' className='plus-icon' />
    </button>
  )
}

const DetailButton = () => {
  const navigate = useNavigate()

  const handleDetail = () => {
    navigate('/order/detail-order')
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
    navigate('/order/update-order')
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
    width: 100,
    className: 'col_order_id',
  },
  {
    title: 'Date Order',
    dataIndex: 'date_order',
    key: 'date_order',
    align: 'center',
    width: 110,
  },
  {
    title: 'Product Name',
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
    title: 'Installer Name',
    dataIndex: 'installer_name',
    key: 'installer_name',
    align: 'left',
    width: 130,
  },
  {
    title: 'Work Order Status',
    dataIndex: 'order_status',
    key: 'order_status',
    align: 'center',
    width: 140,
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
    align: 'center',
    width: 115,
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
    installer_name: 'Jonas',
    order_status: 'ON PROGRESS',
  },
]

const ViewWorkOrder: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-body table-view-order'>
        <div className='table-head-wrapper'>
          <div className='left'>
            <NewOrderButton />
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
          scroll={{x: 1500}}
          pagination={{position: ['bottomCenter']}}
        />
      </div>
    </div>
  )
}

export {ViewWorkOrder}
