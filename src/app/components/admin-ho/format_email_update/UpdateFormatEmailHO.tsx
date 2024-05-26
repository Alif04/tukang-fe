import React, {FC, useState, useEffect, KeyboardEventHandler} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './FormatEmailHO.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'
import CreatableSelect from 'react-select/creatable'
import {Form, Button, Row, Col, Card} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faTrash} from '@fortawesome/free-solid-svg-icons'

interface templateOption {
  value: number | null
  label: string
}

interface StatusStorage {
  value: number | null
  label: string
}

interface Option {
  label: string
  value: string
}

const createOption = (label: string) => ({
  label,
  value: label,
})

interface emailLayout {
  csi_id: number | null
  email_type: number | null
  trigger_id: number | null
  title: string
  // cc: string
  // bcc: string
  greetings: string
  footer: string
  welcome_header: string
  terms_detail: Array<{
    id: number | null
    term: string
  }>
  information_detail: Array<{
    id: number | null
    information: string
  }>
}

const UpdateFormatEmailHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Status
  const [status, setStatus] = useState<StatusStorage[]>([])
  const [selectedStatus, setSelectedStatus] = useState<SingleValue<StatusStorage>>({
    value: null,
    label: '',
  })

  console.log('selected Status', selectedStatus)

  // Email
  const [emailType, setEmailType] = useState<templateOption[]>([])
  const [selectedEmailType, setSelectedEmailType] = useState<SingleValue<templateOption>>({
    value: null,
    label: '',
  })

  const [emailForm, setEmailForm] = useState<emailLayout>({
    csi_id: null,
    email_type: null,
    trigger_id: null,
    title: '',
    // cc: '',
    // bcc: '',
    greetings: '',
    footer: '',
    welcome_header: '',
    terms_detail: [
      {
        id: null,
        term: '',
      },
    ],
    information_detail: [
      {
        id: null,
        information: '',
      },
    ],
  })

  // Fetch Data Email
  const fetchEmailData = async () => {
    try {
      await axios
        .get(`${apiUrl}/mails/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data

          if (data) {
            setEmailForm((prev) => ({
              ...prev,
              csi_id: data?.csi_id ?? null,
              email_type: data?.email_type,
              trigger_id: data?.trigger_id,
              title: data?.title,
              cc: data?.cc,
              bcc: data?.bcc,
              welcome_header: data?.welcome_header,
              greetings: data?.greetings,
              footer: data?.footer,
            }))
          }

          if (data?.terms_detail) {
            setEmailForm((prev: any) => ({
              ...prev,
              terms_detail: data.terms_detail.map((item: any) => ({
                id: item.id,
                term: item?.terms,
              })),
            }))
          }

          if (data?.information_detail) {
            setEmailForm((prev: any) => ({
              ...prev,
              information_detail: data.information_detail.map((item: any) => ({
                id: item.id,
                information: item?.information,
              })),
            }))
          }

          if (data?.email_type) {
            setSelectedEmailType((prev: any) => ({
              ...prev,
              value: data?.email_type,
              label: emailType.find((x: any) => x.value === data?.email_type)?.label,
            }))
          }

          if (data?.trigger_id) {
            setSelectedStatus((prev: any) => ({
              ...prev,
              value: data?.trigger_id,
              label: status.find((x: any) => x.value === data?.trigger_id)?.label,
            }))
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  const getStatus = async () => {
    try {
      const response = await axios.get(`${apiUrl}/status?take=0`, {
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempStatus = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.description,
        }))

        setStatus(tempStatus)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getEmailType = async () => {
    try {
      const response = await axios.get(`${apiUrl}/mails/types`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      let emailTypes = Object.entries(response.data.data).map(([key, value]) => ({
        label: key as string,
        value: value as number,
      }))

      setEmailType(emailTypes)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getStatus()
    getEmailType()
    fetchEmailData()
  }, [])

  // Change Select Status
  useEffect(() => {
    setEmailForm((prev) => ({
      ...prev,
      trigger_id: selectedStatus?.value ?? null,
    }))
  }, [selectedStatus])

  // Change Select Email Type
  useEffect(() => {
    setEmailForm((prev) => ({
      ...prev,
      email_type: selectedEmailType?.value ?? null,
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
      id: null,
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
      id: null,
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

  // Handler CC and BCC fields
  const [inputValue, setInputValue] = useState<string>('')
  const [ccValue, setCCValue] = useState<readonly Option[]>([])
  const [bccValue, setBCCValue] = useState<readonly Option[]>([])

  const handleKeyDown: KeyboardEventHandler = (e: any) => {
    if (!inputValue) return

    switch (e.key) {
      case 'Enter':
      case 'Tab':
        if (e.target.name === 'cc') {
          setCCValue((prev) => [...prev, createOption(inputValue)])
        } else {
          setBCCValue((prev) => [...prev, createOption(inputValue)])
        }
        setInputValue('')
        e.preventDefault()
        break
      default:
        break
    }
  }

  useEffect(() => {
    setEmailForm((prev) => ({
      ...prev,
      cc: ccValue.map((x) => x.value).join(', '),
      bcc: bccValue.map((x) => x.value).join(', '),
    }))
  }, [ccValue, bccValue])

  // Handle Update Email
  const handleUpdateEmailMessages = async () => {
    setIsLoading(true)

    const updatedTerms = emailForm.terms_detail.map((terms) => {
      if (terms.id === null) {
        const {id, ...termsWithoutId} = terms
        return termsWithoutId
      }
      return terms
    })

    const updatedInformations = emailForm.information_detail.map((information) => {
      if (information.id === null) {
        const {id, ...informationWithoutId} = information
        return informationWithoutId
      }
      return information
    })

    const emailForms = {
      ...emailForm,
      terms_detail: updatedTerms,
      information_detail: updatedInformations,
    }

    await axios
      .patch(`${apiUrl}/email-messages/${params.id}`, emailForms, {
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
            navigate(`/email/view-format-email`)
          })

          setIsLoading(false)
        } else {
          setIsLoading(false)

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
    navigate('/email/view-format-email')
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
                options={emailType}
                value={{
                  value: selectedEmailType?.value ?? null,
                  label: selectedEmailType?.label ?? '',
                }}
                onChange={(newValue) => setSelectedEmailType(newValue)}
              />
            </Form.Group>

            <Form.Group className='header-template mb-4'>
              <Form.Label className='fs-5'> Status :</Form.Label>
              <Select
                name='status'
                className='form-control p-0'
                classNamePrefix='select'
                isSearchable={true}
                placeholder='Pilih status yang ingin dikirimkan emailnya'
                options={status}
                value={{
                  value: selectedStatus?.value ?? null,
                  label: selectedStatus?.label ?? '',
                }}
                onChange={(newValue) => setSelectedStatus(newValue)}
              />
            </Form.Group>

            <Form.Group className='header-template mb-3'>
              <Form.Label className='fs-5'>Judul :</Form.Label>

              <Form.Control
                name='title'
                value={emailForm.title}
                onChange={(e) => emailFormHandler(e)}
              />
            </Form.Group>

            {/* <Form.Group className='header-template mb-4'>
              <Form.Label className='fs-5'>CC :</Form.Label>

              <CreatableSelect
                name='cc'
                components={{DropdownIndicator: null}}
                inputValue={inputValue}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={(newValue) => setCCValue(newValue)}
                onInputChange={(newValue) => setInputValue(newValue)}
                onKeyDown={handleKeyDown}
                placeholder='Tulis Email yang diinginkan lalu tekan enter'
                value={ccValue}
              />
            </Form.Group>

            <Form.Group className='header-template mb-4'>
              <Form.Label className='fs-5'>BCC :</Form.Label>

              <CreatableSelect
                name='bcc'
                components={{DropdownIndicator: null}}
                inputValue={inputValue}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={(newValue) => setBCCValue(newValue)}
                onInputChange={(newValue) => setInputValue(newValue)}
                onKeyDown={handleKeyDown}
                placeholder='Tulis Email yang diinginkan lalu tekan enter'
                value={bccValue}
              />
            </Form.Group> */}

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
              className='d-flex justify-content-center align-items-center'
              variant='dark-primary'
              type='submit'
              onClick={() => handleUpdateEmailMessages()}
            >
              {isLoading ? 'Updating...' : 'Update Template'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {UpdateFormatEmailHO}
