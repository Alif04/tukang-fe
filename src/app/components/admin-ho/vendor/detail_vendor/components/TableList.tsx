import React, {FC} from 'react'

import {Table} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons'

import {useNavigate} from 'react-router-dom'

interface DataType {
  key: React.Key
  nama_jasa: string
  harga_service: string
  area_service: string
}

const NewJASA = () => {
  const navigate = useNavigate()

  const handleNewJASA = () => {
    navigate('/order/new-order')
  }

  return (
    <button className='button-new-quotation' onClick={handleNewJASA}>
      Add New Jasa <FontAwesomeIcon icon={faPlus} size='lg' className='plus-icon' />
    </button>
  )
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Nama Jasa',
    dataIndex: 'nama_jasa',
    key: 'nama_jasa',
    align: 'center',
  },
  {
    title: 'Harga Service',
    dataIndex: 'harga_service',
    key: 'harga_service',
    align: 'center',
  },
  {
    title: 'Area Service',
    dataIndex: 'area_service',
    key: 'area_service',
    align: 'center',
  },
]

const data: DataType[] = [
  {
    key: '1',
    nama_jasa: 'Instalasi AC',
    harga_service: '600.000',
    area_service: 'All',
  },
  {
    key: '2',
    nama_jasa: 'Instalasi AC',
    harga_service: '600.000',
    area_service: 'All',
  },
  {
    key: '3',
    nama_jasa: 'Instalasi AC',
    harga_service: '600.000',
    area_service: 'All',
  },
  {
    key: '4',
    nama_jasa: 'Instalasi AC',
    harga_service: '600.000',
    area_service: 'All',
  },
  {
    key: '5',
    nama_jasa: 'Instalasi AC',
    harga_service: '600.000',
    area_service: 'All',
  },
  {
    key: '6',
    nama_jasa: 'Instalasi AC',
    harga_service: '600.000',
    area_service: 'All',
  },
  {
    key: '7',
    nama_jasa: 'Instalasi AC',
    harga_service: '600.000',
    area_service: 'All',
  },
]

const TableList: FC = () => {
  return (
    <div className='table-view-order'>
      <div className='table-head-wrapper'>
        <Row>
          <Col className='d-flex align-items-center'>
            <h3>JASA Information</h3>
          </Col>

          <Col className='d-flex justify-content-end'>
            <NewJASA />
          </Col>
        </Row>
      </div>

      <Table
        className='table-striped-rows'
        bordered
        columns={columns}
        dataSource={data}
        scroll={{y: 110}}
        rowKey={(record) => record.key}
        pagination={{position: ['bottomRight']}}
      />
    </div>
  )
}

export {TableList}
