import React, {useState, useEffect, FC} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './UpdateDataMaster.css'

import axios from 'axios'
import Swal from 'sweetalert2'
import {Row, Col, Form, Button, Card} from 'react-bootstrap'

interface DataMaster {
  name:string
  value: number
}


const UpdateDataMaster: FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const params = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Bank
 const [dataMasterInfo, setDataMasterInfo] = useState<DataMaster>({
    name: '',
    value: 0,
  })

  // Fetch API Data
  useEffect(() => {
    const getBankData = async () => {
      try {
        await axios
          .get(`${apiUrl}/data-master/${params.id}`, {
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
              setDataMasterInfo((prev) => ({
                ...prev,
                value: data?.value,
                name: data?.name,
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
  const dataMasterFormHandler = (e: any) => {
    setDataMasterInfo((prevStoreInfo) => ({
      ...prevStoreInfo,
      [e.target.name]: e.target.value,
    }))
  }

  // Bank Validation
  const bankValidation = () => {
    let valid = true

    if (!dataMasterInfo.value) {
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
    const data = {
      value: Number(dataMasterInfo.value),
      name: dataMasterInfo.name,
    }
    setIsLoading(true)
    await axios
      .post(`${apiUrl}/data-master/${params.id}`, data, {
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
            text: 'Success Update Data Master',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate(`/data-master/view-data-master`)
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
    navigate('/data-master/view-data-master')
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
                   <Form.Label>Name</Form.Label>
                   
                                 <Form.Control
                                   name='name'
                                   type='text'
                                   value={dataMasterInfo.name}
                                   onChange={(e) => dataMasterFormHandler(e)}
                                 />
                  </Form.Group>
                 
                </Col>

                <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
                <Form.Group>
                    <Form.Label>Value</Form.Label>
                   
                                 <Form.Control
                                   name='value'
                                   type='number'
                                   placeholder='Silahkan isi value'
                                   value={dataMasterInfo.value}
                                   onChange={(e) => dataMasterFormHandler(e)}
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

export {UpdateDataMaster}
