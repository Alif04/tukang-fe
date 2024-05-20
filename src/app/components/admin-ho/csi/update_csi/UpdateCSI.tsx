import React, {FC, useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './UpdateCSI.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Form, Button, Row, Card} from 'react-bootstrap'

interface csi {
  name: string
  survey_link: string
  spreadsheets_link: string
  active: boolean
}

const UpdateCSIHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch Data Email
  const fetchCSIData = async () => {
    try {
      await axios
        .get(`${apiUrl}/csi/${params.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const data = response.data.data.data

          if (data) {
            setCsiForm((prev) => ({
              ...prev,
              name: data?.name,
              survey_link: data?.survey_link,
              spreadsheets_link: data?.spreadsheets_link,
              active: data?.active,
            }))
          }
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCSIData()
  }, [])

  // CSI State
  const [csiForm, setCsiForm] = useState<csi>({
    name: '',
    survey_link: '',
    spreadsheets_link: '',
    active: true,
  })

  // CSI Form Handler
  const csiFormHandler = (e: any) => {
    setCsiForm({
      ...csiForm,
      [e.target.name]: e.target.value,
    })
  }

  // Checkbox Handler
  const handleCheckboxChange = (isChecked: boolean) => {
    setCsiForm({
      ...csiForm,
      active: isChecked,
    })
  }

  // Handle Update CSI
  const handleUpdateCSI = async () => {
    setIsLoading(true)

    await axios
      .post(`${apiUrl}/csi/${params.id}`, csiForm, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        if (response.data.statusCode === 200) {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'Success Update Format CSI',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate('/csi/format-pertanyaan-csi')
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

  return (
    <section id='update-csi'>
      <Card className='mb-5'>
        <Card.Body>
          <Row>
            <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Judul :</Form.Label>

              <Form.Control name='name' value={csiForm.name} onChange={(e) => csiFormHandler(e)} />
            </Form.Group>

            <Form.Group className='form-template'>
              <div className='d-flex justify-content-between'>
                <Form.Label className='fs-5'>Link Survey ( Google Form ) :</Form.Label>

                <Form.Check
                  inline
                  label='Active ?'
                  name='active'
                  type='checkbox'
                  checked={csiForm.active === true}
                  onChange={(e) => handleCheckboxChange(e.target.checked)}
                />
              </div>

              <Form.Control
                className='rich-text'
                name='survey_link'
                as='textarea'
                value={csiForm.survey_link}
                onChange={(e) => csiFormHandler(e)}
              />
            </Form.Group>

            <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Link Spreadsheets ( Hasil Google Form ) :</Form.Label>

              <Form.Control
                className='rich-text'
                name='spreadsheets_link'
                as='textarea'
                value={csiForm.spreadsheets_link}
                onChange={(e) => csiFormHandler(e)}
              />
            </Form.Group>
          </Row>

          <div className='d-flex justify-content-center'>
            <Button
              variant='dark-primary'
              type='submit'
              disabled={isLoading}
              onClick={() => handleUpdateCSI()}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {UpdateCSIHO}
