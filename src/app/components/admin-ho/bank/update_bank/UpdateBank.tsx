import React, {useState, useEffect, FC} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './UpdateBank.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Row, Col, Form, Button, Card} from 'react-bootstrap'

interface Bank {
  id: number | null
  bank_name: string
}

const UpdateBanks: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Bank
  const [bankInfo, setBankInfo] = useState<Bank>({
    id: null,
    bank_name: '',
  })

  // Fetch API Data
  useEffect(() => {
    const getBankData = async () => {
      try {
        await axios
          .get(`${apiUrl}/bank/find/${params.id}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              // 'Access-Control-Allow-Origin': '*',
             // 'ngrok-skip-browser-warning':  'true',
            },
          })
          .then((response) => {
            const data = response.data.data

            if (data) {
              setBankInfo((prev) => ({
                ...prev,
                id: data?.id,
                bank_name: data?.bank_name,
              }))
            }
          })
      } catch (error) {
        console.error(error)
      }
    }

    getBankData()
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

  const handleUpdateBankInfo = async () => {
    if (!bankValidation()) {
      return false
    }

    setIsLoading(true)
    await axios
      .post(`${apiUrl}/bank/${params.id}`, bankInfo, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        //  // 'Access-Control-Allow-Origin': '*',
        // // 'ngrok-skip-browser-warning':  'true',
        },
      })
      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          Swal.fire({
            title: 'Success',
            text: 'Success Update Store',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate(`/store/view-store`)
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
    <section id='update-bank'>
      <Card className='mb-5'>
        <Card.Body>
          <div className='form-wrapper'>
            <div className='form-update-bank'>
              <Row>
                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                  <Form.Group>
                    <Form.Label>Bank ID</Form.Label>
                    <Form.Control
                      name='id'
                      type='number'
                      readOnly
                      value={bankInfo.id ?? ''}
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
                      value={bankInfo.bank_name ?? ''}
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

            <Button variant='dark-primary' disabled={isLoading} onClick={handleUpdateBankInfo}>
              {isLoading ? 'Updating..' : 'Save Update'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  )
}

export {UpdateBanks}
