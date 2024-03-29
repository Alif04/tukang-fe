import React, {FC, useState, useEffect} from 'react'

import './NewBank.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Form, Button, Card} from 'react-bootstrap'

interface Bank {
  id: number | null
  bank_name: string
}

const NewBank: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Bank
  const [bankInfo, setBankInfo] = useState<Bank>({
    id: null,
    bank_name: '',
  })

  // Fetch API Data
  useEffect(() => {
    const getStoreId = async () => {
      try {
        const response = await axios.get(`${apiUrl}/bank/next-code`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        console.log(response.data.data.code)

        if (response.status === 200) {
          const {data} = response
          setBankInfo((prev) => ({
            ...prev,
            id: data.data.code,
          }))
        }
      } catch (err) {
        console.error(err)
      }
    }

    getStoreId()
  }, [])

  // Bank Form Handler
  const bankInfoFormHandler = (e: any) => {
    setBankInfo((prevStoreInfo) => ({
      ...prevStoreInfo,
      [e.target.name]: e.target.value,
    }))
  }

  // Bank Validation
  const bankValidation = () => {
    let valid = true

    if (!bankInfo.bank_name) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill Nama Bank form',
        icon: 'error',
      })
      valid = false
    }
    return valid
  }

  const handleSubmitNewBank = async () => {
    if (!bankValidation()) {
      return false
    }

    setIsLoading(true)
    await axios
      .post(`${apiUrl}/bank`, bankInfo, {
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
            text: 'Success Add New Bank',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate(`/bank/view-bank`)
          })

          setIsLoading(false)
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          })

          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)

        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
        })
      })
  }

  const handleCancel = () => {
    navigate('/bank/view-bank')
  }

  return (
    <section id='new-bank'>
      <Card className='mb-5'>
        <Card.Body>
          <div className='form-wrapper'>
            <div className='form-new-bank'>
              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group>
                    <Form.Label>Bank ID</Form.Label>
                    <Form.Control
                      name='id'
                      type='number'
                      readOnly
                      value={bankInfo.id?.toString()}
                      onChange={(e) => bankInfoFormHandler(e)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group>
                    <Form.Label>Nama Bank</Form.Label>
                    <Form.Control
                      name='bank_name'
                      type='text'
                      onChange={(e) => bankInfoFormHandler(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>

          <div className='button-wrapper d-flex justify-content-center align-items-center'>
            <Button variant='dark-danger' onClick={handleCancel}>
              Cancel
            </Button>

            <Button variant='dark-primary' disabled={isLoading} onClick={handleSubmitNewBank}>
              {isLoading ? 'Saving..' : 'Save'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {NewBank}
