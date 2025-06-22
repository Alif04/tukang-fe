import React, {FC, useState} from 'react'

import './NewCSI.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Form, Button, Row, Card} from 'react-bootstrap'

interface csi {
  name: string
  survey_link: string
  spreadsheets_link: string
  active: boolean
}

const NewCSIHO: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

  // Function Clear State After Submit
  const clear = () => {
    setCsiForm((prev) => ({
      ...prev,
      name: '',
      survey_link: '',
      spreadsheets_link: '',
      active: true,
    }))
  }

  // Handle Create CSI
  const handleCreateCSI = async () => {
    setIsLoading(true)

    await axios
      .post(`${apiUrl}/csi`, csiForm, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        if (response.data.status === 201) {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'Berhasil membuat formulir CSI',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            clear()
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
    <section id='new-csi'>
      <Card className='mb-5'>
        <Card.Body>
          <Row className='mb-5'>
            <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Judul :</Form.Label>

              <Form.Control name='name' value={csiForm.name} onChange={(e) => csiFormHandler(e)} />
            </Form.Group>

            <Form.Group className='form-template'>
              <Form.Label className='fs-5'>Link Survey ( Google Form ) :</Form.Label>

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
              onClick={() => handleCreateCSI()}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {NewCSIHO}
