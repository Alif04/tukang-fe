import React, {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './DetailCostumers.css'

import {Table, Rate} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import {Row, Col, Form, Tabs, Tab} from 'react-bootstrap'

interface DataTypeOrder {
  key: string
  number: number
  order_id: number
  tanggal: string
}

const columnsOrder: ColumnsType<DataTypeOrder> = [
  {
    title: 'No',
    dataIndex: 'number',
    key: 'number',
    align: 'center',
    width: 10,
  },
  {
    title: 'Order ID',
    dataIndex: 'order_id',
    key: 'order_id',
    align: 'center',
    width: 250,
  },
  {
    title: 'Tanggal',
    dataIndex: 'tanggal',
    key: 'tanggal',
  },
]

const dataOrder: DataTypeOrder[] = [
  {
    key: '1',
    number: 1,
    order_id: 123344,
    tanggal: '20/10/2023',
  },
  {
    key: '2',
    number: 2,
    order_id: 123344,
    tanggal: '20/10/2023',
  },
  {
    key: '3',
    number: 3,
    order_id: 123344,
    tanggal: '20/10/2023',
  },
  {
    key: '4',
    number: 4,
    order_id: 123344,
    tanggal: '20/10/2023',
  },
  {
    key: '5',
    number: 5,
    order_id: 123344,
    tanggal: '20/10/2023',
  },
  {
    key: '6',
    number: 6,
    order_id: 123344,
    tanggal: '20/10/2023',
  },
  {
    key: '7',
    number: 7,
    order_id: 123344,
    tanggal: '20/10/2023',
  },
]

interface DataTypeComplaint {
  key: string
  number: number
  complaint_id: number
  tanggal: string
}

const columnsComplaint: ColumnsType<DataTypeComplaint> = [
  {
    title: 'No',
    dataIndex: 'number',
    key: 'number',
    align: 'center',
    width: 10,
  },
  {
    title: 'Complaint ID',
    dataIndex: 'complaint_id',
    key: 'complaint_id',
    align: 'center',
    width: 250,
  },
  {
    title: 'Tanggal',
    dataIndex: 'tanggal',
    key: 'tanggal',
  },
]

const dataComplaint: DataTypeComplaint[] = [
  {
    key: '1',
    number: 1,
    complaint_id: 123344,
    tanggal: '20/10/2023',
  },
  {
    key: '2',
    number: 2,
    complaint_id: 123344,
    tanggal: '20/10/2023',
  },
  {
    key: '3',
    number: 3,
    complaint_id: 123344,
    tanggal: '20/10/2023',
  },
  {
    key: '4',
    number: 4,
    complaint_id: 123344,
    tanggal: '20/10/2023',
  },
  {
    key: '5',
    number: 5,
    complaint_id: 123344,
    tanggal: '20/10/2023',
  },
  {
    key: '6',
    number: 6,
    complaint_id: 123344,
    tanggal: '20/10/2023',
  },
  {
    key: '7',
    number: 7,
    complaint_id: 123344,
    tanggal: '20/10/2023',
  },
]

const DetailCostumerHO: FC = () => {
  return (
    <section id='detail-costumer'>
      <Row className='row-1'>
        <Col xxl={3} xl={3} lg={3} md={3} sm={12}>
          <i className='bi bi-person-circle'></i>
        </Col>

        <Col xxl={9} xl={9} lg={9} md={9} sm={12}>
          <div className='costumer-profile'>
            <h1 className='fs-1 mb-3'>Lia Amalia</h1>
            <h3 className='fs-2 fst-3 mb-3 text-muted'>12198764</h3>
            <p className='fs-4 mb-1'>Customer of : Mitra 10-BSD</p>
            <p className='fs-4 text-muted mb-1'>Rating</p>

            <Rate />
          </div>
        </Col>
      </Row>

      <Row className='row-2 mb-3'>
        <Col xxl={3} xl={3} lg={12} md={12} sm={12} className='mb-5'>
          <div className='basic-info'>
            <hr />

            <div className='d-flex'>
              <i className='bi bi-person-fill'></i>
              <p>About </p>
            </div>

            <div className='data'>
              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Address :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control
                    plaintext
                    readOnly
                    as='textarea'
                    defaultValue='Rs. Fatmawati No.39 12150 Jakarta Selatan DKI Jakarta'
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Phone :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control plaintext readOnly defaultValue='0865-765-8976' />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Email :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control plaintext readOnly defaultValue='lia.amalia@outlook.com' />
                </Col>
              </Form.Group>
            </div>
          </div>
        </Col>

        <Col xxl={9} xl={9} lg={12} md={12} sm={12} className='mb-5'>
          <div className='tab'>
            <div className='tab-title'>
              <div className='title'>
                <i className='bi bi-person-fill'></i>
                <p>About</p>
              </div>
            </div>

            <div className='data-diri'>
              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Costumer Sejak :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control plaintext readOnly type='date' />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm='4'>
                  Total Invoice :
                </Form.Label>

                <Col sm='8'>
                  <Form.Control plaintext readOnly defaultValue='29' />
                </Col>
              </Form.Group>
            </div>
          </div>
        </Col>
      </Row>

      <Row className='row-3'>
        <Col xxl={3} xl={3} lg={12} md={12} sm={12}></Col>

        <Col xxl={9} xl={9} lg={12} md={12} sm={12}>
          <Tabs fill defaultActiveKey={1} className='navtab-detail-costumer'>
            <Tab eventKey={1} title='Historical Pemesanan' className='tab-1'>
              <Table
                className='mt-3'
                bordered
                columns={columnsOrder}
                dataSource={dataOrder}
                rowKey={(record) => record.key}
                pagination={{position: ['bottomCenter']}}
              />
            </Tab>

            <Tab eventKey={2} title='Historical Pengaduan' className='tab-2'>
              <Table
                className='mt-3'
                bordered
                columns={columnsComplaint}
                dataSource={dataComplaint}
                rowKey={(record) => record.key}
                pagination={{position: ['bottomCenter']}}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </section>
  )
}

export {DetailCostumerHO}
