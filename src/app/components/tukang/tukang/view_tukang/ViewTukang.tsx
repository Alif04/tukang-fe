/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC} from 'react'

import './ViewTukang.css'

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

interface DataType {
  key: string
  tukang_id: string
  tanggal_join: string
  nama_lengkap: string
  tanggal_lahir: string
  keahlian: string
  ktp: string
  no_telp: string
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
    title: 'Tukang ID',
    dataIndex: 'tukang_id',
    key: 'tukang_id',
    align: 'center',
  },
  {
    title: 'Tanggal Join',
    dataIndex: 'tanggal_join',
    key: 'tanggal_join',
    align: 'center',
  },
  {
    title: 'Nama Lengkap',
    dataIndex: 'nama_lengkap',
    key: 'nama_lengkap',
    align: 'left',
  },
  {
    title: 'Tanggal Lahir ',
    dataIndex: 'tanggal_lahir',
    key: 'tanggal_lahir',
    align: 'center',
  },
  {
    title: 'Keahlian',
    dataIndex: 'keahlian',
    key: 'keahlian',
    align: 'left',
  },
  {
    title: 'KTP',
    dataIndex: 'ktp',
    key: 'ktp',
    align: 'center',
  },
  {
    title: 'No. Telp/WA',
    dataIndex: 'no_telp',
    key: 'no_telp',
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
  },
]

const data: DataType[] = [
  {
    key: '1',
    tukang_id: '78453992',
    tanggal_join: '10/2/2023',
    nama_lengkap: 'Sumanto',
    tanggal_lahir: '20/10/2023',
    keahlian: 'Instalasi Vinyl',
    ktp: '8986747',
    no_telp: '08158374638',
  },
  {
    key: '2',
    tukang_id: '78453992',
    tanggal_join: '10/2/2023',
    nama_lengkap: 'Sumanto',
    tanggal_lahir: '20/10/2023',
    keahlian: 'Instalasi Vinyl',
    ktp: '8986747',
    no_telp: '08158374638',
  },
  {
    key: '3',
    tukang_id: '78453992',
    tanggal_join: '10/2/2023',
    nama_lengkap: 'Sumanto',
    tanggal_lahir: '20/10/2023',
    keahlian: 'Instalasi Vinyl',
    ktp: '8986747',
    no_telp: '08158374638',
  },
  {
    key: '4',
    tukang_id: '78453992',
    tanggal_join: '10/2/2023',
    nama_lengkap: 'Sumanto',
    tanggal_lahir: '20/10/2023',
    keahlian: 'Instalasi Vinyl',
    ktp: '8986747',
    no_telp: '08158374638',
  },
  {
    key: '5',
    tukang_id: '78453992',
    tanggal_join: '10/2/2023',
    nama_lengkap: 'Sumanto',
    tanggal_lahir: '20/10/2023',
    keahlian: 'Instalasi Vinyl',
    ktp: '8986747',
    no_telp: '08158374638',
  },
  {
    key: '6',
    tukang_id: '78453992',
    tanggal_join: '10/2/2023',
    nama_lengkap: 'Sumanto',
    tanggal_lahir: '20/10/2023',
    keahlian: 'Instalasi Vinyl',
    ktp: '8986747',
    no_telp: '08158374638',
  },
  {
    key: '7',
    tukang_id: '78453992',
    tanggal_join: '10/2/2023',
    nama_lengkap: 'Sumanto',
    tanggal_lahir: '20/10/2023',
    keahlian: 'Instalasi Vinyl',
    ktp: '8986747',
    no_telp: '08158374638',
  },
]

const ViewTukangin: FC = () => {
  return (
    <section id='view-tukang'>
      <div className='card'>
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

              <div className='select-filter'>
                <h3>Keahlian : </h3>

                <select className='form-select filter filter-order'>
                  <option value='1'>Instalasi</option>
                  <option selected value='2'>
                    Survey
                  </option>
                </select>
              </div>
            </div>

            <div className='right'>
              <button className='button-export'>
                <FontAwesomeIcon icon={faFileExcel} size='2xl' className='excel-icon' />
              </button>
            </div>
          </div>

          <Table
            className='table-striped-rows'
            bordered
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.key}
            pagination={{position: ['bottomCenter']}}
          />
        </div>
      </div>
    </section>
  )
}

export {ViewTukangin}
