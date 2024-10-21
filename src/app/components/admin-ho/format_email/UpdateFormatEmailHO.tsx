import React, {FC, useState, useEffect, KeyboardEventHandler} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './FormatEmailHO.css'

import axios from 'axios'
import {Image} from 'antd'
import Swal from 'sweetalert2'
import Select, {SingleValue} from 'react-select'
import CreatableSelect from 'react-select/creatable'
import {Form, Button, Row, Col, Card, ListGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFileImage, faImage, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons'

interface templateOption {
  value: number | null
  label: string
}

interface CSI {
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
  is_active: number | null
  title: string
  cc: string
  bcc: string
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

  // List CSI
  const [csiData, setCsiData] = useState<CSI[]>([])
  const [selectedCSI, setSelectedCSI] = useState<SingleValue<CSI>>({
    value: null,
    label: '',
  })

  // Status
  const [status, setStatus] = useState<StatusStorage[]>([])
  const [selectedStatus, setSelectedStatus] = useState<SingleValue<StatusStorage>>({
    value: null,
    label: '',
  })

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
    is_active: 1,
    title: '',
    cc: '',
    bcc: '',
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

  // File Header & Footer
  const [preview, setPreview] = useState<string>('')
  const [visible, setVisible] = useState(false)
  const [headerImage, setHeaderImage] = useState<File | null>(null)
  const [footerImage, setFooterImage] = useState<File | null>(null)
  const [images, setImages] = useState<{
    header: {blob: string; fileName: string}
    footer: {blob: string; fileName: string}
  }>({
    header: {blob: '', fileName: ''},
    footer: {blob: '', fileName: ''},
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
              csi_id: data?.csi_template?.id ?? null,
              email_type: data?.email_type,
              trigger_id: data?.trigger_id,
              is_active: data?.is_active === true ? 1 : 0,
              title: data?.title,
              cc: data?.cc,
              bcc: data?.bcc,
              welcome_header: data?.welcome_header,
              greetings: data?.greetings,
              footer: data?.footer,
            }))
          }

          if (data?.csi_template) {
            setSelectedCSI((prev: any) => ({
              ...prev,
              value: data?.csi_template?.id ?? null,
              label: data?.csi_template?.name ?? '',
            }))
          }

          if (data?.cc || data?.bcc) {
            setValueCC((prev) => [...prev, createOption(data?.cc)])
            setValueBCC((prev) => [...prev, createOption(data?.bcc)])
          }

          if (data?.terms_detail?.length >= 1) {
            setEmailForm((prev: any) => ({
              ...prev,
              terms_detail: data.terms_detail.map((item: any) => ({
                id: item.id,
                term: item?.terms,
              })),
            }))
          } else {
            setEmailForm((prev: any) => ({
              ...prev,
              terms_detail: [
                {
                  term: '',
                },
              ],
            }))
          }

          if (data?.information_detail?.length >= 1) {
            setEmailForm((prev: any) => ({
              ...prev,
              information_detail: data.information_detail.map((item: any) => ({
                id: item.id,
                information: item?.information,
              })),
            }))
          } else {
            setEmailForm((prev: any) => ({
              ...prev,
              terms_detail: [
                {
                  term: '',
                },
              ],
            }))
          }

          if (data?.email_type) {
            setSelectedEmailType((prev: any) => ({
              ...prev,
              value: data?.email_type,
            }))
          }

          if (data?.trigger_id) {
            setSelectedStatus((prev: any) => ({
              ...prev,
              value: data?.trigger?.id,
              label: data?.trigger?.description,
            }))
          }

          if (data?.email_message_image) {
            const documentTypes = [1, 2]
            type DocumentStateSetter = (state: {blob: string; fileName: string}) => void
            const documentStateSetters: Record<number, DocumentStateSetter> = {
              1: (image) =>
                setImages((prevState) => ({
                  ...prevState,
                  header: image,
                })),
              2: (image) =>
                setImages((prevState) => ({
                  ...prevState,
                  footer: image,
                })),
            }

            data.email_message_image.forEach((document: any) => {
              const {type, path} = document

              if (documentTypes.includes(type)) {
                const setter = documentStateSetters[type]

                if (setter) {
                  setter({
                    blob: '',
                    fileName: path,
                  })
                }
              }
            })
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

  const getCSI = async () => {
    try {
      const response = await axios.get(`${apiUrl}/csi?take=0`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (Array.isArray(response.data.data)) {
        const tempCSI = response.data.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        }))

        setCsiData(tempCSI)
      } else {
        console.error('API response data is not an array:', response.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    getCSI()
    getStatus()
    fetchEmailData()
  }, [])

  useEffect(() => {
    getEmailType()
  }, [selectedEmailType])

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
  const [inputCC, setInputCC] = React.useState('')
  const [valueCC, setValueCC] = React.useState<readonly Option[]>([])

  const [inputBCC, setInputBCC] = React.useState('')
  const [valueBCC, setValueBCC] = React.useState<readonly Option[]>([])

  const handleChangeCC: KeyboardEventHandler = (event) => {
    if (!inputCC) return
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setValueCC((prev) => [...prev, createOption(inputCC)])
        setInputCC('')
        event.preventDefault()
    }
  }

  const handleChangeBCC: KeyboardEventHandler = (event) => {
    if (!inputBCC) return
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setValueBCC((prev) => [...prev, createOption(inputBCC)])
        setInputBCC('')
        event.preventDefault()
    }
  }

  useEffect(() => {
    setEmailForm((prev) => ({
      ...prev,
      cc: valueCC.map((x) => x.value).join(', '),
      bcc: valueBCC.map((x) => x.value).join(', '),
    }))
  }, [valueCC, valueBCC])

  // File change handler with type
  const handleFileChange = (event: any, type: 'header' | 'footer') => {
    const files = event.target.files

    if (files && files[0]) {
      if (type === 'header') {
        setHeaderImage(files[0])
      } else if (type === 'footer') {
        setFooterImage(files[0])
      }

      setImages((prevImages) => ({
        ...prevImages,
        [type]: {
          blob: URL.createObjectURL(files[0]),
          fileName: files[0].name,
        },
      }))
    }
  }

  const handleImageHeader = (type: 'header' | 'footer') => {
    const inputClass = type === 'header' ? '.input-header-image' : '.input-footer-image'
    const inputField = document.querySelector(inputClass) as HTMLInputElement | null

    if (inputField) {
      inputField.click()
    }
  }

  const handleRemoveFile = (type: 'header' | 'footer') => {
    setImages((prevImages) => ({
      ...prevImages,
      [type]: {blob: '', fileName: ''},
    }))

    if (type === 'header') {
      setHeaderImage(null)
    } else if (type === 'footer') {
      setFooterImage(null)
    }
  }

  // Handle Update Email
  const handleUpdateEmailMessages = async () => {
    setIsLoading(true)

    const formData = new FormData()

    formData.append('email_type', String(emailForm.email_type))
    formData.append('title', emailForm.title)
    formData.append('trigger_id', String(emailForm.trigger_id))
    formData.append('cc', emailForm.cc)
    formData.append('bcc', emailForm.bcc)
    formData.append('welcome_header', emailForm.welcome_header)
    formData.append('greetings', emailForm.greetings)
    formData.append('footer', emailForm.footer)
    formData.append('is_active', String(emailForm.is_active))

    if (headerImage !== null) {
      formData.append('header_files', headerImage)
    }

    if (footerImage !== null) {
      formData.append('footer_files', footerImage)
    }

    emailForm.terms_detail.forEach((terms, index) => {
      if (terms.term !== '') {
        formData.append(`terms_detail[${index}][term]`, String(terms.term))
      }
    })

    emailForm.information_detail.forEach((informations, index) => {
      if (informations.information !== '') {
        formData.append(
          `information_detail[${index}][information]`,
          String(informations.information)
        )
      }
    })

    await axios
      .patch(`${apiUrl}/mails/${params.id}`, formData, {
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
            text: 'Berhasil Update Template Email',
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
                  label:
                    emailType.find((x: any) => x.value === selectedEmailType?.value)?.label ?? '',
                }}
                onChange={(newValue) => setSelectedEmailType(newValue)}
              />
            </Form.Group>

            {emailForm.csi_id !== null && (
              <Form.Group className='header-template mb-4'>
                <Form.Label className='fs-5'> Format Formulir CSI :</Form.Label>
                <Select
                  name='template_option'
                  className='form-control p-0'
                  classNamePrefix='select'
                  isSearchable={true}
                  placeholder='Pilih Judul Format'
                  options={csiData}
                  onChange={(newValue) => setSelectedCSI(newValue)}
                  value={{
                    value: selectedCSI?.value ?? null,
                    label: selectedCSI?.label ?? '',
                  }}
                />
              </Form.Group>
            )}

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

            <Form.Group className='header-template mb-4'>
              <Form.Label className='fs-5'>CC :</Form.Label>

              <CreatableSelect
                name='cc'
                components={{DropdownIndicator: null}}
                inputValue={inputCC}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={(newValue) => setValueCC(newValue)}
                onInputChange={(newValue) => setInputCC(newValue)}
                onKeyDown={handleChangeCC}
                placeholder='Tulis Email yang diinginkan lalu tekan enter'
                value={valueCC}
              />
            </Form.Group>

            <Form.Group className='header-template mb-4'>
              <Form.Label className='fs-5'>BCC :</Form.Label>

              <CreatableSelect
                name='bcc'
                components={{DropdownIndicator: null}}
                inputValue={inputBCC}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={(newValue) => setValueBCC(newValue)}
                onInputChange={(newValue) => setInputBCC(newValue)}
                onKeyDown={handleChangeBCC}
                placeholder='Tulis Email yang diinginkan lalu tekan enter'
                value={valueBCC}
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

            <Form.Group className='header-template'>
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

            <Form.Group controlId='formFile'>
              <Form.Label className='fs-5'>Gambar Header</Form.Label>
              <Form className='form-input-image' onClick={() => handleImageHeader('header')}>
                <Form.Control
                  type='file'
                  accept='image/*'
                  className='input-header-image'
                  hidden
                  onChange={(e) => handleFileChange(e, 'header')}
                />

                {images.header.blob ? (
                  <img
                    src={images.header.blob}
                    alt={images.header.fileName}
                    className='image-preview'
                  />
                ) : (
                  <div className='input-image-text'>
                    <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                    <p>Add File</p>
                  </div>
                )}
              </Form>

              <div className='uploaded-row'>
                <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                <span className='upload-content'>
                  <ListGroup.Item
                    key={images.header.fileName}
                    action
                    onClick={() => {
                      setPreview(images.header?.fileName)
                      setVisible(true)
                    }}
                  >
                    {images.header?.fileName}
                  </ListGroup.Item>
                </span>

                <FontAwesomeIcon
                  icon={faTrash}
                  size='sm'
                  color='#ed2b2a'
                  style={{cursor: 'pointer'}}
                  onClick={() => handleRemoveFile('header')}
                />
              </div>
            </Form.Group>

            <Form.Group controlId='formFile'>
              <Form.Label className='fs-5'>Gambar Footer</Form.Label>
              <Form className='form-input-image' onClick={() => handleImageHeader('footer')}>
                <Form.Control
                  type='file'
                  accept='image/*'
                  className='input-footer-image'
                  hidden
                  onChange={(e) => handleFileChange(e, 'footer')}
                />

                {images.footer.blob ? (
                  <img
                    src={images.footer.blob}
                    alt={images.footer.fileName}
                    className='image-preview'
                  />
                ) : (
                  <div className='input-image-text'>
                    <FontAwesomeIcon icon={faImage} color='#858585' size='2xl' />
                    <p>Add File</p>
                  </div>
                )}
              </Form>

              <div className='uploaded-row'>
                <FontAwesomeIcon icon={faFileImage} color='#858585' size='sm' />

                <span className='upload-content'>
                  <ListGroup.Item
                    key={images.footer.fileName}
                    action
                    onClick={() => {
                      setPreview(images.footer?.fileName)
                      setVisible(true)
                    }}
                  >
                    {images.footer?.fileName}
                  </ListGroup.Item>
                </span>

                <FontAwesomeIcon
                  icon={faTrash}
                  size='sm'
                  color='#ed2b2a'
                  style={{cursor: 'pointer'}}
                  onClick={() => handleRemoveFile('footer')}
                />
              </div>

              {preview && (
                <div>
                  <Image
                    key={preview}
                    width={200}
                    style={{display: 'none'}}
                    src={`${apiUrl}/public/mails-image/${preview}`}
                    preview={{
                      visible: visible,
                      src: `${apiUrl}/public/mails-image/${preview}`,
                      onVisibleChange: (value) => {
                        setVisible(value)
                      },
                    }}
                  />
                </div>
              )}
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
