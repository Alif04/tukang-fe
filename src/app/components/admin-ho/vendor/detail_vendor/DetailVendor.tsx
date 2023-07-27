import React, {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'

import './DetailVendor.css'

import {Form, Table, Button, Row, Col} from 'react-bootstrap'
import {ChartPie} from './components/ChartPie'
import {TableList} from './components/TableList'
import {TableList2} from './components/TableList2'

const DetailVendorHO: FC = () => {
  return (
    <section id='detail-vendor'>
      <div className='card mb-5'>
        <div className='card-body'>
          <Row>
            <Col lg={4}>
              <div className='vendor-profile'>
                <img
                  className='d-block m-auto mb-4'
                  src={toAbsoluteUrl('/media/avatars/300-1.jpg')}
                  alt='Avatar'
                />

                <div className='vendor-information'>
                  <h1>PT ABC</h1>
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className='d-flex flex-column'>
                <div className='stats'>Stats</div>

                <div className='table'>Table 1 </div>
              </div>
            </Col>

            <Col lg={4}>Table 2</Col>
          </Row>
        </div>
      </div>
    </section>
  )
}

export {DetailVendorHO}
