import React, {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './FormatEmailHO.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'
import {Form, Button, Row, Col, Card} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faTrash} from '@fortawesome/free-solid-svg-icons'

interface templateOption {
  value: string
  label: string
}

interface emailLayout {
  email_type: string
  greetings: string
  footer: string
  welcome_header: string
  // contact_detail: string
  terms_detail: Array<{
    term: string
  }>
  information_detail: Array<{
    information: string
  }>
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
    greetings: '',
    footer: '',
    welcome_header: '',
    // contact_detail: '',
    terms_detail: [
      {
        term: '',
      },
    ],
    information_detail: [
      {
        information: '',
      },
    ],
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
                greetings: data?.greetings,
                contact_detail: data?.contact_detail,
                footer: data?.footer,
              }))
            }

            if (data?.terms_detail) {
              setEmailForm((prev: any) => ({
                ...prev,
                terms_detail: data.terms_detail.map((item: any) => ({
                  term: item.term,
                })),
              }))
            }

            if (data?.information_detail) {
              setEmailForm((prev: any) => ({
                ...prev,
                information_detail: data.information_detail.map((item: any) => ({
                  information: item.information,
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
    {value: 'order', label: 'Order Notification'},
    {value: 'complaint', label: 'Complaint Notification'},
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
      cache.terms_detail[index] = {
        ...cache.terms_detail[index],
        [e.target.name]: e.target.value,
      }

      return cache
    })
  }

  // Information Detail Handler
  const informationFormHandler = (e: any, index: number) => {
    setEmailForm((prev) => {
      const cache = {...prev}
      cache.information_detail[index] = {
        ...cache.information_detail[index],
        [e.target.name]: e.target.value,
      }

      return cache
    })
  }

  // Terms Details
  const addTermsDetails = () => {
    const newDetail = {
      term: '',
    }

    setEmailForm((prev) => {
      const cache = {...prev}
      cache.terms_detail.push(newDetail)
      return cache
    })
  }

  const handleRemoveTermsForm = (index: any) => {
    setEmailForm((prev) => {
      const cache = {...prev}
      cache.terms_detail.splice(index, 1)
      return cache
    })
  }

  // Information Details
  const addInformationDetails = () => {
    const newDetail = {
      information: '',
    }

    setEmailForm((prev) => {
      const cache = {...prev}
      cache.information_detail.push(newDetail)
      return cache
    })
  }

  const handleRemoveInformationForm = (index: any) => {
    setEmailForm((prev) => {
      const cache = {...prev}
      cache.information_detail.splice(index, 1)
      return cache
    })
  }
  // Handle Update Email
  const handleCreateEmailMessages = async () => {
    setIsLoading(false)

    await axios
      .post(`${apiUrl}/email-messages`, emailForm, {
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
          <Row>
            <Form.Group className='header-template mb-3'>
              <Form.Label className='fs-5'> Email template untuk :</Form.Label>

              <Select
                name='template_option'
                className='form-control p-0'
                classNamePrefix='select'
                isSearchable={true}
                placeholder='Template untuk'
                options={templateOptions}
                onChange={(newValue) => setSelectedEmailType(newValue)}
              />
            </Form.Group>

            <Form.Group className='header-template mb-3'>
              <Form.Label className='fs-5'>Ucapan Sapaan :</Form.Label>

              <Form.Control
                name='welcome_header'
                as='textarea'
                value={emailForm.welcome_header}
                onChange={(e) => emailFormHandler(e)}
              />
            </Form.Group>

            <Form.Group className='header-template mb-3'>
              <Form.Label className='fs-5'>Ucapan Terimakasih :</Form.Label>

              <Form.Control
                name='greetings'
                as='textarea'
                value={emailForm.greetings}
                onChange={(e) => emailFormHandler(e)}
              />
            </Form.Group>

            {/* <Form.Group className='header-template mb-3'>
              <Form.Label className='fs-5'>Detail Kontak :</Form.Label>

              <Form.Control
                name='contact_detail'
                as='textarea'
                value={emailForm.contact_detail}
                onChange={(e) => emailFormHandler(e)}
              />
            </Form.Group> */}

            <Form.Group className='header-template mb-3'>
              <Form.Label className='fs-5'>Syarat dan Ketentuan :</Form.Label>

              {emailForm.terms_detail.map((element, index) => (
                <Row>
                  <Col className='d-flex justify-content-between'>
                    <Form.Control
                      id={`term-${index}`}
                      name='term'
                      className='me-2'
                      type='text'
                      value={element.term ?? ''}
                      onChange={(e) => termsConditionFormHandler(e, index)}
                    />

                    <div className='d-flex'>
                      <Button
                        className='btn-add me-1'
                        variant='primary'
                        onClick={() => addTermsDetails()}
                      >
                        <span className='icon'>
                          <FontAwesomeIcon icon={faPlus} />
                        </span>
                      </Button>

                      {emailForm.terms_detail.length > 1 && (
                        <Button
                          className='btn-remove ms-1'
                          variant='danger'
                          onClick={() => handleRemoveTermsForm(index)}
                        >
                          <span className='icon'>
                            <FontAwesomeIcon icon={faTrash} />
                          </span>
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              ))}
            </Form.Group>

            <Form.Group className='header-template mb-3'>
              <Form.Label className='fs-5'>Detail Informasi :</Form.Label>

              {emailForm.information_detail.map((element, index) => (
                <Row>
                  <Col className='d-flex justify-content-between'>
                    <Form.Control
                      id={`information-${index}`}
                      className='me-2'
                      name='information'
                      type='text'
                      value={element.information ?? ''}
                      onChange={(e) => informationFormHandler(e, index)}
                    />

                    <div className='d-flex'>
                      <Button
                        className='btn-add me-1'
                        variant='primary'
                        onClick={() => addInformationDetails()}
                      >
                        <span className='icon'>
                          <FontAwesomeIcon icon={faPlus} />
                        </span>
                      </Button>

                      {emailForm.information_detail.length > 1 && (
                        <Button
                          className='btn-remove ms-1'
                          variant='danger'
                          onClick={() => handleRemoveInformationForm(index)}
                        >
                          <span className='icon'>
                            <FontAwesomeIcon icon={faTrash} />
                          </span>
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              ))}
            </Form.Group>

            <Form.Group className='header-template mb-3'>
              <Form.Label className='fs-5'>Footer :</Form.Label>

              <Form.Control
                name='footer'
                as='textarea'
                value={emailForm.footer}
                onChange={(e) => emailFormHandler(e)}
              />
            </Form.Group>
          </Row>

          <div className='d-flex justify-content-center'>
            <Button variant='dark-danger' type='submit' onClick={() => handleCancel()}>
              Cancel
            </Button>

            <Button
              variant='dark-primary'
              type='submit'
              onClick={() => handleCreateEmailMessages()}
            >
              {isLoading ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {FormatEmailHO}
