import React, {useState, useEffect, FC} from 'react'

import {TotalOrderVendor} from './components/TotalOrderVendor'
import {TotalWorkVendor} from './components/TotalWorkVendor'
import {TotalComplaintVendor} from './components/TotalComplaintVendor'
import {ChartBarOrderVendor} from './components/ChartBarOrderVendor'
import {ChartLineSurveyVendor} from './components/ChartLineSurveyVendor'
import {ChartLineComplaintVendor} from './components/ChartLineComplaintVendor'
import {ChartDonutComplaintVendor} from './components/ChartDonutComplaintVendor'
import {ChartDonutWorkVendor} from './components/ChartDonutWorkVendor'

import axios from 'axios'
import {DatePicker} from 'antd'
import {Row, Col} from 'react-bootstrap'

const {RangePicker} = DatePicker

const DashboardVendor: FC = () => {
  return (
    <>
      <Row className=' gy-5 g-xl-8'>
        <Col xxl={4}>
          <TotalOrderVendor className='card-xl-stretch mb-5 mb-xl-8' chartHeight='240px' />
        </Col>
        <Col xxl={4}>
          <TotalWorkVendor className='card-xl-stretch mb-5 mb-xl-8' chartHeight='240px' />
        </Col>
        <Col xxl={4}>
          <TotalComplaintVendor className='card-xl-stretch mb-5 mb-xl-8' chartHeight='270px' />
        </Col>
      </Row>

      <Row className=' gy-5 g-xl-8'>
        <Col xl={4}>
          <ChartBarOrderVendor className='card-xl-stretch mb-xl-8' />
        </Col>
        <Col xl={4}>
          <ChartLineSurveyVendor className='card-xl-stretch mb-xl-8' />
        </Col>
        <Col xl={4}>
          <ChartLineComplaintVendor className='card-xl-stretch mb-5 mb-xl-8' />
        </Col>
      </Row>

      <Row className=' gy-5 g-xl-8'>
        <Col xl={4}>
          <ChartDonutComplaintVendor className='card-xl-stretch mb-xl-8' chartHeight='300px' />
        </Col>
        <Col xl={4}>
          <ChartDonutWorkVendor className='card-xl-stretch mb-xl-8' chartHeight='300px' />
        </Col>
      </Row>
    </>
  )
}

export {DashboardVendor}
