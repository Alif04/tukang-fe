import React, {FC, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import './FormatEmailHO.css'

import Select from 'react-select'
import {Form, Button, Row, Col, Card} from 'react-bootstrap'

interface templateOption {
  value: number | null
  label: string
}

interface referTo {
  value: number | null
  label: string
}

const FormatEmailHO: FC = () => {
  const templateOptions = [
    {value: 'csi', label: 'CSI'},
    {value: 'order_notification', label: 'Order Notification'},
    {value: 'paid_notification', label: 'Paid Notification'},
    {value: 'survey_notification', label: 'Survey Notification'},
    {value: 'work_start_notification', label: 'Work Start Notification'},
    {value: 'work_end_notification', label: 'Work End Notification'},
    {value: 'complaint_accepted_notification', label: 'Complaint Accepted Notification'},
    {value: 'complaint_rejected_notification', label: 'Complaint Rejected Notification'},
    {value: 'refund_notification', label: 'Refund Notification'},
    {value: 'claim_warranty_accepted_notification', label: 'Claim Warranty Accepted Notification'},
    {value: 'claim_warranty_rejected_notification', label: 'Claim Warranty Rejected Notification'},
    {value: 'reschedule_notification', label: 'Reschedule Notification'},
  ]

  const shownTo = [
    {value: 'customer', label: 'Customer'},
    {value: 'vendor', label: 'Vendor'},
  ]

  return (
    <section id='format-email'>
      <Card className='mb-5'>
        <Card.Body>
          <Row>
            <Col>
              <Form.Group as={Row}>
                <Form.Label column md='4'>
                  Email template untuk :
                </Form.Label>

                <Col md={8}>
                  <Select
                    name='template_option'
                    className='form-control p-0'
                    classNamePrefix='select'
                    isSearchable={true}
                    placeholder='Template untuk'
                    options={templateOptions}
                  />
                </Col>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group as={Row}>
                <Form.Label column md='4'>
                  Ditunjukkan kepada :
                </Form.Label>

                <Col md={8}>
                  <Select
                    name='shown_to'
                    className='form-control p-0'
                    classNamePrefix='select'
                    isSearchable={true}
                    placeholder='Ditunjukkan kepada'
                    options={shownTo}
                  />
                </Col>
              </Form.Group>
            </Col>
          </Row>

          <Row className='d-flex justify-content-center'>
            <Form.Group as={Row} className='header-template'>
              <Form.Label className='fs-5' column md='3'>
                Judul Email :
              </Form.Label>

              <Col md={9}>
                <Form.Control type='text' />
              </Col>
            </Form.Group>
          </Row>

          <Row>
            <Col>
              <Form.Control
                className='rich-text'
                as='textarea'
                placeholder='THIS WILL BE  A RICH TEXT EDITOR'
              />
            </Col>
          </Row>

          <div className='d-flex justify-content-center'>
            <Button variant='dark-danger' type='submit'>
              Cancel
            </Button>

            <Button variant='dark-primary' type='submit'>
              Save Template
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {FormatEmailHO}
