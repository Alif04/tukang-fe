import React, {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './FormatEmailHO.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'
import {Form, Button, Row, Col, Card} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'

interface templateOption {
  value: string
  label: string
}

interface referTo {
  value: number | null
  label: string
}

interface emailLayout {
  email_type: string
  welcome_header: string
  greeting_header: string
  contact_detail: string
  terms_details: Array<{
    condition_item: string
  }>
  information_details: Array<{
    information_item: string
  }>
  footer: string
}

const FormatEmailHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Email
  const [selectedEmailType, setSelectedEmailType] = useState<SingleValue<templateOption>>({
    value: '',
    label: '',
  })

  const [emailForm, setEmailForm] = useState<emailLayout>({
    email_type: '',
    welcome_header: '',
    greeting_header: '',
    contact_detail: '',
    terms_details: [
      {
        condition_item: '',
      },
    ],
    information_details: [
      {
        information_item: '',
      },
    ],
    footer: '',
  })

  // Fetch Data Email
  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        await axios
          .get(`${apiUrl}/email`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Access-Control-Allow-Origin': '*',
              'ngrok-skip-browser-warning': 'true',
            },
          })
          .then((response) => {
            const data = response.data.data

            if (data?.email) {
              setEmailForm((prev) => ({
                ...prev,
                welcome_header: data?.welcome_header,
                greeting_header: data?.greeting_header,
                contact_detail: data?.contact_detail,
                footer: data?.footer,
              }))
            }

            if (data?.terms_details) {
              setEmailForm((prev: any) => ({
                ...prev,
                terms_details: data.terms_condition.map((item: any) => ({
                  condition_item: item.condition_item,
                })),
              }))
            }

            if (data?.information_details) {
              setEmailForm((prev: any) => ({
                ...prev,
                information_details: data.information_details.map((item: any) => ({
                  information_item: item.information_item,
                })),
              }))
            }
          })
      } catch (error) {
        console.error(error)
      }
    }

    fetchEmailData()
  }, [])

  // Template Option
  const templateOptions = [
    {value: 'reset_password', label: 'Reset Password'},
    {value: 'order_notification', label: 'Order Notification'},
    {value: 'quotatio _notification', label: 'Quotation Notification'},
    // {value: 'csi', label: 'CSI'},
    // {value: 'paid_notification', label: 'Paid Notification'},
    // {value: 'survey_notification', label: 'Survey Notification'},
    // {value: 'work_start_notification', label: 'Work Start Notification'},
    // {value: 'work_end_notification', label: 'Work End Notification'},
    // {value: 'complaint_accepted_notification', label: 'Complaint Accepted Notification'},
    // {value: 'complaint_rejected_notification', label: 'Complaint Rejected Notification'},
    // {value: 'refund_notification', label: 'Refund Notification'},
    // {value: 'claim_warranty_accepted_notification', label: 'Claim Warranty Accepted Notification'},
    // {value: 'claim_warranty_rejected_notification', label: 'Claim Warranty Rejected Notification'},
    // {value: 'reschedule_notification', label: 'Reschedule Notification'},
  ]

  // Change Select Email Type
  useEffect(() => {
    setEmailForm((prev) => ({
      ...prev,
      email_type: selectedEmailType?.value ?? '',
    }))
  }, [selectedEmailType])

  // Email Form Handler
  const emailFormHandler = (e: any) => {
    setEmailForm({
      ...emailForm,
      [e.target.name]: e.target.value,
    })
  }

  // Email Term & Condition Detail Handler
  const termsConditionFormHandler = (e: any, index: number) => {
    setEmailForm((prev) => {
      const cache = {...prev}
      cache.terms_details[index] = {
        ...cache.terms_details[index],
        [e.target.name]: e.target.value,
      }

      return cache
    })
  }

  // Information Detail Handler
  const informationFormHandler = (e: any, index: number) => {
    setEmailForm((prev) => {
      const cache = {...prev}
      cache.information_details[index] = {
        ...cache.information_details[index],
        [e.target.name]: e.target.value,
      }

      return cache
    })
  }

  // Terms Details
  const addTermsDetails = () => {
    const newDetail = {
      condition_item: '',
    }

    setEmailForm((prev) => {
      const cache = {...prev}
      cache.terms_details.push(newDetail)
      return cache
    })
  }

  const handleRemoveTermsForm = (index: any) => {
    setEmailForm((prev) => {
      const cache = {...prev}
      cache.terms_details.splice(index, 1)
      return cache
    })
  }

  // Information Details
  const addInformationDetails = () => {
    const newDetail = {
      information_item: '',
    }

    setEmailForm((prev) => {
      const cache = {...prev}
      cache.information_details.push(newDetail)
      return cache
    })
  }

  const handleRemoveInformationForm = (index: any) => {
    setEmailForm((prev) => {
      const cache = {...prev}
      cache.information_details.splice(index, 1)
      return cache
    })
  }

  const shownTo = [
    {value: 'customer', label: 'Customer'},
    {value: 'vendor', label: 'Vendor'},
  ]

  // Handle Update Email
  const handleUpdateEmail = async () => {
    setIsLoading(false)

    await axios
      .post(`${apiUrl}/email`, emailForm, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          Swal.fire({
            title: 'Success',
            text: 'Success Update Template',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate(`/home`)
          })

          setIsLoading(false)
        } else {
          setIsLoading(true)

          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })
        }
      })
      .catch((error) => {
        setIsLoading(false)

        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
        })
      })
  }

  const handleCancel = () => {
    navigate('/home')
  }

  return (
    <section id='format-email'>
      <Card className='mb-5'>
        <Card.Body>
          {/* <Row>
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
          </Row> */}

          <Row>
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
                  onChange={(newValue) => setSelectedEmailType(newValue)}
                />
              </Col>
            </Form.Group>

            <Form.Group className='header-template'>
              <Form.Label className='fs-5'>Ucapan Sapaan :</Form.Label>

              <Form.Control
                name='welcome_header'
                type='text'
                value={emailForm.welcome_header}
                onChange={(e) => emailFormHandler(e)}
              />
            </Form.Group>

            <Form.Group className='header-template'>
              <Form.Label className='fs-5'>Ucapan Terimakasih :</Form.Label>

              <Form.Control
                name='greeting_header'
                type='text'
                value={emailForm.greeting_header}
                onChange={(e) => emailFormHandler(e)}
              />
            </Form.Group>

            <Form.Group className='header-template'>
              <Form.Label className='fs-5'>Detail Kontak :</Form.Label>

              <Form.Control
                name='contact_detail'
                as='textarea'
                value={emailForm.contact_detail}
                onChange={(e) => emailFormHandler(e)}
              />
            </Form.Group>

            <Form.Group className='header-template'>
              <Form.Label className='fs-5'>Syarat dan Ketentuan :</Form.Label>

              {emailForm.terms_details.map((element, index) => (
                <Row>
                  <Col md={8}>
                    <Form.Control
                      id={`condition_item-${index}`}
                      name='condition_item'
                      type='text'
                      value={element.condition_item ?? ''}
                      onChange={(e) => termsConditionFormHandler(e, index)}
                    />
                  </Col>

                  <Col md={4}>
                    <div className='d-flex'>
                      <Button
                        className='btn-add'
                        variant='primary'
                        onClick={() => addTermsDetails()}
                      >
                        <span className='icon'>
                          <FontAwesomeIcon icon={faTrash} />
                        </span>
                      </Button>

                      <Button
                        className='btn-remove'
                        variant='danger'
                        onClick={() => handleRemoveTermsForm(index)}
                      >
                        <span className='icon'>
                          <FontAwesomeIcon icon={faTrash} />
                        </span>
                      </Button>
                    </div>
                  </Col>
                </Row>
              ))}
            </Form.Group>

            <Form.Group className='header-template'>
              <Form.Label className='fs-5'>Detail Informasi :</Form.Label>

              {emailForm.information_details.map((element, index) => (
                <Row>
                  <Col md={8}>
                    <Form.Control
                      id={`information_item-${index}`}
                      name='information_item'
                      type='text'
                      value={element.information_item ?? ''}
                      onChange={(e) => informationFormHandler(e, index)}
                    />
                  </Col>

                  <Col md={4}>
                    <div className='d-flex'>
                      <Button
                        className='btn-add'
                        variant='primary'
                        onClick={() => addInformationDetails()}
                      >
                        <span className='icon'>
                          <FontAwesomeIcon icon={faTrash} />
                        </span>
                      </Button>

                      <Button
                        className='btn-remove'
                        variant='danger'
                        onClick={() => handleRemoveInformationForm(index)}
                      >
                        <span className='icon'>
                          <FontAwesomeIcon icon={faTrash} />
                        </span>
                      </Button>
                    </div>
                  </Col>
                </Row>
              ))}
            </Form.Group>

            <Form.Group className='header-template'>
              <Form.Label className='fs-5'>Footer :</Form.Label>

              <Form.Control
                name='footer'
                type='text'
                value={emailForm.footer}
                onChange={(e) => emailFormHandler(e)}
              />
            </Form.Group>
          </Row>

          <div className='d-flex justify-content-center'>
            <Button variant='dark-danger' type='submit' onClick={() => handleCancel()}>
              Cancel
            </Button>

            <Button variant='dark-primary' type='submit' onClick={() => handleUpdateEmail()}>
              {isLoading ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {FormatEmailHO}
