import React, {FC} from 'react'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

interface DataType {
  key: React.Key
  pic_name: string
  phone_number: string
  email_address: string
  dept: string
  position: string
}

const NewPIC = () => {
  const navigate = useNavigate()

  const handleNewPIC = () => {
    navigate('/order/new-order')
  }

  return (
    <button className='button-new-quotation' onClick={handleNewPIC}>
      Add New PIC <FontAwesomeIcon icon={faPlus} size='lg' className='plus-icon' />
    </button>
  )
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Nama PIC',
    dataIndex: 'pic_name',
    key: 'pic_name',
    align: 'center',
  },
  {
    title: 'Nomor Telepon / WA',
    dataIndex: 'phone_number',
    key: 'phone_number',
    align: 'center',
  },
  {
    title: 'Email',
    dataIndex: 'email_address',
    key: 'email_address',
    align: 'left',
  },
  {
    title: 'Dept',
    dataIndex: 'dept',
    key: 'dept',
    align: 'left',
  },
  {
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
    align: 'center',
  },
]

const data: DataType[] = [
  {
    key: '1',
    pic_name: 'Indira',
    phone_number: '09430494',
    email_address: 'indira@pt.abc.com',
    dept: 'Finance',
    position: 'Manager',
  },
  {
    key: '2',
    pic_name: 'Taufik',
    phone_number: '09430494',
    email_address: 'taufik@pt.abc.com',
    dept: 'Ops',
    position: 'Senior Manager',
  },
  {
    key: '3',
    pic_name: 'Taufik',
    phone_number: '09430494',
    email_address: 'taufik@pt.abc.com',
    dept: 'Ops',
    position: 'Senior Manager',
  },
  {
    key: '4',
    pic_name: 'Taufik',
    phone_number: '09430494',
    email_address: 'taufik@pt.abc.com',
    dept: 'Ops',
    position: 'Senior Manager',
  },
  {
    key: '5',
    pic_name: 'Taufik',
    phone_number: '09430494',
    email_address: 'taufik@pt.abc.com',
    dept: 'Ops',
    position: 'Senior Manager',
  },
  {
    key: '6',
    pic_name: 'Taufik',
    phone_number: '09430494',
    email_address: 'taufik@pt.abc.com',
    dept: 'Ops',
    position: 'Senior Manager',
  },
  {
    key: '7',
    pic_name: 'Taufik',
    phone_number: '09430494',
    email_address: 'taufik@pt.abc.com',
    dept: 'Ops',
    position: 'Senior Manager',
  },
  {
    key: '8',
    pic_name: 'Taufik',
    phone_number: '09430494',
    email_address: 'taufik@pt.abc.com',
    dept: 'Ops',
    position: 'Senior Manager',
  },
  {
    key: '9',
    pic_name: 'Taufik',
    phone_number: '09430494',
    email_address: 'taufik@pt.abc.com',
    dept: 'Ops',
    position: 'Senior Manager',
  },
]

const TableList2: FC = () => {
  return (
    <div className='table-view-order'>
      <div className='table-head-wrapper'>
        <Row>
          <Col className='d-flex align-items-center'>
            <h3>PIC & Tukang Information</h3>
          </Col>

          <Col className='d-flex justify-content-end'>
            <NewPIC />
          </Col>
        </Row>
      </div>

      <Table
        className='table-striped-rows'
        bordered
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.key}
        tableLayout='auto'
        scroll={{x: 'max-content'}}
        pagination={{position: ['bottomRight']}}
      />
    </div>
  )
}

export {TableList2}
